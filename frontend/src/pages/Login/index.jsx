import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { login } from '@actions/auth';
import msg, { validateMsg } from '@constants/messages';
import useAuth from '@hooks/useAuth';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, TextField } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string('Enter your email').email('Enter a valid email').required(validateMsg.LOGIN.EMAIL_REQUIRED),
  password: Yup.string('Enter your password').min(8, validateMsg.LOGIN.PASSWORD_MIN).required(validateMsg.LOGIN.PASSWORD_REQUIRED),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuth();

  if (!auth) {
    navigate('/');
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
        .then(() => navigate('/'))
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
        overflowX: 'hidden',
      }}
      style={{
        width: '80%',
        maxWidth: '600px',
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
      <LoadingButton loading={loading} variant='contained' type='submit' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        Submit
      </LoadingButton>
    </Box>
  );
};

export default Login;
