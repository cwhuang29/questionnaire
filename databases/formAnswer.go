package databases

import "github.com/cwhuang29/questionnaire/databases/models"

func GetFormAnswersByUserID(userID int) (formAnswers []models.FormAnswer) {
	db.Where("user_id = ?", userID).Find(&formAnswers)
	return
}

func GetFormAnswersByFormIDs(formIDs []int, isAdmin bool) (formAnswers []models.FormAnswer) {
	db.Where("form_id IN ?", formIDs).Find(&formAnswers)
	// db.Find(&formAnswers, formIDs)
	return
}

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
