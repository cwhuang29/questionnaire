package models

import (
	"time"
)

type FormStatus struct {
	ID          int        `gorm:"primaryKey"`
	FormID      int        `gorm:"not null;index:form_id_key"`
	WriterEmail string     `gorm:"not null"` // This user may not have created yet
	Role        int        `gorm:"not null"`
	Status      int        `gorm:"not null"`
	AssignedAt  time.Time  `gorm:"not null"`
	StartAt     *time.Time // Make it pointer type so it can be nil
	FinishAt    *time.Time
}
