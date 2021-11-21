import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, Button, IconButton, Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Proptypes from 'prop-types';

const Menu = ({ currentUser }) => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Questionnaire
        </Typography>
        {currentUser
          ? <Link href="/profile" sx={{ color: 'white' }}>Profile</Link>
          : (
            <>
              <Button color="inherit">Login</Button>
              <Button color="inherit">Register</Button>
            </>
          )}
      </Toolbar>
    </AppBar>
  </Box>
);

Menu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentUser: Proptypes.object.isRequired,
};

export default Menu;
