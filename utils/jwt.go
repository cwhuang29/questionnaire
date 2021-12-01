package utils

import (
	"strconv"
	"time"

	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/golang-jwt/jwt"
)

type JWTClaim struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  int    `json:"role"`
	jwt.StandardClaims
}

func GetJWTSecretKeyFromConfig() []byte {
	return []byte(config.GetCopy().JWT.Secret)
}

func GenerateJWTToken(user models.User) (string, error) {
	now := time.Now()
	claims := JWTClaim{
		Email: user.Email,
		Name:  user.GetName(),
		Role:  user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: now.Add(24 * time.Hour).Unix(),
			Id:        user.Email + strconv.FormatInt(now.Unix(), 10),
			IssuedAt:  now.Unix(),
			NotBefore: 0,
		},
	}
	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tokenClaims.SignedString(GetJWTSecretKeyFromConfig())
}

func GetJWTErrMsg(err error) string {
	message := constants.JWTUnknown

	if ve, ok := err.(*jwt.ValidationError); ok {
		if ve.Errors&jwt.ValidationErrorMalformed != 0 {
			message = constants.JWTValidationErrorMalformed
		} else if ve.Errors&jwt.ValidationErrorUnverifiable != 0 {
			message = constants.JWTValidationErrorUnverifiable
		} else if ve.Errors&jwt.ValidationErrorSignatureInvalid != 0 {
			message = constants.JWTValidationErrorSignatureInvalid
		} else if ve.Errors&jwt.ValidationErrorExpired != 0 {
			message = constants.JWTValidationErrorExpired
		} else if ve.Errors&jwt.ValidationErrorNotValidYet != 0 {
			message = constants.JWTValidationErrorNotValidYet
		}
	}
	return message
}
