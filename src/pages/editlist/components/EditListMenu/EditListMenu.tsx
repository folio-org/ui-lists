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
import { useListAppPermissions } from '../../../../hooks';

interface ListInformationMenuProps {
  buttonHandlers: {
    'delete':() => void,
    'export-all': () => void,
    'export-visible': () => void,
    'cancel-export': () => void
  },
  conditions: DisablingConditions
}

export const EditListMenu: React.FC<ListInformationMenuProps> = ({
  conditions,
  buttonHandlers
}) => {
  const permissions = useListAppPermissions();
  const { isExportInProgress } = conditions;

  const actionButtons:ActionButton[] = [];

  const initExportButton = {
    label: 'export-all',
    icon: ICONS.download,
    onClick: buttonHandlers['export-all'],
    disabled: isExportDisabled(conditions)
  };

  const initExportAllButton = {
    label: 'export-visible',
    icon: ICONS.download,
    onClick: buttonHandlers['export-visible'],
    disabled: isExportDisabled(conditions)
  };

  const cancelExportButton = {
    label: 'cancel-export',
    icon: ICONS.download,
    onClick: buttonHandlers['cancel-export'],
    disabled: isCancelExportDisabled(conditions)
  };

  const exportSlot = isExportInProgress ? [cancelExportButton] : [initExportButton, initExportAllButton];

  const deleteSlot = {
    label: 'delete',
    icon: ICONS.trash,
    onClick: buttonHandlers.delete,
    disabled: isDeleteDisabled(conditions)
  };

  if (permissions.canExport) {
    actionButtons.push(...exportSlot);
  }

  if (permissions.canDelete) {
    actionButtons.push(deleteSlot);
  }

  return actionButtons.length ? <ActionMenu actionButtons={actionButtons} /> : <></>;
};
