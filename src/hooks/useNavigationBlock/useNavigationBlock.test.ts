import { renderHook, act } from '@testing-library/react-hooks';
import { useHistory } from 'react-router-dom';
import { useNavigationBlock } from './useNavigationBlock';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

describe('useNavigationBlock', () => {
  let pushMock: jest.Mock;
  let blockMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    blockMock = jest.fn();
    (useHistory as jest.Mock).mockReturnValue({ push: pushMock, block: blockMock });
  });

  it('should block navigation and show modal when navigation is attempted', () => {
    const { result } = renderHook(() => useNavigationBlock(true));

    act(() => {
      result.current.setShowConfirmCancelEditModal(true);
    });

    expect(result.current.showConfirmCancelEditModal).toBe(true);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should allow navigation after confirming the action', () => {
    const { result } = renderHook(() => useNavigationBlock(true));

    const mockNextLocation = { pathname: '/next', search: '' };

    act(() => {
      result.current.setNextLocation(mockNextLocation);
    });

    act(() => {
      result.current.setShowConfirmCancelEditModal(true);
    });

    act(() => {
      result.current.continueNavigation();
    });

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/next',
      search: '',
    });
    expect(result.current.showConfirmCancelEditModal).toBe(false);
  });


  it('should not block navigation if showModalOnCancel is false', () => {
    const { result } = renderHook(() => useNavigationBlock(false));

    act(() => {
      result.current.setShowConfirmCancelEditModal(true);
    });

    expect(result.current.showConfirmCancelEditModal).toBe(true);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should close the modal and unblock navigation if "keep edit" is clicked', () => {
    const { result } = renderHook(() => useNavigationBlock(true));

    act(() => {
      result.current.setShowConfirmCancelEditModal(true);
    });

    act(() => {
      result.current.keepEditHandler();
    });

    expect(result.current.showConfirmCancelEditModal).toBe(false);
  });
});
