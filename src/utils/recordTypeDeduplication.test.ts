/* eslint-disable implicit-arrow-linebreak, function-paren-newline */ // nightmare for hook testing
import { IntlShape } from 'react-intl';
import { tString } from '../services';
import {
  deduplicateRecordTypeLabels,
  injectLabelsIntoListsResponse,
  injectLabelsIntoRecordTypes,
} from './recordTypeDeduplication';
import { EntityType, ListsRecord, ListsResponse } from '../interfaces';

jest.mock('../services');

const mockTString = tString as jest.MockedFunction<typeof tString>;
const intl = {} as IntlShape;

mockTString.mockImplementation((_intl, id, values) =>
  [
    id.split('record-types.label.deduplication.')[1],
    `label=${values!.label}`,
    `number=${values!.number}`,
  ].join(', '),
);

describe('deduplicateRecordTypeLabels', () => {
  it('handles empty list', () => {
    const result = deduplicateRecordTypeLabels([], intl);
    expect(result).toEqual({});
  });

  it('handles unique labels', () => {
    const result = deduplicateRecordTypeLabels(
      [
        { id: 'id-1', label: 'Label 1', isCustom: false },
        { id: 'id-2', label: 'Label 2', isCustom: true, createdAt: '2023-01-02' },
      ] as EntityType[],
      intl,
    );
    expect(result).toEqual({
      'id-1': 'Label 1',
      'id-2': 'Label 2',
    });
  });

  it('handles built-in + single custom with same label', () => {
    const result = deduplicateRecordTypeLabels(
      [
        { id: 'id-1', label: 'Label 1', isCustom: false },
        { id: 'id-2', label: 'Label 1', isCustom: true, createdAt: '2023-01-02' },
      ] as EntityType[],
      intl,
    );
    expect(result).toEqual({
      'id-1': 'built-in, label=Label 1, number=undefined',
      'id-2': 'custom.with-built-in, label=Label 1, number=1',
    });
  });

  it('handles built-in + multiple customs with same label', () => {
    const result = deduplicateRecordTypeLabels(
      [
        { id: 'id-1', label: 'Label 1', isCustom: false },
        { id: 'id-2', label: 'Label 1', isCustom: true, createdAt: '2023-01-02' },
        { id: 'id-3', label: 'Label 1', isCustom: true, createdAt: '2023-01-03' },
        { id: 'id-4', label: 'Label 1', isCustom: true, createdAt: '2023-01-01' },
      ] as EntityType[],
      intl,
    );
    expect(result).toEqual({
      'id-1': 'built-in, label=Label 1, number=undefined',
      'id-2': 'custom.with-built-in, label=Label 1, number=2',
      'id-3': 'custom.with-built-in, label=Label 1, number=3',
      'id-4': 'custom.with-built-in, label=Label 1, number=1',
    });
  });

  it('handles multiple customs with same label', () => {
    const result = deduplicateRecordTypeLabels(
      [
        { id: 'id-1', label: 'Label 1', isCustom: true, createdAt: '2023-01-02' },
        { id: 'id-2', label: 'Label 1', isCustom: true, createdAt: '2023-01-03' },
        { id: 'id-3', label: 'Label 1', isCustom: true, createdAt: '2023-01-01' },
      ] as EntityType[],
      intl,
    );
    expect(result).toEqual({
      'id-1': 'custom.no-built-in, label=Label 1, number=2',
      'id-2': 'custom.no-built-in, label=Label 1, number=3',
      'id-3': 'custom.no-built-in, label=Label 1, number=1',
    });
  });
});

describe('injectLabelsIntoRecordTypes', () => {
  it('injects labels based on mapping', () => {
    const result = injectLabelsIntoRecordTypes(
      [
        { id: 'id-1', label: 'Old label 1' },
        { id: 'id-2', label: 'Old label 2' },
      ] as EntityType[],
      {
        'id-1': 'New label 1',
      },
    );
    expect(result).toEqual([
      { id: 'id-1', label: 'New label 1' },
      { id: 'id-2', label: 'Old label 2' },
    ]);
  });
});

describe('injectLabelsIntoListsResponse', () => {
  it('returns undefined when given undefined', () => {
    const result = injectLabelsIntoListsResponse(undefined, {});
    expect(result).toBeUndefined();
  });

  it('injects labels into lists based on mapping', () => {
    const result = injectLabelsIntoListsResponse(
      {
        content: [
          { id: 'list-1', name: 'List 1', entityTypeId: 'id-1' },
          { id: 'list-2', name: 'List 2', entityTypeId: 'id-2' },
        ],
      } as ListsResponse<ListsRecord[]>,
      {
        'id-1': 'New label 1',
        'id-2': 'New label 2',
      },
    );
    expect(result).toEqual({
      content: [
        { id: 'list-1', name: 'List 1', entityTypeId: 'id-1', entityTypeName: 'New label 1' },
        { id: 'list-2', name: 'List 2', entityTypeId: 'id-2', entityTypeName: 'New label 2' },
      ],
    });
  });
});
