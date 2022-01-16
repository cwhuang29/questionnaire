import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { login } from '@actions/auth';
import msg, { validateMsg } from '@constants/messages';

import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, createFilterOptions, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { createFormActionType, getDefaultQuestionState, initialQuestionsState, optionsCountList, roles } from './createFormData';
import { FormModal } from './FormModal';
import { Question } from './Question';
import { RoleDivider } from './RoleDivider';

const filter = createFilterOptions();

const researchList = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

const questionsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case createFormActionType.ADD_QUESTION:
      return {
        ...state,
        counter: { ...state.counter, [payload.role]: state.counter[payload.role] + 1 },
        questions: { ...state.questions, [payload.role]: [...state.questions[payload.role], getDefaultQuestionState(state.counter[payload.role])] },
      };
    case createFormActionType.SET_QUESTION:
      return {
        ...state,
        questions: {
          ...state.questions,
          [payload.role]: state.questions[payload.role].map((question) => (question.id === payload.value.id ? payload.value : question)),
        },
      };
    default:
      return state;
  }
};

const validationSchema = Yup.object({
  researchName: Yup.string().required(validateMsg.REQUIRED),
  formName: Yup.string().required(validateMsg.REQUIRED),
  formCustId: Yup.string().required(validateMsg.REQUIRED),
  minScore: Yup.number(validateMsg.IS_NUMBER).required(validateMsg.REQUIRED),
  optionsCount: Yup.number().min(1).max(10).required(validateMsg.REQUIRED),
  // date: Yup.date().default(() => new Date()).max(new Date(), "Are you a time traveler?!"),
  // wouldRecommend: Yup.boolean().default(false),
});

export const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [questionState, questionDispatch] = useReducer(questionsReducer, initialQuestionsState);

  const handleChildChange =
    ({ role }) =>
    (value) =>
      questionDispatch({ type: createFormActionType.SET_QUESTION, payload: { role, value } });

  const modalOnClose = () => {
    setModalOpen(false);
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      researchName: '',
      formName: '',
      formCustId: '',
      minScore: '',
      optionsCount: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      console.log('Going to submit');

      await dispatch(login(values))
        .then(() => navigate('/'))
        .catch((err) => {
          setLoading(false);
          const errMsg = err?.errHead || err?.errBody ? JSON.stringify(err) : msg.UNKNOWN_ERROR;
          setErrorMessage(errMsg);
        });
    },
  });

  const previewButtonOnClick = () => {
    const finalValue = { ...formik.values, ...questionState };
    setModalData(finalValue);
    setModalOpen(true);
    console.log(JSON.stringify(finalValue, null, 4));
  };

  return (
    <Box
      component='form'
      onSubmit={formik.handleSubmit}
      style={{
        margin: '60px auto 0 auto',
        width: '80%',
        maxWidth: '1000px',
      }}
    >
      <FormModal open={modalOpen} onClose={modalOnClose} data={modalData} />
      <Typography variant='h2' component='div' sx={{ fontWeight: '500', textAlign: 'center', marginBottom: '25px' }}>
        創建一份新問卷
      </Typography>
      <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <Autocomplete
          freeSolo
          selectOnFocus
          handleHomeEndKeys
          options={researchList}
          renderOption={(props, option) => <li {...props}>{option.label}</li>}
          renderInput={(params) => (
            <TextField
              {...params}
              label='研究名稱'
              name='researchName'
              value={formik.values.researchName}
              onChange={formik.handleChange}
              error={formik.touched.researchName && Boolean(formik.errors.researchName)}
              helperText={formik.touched.researchName && formik.errors.researchName}
            />
          )}
          filterOptions={(options, params) => {
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option.label);
            const filtered = filter(options, params);
            if (inputValue !== '' && !isExisting) {
              filtered.push({ inputValue, label: `Add "${inputValue}"` });
            }
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              formik.values.researchName = option;
              return option; // Value selected with enter, right from the input
            }
            if (option.inputValue) {
              formik.values.researchName = option.inputValue;
              return option.inputValue; // Add "xxx" option created dynamically
            }
            formik.values.researchName = option.label;
            return option.label; // Regular option
          }}
        />

        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            autoFocus
            name='formName'
            label='量表名稱'
            value={formik.values.formName}
            onChange={formik.handleChange}
            error={formik.touched.formName && Boolean(formik.errors.formName)}
            helperText={formik.touched.formName && formik.errors.formName}
            sx={{ width: '48%' }}
          />

          <TextField
            name='formCustId'
            label='量表代號'
            value={formik.values.formCustId}
            onChange={formik.handleChange}
            error={formik.touched.formCustId && Boolean(formik.errors.formCustId)}
            helperText={formik.touched.formCustId && formik.errors.formCustId}
            sx={{ width: '48%' }}
          />
        </Box>

        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            name='minScore'
            label='每題選項之最低分'
            value={formik.values.minScore}
            onChange={formik.handleChange}
            error={formik.touched.minScore && Boolean(formik.errors.minScore)}
            helperText={formik.touched.minScore && formik.errors.minScore}
            sx={{ width: '48%' }}
          />
          <TextField
            select
            name='optionsCount'
            label='每題的選項數量'
            value={formik.values.optionsCount}
            onChange={formik.handleChange}
            error={formik.touched.optionsCount && Boolean(formik.errors.optionsCount)}
            helperText={formik.touched.optionsCount && formik.errors.optionsCount}
            sx={{ width: '48%' }}
          >
            {optionsCountList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>

      {roles.map((role) => (
        <React.Fragment key={role.id}>
          <RoleDivider {...role} />
          {questionState.questions[role.label].map((question, idx) => (
            <Question id={question.id || idx} role={role.label} key={question.id || idx} handleChange={handleChildChange({ role: role.label })} />
          ))}
          <Box style={{ position: 'relative', textAlign: 'right' }}>
            <LoadingButton
              variant='contained'
              type='button'
              style={{ marginLeft: '20px' }}
              onClick={() => questionDispatch({ type: createFormActionType.ADD_QUESTION, payload: { role: role.label } })}
            >
              創建新題目
            </LoadingButton>
          </Box>
        </React.Fragment>
      ))}

      <Stack spacing={2} sx={{ textAlign: 'center' }}>
        <LoadingButton loading={loading} variant='contained' type='button' style={{ marginLeft: 'auto', marginRight: 'auto' }} onClick={previewButtonOnClick}>
          預覽結果
        </LoadingButton>
      </Stack>
    </Box>
  );
};
