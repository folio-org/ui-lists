import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import {
  Headline,
  TextField
} from '@folio/stripes/components';
import {
  t,
  tString,
  ActionButton,
  isEditDisabled,
  isRefreshDisabled,
  isDeleteDisabled,
  isCancelRefreshDisabled,
  isCancelExportDisabled,
  isExportDisabled,
  DisablingConditions
} from '../../../../services';
import { ActionMenu } from '../../../../components';
import { ICONS, QueryBuilderColumnMetadata } from '../../../../interfaces';
import { useListAppPermissions } from "../../../../hooks";

export interface ListInformationMenuProps {
  columns: QueryBuilderColumnMetadata[]
  visibleColumns?: string[] | null,
  buttonHandlers: {
    'cancel-refresh': () => void,
    'refresh': () => void,
    'edit': () => void,
    'delete':() => void,
    'export-all': () => void,
    'export-visible': () => void,
    'cancel-export': () => void,
    'copy': () => void
  },
  conditions: DisablingConditions,
  onColumnsChange: ({ values }: {values: string[]}) => void;
}

export const ListInformationMenu: React.FC<ListInformationMenuProps> = ({
  columns,
  visibleColumns,
  conditions,
  buttonHandlers,
  onColumnsChange,
}) => {
  const permissions = useListAppPermissions();
  const { isExportInProgress, isRefreshInProgress } = conditions;

  const intl = useIntl();
  const [columnSearch, setColumnSearch] = useState('');

  const filteredColumns = columns.filter(item => item.label.toLowerCase().includes(columnSearch.toLowerCase()));
  const allDisabled = columns.every(item => item.disabled);

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
    label: 'export-visible',
    icon: ICONS.download,
    onClick: buttonHandlers['export-visible'],
    disabled: isExportDisabled(conditions)
  };

  const initExportAllButton = {
    label: 'export-all',
    icon: ICONS.download,
    onClick: buttonHandlers['export-all'],
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

  const exportSlot = isExportInProgress ? [cancelExportButton] : [initExportButton, initExportAllButton];

  const actionButtons:ActionButton[] = [];

  if (permissions.canRefresh) {
    actionButtons.push(refreshSlot);
  }

  if (permissions.canUpdate) {
    actionButtons.push(
      {
        label: 'edit',
        icon: ICONS.edit,
        onClick: buttonHandlers.edit,
        disabled: isEditDisabled(conditions),
      }
    );
  }

  if (permissions.canUpdate) {
    actionButtons.push(
      {
        label: 'copy',
        icon: ICONS.duplicate,
        onClick: buttonHandlers.copy,
        disabled: false,
      }
    );
  }

  if (permissions.canDelete) {
    actionButtons.push({
      label: 'delete',
      icon: ICONS.trash,
      onClick: buttonHandlers.delete,
      disabled: isDeleteDisabled(conditions)
    });
  }

  if (permissions.canExport) {
    actionButtons.push(...exportSlot);
  }

  return (
    <ActionMenu actionButtons={actionButtons}>
      {
        !isEmpty(columns) && (
          <>
            <TextField
              value={columnSearch}
              onChange={e => setColumnSearch(e.target.value)}
              aria-label={tString(intl, 'pane.dropdown.ariaLabel.columnFilter' )}
              disabled={allDisabled}
              placeholder={tString(intl, 'pane.dropdown.search.placeholder' )}
            />
            <Headline size="medium" margin="none" tag="p" faded>
              {t('pane.dropdown.show-columns')}
            </Headline>
            <CheckboxFilter
              dataOptions={filteredColumns}
              name="ui-lists-columns-filter"
              onChange={onColumnsChange}
              selectedValues={visibleColumns ?? []}
            />
          </>
        )
      }
    </ActionMenu>
  );
};
