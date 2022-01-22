package handlers

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/cwhuang29/questionnaire/constants"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/databases/models"
	"github.com/cwhuang29/questionnaire/utils"
)

func transformFormToWebFormat(form models.Form) (f Form) {
	f.ResearchName = strings.Split(form.ResearchName, ",")
	f.FormName = form.FormName
	f.FormCustId = form.FormCustId
	f.MinScore = form.MinScore
	f.OptionsCount = form.OptionsCount
	_ = json.Unmarshal([]byte(form.FormTitle), &f.FormTitle)
	_ = json.Unmarshal([]byte(form.FormIntro), &f.FormIntro)
	_ = json.Unmarshal([]byte(form.Questions), &f.Questions)

	f.ID = form.ID
	f.Author = form.Author
	f.CreatedAt = form.CreatedAt
	f.UpdatedAt = form.UpdatedAt
	return
}

func transformFormToDBFormat(form Form, user models.User) (f models.Form) {
	formTitleBytes, _ := json.Marshal(form.FormTitle)
	formIntroBytes, _ := json.Marshal(form.FormIntro)
	questionsBytes, _ := json.Marshal(form.Questions)

	f.ResearchName = strings.Join(form.ResearchName, ",")
	f.FormName = form.FormName
	f.FormCustId = form.FormCustId
	f.MinScore = form.MinScore
	f.OptionsCount = form.OptionsCount
	f.FormTitle = string(formTitleBytes)
	f.FormIntro = string(formIntroBytes)
	f.Questions = string(questionsBytes)

	f.Author = user.GetName()
	f.AuthorID = user.ID
	f.AdminOnly = false
	return
}

func transformFormStatusToWebFormat(formStatus models.FormStatus, formId int) (f FormStatus) {
	receiver := databases.GetUserByEmail(formStatus.WriterEmail)
	notificationHistory := databases.GetNotificationByTypeAndFormIdAndReceiverIdAndResult(int(utils.NotificationEmail), formId, receiver.ID, true)
	sender := databases.GetUser(notificationHistory.SenderId)

	f.Name = receiver.GetName()
	f.Email = formStatus.WriterEmail
	f.Role = utils.RoleType(formStatus.Role).String()
	f.Status = utils.FormStatus(formStatus.Status).String()
	f.EmailSender = sender.GetName()
	f.EmailLastSentTime = notificationHistory.CreatedAt
	return
}

func transformAssignFormToFormStatusDBFormat(id int, assignForm AssignForm) []models.FormStatus {
	dbFormStatus := make([]models.FormStatus, len(assignForm.Recipient))
	now := time.Now()

	for idx, email := range assignForm.Recipient {
		dbFormStatus[idx].FormId = id
		dbFormStatus[idx].WriterEmail = email
		dbFormStatus[idx].Role = assignForm.Role
		dbFormStatus[idx].Status = int(utils.FormStatusAssign)
		dbFormStatus[idx].AssignAt = now
	}
	return dbFormStatus
}

func transformEmailNotificationToNotificationHistory(emailNotification EmailNotification, formId int, senderEmail string, notificationType utils.NotificationType) []models.NotificationHistory {
	sender := databases.GetUserByEmail(senderEmail)

	dbNotificationHistory := make([]models.NotificationHistory, len(emailNotification.Recipient))
	for idx, email := range emailNotification.Recipient {
		dbNotificationHistory[idx].Receiver = email
		dbNotificationHistory[idx].FormId = formId
		dbNotificationHistory[idx].NotificationType = int(notificationType)
		dbNotificationHistory[idx].SenderId = sender.ID
	}
	return dbNotificationHistory
}

func articleFormatDBToOverview(article models.Article) (a Article) {
	a.ID = article.ID

	if len(article.Title) > constants.TitleSizeLimit {
		// Chinese words are about 1.8 times wider than English alphabets in title and subtitle
		a.Title = utils.DecodeRuneStringForFrontend(article.Title, constants.TitleSizeLimit, 1.78) + "&nbsp;..."
	} else {
		a.Title = article.Title
	}

	if len(article.Subtitle) > constants.SubtitleSizeLimit {
		a.Subtitle = utils.DecodeRuneStringForFrontend(article.Subtitle, constants.SubtitleSizeLimit, 1.78) + "&nbsp;..."
	} else {
		a.Subtitle = article.Subtitle
	}

	a.Date = article.ReleaseDate.String()
	a.Authors = strings.Split(article.Authors, ",")
	a.Category = strings.ToLower(article.Category) // Because router only accepts lower case path
	a.CoverPhoto = article.CoverPhoto              // The url of cover photo
	a.AdminOnly = article.AdminOnly

	a.Tags = []string{}
	for _, t := range article.Tags {
		a.Tags = append(a.Tags, t.Value)
	}

	if article.CoverPhoto != "" && len(article.Outline) > constants.OutlineSizeLimitWithCoverPhoto {
		a.Outline = utils.DecodeRuneStringForFrontend(article.Outline, constants.OutlineSizeLimitWithCoverPhoto, 2.15)
	} else if len(article.Outline) > constants.OutlineSizeLimit {
		a.Outline = utils.DecodeRuneStringForFrontend(article.Outline, constants.OutlineSizeLimit, 2.15)
	} else {
		a.Outline = article.Outline
	}

	return
}

func articleFormatDBToDetailed(article models.Article, parseMarkdown bool) (a Article) {
	a.Title = article.Title
	a.Subtitle = article.Subtitle
	a.Date = article.ReleaseDate.Format("2006-01-02")
	a.Authors = strings.Split(article.Authors, ",")
	a.Category = strings.ToLower(article.Category)
	a.Outline = article.Outline
	a.CoverPhoto = article.CoverPhoto
	a.AdminOnly = article.AdminOnly

	a.Tags = []string{} // Without initial, html template brokes (var tags = {{ .tags }};)
	for _, t := range article.Tags {
		a.Tags = append(a.Tags, t.Value)
	}

	if parseMarkdown {
		a.Content = utils.ParseMarkdownToHTML(article.Content)
	} else {
		a.Content = article.Content
	}

	return
}
