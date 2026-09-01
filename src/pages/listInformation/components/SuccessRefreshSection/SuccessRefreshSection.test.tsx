import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
/* @ts-ignore:next-line */
import { TextLink } from '@folio/stripes/components';
import { SuccessRefreshSection, RefreshStatusToastProps } from './SuccessRefreshSection';

describe('SuccessRefreshSection', () => {
  const mockProps: RefreshStatusToastProps = {
    shouldShow: true,
    recordsCount: 10,
    onViewListClick: jest.fn(),
  };

  it('should render success message banner with link', () => {
    render(<SuccessRefreshSection {...mockProps} />);

    const successBanner = screen.getByTestId('success-banner');
    const link = screen.getByText('ui-lists.status-toast.success.link');

    expect(successBanner).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('should show correct records count in the message', () => {
    render(<SuccessRefreshSection {...mockProps} />);

    const messageText = screen.getByText('ui-lists.status-toast.success.refresh-complete-{"count":10}');

    expect(messageText).toBeInTheDocument();
  });

  it('should render the link as a keyboard accessible button with an accessible name', () => {
    render(<SuccessRefreshSection {...mockProps} />);

    expect(TextLink).toHaveBeenCalledWith(
      expect.objectContaining({
        element: 'button',
        type: 'button',
        'aria-label': 'ui-lists.status-toast.success.link',
      }),
      expect.anything(),
    );
  });

  it('should place the link in the tab order', async () => {
    render(<SuccessRefreshSection {...mockProps} />);

    await user.tab();

    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('should call onViewListClick when link is clicked', async () => {
    render(<SuccessRefreshSection {...mockProps} />);

    const link = screen.getByText('ui-lists.status-toast.success.link');

    await user.click(link);

    expect(mockProps.onViewListClick).toHaveBeenCalled();
  });

  it('should not render when shouldShow is false', () => {
    const propsWithHiddenBanner: RefreshStatusToastProps = {
      ...mockProps,
      shouldShow: false,
    };
    render(<SuccessRefreshSection {...propsWithHiddenBanner} />);

    const successBanner = screen.queryByTestId('success-banner');

    expect(successBanner).not.toBeInTheDocument();
  });
});
