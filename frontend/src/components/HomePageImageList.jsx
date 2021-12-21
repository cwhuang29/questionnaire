import * as React from 'react';
import { Box } from '@mui/material';

const images = {
  app: {
    title: 'App',
    img: '/assets/mockup/mockup-hncb-app-iphone-portrait.png',
  },
  web: {
    title: 'Web',
    img: '/assets/mockup/mockup-hncb-imac-front.png',
  },
  mascot: {
    title: '小恩',
    img: '/assets/mascot/mascot_gif.gif',
  },
};

const HomePageImageList = () => (
  <Box
    sx={{
      ml: 'auto',
      mr: 'auto',
      textAlign: 'center',
    }}
  >
    <img src={images.web.img} alt='Web mockup' height='500' />
    <img src={images.app.img} alt='App mockup' height='300' />
    <img src={images.mascot.img} alt='SnY mascot' width='300' />
  </Box>
);
// <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
//   {itemData.map((item) => (
//     <ImageListItem key={item.img}>
//       <img src={`${item.img}`} alt={item.title} loading='lazy' />
//     </ImageListItem>
//   ))}
// </ImageList>

export default HomePageImageList;
