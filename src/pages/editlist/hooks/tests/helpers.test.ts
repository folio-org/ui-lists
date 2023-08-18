import { describe, expect } from '@jest/globals';
import { checkIsStateChanged, removeSpaces } from '../helpers';

describe('Helpers', () => {
  describe('checkIsStateChanged', () => {
    it('is expected to return false if receives equal objects', () => {
      const objectOne = {
        user: 'Max'
      };
      const objectTwo = {
        user: 'Max'
      };

      expect(checkIsStateChanged(objectOne, objectTwo)).toBeFalsy();
    });

    it('is expected to return true if receives different objects', () => {
      const objectOne = {
        user: 'Max'
      };
      const objectTwo = {
        user: 'Alex'
      };

      expect(checkIsStateChanged(objectOne, objectTwo)).toBeTruthy();
    });
  });

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
