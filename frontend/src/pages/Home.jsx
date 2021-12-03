import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';

import FormWrapper from 'components/FormWrapper';
import { TitleText } from 'components/styledComponents/Text';

const Home = () => {
  const history = useHistory();

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
      <TitleText width='400px' height='35px' lineHeight='1.5' fontSize='18px'>
        This is home page
      </TitleText>
      <FormWrapper />
    </Box>
  );
};

export default Home;
