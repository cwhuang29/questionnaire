package models

import (
	"time"

	"gorm.io/gorm"
)

type FormAnswer struct {
	ID           int            `gorm:"primaryKey"`
	FormID       int            `gorm:"not null;index:form_id_key"`
	UserID       int            `gorm:"not null;index:user_form_id_key"`
	FormStatusID int            `gorm:"not null;index:form_status_id_key"`
	Role         int            `gorm:"not null"`
	Answers      string         `gorm:"not null;type:text"`
	CreatedAt    time.Time      `gorm:"autoCreateTime"`
	DeletedAt    gorm.DeletedAt // https://gorm.io/docs/delete.html#Soft-Delete
}
