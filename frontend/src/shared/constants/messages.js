// Set general messages in default
export default {
  UNKNOWN_ERROR: 'Oops, this is unexpected',
  TRY_AGAIN: 'Please try again',
  RELOAD_AND_RETRY: 'Please reload the page and try again',
  GO_BACK_AND_RETRY: 'Go back to previous page and try again',
  TRY_TOO_OFTEN: 'You are trying too often',
  NO_DATA: 'There are no data',
  SERVER_CRASH: 'We will be back as soon as possible. Thank you for your patience and please try again later',
  SERVER_UNSTABLE: 'Some functions may not work properly due to server error',
  MISSING: 'Something is missing ...',
};

export const validateMsg = {
  TOO_LONG: 'This value is too long',
  REQUIRED: 'This field is required',
  IS_NUMBER: 'The value of this field should be a number',
  REGISTER: {
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    ROLE_REQUIRED: 'Role is required',
    PASSWORD_INCONSISTENTCY: 'Password and confirm password does not match',
  },
  LOGIN: {
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password should be of minimum 8 characters length',
  },
};