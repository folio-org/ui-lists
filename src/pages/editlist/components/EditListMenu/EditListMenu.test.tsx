import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { EditListMenu } from './EditListMenu';

describe('EditListMenu', () => {
  const mockButtonHandlers = {
    'delete': jest.fn(),
    'export-all': jest.fn(),
    'export-visible': jest.fn(),
    'cancel-export': jest.fn(),
  };

  const mockConditions = {
    isExportInProgress: false,
    // Add other conditions as needed
  };

  it('should render delete and initial export buttons', () => {
    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.getByText('ui-lists.pane.dropdown.delete');
    const exportButton = screen.getByText('ui-lists.pane.dropdown.export-all');
    const exportVisibleButton = screen.getByText('ui-lists.pane.dropdown.export-visible');

    screen.logTestingPlaygroundURL();
    expect(deleteButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
    expect(exportVisibleButton).toBeInTheDocument();
  });

  it('should call delete handler when delete button is clicked', async () => {
    await render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.getByText('ui-lists.pane.dropdown.delete');
    fireEvent.click(deleteButton);

    expect(mockButtonHandlers.delete).toHaveBeenCalled();
  });

  it('should call export handler when export button is clicked', () => {
    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const exportButton = screen.getByText('ui-lists.pane.dropdown.export-all');
    fireEvent.click(exportButton);

    expect(mockButtonHandlers['export-all']).toHaveBeenCalled();
  });

  it('should render cancel export button when export is in progress', () => {
    const conditionsWithExportInProgress = {
      ...mockConditions,
      isExportInProgress: true,
    };

    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={conditionsWithExportInProgress} />);

    const cancelExportButton = screen.getByText('ui-lists.pane.dropdown.cancel-export');

    expect(cancelExportButton).toBeInTheDocument();
  });

  it('should call cancel export handler when cancel export button is clicked', () => {
    const conditionsWithExportInProgress = {
      ...mockConditions,
      isExportInProgress: true,
    };
    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={conditionsWithExportInProgress} />);

    const cancelExportButton = screen.getByText('ui-lists.pane.dropdown.cancel-export');
    fireEvent.click(cancelExportButton);

    expect(mockButtonHandlers['cancel-export']).toHaveBeenCalled();
  });

  it('should not render buttons when user doesn\'t have permission', () => {
    // @ts-ignore
    useStripes.mockImplementation(() => ({
      hasPerm: () => false
    }));

    render(<EditListMenu buttonHandlers={mockButtonHandlers} conditions={mockConditions} />);

    const deleteButton = screen.queryByText('ui-lists.pane.dropdown.delete');
    const exportButton = screen.queryByText('ui-lists.pane.dropdown.export');

    expect(deleteButton).toBeNull();
    expect(exportButton).toBeNull();
  });
});
