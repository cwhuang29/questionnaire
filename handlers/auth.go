package handlers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/logger"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/cwhuang29/questionnaire/utils/validator"
	"github.com/gin-gonic/gin"
)

var (
	log = logger.New("Handler")
)

func HandlePreflight(c *gin.Context) {
	c.String(http.StatusOK, "success")
}

func Me(c *gin.Context) {
	email := c.MustGet("email").(string)
	name := c.MustGet("name").(string)
	role := c.MustGet("role").(int)

	user := databases.GetUser(email)
	c.JSON(http.StatusOK, gin.H{
		"email":     email,
		"name":      name,
		"role":      role,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}

func RegisterV2(c *gin.Context) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errHead": err.Error(), "errBody": constants.TryAgain})
		return
	}

	invalids := validator.ValidateRegisterForm(newUser)
	if len(invalids) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": invalids})
		return
	}

	if tmp := databases.GetUser(newUser.Email); tmp.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"errHead": constants.EmailOccupied, "errBody": ""})
		return
	}

	if databases.IsAdminUser(newUser.Email) {
		newUser.Role = int(utils.Admin)
	}

	hashedPwd, err := utils.HashPassword(newUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	newUser.Password = string(hashedPwd)
	_, res := databases.InsertUser(newUser)
	if !res {
		c.JSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	c.JSON(http.StatusCreated, gin.H{})
}

func LogoutV2(c *gin.Context) {
	c.JSON(http.StatusResetContent, gin.H{})
}

func LoginV2(c *gin.Context) {
	body := Login{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"inputFormatInvalid": true, "errHead": err.Error(), "errBody": constants.TryAgain})
		return
	}

	invalids := validator.ValidateLoginForm(body.Email, body.Password)
	if len(invalids) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"inputFormatInvalid": false, "errTags": invalids})
		return
	}

	var user models.User
	user = databases.GetUser(body.Email)
	if user.ID == 0 {
		c.JSON(http.StatusForbidden, gin.H{"inputFormatInvalid": false, "errHead": constants.UserNotFound, "errBody": constants.TryAgain})
		return
	}

	err := utils.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"inputFormatInvalid": false, "errHead": constants.PasswordIncorrect, "errBody": constants.TryAgain})
		return
	}

	token, err := utils.GenerateJWTToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// c.Header("Location", constants.URLLandingPage)
	// c.SetCookie(constants.CookieAuthToken, token, constants.AuthTokenAge, "/", "", false, true)
	if utils.RoleType(user.Role).IsAdmin() {
		c.SetCookie(constants.CookieIsAdmin, user.Email, constants.LoginMaxAge, "/", "", false, false)
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}
