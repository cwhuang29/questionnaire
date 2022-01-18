import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

const HomePageWrapper = ({ children }) => (
  <Box
    sx={{
      mt: '20px',
      ml: 'min(70px, 8%)',
      mr: 'min(70px, 8%)',
      textAlign: 'center',
    }}
    style={{
      overflowX: 'hidden',
      maxWidth: '1800px',
    }}
  >
    {children}
  </Box>
);

HomePageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

export default HomePageWrapper;
