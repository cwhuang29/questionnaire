// Set general messages in default
export default {
  UNKNOWN_ERROR: 'Oops, this is unexpected',
  TRY_AGAIN: 'Please try again',
  RELOAD_AND_RETRY: 'Please reload the page and try again',
  GO_BACK_AND_RETRY: 'Go back to previous page and try again',
  TRY_TOO_OFTEN: 'You are trying too often',
};

export const validateMsg = {
  TOO_LONG: 'This value is too long',
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
  },
};
