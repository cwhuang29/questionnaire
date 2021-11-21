package routers

import (
	"net/http"
	"strings"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/handlers"
	"github.com/cwhuang29/questionnaire/logger"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var (
	log = logger.New("Middleware")
)

func CSRFProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		csrfHeaders := c.Request.Header["X-Csrf-Token"]
		csrfToken, _ := c.Cookie(constants.CookieCSRFToken)

		if len(csrfHeaders) != 1 || csrfToken == "" || csrfHeaders[0] != csrfToken {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"errHead": constants.GeneralErr, "errBody": constants.PermissionDenied})
		}
	}
}

func AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		userStatus, _ := handlers.GetUserStatus(c)
		if userStatus < handlers.IsAdmin {
			status := http.StatusUnauthorized
			if userStatus == handlers.IsMember {
				status = http.StatusForbidden
			}
			// If use JSON(), handler functions will be triggered subsequentlly
			c.AbortWithStatusJSON(status, gin.H{"errHead": constants.GeneralErr, "errBody": constants.PermissionDenied})
		}

		c.Next()

		cookieEmail, _ := c.Cookie(constants.CookieLoginEmail)
		fields := map[string]interface{}{
			"method":  c.Request.Method,
			"url":     c.Request.URL.String(),
			"status":  c.Writer.Status(),
			"latency": time.Since(t),
			"email":   cookieEmail,
		}
		log.Info(fields)
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
		auth := c.GetHeader("Authorization")
		token := strings.Split(auth, "Bearer ")[1]

		tokenClaims, err := jwt.ParseWithClaims(token, &utils.JWTClaim{}, func(token *jwt.Token) (i interface{}, err error) {
			// if someErrorOccurs { return nil, customizedErr }
			return jwtSecret, nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": utils.GetJWTErrMsg(err)})
			return
		}

		claims, ok := tokenClaims.Claims.(*utils.JWTClaim)
		if ok && tokenClaims.Valid && claims.Email != "" && claims.Role != "" {
			c.Set("email", claims.Email)
			c.Set("name", claims.Name)
			c.Set("role", claims.Role)
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": constants.JWTPayloadMalformed})
			return
		}

		fields := map[string]interface{}{
			"method":  c.Request.Method,
			"url":     c.Request.URL.String(),
			"status":  c.Writer.Status(),
			"latency": time.Since(t),
			"email":   claims.Email,
			"name":    claims.Name,
			"role":    claims.Role,
		}
		log.Info(fields)
	}
}
