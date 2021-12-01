import handleErrorMessage from 'shared/utils/handleErrorMessage';
import APIS from 'shared/constant/apis';
import fetch from './roots';
import authHeader from './auth-header';

const getCurrentMemberData = (token = authHeader()) =>
  fetch
    .get(APIS.V2.ME, { headers: token })
    .then(response => response)
    .catch(error => handleErrorMessage(error));

export default {
  getCurrentUserData: getCurrentMemberData,
};
