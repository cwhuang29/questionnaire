package handlers

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/utils"
)

const (
	USER_OVERVIEW_FORM_DISPLAY_STATUS = "%s (%s)"
)

func getFormOverViewDisplayStatus(name string, t time.Time) string {
	formattedTime := fmt.Sprintf("%d-%02d-%02d %02d:%02d", t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute())
	return fmt.Sprintf(USER_OVERVIEW_FORM_DISPLAY_STATUS, name, formattedTime)
}

func transformUserToWebFormat(user models.User, formStatuses []models.FormStatus, forms []models.Form) (u User) {
	assignedNames := make([]string, len(formStatuses))
	fillOutNames := make([]string, 0)

	for idx, formStatus := range formStatuses {
		formName := forms[idx].FormName

		assignedNames[idx] = getFormOverViewDisplayStatus(formName, formStatus.AssignedAt)
		if utils.FormStatus(formStatus.Status).IsFinish() {
			fillOutNames = append(fillOutNames, getFormOverViewDisplayStatus(formName, *formStatus.FinishAt))
		}
	}

	u.Name = user.GetName()
	u.Email = user.Email
	u.CreatedAt = user.CreatedAt
	u.FillOutCount = len(fillOutNames)
	u.FillOutNames = fillOutNames
	u.AssignedCount = len(assignedNames)
	u.AssignedNames = assignedNames
	return
}

func transformFormToWebFormat(form models.Form) (f Form) {
	f.ResearchName = strings.Split(form.ResearchName, ",")
	f.FormName = form.FormName
	f.FormCustID = form.FormCustID
	f.MinScore = form.MinScore
	f.OptionsCount = form.OptionsCount
	_ = json.Unmarshal([]byte(form.FormTitle), &f.FormTitle)
	_ = json.Unmarshal([]byte(form.FormIntro), &f.FormIntro)
	_ = json.Unmarshal([]byte(form.Questions), &f.Questions)

	f.ID = form.ID
	f.Author = form.Author
	f.CreatedAt = form.CreatedAt
	f.UpdatedAt = form.UpdatedAt
	return
}

func transformFormToDBFormat(form Form, user models.User) (f models.Form) {
	formTitleBytes, _ := json.Marshal(form.FormTitle)
	formIntroBytes, _ := json.Marshal(form.FormIntro)
	questionsBytes, _ := json.Marshal(form.Questions)

	f.ResearchName = strings.Join(form.ResearchName, ",")
	f.FormName = form.FormName
	f.FormCustID = form.FormCustID
	f.MinScore = form.MinScore
	f.OptionsCount = form.OptionsCount
	f.FormTitle = string(formTitleBytes)
	f.FormIntro = string(formIntroBytes)
	f.Questions = string(questionsBytes)

	f.Author = user.GetName()
	f.AuthorID = user.ID
	f.AdminOnly = false
	return
}

func transformFormStatusToWebFormat(formStatus models.FormStatus, form models.Form, receiver, sender *models.User, createdAt *time.Time) (f FormStatus) {
	f.ID = formStatus.FormID
	f.Name = form.FormName
	f.WriterEmail = formStatus.WriterEmail
	f.AssignedAt = formStatus.AssignedAt
	f.Role = utils.RoleType(formStatus.Role).String()
	f.Status = utils.FormStatus(formStatus.Status).String()

	if receiver != nil {
		f.WriterName = receiver.GetName()
	}
	if sender != nil {
		f.EmailSender = sender.GetName()
	}
	// if createdAt != nil {
	//     f.EmailLastSentTime = createdAt
	// }
	// Same as above cause when there is no record, gorm returns an empty struct
	// Besides, time.Time is a struct which cannot have a nil value. It's "zero" value is: 0001-01-01 00:00:00 +0000 UTC
	f.EmailLastSentTime = *createdAt

	return
}

func transformFormAnswerToWebFormat(answer models.FormAnswer) (a Answer) {
	_ = json.Unmarshal([]byte(answer.Answers), &a.Answers)
	return
}

func transformFormAnswerToDBFormat(answer Answer, formID, userID, formStatusID int) (a models.FormAnswer) {
	answerBytes, _ := json.Marshal(answer.Answers)

	a.FormID = formID
	a.UserID = userID
	a.FormStatusID = formStatusID
	a.Answers = string(answerBytes)
	return a
}

func transformAssignFormToFormStatusDBFormat(id int, assignForm AssignForm) []models.FormStatus {
	dbFormStatus := make([]models.FormStatus, len(assignForm.Recipient))

	for idx, email := range assignForm.Recipient {
		dbFormStatus[idx].FormID = id
		dbFormStatus[idx].WriterEmail = email
		dbFormStatus[idx].Role = assignForm.Role
		dbFormStatus[idx].Status = int(utils.FormStatusAssign)
		dbFormStatus[idx].AssignedAt = assignForm.EffectiveTime // The time might be in future
	}
	return dbFormStatus
}

func transformEmailNotificationToNotificationHistory(emailNotification EmailNotification, formID int, senderEmail string, notificationType utils.NotificationType) []models.NotificationHistory {
	sender := databases.GetUserByEmail(senderEmail)

	dbNotificationHistory := make([]models.NotificationHistory, len(emailNotification.Recipient))
	for idx, email := range emailNotification.Recipient {
		dbNotificationHistory[idx].NotificationType = int(notificationType)
		dbNotificationHistory[idx].FormID = formID
		dbNotificationHistory[idx].SenderID = sender.ID
		dbNotificationHistory[idx].Receiver = email
	}
	return dbNotificationHistory
}

func transformEmailNotificationToPendingNotification(emailNotification EmailNotification, formID int, role utils.RoleType, senderEmail string, notificationType utils.NotificationType) []models.PendingNotification {
	sender := databases.GetUserByEmail(senderEmail)

	dbPendingNotification := make([]models.PendingNotification, len(emailNotification.Recipient))
	for idx, email := range emailNotification.Recipient {
		dbPendingNotification[idx].NotificationType = int(notificationType)
		dbPendingNotification[idx].Role = int(role)
		dbPendingNotification[idx].FormID = formID
		dbPendingNotification[idx].SenderID = sender.ID
		dbPendingNotification[idx].Receiver = email
		dbPendingNotification[idx].Content = emailNotification.Content
		dbPendingNotification[idx].Footer = emailNotification.Footer
		dbPendingNotification[idx].EffectiveTime = emailNotification.EffectiveTime
	}
	return dbPendingNotification
}

func articleFormatDBToOverview(article models.Article) (a Article) {
	a.ID = article.ID

	if len(article.Title) > constants.TitleSizeLimit {
		// Chinese words are about 1.8 times wider than English alphabets in title and subtitle
		a.Title = utils.DecodeRuneStringForFrontend(article.Title, constants.TitleSizeLimit, 1.78) + "&nbsp;..."
	} else {
		a.Title = article.Title
	}

	if len(article.Subtitle) > constants.SubtitleSizeLimit {
		a.Subtitle = utils.DecodeRuneStringForFrontend(article.Subtitle, constants.SubtitleSizeLimit, 1.78) + "&nbsp;..."
	} else {
		a.Subtitle = article.Subtitle
	}

	a.Date = article.ReleaseDate.String()
	a.Authors = strings.Split(article.Authors, ",")
	a.Category = strings.ToLower(article.Category) // Because router only accepts lower case path
	a.CoverPhoto = article.CoverPhoto              // The url of cover photo
	a.AdminOnly = article.AdminOnly

	a.Tags = []string{}
	for _, t := range article.Tags {
		a.Tags = append(a.Tags, t.Value)
	}

	if article.CoverPhoto != "" && len(article.Outline) > constants.OutlineSizeLimitWithCoverPhoto {
		a.Outline = utils.DecodeRuneStringForFrontend(article.Outline, constants.OutlineSizeLimitWithCoverPhoto, 2.15)
	} else if len(article.Outline) > constants.OutlineSizeLimit {
		a.Outline = utils.DecodeRuneStringForFrontend(article.Outline, constants.OutlineSizeLimit, 2.15)
	} else {
		a.Outline = article.Outline
	}

	return
}

func articleFormatDBToDetailed(article models.Article, parseMarkdown bool) (a Article) {
	a.Title = article.Title
	a.Subtitle = article.Subtitle
	a.Date = article.ReleaseDate.Format("2006-01-02")
	a.Authors = strings.Split(article.Authors, ",")
	a.Category = strings.ToLower(article.Category)
	a.Outline = article.Outline
	a.CoverPhoto = article.CoverPhoto
	a.AdminOnly = article.AdminOnly

	a.Tags = []string{} // Without initial, html template brokes (var tags = {{ .tags }};)
	for _, t := range article.Tags {
		a.Tags = append(a.Tags, t.Value)
	}

	if parseMarkdown {
		a.Content = utils.ParseMarkdownToHTML(article.Content)
	} else {
		a.Content = article.Content
	}

	return
}
