import handleErrorMessage from 'shared/utils/handleErrorMessage';
import apis from 'shared/constant/apis';
import fetch from './roots';
import authHeader from './auth-header';

const getCurrentMemberData = (token = authHeader()) =>
  fetch
    .get(apis.V2.ME, { headers: token })
    .then((response) => response)
    .catch((error) => handleErrorMessage(error));

export default {
  getCurrentUserData: getCurrentMemberData,
};
