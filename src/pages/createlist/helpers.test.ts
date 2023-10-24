import { computeRecordTypeOptions } from './helpers';
import { t } from '../../services';

describe('computeRecordTypeOptions', () => {
  it('is expected to add default options if there is no selected type', () => {
    const defaultPlaceholder = {
      label: t('create-list.choose-record-type'),
      selected: false,
      value: '',
    };

    const rawTypes = [
      {
        id: '0cb79a4c-f7eb-4941-a104-745224ae0292',
        label: 'Items'
      },
      {
        id: '4e09d89a-44ed-418e-a9cc-820dfb27bf3a',
        label: 'Loans'
      },
    ];

    const result = [
      defaultPlaceholder,
      {
        value: '0cb79a4c-f7eb-4941-a104-745224ae0292',
        label: 'Items',
        selected: false
      },
      {
        value: '4e09d89a-44ed-418e-a9cc-820dfb27bf3a',
        label: 'Loans',
        selected: false
      },
    ];

    expect(computeRecordTypeOptions(rawTypes)).toEqual(result);
  });

  it('is expected to add selected value and hide placeholder options if there is selected type', () => {
    const rawTypes = [
      {
        id: '0cb79a4c-f7eb-4941-a104-745224ae0292',
        label: 'Items'
      },
      {
        id: '4e09d89a-44ed-418e-a9cc-820dfb27bf3a',
        label: 'Loans'
      },
    ];

    const result = [
      {
        value: '0cb79a4c-f7eb-4941-a104-745224ae0292',
        label: 'Items',
        selected: true
      },
      {
        value: '4e09d89a-44ed-418e-a9cc-820dfb27bf3a',
        label: 'Loans',
        selected: false
      },
    ];

    expect(computeRecordTypeOptions(rawTypes, '0cb79a4c-f7eb-4941-a104-745224ae0292')).toEqual(result);
  });
});
