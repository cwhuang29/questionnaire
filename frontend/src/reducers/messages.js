import { MESSAGE_STATUS } from '../actions/types';

const initialState = {};

const messages = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case MESSAGE_STATUS.SET_MESSAGE:
      return { message: payload };
    case MESSAGE_STATUS.CLEAR_MESSAGE:
      return { message: '' };
    default:
      return state;
  }
};

export default messages;
