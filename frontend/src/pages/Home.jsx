import React from 'react';
import { Box, Typography } from '@mui/material';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WcIcon from '@mui/icons-material/Wc';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import SlideShow from 'components/SlideShow';
import CardWithImage from 'components/CardWithImage';
import FeatureShowcase from 'components/FeatureShowcase';
import HomePageImageList from 'components/HomePageImageList';

const homePageFeatures = [
  {
    title: '消費盡情　更要精明',
    content: 'ZA Card 是一張扣賬卡，沒有年費。簽賬時直接從活期賬戶扣數，幫你更容易掌握開支預算。',
    icon: <MobileFriendlyIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '支援感應式 Visa payWave',
    content: '付款時輕拍卡即可，簡單便捷。無需刷卡或簽名。',
    icon: <AddReactionIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '極致安全',
    content: '鎖卡及解鎖，在 App 內輕鬆辦妥。每筆交易均有即時推送通知，消費限額由你控制。',
    icon: <AddTaskIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: 'ZA Verify 全新驗證體驗',
    content: '網購時開 App 確認交易，更流暢、更安全。',
    icon: <AcUnitIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '現金提款',
    content: '認住 Visa logo，以實體卡免費於全港所有銀行超過 3,000 部櫃員機提取現金，同時亦支援全球近 300 萬部櫃員機。',
    icon: <WcIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '貼心設計',
    content: '實體卡沒有印上CVV及到期日，亦無需簽名，減少被盜用的風險。',
    icon: <AddReactionIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
];

const homePageScenarios = [
  {
    redirectTo: '/ecosystem/students',
    title: '學生族群',
    content: '一二三四五六七八',
    backgroundColor: '#F3B3DD',
    img: '/assets/scenario/student.png',
  },
  {
    redirectTo: '/ecosystem/workers',
    title: '小資族群',
    content: '一二三四五六七八',
    backgroundColor: '#F9C140',
    img: '/assets/scenario/worker.png',
  },
  {
    redirectTo: '/ecosystem/couples',
    title: '新婚夫婦',
    content: '一二三四五六七八',
    backgroundColor: '#32C39F',
    img: '/assets/scenario/couple.png',
  },
  {
    redirectTo: '/ecosystem/business',
    title: '微型企業',
    content: '一二三四五六七八九十',
    backgroundColor: '#2588FE',
    img: '/assets/scenario/business.png',
  },
  {
    redirectTo: '/ecosystem/retirees',
    title: '退休族群',
    content: '一二三四五六七八九十',
    backgroundColor: '#A07BF9',
    img: '/assets/scenario/retiree.png',
  },
];

const Home = () => (
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
      <CardWithImage scenarios={homePageScenarios} />
      <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '1.1em' }}>
        SnY為你準備最好
      </Typography>
      <FeatureShowcase features={homePageFeatures} />
      <Typography variant='h3' component='div' sx={{ marginTop: '2em', marginBottom: '0.3em' }}>
        SnY全面支援Web/App雙平台
      </Typography>
      <HomePageImageList />
    </Box>
  </>
);

export default Home;
