package models

import (
	"time"
)

type FormAnswer struct {
	ID           int       `gorm:"primaryKey"`
	FormID       int       `gorm:"not null;index:form_id_key"`
	UserID       int       `gorm:"not null;index:user_form_id_key"`
	FormStatusID int       `gorm:"not null;index:form_status_id_key"`
	Answers      string    `gorm:"not null;type:text"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
}
