import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';

const getAllForms = (token = authHeader()) => fetch.get(apis.V2.FORMS, { headers: token });

const getFormById = (id, token = authHeader()) => fetch.get(`${apis.V2.FORMS}/${id}`, { headers: token });

const getFormDetailById = (id, token = authHeader()) => fetch.get(`${apis.V2.FORMS_DETAIL}/${id}`, { headers: token });

const getFormByUser = (token = authHeader()) => fetch.get(`${apis.V2.FORMS}`, { headers: token });

const createForm = (data, token = authHeader()) => fetch.post(apis.V2.CREATE_FORM, data, { headers: token });

// const createForm = (data, token = authHeader()) =>
//   fetch.post(apis.V2.CREATE_FORM, data, { headers: token }).then(async (resp) => {
//     const respData = { ...resp.data };
//     console.log(`Endpoint createForm response: ${respData}`);
//   });

export default {
  getAllForms,
  getFormById,
  getFormDetailById,
  getFormByUser,

  createForm,
};
