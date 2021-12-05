import React, { useEffect, useState, useCallback, createContext } from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';
import { Alert, AlertTitle } from '@mui/material';
import { GLOBAL_MESSAGE_DISAPPEAR_PERIOD } from 'shared/constant/styles';

const GlobalMessageContext = createContext();

export default GlobalMessageContext;

const GlobalMessageWrapper = styled.div`
  z-index: 99999999;
  position: fixed;
  bottom: 1rem;
  right: 2rem;

  > * {
    margin: 5px 0;
  }
`;

export const MessageBar = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(
        () => setMessages((prevMessages) => prevMessages.slice(1)),
        GLOBAL_MESSAGE_DISAPPEAR_PERIOD
      );
      return () => clearTimeout(timer);
    }
    return null;
  }, [messages]);

  const addGlobalMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const onClose = (timestamp) => () => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.timestamp !== timestamp));
  };

  const clearAllGlobalMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <GlobalMessageContext.Provider value={{ addGlobalMessage, clearAllGlobalMessages }}>
      <GlobalMessageWrapper>
        {messages.map((message) => (
          <Alert
            severity={message.severity}
            key={message.timestamp}
            onClose={message.enableClose ? onClose(message.timestamp) : null}
          >
            <AlertTitle>{message.title}</AlertTitle>
            {message.content}
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
