package models

import (
	"time"
)

type FormStatus struct {
	ID          int    `gorm:"primaryKey"`
	FormId      int    `form:"not null"`
	WriterEmail string `form:"not null"` // This user may not have created yet
	Role        int    `gorm:"not null"`
	Status      int    `form:"not null"`
	AssignAt    time.Time
	StartAt     time.Time
	FinishAt    time.Time

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
