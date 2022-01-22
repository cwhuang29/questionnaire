import React from 'react';
import { useSearchParams } from 'react-router-dom';

import CardWithImageView from '@components/CardWithImage';
import FormList from '@components/Form/FormList';
import PageWrapper from '@components/HomePageWrapper';
// import FeatureShowcase from '@components/FeatureShowcase';
// import HomePageImageList from '@components/HomePageImageList';
// import SlideShow from '@components/SlideShow';
import { CreditCardTransactionRecord } from '@components/Transaction';
import { isAdmin } from '@utils/admin.js';

// import { homePageScenarios } from '@pages/Home/homeData';
import { Typography } from '@mui/material';

const Home = () => {
  const [searchParams] = useSearchParams();
  const showModal = searchParams.get('showModal') != null; // "127.0.0.1/?admin" or "127.0.0.1/?admin=" or "127.0.0.1/?admin=123"

  const name = '王小明';
  const count = 3;
  const admin = isAdmin();

  return (
    <PageWrapper>
      {admin ? (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginTop: '0.8em' }}>
            量表清單
          </Typography>
          <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginTop: '0.3em', marginBottom: '1em' }}>
            若要看量表的更多資訊，請在名稱上連擊
          </Typography>
          <FormList />
          <br />
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
    </PageWrapper>
  );
};

export default Home;
