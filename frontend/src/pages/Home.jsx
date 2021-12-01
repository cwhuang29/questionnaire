import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';

import FormWrapper from 'components/FormWrapper';

const Home = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Box
      component='form'
      sx={{
        mt: 20,
        pl: '10%',
        pr: '10%',
        ml: 'auto',
        mr: 'auto',
        textAlign: 'center',
      }}
    >
      Thie is Home Page
      <FormWrapper />
    </Box>
  );
};

export default Home;
