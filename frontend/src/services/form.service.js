import authHeader from './auth-header';
import fetch from './roots';

const getAllForm = (token = authHeader()) =>
  fetch.get('/v2/forms', { headers: token });

const getForm = ({ id, role }) => fetch.get('/v2/formNameAll', { id, role });

export default {
  getAllForm,
  getForm,
};
