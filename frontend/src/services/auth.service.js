import { localAPI } from './roots';
import userService from './user.service';

const register = ({ username, email, password }) => localAPI.post('/member/register', {
  username,
  email,
  password,
});

const login = (account, password) => localAPI
  .post('/login', {
    account,
    password,
  })
  .then(async (response) => {
    let allResponse = { ...response.data };

    if (response.data.token) {
      const header = { Authorization: response.data.token };
      const userData = await userService.getCurrentUserData(header)
        .catch((error) => Promise.reject(error));
        // 待會再寫...
        // 不確定是否要拿response.data做什麼事，如果不用的話 就用chaining判斷userData有沒有取得成功，沒有的話就重登入

      allResponse = {
        ...allResponse,
        ...userData.data,
      };
    }

    // 改成去cookie取得
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
