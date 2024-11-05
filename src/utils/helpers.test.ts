import { expect } from '@jest/globals';
import { buildListsUrl, filterByIncludes, handleKeyCommand, removeBackslashes } from './helpers';
import { STATUS_ACTIVE, STATUS_INACTIVE, VISIBILITY_PRIVATE, VISIBILITY_SHARED } from './constants';

const baseUrl = 'http://www.test.com';

describe('Helpers', () => {
  describe('Helpers', () => {
    describe('Get Lists Filters', () => {
      it('should return empty string when no base URL and no filters are applied', async () => {
        const result = buildListsUrl('');

        expect(result).toEqual('');
      });

      it('should return base URL when no filters are applied', async () => {
        const result = buildListsUrl(baseUrl);

        expect(result).toEqual(baseUrl);
      });

      it('should set active=true when Active checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [STATUS_ACTIVE] });

        expect(result).toEqual(`${baseUrl}?active=true`);
      });

      it('should set active=false when Inactive checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [STATUS_INACTIVE] });

        expect(result).toEqual(`${baseUrl}?active=false`);
      });

      it('should omit active when both Active and Inactive checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [STATUS_ACTIVE, STATUS_INACTIVE] });

        expect(result).toEqual(baseUrl);
      });

      it('should set private=true when Private checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [VISIBILITY_PRIVATE] });

        expect(result).toEqual(`${baseUrl}?private=true`);
      });

      it('should set private=false when Shared checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [VISIBILITY_SHARED] });

        expect(result).toEqual(`${baseUrl}?private=false`);
      });

      it('should omit visibility when both Private and Shared checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [VISIBILITY_PRIVATE, VISIBILITY_SHARED] });

        expect(result).toEqual(baseUrl);
      });

      it('should include entity type GUID if checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: ['record_types.1234'] });

        expect(result).toEqual(`${baseUrl}?entityTypeIds=1234`);
      });

      it('should include multiple entity type GUIDs if checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: ['record_types.1234', 'record_types.5678'] });

        expect(result).toEqual(`${baseUrl}?entityTypeIds=1234%2C5678`);
      });

      it('should create a complex URL string if multipled filters are checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [STATUS_ACTIVE, VISIBILITY_PRIVATE, 'record_types.1234', 'record_types.5678'] });

        expect(result).toEqual(`${baseUrl}?active=true&private=true&entityTypeIds=1234%2C5678`);
      });
    });
  });

  describe('filterByIncludes', () => {
    it('is expected to filter items', () => {
      const items = [{
        label: 'Loans',
        value: '1233131'
      },
      {
        label: 'Users',
        value: '123s1233131'
      }];

      expect(filterByIncludes('ers', items)).toEqual([{
        label: 'Users',
        value: '123s1233131'
      }]);
    });
  });

  describe('handleKeyEvent', () => {
    it('is expected to call preventDefault with callback', () => {
      const preventDefault = jest.fn();
      const keyboardEvent = new KeyboardEvent('keydown');

      jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation(preventDefault);

      const callback = jest.fn();

      handleKeyCommand(callback)(keyboardEvent);

      expect(callback).toBeCalled();
      expect(preventDefault).toBeCalled();
    });

    it('is expected to call preventDefault but not callback if condition false', () => {
      const preventDefault = jest.fn();
      const keyboardEvent = new KeyboardEvent('keydown');

      jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation(preventDefault);

      const callback = jest.fn();

      handleKeyCommand(callback, false)(keyboardEvent);

      expect(callback).not.toBeCalled();
      expect(preventDefault).toBeCalled();
    });

    describe('removeBackslashes', () => {
      it('should remove all single backslashes from a string', () => {
        expect(removeBackslashes('Wierd test \\/\\/\\/ \\*\\* symbols \\)\\)\\)')).toBe('Wierd test /// ** symbols )))');
      });

      it('should return the same string if no backslashes are present', () => {
        expect(removeBackslashes('No backslashes here')).toBe('No backslashes here');
      });

      it('should handle strings with double backslashes', () => {
        expect(removeBackslashes('Double backslashes here: \\\\ and here: \\\\')).toBe('Double backslashes here:  and here: ');
      });

      it('should handle strings with multiple backslashes in a row', () => {
        expect(removeBackslashes('Multiple backslashes: \\\\\\\\\\')).toBe('Multiple backslashes: ');
      });

      it('should handle an empty string', () => {
        expect(removeBackslashes('')).toBe('');
      });

      it('should return empty string if input is undefined', () => {
        expect(removeBackslashes()).toBe('');
      });
    });
  });
});
