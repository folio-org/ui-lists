import React, { ReactNode, useCallback, useRef, useState } from 'react';
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
  // Selecting a menu item closes the menu by flipping this `open` state directly,
  // which bypasses the Dropdown/Popdown focus-restoration logic (that logic only
  // runs when the trigger button itself, or its own keyboard handlers, close the
  // menu). Left alone, the clicked item is removed from the DOM and focus falls
  // through to the document body, which screen readers then announce instead of
  // the action that was actually taken.
  const containerRef = useRef<HTMLDivElement>(null);
  const handleToggle = useCallback(() => setOpen(!open), [open]);
  const handleClick = useCallback((onClick: () => void) => {
    handleToggle();
    containerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    onClick();
  }, [handleToggle]);

  return (
    <div ref={containerRef}>
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
    </div>
  );
};
