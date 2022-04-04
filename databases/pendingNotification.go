package databases

import (
	"time"

	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/databases/models"
)

func InsertPendingNotification(pendingNotification models.PendingNotification) (models.PendingNotification, error) {
	if err := db.Create(&pendingNotification).Error; err != nil {
		log.ErrorMsg(err.Error())
		return models.PendingNotification{}, err
	}

	return pendingNotification, nil
}

func InsertPendingNotifications(pendingNotifications []models.PendingNotification) ([]models.PendingNotification, error) {
	if err := db.Create(&pendingNotifications).Error; err != nil {
		log.ErrorMsg(err.Error())
		return []models.PendingNotification{}, err
	}

	return pendingNotifications, nil
}

func GetPendingNotificationByTypeAndFormIdAndReceiver(notificationType, formId int, receiver string, isAdmin bool) (pendingNotification models.PendingNotification) {
	db.Where("notification_type = ? and form_id = ? and receiver = ?", notificationType, formId, receiver).Last(&pendingNotification)
	return
}

func GetDueNotification() (pendingNotification []models.PendingNotification, err error) {
	now := time.Now()
	err = db.Where("effective_time <= ?", now).Find(&pendingNotification).Error
	return
}

func DeletePendingNotification(pendingNotifications []models.PendingNotification) (err error) {
	err = db.Delete(&pendingNotifications).Error
	return
}

func DeletePendingNotificationByFormStatus(formStatus models.FormStatus) error {
	return db.Exec("DELETE FROM pending_notifications WHERE form_id = ? AND receiver = ?", formStatus.FormID, formStatus.WriterEmail).Error
}

func DeleteDueNotification() error {
	driver := config.GetCopy().Driver

	var err error
	switch driver {
	case "mysql":
		err = db.Exec("DELETE FROM pending_notifications WHERE effective_time - now() <= 0").Error
	case "sqlite":
		err = db.Exec("DELETE FROM pending_notifications WHERE effective_time - strftime('%s', 'now') < 0").Error
	default:
		panic("DB driver is incorrect!")
	}

	return err
}
