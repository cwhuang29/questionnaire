import { LOAN_STATUS } from '@constants/actionTypes';
import loanService from '@services/loan.service';

export const getCreditCardLoan = () => (dispatch) =>
  loanService
    .getCreditCardTx()
    .then((resp) => {
      dispatch({
        type: LOAN_STATUS.FETCH_LOAN_SUCCESS,
        payload: { load: resp.data },
      });
      return Promise.resolve(resp.data);
    })
    .catch((err) => Promise.reject(err.response));
