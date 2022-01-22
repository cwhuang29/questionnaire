package utils

import (
	"fmt"
	"reflect"
	"regexp"
	"runtime"

	"golang.org/x/crypto/bcrypt"
)

var (
	emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
)

func GetFunctionName() string {
	pc := make([]uintptr, 15)
	n := runtime.Callers(2, pc)
	frames := runtime.CallersFrames(pc[:n])
	frame, _ := frames.Next()
	return fmt.Sprintf("%s:%d %s\n", frame.File, frame.Line, frame.Function)
}

func HashPassword(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}

func CompareHashAndPassword(hashedPassword, password []byte) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func IsEmailValid(e string) bool {
	if len(e) < 3 && len(e) > 254 {
		return false
	}
	return emailRegex.MatchString(e)
}

func RemoveDuplicateStrings(t []string) []string {
	tmp := removeDuplicateValuesInSlice(t)
	tags := make([]string, len(tmp))
	for i, v := range tmp {
		tags[i] = v.(string)
	}
	return tags
}

func removeDuplicateValuesInSlice(t interface{}) []interface{} {
	switch reflect.TypeOf(t).Kind() {
	case reflect.Slice:
		s := reflect.ValueOf(t)
		unq := make(map[interface{}]bool)
		for i := 0; i < s.Len(); i++ {
			if _, ok := unq[s.Index(i).Interface()]; !ok {
				unq[s.Index(i).Interface()] = true
			}
		}

		keys := make([]interface{}, 0)
		for key := range unq {
			keys = append(keys, key)
		}
		return keys
	default:
		return nil
	}
}
