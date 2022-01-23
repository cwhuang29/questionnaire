import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import { useSearchParams } from 'react-router-dom';
import FormList from '@components/Form/FormList';
import PageWrapper from '@components/HomePageWrapper';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import useAuth from '@hooks/useAuth';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import msg from '@shared/constants/messages';
// import FeatureShowcase from '@components/FeatureShowcase';
// import HomePageImageList from '@components/HomePageImageList';
// import SlideShow from '@components/SlideShow';
import { isAdmin } from '@utils/admin.js';

// import { homePageScenarios } from '@pages/Home/homeData';
import { Typography } from '@mui/material';

import HomeUser from './HomeUser';

const Home = () => {
  // const [searchParams] = useSearchParams();
  // const isAdminURL = searchParams.get('admin') != null; // "127.0.0.1/?admin" or "127.0.0.1/?admin=" or "127.0.0.1/?admin=123"
  const navigate = useNavigate();
  const admin = isAdmin();
  const { jwt } = useAuth();
  const { addGlobalMessage } = useGlobalMessageContext();

  // Without useEffect:
  // 01. Warning: Cannot update a component (`BrowserRouter`) while rendering a different component (`Login`). To locate the bad setState() call inside `Login`
  // 02. You should call navigate() in a React.useEffect(), not when your component is first rendered.
  useEffect(() => {
    if (!jwt) {
      addGlobalMessage({
        title: msg.LOGIN_REQUIRED,
        severity: GLOBAL_MESSAGE_SERVERITY.INFO,
        timestamp: Date.now(),
      });
      navigate('/login');
    }
  }, []);

  return (
    <PageWrapper>
      {/* eslint-disable-next-line no-nested-ternary */}
      {admin ? (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginTop: '0.8em' }}>
            量表清單
          </Typography>
          <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginTop: '0.3em', marginBottom: '1em' }}>
            若要看量表的更多資訊，請在名稱上連擊
          </Typography>
          <FormList />
        </>
      ) : jwt ? (
        <HomeUser />
      ) : (
        <div />
      )}
      <br />
    </PageWrapper>
  );
};

export default Home;

/* <FeatureShowcase features={homePageFeatures} /> */
/* <HomePageImageList /> */
/* <SlideShow /> */
