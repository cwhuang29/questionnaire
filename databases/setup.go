package databases

import (
	"fmt"

	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/logger"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	db  *gorm.DB
	log = logger.New("Database")
)

func GetDB() *gorm.DB {
	return db
}

func getMysqlDSN(cfg config.Database) string {
	// Example: "user:pwd@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True", cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Database)
}

func connect(cfg config.Database) (err error) {
	switch driver := cfg.Driver; driver {
	case "mysql":
		dsn := getMysqlDSN(cfg)
		if db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true}); err != nil {
			return err
		}
	case "sqlite":
		if db, err = gorm.Open(sqlite.Open("tmp.db"), &gorm.Config{}); err != nil {
			return err
		}
	default:
		panic("Please select a correct database driver (mysql or sqlite).")
	}
	return
}

func createTables() {
	// See https://gorm.io/docs/migration.html
	if !(db.Migrator().HasTable(&models.User{}) && db.Migrator().HasTable(&models.Article{}) && db.Migrator().HasTable(&models.Tag{})) {
		db.AutoMigrate(&models.User{}, &models.Article{}, &models.Tag{})
	}
	if !(db.Migrator().HasTable(&models.Login{})) {
		db.Migrator().CreateTable(&models.Login{})
	}
	if !(db.Migrator().HasTable(&models.Password{})) {
		db.Migrator().CreateTable(&models.Password{})
	}
	if !(db.Migrator().HasTable(&models.Admin{})) {
		db.Migrator().CreateTable(&models.Admin{})
	}
	if !(db.Migrator().HasTable(&models.Form{})) {
		db.Migrator().CreateTable(&models.Form{})
	}
	if !(db.Migrator().HasTable(&models.FormStatus{})) {
		db.Migrator().CreateTable(&models.FormStatus{})
	}
	if !(db.Migrator().HasTable(&models.NotificationHistory{})) {
		db.Migrator().CreateTable(&models.NotificationHistory{})
	}
	if !(db.Migrator().HasTable(&models.PendingNotification{})) {
		db.Migrator().CreateTable(&models.PendingNotification{})
	}
	if !(db.Migrator().HasTable(&models.FormAnswer{})) {
		db.Migrator().CreateTable(&models.FormAnswer{})
	}
}

func createConstraints() {
	if !db.Migrator().HasConstraint(&models.Login{}, "User") {
		db.Migrator().CreateConstraint(&models.Login{}, "User")
	}
}

func registerAdminEmail(emails []string) {
	for _, email := range emails {
		adminUser := models.Admin{Email: email}
		db.Create(&adminUser)
	}
}

func Initial() (err error) {
	cfg := config.GetCopy()

	if err = connect(cfg.Database); err != nil {
		return
	}
	createTables()
	createConstraints()
	registerAdminEmail(cfg.Admin.Email)
	return
}
