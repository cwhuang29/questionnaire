package handlers

import (
	"fmt"
	"net/http"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
)

/*
 * 0: User doesn't like this article
 * 1: User has liked this article
 */

func getQueryLiked(c *gin.Context) (int, error) {
	isLiked, err := utils.Str2Int(getQueryPara(c, constants.QueryLiked))
	if err != nil || (isLiked != 0 && isLiked != 1) {
		err = fmt.Errorf(constants.QueryLikedErr)
	}
	return isLiked, err
}

func Like(c *gin.Context) {
	id, err := getParamArticleID(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryErr, "errBody": constants.QueryArticleIDErr})
		return
	}

	userStatus, user := GetUserStatus(c)
	if userStatus < IsMember {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"errHead": constants.LoginFirst, "errBody": ""})
		return
	}

	isLiked := databases.GetLikeStatus(user.ID, id)
	c.JSON(http.StatusOK, gin.H{"isLiked": isLiked})
}

func UpdateLike(c *gin.Context) {
	id, err := getParamArticleID(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errHead": constants.QueryErr, "errBody": constants.QueryArticleIDErr})
		return
	}

	isLiked, err := getQueryLiked(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	userStatus, user := GetUserStatus(c)
	if userStatus < IsMember {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"errHead": constants.LoginFirst, "errBody": ""})
		return
	}

	if ok := databases.UpdateLikeStatus(user.ID, id, isLiked); !ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"errHead": constants.UnexpectedErr, "errBody": constants.ReloadAndRetry})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isLiked": isLiked})
}
