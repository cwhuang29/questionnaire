package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/sirupsen/logrus"
)

func GetFormById(id int, isAdmin bool) (form models.Form) {
	db.Where("id = ?", id).First(&form)
	return
	// db.Preload("Tags").Where("id = ?", id).First(&form)
	// if isAdmin == false && form.AdminOnly == true {
	//     form = models.Form{}
	// }
	// return
}

func GetAllForms(isAdmin bool) (forms []models.Form) {
	switch isAdmin {
	case true:
		db.Order("id desc").Find(&forms)
	case false:
		db.Order("id desc").Where("admin_only = ?", false).Find(&forms)
	}
	return
}

func GetSameResearchForm(category string, offset, limit int, isAdmin bool) (articles []models.Article) {
	switch isAdmin {
	case true:
		db.Preload("Tags").Order("id desc").Limit(limit).Offset(offset).Where("category = ?", category).Find(&articles)
	case false:
		db.Preload("Tags").Order("id desc").Limit(limit).Offset(offset).Where("category = ? and admin_only = ?", category, false).Find(&articles)
	}
	return
}

func InsertForm(form models.Form) (models.Form, error) {
	if err := db.Create(&form).Error; err != nil {
		logrus.Error(err.Error())
		return models.Form{}, err
	}

	return form, nil
}
