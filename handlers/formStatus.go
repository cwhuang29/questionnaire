package handlers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
)

func GetTodoForms(c *gin.Context) {
	email := c.MustGet("email").(string)
	formStatus := getNotFinishFormStatusByUser(email)
	c.JSON(http.StatusOK, gin.H{"data": formStatus})
}

func GetFormStatus(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	formStatus := getFormStatusByFormID(id)
	c.JSON(http.StatusOK, gin.H{"data": formStatus})
}

func DeleteFormStatusAndResult(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	// bodyStr, _ := ioutil.ReadAll(c.Request.Body) // string(x): {"payload":{"email":"abc@gmail.com"}}
	var json = struct{ Payload struct{ Email string } }{}
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": constants.TryAgain})
		return
	}

	err = deleteFormStatusAndResult(id, json.Payload.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": err.Error()})
		return
	}

	title := constants.FormStatusDeleteSucceed
	c.JSON(http.StatusOK, gin.H{"title": title})
}

func CreateFormStatus(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	assignForm, err := parseJSONAssignForm(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": err.Error()})
		return
	}

	role := utils.RoleType(assignForm.Role)
	if !role.IsValid() {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect})
		return
	}

	assignForm.EmailNotification = removeDuplicateEmail(assignForm.EmailNotification)
	assignForm = removeDuplicateAssign(id, assignForm)
	if len(assignForm.Recipient) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.NoNewAssignee})
		return
	}

	dbFormStatus := createNewFormAssignRecords(id, assignForm)
	if _, err := insertFormStatusToDb(dbFormStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.FormStatusCreateErr, "errBody": constants.DatabaseErr})
		return
	}

	if assignForm.EmailNotification.Subject == "" {
		title := constants.EmailWillNotSendWhileAssign
		c.JSON(http.StatusOK, gin.H{"title": title})
		return
	}

	sdrEmail := c.MustGet("email").(string)
	sendImmediately := isNotificaionEffectImmediately(assignForm)
	if sendImmediately {
		if err = SendRemindWritingFormByEmail(id, sdrEmail, assignForm.EmailNotification); err != nil {
			// Even if the emails did not send out successfully, the users are still assigned
			c.JSON(http.StatusOK, gin.H{"errHead": constants.EmailSentErr, "errBody": err.Error()})
			return
		}

		title := constants.EmailHaveSent
		content := "All emails that have been assigned before were ignored"
		c.JSON(http.StatusOK, gin.H{"title": title, "content": content})
	} else {
		if err := storeFutureNotification(id, role, sdrEmail, assignForm.EmailNotification); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.ReloadAndRetry, "errBody": err.Error()})
			return
		}

		title := constants.EmailWillBeSend
		c.JSON(http.StatusOK, gin.H{"title": title})
	}
}
