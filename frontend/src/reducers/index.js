import { combineReducers } from 'redux';
import auth from './auth';
import messages from './messages';
import forms from './forms';

export default combineReducers({
  auth,
  messages,
  forms,
});
