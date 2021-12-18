import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const FeatureShowcaseItem = ({ prop }) => (
  <Box
    sx={{
      ml: 'auto',
      mr: 'auto',
      maxWidth: 300,
      textAlign: 'center',
    }}
  >
    {prop.icon}
    <Typography variant='h5' component='div' sx={{ paddingBottom: '15px', fontWeight: 'bold', whiteSpace: 'pre' }}>
      {prop.title}
    </Typography>
    <Typography variant='body1' component='div' sx={{}}>
      {prop.content}
    </Typography>
  </Box>
);

FeatureShowcaseItem.propTypes = {
  prop: Proptypes.object.isRequired,
};

export default FeatureShowcaseItem;
