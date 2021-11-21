import { localAPI } from './roots';
import authHeader from './auth-header';
import handleErrorMessage from '../shared/utils/handleErrorMessage';

const getCurrentMemberData = (token = authHeader()) => localAPI.get('/member/me', { headers: token })
  .then((response) => response)
  .catch((error) => handleErrorMessage(error));

export default {
  getCurrentUserData: getCurrentMemberData,
};
