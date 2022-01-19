import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { createForm } from '@actions/form';
import { validateMsg } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, createFilterOptions, MenuItem, Stack, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import styles from './index.module.css';

import { createFormActionType, formInitialValues, getDefaultQuestionState, initialQuestionsState, optionsCountList, roles } from './createFormData';
import { FormModal } from './FormModal';
import { Question } from './Question';
import { RoleDivider } from './RoleDivider';

const filter = createFilterOptions();

const researchList = [
  { label: 'The Shawshank Redemption' },
  { label: 'The Godfather' },
  { label: 'The Godfather: Part II' },
  { label: 'The Dark Knight' },
  { label: 'Pulp Fiction' },
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
    case createFormActionType.REMOVE_QUESTION:
      return {
        ...state,
        counter: { ...state.counter, [payload.role]: state.counter[payload.role] > 0 ? state.counter[payload.role] - 1 : 0 },
        questions: { ...state.questions, [payload.role]: state.questions[payload.role].slice(0, -1) },
      };
    default:
      return state;
  }
};

const formikValidationSchema = Yup.object({
  // researchName: Yup.array().required(validateMsg.REQUIRED),
  researchName: Yup.array(),
  formName: Yup.string().required(validateMsg.REQUIRED),
  formCustId: Yup.string().required(validateMsg.REQUIRED),
  minScore: Yup.number(validateMsg.IS_NUMBER).min(0).required(validateMsg.REQUIRED),
  optionsCount: Yup.number().min(1).max(10).required(validateMsg.REQUIRED),
  formTitle: Yup.object().shape({ student: '', parent: '', teacher: '' }),
  formIntro: Yup.object(),
  // date: Yup.date().default(() => new Date()).max(new Date(), "Are you a time traveler?!"),
  // wouldRecommend: Yup.boolean().default(false),
});

export const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addGlobalMessage, clearAllGlobalMessages } = useGlobalMessageContext();
  const [questionState, questionDispatch] = useReducer(questionsReducer, initialQuestionsState);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState();

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: formikValidationSchema,
    validateOnChange: true,
    validate: (values) => {
      let hasError = false;

      if (!loading) {
        // Ensure the 'Form is creating' message persists on the webpage
        clearAllGlobalMessages();
      }

      roles.forEach((role) =>
        questionState.questions[role.label].forEach((question) => {
          if (question.label === '') {
            hasError = true;
            addGlobalMessage({
              title: 'Question should not be empty',
              content: `Role: ${role.display}. Question ID: ${question.id + 1}`,
              severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
              timestamp: Date.now(),
            });
          }
          if (question.options.length !== values.optionsCount) {
            hasError = true;
            addGlobalMessage({
              title: `Number of options is not correct`,
              content: `Role: ${role.display}. Question ID: ${question.id + 1}. Number of options: ${question.options.length}`,
              severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
              timestamp: Date.now(),
            });
          }
        })
      );
      return hasError ? { questionError: '' } : {};
    },
    onSubmit: async (values) => {
      if (!loading) return;

      addGlobalMessage({
        title: `The questionnaire is creating. Hold on please`,
        severity: GLOBAL_MESSAGE_SERVERITY.INFO,
        timestamp: Date.now(),
        canClose: false, // In case user keep clicking submit button
      });

      const finalValue = { ...values, ...questionState };
      await dispatch(createForm(finalValue))
        .then((resp) => {
          clearAllGlobalMessages();
          addGlobalMessage({
            title: resp.title,
            severity: GLOBAL_MESSAGE_SERVERITY.INFO,
            timestamp: Date.now(),
          });
          navigate('/');
        })
        .catch((err) => {
          clearAllGlobalMessages();
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
            canClose: false,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const submitForm = () => {
    setLoading(true);
    formik.handleSubmit(); // Run valdidate() then onSubmit()
  };

  const modalOnClose = () => setModalOpen(false);

  const showPreview = () => {
    formik.validateForm().then((formErrors) => {
      if (Object.keys(formErrors).length === 0) {
        const finalValue = { ...formik.values, ...questionState };
        setModalData(finalValue);
        setModalOpen(true);
        console.log(JSON.stringify(finalValue, null, 4));
      }
    });
    // if (Object.keys(formik.errors).length === 0 && Object.keys(formik.touched).length !== 0) { } // This is not always the freshest data
  };

  const handleChildChange =
    ({ role }) =>
    (value) =>
      questionDispatch({ type: createFormActionType.SET_QUESTION, payload: { role, value } });

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
      <FormModal open={modalOpen} onClose={modalOnClose} data={modalData} onSubmit={submitForm} />
      <Typography variant='h2' component='div' sx={{ fontWeight: '500', textAlign: 'center', marginBottom: '25px' }}>
        創建一份新問卷
      </Typography>
      <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <Autocomplete
          multiple
          freeSolo
          selectOnFocus
          filterSelectedOptions
          handleHomeEndKeys
          options={researchList}
          renderOption={(props, option) => <li {...props}>{option.label}</li>}
          onChange={(e, value) => {
            const revisedValue = value.map((v) => (v.constructor === Object ? v.label : v)); // The element in the option list are obejcts
            formik.setFieldValue('researchName', revisedValue); // Use this to replace value={formik.values.researchName}
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='研究名稱'
              error={formik.touched.researchName && Boolean(formik.errors.researchName)}
              helperText={formik.touched.researchName && formik.errors.researchName}
            />
          )}
          filterOptions={(options, params) => {
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option.label);
            const filtered = filter(options, params);
            if (inputValue !== '' && !isExisting) {
              filtered.push({ inputValue, label: inputValue });
            }
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option; // Value selected with enter, right from the input
            }
            if (option.inputValue) {
              return option.inputValue; // Add "xxx" option created dynamically
            }
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
            type='number'
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
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              name={`formTitle.${role.label}`}
              label={`給${role.display}看的量表名稱（沒有問題時此欄位會被忽略）`}
              value={formik.values[`formTitle[${role.label}]`]}
              onChange={formik.handleChange}
              error={formik.touched[`formTitle[${role.label}]`] && Boolean(formik.errors[`formTitle[${role.label}]`])}
              helperText={formik.touched[`formTitle[${role.label}]`] && formik.errors[`formTitle[${role.label}]`]}
              sx={{ width: '48%' }}
            />
            <TextField
              name={`formIntro.${role.label}`}
              label={`給${role.display}看的量表說明（沒有問題時此欄位會被忽略）`}
              value={formik.values[`formIntro[${role.label}]`]}
              onChange={formik.handleChange}
              error={formik.touched[`formIntro[${role.label}]`] && Boolean(formik.errors[`formIntro[${role.label}]`])}
              helperText={formik.touched[`formIntro[${role.label}]`] && formik.errors[`formIntro[${role.label}]`]}
              sx={{ width: '48%' }}
            />
          </Box>

          {questionState.questions[role.label].map((question, idx) => (
            <Question id={question.id || idx} role={role.label} key={question.id || idx} handleChange={handleChildChange({ role: role.label })} />
          ))}
          <Box style={{ position: 'relative', textAlign: 'right', marginTop: '20px' }}>
            <Button
              disabled={questionState.questions[role.label].length === 0}
              variant='contained'
              type='button'
              style={{ marginLeft: '20px', backgroundColor: '#ED5656' }}
              onClick={() => questionDispatch({ type: createFormActionType.REMOVE_QUESTION, payload: { role: role.label } })}
            >
              移除最後一題
            </Button>
            <Button
              variant='contained'
              type='button'
              style={{ marginLeft: '20px', backgroundColor: '#3A7CEB' }}
              onClick={() => questionDispatch({ type: createFormActionType.ADD_QUESTION, payload: { role: role.label } })}
            >
              創建新題目
            </Button>
          </Box>
        </React.Fragment>
      ))}

      <Stack spacing={2} sx={{ textAlign: 'center', mt: '30px', mb: '50px' }}>
        <LoadingButton
          size='large'
          loading={loading}
          variant='contained'
          type='submit'
          style={{ marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#3A7CEB' }}
          onClick={showPreview}
        >
          預覽結果
        </LoadingButton>
      </Stack>
    </Box>
  );
};
