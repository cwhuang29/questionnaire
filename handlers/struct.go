package handlers

import "time"

type UserStatus int

const (
	IsGuest UserStatus = iota
	IsMember
	IsMemberAndVerified
	IsAdmin
	IsAdminAndVerified
)

func (s UserStatus) String() string {
	return [...]string{"guest", "member", "verified member", "admin", "verified admin"}[s]
}

type Form struct {
	Author       string         `json:"author,omitempty"`
	ResearchName []string       `json:"researchName,omitempty"`
	FormName     string         `json:"formName,omitempty"`
	FormCustId   string         `json:"formCustId,omitempty"`
	MinScore     int            `json:"minScore,omitempty"`
	OptionsCount int            `json:"optionsCount,omitempty"`
	FormTitle    FormInfoByRole `json:"formTitle,omitempty"`
	FormIntro    FormInfoByRole `json:"formIntro,omitempty"`
	Questions    FormQuestion   `json:"questions,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
}

type FormInfoByRole struct {
	Student string `json:"student"`
	Parent  string `json:"parent"`
	Teacher string `json:"teacher"`
}

type FormQuestion struct {
	Student []Question `json:"student"`
	Parent  []Question `json:"parent"`
	Teacher []Question `json:"teacher"`
}

type Question struct {
	Id               int      `json:"id"`
	Label            string   `json:"string"`
	Options          []string `json:"options"`
	IsReverseGrading bool     `json:"isReverseGrading"`
	MaxPoint         int      `json:"maxPoint"`
}

type Login struct {
	Email    string `form:"email" json:"email" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

type Article struct {
	ID         int      `json:"id"`
	Title      string   `json:"title"`
	Subtitle   string   `json:"subtitle"`
	Date       string   `json:"date"`
	Authors    []string `json:"authors"`
	Category   string   `json:"category"`
	Tags       []string `json:"tags"`
	Outline    string   `json:"outline"`
	CoverPhoto string   `json:"cover_photo"`
	Content    string   `json:"content"`
	AdminOnly  bool     `json:"adminOnly"`
}
