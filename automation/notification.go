package automation

import (
	"fmt"
	"time"

	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/handlers"
)

func sendDueNotification() {
	var pendingNotifications []models.PendingNotification
	var err error

	log.InfoMsg(fmt.Sprintf("Start handling due notifications at %s", time.Now()))

	if pendingNotifications, err = databases.GetDueNotification(); err != nil {
		log.ErrorMsg(err.Error())
		return
	}

	if len(pendingNotifications) == 0 {
		return
	}

	for _, notification := range pendingNotifications {
		emailNotification := handlers.EmailNotification{
			Recipient: []string{notification.Receiver},
			Subject:   notification.Subject,
			Content:   notification.Content,
			Footer:    notification.Footer,
		}
		sender := databases.GetUser(notification.SenderID)
		if err = handlers.SendRemindWritingFormByEmail(notification.FormID, sender.Email, emailNotification); err != nil {
			log.ErrorMsg(err.Error())
		}
	}

	if err = databases.DeletePendingNotification(pendingNotifications); err != nil {
		log.ErrorMsg(err.Error())
	}
}
