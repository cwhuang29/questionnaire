package utils

type RoleType int

const (
	Student RoleType = iota
	Parent
	Teacher
	Researcher
	Admin
)

func (r RoleType) String() string {
	return [...]string{"student", "parent", "teacher", "researcher", "admin"}[r]
}

func (r RoleType) IsValidAndNotAdmin() bool {
	switch r {
	case Student, Parent, Teacher, Researcher:
		return true
	}
	return false
}

func (r RoleType) IsValid() bool {
	switch r {
	case Student, Parent, Teacher, Researcher, Admin:
		return true
	}
	return false
}

func (r RoleType) IsStudent() bool {
	return r == Student
}

func (r RoleType) IsTeacher() bool {
	return r == Teacher
}

func (r RoleType) IsResearcher() bool {
	return r == Researcher
}

func (r RoleType) IsAdmin() bool {
	return r == Admin
}
