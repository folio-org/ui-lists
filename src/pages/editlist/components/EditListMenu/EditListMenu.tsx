import React from 'react';
import {
  ActionButton,
  isDeleteDisabled,
  DisablingConditions
} from '../../../../services';
import { ActionMenu } from '../../../../components';
import { ICONS } from '../../../../interfaces';
import { useListAppPermissions } from '../../../../hooks';

interface ListInformationMenuProps {
  buttonHandlers: {
    'delete':() => void
  },
  conditions: DisablingConditions
}

export const EditListMenu: React.FC<ListInformationMenuProps> = ({
  conditions,
  buttonHandlers
}) => {
  const permissions = useListAppPermissions();

  const actionButtons:ActionButton[] = [];

  const deleteSlot = {
    label: 'delete',
    icon: ICONS.trash,
    onClick: buttonHandlers.delete,
    disabled: isDeleteDisabled(conditions)
  };

  if (permissions.canDelete) {
    actionButtons.push(deleteSlot);
  }

  return actionButtons.length ? <ActionMenu actionButtons={actionButtons} /> : <></>;
};
