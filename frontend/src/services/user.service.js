import handleErrorMessage from 'shared/utils/handleErrorMessage';
import APIS from 'shared/constant/apis';
import { localAPI } from './roots';
import authHeader from './auth-header';

const getCurrentMemberData = (token = authHeader()) =>
  localAPI
    .get(APIS.V2.ME, { headers: token })
    .then((response) => response)
    .catch((error) => handleErrorMessage(error));

export default {
  getCurrentUserData: getCurrentMemberData,
};
