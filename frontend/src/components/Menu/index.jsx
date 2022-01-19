import React from 'react';
import { useNavigate } from 'react-router-dom';
import Proptypes from 'prop-types';

import useAuth from '@hooks/useAuth';
import { isAdmin } from '@utils/admin.js';
import { toCapitalize } from '@utils/stringHelpers';

import { AppBar, Box, Divider, MenuItem, Toolbar, Typography } from '@mui/material';

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
  <MenuItem sx={{}} onClick={onClick}>
    <Typography variant='p' component='div' style={{ fontWeight: 'bold' }}>
      {toCapitalize(label)}
    </Typography>
  </MenuItem>
);

const Menu = () => {
  const navigate = useNavigate(); // To use useNavigate, this component should have a <BrowserRouter> higher up in the tree
  const { jwt } = useAuth();

  const onClick = (url) => () => navigate(`${url}`);
  const adminItems = isAdmin() ? [{ label: '創建問卷', url: '/create/form' }] : [];
  const menuBarItems = jwt
    ? [{ label: '登出', url: '/logout' }]
    : [
        { label: '登入', url: '/login' },
        { label: '註冊', url: '/register' },
      ];

  const allItems = [...menuBarItems, ...adminItems];

  return (
    <AppBar sx={{ backgroundColor: '#654FCE', position: 'sticky' }}>
      <Toolbar>
        <Box onClick={() => navigate('/')} sx={{ flexGrow: 1 }}>
          <Typography variant='h6' component='div' sx={{ cursor: 'default', fontWeight: 'bold' }}>
            ＸＸＸ問卷填寫平台
          </Typography>
        </Box>

        {
          // <Box onClick={() => navigate('/')} sx={{ flexGrow: 1 }}>
          //   <img src='/assets/logo.png' alt='Logo' width='173' sx={{ flexGrow: 1 }} />
          // </Box>
        }

        {allItems.map((menu, idx) => (
          <React.Fragment key={menu.label}>
            <MenuBarItem label={menu.label} onClick={onClick(menu.url)} />
            {idx !== allItems.length - 1 && <MenuBarDivider />}
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

export default Menu;
