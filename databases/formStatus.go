package databases

import (
	"github.com/cwhuang29/questionnaire/databases/models"
)

func DeleteFormStatus(formStatus models.FormStatus) error {
	return db.Delete(&formStatus).Error
	// db.Delete(models.FormStatus{}, formStatus.ID)
	// db.Exec("DELETE FROM from_status WHERE id = " + formStatus.ID)
}

func GetFormStatusByFormId(id int, isAdmin bool) (formStatus []models.FormStatus) {
	db.Where("form_id = ?", id).Find(&formStatus)
	return
}

func GetFormStatusByWriterEmail(writerEmail string, isAdmin bool) (formStatus []models.FormStatus) {
	db.Where("writer_email = ?", writerEmail).Find(&formStatus)
	return
}

func GetFormStatusByWriterEmailAndStatus(writerEmail string, status []int, isAdmin bool) (formStatus []models.FormStatus) {
	db.Where("writer_email = ? and status in ?", writerEmail, status).Find(&formStatus)
	return
}

func GetFormStatusByFormIdAndWriterEmail(id int, writerEmail string, isAdmin bool) (formStatus models.FormStatus) {
	db.Where("form_id = ? and writer_email = ?", id, writerEmail).Last(&formStatus)
	return
}

func GetFormStatusByFormIdAndWriterEmailAndStatus(id int, writerEmail string, status []int, isAdmin bool) (formStatus models.FormStatus) {
	db.Where("form_id = ? and writer_email = ? and status in ?", id, writerEmail, status).Last(&formStatus)
	return
}

func InsertFormStatus(formStatus []models.FormStatus) ([]models.FormStatus, error) {
	// db.CreateInBatches(formStatus, 1000)
	if err := db.Create(&formStatus).Error; err != nil {
		log.ErrorMsg(err.Error())
		return []models.FormStatus{}, err
	}

	return formStatus, nil
}

func UpdateFormStatus(formStatus models.FormStatus) error {
	if err := db.Save(formStatus).Error; err != nil {
		log.ErrorMsg(err.Error())
		return err
	}
	return nil
}
