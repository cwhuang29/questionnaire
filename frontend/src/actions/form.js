import formService from 'services/form.service';
import { FORM_STATUS } from './types';

export const getAllForms = () => (dispatch) =>
  formService
    .getAllForms()
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORMS_SUCCESS,
        payload: { forms: resp.data },
      });
      return Promise.resolve(resp.data);
    })
    .catch((resp) => Promise.reject(resp.response));

export const getFormById = (id) => (dispatch) =>
  formService
    .getForm(id)
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_SUCCESS,
        payload: { id: resp.data.id, form: resp.data },
      });

      return Promise.resolve(resp.data);
    })
    .catch((resp) => Promise.reject(resp.response));

export const getFormDetailById = (id) => (dispatch) =>
  formService
    .getFormDetailById(id)
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_DATAIL_SUCCESS,
        payload: { id: resp.data.id, form: resp.data },
      });

      return Promise.resolve(resp.data);
    })
    .catch((resp) => Promise.reject(resp.response));
