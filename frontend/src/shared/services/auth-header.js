import { LOCAL_STORAGE_NAME } from '@constants/storage';

// const csrfToken = '';
// const headers = { 'X-CSRF-TOKEN': csrfToken };

const authHeader = () => {
  const auth = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME.AUTH));

  if (auth.jwt) {
    return { Authorization: `Bearer ${auth.jwt}` };
  }
  return {};
};

export default authHeader;
