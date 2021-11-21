import React, { useState } from 'react';
import { Box, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { login } from 'actions/auth';
import { useHistory } from 'react-router-dom';

const validationSchema = {
  email: Yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage('');

      await login(values)
        .then(() => history.push('/'))
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error);
        });
    },
  });

  return (
    <Box
      component="form"
    >
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <LoadingButton loading={loading} variant="contained" type="submit">
        Submit
      </LoadingButton>

      {errorMessage
      && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
};

export default Login;
