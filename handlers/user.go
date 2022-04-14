package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func UsersOverview(c *gin.Context) {
	allUsers := getAllUsers()
	c.JSON(http.StatusOK, gin.H{"data": allUsers})
	return
}
