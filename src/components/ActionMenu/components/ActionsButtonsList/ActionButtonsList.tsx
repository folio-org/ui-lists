import { Button, Icon } from '@folio/stripes/components';
import React, { FC } from 'react';
import { t } from '../../../../services';
import { ActionButton } from '../../types';

type ActionButtonsListProps = {
  buttons: ActionButton[];
  handleClick: (onCLick: () => void) => void
}

export const ActionButtonsList:FC<ActionButtonsListProps> = ({ buttons, handleClick }) => {
  return (
    <>
      {
            buttons.map(btn => (
              <Button
                key={btn.label}
                type="button"
                buttonStyle="dropdownItem"
                role="menuitem"
                value={btn.label}
                disabled={btn.disabled}
                onClick={() => handleClick(btn.onClick)}
              >
                <Icon icon={btn.icon}>
                  {t(`pane.dropdown.${btn.label}`)}
                </Icon>
              </Button>
            ))
          }
    </>
  );
};
