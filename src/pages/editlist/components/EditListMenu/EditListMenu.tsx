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
import { USER_PERMS } from '../../../../utils/constants';

interface ListInformationMenuProps {
  buttonHandlers: {
    'delete':() => void,
    'export': () => void,
    'cancel-export': () => void
  },
  conditions: DisablingConditions,
  stripes: any
}

export const EditListMenu: React.FC<ListInformationMenuProps> = ({
  conditions,
  buttonHandlers,
  stripes
}) => {
  const { isExportInProgress } = conditions;

  const actionButtons:ActionButton[] = [];

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
  const deleteSlot = {
    label: 'delete',
    icon: ICONS.trash,
    onClick: buttonHandlers.delete,
    disabled: isDeleteDisabled(conditions)
  };

  if (stripes.hasPerm(USER_PERMS.ExportList)) {
    actionButtons.push(exportSlot);
  }

  if (stripes.hasPerm(USER_PERMS.DeleteList)) {
    actionButtons.push(deleteSlot);
  }

  return actionButtons.length ? <ActionMenu actionButtons={actionButtons} /> : <></>;
};
