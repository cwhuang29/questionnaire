import { FORM_STATUS } from '@constants/actionTypes';

const initialState = { forms: [] };
const { FETCH_FORMS_SUCCESS, FETCH_FORM_SUCCESS, FETCH_FORM_DATAIL_SUCCESS } = FORM_STATUS;

const forms = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FORMS_SUCCESS:
      return { ...state, ...payload };
    case FETCH_FORM_SUCCESS:
      return { ...state, forms: state.forms.map((form) => (form.id === payload.form.id ? payload.form : form)) };
    case FETCH_FORM_DATAIL_SUCCESS:
      if (state.formDetails.find(({ id }) => id === payload.formDetail.id)) {
        return {
          ...state,
          formDetails: state.formDetails.map((formDetail) => (formDetail.id === payload.formDetail.id ? payload.formDetail : formDetail)),
        };
      }
      return { ...state, formDetails: [...state.formDetails, payload.formDetail] };
    default:
      return state;
  }
};

export default forms;
