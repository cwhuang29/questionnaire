import React, { useEffect, useState, useContext } from 'react';
import { Box, createTheme, Grid, useMediaQuery, ThemeProvider } from '@mui/material';
import HomePageCardItem from 'components/HomePageCardItem';

const scenarios = [
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

// https://mui.com/customization/breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const HomePageCard = () => {
  const minWidthCheck = useMediaQuery('(min-width:750px)'); // When screen width is larger than # px, minWidthCheck equals to true

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container rowSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} columnSpacing={{ sm: 2, md: 3, lg: 4 }}>
          {scenarios.map((scenario) => (
            <Grid item xs={12} sm={12} md={6} key={scenario.title}>
              <HomePageCardItem prop={scenario} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default HomePageCard;
