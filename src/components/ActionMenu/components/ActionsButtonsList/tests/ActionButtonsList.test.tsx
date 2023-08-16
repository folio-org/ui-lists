import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ActionButtonsList } from '../ActionButtonsList';
import { ActionButton } from '../../..';
import { ICONS } from '../../../../../interfaces';

describe('ActionButtonsList', () => {
  describe('When config with 2 buttons provided', () => {
    const actionButtons:ActionButton[] = [
      {
        label: 'refresh',
        icon: ICONS.refresh,
        onClick: () => {},
        disabled: false
      },
      {
        label: 'edit',
        icon: ICONS.edit,
        onClick: () => {},
        disabled: true
      }
    ];

    it('is expected to render 2 action buttons', () => {
      render(<ActionButtonsList buttons={actionButtons} handleClick={() => {}} />);

      const buttons = screen.getAllByRole('menuitem');

      expect(buttons).toHaveLength(2);
    });

    it('is expected to render 2 appropriate labels', () => {
      render(<ActionButtonsList buttons={actionButtons} handleClick={() => {}} />);

      const buttons = screen.getAllByRole('menuitem');

      expect(buttons[0]).toHaveTextContent(actionButtons[0].label);
      expect(buttons[1]).toHaveTextContent(actionButtons[1].label);
    });

    it('is expected to disable second button', () => {
      render(<ActionButtonsList buttons={actionButtons} handleClick={() => {}} />);

      const buttons = screen.getAllByRole('menuitem');

      expect(buttons[1]).toBeDisabled();
    });

    it('is expected to call handleClick when user click', async () => {
      const clickHandlerMock = jest.fn();
      render(<ActionButtonsList buttons={actionButtons} handleClick={clickHandlerMock} />);

      const buttons = screen.getAllByRole('menuitem');

      user.click(buttons[0]);

      expect(clickHandlerMock).toBeCalled();
    });
  });
});
