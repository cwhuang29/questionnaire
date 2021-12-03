import apis from 'shared/constant/apis';
import authHeader from './auth-header';
import fetch from './roots';

const getAllForms = (token = authHeader()) => fetch.get(apis.V2.FORMS, { headers: token });

const getFormById = (id, token = authHeader()) => fetch.get(`${apis.V2.FORMS}/${id}`, { headers: token });

const getFormDetailById = (id, token = authHeader()) => fetch.get(`${apis.V2.FORMS_DETAIL}/${id}`, { headers: token });

export default {
  getAllForms,
  getFormById,
  getFormDetailById,
};
