package constants

const (
	hour = 60 * 60
	day  = 24 * hour

	AuthTokenAge             = 7 * day
	LoginMaxAge              = 30 * day
	CsrfTokenAge             = 6 * hour
	ResetPasswordTokenMaxAge = hour
)
