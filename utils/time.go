package utils

import (
	"time"
)

func ConvertToTimezone(t time.Time, tz string) time.Time {
	loc, err := time.LoadLocation(tz)
	if err != nil {
		panic(err)
	}
	return t.In(loc)
}

func IsExpired(startTime time.Time, period int) bool {
	now := time.Now().UTC().Truncate(time.Second)
	if now.Sub(startTime).Seconds() > float64(period) {
		return true
	}
	return false
}

func IsFuture(baseTime time.Time, epsilon int) bool {
	now := time.Now().UTC()

	if baseTime.Sub(now) > -time.Duration(epsilon) {
		return true
	}
	return false
}
