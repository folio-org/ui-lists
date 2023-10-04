import { describe, expect } from '@jest/globals';
import { isInactive, isCanned, isInDraft, isEmptyList } from '../helpers';
import list from '../../../../test/data/listDetails.refreshed.json';
import { ListsRecordDetails } from '../../../interfaces';

describe('List helpers tests', () => {
  describe('isInactive', () => {
    describe('When list is active', () => {
      const activeList = { ...list, isActive: true } as ListsRecordDetails;

      it('is expected to return false', () => {
        expect(isInactive(activeList)).toEqual(false);
      });
    });
    describe('When list is not active', () => {
      const activeList = { ...list, isActive: false } as ListsRecordDetails;

      it('is expected to return true', () => {
        expect(isInactive(activeList)).toEqual(true);
      });
    });
  });

  describe('isEmptyList', () => {
    describe('When list dont contains records', () => {
      const listWithRecords = { ...list } as ListsRecordDetails;
      delete listWithRecords.successRefresh;

      it('is expected to return true', () => {
        expect(isEmptyList(listWithRecords)).toEqual(true);
      });
    });
    describe('When list contains records', () => {
      const activeList = { ...list, successRefresh: { recordsCount: 100 } } as ListsRecordDetails;

      it('is expected to return false', () => {
        expect(isEmptyList(activeList)).toEqual(false);
      });
    });
  });

  describe('isCanned', () => {
    describe('When list is canned', () => {
      const cannedList = { ...list, isCanned: true } as ListsRecordDetails;

      it('is expected to return true', () => {
        expect(isCanned(cannedList)).toEqual(true);
      });
    });
    describe('When list is not canned', () => {
      const cannedList = { ...list, isCanned: false } as ListsRecordDetails;

      it('is expected to return false', () => {
        expect(isCanned(cannedList)).toEqual(false);
      });
    });
  });
  describe('isInDraft', () => {
    describe('When list has userFriendlyQuery', () => {
      const listWithUserFriendlyQuery = { ...list, fqlQuery: 'some query' } as ListsRecordDetails;

      it('is expected to return true', () => {
        expect(isInDraft(listWithUserFriendlyQuery)).toEqual(false);
      });
    });
    describe('When list has not userFriendlyQuery', () => {
      const listWithOutUserFriendlyQuery = { ...list, fqlQuery: '' } as ListsRecordDetails;

      it('is expected to return false', () => {
        expect(isInDraft(listWithOutUserFriendlyQuery)).toEqual(true);
      });
    });
  });
});
