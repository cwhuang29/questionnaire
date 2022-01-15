import React from 'react';
import Proptypes from 'prop-types';

import { Alert, AlertTitle } from '@mui/material';

// https://mui.com/components/alert/
export const MessageBarItem = ({ message: msg, onClose }) => {
  const canClose = msg.enableClose === true || msg.enableClose === undefined || msg.enableClose === null || false;

  return (
    <Alert severity={msg.severity} onClose={canClose ? onClose(msg) : null}>
      {msg.content ? (
        <>
          <AlertTitle>{msg.title}</AlertTitle>
          {msg.content}
        </>
      ) : (
        <div style={{ fontSize: '1rem' }}>{msg.title}</div>
      )}
    </Alert>
  );
};

MessageBarItem.propTypes = {
  message: Proptypes.object.isRequired,
  onClose: Proptypes.func.isRequired,
};
