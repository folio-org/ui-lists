import React from 'react';
import {
  ActionButton,
  isDeleteDisabled,
  isCancelExportDisabled,
  isExportDisabled,
  DisablingConditions
} from '../../../../services';
import { ActionMenu } from '../../../../components';
import { ICONS } from '../../../../interfaces';

interface ListInformationMenuProps {
  buttonHandlers: {
    'delete':() => void,
    'export': () => void,
    'cancel-export': () => void
  },
  conditions: DisablingConditions
}

export const EditListMenu: React.FC<ListInformationMenuProps> = ({
  conditions,
  buttonHandlers,
}) => {
  const { isExportInProgress } = conditions;

  const initExportButton = {
    label: 'export',
    icon: ICONS.download,
    onClick: buttonHandlers.export,
    disabled: isExportDisabled(conditions)
  };

  const cancelExportButton = {
    label: 'cancel-export',
    icon: ICONS.download,
    onClick: buttonHandlers['cancel-export'],
    disabled: isCancelExportDisabled(conditions)
  };

  const exportSlot = isExportInProgress ? cancelExportButton : initExportButton;

  const actionButtons:ActionButton[] = [
    {
      label: 'delete',
      icon: ICONS.trash,
      onClick: buttonHandlers.delete,
      disabled: isDeleteDisabled(conditions)
    },
    exportSlot
  ];

  return <ActionMenu actionButtons={actionButtons} />;
};
