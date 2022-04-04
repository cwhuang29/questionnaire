package automation

import (
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/logger"
)

var (
	log = logger.New("Automation")
)

func Exec() {
	notificationTicker := time.NewTicker(constants.HandleDueNotificationInterval * time.Second)
	defer notificationTicker.Stop()

	for {
		select {
		case <-notificationTicker.C:
			go sendDueNotification()
		}
	}
}
