import React, { ReactNode, useCallback, useState } from 'react';
import {
  Dropdown,
  DropdownMenu
} from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import { t, ActionButton, tString } from '../../services';
import { ActionButtonsList } from './components';

import css from './ActionMenu.module.css';

interface ActionMenuProps {
    actionButtons: ActionButton[]
    children?: ReactNode
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  actionButtons,
  children
}) => {
  const int = useIntl();
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen(!open), [open]);
  const handleClick = useCallback((onClick: () => void) => {
    handleToggle();
    onClick();
  }, [handleToggle]);

  return (
    <Dropdown
      id="AddPermissionDropdown"
      data-testid="paneDropdownButton"
      label={t('paneHeader.button.actions')}
      buttonProps={{ buttonStyle: 'primary', bottomMargin0: true }}
      open={open}
      onToggle={handleToggle}
    >
      <DropdownMenu
        aria-label={tString(int, 'pane.dropdown.available-permissions')}
        open={open}
        onToggle={handleToggle}
      >
        <div className={children ? css.actionMenuGroup : ''}>
          <ActionButtonsList buttons={actionButtons} handleClick={handleClick} />
        </div>
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};
