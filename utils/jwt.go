package utils

import (
	"github.com/cwhuang29/questionnaire/constants"
	"github.com/golang-jwt/jwt"
)

func GetJWTSecretKeyFromConfig(secret string) []byte {
	return []byte(secret)
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
