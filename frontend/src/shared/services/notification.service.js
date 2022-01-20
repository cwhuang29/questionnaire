import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';
import { extractErrorMessage } from '@utils/handleErrorMessage';

const sendEmailNotificaionByFormId = (id, data, token = authHeader()) => {
  const url = new URL(apis.V2.EMAIL_NOTIFICATION, window.location.href);
  url.searchParams.set('formId', id);

  const path = url.pathname + url.search;

  return fetch
    .post(path, data, { headers: token })
    .then((resp) => Promise.resolve(resp.data))
    .catch((err) => Promise.reject(extractErrorMessage(err)));
};

export default {
  sendEmailNotificaionByFormId,
};
