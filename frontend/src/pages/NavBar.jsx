import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'components/Menu';

const NavBar = ({ user }) => (
  <div style={{display: 'block', height: '64px'}}>
    <Menu user={user} />
  </div>
);

NavBar.defaultProps = {
  user: {},
};

NavBar.propTypes = {
  user: PropTypes.object,
};

export default NavBar;
