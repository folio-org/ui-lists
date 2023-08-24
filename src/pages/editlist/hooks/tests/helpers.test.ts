import { describe, expect } from '@jest/globals';
import { removeSpaces } from '../helpers';

describe('Helpers', () => {
  describe('removeSpaces', () => {
    it('is expected to remove spaces', () => {
      const objectWithSpaces = {
        name: ' Alex ',
        surname: 'Smith'
      };
      expect(removeSpaces(objectWithSpaces)).toEqual({
        name: 'Alex',
        surname: 'Smith'
      });
    });
  });
});
