import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AppBar, Box, Typography, IconButton } from '@mui/material';
import SlideShow from 'components/SlideShow';
import HomePageCard from 'components/HomePageCard';
import FeatureShowcase from 'components/FeatureShowcase';
import HomePageImageList from 'components/HomePageImageList';

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
        <Typography variant='h2' component='div' sx={{ fontWeight: 'bold', marginTop: '0.7em' }}>
          SnY創新平台
        </Typography>
        <Typography variant='h5' component='div' sx={{ marginBottom: '1.2em' }}>
          讓你人生「華」起來不「南」
        </Typography>
        <HomePageCard />
        <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '1.1em' }}>
          SnY為你準備最好
        </Typography>
        <FeatureShowcase />
        <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '0.3em' }}>
          SnY全面支援Web/App雙平台
        </Typography>
        <HomePageImageList />
      </Box>
    </>
  );
};

export default Home;
