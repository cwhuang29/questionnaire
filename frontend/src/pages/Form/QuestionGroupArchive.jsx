import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { Autocomplete, Stack, TextField, Typography } from '@mui/material';

const initialState = { studentQuestion: '', studentOptions: [], parentQuestion: '', parentOptions: [], teacherQuestion: '', teacherOptions: [] };

const actionType = {
  SET_STUDENT_QUESTION: 'SET_STUDENT_QUESTION',
  SET_STUDENT_OPTIONS: 'SET_STUDENT_OPTIONS',
  SET_PARENT_QUESTION: 'SET_PARENT_QUESTION',
  SET_PARENT_OPTIONS: 'SET_PARENT_OPTIONS',
  SET_TEACHER_QUESTION: 'SET_TEACHER_QUESTION',
  SET_TEACHER_OPTIONS: 'SET_TEACHER_OPTIONS',
};

const reducer = (state, action) => {
  const { type, payload } = action;
  console.log(state);

  switch (type) {
    case actionType.SET_STUDENT_QUESTION:
      return { ...state, studentQuestion: payload };
    case actionType.SET_STUDENT_OPTIONS:
      return { ...state, studentOptions: payload };
    case actionType.SET_PARENT_QUESTION:
      return { ...state, parentQuestion: payload };
    case actionType.SET_PARENT_OPTIONS:
      return { ...state, parentOptions: payload };
    case actionType.SET_TEACHER_QUESTION:
      return { ...state, teacherQuestion: payload };
    case actionType.SET_TEACHER_OPTIONS:
      return { ...state, teacherOptions: payload };
    default:
      return state;
  }
};

export const QuestionGroup = (props) => {
  const { id } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Stack spacing={1} sx={{ textAlign: 'center' }}>
      <Typography variant='h6' component='div' sx={{ textAlign: 'left' }}>
        問題{id}
      </Typography>
      <TextField
        fullWidth
        name='student-question'
        label='學生的問題'
        value={state.studentQuestion}
        onChange={(evt) => dispatch({ type: actionType.SET_STUDENT_QUESTION, payload: evt.target.value })}
        // onBlur={(evt) => dispatch({ type: actionType.SET_STUDENT_QUESTION, payload: evt.target.value })} // Redundunt
      />
      <Autocomplete
        multiple
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        options={[]}
        renderOption={(_props, option) => <li {..._props}>{option.label}</li>}
        renderInput={(params) => <TextField {...params} label='選項' name='student-option' value={state.studentOptions} />}
        onChange={(evt, newValue) => dispatch({ type: actionType.SET_STUDENT_OPTIONS, payload: newValue })}
      />
      <br />
      <TextField
        fullWidth
        name='parent-question'
        label='家長的問題'
        value={state.parentQuestion}
        onChange={(evt) => dispatch({ type: actionType.SET_PARENT_QUESTION, payload: evt.target.value })}
      />
      <Autocomplete
        multiple
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        options={[]}
        renderOption={(_props, option) => <li {..._props}>{option.label}</li>}
        renderInput={(params) => <TextField {...params} label='選項' name='parent-option' value={state.parentOptions} />}
        onChange={(evt, newValue) => dispatch({ type: actionType.SET_PARENT_OPTIONS, payload: newValue })}
      />
      <br />
      <TextField
        fullWidth
        name='teacher-question'
        label='老師的問題'
        value={state.teacherQuestion}
        onChange={(evt) => dispatch({ type: actionType.SET_TEACHER_QUESTION, payload: evt.target.value })}
      />
      <Autocomplete
        multiple
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        options={[]}
        renderOption={(_props, option) => <li {..._props}>{option.label}</li>}
        renderInput={(params) => <TextField {...params} label='選項' name='teacher-option' value={state.teacherOptions} />}
        onChange={(evt, newValue) => dispatch({ type: actionType.SET_TEACHER_OPTIONS, payload: newValue })}
      />
    </Stack>
  );
};

QuestionGroup.propTypes = {
  id: PropTypes.number.isRequired,
};
