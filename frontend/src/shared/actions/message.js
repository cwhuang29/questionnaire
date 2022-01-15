import { MESSAGE_STATUS } from '@constants/actionTypes';

export const setMessage = (message) => ({
  type: MESSAGE_STATUS.SET_MESSAGE,
  payload: message,
});

export const clearMessage = () => ({
  type: MESSAGE_STATUS.CLEAR_MESSAGE,
});
