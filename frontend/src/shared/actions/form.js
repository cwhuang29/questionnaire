import { FORM_STATUS } from '@constants/actionTypes';
import formService from '@services/form.service';
import { extractErrorMessage } from '@utils/handleErrorMessage';

/*
 * Axios puts returned data in the object with the key "data"
 * So to access data in the HTTP response, the syntax is "resp.data"
 * Besides, in backend, I put all data in the object with the key "data", just like what axios did
 * So to get the actual data, the syntax is "resp.data.data"
 */
export const getAllForms = () => (dispatch) =>
  formService
    .getAllForms()
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORMS_SUCCESS,
        payload: { forms: resp.data.data }, // resp.data: { data: [{form01}, {form02}] }. resp.data.data:  [{form01}, {form02}]
      });
      return Promise.resolve(resp.data.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const getFormById = (id) => (dispatch) =>
  formService
    .getFormById(id)
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_SUCCESS,
        payload: { form: resp.data.data }, // returns {form01}
      });

      return Promise.resolve(resp.data.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

export const getFormByUser = () => (dispatch) =>
  formService
    .getFormByUser()
    .then((resp) => {
      dispatch({
        type: FORM_STATUS.FETCH_FORM_SUCCESS,
        payload: { forms: resp.data.data },
      });

      return Promise.resolve(resp.data.data);
    })
    .catch((err) => Promise.reject(extractErrorMessage(err)));

// TODO Add dispatch logic
export const createForm = (data) => () =>
  formService
    .createForm(data)
    .then((resp) => Promise.resolve(resp.data))
    .catch((err) => Promise.reject(extractErrorMessage(err)));

// TODO Add dispatch logic
export const updateForm = (id, data) => () =>
  formService
    .updateForm(id, data)
    .then((resp) => Promise.resolve(resp.data))
    .catch((err) => Promise.reject(extractErrorMessage(err)));
