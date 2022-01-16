import React from 'react';
import { useSearchParams } from 'react-router-dom';

import CardWithImageView from '@components/CardWithImage';
// import FeatureShowcase from '@components/FeatureShowcase';
// import HomePageImageList from '@components/HomePageImageList';
// import SlideShow from '@components/SlideShow';
import { CreditCardTransactionRecord } from '@components/Transaction';
import HomePageWrapper from '@home/HomePageWrapper';
import { isAdmin } from '@utils/admin.js';

// import { homePageScenarios } from '@pages/Home/homeData';
import { Typography } from '@mui/material';

import FormList from 'components/Form/FormList';

const Home = () => {
  const [searchParams] = useSearchParams();
  const showModal = searchParams.get('showModal') != null; // "127.0.0.1/?admin" or "127.0.0.1/?admin=" or "127.0.0.1/?admin=123"

  const name = '王小明';
  const count = 3;
  const admin = isAdmin();

  return (
    <HomePageWrapper>
      {admin ? (
        <>
          <Typography variant='h2' component='div' sx={{ fontWeight: 'bold', marginTop: '0.8em', marginBottom: '1.5em' }}>
            管理員{name}您好，歡迎來到ＸＸＸ問卷系統
          </Typography>
          <FormList />
        </>
      ) : (
        <>
          <Typography variant='h2' component='div' sx={{ fontWeight: 'bold', marginTop: '0.8em' }}>
            {name}您好，歡迎來到ＸＸＸ問卷系統
          </Typography>
          <Typography variant='h4' component='div' sx={{ margin: '0.35em 0 1.2em 0' }}>
            您還有<span style={{ color: 'red' }}>&nbsp;{count}&nbsp;</span>個問卷待填寫
          </Typography>
          <CardWithImageView />
          {showModal && <CreditCardTransactionRecord />}
          {/* <FeatureShowcase features={homePageFeatures} /> */}
          {/* <HomePageImageList /> */}
          {/* <SlideShow /> */}
        </>
      )}
    </HomePageWrapper>
  );
};

export default Home;
