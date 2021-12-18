import React from 'react';
import { Box, createTheme, Grid, useMediaQuery, ThemeProvider } from '@mui/material';
import FeatureShowcaseItem from 'components/FeatureShowcaseItem';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WcIcon from '@mui/icons-material/Wc';
import AcUnitIcon from '@mui/icons-material/AcUnit';

// https://mui.com/customization/breakpoints/
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
});

const features = [
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

const FeatureShowcase = () => {
  const minWidthCheck = useMediaQuery('(min-width:750px)'); // When screen width is larger than # px, minWidthCheck equals to true

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container rowSpacing={{ sm: 1, md: 2, lg: 3 }} columnSpacing={{ sm: 2, md: 4, lg: 5 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4}>
              <FeatureShowcaseItem key={feature.title} prop={feature} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FeatureShowcase;
