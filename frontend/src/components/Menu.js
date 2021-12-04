import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
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

const Menu = ({ user }) => {
  const history = useHistory();
  const menuBarItems = ['spend', 'borrow', 'invest', 'insure', 'health'];

  return (
    <Box>
      <AppBar sx={{ backgroundColor: '#7BA3F9' }}>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant='h6'
            component='div'
            onClick={() => history.push('/')}
            sx={{ flexGrow: 1, cursor: 'default', fontWeight: 'bold' }}
          >
            HNCB Bank
          </Typography>

          {menuBarItems.map((menu) => (
            <>
              <MenuItem sx={{ fontWeight: 'bold' }} onClick={() => history.push(`/${menu}`)}>
                {toCapitalize(menu)}
              </MenuItem>
              <MenuBarDivider />
            </>
          ))}

          {user ? (
            <Link href='/profile' sx={{ color: 'white', fontWeight: 'bold' }}>
              Profile
            </Link>
          ) : (
            <>
              <Button sx={{ fontWeight: 'bold' }} color='inherit' onClick={() => history.push('/login')}>
                Login
              </Button>
              <MenuBarDivider />
              <Button sx={{ fontWeight: 'bold' }} color='inherit' onClick={() => history.push('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Menu.defaultProps = {
  user: {},
};

Menu.propTypes = {
  user: Proptypes.object,
};

export default Menu;
