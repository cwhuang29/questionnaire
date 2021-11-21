package models

import (
	"time"
)

type Notify struct {
	FormID    int       `gorm:"not null"`
	Sender    string    `gorm:"not null;size:40"`
	Receiver  string    `gorm:"not null;size:40"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
