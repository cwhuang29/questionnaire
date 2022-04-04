package handlers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
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

func DeleteFormStatus(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	// bodyStr, _ := ioutil.ReadAll(c.Request.Body) // string(x): {"payload":{"email":"hcw1719@gmail.com"}}
	var json = struct{ Payload struct{ Email string } }{}
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": constants.TryAgain})
		return
	}

	email := json.Payload.Email
	// user := databases.GetUserByEmail(email)
	// When a user be assigned a form, he/she may not had registered yet
	// if user.ID == 0 {
	//     c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": constants.UserNotFound})
	//     return
	// }

	dbFormStatus := databases.GetFormStatusByFormIdAndWriterEmail(id, email, true)
	if dbFormStatus.ID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	if err := databases.DeleteFormStatus(dbFormStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": err.Error()})
		return
	}

	if utils.IsFuture(dbFormStatus.AssignedAt, 0) {
		if err := databases.DeletePendingNotificationByFormStatus(dbFormStatus); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": err.Error()})
			return
		}
	}

	// if user.ID != 0 {
	//     if err := databases.DeleteFormAnswerByFormIDAndUserID(id, user.ID); err != nil {
	//         c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": err.Error()})
	//         return
	//     }
	// }

	title := constants.FormStatusDeleteSucceed
	content := "You can now reassign this user with same/different roles"
	c.JSON(http.StatusOK, gin.H{"title": title, "content": content})
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
		title := "There is no new assignee. Please check your email list again"
		c.JSON(http.StatusOK, gin.H{"title": title})
		return
	}

	dbFormStatus := createNewFormAssignRecords(id, assignForm)
	if _, err := insertFormStatusToDb(dbFormStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.FormStatusCreateErr, "errBody": constants.DatabaseErr})
		return
	}

	email := c.MustGet("email").(string)
	sendImmediately := isNotificaionEffectImmediately(assignForm)
	if sendImmediately {
		if err = SendRemindWritingFormByEmail(id, email, assignForm.EmailNotification); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.EmailSentErr, "errBody": err.Error()})
			return
		}

		title := constants.EmailsHaveSent
		content := "All emails that have been assigned before were ignored"
		c.JSON(http.StatusOK, gin.H{"title": title, "content": content})
	} else {
		if err := storeFutureNotification(id, role, email, assignForm.EmailNotification); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.ReloadAndRetry, "errBody": err.Error()})
			return
		}

		title := constants.EmailsWillBeSend
		c.JSON(http.StatusOK, gin.H{"title": title})
	}
}
