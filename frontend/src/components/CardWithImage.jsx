import React from 'react';
import { Box, createTheme, Grid, useMediaQuery, ThemeProvider } from '@mui/material';
import CardWithImageItem from 'components/CardWithImageItem';

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

// const minWidthCheck = useMediaQuery('(min-width:750px)'); // When screen width is larger than # px, minWidthCheck equals to true
const CardWithImage = ({ scenarios }) => (
  <ThemeProvider theme={theme}>
    <Box>
      <Grid container rowSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} columnSpacing={{ sm: 2, md: 3, lg: 4 }}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} sm={12} md={6} key={scenario.title}>
            <CardWithImageItem prop={scenario} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </ThemeProvider>
);

CardWithImage.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CardWithImage;
