import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { AppBar, Box, Divider, IconButton, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { toCapitalize } from 'shared/utils/stringHelpers';

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

const MenuBarItem = ({ menu, onClick }) => (
  <MenuItem sx={{ fontWeight: 'bold' }} onClick={onClick}>
    {toCapitalize(menu)}
  </MenuItem>
);

const Menu = ({ user }) => {
  const history = useHistory();

  const onClick = (menu) => () => history.push(`/${menu}`);
  const menuBarItems = ['spend', 'borrow', 'invest', 'insure', 'health'];
  const userStatusItems = user ? ['profile'] : ['login', 'register'];
  const menuBarItemsWithUser = [...menuBarItems, ...userStatusItems];

  return (
    <Box>
      <AppBar sx={{ backgroundColor: '#7BA3F9' }}>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' component='div' onClick={() => history.push('/')} sx={{ flexGrow: 1, cursor: 'default', fontWeight: 'bold' }}>
            HNCB Bank
          </Typography>

          {menuBarItemsWithUser.map((menu, idx) => (
            <React.Fragment key={menu}>
              <MenuBarItem menu={menu} onClick={onClick(menu)} />
              {idx !== menuBarItemsWithUser.length - 1 && <MenuBarDivider />}
            </React.Fragment>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

MenuBarItem.propTypes = {
  menu: Proptypes.string.isRequired,
  onClick: Proptypes.func.isRequired,
};

Menu.defaultProps = {
  user: {},
};

Menu.propTypes = {
  user: Proptypes.object,
};

export default Menu;
