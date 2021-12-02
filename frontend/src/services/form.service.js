import apis from 'shared/constant/apis';
import authHeader from './auth-header';
import fetch from './roots';

const getAllForms = (token = authHeader()) =>
  fetch.get(apis.V2.FORMS, { headers: token });

export default {
  getAllForms,
};
