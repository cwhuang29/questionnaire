package routers

import (
	"net/http"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/handlers"
	"github.com/cwhuang29/questionnaire/logger"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
)

var (
	log = logger.New("Middleware")
)

func AllowCORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://127.0.0.1:3000") // No slash in the end
		c.Header("Access-Control-Allow-Credentials", "true")             // To set cookies, frontend send requests with withCredentials = true // No slash in the en
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Accept,Authorization,Content-Type,Content-Length,Accept-Encoding,X-CSRF-Token,X-Questionnaire-Header")
		c.Header("Access-Control-Max-Age", "600")
		// After calling c.JSON(), headers are all set
		c.Next()
	}
}

// parse and validate token for six things:
// validationErrorMalformed        -> token is malformed
// validationErrorUnverifiable     -> token could not be verified because of signing problems
// validationErrorSignatureInvalid -> signature validation failed
// validationErrorExpired          -> exp validation failed
// validationErrorNotValidYet      -> nbf validation failed
// validationErrorIssuedAt         -> iat validation failed
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		claims, err := handlers.GetJWTClaimsFromHeader(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"errHead": constants.TryAgain, "errBody": err.Error()})
		}

		c.Set("email", claims.Email)
		c.Set("name", claims.Name)
		c.Set("role", claims.Role)
		c.Next()

		fields := map[string]interface{}{
			"method":  c.Request.Method,
			"url":     c.Request.URL.String(),
			"status":  c.Writer.Status(),
			"latency": time.Since(t),
			"email":   claims.Email,
			"name":    claims.Name,
			"role":    utils.RoleType(claims.Role).String(),
		}
		log.Info(fields)
	}
}

func AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		email := c.MustGet("email").(string)
		role := c.MustGet("role").(int)

		// if !utils.RoleType(role).IsValid() { // TODO For develop only
		if !utils.RoleType(role).IsAdmin() {
			// If use JSON(), handler functions will be triggered subsequentlly
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"errHead": constants.GeneralErr, "errBody": constants.PermissionDenied})
		}

		c.Next()

		fields := map[string]interface{}{
			"method":  c.Request.Method,
			"url":     c.Request.URL.String(),
			"status":  c.Writer.Status(),
			"latency": time.Since(t),
			"email":   email,
		}
		log.Info(fields)
	}
}

func CSRFProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		csrfHeaders := c.Request.Header["X-Csrf-Token"]
		csrfToken, _ := c.Cookie(constants.CookieCSRFToken)

		if len(csrfHeaders) != 1 || csrfToken == "" || csrfHeaders[0] != csrfToken {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"errHead": constants.GeneralErr, "errBody": constants.PermissionDenied})
		}
	}
}
