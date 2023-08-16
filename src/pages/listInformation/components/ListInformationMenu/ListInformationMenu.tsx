import React from 'react';
// @ts-ignore:next-line
import { CheckboxFilter } from '@folio/stripes/smart-components';
import {
  Headline
} from '@folio/stripes/components';
import { t } from '../../../../services';
import { ActionButton, ActionMenu } from '../../../../components/ActionMenu';
import { EntityTypeColumn } from '../../../../interfaces';


interface ListInformationMenuProps {
  columns?: EntityTypeColumn[]
  visibleColumns?: string[]
  actionButtons: ActionButton[]
  onChange: ({ values }: {values: string[]}) => void;
}

export const ListInformationMenu: React.FC<ListInformationMenuProps> = ({
  columns,
  visibleColumns,
  actionButtons,
  onChange,
}) => {
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
        onChange={onChange}
        selectedValues={visibleColumns}
      />
    </ActionMenu>
  );
};
