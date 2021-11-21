package constants

import (
	"errors"
	"fmt"
)

type RoleType int

const (
	Student RoleType = iota
	Parent
	Teacher
)

func (r RoleType) String() string {
	return [...]string{"student", "parent", "teacher"}[r]
}

func (r RoleType) IsValid() error {
	switch r {
	case Student, Parent, Teacher:
		return nil
	}
	return errors.New(fmt.Sprintf(EnumTypeErr, "RoleType"))
}
