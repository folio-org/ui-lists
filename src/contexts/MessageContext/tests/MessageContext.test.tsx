import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { describe, expect } from '@jest/globals';
import { MessageContextProvider, useMessageContext } from '../MessageContext';

describe('', () => {
  it('is expected to have default state', () => {
    const defaultState = {
      type: 'success',
      timeout: 6000,
      message: ''
    };

    const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

    const { result } = renderHook(() => useMessageContext(), { wrapper });

    expect(result.current.messageData).toEqual(defaultState);
  });

  describe('When called showErrorMessage', () => {
    it('is expected to change state to error message state', () => {
      const errorMessage = 'Error occurred';
      const errorMessageState = {
        type: 'error',
        timeout: 6000,
        message: errorMessage
      };

      const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

      const { result } = renderHook(() => useMessageContext(), { wrapper });

      act(() => {
        result.current.showErrorMessage({
          message: errorMessage
        });
      });

      expect(result.current.messageData).toEqual(errorMessageState);
    });
  });

  describe('When called showSuccessMessage', () => {
    it('is expected to change state to success message state', () => {
      const successMessage = 'List refreshed';
      const successMessageState = {
        type: 'error',
        timeout: 6000,
        message: successMessage
      };

      const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

      const { result } = renderHook(() => useMessageContext(), { wrapper });

      act(() => {
        result.current.showErrorMessage({
          message: successMessage
        });
      });

      expect(result.current.messageData).toEqual(successMessageState);
    });
  });

  describe('When called showInfoMessage', () => {
    it('is expected to change state to info message state', () => {
      const infoMessage = 'Test info';
      const infoMessageState = {
        type: 'info',
        timeout: 6000,
        message: infoMessage
      };

      const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

      const { result } = renderHook(() => useMessageContext(), { wrapper });

      act(() => {
        result.current.showInfoMessage({
          message: infoMessage
        });
      });

      expect(result.current.messageData).toEqual(infoMessageState);
    });
  });

  describe('When called showWarningMessage', () => {
    it('is expected to change state to warning message state', () => {
      const warningMessage = 'Warning info';
      const warningMessageState = {
        type: 'info',
        timeout: 6000,
        message: warningMessage
      };

      const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

      const { result } = renderHook(() => useMessageContext(), { wrapper });

      act(() => {
        result.current.showInfoMessage({
          message: warningMessage
        });
      });

      expect(result.current.messageData).toEqual(warningMessageState);
    });
  });

  describe('When called show function and provided timeout argument', () => {
    it('is expected to change timeout in state', () => {
      const warningMessage = 'Warning info';
      const warningMessageState = {
        type: 'info',
        timeout: 2000,
        message: warningMessage
      };

      const wrapper = ({ children } : any) => (<MessageContextProvider>{children}</MessageContextProvider>);

      const { result } = renderHook(() => useMessageContext(), { wrapper });

      act(() => {
        result.current.showInfoMessage({
          message: warningMessage,
          timeout: 2000
        });
      });

      expect(result.current.messageData).toEqual(warningMessageState);
    });
  });
});
