import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { RecordTypesFilter } from './RecordTypesFilter';

const onChange = jest.fn();
const onClear = jest.fn();

const defaultConfig = {
  label: 'Record filter',
  name: 'record_types',
  values: [
    {
      label: 'Holdings',
      value: 'record_types.123213123'
    },
    {
      label: 'Loans',
      value: 'record_types.12asdsa3213123'
    }
  ]
};

const renderRecordTypesFilter = ({ config = defaultConfig, selected = [] }: any) => {
  return render(
    <RecordTypesFilter
      recordTypeConfig={config}
      onChange={onChange}
      onClear={onClear}
      selectedRecordTypes={selected}
    />
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RecordTypesFilter', () => {
  describe('Clean', () => {
    it('is expected to render clean button', async () => {
      renderRecordTypesFilter({ selected:['Loans'] });

      const button = screen.getByRole('button', { name: /clean/i });

      await user.click(button);

      expect(onClear).toBeCalledWith('record_types');
    });
  });
  describe('onChange', () => {
    it('is expected to render clean button', async () => {
      renderRecordTypesFilter({ selected:['Loans'] });

      const button = screen.getByRole('button', { name: /change/i });

      await user.click(button);

      expect(onChange).toBeCalled();
    });
  });
});
