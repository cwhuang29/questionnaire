import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'components/Menu';

const NavBar = ({ currentUser }) => (
  <header className='App-header'>
    <Menu currentUser={currentUser} />
  </header>
);

NavBar.defaultProps = {
  currentUser: {},
};

NavBar.propTypes = {
  currentUser: PropTypes.object,
};

export default NavBar;
