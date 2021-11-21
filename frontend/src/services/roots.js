import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const localAPI = axios.create({
  baseURL: 'http://localhost:3000',
});
