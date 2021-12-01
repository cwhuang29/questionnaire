import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'components/Menu';

const NavBar = ({ user }) => (
  <header className='App-header'>
    <Menu user={user} />
  </header>
);

NavBar.defaultProps = {
  user: {},
};

NavBar.propTypes = {
  user: PropTypes.object,
};

export default NavBar;
