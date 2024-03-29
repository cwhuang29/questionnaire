import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';

const getCurrentUserData = (token = authHeader()) =>
  fetch
    .get(apis.V2.ME, { headers: token })
    .then(response => response)
    .catch(err => Promise.reject(err));

const getAllUsers = (token = authHeader()) =>
  fetch
    .get(apis.V2.USERS_OVERVIEW, { headers: token })
    .then(response => Promise.resolve(response.data))
    .catch(err => Promise.reject(err));

const deleteUser = (payload, token = authHeader()) =>
  fetch
    .delete(`${apis.V2.USERS}`, { headers: token, data: { payload } })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

export default {
  getCurrentUserData,
  getAllUsers,
  deleteUser,
};
