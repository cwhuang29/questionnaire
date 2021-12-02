import formService from 'services/form.service';
import { FORM_STATUS } from './types';

// Get all forms
export const getAllForms = () => dispatch =>
  formService
    .getAllForms()
    .then(resp => {
      dispatch({
        type: FORM_STATUS.FETCH_FORMS_SUCCESS,
        payload: { forms: resp },
      });
      return Promise.resolve(resp.data);
    })
    .catch(resp => Promise.reject(resp.response));

// Get one form by id & role (student, parent, teacher)
export const getFormDetail = data => dispatch =>
  formService.getForm(data).then(resp => {
    dispatch({
      type: FORM_STATUS.FETCH_FORMS_SUCCESS,
      payload: { id: data.id, form: resp },
    });

    return Promise.resolve();
  });
