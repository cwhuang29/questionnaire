import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ConfirmButton } from '@components/Button';

import { Box, Modal as MuiModal, Typography } from '@mui/material';

const FormResultModal = props => {
  const { open } = props;
  const navigate = useNavigate();
  const onConfirm = () => navigate(-1);
  const confirmButtonText = '返回首頁';

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
            width: 'min(550px, 78%)',
            height: 'min(270px, 45%)',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <Typography variant='h4' component='div' sx={{ fontWeight: '600', marginBottom: '40px', textAlign: 'center' }}>
            感謝您填寫量表
          </Typography>
          <Typography variant='h6' component='div' sx={{ fontWeight: '600', marginBottom: '40px' }}>
            恭喜你填寫完成!請檢查是否還有其他問卷要填寫
          </Typography>

          <Box sx={{ position: 'relative', top: '65px' }}>
            <ConfirmButton onConfirm={onConfirm} confirmButtonText={confirmButtonText} />
          </Box>
        </Box>
      </MuiModal>
    )
  );
};

FormResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default FormResultModal;
