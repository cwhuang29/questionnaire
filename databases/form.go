package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
)

func GetFormByID(id int, isAdmin bool) (form models.Form) {
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
		log.ErrorMsg(err.Error())
		return models.Form{}, err
	}

	return form, nil
}

func UpdateForm(form models.Form) (models.Form, error) {
	// When update with struct, GORM will only update non-zero fields. Use map type variable to update or Select() to specify fields to update
	f := map[string]interface{}{
		"author_id":     form.AuthorID,
		"author":        form.Author,
		"status":        form.Status,
		"admin_only":    form.AdminOnly,
		"research_name": form.ResearchName,
		"form_name":     form.FormName,
		"form_cust_id":  form.FormCustID,
		"min_score":     form.MinScore,
		"options_count": form.OptionsCount,
		"form_title":    form.FormTitle,
		"form_intro":    form.FormIntro,
		"questions":     form.Questions,
	}

	// Where clause can be omitted since form.ID is the primary key
	if err := db.Model(&form).Where("id = ?", form.ID).Updates(f).Error; err != nil {
		log.ErrorMsg(err.Error())
		return models.Form{}, err
	}

	return form, nil
}
