import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';

const getCurrentMemberData = (token = authHeader()) =>
  fetch
    .get(apis.V2.ME, { headers: token })
    .then((response) => response)
    .catch((err) => Promise.reject(err));

export default {
  getCurrentUserData: getCurrentMemberData,
};
