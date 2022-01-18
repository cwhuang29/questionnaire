import { FORM_STATUS } from '@constants/actionTypes';
import formService from '@services/form.service';
import { extractErrorMessage } from '@utils/handleErrorMessage';

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
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const getFormById = (id) => (dispatch) =>
  formService
    .getFormById(id)
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_SUCCESS,
        payload: { form: resp.data },
      });

      return Promise.resolve(resp.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const getFormDetailById = (id) => (dispatch) =>
  formService
    .getFormDetailById(id)
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_DATAIL_SUCCESS,
        payload: { form: resp.data },
      });

      return Promise.resolve(resp.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const getFormByUser = () => (dispatch) =>
  formService
    .getFormByUser()
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_SUCCESS,
        payload: { form: resp.data },
      });

      return Promise.resolve(resp.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const createForm = (data) => () =>
  formService
    .createForm(data)
    .then((resp) => Promise.resolve(resp.data))
    .catch((err) => Promise.reject(extractErrorMessage(err)));
