package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
)

func DeleteFormStatusAndResultAndPendingNotification(user models.User, formStatus models.FormStatus, isFuture bool) error {
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if tx.Error != nil {
		return tx.Error
	}

	// Delete form status
	if err := tx.Delete(&formStatus).Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}

	// Delete pending notification if any
	if isFuture {
		if err := tx.Exec("DELETE FROM pending_notifications WHERE form_id = ? AND receiver = ?", formStatus.FormID, formStatus.WriterEmail).Error; err != nil {
			log.ErrorMsg(err.Error())
			return err
		}
	}

	// Delete form result if user had responded
	if user.ID != 0 {
		// This is a batch delete since the values don't have primary key
		if err := tx.Where("form_id = ? and user_id = ?", formStatus.FormID, user.ID).Delete(&models.FormAnswer{}).Error; err != nil {
			log.ErrorMsg(err.Error())
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}
