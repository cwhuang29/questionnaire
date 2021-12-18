import React from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

// https://mui.com/system/basics/#demo
// https://mui.com/components/cards
const HomePageCardItem = ({ prop }) => {
  const history = useHistory();

  return (
    <Card
      sx={{
        minWidth: 300,
        height: 130,
        display: 'flex',
        textAlign: 'left',
        color: 'white',
        backgroundColor: prop.backgroundColor,
      }}
    >
      <CardActionArea onClick={() => history.push(prop.redirectTo)}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
            {prop.title}
          </Typography>
          <Typography variant='body2' align='left' sx={{ fontWeight: 'bold' }}>
            {prop.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

HomePageCardItem.propTypes = {
  prop: Proptypes.object.isRequired,
};

export default HomePageCardItem;
