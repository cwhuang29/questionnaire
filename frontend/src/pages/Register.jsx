import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ROLES from 'shared/constant/roles';
import { register } from 'actions/auth';
import { validateMsg } from 'shared/constant/messages';

const validationSchema = Yup.object({
  firstName: Yup.string().required(validateMsg.REGISTER.FIRST_NAME_REQUIRED).max(50, validateMsg.TOO_LONG),
  lastName: Yup.string().required(validateMsg.REGISTER.LAST_NAME_REQUIRED).max(50, validateMsg.TOO_LONG),
  email: Yup.string().email('Enter a valid email').required(validateMsg.REGISTER.EMAIL_REQUIRED),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required(validateMsg.REGISTER.PASSWORD_REQUIRED),
  changepassword: Yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: Yup.string().oneOf([Yup.ref('password')], 'Both password need to be the same'),
  }),
  role: Yup.string().required(validateMsg.REGISTER.ROLE_REQUIRED),
});

const Register = () => {
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
        .then(() => history.push('/login'))
        .catch((err) => {
          setLoading(false);

          if (err.errHead) {
            setErrorMessage(err.errHead + err.errBody);
          } else {
            const msg = Object.entries(err.error)
              .map(([key, val]) => `${key}: ${val}`)
              .join('<br>');
            setErrorMessage(msg);
          }
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
      {formik.touched.role && formik.errors.role && <Alert severity='error'>{formik.errors.role}</Alert>}
      {errorMessage && (
        <Alert severity='error' style={{ marginBottom: '20px' }}>
          {errorMessage}
        </Alert>
      )}
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
          {Object.entries(ROLES).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
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
