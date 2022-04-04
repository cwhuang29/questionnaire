package models

import (
	"time"
)

type PendingNotification struct {
	ID               int    `gorm:"primaryKey"`
	NotificationType int    `gorm:"not null"`
	Role             int    `gorm:"not null"`
	FormID           int    `gorm:"not null;index:form_id_key"`
	SenderID         int    `gorm:"not null;index:sender_id_key"`
	Receiver         string `gorm:"not null"`
	Subject          string `gorm:"not null"`
	Content          string `gorm:"not null"`
	Footer           string
	EffectiveTime    time.Time `gorm:"not null"`
	CreatedAt        time.Time `gorm:"autoCreateTime"`
}
