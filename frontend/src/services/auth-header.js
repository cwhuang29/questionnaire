const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // const csrfToken = '';
  // const headers = { 'X-CSRF-TOKEN': csrfToken };

  if (user && user.token) {
    return { Authorization: user.token };
  }
  return {};
};

export default authHeader;
