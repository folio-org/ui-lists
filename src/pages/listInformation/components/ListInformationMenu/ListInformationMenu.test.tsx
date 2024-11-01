import React from 'react';
import { useStripes } from '@folio/stripes/core';
import { render, screen } from '@testing-library/react';
import { ListInformationMenu, ListInformationMenuProps } from './ListInformationMenu';

const mockProps: ListInformationMenuProps = {
  buttonHandlers: {
    'cancel-refresh': jest.fn(),
    'refresh': jest.fn(),
    'edit': jest.fn(),
    'copy': jest.fn(),
    'delete': jest.fn(),
    'export-all': jest.fn(),
    'export-visible': jest.fn(),
    'cancel-export': jest.fn()
  },
  conditions: { isListCanned: false },
  onColumnsChange: jest.fn(),
  columns: [],
};

describe('ListInformationMenu', () => {
  describe('All Permissions Enabled', () => {
    it('should render Refresh list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.refresh');

      expect(link).toBeInTheDocument();
    });

    it('should render Edit list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.edit');

      expect(link).toBeInTheDocument();
    });

    it('should render Delete list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.delete');

      expect(link).toBeInTheDocument();
    });

    it('should render Export all list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.export-all');

      expect(link).toBeInTheDocument();
    });

    it('should render Export all list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.export-visible');

      expect(link).toBeInTheDocument();
    });
  });


  describe('All Permissions Disabled', () => {
    beforeEach(() => {
      // @ts-ignore
      useStripes.mockImplementation(() => ({
        hasPerm: () => false
      }));
    });

    it('should not render Refresh list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.refresh');

      expect(link).toBeNull();
    });

    it('should not render Edit list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.edit');

      expect(link).toBeNull();
    });

    it('should not render Delete list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.delete');

      expect(link).toBeNull();
    });

    it('should not render Export list link', () => {
      render(<ListInformationMenu {...mockProps} />);
      const link = screen.queryByText('ui-lists.pane.dropdown.export');

      expect(link).toBeNull();
    });
  });
});
