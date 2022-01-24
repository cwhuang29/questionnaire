package models

import (
	"time"
)

type Form struct {
	ID        int    `gorm:"primaryKey"`
	AuthorID  int    `gorm:"not null;index:author_id_key"`
	Author    string `gorm:"not null"`
	Status    int    `gorm:"not null"`
	AdminOnly bool   `gorm:"default:false"` // Database store 0/1

	ResearchName string `gorm:"not null;size:2048"`
	FormName     string `gorm:"not null;size:512"`
	FormCustID   string `gorm:"not null;size:512"`
	MinScore     int    `gorm:"not null"`
	OptionsCount int    `gorm:"not null"`
	FormTitle    string `gorm:"not null;type:text"`
	FormIntro    string `gorm:"not null;type:text"`
	Questions    string `gorm:"not null;type:text"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
