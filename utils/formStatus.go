package utils

type FormStatus int

const (
	FormStatusAssign FormStatus = iota
	FormStatusInProgress
	FormStatusFinish = iota + 10
	FormStatusUnknown
)

func (s FormStatus) String() string {
	return [...]string{"Assigned", "In Progress", "Finish"}[s]
}

func (r FormStatus) IsValid() bool {
	if r < FormStatusAssign || r >= FormStatusUnknown {
		return false
	}
	return true
}

func (s FormStatus) IsAssign() bool {
	return s == FormStatusAssign
}

func (s FormStatus) IsFinish() bool {
	return s == FormStatusFinish
}
