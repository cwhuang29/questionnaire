package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
)

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

func DeleteFormAnswerByFormIDAndUserID(formID, userID int) error {
	// This is a batch delete since the values don't have primary key
	if err := db.Where("form_id = ? and user_id = ?", formID, userID).Delete(&models.FormAnswer{}).Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}

func InsertFormAnswer(formAnswer models.FormAnswer) error {
	if err := db.Create(&formAnswer).Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}

func InsertFormAnswerAndRemoveExisting(formAnswer models.FormAnswer) error {
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if tx.Error != nil {
		return tx.Error
	}

	if err := tx.Where("form_id = ? and user_id = ?", formAnswer.FormID, formAnswer.UserID).Delete(&models.FormAnswer{}).Error; err != nil {
		tx.Rollback()
		log.ErrorMsg(err.Error())
		return err
	}
	if err := tx.Create(&formAnswer).Error; err != nil {
		tx.Rollback()
		log.ErrorMsg(err.Error())
		return err
	}

	if err := tx.Commit().Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}
