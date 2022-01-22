package handlers

import (
	"errors"
	"strings"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func IsAdminUser(user models.User) bool {
	// Alternative: verify by JWT token
	return user.ID != 0 && utils.RoleType(user.Role).IsAdmin()
}

func IsAdminUserByHeader(c *gin.Context) bool {
	JWTClaims, err := GetJWTClaimsFromHeader(c)
	if err != nil {
		return false
	}

	role := utils.RoleType(JWTClaims.Role)
	return utils.RoleType(role).IsAdmin()
}

func GetJWTClaimsFromHeader(c *gin.Context) (*utils.JWTClaim, error) {
	auth := c.GetHeader("Authorization")
	tokens := strings.Split(auth, "Bearer ")

	if len(tokens) < 2 {
		return &utils.JWTClaim{}, errors.New(constants.JWTPayloadMalformed)
	}

	token := tokens[1]
	tokenClaims, err := jwt.ParseWithClaims(token, &utils.JWTClaim{}, func(token *jwt.Token) (i interface{}, err error) {
		// if someErrorOccurs { return nil, customizedErr }
		return utils.GetJWTSecretKeyFromConfig(), nil
	})
	if err != nil {
		return &utils.JWTClaim{}, errors.New(utils.GetJWTErrMsg(err))
	}

	claims, ok := tokenClaims.Claims.(*utils.JWTClaim)
	if !ok || claims.Email == "" || !utils.RoleType(claims.Role).IsValid() || !tokenClaims.Valid {
		return &utils.JWTClaim{}, errors.New(constants.JWTPayloadMalformed)
	}

	return claims, nil
}
