package utils

import (
	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
)

func DoesUserHasEmailQuota(id int) bool {
	count := databases.CountUserResetPasswordTokens(id)
	return count < constants.ResetPasswordMaxRetry
}
