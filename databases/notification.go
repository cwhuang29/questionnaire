package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
)

func GetNotificationByTypeAndFormId(notificationType, formId int) (notificationHistory models.NotificationHistory) {
	db.Where("notification_type = ? and form_id = ?", notificationType, formId).Find(&notificationHistory)
	return
}

func GetNotificationByTypeAndFormIdAndReceiverIdAndResult(notificationType, formId, receiverId int, result bool) (notificationHistory models.NotificationHistory) {
	db.Where("notification_type = ? and form_id = ? and receiver_id = ? and result = ?", notificationType, formId, receiverId, result).Last(&notificationHistory)
	return
}

func GetNotificationByTypeAndFormIdAndReceiverAndResult(notificationType, formId int, receiver string, result bool) (notificationHistory models.NotificationHistory) {
	db.Where("notification_type = ? and form_id = ? and receiver = ? and result = ?", notificationType, formId, receiver, result).Last(&notificationHistory)
	return
}

func InsertNotificationHistory(notificationHistory []models.NotificationHistory) ([]models.NotificationHistory, error) {
	// db.CreateInBatches(formStatus, 1000)
	if err := db.Create(&notificationHistory).Error; err != nil {
		log.ErrorMsg(err.Error())
		return []models.NotificationHistory{}, err
	}

	return notificationHistory, nil
}

func UpdateNotificationHistory(notificationHistory []models.NotificationHistory) bool {
	if err := db.Save(notificationHistory).Error; err != nil {
		log.ErrorMsg(err.Error())
		return false
	}
	return true
}

func UpdateNotificationHistoryResult(notificationHistory []models.NotificationHistory, result bool) bool {
	// Update attributes with `struct`, will only update non-zero fields
	if err := db.Model(notificationHistory).Updates(models.NotificationHistory{Result: result}).Error; err != nil {
		log.ErrorMsg(err.Error())
		return false
	}
	return true
}
