import React from 'react';
import { useSearchParams } from 'react-router-dom';

import CardWithImage from '@components/CardWithImage';
import FeatureShowcase from '@components/FeatureShowcase';
import HomePageImageList from '@components/HomePageImageList';
import SlideShow from '@components/SlideShow';
import { CreditCardTransactionRecord } from '@components/Transaction';
import HomePageWrapper from '@home/HomePageWrapper';
import { homePageFeatures, homePageScenarios } from '@pages/Home/homeData';

import { Typography } from '@mui/material';

const Home = () => {
  const [searchParams] = useSearchParams();
  const showTxRecord = searchParams.get('bill') != null; // "127.0.0.1/?bill" or "127.0.0.1/?bill=" or "127.0.0.1/?bill=123"

  return (
    <>
      <SlideShow />
      <HomePageWrapper>
        <Typography variant='h2' component='div' sx={{ fontWeight: 'bold', marginTop: '0.45em' }}>
          SnY創新平台
        </Typography>
        <Typography variant='h4' component='div' sx={{ margin: '0.35em 0 1.2em 0' }}>
          讓你人生「華」起來不「南」
        </Typography>

        {showTxRecord && <CreditCardTransactionRecord />}

        <CardWithImage scenarios={homePageScenarios} />
        <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '1.1em' }}>
          SnY為你準備最好
        </Typography>
        <FeatureShowcase features={homePageFeatures} />
        <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '0.3em' }}>
          SnY全面支援Web/App雙平台
        </Typography>
        <HomePageImageList />
      </HomePageWrapper>
    </>
  );
};

export default Home;
