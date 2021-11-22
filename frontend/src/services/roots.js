import axios from 'axios';

export const localAPI = axios.create({
  baseURL: 'http://localhost',
});
