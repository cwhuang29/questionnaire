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
    .then(async (response) => {
      let allResponse = { ...response.data };

      if (response.data.token) {
        const header = { Authorization: `Bearer ${response.data.token}` };
        const userData = await userService.getCurrentUserData(header).catch((error) => Promise.reject(error));

        allResponse = {
          ...allResponse,
          ...userData.data,
        };
      }

      // TODO write csrf token to cookie
      localStorage.setItem('auth', JSON.stringify(allResponse));

      return allResponse;
    });

const logout = () => {
  localStorage.removeItem('auth');
};

export default {
  register,
  login,
  logout,
};
