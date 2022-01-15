import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';
import handleErrorMessage from '@utils/handleErrorMessage';

const getCurrentMemberData = (token = authHeader()) =>
  fetch
    .get(apis.V2.ME, { headers: token })
    .then((response) => response)
    .catch((error) => handleErrorMessage(error));

export default {
  getCurrentUserData: getCurrentMemberData,
};
