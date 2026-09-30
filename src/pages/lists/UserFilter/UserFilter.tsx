import React, { FC } from 'react';
import {
  Accordion,
  FilterAccordionHeader
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import { useRelatedUsers } from '../../../hooks';
import { RELATED_USERS_TYPE } from '../../../utils/constants';
import { filterEntityTypes } from '../RecordTypesFilter/helpers';

type UserFilterProps = {
  id: string,
  name: string,
  label: React.ReactNode,
  type: RELATED_USERS_TYPE,
  open: boolean,
  selectedUserIds: string[],
  onToggle: () => void,
  onChange: (userIds: string[]) => void,
  onClear: () => void
}

export const UserFilter: FC<UserFilterProps> = ({
  id,
  name,
  label,
  type,
  open,
  selectedUserIds,
  onToggle,
  onChange,
  onClear
}) => {
  const { userOptions } = useRelatedUsers(type);
  // MultiSelectionFilter maps selected ids onto options, so skip ids that have no option (yet)
  const selectedValues = selectedUserIds.filter((userId) => userOptions.some(({ value }) => value === userId));

  return (
    <Accordion
      id={id}
      label={label}
      open={open}
      onToggle={onToggle}
      separator={false}
      // @ts-ignore
      header={FilterAccordionHeader}
      displayClearButton={selectedUserIds.length > 0}
      onClearFilter={onClear}
    >
      <MultiSelectionFilter
        // @ts-ignore
        filter={filterEntityTypes}
        name={name}
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={userOptions}
        onChange={({ values }) => {
          onChange(values);
        }}
        selectedValues={selectedValues}
      />
    </Accordion>
  );
};
