package handlers

import (
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/constants"
)

func getAWSSVC() *ses.SES {
	region := config.GetCopy().Email.Region
	if sess, err := session.NewSession(&aws.Config{Region: aws.String(region)}); err != nil {
		log.ErrorMsg(err.Error())
		return nil
	} else {
		return ses.New(sess) // Create an SES session.
	}
}

// This function is necessary if your account is in Amazon SES sandbox,
// Cause you need to verify every single email address before using them as senders or recipients.
// Otherwise: MessageRejected: Email address is not verified. The following identities failed the check in region US-EAST-1: XXXX@XXX.com
func verifyRecipientEmail(email string) bool {
	svc := getAWSSVC()

	if _, err := svc.VerifyEmailAddress(&ses.VerifyEmailAddressInput{EmailAddress: aws.String(email)}); err != nil {
		sendEmailError(err)
		return false
	}
	log.InfoMsg("Verification sent to address: ", email)
	return true
}

func sendEmailError(err error) {
	if aerr, ok := err.(awserr.Error); ok {
		switch aerr.Code() {
		case ses.ErrCodeMessageRejected:
			log.ErrorMsg(ses.ErrCodeMessageRejected, err.Error())
		case ses.ErrCodeMailFromDomainNotVerifiedException:
			log.ErrorMsg(ses.ErrCodeMailFromDomainNotVerifiedException, err.Error())
		case ses.ErrCodeConfigurationSetDoesNotExistException:
			log.ErrorMsg(ses.ErrCodeConfigurationSetDoesNotExistException, err.Error())
		default:
			log.ErrorMsg(aerr.Error())
		}
	} else {
		log.ErrorMsg(err.Error())
	}
}

func getSendEmailInput(sender, recipient, subject, HTMLBody, textBody string) *ses.SendEmailInput {
	return &ses.SendEmailInput{
		Destination: &ses.Destination{
			CcAddresses: []*string{},
			ToAddresses: []*string{aws.String(recipient)},
		},
		Message: &ses.Message{
			Subject: &ses.Content{
				Charset: aws.String(constants.CharSet),
				Data:    aws.String(subject),
			},
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String(constants.CharSet),
					Data:    aws.String(HTMLBody),
				},
				Text: &ses.Content{ // The email body for recipients with non-HTML email clients.
					Charset: aws.String(constants.CharSet),
					Data:    aws.String(textBody),
				},
			},
		},
		Source: aws.String(sender),
		// ConfigurationSetName: aws.String(ConfigurationSet),
	}
}

func generateResetPasswordEmail(recipient, name, link string, expireTime int) *ses.SendEmailInput {
	interpolatedHtmlBody := fmt.Sprintf(constants.ResetPasswordBody, name, link, expireTime, link)
	interpolatedTextBody := fmt.Sprintf(constants.ResetPasswordTextBody, name, link, expireTime)
	sender := config.GetCopy().Email.Sender
	subject := constants.ResetPasswordSubject

	return getSendEmailInput(sender, recipient, subject, interpolatedHtmlBody, interpolatedTextBody)
}

func generateResetNotificationEmail(recipient, subject, content, footer string) *ses.SendEmailInput {
	interpolatedHtmlBody := fmt.Sprintf(constants.NotificationBody, content, footer)
	interpolatedTextBody := fmt.Sprintf(constants.NotificationTextBody, content, footer)
	sender := config.GetCopy().Email.Sender

	return getSendEmailInput(sender, recipient, subject, interpolatedHtmlBody, interpolatedTextBody)
}

func SendResetPasswordEmail(recipient, name, link string, expireMins int) bool {
	svc := getAWSSVC()
	input := generateResetPasswordEmail(recipient, name, link, expireMins)

	if result, err := svc.SendEmail(input); err != nil {
		sendEmailError(err)
		return false
	} else {
		log.InfoMsg("Successfully sent email to address: ", recipient, ". Output: ", result)
		return true
	}
}

func sendNotificaionToRemindWritingForm(emailNotification EmailNotification) ([]string, bool) {
	svc := getAWSSVC()
	subject := emailNotification.Subject
	content := strings.Replace(emailNotification.Content, "\n", "<br>", -1)
	footer := strings.Replace(emailNotification.Footer, "\n", "<br>", -1)

	var failed []string
	for _, recipient := range emailNotification.Recipient {
		input := generateResetNotificationEmail(recipient, subject, content, footer)

		if result, err := svc.SendEmail(input); err != nil {
			sendEmailError(err)
			failed = append(failed, recipient)
		} else {
			log.InfoMsg("Successfully sent email to address: ", recipient, ". AWS output: ", result)
		}
	}

	allSucceed := len(failed) == 0
	return failed, allSucceed
}
