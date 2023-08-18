import { renderHook } from '@testing-library/react-hooks';
import { describe, expect } from '@jest/globals';
import { useMessages } from '../useMessages';

const mockShowCallout = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: () => mockShowCallout,
}));


describe('useMessages', () => {
  const { result } = renderHook(useMessages);

  describe('showErrorMessage', () => {
    it('is expected to pass object with error type into showCallout', () => {
      result.current.showErrorMessage({
        message: 'Some ERROR message'
      });

      const errorMessageObject = { message: 'Some ERROR message', timeout: 6000, type: 'error' };

      expect(mockShowCallout).lastCalledWith(errorMessageObject);
    });
  });

  describe('showSussesMessage', () => {
    it('is expected to pass object with success type into showCallout', () => {
      result.current.showSuccessMessage({
        message: 'Some SUCCESS message'
      });

      const successMessageObject = { message: 'Some SUCCESS message', timeout: 6000, type: 'success' };

      expect(mockShowCallout).lastCalledWith(successMessageObject);
    });
  });

  describe('showWarningMessage', () => {
    it('is expected to pass object with warning type into showCallout', () => {
      result.current.showWarningMessage({
        message: 'Some WARNING message'
      });

      const warningMessageObject = { message: 'Some WARNING message', timeout: 6000, type: 'warning' };

      expect(mockShowCallout).lastCalledWith(warningMessageObject);
    });
  });

  describe('showInfoMessage', () => {
    it('is expected to pass object with info type into showCallout', () => {
      result.current.showInfoMessage({
        message: 'Some INFO message'
      });

      const infoMessageObject = { message: 'Some INFO message', timeout: 6000, type: 'info' };

      expect(mockShowCallout).lastCalledWith(infoMessageObject);
    });
  });
});
