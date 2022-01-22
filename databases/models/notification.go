package models

import (
	"time"
)

type NotificationHistory struct {
	ID               int       `gorm:"primaryKey"`
	NotificationType int       `gorm:"not null"`
	FormId           int       `form:"not null"`
	SenderId         int       `form:"not null"`
	ReceiverId       int       `gorm:"default:-1"`
	Receiver         string    `gorm:"not null"`
	Result           bool      `gorm:"default:false"` // Database store 0/1
	CreatedAt        time.Time `gorm:"autoCreateTime"`
}
