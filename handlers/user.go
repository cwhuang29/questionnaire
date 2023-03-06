package handlers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/gin-gonic/gin"
)

func UsersOverview(c *gin.Context) {
	allUsers := getAllUsers()
	c.JSON(http.StatusOK, gin.H{"data": allUsers})
	return
}

func DeleteUser(c *gin.Context) {
	// bodyStr, _ := ioutil.ReadAll(c.Request.Body) // string(x): {"payload":{"email":"abc@gmail.com"}}
	var json = struct{ Payload struct{ Email string } }{}
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": constants.PayloadIncorrect, "errBody": constants.TryAgain})
		return
	}

	err := databases.DeleteUser(json.Payload.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": err.Error()})
		return
	}

	title := constants.UserDeleteSucceed
	c.JSON(http.StatusOK, gin.H{"title": title})
}
