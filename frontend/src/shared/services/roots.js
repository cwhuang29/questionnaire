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

/*
const fetchError = (err) => {
  if (err.response) {
    // Request made and server responded
    console.log(err.response.data);
    console.log(err.response.status);
    console.log(err.response.headers);
  } else if (err.request) {
    // The request was made but no response was received
    console.log(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', err.message);
  }
  return err;
};

fetch.interceptors.request.use(
  // Do something before request is sent
  (config) => config,
  // Do something with request error
  (error) => Promise.reject(error)
);

// Add a response interceptor
fetch.interceptors.response.use(
  // Do something with response data
  (response) => response,
  // Do something with response error
  (error) => Promise.reject(error)
);
*/

export default fetch;
