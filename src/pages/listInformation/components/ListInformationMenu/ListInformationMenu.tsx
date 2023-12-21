import React from 'react';
// @ts-ignore:next-line
import { CheckboxFilter } from '@folio/stripes/smart-components';
import {
  Headline
} from '@folio/stripes/components';
import { t,
  ActionButton,
  isEditDisabled,
  isRefreshDisabled,
  isDeleteDisabled,
  isCancelRefreshDisabled,
  isCancelExportDisabled,
  isExportDisabled,
  DisablingConditions } from '../../../../services';
import { ActionMenu } from '../../../../components';
import { EntityTypeColumn, ICONS } from '../../../../interfaces';
import { USER_PERMS } from '../../../../utils/constants';

export interface ListInformationMenuProps {
  stripes: any,
  columns?: EntityTypeColumn[]
  visibleColumns?: string[] | null,
  buttonHandlers: {
    'cancel-refresh': () => void,
    'refresh': () => void,
    'edit': () => void,
    'delete':() => void,
    'export': () => void,
    'cancel-export': () => void,
    'copy': () => void
  },
  conditions: DisablingConditions,
  onColumnsChange: ({ values }: {values: string[]}) => void;
}

export const ListInformationMenu: React.FC<ListInformationMenuProps> = ({
  stripes,
  columns,
  visibleColumns,
  conditions,
  buttonHandlers,
  onColumnsChange,
}) => {
  const { isExportInProgress, isRefreshInProgress } = conditions;
  const cancelRefreshButton = {
    label: 'cancel-refresh',
    icon: ICONS.refresh,
    onClick: buttonHandlers['cancel-refresh'],
    disabled: isCancelRefreshDisabled(conditions)
  };

  const refreshButton = {
    label: 'refresh',
    icon: ICONS.refresh,
    onClick: buttonHandlers.refresh,
    disabled: isRefreshDisabled(conditions)
  };

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

  const refreshSlot = isRefreshInProgress ? (
    cancelRefreshButton
  ) : (
    refreshButton
  );

  const exportSlot = isExportInProgress ? cancelExportButton : initExportButton;

  const actionButtons:ActionButton[] = [];

  if (stripes.hasPerm(USER_PERMS.RefreshList)) {
    actionButtons.push(refreshSlot);
  }

  if (stripes.hasPerm(USER_PERMS.UpdateList)) {
    actionButtons.push(
      {
        label: 'edit',
        icon: ICONS.edit,
        onClick: buttonHandlers.edit,
        disabled: isEditDisabled(conditions),
      }
    );
  }

  if (stripes.hasPerm(USER_PERMS.UpdateList)) {
    actionButtons.push(
      {
        label: 'copy',
        icon: ICONS.duplicate,
        onClick: buttonHandlers.copy,
        disabled: false,
      }
    );
  }

  if (stripes.hasPerm(USER_PERMS.DeleteList)) {
    actionButtons.push({
      label: 'delete',
      icon: ICONS.trash,
      onClick: buttonHandlers.delete,
      disabled: isDeleteDisabled(conditions)
    });
  }

  if (stripes.hasPerm(USER_PERMS.ExportList)) {
    actionButtons.push(exportSlot);
  }

  return (
    <ActionMenu actionButtons={actionButtons}>
      <Headline size="medium" margin="none" tag="p" faded>
        {t('pane.dropdown.show-columns')}
      </Headline>
      <CheckboxFilter
        // @ts-ignore:next-line
        dataOptions={columns}
        name="ui-lists-columns-filter"
        // @ts-ignore:next-line
        onChange={onColumnsChange}
        selectedValues={visibleColumns}
      />
    </ActionMenu>
  );
};
