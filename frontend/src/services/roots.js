import axios from 'axios';
import config from 'config.js';

// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.xsrfCookieName = "csrftoken";
// const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
// if(token) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
// }

// To send cookies in requests automatically
// XMLHttpRequest from a different domain cannot set cookie values for their own domain unless withCredentials is set to true before making the request
const httpConfig = {
  withCredentials: true,
  baseURL: config.baseURL,
  xsrfHeaderName: 'X-CSRF-Token',
  xsrfCookieName: 'csrftoken',
  headers: { 'Content-Type': 'application/json' },
};

const fetch = axios.create(httpConfig);

export default fetch;
