import { describe, expect } from '@jest/globals';
import { VISIBILITY_VALUES, STATUS_VALUES } from '../../../../components/MainListInfoForm';
import { checkIsActive, checkIsPrivate, prepareDataForRequest } from '../helpers';

describe('create list page hook helpres', () => {
  describe('checkIsActive', () => {
    it('Is expected to return true when active status provided', () => {
      expect(checkIsActive(STATUS_VALUES.ACTIVE)).toBeTruthy();
    });
    it('Is expected to return false when inactive status provided', () => {
      expect(checkIsActive(STATUS_VALUES.INACTIVE)).toBeFalsy();
    });
  });

  describe('checkIsPrivate', () => {
    it('Is expected to return true when private status provided', () => {
      expect(checkIsPrivate(VISIBILITY_VALUES.PRIVATE)).toBeTruthy();
    });
    it('Is expected to return false when shared status provided', () => {
      expect(checkIsPrivate(VISIBILITY_VALUES.SHARED)).toBeFalsy();
    });
  });

  describe('prepareDataForRequest', () => {
    it('Is expected to transform provided object to request format', () => {
      const planeObject = {
        description: 'Some description string',
        listName: 'Test list',
        visibility: VISIBILITY_VALUES.SHARED,
        status: STATUS_VALUES.INACTIVE,
        recordType: 'a2234asd-3234adf'
      };
      const transformedObject = {
        description: 'Some description string',
        name: 'Test list',
        isPrivate: false,
        isActive: false,
        entityTypeId: 'a2234asd-3234adf',
        fqlQuery: '',
      };

      expect(prepareDataForRequest(planeObject)).toEqual(transformedObject);
    });
  });
});

