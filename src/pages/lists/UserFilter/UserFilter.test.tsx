import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { UserFilter } from './UserFilter';
import { CREATED_BY_PREFIX } from '../../../utils/constants';

jest.mock('../../../services', () => ({
  t: (id: string) => id,
  tString: (_intl: unknown, id: string) => id,
}));

const onSelectUser = jest.fn();
const onClear = jest.fn();

const renderUserFilter = ({ userName = '' }: { userName?: string }) => {
  return render(
    <UserFilter
      id="created-by-filter"
      label="Created by"
      filterGroupName={CREATED_BY_PREFIX}
      userName={userName}
      onSelectUser={onSelectUser}
      onClear={onClear}
    />
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserFilter', () => {
  it('renders the find-user plugin trigger when no user is selected', () => {
    renderUserFilter({});

    expect(screen.getByText('find-user.plugin-unavailable')).toBeInTheDocument();
  });

  it('renders the selected user name and a clear button when a user is selected', () => {
    renderUserFilter({ userName: 'Doe, John' });

    expect(screen.getByDisplayValue('Doe, John')).toBeInTheDocument();
  });

  it('calls onClear when the clear button is clicked', async () => {
    const { container } = renderUserFilter({ userName: 'Doe, John' });

    const clearButton = container.querySelector('[class*="clearButton"], button') as HTMLElement;

    await user.click(clearButton);

    expect(onClear).toBeCalledWith(CREATED_BY_PREFIX);
  });
});

