import { AUTH_STATUS } from '../actions/types';

const user = null;

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH_STATUS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case AUTH_STATUS.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case AUTH_STATUS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case AUTH_STATUS.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case AUTH_STATUS.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default auth;
