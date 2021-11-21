package utils

import (
	"github.com/cwhuang29/questionaire/constants"
	"github.com/cwhuang29/questionaire/databases"
)

func DoesUserHasEmailQuota(id int) bool {
	count := databases.CountUserResetPasswordTokens(id)
	return count < constants.ResetPasswordMaxRetry
}
