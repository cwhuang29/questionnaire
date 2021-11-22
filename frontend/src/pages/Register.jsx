import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, TextField, Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ROLES from 'shared/constant/roles';
import { register } from 'actions/auth';

const validationSchema = Yup.object({
  firstName: Yup
    .string('Enter your first name')
    .required('First name is required'),
  lastName: Yup
    .string('Enter your last name')
    .required('Last name is required'),
  email: Yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  changepassword: Yup.string().when('password', {
    is: (val) => (!!(val && val.length > 0)),
    then: Yup.string().oneOf(
      [Yup.ref('password')],
      'Both password need to be the same',
    ),
  }),
  role: Yup
    .string('Select a role')
    .required('Role is required'),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

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
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error);
        });
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ mt: 20 }}
    >

      <TextField
        fullWidth
        id="firstName"
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
      <TextField
        fullWidth
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
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

      <FormControl fullWidth>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          name="role"
          value={formik.values.role}
          label="Age"
          onChange={formik.handleChange}
        >
          {ROLES.map(({value, label}) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </Select>
      </FormControl>

      <LoadingButton loading={loading} variant="contained" type="submit">
        Submit
      </LoadingButton>

      {errorMessage
      && <Alert severity="error">{errorMessage}</Alert>}

    </Box>
  );
};

export default Register;
