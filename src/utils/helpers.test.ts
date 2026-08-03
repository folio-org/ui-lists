import { expect } from '@jest/globals';
import { HTTPError, NormalizedOptions } from 'ky';
import { STATUS_ACTIVE, STATUS_INACTIVE, VISIBILITY_PRIVATE, VISIBILITY_SHARED, SOURCE_SYSTEM, SOURCE_USER } from './constants';
import { buildListsUrl, filterByIncludes, getFqmError, handleKeyCommand, throwingFqmError } from './helpers';

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

      it('should set canned=true when System (canned) checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [SOURCE_SYSTEM] });

        expect(result).toEqual(`${baseUrl}?canned=true`);
      });

      it('should set canned=false when User generated checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [SOURCE_USER] });

        expect(result).toEqual(`${baseUrl}?canned=false`);
      });

      it('should omit canned when both System and User generated checkbox is checked', async () => {
        const result = buildListsUrl(baseUrl, { filters: [SOURCE_SYSTEM, SOURCE_USER] });

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
        const result = buildListsUrl(baseUrl, {
          filters: [STATUS_ACTIVE, VISIBILITY_PRIVATE, 'record_types.1234', 'record_types.5678'],
        });

        expect(result).toEqual(`${baseUrl}?active=true&private=true&entityTypeIds=1234%2C5678`);
      });

      it('should set createdBy when a Created by user is selected', async () => {
        const result = buildListsUrl(baseUrl, { filters: ['created_by.user-1'] });

        expect(result).toEqual(`${baseUrl}?createdBy=user-1`);
      });

      it('should set updatedBy when an Updated by user is selected', async () => {
        const result = buildListsUrl(baseUrl, { filters: ['updated_by.user-2'] });

        expect(result).toEqual(`${baseUrl}?updatedBy=user-2`);
      });

      it('should combine createdBy and updatedBy with other filters', async () => {
        const result = buildListsUrl(baseUrl, {
          filters: [STATUS_ACTIVE, 'created_by.user-1', 'updated_by.user-2'],
        });

        expect(result).toEqual(`${baseUrl}?active=true&createdBy=user-1&updatedBy=user-2`);
      });

      it('should append sortBy and sortOrder when sorting is provided', async () => {
        const result = buildListsUrl(baseUrl, { sortBy: 'updatedDate', sortOrder: 'desc' });

        expect(result).toEqual(`${baseUrl}?sortBy=updatedDate&sortOrder=desc`);
      });

      it('should combine sorting with filters and search', async () => {
        const result = buildListsUrl(baseUrl, {
          filters: [STATUS_ACTIVE],
          search: 'report',
          sortBy: 'name',
          sortOrder: 'asc',
        });

        expect(result).toEqual(`${baseUrl}?active=true&search=report&sortBy=name&sortOrder=asc`);
      });

      it('should omit sorting params when sorting is not provided', async () => {
        const result = buildListsUrl(baseUrl, { filters: [STATUS_ACTIVE] });

        expect(result).toEqual(`${baseUrl}?active=true`);
      });
    });
  });

  describe('filterByIncludes', () => {
    it('is expected to filter items', () => {
      const items = [
        {
          label: 'Loans',
          value: '1233131',
        },
        {
          label: 'Users',
          value: '123s1233131',
        },
      ];

      expect(filterByIncludes('ers', items)).toEqual([
        {
          label: 'Users',
          value: '123s1233131',
        },
      ]);
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
  });

  describe('getFqmError', () => {
    it.each([
      // non error
      [
        1234,
        {
          message: '1234',
          code: '_misc_error',
          parameters: [{ key: 'stack', value: expect.stringContaining('helpers.ts') }],
        },
      ],
      // non-http error
      [
        new Error('test'),
        {
          message: 'test',
          code: '_misc_error',
          parameters: [
            { key: 'type', value: 'Error' },
            { key: 'stack', value: expect.stringContaining('helpers.test') },
          ],
        },
      ],
      // non-json error
      [
        new HTTPError(
          {
            json: (): Promise<unknown> => {
              throw new Error('unparsable');
            },
            status: 500,
          } as Response,
          {} as Request,
          {} as NormalizedOptions,
        ),
        {
          code: '_misc_error',
          parameters: [{ key: 'status', value: '500' }],
        },
      ],
      // non-object error
      [
        new HTTPError(
          {
            json: () => Promise.resolve('decoded, but not FQM, error'),
            status: 500,
          } as Response,
          {} as Request,
          {} as NormalizedOptions,
        ),
        {
          message: '"decoded, but not FQM, error"',
          code: '_misc_error',
          parameters: [{ key: 'status', value: '500' }],
        },
      ],
      // non-FQM object error
      [
        new HTTPError(
          {
            json: () => Promise.resolve({ message: 'decoded, but not FQM, error' }),
            status: 500,
          } as Response,
          {} as Request,
          {} as NormalizedOptions,
        ),
        {
          message: '{"message":"decoded, but not FQM, error"}',
          code: '_misc_error',
          parameters: [{ key: 'status', value: '500' }],
        },
      ],
      // what we _want_ to get
      [
        new HTTPError(
          {
            json: () => Promise.resolve({ message: 'FQM error', code: 'something' }),
            status: 500,
          } as Response,
          {} as Request,
          {} as NormalizedOptions,
        ),
        {
          message: 'FQM error',
          code: 'something',
        },
      ],
    ])('error %p results in %p', async (error, expected) => {
      const actual = await getFqmError(error);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('throwingFqmError', () => {
    it('does nothing when no errors are thrown', async () => {
      expect(await throwingFqmError(() => Promise.resolve('test'))).toBe('test');
    });

    it('rethrows FQM error when error is thrown', async () => {
      const errorToThrow = new Error('test');
      await expect(throwingFqmError(() => Promise.reject(errorToThrow))).rejects.toMatchObject({
        message: 'test',
        code: '_misc_error',
        parameters: expect.any(Array),
      });
    });
  });
});
