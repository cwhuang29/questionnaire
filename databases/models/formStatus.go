package models

import (
	"time"
)

type FormStatus struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:50" json:"name"`
	Role      int       `gorm:"not null" json:"role"`
	Author    string    `gorm:"not null" json:"author"`
	Status    int       `gorm:"not null" json:"status"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
