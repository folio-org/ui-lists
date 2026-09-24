import React from 'react';
import { QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import { UserFilter } from './UserFilter';
import { RELATED_USERS_TYPE } from '../../../utils/constants';
import { getSortedUserOptions } from '../../../hooks/useRelatedUsers';
import { startMirage } from '../../../../test/mirage';
import { queryClient } from '../../../../test/utils';

const onChange = jest.fn();
const onClear = jest.fn();
const onToggle = jest.fn();

const renderUserFilter = (props: any = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UserFilter
        id="created-by-filter"
        name="createdBy"
        label="Created by"
        type={RELATED_USERS_TYPE.CreatedBy}
        open={false}
        selectedUserIds={[]}
        onToggle={onToggle}
        onChange={onChange}
        onClear={onClear}
        {...props}
      />
    </QueryClientProvider>
  );
};

const getLastMultiSelectionProps = () => {
  const { calls } = (MultiSelectionFilter as unknown as jest.Mock).mock;

  return calls[calls.length - 1][0];
};

describe('UserFilter', () => {
  let server: any;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    server = startMirage({});
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should be collapsed when open is false', () => {
    renderUserFilter();

    expect(document.getElementById('created-by-filter')).not.toHaveAttribute('open');
  });

  it('should pass users who created lists as options', async () => {
    renderUserFilter();

    await waitFor(() => {
      expect(getLastMultiSelectionProps().dataOptions).toEqual([
        { value: '11111111-1111-1111-1111-111111111111', label: 'Jones, Bob' },
        { value: '33333333-3333-3333-3333-333333333333', label: 'Smith, Anna' },
      ]);
    });
  });

  it('should request users who updated lists for the Updated by type', async () => {
    renderUserFilter({ id: 'updated-by-filter', type: RELATED_USERS_TYPE.UpdatedBy });

    await waitFor(() => {
      expect(getLastMultiSelectionProps().dataOptions).toEqual([
        { value: '22222222-2222-2222-2222-222222222222', label: 'Black, Dana' },
        { value: '44444444-4444-4444-4444-444444444444', label: 'White, Carl' },
      ]);
    });
  });

  it('should only pass selected ids that have a matching option', async () => {
    renderUserFilter({ selectedUserIds: ['11111111-1111-1111-1111-111111111111', 'unknown'] });

    await waitFor(() => {
      expect(getLastMultiSelectionProps().selectedValues).toEqual(['11111111-1111-1111-1111-111111111111']);
    });
  });

  it('should show clear button and call onClear when users are selected', async () => {
    renderUserFilter({ selectedUserIds: ['11111111-1111-1111-1111-111111111111'] });

    await user.click(screen.getByRole('button', { name: 'Clean' }));

    expect(onClear).toHaveBeenCalled();
  });

  it('should not show clear button when no users are selected', () => {
    renderUserFilter();

    expect(screen.queryByRole('button', { name: 'Clean' })).not.toBeInTheDocument();
  });

  describe('getSortedUserOptions', () => {
    it('should sort users alphabetically and remove duplicates', () => {
      expect(getSortedUserOptions([
        { id: '2', fullName: 'Young, Zoe' },
        { id: '1', fullName: 'adams, Adam' },
        { id: '2', fullName: 'Young, Zoe' },
        { id: '3', fullName: 'Miller, Mia' },
      ])).toEqual([
        { value: '1', label: 'adams, Adam' },
        { value: '3', label: 'Miller, Mia' },
        { value: '2', label: 'Young, Zoe' },
      ]);
    });

    it('should fall back to user id when there is no name', () => {
      expect(getSortedUserOptions([{ id: 'abc' }])).toEqual([{ value: 'abc', label: 'abc' }]);
    });

    it('should return empty list when there are no users', () => {
      expect(getSortedUserOptions(undefined)).toEqual([]);
    });
  });
});
