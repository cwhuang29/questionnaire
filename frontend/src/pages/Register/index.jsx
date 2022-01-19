import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { register } from '@actions/auth';
import { validateMsg } from '@constants/messages';
import ROLES from '@constants/roles';
import useAuth from '@hooks/useAuth';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const validationSchema = Yup.object({
  firstName: Yup.string().required(validateMsg.REGISTER.FIRST_NAME_REQUIRED).max(50, validateMsg.TOO_LONG),
  lastName: Yup.string().required(validateMsg.REGISTER.LAST_NAME_REQUIRED).max(50, validateMsg.TOO_LONG),
  email: Yup.string().email('Enter a valid email').required(validateMsg.REGISTER.EMAIL_REQUIRED),
  password: Yup.string().min(8, 'Password should be of minimum 8 characters length').required(validateMsg.REGISTER.PASSWORD_REQUIRED),
  changepassword: Yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: Yup.string().oneOf([Yup.ref('password')], 'Both password need to be the same'),
  }),
  role: Yup.string().required(validateMsg.REGISTER.ROLE_REQUIRED),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jwt } = useAuth();

  // Without useEffect:
  // 01. Warning: Cannot update a component (`BrowserRouter`) while rendering a different component (`Login`). To locate the bad setState() call inside `Login`
  // 02. You should call navigate() in a React.useEffect(), not when your component is first rendered.
  useEffect(() => {
    if (jwt) navigate('/');
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage('');

      await dispatch(register(values))
        .then(() => navigate('/login'))
        .catch((err) => {
          setLoading(false);
          setErrorMessage(`${err.title}. ${err.content || ''}`);
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
      {formik.touched.role && formik.errors.role && <Alert severity='error'>{formik.errors.role}</Alert>}
      {errorMessage && (
        <Alert severity='error' style={{ textAlign: 'left' }}>
          {errorMessage}
        </Alert>
      )}
      <br />
      <TextField
        fullWidth
        id='firstName'
        name='firstName'
        label='First Name'
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id='lastName'
        name='lastName'
        label='Last Name'
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id='email'
        name='email'
        label='Email'
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
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
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id='role'>Role</InputLabel>
        <Select
          labelId='role-label'
          id='role'
          name='role'
          value={formik.values.role}
          label='role'
          onChange={formik.handleChange}
          error={formik.touched.role && Boolean(formik.errors.role)}
        >
          {Object.entries(ROLES).map(
            ([value, label]) =>
              value < 4 && (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <LoadingButton loading={loading} variant='contained' type='submit'>
        Submit
      </LoadingButton>
    </Box>
  );
};

// TODO
// {formik.touched.password && Boolean(formik.errors.password) && <ErrorMessage formik={formik} name="password" componen="div" className="text-red-500 text-xs" />}

export default Register;