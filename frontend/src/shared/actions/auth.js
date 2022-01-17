import { AUTH_STATUS } from '@constants/actionTypes';
import AuthService from '@services/auth.service';
import { extractErrorMessage } from '@utils/handleErrorMessage';

export const register = (data) => (dispatch) =>
  AuthService.register(data)
    .then(() => {
      dispatch({
        type: AUTH_STATUS.REGISTER_SUCCESS,
      });

      return Promise.resolve();
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const login = (data) => (dispatch) =>
  AuthService.login(data)
    .then((resp) => {
      dispatch({
        type: AUTH_STATUS.LOGIN_SUCCESS,
        payload: { user: resp },
      });

      return Promise.resolve();
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: AUTH_STATUS.LOGOUT,
  });
};
