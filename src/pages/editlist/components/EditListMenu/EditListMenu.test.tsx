import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { EditListMenu } from './EditListMenu';

describe('EditListMenu', () => {
  const mockButtonHandlers = {
    'delete': jest.fn(),
  };

  const mockConditions = {
    isExportInProgress: false,
    // Add other conditions as needed
  };

  it('should render delete button', () => {
    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.getByText('ui-lists.pane.dropdown.delete');

    screen.logTestingPlaygroundURL();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call delete handler when delete button is clicked', async () => {
    await render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.getByText('ui-lists.pane.dropdown.delete');
    fireEvent.click(deleteButton);

    expect(mockButtonHandlers.delete).toHaveBeenCalled();
  });

  it('should not render buttons when user doesn\'t have permission', () => {
    // @ts-ignore
    useStripes.mockImplementation(() => ({
      hasPerm: () => false
    }));

    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.queryByText('ui-lists.pane.dropdown.delete');
    expect(deleteButton).toBeNull();
  });
});
