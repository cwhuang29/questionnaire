package handlers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/gin-gonic/gin"
)

func GetFormResult(c *gin.Context) {
	id, err := getParamFormID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryFormIDErr, "errBody": constants.TryAgain})
		return
	}

	formResult := getFormResultByFormID(id)
	c.JSON(http.StatusOK, gin.H{"data": formResult})
}
