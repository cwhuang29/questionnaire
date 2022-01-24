package handlers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/utils/validator"
	"github.com/gin-gonic/gin"
)

var (
	acceptedFileType = map[string][]string{"image": {"image/png", "image/jpeg", "image/gif", "image/webp", "image/apng"}}
)

func writeFromLog(form models.Form, message string) {
	fields := map[string]interface{}{
		"ID":          form.ID,
		"Author ID":   form.AuthorID,
		"Form name":   form.FormName,
		"Form CustID": form.FormCustID,
	}
	log.Info(fields)
}

/*
 * Notice: Even though I have renamed the files (in the 3rd argument of JS formData.append API), Filenames can't be trusted
 * fmt.Println("filename:", file.Filename, "size:", file.Size, "header:", file.Header)
 * filename: d5821d5a77.png size: 5387170 header: map[Content-Disposition:[form-data; name="uploadImages"; filename="d5821d5a77.png"] Content-Type:[image/png]]
 */
func checkFileAndRename(file *multipart.FileHeader) (fileName string, err error) {
	if ok := checkFileSize(file.Size); !ok {
		err = fmt.Errorf("File size of %v is too large (max: 8MB per image)!", file.Filename)
		return
	}

	fileType := file.Header.Get("Content-Type")
	if ok := checkFileType(fileType, "image"); !ok {
		err = fmt.Errorf("File type of %v is not permitted!", file.Filename)
		return
	}

	fileName = generateFileName(fileType)
	return

}

func getImagesInContent(files []*multipart.FileHeader) (fileNames []string, fileNamesMapping map[string]string, err error) {
	var fileName string
	fileNames = make([]string, len(files))
	fileNamesMapping = make(map[string]string, len(files))

	for i, file := range files {
		if fileName, err = checkFileAndRename(file); err != nil {
			return
		}

		fileNames[i] = fileName
		fileNamesMapping[file.Filename] = fileName[len("public/"):] // Get rid of the prefix since we truncate it in router.Static()
	}
	return
}

func getCoverPhoto(file *multipart.FileHeader) (coverPhotoName string, err error) {
	if coverPhotoName, err = checkFileAndRename(file); err != nil {
		return
	}

	// writeFileLog(coverPhotoName, strconv.FormatInt(file.Size, 10), file.Header.Get("Content-Type"))
	return
}

func saveFilesFromForm(c *gin.Context, files map[string][]*multipart.FileHeader) (fileNamesMapping map[string]string, coverPhotoURL string, err error) {
	defer func() {
		if err := recover(); err != nil {
			log.ErrorMsg("Error occurred when retrieving files from the input form: ", err)
		}
	}()

	var coverPhotoName string
	var coverPhoto *multipart.FileHeader

	if len(files["coverPhoto"]) > 0 {
		coverPhoto = files["coverPhoto"][0] // There is only one cover photo
		if coverPhotoName, err = getCoverPhoto(coverPhoto); err != nil {
			return
		}
	}

	var fileNames []string
	contentImages := files["contentImages"]

	if fileNames, fileNamesMapping, err = getImagesInContent(contentImages); err != nil {
		return
	}

	// All files were retrieved. Start saving them

	if coverPhoto != nil { // User may not upload cover photo
		_ = saveFile(c, coverPhoto, coverPhotoName)
		coverPhotoURL = coverPhotoName[len("public/"):]
	}

	for i, name := range fileNames {
		if err = saveFile(c, contentImages[i], name); err != nil {
			return
		}
	}

	return
}

func getValuesFromForm(c *gin.Context, formVal map[string][]string) (*models.Article, error) {
	defer func() {
		if err := recover(); err != nil {
			log.ErrorMsg("Create article error when retrieving values from form: ", err)
		}
	}()

	date, err := time.Parse("2006-01-02", formVal["date"][0])
	if err != nil {
		return nil, err
	}

	auths := strings.Join(formVal["authors"], ",")

	tags := []models.Tag{}
	if formVal["tags"][0] != "" {
		formTags := strings.Split(formVal["tags"][0], ",") // JS's form.append() transformed array to a comma seperated string
		tags = make([]models.Tag, len(formTags))
		for i, t := range formTags {
			tags[i].Value = strings.TrimSpace(t)
		}
	}

	adminOnly, err := strconv.ParseBool(formVal["adminOnly"][0])
	if err != nil {
		return nil, err
	}

	return &models.Article{
		AdminOnly:   adminOnly,
		Title:       strings.TrimSpace(formVal["title"][0]), // If the form does not contain "title" field, the array's value extraction will panic
		Subtitle:    strings.TrimSpace(formVal["subtitle"][0]),
		ReleaseDate: date,
		Authors:     auths,
		Category:    formVal["category"][0],
		Tags:        tags,
		Outline:     formVal["outline"][0],
		Content:     formVal["content"][0],
	}, nil
}

func handleForm(c *gin.Context) (newArticle *models.Article, invalids map[string]string, err error) {
	var form *multipart.Form

	form, err = c.MultipartForm() // form: &{map[authors:[Jasia] category:[Medication] ... title:[abcde]] map[uploadImages:[0xc0001f91d0 0xc0001f8000]]}
	if err != nil {
		return
	}

	newArticle, err = getValuesFromForm(c, form.Value)
	if err != nil {
		return
	}
	if newArticle.Title == "" {
		err = fmt.Errorf("Error occurred when extracting values from form.")
		return
	}

	invalids = validator.ValidateArticleForm(newArticle)
	if len(invalids) != 0 {
		return
	}

	fileNamesMapping, coverPhotoURL, err := saveFilesFromForm(c, form.File)
	if err != nil {
		return
	}

	newArticle.Content = mapFilesName(newArticle.Content, fileNamesMapping)
	newArticle.CoverPhoto = coverPhotoURL

	return
}

func Forms(c *gin.Context) {
	// id := c.Param("formId") // "/v2/form/*formId" -> equals to "/3"
	// id := c.Param("formId") // "/v2/form/:formId" -> equals to "3"

	isSpecific := c.FullPath() == "/v2/form/:formId"
	if isSpecific == false {
		allForms := getAllForms()
		c.JSON(http.StatusOK, gin.H{"data": allForms})
		return
	}

	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	form := getFormByID(id)
	c.JSON(http.StatusOK, gin.H{"data": form})
}

func CreateForm(c *gin.Context) {
	form, user, err := editFormPreprocessing(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.FormCreateErr, "errBody": err.Error()})
		return
	} else if user.ID == 0 {
		c.JSON(http.StatusForbidden, gin.H{"errHead": constants.PermissionDenied, "errBody": constants.JWTValidationErrorExpired})
		return
	}

	dbForm := parseUploadForm(form, user)
	dbFormID, err := insertFormToDb(dbForm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.FormCreateErr, "errBody": constants.DatabaseErr})
		return
	}

	succeedMsg := constants.FormCreateSucceed
	writeFromLog(dbForm, succeedMsg)
	c.JSON(http.StatusCreated, gin.H{"title": succeedMsg, "formId": dbFormID})
}

func UpdateForm(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil})
		return
	}

	form, user, err := editFormPreprocessing(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.FormUpdateErr, "errBody": err.Error()})
		return
	} else if user.ID == 0 {
		c.JSON(http.StatusForbidden, gin.H{"errHead": constants.PermissionDenied, "errBody": constants.JWTValidationErrorExpired})
		return
	}

	dbForm := parseUploadForm(form, user)
	dbForm.ID = id

	dbFormID, err := updateFormToDb(dbForm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.FormUpdateErr, "errBody": constants.DatabaseErr})
		return
	}

	succeedMsg := constants.FormUpdateSucceed
	writeFromLog(dbForm, succeedMsg)
	c.JSON(http.StatusCreated, gin.H{"title": succeedMsg, "formId": dbFormID})
}

func GetAnswerForm(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	email := c.MustGet("email").(string)
	form := getFormByID(id)
	user := databases.GetUserByEmail(email)
	filteredForm := getAnswerForm(form, user)
	if filteredForm.ID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	_, ok := setFormStatusToStart(id, user)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": filteredForm})
}

func MarkAnswerForm(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	answer, err := markFormPreprocessing(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": constants.TryAgain})
		return
	}

	email := c.MustGet("email").(string)
	user := databases.GetUserByEmail(email)

	if _, err := storeAnswerToDB(id, user, answer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.TryAgain})
	}

	dbFormStatus, ok := setFormStatusToFinish(id, user)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	form := getFormByID(id)
	score := getFormScore(form, dbFormStatus, answer)
	c.JSON(http.StatusOK, gin.H{"data": score})
}

func RemindWritingForm(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	emailNotification, err := parseJSONEmailNotification(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": err.Error()})
		return
	}

	emailNotification = removeDuplicateEmail(emailNotification)

	email := c.MustGet("email").(string)
	if err = remindWritingFormByEmail(id, email, emailNotification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.EmailSentErr, "errBody": err.Error()})
		return
	}

	title := constants.EmailsHaveSent
	c.JSON(http.StatusOK, gin.H{"title": title})
}
