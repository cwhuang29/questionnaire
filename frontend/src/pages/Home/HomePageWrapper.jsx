import React from 'react';
import Proptypes from 'prop-types';

import { Box } from '@mui/material';

const HomePageWrapper = ({ children }) => (
  <Box
    component='form'
    sx={{
      mt: '20px',
      ml: 'auto',
      mr: 'auto',
      textAlign: 'center',
    }}
    style={{
      paddingLeft: 'min(70px, 8%)',
      paddingRight: 'min(70px, 8%)',
      overflowX: 'hidden',
      maxWidth: '1800px',
    }}
  >
    {children}
  </Box>
);

HomePageWrapper.propTypes = {
  children: Proptypes.array.isRequired,
};

export default HomePageWrapper;
