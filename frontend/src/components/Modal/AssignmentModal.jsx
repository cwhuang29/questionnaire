import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import msg, { validateMsg } from '@constants/messages';
import ROLES from '@constants/roles';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import {
  Autocomplete,
  Box,
  createFilterOptions,
  FormControl,
  InputLabel,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Modal as MuiModal,
  Select,
  Stack,
  TextField,
} from '@mui/material';

const filter = createFilterOptions();

const initialValues = {
  email: [],
  role: '',
  subject: '',
  content: '',
  footer: '',
};

const validationSchema = Yup.object({
  email: Yup.array().of(Yup.string().email(validateMsg.AUTH.EMAIL_REQUIRED).max(50, validateMsg.TOO_LONG)).min(1, validateMsg.REQUIRED),
  role: Yup.string().required(validateMsg.AUTH.ROLE_REQUIRED),
  subject: Yup.string().required(validateMsg.REQUIRED),
  content: Yup.string().required(validateMsg.REQUIRED),
  footer: Yup.string(),
});

const AssignmentModal = (props) => {
  const { open, onClose, onSubmit, submitButtonText, cancelButtonText } = props;
  const [loading, setLoading] = useState(false);
  const { addGlobalMessage } = useGlobalMessageContext();
  const cancelButtonClick = () => onClose();

  const formik = useFormik({
    initialValues,
    validationSchema,
    // validate: (values) => console.log(JSON.stringify(values, null, 2)),
    onSubmit: async (values) => {
      setLoading(true);
      addGlobalMessage({
        title: msg.REQUEST_IS_HANDLING,
        severity: GLOBAL_MESSAGE_SERVERITY.INFO,
        timestamp: Date.now(),
      });

      await onSubmit(values)
        .then((resp) => {
          addGlobalMessage({
            title: resp.title,
            content: resp.content,
            severity: GLOBAL_MESSAGE_SERVERITY.INFO,
            timestamp: Date.now(),
          });
          onClose();
        })
        .catch((err) => {
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const submitButtonOnClick = () => {
    setLoading(true);
    formik.handleSubmit(); // Run valdidate() then onSubmit()
    setLoading(false); // In case the validate doesn't pass
  };

  return (
    open && (
      <MuiModal open={open} /* onClose={onClose} */ aria-labelledby='modal-title' aria-describedby='modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#EDEDED',
            border: 'none',
            borderRadius: '12px',
            boxShadow: 25,
            p: 3,
          }}
          style={{
            width: 'min(800px, 85%)',
            height: 'min(1000px, 86%)',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            指定填寫者（將一併寄出通知信件，重複者自動忽略）
          </ListSubheader>

          <Stack spacing={2}>
            <Autocomplete
              multiple
              freeSolo
              selectOnFocus
              filterSelectedOptions
              handleHomeEndKeys
              options={[]}
              // limitTags={5}
              renderOption={(_props, option) => <li {..._props}>{option.label}</li>}
              defaultValue={formik.values.email}
              value={formik.values.email}
              onChange={(e, value) => {
                // If user clicks enter right after typing, the new value appended in the array is of type string
                // If user press keydown to the option list, the new value will have type object ({inputValue: 'abc', label: 'abc'}) (the key "label" is named by MUI)
                const revisedValue = value.map((v) => (v.constructor === Object ? v.label : v));
                formik.setFieldValue('email', revisedValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='請輸入email'
                  autoFocus
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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

            <FormControl fullWidth>
              <InputLabel id='role'>Role</InputLabel>
              <Select
                name='role'
                label='角色'
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                {Object.entries(ROLES).map(
                  ([value, label]) =>
                    value < 3 && (
                      <MenuItem key={value} value={parseInt(value, 10)}>
                        {label}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Stack>

          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            信件內容
          </ListSubheader>

          <Stack spacing={2}>
            <TextField
              fullWidth
              name='subject'
              label='Email Subject'
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              name='content'
              label='Email Content'
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name='footer'
              label='EmailFooter'
              value={formik.values.footer}
              onChange={formik.handleChange}
              error={formik.touched.footer && Boolean(formik.errors.footer)}
              helperText={formik.touched.footer && formik.errors.footer}
            />
          </Stack>

          <Box style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '30px' }}>
            <ListItemButton style={{ width: '47%', backgroundColor: '#F95C5C' }} onClick={cancelButtonClick}>
              <ListItemText primary={cancelButtonText} style={{ textAlign: 'center', fontWeight: '700', color: '#EDEDED' }} />
            </ListItemButton>
            <div style={{ width: '6%' }} />
            <ListItemButton disabled={loading} onClick={submitButtonOnClick} style={{ width: '47%', backgroundColor: '#4780DD' }}>
              <ListItemText type='submit' primary={submitButtonText} style={{ textAlign: 'center', fontWeight: '700', color: '#EDEDED' }} />
            </ListItemButton>
          </Box>
        </Box>
      </MuiModal>
    )
  );
};

AssignmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
};

AssignmentModal.defaultProps = {
  cancelButtonText: '關閉',
};

export default AssignmentModal;