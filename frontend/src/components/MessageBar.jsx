import React, { useEffect, useState, useCallback, createContext } from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';
import { GLOBAL_MESSAGE_DISAPPEAR_PERIOD, MAX_Z_INDEX } from 'shared/constant/styles';
import Stack from '@mui/material/Stack';
import { MessageBarItem } from './MessageBarItem';

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
  const [isClosedManually, setIsClosedManually] = useState(false);
  const [startNextTimer, setStartNextTimer] = useState(true);
  const generateKey = ({ timestamp, title, content }) => `${timestamp}${title}${content}`;

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    if (isClosedManually) {
      // Prevent the first message lasts more than GLOBAL_MESSAGE_DISAPPEAR_PERIOD when user removes messages manually
      setIsClosedManually(false);
      return;
    }
    if (!startNextTimer) {
      // Prevent the first message lasts more than GLOBAL_MESSAGE_DISAPPEAR_PERIOD when new message is added
      return;
    }
    setTimeout(() => {
      setStartNextTimer(true);
      setMessages((prevMessages) => prevMessages.slice(1));
    }, GLOBAL_MESSAGE_DISAPPEAR_PERIOD);
    setStartNextTimer(false);
  }, [messages]);

  // Problem: when a message is added afterward, it may lasts less than GLOBAL_MESSAGE_DISAPPEAR_PERIOD time
  // useEffect(() => {
  //   const timer = setInterval(() => setMessages((prevMessages) => prevMessages.slice(1)), GLOBAL_MESSAGE_DISAPPEAR_PERIOD);
  //   return () => clearInterval(timer);
  // }, []);

  const addGlobalMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const clearAllGlobalMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const onClose = (msg) => () => {
    setIsClosedManually(true);
    setMessages((prevMessages) => prevMessages.filter((prevMsg) => generateKey(prevMsg) !== generateKey(msg)));
  };

  return (
    <GlobalMessageContext.Provider value={{ addGlobalMessage, clearAllGlobalMessages }}>
      <GlobalMessageWrapper>
        <Stack spacing={1}>
          {messages.map((message) => (
            <MessageBarItem key={`${generateKey(message)}`} message={message} onClose={onClose} />
          ))}
        </Stack>
      </GlobalMessageWrapper>
      {children}
    </GlobalMessageContext.Provider>
  );
};

MessageBar.propTypes = {
  children: Proptypes.element.isRequired,
};
