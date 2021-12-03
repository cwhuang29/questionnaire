import fetch from './roots';
import userService from './user.service';

const register = ({ firstName, lastName, email, password, role }) =>
  fetch.post('/v2/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    role,
  });

const login = ({ email, password }) =>
  fetch
    .post('/v2/login', {
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

      // write csrf token to cookie
      localStorage.setItem('user', JSON.stringify(allResponse));

      return allResponse;
    });

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};
