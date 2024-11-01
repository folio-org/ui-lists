import { expect } from '@jest/globals';
import { filterEntityTypes } from './helpers';


describe('filterEntitytypes', () => {
  it('is expected to filter entity types options', () => {
    const items = [{
      label: 'Loans',
      value: '1233131',
      selected: false
    },
    {
      label: 'Users',
      value: '123s1233131',
      selected: false
    }];


    expect(filterEntityTypes('sers', items)).toEqual({
      renderedItems: [{
        label: 'Users',
        value: '123s1233131',
        selected: false
      }]
    });
  });
});
