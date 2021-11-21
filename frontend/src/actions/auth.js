import AuthService from '../services/auth.service';
import handleErrorMessage from '../shared/utils/handleErrorMessage';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
} from './types';

export const register = (data) => (
  dispatch,
) => AuthService.register(data)
  .then(() => {
    dispatch({
      type: REGISTER_SUCCESS,
    });

    return Promise.resolve();
  })
  .catch((error) => Promise.reject(handleErrorMessage(error)));

export const login = (account, password) => (dispatch) => AuthService.login(account, password)
  .then((data) => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: data },
    });

    return Promise.resolve();
  });

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};
