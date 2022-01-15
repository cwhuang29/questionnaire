import { combineReducers } from 'redux';

import auth from '@reducers/auth';
import forms from '@reducers/forms';
import loan from '@reducers/loan';
import messages from '@reducers/messages';

export default combineReducers({
  auth,
  messages,
  forms,
  loan,
});
