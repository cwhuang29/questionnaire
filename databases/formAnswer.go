package databases

import "github.com/cwhuang29/questionnaire/databases/models"

func GetFormAnswerByFormID(formID int, isAdmin bool) (formAnswer []models.FormAnswer) {
	db.Where("form_id = ?", formID).Find(&formAnswer)
	return
}

func GetFormAnswerByFormIDAndUserID(formID, userID int, isAdmin bool) (formAnswer models.FormAnswer) {
	db.Where("form_id = ? and user_id = ?", formID, userID).Last(&formAnswer)
	return
}

func DeleteFormAnswer(formAnswer models.FormAnswer) error {
	return db.Delete(&formAnswer).Error
	// db.Delete(models.FormAnswer{}, formAnswer.ID)
	// db.Exec("DELETE FROM from_status WHERE id = " + formAnswer.ID)
}

func DeleteFormAnswerByFormIDAndUserID(formID, userID int) error {
	// This is a batch delete since the values don't have primary key
	if err := db.Where("form_id = ? and user_id = ?", formID, userID).Delete(&models.FormAnswer{}).Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}

func InsertFormAnswer(formAnswer models.FormAnswer) (models.FormAnswer, error) {
	if err := db.Create(&formAnswer).Error; err != nil {
		log.ErrorMsg(err.Error())
		return models.FormAnswer{}, err
	}

	return formAnswer, nil
}
