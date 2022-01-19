import React from 'react';
import PropTypes from 'prop-types';

import { Box, ListItemButton, ListItemText, ListSubheader, Modal as MuiModal, Typography } from '@mui/material';

import { initialQuestionsState, roles } from './createFormData';

const fieldName = {
  researchName: '研究名稱',
  formName: '量表名稱',
  formCustId: '量表代號',
  minScore: '每題選項之最低分',
  optionsCount: '每題的選項數量',
};

const FormDataItem = ({ field, value }) => (
  <ListItemButton style={{ display: 'flex', paddingLeft: '8px' }}>
    <ListItemText
      primary={
        <Typography type='subtitle2' style={{ fontWeight: 'bold' }}>
          {field}
        </Typography>
      }
      style={{ width: '25%', fontWeight: 'bold' }}
    />
    <ListItemText primary={value} style={{ width: '75%', textAlign: 'left' }} />
  </ListItemButton>
);
// <Typography variant='subtitle1' style={{}}>
//   <span style={{ fontWeight: 'bold' }}>{field}: </span>{value}
// </Typography>

export const FormModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { researchName, formName, formCustId, minScore, optionsCount, formTitle, formIntro, ...questionData } = data || {};
  const cancelButtonClick = () => onClose();

  return (
    open && (
      <MuiModal open={open} onClose={onClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
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
            width: 'min(1000px, 86%)',
            height: 'min(1500px, 90%)',
            overflowY: 'auto',
            maxWidth: '86%',
          }}
        >
          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            量表資料
          </ListSubheader>
          <FormDataItem field={fieldName.researchName} value={researchName.join(', ')} />
          <FormDataItem field={fieldName.formName} value={formName} />
          <FormDataItem field={fieldName.formCustId} value={formCustId} />
          <FormDataItem field={fieldName.minScore} value={minScore} />
          <FormDataItem field={fieldName.optionsCount} value={optionsCount} />
          <FormDataItem field='學生題目總數' value={questionData.counter.student} />
          <FormDataItem field='家長題目總數' value={questionData.counter.parent} />
          <FormDataItem field='老師題目總數' value={questionData.counter.teacher} />

          {roles.map((role) => (
            <React.Fragment key={role.id}>
              <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
                給{role.display}的問題
              </ListSubheader>
              {questionData.questions[role.label].length > 0 && <FormDataItem field={`給${role.display}看的量表名稱`} value={formTitle[role.label]} />}
              {questionData.questions[role.label].length > 0 && <FormDataItem field={`給${role.display}看的量表名稱`} value={formIntro[role.label]} />}
              {questionData.questions[role.label].map((question, idx) => (
                <React.Fragment key={question.label}>
                  <FormDataItem field={`題目${idx + 1}`} value={question.label} />
                  <FormDataItem field='選項' value={question.options.join(', ')} />
                  <FormDataItem field='是否為反向計分' value={question.isReverseGrading ? '是' : '否'} />
                  {question.isReverseGrading && <FormDataItem field='總分（若為反向計分）' value={question.maxPoint} />}
                  <hr />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

          <br />
          <br />

          <Box style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '30px' }}>
            <ListItemButton style={{ width: '47%', backgroundColor: '#F95C5C' }} onClick={cancelButtonClick}>
              <ListItemText primary='取消' style={{ textAlign: 'center', fontWeight: '700', color: '#EDEDED' }} />
            </ListItemButton>
            <div style={{ width: '6%' }} />
            <ListItemButton style={{ width: '47%', backgroundColor: '#4780DD' }} onClick={onSubmit}>
              <ListItemText primary='確認送出' style={{ textAlign: 'center', fontWeight: '700', color: '#EDEDED' }} />
            </ListItemButton>
          </Box>
        </Box>
      </MuiModal>
    )
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
};

FormModal.defaultProps = {
  data: initialQuestionsState,
};

FormDataItem.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
