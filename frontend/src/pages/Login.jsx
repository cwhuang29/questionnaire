import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { login } from 'actions/auth';

import msg, { validateMsg } from 'shared/constant/messages';

const validationSchema = Yup.object({
  email: Yup.string('Enter your email').email('Enter a valid email').required(validateMsg.LOGIN.EMAIL_REQUIRED),
  password: Yup.string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required(validateMsg.LOGIN.PASSWORD_REQUIRED),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    history.push('/');
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage('');

      await dispatch(login(values))
        .then(() => history.push('/'))
        .catch((err) => {
          setLoading(false);
          const errMsg = err?.errHead || err?.errBody ? JSON.stringify(err) : msg.UNKNOWN_ERROR;
          setErrorMessage(errMsg);
        });
    },
  });

  return (
    <Box
      component='form'
      onSubmit={formik.handleSubmit}
      sx={{
        mt: '80px',
        ml: 'auto',
        mr: 'auto',
        textAlign: 'center',
      }}
      style={{
        width: 'min(500px, 85%)',
      }}
    >
      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <br />
      <TextField
        fullWidth
        id='email'
        name='email'
        label='Email'
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        autoFocus
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id='password'
        name='password'
        label='Password'
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        style={{ marginBottom: '20px' }}
      />
      <LoadingButton
        loading={loading}
        variant='contained'
        type='submit'
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default Login;
