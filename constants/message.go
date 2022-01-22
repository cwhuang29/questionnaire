package constants

const (
	GeneralErr    = "Error"
	UnexpectedErr = "Oops, this is unexpected"

	PermissionDenied = "You are not allowed to perform this action"

	PayloadIncorrect = "Your request data is not valid"

	TryAgain       = "Please try again"
	ReloadAndRetry = "Please reload the page and try again"
	GobackAndRetry = "Go back to previous page and try again"
	TryTooOften    = "You are trying too often"

	UserNotFound = "User Not Found"

	DatabaseErr = "An error occurred while writing to DB"

	LoginFirst = "You need to login first"
	LoginTo    = "Login to %s"

	PasswordIncorrect = "Password incorrect"

	FormNotFound      = "Form Not Found"
	FormCreateErr     = "Create Form Failed"
	FormUpdateErr     = "Update Form Failed"
	FormDeleteErr     = "Delete Form Failed"
	FormCreateSucceed = "Create a new form successfully"
	FormUpdateSucceed = "Update a new form successfully"

	FormStatusCreateErr = "Failed to assign form to users"

	QueryErr        = "Invalid Parameter"
	QueryEmptyErr   = "Parameter %s can not be empty"
	QueryMissingErr = "Some values are missing"
	QueryFormIDErr  = "Parameter formId should be a positive integer"

	QueryArticleIDErr  = "Parameter articleId should be a positive integer"
	QueryOffsetErr     = "Parameter offset should be a non-negative integer"
	QueryLimitErr      = "Parameter limit should be a positive integer"
	QueryBookmarkedErr = "Parameter bookmarked should be either 0 or 1"
	QueryLikedErr      = "Parameter liked should be either 0 or 1"

	EmailNotFound         = "Email Not Found"
	EmailOccupied         = "This email is already registered"
	EmailChangeAnother    = "Please use another email"
	EmailOpenAgain        = "Please reopen the link from email"
	EmailLinkExpired      = "The link has expired"
	EmailOutdated         = "Perhaps you didn't open the latest email"
	EmailRequestAgain     = "Please request a reset password email again"
	EmailIsAddressCorrect = "Did you fill in the correct email address?"
	EmailTryLater         = "Please try again in one hour"
	EmailHasSent          = "Email has been sent"
	EmailsHaveSent        = "Emails have been sent"
	EmailSentErr          = "Some emails did not successfully send out"

	JWTValidationErrorMalformed        = "Token is malformed"
	JWTValidationErrorUnverifiable     = "Token could not be verified because of signing problems"
	JWTValidationErrorSignatureInvalid = "Signature validation failed"
	JWTValidationErrorExpired          = "Login session expired. You have to relogin" // Token is expired
	JWTValidationErrorNotValidYet      = "Token is not yet valid before sometime"
	JWTPayloadMalformed                = "You have to relogin"
	JWTUnknown                         = "Can not handle this token"

	EnumTypeErr = "Invalid type of %s"
)
