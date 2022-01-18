import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { Autocomplete, Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';

const initialState = { label: '', options: [], isReverseGrading: false, maxPoint: 0 };

const actionType = {
  SET_QUESTION: 'SET_QUESTION',
  SET_OPTIONS: 'SET_OPTIONS',
  SET_REVERSE_GRADING: 'SET_REVERSE_GRADING',
  SET_MAX_POINT: 'SET_MAX_POINT',
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.SET_QUESTION:
      return { ...state, label: payload };
    case actionType.SET_OPTIONS:
      return { ...state, options: payload };
    case actionType.SET_REVERSE_GRADING:
      return { ...state, isReverseGrading: payload };
    case actionType.SET_MAX_POINT:
      return { ...state, maxPoint: payload };
    default:
      return state;
  }
};

export const Question = (props) => {
  const { id, role, handleChange } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const transferStateToParent = (changedInput) => handleChange({ id, ...state, ...changedInput });

  const handleReverseGradingChange = (evt) => {
    const payload = evt.target.checked;
    dispatch({ type: actionType.SET_REVERSE_GRADING, payload });
    transferStateToParent({ isReverseGrading: payload });
  };

  // An onChange event on an input of type number will give you the string corresponding to the entered number. That is a browser behaviour
  const handleMaxPointChange = (evt) => {
    const payload = parseInt(evt.target.value, 10);
    dispatch({ type: actionType.SET_MAX_POINT, payload });
    transferStateToParent({ maxPoint: payload });
  };

  const handleQuestionChange = (evt) => {
    const payload = evt.target.value;
    dispatch({ type: actionType.SET_QUESTION, payload });
    transferStateToParent({ label: payload });
  };

  const handleOptionsChange = (evt, newValue) => {
    const payload = newValue;
    dispatch({ type: actionType.SET_OPTIONS, payload });
    transferStateToParent({ options: payload });
  };

  return (
    <Stack spacing={1} sx={{ textAlign: 'center', marginBottom: '10px' }}>
      <Typography variant='h6' component='div' sx={{ textAlign: 'left' }}>
        問題{id + 1}
      </Typography>

      <Box style={{ display: 'flex' }}>
        <FormControlLabel control={<Checkbox checked={state.isReverseGrading} onChange={handleReverseGradingChange} />} label='是否為反向計分' />

        <TextField
          name={`${role}-${id}-max-point`}
          label='反向計分之總分'
          type='number'
          disabled={state.isReverseGrading === false}
          value={state.maxPoint}
          onChange={handleMaxPointChange}
          size='small'
        />
      </Box>

      <TextField fullWidth name={`${role}-${id}-question`} label='Question' value={state.label} onChange={handleQuestionChange} />

      <Autocomplete
        multiple
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        options={[]}
        renderOption={(_props, option) => <li {..._props}>{option}</li>}
        renderInput={(params) => <TextField {...params} label='Options' name={`${role}-${id}-option`} value={state.options} />}
        onChange={handleOptionsChange}
      />
    </Stack>
  );
};

Question.propTypes = {
  id: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
