import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';

import SlideShow from 'components/SlideShow';
import FormList from 'components/FormList';
import { TitleText } from 'components/styledComponents/Text';

const Home = () => {
  const history = useHistory();

  return (
    <>
      <SlideShow />
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
        <TitleText width='400px' height='35px' lineHeight='1.5' fontSize='18px'>
          This is home page
        </TitleText>
        <FormList />
      </Box>
    </>
  );
};

export default Home;
