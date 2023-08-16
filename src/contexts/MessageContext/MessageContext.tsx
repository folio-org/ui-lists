import React, { createContext, useContext, useState } from 'react';
import { MESSAGE_TYPES } from './types';

type MessageDataType = {
    message: string | React.ReactNode,
    type: MESSAGE_TYPES,
    timeout?: number
}

type ShowMessageHandlerType = {
    message: string | React.ReactNode, timeout?: number
}

type MessageContextType = {
    messageData?: MessageDataType,
    showSuccessMessage: (value: ShowMessageHandlerType) => void,
    showErrorMessage: (value: ShowMessageHandlerType) => void,
    showInfoMessage: (value: ShowMessageHandlerType) => void,
    showWarningMessage: (value: ShowMessageHandlerType) => void,
}

const DEFAULT_TIMEOUT = 6000;


const defaultMessageData = {
  message: '',
  type: MESSAGE_TYPES.SUCCESS,
  timeout: DEFAULT_TIMEOUT
};

export const MessageContext = createContext<MessageContextType>({
  showSuccessMessage: () => {},
  showErrorMessage: () => {},
  showInfoMessage: () => {},
  showWarningMessage: () => {},
  messageData: defaultMessageData
});

export const MessageContextProvider = ({ children }: {children: React.ReactNode}): React.JSX.Element => {
  const [messageData, setMessageData] = useState(defaultMessageData as MessageDataType);
  const showMessage = (type: MESSAGE_TYPES, value: ShowMessageHandlerType) => {
    const { message, timeout = DEFAULT_TIMEOUT } = value;
    setMessageData({ type, message, timeout });
  };
  const showSuccessMessage = (value: ShowMessageHandlerType) => {
    showMessage(MESSAGE_TYPES.SUCCESS, value);
  };
  const showErrorMessage = (value: ShowMessageHandlerType) => {
    showMessage(MESSAGE_TYPES.ERROR, value);
  };
  const showInfoMessage = (value: ShowMessageHandlerType) => {
    showMessage(MESSAGE_TYPES.INFO, value);
  };
  const showWarningMessage = (value: ShowMessageHandlerType) => {
    showMessage(MESSAGE_TYPES.WARNING, value);
  };

  return (
    <>
      <MessageContext.Provider value={{
        showSuccessMessage,
        showErrorMessage,
        showInfoMessage,
        showWarningMessage,
        messageData
      }}
      >
        {children}
      </MessageContext.Provider>
    </>
  );
};

export const useMessageContext = () => {
  const { showSuccessMessage,
    showErrorMessage,
    showInfoMessage,
    messageData } = useContext(MessageContext);

  return { showSuccessMessage,
    showErrorMessage,
    showInfoMessage,
    messageData };
};
