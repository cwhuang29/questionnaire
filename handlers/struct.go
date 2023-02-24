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

type User struct {
	Name          string    `json:"name,omitempty"`
	Email         string    `json:"email,omitempty"`
	CreatedAt     time.Time `json:"createdAt,omitempty"`
	FillOutCount  int       `json:"fillOutCount"`
	FillOutNames  []string  `json:"fillOutNames"`
	AssignedCount int       `json:"assignedCount"`
	AssignedNames []string  `json:"assignedNames"`
}

type Form struct {
	ID     int    `json:"id"`
	Author string `json:"author,omitempty"`

	ResearchName []string       `json:"researchName,omitempty"`
	FormName     string         `json:"formName,omitempty"`
	FormCustID   string         `json:"formCustId,omitempty"`
	MinScore     int            `json:"minScore,"` // The min score might be zero
	OptionsCount int            `json:"optionsCount,omitempty"`
	FormTitle    FormInfoByRole `json:"formTitle,omitempty"`
	FormIntro    FormInfoByRole `json:"formIntro,omitempty"`
	Questions    FormQuestion   `json:"questions,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type FormInfoByRole struct {
	Student    string `json:"student"`
	Parent     string `json:"parent"`
	Teacher    string `json:"teacher"`
	Counseling string `json:"counseling"`
}

type FormQuestion struct {
	Student    []Question `json:"student"`
	Parent     []Question `json:"parent"`
	Teacher    []Question `json:"teacher"`
	Counseling []Question `json:"counseling"`
}

type Question struct {
	ID               int      `json:"id"`
	Label            string   `json:"label"`
	Options          []string `json:"options"`
	IsReverseGrading bool     `json:"isReverseGrading"`
	IsMultipleChoice bool     `json:"isMultipleChoice"`
	MaxScore         int      `json:"maxScore"`
}

type Answer struct {
	Answers []string `json:"answers"`
}

type Login struct {
	Email    string `form:"email" json:"email" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

type EmailNotification struct {
	EffectiveTime time.Time `json:"effectiveTime"`
	Recipient     []string  `json:"email"`
	Subject       string    `json:"subject"`
	Content       string    `json:"content"`
	Footer        string    `json:"footer,omitempty"`
}

type AssignForm struct {
	EmailNotification
	Role int `json:"role"`
}

type FormStatus struct {
	ID                int       `json:"id"`
	Name              string    `json:"name"`
	WriterName        string    `json:"writerName"`
	WriterEmail       string    `json:"writerEmail"`
	AssignedAt        time.Time `json:"assignedAt"`
	Role              string    `json:"role"`
	Status            string    `json:"status"`
	EmailSender       string    `json:"emailSender"`
	EmailLastSentTime time.Time `json:"emailLastSentTime,omitempty"`
}

type FormResult struct {
	FormCustID        string           `json:"formCustId"`
	MaxQuestionsCount int              `json:"maxQuestionsCount"`
	FormLastUpdatedAt time.Time        `json:"formLastUpdatedAt"`
	Results           []FormResultItem `json:"results"`
}

type FormResultItem struct {
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	Role       string    `json:"role"`
	AnswerTime time.Time `json:"answerTime"`
	Score      int       `json:"score"`
	Answers    []string  `json:"answers"`
}

type ExportFormIds struct {
	FormIDs []int `json:"formIds"`
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
