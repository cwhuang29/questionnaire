package models

import (
	"time"
)

type Form struct {
	ID        int    `gorm:"primaryKey"`
	AuthorID  int    `gorm:"not null"`
	Author    string `gorm:"not null"`
	Status    int    `gorm:"not null"`
	AdminOnly bool   `gorm:"default:false"` // Database store 0/1

	ResearchName string `gorm:"not null;size:2048"`
	FormName     string `gorm:"not null;size:512"`
	FormCustId   string `gorm:"not null;size:512"`
	MinScore     int    `gorm:"not null"`
	OptionsCount int    `gorm:"not null"`
	FormTitle    string `gorm:"size:65535"`
	FormIntro    string `gorm:"size:65535"`
	Questions    string `gorm:"not null;size:65535"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
