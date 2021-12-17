import React, { useEffect, useState, useCallback, createContext } from 'react';
import Proptypes from 'prop-types';
import { Alert, AlertTitle } from '@mui/material';
import { GLOBAL_MESSAGE_DISAPPEAR_PERIOD, MAX_Z_INDEX } from 'shared/constant/styles';

// https://mui.com/components/alert/
export const MessageBarItem = ({ message, onClose }) => (
  <Alert severity={message.severity} onClose={message.enableClose ? onClose(message) : null}>
    {message.content ? (
      <>
        <AlertTitle>{message.title}</AlertTitle>
        {message.content}
      </>
    ) : (
      <div style={{ fontSize: '1rem' }}>{message.title}</div>
    )}
  </Alert>
);

MessageBarItem.propTypes = {
  message: Proptypes.object.isRequired,
  onClose: Proptypes.func.isRequired,
};
