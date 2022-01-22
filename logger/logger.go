package logger

import "github.com/sirupsen/logrus"

type logger struct {
	log  *logrus.Logger
	name string
}

func New(name string) *logger {
	return &logger{
		log:  logrus.New(),
		name: name,
	}
}

func (l logger) Info(fields logrus.Fields) {
	l.log.WithFields(fields).Info(l.name)
}

func (l logger) Warn(fields logrus.Fields) {
	l.log.WithFields(fields).Warn(l.name)
}

func (l logger) Error(fields logrus.Fields) {
	l.log.WithFields(fields).Error(l.name)
}

func (l logger) InfoMsg(args ...interface{}) {
	l.log.Info(args...)
}

func (l logger) WarnMsg(args ...interface{}) {
	l.log.Warn(args...)
}

func (l logger) ErrorMsg(args ...interface{}) {
	l.log.Error(args...)
}
