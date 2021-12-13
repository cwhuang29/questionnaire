import React, { useEffect, useState, useCallback, createContext } from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';
import { Alert, AlertTitle } from '@mui/material';
import { GLOBAL_MESSAGE_DISAPPEAR_PERIOD, MAX_Z_INDEX } from 'shared/constant/styles';

const GlobalMessageContext = createContext();

export default GlobalMessageContext;

const GlobalMessageWrapper = styled.div`
  z-index: ${MAX_Z_INDEX};
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: min(500px, 70%);
  cursor: default;
  > * {
    margin: 5px 0;
  }
`;

export const MessageBar = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length === 0) {
      return null;
    }
    const timer = setTimeout(
      () => setMessages((prevMessages) => prevMessages.slice(1)),
      GLOBAL_MESSAGE_DISAPPEAR_PERIOD
    );
    return () => clearTimeout(timer);
  }, [messages]);

  const addGlobalMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const clearAllGlobalMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const generateKey = ({ timestamp, title, content }) => `${timestamp}${title}${content}`;

  const onClose = (message) => () =>
    setMessages((prevMessages) => prevMessages.filter((prevMsg) => generateKey(prevMsg) !== generateKey(message)));

  // https://mui.com/components/alert/
  return (
    <GlobalMessageContext.Provider value={{ addGlobalMessage, clearAllGlobalMessages }}>
      <GlobalMessageWrapper>
        {messages.map((message) => (
          <Alert
            severity={message.severity}
            key={`${generateKey(message)}`}
            onClose={message.enableClose ? onClose(message) : null}
          >
            {message.content ? (
              <>
                <AlertTitle>{message.title}</AlertTitle>
                {message.content}
              </>
            ) : (
              <div style={{ fontSize: '1rem' }}>{message.title}</div>
            )}
          </Alert>
        ))}
      </GlobalMessageWrapper>
      {children}
    </GlobalMessageContext.Provider>
  );
};

MessageBar.propTypes = {
  children: Proptypes.element.isRequired,
};
