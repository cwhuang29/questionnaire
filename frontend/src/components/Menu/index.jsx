import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Proptypes from 'prop-types';

import { toCapitalize } from '@utils/stringHelpers';

import { AppBar, Box, Divider, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';

const MenuBarDivider = () => (
  <Divider
    orientation='vertical'
    flexItem
    sx={{
      ml: '14px',
      mr: '14px',
      mt: '21px !important',
      mb: '10px',
      height: '1.3rem',
      width: '0.02rem',
      borderColor: '#cfd0d6',
    }}
  />
);

const MenuBarItem = ({ label, onClick }) => (
  <MenuItem sx={{ fontWeight: 'bold' }} onClick={onClick}>
    <Typography variant='h6' component='div' style={{ fontWeight: 'bold' }}>
      {toCapitalize(label)}
    </Typography>
  </MenuItem>
);

const Menu = ({ auth }) => {
  const navigate = useNavigate(); // To use useNavigate, this component should have a <BrowserRouter> higher up in the tree
  const location = useLocation();
  const widthCheck = useMediaQuery('(min-width:500px)'); // Equals to true when screen width is larger than # px

  const onClick = (menuURL) => () => navigate(`${menuURL}`);
  // const menuBarItems = ['spend', 'borrow', 'invest', 'insure', 'health'];
  // const userStatusItems = auth ? ['profile'] : ['login', 'register'];
  // const menuBarItemsWithUser = [...menuBarItems, ...userStatusItems];
  const scenarioMenuBar = widthCheck && location.pathname.indexOf('ecosystem') !== -1 ? ['食', '衣', '住', '行', '育', '樂'] : [];
  const navBarItem = [{ label: '你今天SnY了嗎?', url: '/ecosystem' }];

  console.log(scenarioMenuBar);

  return (
    <AppBar sx={{ backgroundColor: '#B68AB0', position: 'sticky' }} user={auth}>
      <Toolbar>
        {
          // <Typography variant='h6' component='div' sx={{ flexGrow: 1, cursor: 'default', fontWeight: 'bold' }}>
          //   This is title
          // </Typography>
        }

        <Box onClick={() => navigate('/')} sx={{ flexGrow: 1 }}>
          <img src='/assets/hncb-logo.png' alt='HNCB logo' width='173' sx={{ flexGrow: 1 }} />
        </Box>

        {navBarItem.map((menu, idx) => (
          <React.Fragment key={menu.label}>
            <MenuBarItem label={menu.label} onClick={onClick(menu.url)} />
            {idx !== navBarItem.length - 1 && <MenuBarDivider />}
          </React.Fragment>
        ))}
      </Toolbar>
    </AppBar>
  );
};

MenuBarItem.propTypes = {
  label: Proptypes.string.isRequired,
  onClick: Proptypes.func.isRequired,
};

Menu.defaultProps = {
  auth: {},
};

Menu.propTypes = {
  auth: Proptypes.object,
};

export default Menu;
