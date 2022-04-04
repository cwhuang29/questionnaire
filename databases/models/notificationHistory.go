package models

import (
	"time"
)

type NotificationHistory struct {
	ID               int `gorm:"primaryKey"`
	NotificationType int `gorm:"not null"`
	FormID           int `gorm:"not null;index:form_id_key"`
	SenderID         int `gorm:"not null;index:sender_id_key"`
	// ReceiverID       int `gorm:"default:-1"` // In thie project mechanism, the user might not have an account yet
	Receiver  string    `gorm:"not null"`
	Result    bool      `gorm:"default:false"` // Database store 0/1
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
