import React, { FC } from 'react';
import {
  Accordion,
  FilterAccordionHeader
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import { RECORD_TYPES_FILTER_KEY } from '../constants';
import { filterEntityTypes } from './helpers';

type RecordTypesFilterProps = {
  selectedRecordTypes: string[],
  recordTypeConfig: {
    label: React.ReactNode,
    name: string,
    values: {
      value: string,
      label: string
    }[]
  },
  onChange: (selectedTypes: string[]) => void,
  onClear: (group: string) => void
}

export const RecordTypesFilter: FC<RecordTypesFilterProps> = ({
    selectedRecordTypes,
    recordTypeConfig,
    onChange,
    onClear
  }) => {


  return (
    <Accordion
      label={recordTypeConfig.label}
      separator={false}
      // @ts-ignore
      header={FilterAccordionHeader}
      displayClearButton={selectedRecordTypes.length > 0}
      onClearFilter={() => onClear(RECORD_TYPES_FILTER_KEY)}
    >
      <MultiSelectionFilter
        // @ts-ignore
        filter={filterEntityTypes}
        name={RECORD_TYPES_FILTER_KEY}
        dataOptions={recordTypeConfig.values}
        onChange={({values}) => {
          onChange(values)
        }}
        selectedValues={selectedRecordTypes}
      />
    </Accordion>
  )
};
