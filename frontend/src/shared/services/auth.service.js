import API from '@constants/apis';
import fetch from '@services/roots';
import userService from '@services/user.service';

const register = ({ firstName, lastName, email, password, role }) =>
  fetch.post(API.V2.REGISTER, {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    role: parseInt(role, 10),
  });

const login = ({ email, password }) =>
  fetch
    .post(API.V2.LOGIN, {
      email,
      password,
    })
    .then(async (resp) => {
      let respData = { ...resp.data };

      if (respData.token) {
        const header = { Authorization: `Bearer ${resp.data.token}` };
        const userData = await userService.getCurrentUserData(header).catch((error) => Promise.reject(error));
        respData = { ...respData, ...userData.data };
      }

      // TODO write csrf token to cookie
      localStorage.setItem('auth', JSON.stringify(respData));

      return respData;
    });

const logout = () => {
  localStorage.removeItem('auth');
};

export default {
  register,
  login,
  logout,
};
