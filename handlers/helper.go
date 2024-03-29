package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func isUserAdmin(c *gin.Context) bool {
	status, _ := GetUserStatus(c)
	return status >= IsAdmin
}

func GetUserStatus(c *gin.Context) (status UserStatus, user models.User) {
	cookieEmail, _ := c.Cookie(constants.CookieLoginEmail) // If no such cookie, c.Cookie() returns empty string with error `named cookie not present`
	cookieToken, _ := c.Cookie(constants.CookieLoginToken)
	adminEmail, _ := c.Cookie(constants.CookieIsAdmin)

	memberOrAdmin := IsMember
	if adminEmail != "" && cookieEmail == adminEmail && databases.IsAdminUser(adminEmail) {
		memberOrAdmin = IsAdmin
	}

	user = databases.GetUserByEmail(cookieEmail)
	creds := databases.GetLoginCredentials(user.ID)
	for _, cred := range creds {
		isEpr := utils.IsExpired(cred.LastLogin, cred.MaxAge)
		if cookieEmail == cred.User.Email && cookieToken == cred.Token && !isEpr {
			status = memberOrAdmin
			return
		}
	}

	cookieEmail = ""
	return
}

func fetchData(types, query string, offset, limit int, isAdmin bool) (articleList []Article, err error) {
	var dbFormatArticles []models.Article

	switch types {
	case "time":
		// For the first time, load the weekly articles (all articles in the latest 7 days)
		if offset == 0 {
			today := time.Now().UTC().Truncate(24 * time.Hour)
			sevenDaysAgo := today.AddDate(0, 0, -7)
			tomorrow := today.AddDate(0, 0, 1)
			dbFormatArticles = databases.GetArticlesInATimePeriod(sevenDaysAgo, tomorrow, isAdmin)
		} else {
			dbFormatArticles = databases.GetArticles(offset, limit, isAdmin)
		}
	case "tag":
		dbFormatArticles = databases.GetSameTagArticles(query, offset, limit, isAdmin)
		for i := 0; i < len(dbFormatArticles); i++ {
			dbFormatArticles[i].Tags = databases.GetArticleTags(dbFormatArticles[i])
		}
	case "category":
		dbFormatArticles = databases.GetSameCategoryArticles(query, offset, limit, isAdmin)
	}

	articleList = make([]Article, len(dbFormatArticles))
	for i, a := range dbFormatArticles {
		articleList[i] = articleFormatDBToOverview(a)
	}
	return
}

func generateFileName(fileType string) string {
	fileID := time.Now().UTC().Format("20060102150405") + utils.GetUUID()
	fileExt := fileType[strings.LastIndex(fileType, "/")+1:]
	return constants.UploadImageDir + fileID + "." + fileExt // Do not start with "./" otherwise the images URL in articles content will be incorrect
}

func mapFilesName(content string, fileNamesMapping map[string]string) string {
	for key := range fileNamesMapping {
		content = strings.Replace(content, key, fileNamesMapping[key], -1)
	}

	return content
}

func saveFile(c *gin.Context, file *multipart.FileHeader, fileName string) (err error) {
	err = c.SaveUploadedFile(file, fileName)
	if err != nil {
		log.ErrorMsg("Create article error when saving images: ", err)
	}
	return
}

func checkFileSize(fileSize int64) bool {
	return fileSize <= int64(constants.FileMaxSize)
}

func checkFileType(fileType, mainType string) bool {
	for _, t := range acceptedFileType[mainType] {
		if fileType == t {
			return true
		}
	}
	return false
}

func getUser(email string) models.User {
	return databases.GetUserByEmail(email)
}

func getAllUsers() []User {
	dbUsers := databases.GetAllUsers()

	users := make([]User, len(dbUsers))
	for i, u := range dbUsers {
		dbFormStatus := databases.GetFormStatusByUserEmail(u.Email, true)
		dbForms := getFormsByFormStatuses(dbFormStatus)
		users[i] = transformUserToWebFormat(u, dbFormStatus, dbForms)
	}

	return users
}
func getAllForms() []Form {
	dbForms := databases.GetAllForms(true)

	forms := make([]Form, len(dbForms))
	// var forms []Form // If dbForms is empty, this will return null to frontend
	for i, f := range dbForms {
		forms[i] = transformFormToWebFormat(f)
	}

	return forms
}

func getFormByID(id int) Form {
	dbForm := databases.GetFormByID(id, true)
	form := transformFormToWebFormat(dbForm)
	return form
}

func getFormListByIDList(ids []int) []Form {
	dbForms := databases.GetFormsByIDs(ids, true)

	forms := make([]Form, len(dbForms))
	for idx, dbForm := range dbForms {
		forms[idx] = transformFormToWebFormat(dbForm)
	}
	return forms
}

func getFormStatusByFormID(formID int) []FormStatus {
	dbFormStatus := databases.GetFormStatusByFormID(formID, true)
	form := databases.GetFormByID(formID, true)

	formStatus := make([]FormStatus, len(dbFormStatus))
	for i, f := range dbFormStatus {
		receiver := databases.GetUserByEmail(f.WriterEmail)

		var createdAt *time.Time = new(time.Time)
		var sender *models.User = new(models.User)

		if utils.IsFuture(f.AssignedAt, 0) {
			pendingNotification := databases.GetPendingNotificationByTypeAndFormIdAndReceiver(int(utils.NotificationEmail), formID, f.WriterEmail, true)
			*sender = databases.GetUser(pendingNotification.SenderID)
		} else {
			notificationHistory := databases.GetNotificationHistoryByTypeAndFormIdAndReceiverAndResult(int(utils.NotificationEmail), formID, f.WriterEmail, true)
			if notificationHistory.ID != 0 {
				*createdAt = notificationHistory.CreatedAt
				*sender = databases.GetUser(notificationHistory.SenderID)
			}
		}
		formStatus[i] = transformFormStatusToWebFormat(f, form, &receiver, sender, createdAt)
	}

	return formStatus
}

func getNotFinishFormStatusByUser(email string) []FormStatus {
	status := []int{int(utils.FormStatusAssign), int(utils.FormStatusInProgress)}
	dbFormStatus := databases.GetFormStatusByWriterEmailAndStatus(email, status, true)

	formStatus := make([]FormStatus, 0)
	for _, f := range dbFormStatus {
		if utils.IsFuture(f.AssignedAt, 0) {
			continue
		}
		form := databases.GetFormByID(f.FormID, true)
		formStatus = append(formStatus, transformFormStatusToWebFormat(f, form, nil, nil, nil))
	}

	return formStatus
}

func extractParticularRoleInForm(form Form, role utils.RoleType) Form {
	var filteredForm Form
	var formTitle FormInfoByRole
	var formIntro FormInfoByRole
	var questions FormQuestion

	if role.IsStudent() {
		formTitle = FormInfoByRole{Student: form.FormTitle.Student}
		formIntro = FormInfoByRole{Student: form.FormIntro.Student}
		questions = FormQuestion{Student: form.Questions.Student}
	} else if role.IsParent() {
		formTitle = FormInfoByRole{Parent: form.FormTitle.Parent}
		formIntro = FormInfoByRole{Parent: form.FormIntro.Parent}
		questions = FormQuestion{Parent: form.Questions.Parent}
	} else if role.IsTeacher() {
		formTitle = FormInfoByRole{Teacher: form.FormTitle.Teacher}
		formIntro = FormInfoByRole{Teacher: form.FormIntro.Teacher}
		questions = FormQuestion{Teacher: form.Questions.Teacher}
	} else if role.IsCounseling() {
		formTitle = FormInfoByRole{Counseling: form.FormTitle.Counseling}
		formIntro = FormInfoByRole{Counseling: form.FormIntro.Counseling}
		questions = FormQuestion{Counseling: form.Questions.Counseling}
	}

	filteredForm.ID = form.ID
	filteredForm.Author = form.Author
	filteredForm.ResearchName = form.ResearchName
	filteredForm.FormName = form.FormName
	filteredForm.FormCustID = form.FormCustID
	filteredForm.MinScore = form.MinScore
	filteredForm.OptionsCount = form.OptionsCount
	filteredForm.FormTitle = formTitle
	filteredForm.FormIntro = formIntro
	filteredForm.Questions = questions

	return filteredForm
}

func setFormStatusToStart(formID int, user models.User) (models.FormStatus, error) {
	now := time.Now()

	dbFormStatus := databases.GetFormStatusByFormIdAndWriterEmail(formID, user.Email, true)
	dbFormStatus.Status = int(utils.FormStatusInProgress)
	dbFormStatus.StartAt = &now

	err := databases.UpdateFormStatus(dbFormStatus)
	return dbFormStatus, err
}

func setFormStatusToFinish(formID int, user models.User) (models.FormStatus, error) {
	now := time.Now()

	dbFormStatus := databases.GetFormStatusByFormIdAndWriterEmail(formID, user.Email, true)
	dbFormStatus.Status = int(utils.FormStatusFinish)
	dbFormStatus.FinishAt = &now

	err := databases.UpdateFormStatus(dbFormStatus)
	return dbFormStatus, err
}

func getFormStatusByFormIDAndWriterEmail(formID int, email string) FormStatus {
	dbFormStatus := databases.GetFormStatusByFormIdAndWriterEmail(formID, email, true)
	form := databases.GetFormByID(formID, true)

	receiver := databases.GetUserByEmail(dbFormStatus.WriterEmail)

	var createdAt *time.Time
	var sender *models.User
	if utils.IsFuture(dbFormStatus.AssignedAt, 0) {
		pendingNotification := databases.GetPendingNotificationByTypeAndFormIdAndReceiver(int(utils.NotificationEmail), formID, dbFormStatus.WriterEmail, true)
		*sender = databases.GetUser(pendingNotification.SenderID)
	} else {
		notificationHistory := databases.GetNotificationHistoryByTypeAndFormIdAndReceiverAndResult(int(utils.NotificationEmail), formID, dbFormStatus.WriterEmail, true)
		if notificationHistory.ID != 0 {
			*createdAt = notificationHistory.CreatedAt
			*sender = databases.GetUser(notificationHistory.SenderID)
		}
	}

	formStatus := transformFormStatusToWebFormat(dbFormStatus, form, &receiver, sender, createdAt)
	return formStatus
}

func getAnswerForm(form Form, user models.User, role utils.RoleType) (Form, error) {
	form = extractParticularRoleInForm(form, role)
	return form, nil
}

func getFormsByFormStatuses(formStatuses []models.FormStatus) []models.Form {
	formIDs := make([]int, len(formStatuses))

	for idx, formStatus := range formStatuses {
		formIDs[idx] = formStatus.FormID
	}
	return databases.GetFormsByIDs(formIDs, true)
}

func getFormsByFormAnswers(formAnswers []models.FormAnswer) []models.Form {
	formIDs := make([]int, len(formAnswers))

	for idx, formAnswer := range formAnswers {
		formIDs[idx] = formAnswer.FormID
	}
	return databases.GetFormsByIDs(formIDs, true)
}

func insertFormToDb(form models.Form) (int, error) {
	form, err := databases.InsertForm(form)
	return form.ID, err
}

func updateFormToDb(form models.Form) (int, error) {
	form, err := databases.UpdateForm(form)
	return form.ID, err
}

func insertFormStatusToDb(formStatus []models.FormStatus) ([]models.FormStatus, error) {
	formStatus, err := databases.InsertFormStatus(formStatus)
	return formStatus, err
}

func createNewFormAssignRecords(id int, assignForm AssignForm) []models.FormStatus {
	dbFormStatus := transformAssignFormToFormStatusDBFormat(id, assignForm)
	return dbFormStatus
}

func parseUploadForm(form Form, user models.User) models.Form {
	dbForm := transformFormToDBFormat(form, user)
	return dbForm
}

func parseJSONForm(c *gin.Context) (Form, error) {
	var form Form
	var err error

	// Note: the error "EOF" occurs when reading from the Request Body twice (e.g. c.GetRawData(), c.Request.Body)
	err = c.ShouldBindBodyWith(&form, binding.JSON)
	return form, err
}

func parseJSONAssignForm(c *gin.Context) (AssignForm, error) {
	var assignForm AssignForm
	var err error

	err = c.ShouldBindBodyWith(&assignForm, binding.JSON)
	return assignForm, err
}

func parseJSONEmailNotification(c *gin.Context) (EmailNotification, error) {
	var emailNotification EmailNotification
	var err error

	err = c.ShouldBindBodyWith(&emailNotification, binding.JSON)
	return emailNotification, err
}

func parseJSONExportFormIds(c *gin.Context) (ExportFormIds, error) {
	var exportFormIds ExportFormIds

	err := c.ShouldBindBodyWith(&exportFormIds, binding.JSON)
	return exportFormIds, err
}

func editFormPreprocessing(c *gin.Context) (Form, models.User, error) {
	email := c.MustGet("email").(string)
	form, err := parseJSONForm(c)
	user := getUser(email)

	return form, user, err
}

func markAnswerFormPreprocessing(c *gin.Context) (Answer, error) {
	var answer Answer

	if err := c.ShouldBindJSON(&answer); err != nil {
		return Answer{}, err
	}
	return answer, nil
}

func getFormAnswerByFormID(formID int) []Answer {
	dbFormAnswer := databases.GetFormAnswerByFormID(formID, true)

	formAnswer := make([]Answer, len(dbFormAnswer))
	for idx, f := range dbFormAnswer {
		formAnswer[idx] = transformFormAnswerToWebFormat(f)
	}
	return formAnswer
}

func storeAnswerToDB(formID int, user models.User, answer Answer) error {
	dbFormStatus := databases.GetFormStatusByFormIdAndWriterEmail(formID, user.Email, true)
	dbFormAnswer := transformFormAnswerToDBFormat(answer, formID, user.ID, dbFormStatus.ID)
	err := databases.InsertFormAnswerAndRemoveExisting(dbFormAnswer)
	return err
}

func getFormResultByFormID(formID int) FormResult {
	form := getFormByID(formID)
	dbFormAnswer := databases.GetFormAnswerByFormID(formID, true)
	return composeFormResult(form, dbFormAnswer)
}

func composeFormResult(form Form, dbFormAnswer []models.FormAnswer) FormResult {
	formResultItems := make([]FormResultItem, 0)

	for _, f := range dbFormAnswer {
		user := databases.GetUser(f.UserID)
		if user.ID == 0 {
			// Currently, delete a user does not delete associated form_answers records (likely to change in future)
			continue
		}

		formResultItem := FormResultItem{}
		formStatus := databases.GetFormStatusByFormIdAndWriterEmail(form.ID, user.Email, true)
		questions := getFormQuestionsBaesdOnRole(form, utils.RoleType(formStatus.Role))
		ans := make([]string, len(questions))

		_ = json.Unmarshal([]byte(f.Answers), &ans)
		answer := Answer{Answers: ans}

		formResultItem.Name = user.GetName()
		formResultItem.Email = user.Email
		formResultItem.Role = utils.RoleType(formStatus.Role).String()
		formResultItem.AnswerTime = f.CreatedAt

		if len(questions) == 0 {
			// TODO if admin remove questions of a specific role but some users with that role had filled out, website should popup warnings
			formResultItem.Score = -1
		} else {
			formResultItem.Score = getFormScore(questions, form.MinScore, answer)
			formResultItem.Answer = getDisplayedAnswer(questions, form.MinScore, answer)
		}
		formResultItems = append(formResultItems, formResultItem)
	}

	formResult := FormResult{
		FormCustID:        form.FormCustID,
		MaxQuestionsCount: getMaxQuestionsCountOfAForm(form.Questions),
		FormLastUpdatedAt: form.UpdatedAt,
		Results:           formResultItems,
	}
	return formResult
}

func removeDuplicateEmail(emailNotification EmailNotification) EmailNotification {
	emailNotification.Recipient = utils.RemoveDuplicateStrings(emailNotification.Recipient)
	return emailNotification
}

// Remove users who have been assigned to this form before
func removeDuplicateAssign(id int, assignForm AssignForm) AssignForm {
	dbFormStatus := databases.GetFormStatusByFormID(id, true)

	hasAssignedEmail := make([]string, len(dbFormStatus))
	for idx, f := range dbFormStatus {
		hasAssignedEmail[idx] = f.WriterEmail
	}

	recipients := make([]string, 0)
	for _, r := range assignForm.Recipient {
		if !utils.Include(hasAssignedEmail, r) {
			recipients = append(recipients, r)
		}
	}
	assignForm.Recipient = recipients
	return assignForm
}

func notificationPreprocessing(formId int, senderEmail string, emailNotification EmailNotification) []models.NotificationHistory {
	dbNotificationHistory := transformEmailNotificationToNotificationHistory(emailNotification, formId, senderEmail, utils.NotificationEmail)
	return dbNotificationHistory
}

func notificationPostprocessing(dbNotificationHistory []models.NotificationHistory, failedEmails []string) []models.NotificationHistory {
	for idx := range dbNotificationHistory {
		if !utils.Include(failedEmails, dbNotificationHistory[idx].Receiver) {
			dbNotificationHistory[idx].Result = true
		}
	}
	return dbNotificationHistory
}

func SendRemindWritingFormByEmail(formId int, senderEmail string, emailNotification EmailNotification) error {
	dbNotificationHistory := notificationPreprocessing(formId, senderEmail, emailNotification)
	databases.InsertNotificationHistory(dbNotificationHistory)

	failedEmails, ok := sendNotificaionToRemindWritingForm(emailNotification)
	if !ok {
		total := len(emailNotification.Recipient)
		fail := len(failedEmails)
		log.ErrorMsg("Sent notification emails failed. Total: ", total, ". Failed: ", fail, ". Operator: ", senderEmail, ". Form Id: ", formId)

		errText := fmt.Sprintf("Failed emails: %s", failedEmails)
		return errors.New(errText)
	}

	dbNotificationHistory = notificationPostprocessing(dbNotificationHistory, failedEmails)
	databases.UpdateNotificationHistory(dbNotificationHistory)

	emailSize := len(emailNotification.Subject) + len(emailNotification.Content) + len(emailNotification.Footer)
	fields := map[string]interface{}{
		"function":    utils.GetFunctionName(),
		"operator":    senderEmail,
		"formId":      formId,
		"email count": len(emailNotification.Recipient),
		"email title": emailNotification.Subject,
		"email  size": emailSize,
	}
	log.Info(fields)

	return nil
}

func storeFutureNotification(formId int, role utils.RoleType, senderEmail string, emailNotification EmailNotification) error {
	dbPendingNotification := transformEmailNotificationToPendingNotification(emailNotification, formId, role, senderEmail, utils.NotificationEmail)
	_, err := databases.InsertPendingNotifications(dbPendingNotification)
	return err
}

func getFormQuestionsBaesdOnRole(form Form, role utils.RoleType) []Question {
	questions := make([]Question, 0)
	if role.IsStudent() {
		questions = form.Questions.Student
	} else if role.IsParent() {
		questions = form.Questions.Parent
	} else if role.IsTeacher() {
		questions = form.Questions.Teacher
	} else if role.IsCounseling() {
		questions = form.Questions.Counseling
	}
	return questions
}

func getFormScore(questions []Question, minScore int, answer Answer) int {
	score := 0
	for idx, ans := range answer.Answers {
		if !questions[idx].IsMultipleChoice {
			continue // Short description questions are not evaluated
		}
		// ans is the index of the option (start from zero)
		ansInt, _ := strconv.Atoi(ans)
		if questions[idx].IsReverseGrading {
			score += (questions[idx].MaxScore - (ansInt + minScore))
		} else {
			score += (ansInt + minScore)
		}
	}
	return score
}

func getDisplayedAnswer(questions []Question, minScore int, answer Answer) Answer {
	for idx, ans := range answer.Answers {
		if !questions[idx].IsMultipleChoice {
			continue
		}
		val := ""
		// ans is the index of the option (start from zero)
		ansInt, _ := strconv.Atoi(ans)
		if questions[idx].IsReverseGrading {
			val = strconv.Itoa(questions[idx].MaxScore - (ansInt + minScore))
		} else {
			val = strconv.Itoa(ansInt + minScore)
		}
		answer.Answers[idx] = val
	}
	return answer
}

func getMaxQuestionsCountOfAForm(questions FormQuestion) int {
	maxQuestionsCount := 0
	if len(questions.Student) > maxQuestionsCount {
		maxQuestionsCount = len(questions.Student)
	}
	if len(questions.Parent) > maxQuestionsCount {
		maxQuestionsCount = len(questions.Parent)
	}
	if len(questions.Teacher) > maxQuestionsCount {
		maxQuestionsCount = len(questions.Teacher)
	}
	if len(questions.Counseling) > maxQuestionsCount {
		maxQuestionsCount = len(questions.Counseling)
	}
	return maxQuestionsCount
}

func getFormResultsByFormIDs(ids []int) []FormResult {
	formResults := make([]FormResult, len(ids))

	for idx, id := range ids {
		formResults[idx] = getFormResultByFormID(id)
	}
	return formResults
}

func isNotificaionEffectImmediately(assignForm AssignForm) bool {
	return !utils.IsFuture(assignForm.EffectiveTime, constants.NotificationSendTimeEpsilon)
}

func deleteFormStatusAndResult(formId int, email string) error {
	formStatus := databases.GetFormStatusByFormIdAndWriterEmail(formId, email, true)
	if formStatus.ID == 0 {
		msg := fmt.Sprintf("Email \"%s\" not found in form ID \"%d\"", email, formId)
		log.ErrorMsg(msg)
		return errors.New(msg)
	}

	user := databases.GetUserByEmail(email) // When a users assigned a form, they may not had registered yet
	isFuture := utils.IsFuture(formStatus.AssignedAt, 0)
	if err := databases.DeleteFormStatusAndResultAndPendingNotification(user, formStatus, isFuture); err != nil {
		return err
	}
	return nil
}
