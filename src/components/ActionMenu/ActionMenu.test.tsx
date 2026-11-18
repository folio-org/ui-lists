import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ActionMenu } from './ActionMenu';
import { ActionButton } from '../../services';
import { ICONS } from '../../interfaces';

describe('ActionMenu', () => {
  describe('When an action button is clicked', () => {
    const onClick = jest.fn();
    const actionButtons: ActionButton[] = [
      {
        label: 'refresh',
        icon: ICONS.refresh,
        onClick,
        disabled: false
      }
    ];

    beforeEach(() => {
      onClick.mockClear();
    });

    it('is expected to call the button handler', async () => {
      render(<ActionMenu actionButtons={actionButtons} />);

      await user.click(screen.getByRole('menuitem'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is expected to return focus to the menu trigger', async () => {
      render(<ActionMenu actionButtons={actionButtons} />);

      const trigger = screen.getAllByTestId('paneDropdownButton')[0].querySelector('button');

      await user.click(screen.getByRole('menuitem'));

      expect(trigger).toHaveFocus();
    });
  });
});
