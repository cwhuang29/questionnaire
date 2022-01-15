import { AUTH_STATUS } from '@constants/actionTypes';
import AuthService from '@services/auth.service';
import handleErrorMessage from '@utils/handleErrorMessage';

export const register = (data) => (dispatch) =>
  AuthService.register(data)
    .then(() => {
      dispatch({
        type: AUTH_STATUS.REGISTER_SUCCESS,
      });

      return Promise.resolve();
    })
    .catch((error) => Promise.reject(handleErrorMessage(error)));

export const login = (data) => (dispatch) =>
  AuthService.login(data).then((response) => {
    dispatch({
      type: AUTH_STATUS.LOGIN_SUCCESS,
      payload: { user: response },
    });

    return Promise.resolve();
  });

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: AUTH_STATUS.LOGOUT,
  });
};
