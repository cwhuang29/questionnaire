package models

import (
	"time"
)

type Form struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:50" json:"name"`
	Role      int       `gorm:"not null" json:"role"`
	Author    string    `gorm:"not null" json:"author"`
	Status    int       `gorm:"not null" json:"status"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
