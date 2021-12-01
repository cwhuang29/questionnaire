import React, { useState, useDispatch } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';

const FormList = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Box component='form' sx={{ mt: 20 }}>
      This is form list
    </Box>
  );
};

export default FormList;
