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
	formStatus := getFormStatusByUser(email)
	c.JSON(http.StatusOK, gin.H{"data": formStatus})
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
	c.JSON(http.StatusOK, gin.H{"data": filteredForm})
}

func GetFormStatus(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	formStatus := getFormStatusByID(id)
	c.JSON(http.StatusOK, gin.H{"data": formStatus})
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

	dbFormStatus := createNewFormAssignRecords(id, assignForm)
	if len(dbFormStatus) == 0 {
		title := "There is no new assignee. Please check your email list again"
		c.JSON(http.StatusOK, gin.H{"title": title})
		return
	}

	if _, err := insertFormStatusToDb(dbFormStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.FormStatusCreateErr, "errBody": constants.DatabaseErr})
		return
	}

	email := c.MustGet("email").(string)
	emailNotification := assignForm.EmailNotification
	if err = remindWritingFormByEmail(id, email, emailNotification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.EmailSentErr, "errBody": err.Error()})
		return
	}

	title := constants.EmailsHaveSent
	content := "Note: all emails that have been assigned before were ignored"
	c.JSON(http.StatusOK, gin.H{"title": title, "content": content})
}
