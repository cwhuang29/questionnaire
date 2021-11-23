import * as React from 'react';
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Proptypes from 'prop-types';


const Menu = ({ currentUser }) => {
  const history = useHistory();

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Questionnaire
          </Typography>
          {currentUser ? (
            <Link href='/profile' sx={{ color: 'white' }}>
              Profile
            </Link>
          ) : (
            <>
              <Button color='inherit' onClick={() => history.push('/login')}>Login</Button>
              <Button color='inherit' onClick={() => history.push('/register')}>Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Menu.defaultProps = {
  currentUser: {}
};

Menu.propTypes = {
  currentUser: Proptypes.object,
};

export default Menu;
