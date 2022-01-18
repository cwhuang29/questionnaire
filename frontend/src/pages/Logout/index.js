import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout } from '@actions/auth';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => dispatch(logout()), []);

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
