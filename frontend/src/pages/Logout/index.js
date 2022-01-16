import React from 'react';
import { Link } from 'react-router-dom';

import AuthService from '@services/auth.service';

const Logout = () => {
  AuthService.logout();

  return (
    <div>
      <h2>You have logout!</h2>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </div>
  );
};
export default Logout;
