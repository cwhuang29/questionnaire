package utils

type NotificationType int

const (
	NotificationEmail NotificationType = iota
	NotificationSMS
	NotificationUnknown
)

func (n NotificationType) String() string {
	return [...]string{"email", "sms"}[n]
}

func (n NotificationType) IsValid() bool {
	if n < NotificationEmail || n >= NotificationUnknown {
		return false
	}
	return true
}

func (n NotificationType) IsEmailNotification() bool {
	return n == NotificationEmail
}

func (n NotificationType) IsSMSNotification() bool {
	return n == NotificationSMS
}
