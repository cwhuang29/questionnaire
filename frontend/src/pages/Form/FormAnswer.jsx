import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SubmitAndCancelButtonGroup from '@components/button/SubmitAndCancelButtonGroup';
import PageWrapper from '@components/HomePageWrapper';
import { validateMsg } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, Typography } from '@mui/material';

import { roles } from './createFormData';

const PIXELS_PER_WORD = 14;

const validationSchema = Yup.object({
  scores: Yup.array().of(Yup.number('Should be number type').required(validateMsg.REQUIRED)).strict().required(),
});

const FormAnswer = (props) => {
  const { formData } = props;
  const navigate = useNavigate();
  const { addGlobalMessage } = useGlobalMessageContext();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { minScore, optionsCount, formTitle: title, formIntro: intro, questions = [] } = formData;
  let role = null;
  roles.forEach((r) => {
    role = title[r.label] !== '' ? r.label : role;
  });

  // eslint-disable-next-line no-unused-vars
  const getOptionScore = (idx, isReverseGrading, maxScore) => (isReverseGrading ? maxScore - (minScore + idx) : minScore + idx);

  const submitButtonText = '確認送出';
  const minOptionWidth = optionsCount * PIXELS_PER_WORD;
  const optionStyle = { width: `${100 / optionsCount}%`, minWidth: `${minOptionWidth}px`, marginRight: 0 };

  const formik = useFormik({
    initialValues: {
      scores: [...Array(questions[role].length)],
    },
    validationSchema,
    // validate: (values) => console.log(JSON.stringify(values, null, 2)),
    onSubmit: async (values) => {
      await dispatch(register(values))
        .then(() => navigate('/login')) // TODO
        .catch((err) => {
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
          });
        })
        .finally(() => setLoading(false));
    },
  });

  const onCancel = () => navigate(-1);

  const onSubmit = () => {
    setLoading(true);
    formik.submitForm();
    setLoading(false); // In case the validate doesn't pass
  };

  return (
    <PageWrapper>
      <Box
        component='form'
        onSubmit={formik.handleSubmit} // Alternative: execute formik.handleSubmit() manually in the onClick callback function
      >
        <Typography variant='h3' component='div' sx={{ fontWeight: '600', marginBottom: '20px' }}>
          {title[role]}
        </Typography>
        <Typography variant='h6' component='div' sx={{ fontWeight: '500', marginBottom: '20px' }}>
          {intro[role]}
        </Typography>
        {questions[role].map((question) => (
          <React.Fragment key={question.id}>
            <Typography variant='h5' component='div' sx={{ fontWeight: '500', textAlign: 'left', margin: '45px 0 15px' }}>
              <span style={{ padding: '0 20px 0 0' }}>{question.id + 1}.</span>
              {question.label}
            </Typography>

            <FormControl fullWidth>
              {/* <FormLabel>This is label</FormLabel> */}
              <RadioGroup
                row
                aria-labelledby={`question-${question.id}`}
                onChange={(evt, val) => {
                  formik.setFieldValue(`scores[${question.id}]`, parseInt(val, 10));
                }}
              >
                {question.options.map((option, idx) => (
                  <FormControlLabel
                    key={`${option}`}
                    // value={getOptionScore(idx, question.isReverseGrading, question.maxScore)}
                    value={idx} // Calculate scores in the server
                    control={<Radio />}
                    label={option}
                    style={optionStyle}
                  />
                ))}
                {/* Formik sets touched flags on blur event instead of on change. In the beginning, formik.touched equals to {} */}
                {formik.touched.scores && formik.errors.scores && (
                  <FormHelperText error={Boolean(formik.touched.scores[question.id] && formik.errors.scores[question.id])} style={{ marginLeft: 0 }}>
                    {formik.errors.scores[question.id]}
                  </FormHelperText>
                )}
              </RadioGroup>
            </FormControl>
          </React.Fragment>
        ))}

        <div style={{ padding: '50px 0' }} />
        <SubmitAndCancelButtonGroup disabledSubmit={loading} onSubmit={onSubmit} onCancel={onCancel} submitButtonText={submitButtonText} />
      </Box>
    </PageWrapper>
  );
};

FormAnswer.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default FormAnswer;
