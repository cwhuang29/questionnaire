package models

import (
	"time"
)

type FormHistory struct {
	FormID            int       `gorm:"not null"`
	StudentID         int       `gorm:"not null"`
	TeacherID         int       `gorm:"not null"`
	ParentID          int       `gorm:"not null"`
	StudentFinishTime time.Time `json:"student_finish_time"`
	TeacherFinishTime time.Time `json:"teacher_finish_time"`
	ParentFinishTime  time.Time `json:"parent_finish_time"`
}
