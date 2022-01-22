package handlers

import (
	"fmt"
	"strings"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/utils"
	"github.com/gin-gonic/gin"
)

func getURLPara(c *gin.Context, key string) string {
	param := c.Param(key)
	if strings.HasPrefix(param, "/") {
		param = param[1:]
	}
	return param
}

func getQueryPara(c *gin.Context, key string) string {
	return c.DefaultQuery(key, "")
}

func getParamFormID(c *gin.Context) (int, error) {
	return utils.Str2PosInt(getURLPara(c, constants.ParamFormID))
}

func getParamArticleID(c *gin.Context) (int, error) {
	return utils.Str2PosInt(getURLPara(c, constants.ParamFormID))
}

func getQueryArticleID(c *gin.Context) (int, error) {
	return utils.Str2PosInt(getQueryPara(c, constants.QueryArticleID))
}

func getQueryOffset(c *gin.Context) (int, error) {
	return utils.Str2Int(getQueryPara(c, constants.QueryOffset))
}

func getQueryLimit(c *gin.Context) (int, error) {
	return utils.Str2PosInt(getQueryPara(c, constants.QueryLimit))
}

func getQueryLiked(c *gin.Context) (int, error) {
	isLiked, err := utils.Str2Int(getQueryPara(c, constants.QueryLiked))
	if err != nil || (isLiked != 0 && isLiked != 1) {
		err = fmt.Errorf(constants.QueryLikedErr)
	}
	return isLiked, err
}

func getQueryBookmarked(c *gin.Context) (int, error) {
	isBookmarked, err := utils.Str2Int(getQueryPara(c, constants.QueryBookmarked))
	if err != nil || (isBookmarked != 0 && isBookmarked != 1) {
		err = fmt.Errorf(constants.QueryBookmarkedErr)
	}
	return isBookmarked, err
}
