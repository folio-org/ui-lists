import React from 'react';
// @ts-ignore:next-line
import { useShowCallout } from '@folio/stripes-acq-components';


const DEFAULT_TIMEOUT = 6000;

export enum MESSAGE_TYPES {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export type ShowMessageHandlerType = {
  message: string | React.ReactNode, timeout?: number
}

export const useMessages = () => {
  const showCallout = useShowCallout();

  const showMessage = (type: MESSAGE_TYPES, value: ShowMessageHandlerType) => {
    const { message, timeout = DEFAULT_TIMEOUT } = value;
    showCallout({ type, message, timeout });
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

  return {
    showWarningMessage,
    showMessage,
    showSuccessMessage,
    showErrorMessage,
    showInfoMessage
  };
};
