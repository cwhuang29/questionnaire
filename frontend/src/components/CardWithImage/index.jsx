import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormByUser } from '@actions/form';
import withFetchService from '@shared/hooks/withFetchService';

import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, createTheme, ThemeProvider, Typography } from '@mui/material';

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

export const emptyForms = [
  {
    redirectTo: '',
    title: '問卷01',
    img: '/assets/persona/student.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '問卷02',
    img: '/assets/persona/student.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '問卷03',
    img: '/assets/persona/student.jpeg',
  },
];

const CardWithImageView = (props) => {
  const navigate = useNavigate();
  const { data: forms, isLoading } = props;

  const writeDisplay = '開始填寫';
  const onClick = (url) => () => navigate(url);
  const displayForms = isLoading || Object.keys(forms).length === 0 ? emptyForms : forms;

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
        {displayForms.map((form) => (
          <Card
            key={form.title}
            // Optimal for five items
            sx={{
              maxWidth: '700px',
              minWidth: '285px',
              width: '18%',
              margin: '15px min(3%, 10px)',
              borderRadius: '9px',
              pointerEvents: form.disable ? 'none' : '',
              cursor: form.disable ? 'default' : 'pointer',
            }}
            // Optimal for seven items
            // sx={{
            //   maxWidth: '300px',
            //   minWidth: '205px',
            //   width: '12%',
            //   margin: '10px min(2%, 5px)',
            //   borderRadius: '9px',
            //   pointerEvents: form.disable ? 'none' : '',
            //   cursor: form.disable ? 'default' : 'pointer',
            // }}
          >
            <CardActionArea>
              <Box onClick={onClick(form.redirectTo)}>
                <CardMedia component='img' height='180' image={form.img} alt='' />
                <CardContent sx={{ padding: '16px 0 !important' }}>
                  <Typography gutterBottom variant='h5' component='div' sx={{ marginTop: '2px' }}>
                    {form.title}
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
            <CardActions>
              <Button size='small' onClick={onClick(form.redirectTo)}>
                {writeDisplay}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

const getFormByUserForComponent = () => () => getFormByUser();

const CardWithImage = () => {
  const CardWithData = withFetchService(CardWithImageView, getFormByUserForComponent());
  return <CardWithData />;
};

CardWithImageView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CardWithImage;
