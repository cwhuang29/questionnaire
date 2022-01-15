import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Box, Card, CardActionArea, CardContent, CardMedia, createTheme, ThemeProvider, Typography } from '@mui/material';

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

const CardWithImage = ({ scenarios }) => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexFlow: 'row wrap', // A property that replaces flex-wrap and flex-direction
          // flexDirection: minWidthCheck ? 'row' : 'column', // With flexFlow enabled, this is redundant
          alignContent: 'space-between',
          justifyContent: 'center',
        }}
      >
        {scenarios.map((scenario) => (
          <Card
            key={scenario.title}
            sx={{
              maxWidth: '300px',
              minWidth: '205px',
              width: '12%',
              margin: '10px min(2%, 5px)',
              borderRadius: '9px',
              pointerEvents: scenario.disable ? 'none' : '',
              cursor: scenario.disable ? 'default' : 'pointer',
            }}
            // Optimal for five items
            // sx={{
            //   maxWidth: '700px',
            //   minWidth: '285px',
            //   width: '18%',
            //   margin: '15px min(3%, 10px)',
            //   borderRadius: '9px',
            //   pointerEvents: scenario.disable ? 'none' : '',
            //   cursor: scenario.disable ? 'default' : 'pointer',
            // }}
          >
            <CardActionArea>
              <Box onClick={() => navigate(scenario.redirectTo)}>
                <CardMedia component='img' height='180' image={scenario.img} alt='' />
                <CardContent sx={{ padding: '16px 0 !important' }}>
                  <Typography gutterBottom variant='h5' component='div' sx={{ marginTop: '2px' }}>
                    {scenario.title}
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

// <CardActions>
//   <Button size='small'>Share</Button>
// </CardActions>

CardWithImage.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CardWithImage;
