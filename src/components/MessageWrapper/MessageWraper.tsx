import React from 'react';
import { MessageContextProvider } from '../../contexts/MessageContext';
import { Message } from './components/Message';

export const MessageWrapper = ({ children } : {children: React.ReactNode}): React.JSX.Element => {
  return (
    <MessageContextProvider>
      {children}
      <Message />
    </MessageContextProvider>
  );
};
