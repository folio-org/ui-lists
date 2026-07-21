import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  Accordion,
  FilterAccordionHeader,
  TextField
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { t, tString } from '../../../services';

type SelectedUser = {
  id: string,
  personal?: {
    firstName?: string,
    lastName?: string,
    middleName?: string
  },
  username?: string
};

type UserFilterProps = {
  id: string,
  label: React.ReactNode,
  filterGroupName: string,
  userName: string,
  onSelectUser: (userId: string, userName: string) => void,
  onClear: (filterGroupName: string) => void
};

const getUserDisplayName = (user: SelectedUser) => {
  const { firstName, lastName } = user?.personal ?? {};
  const fullName = [lastName, firstName].filter(Boolean).join(', ');

  return fullName || user?.username || '';
};

export const UserFilter: FC<UserFilterProps> = ({
  id,
  label,
  filterGroupName,
  userName,
  onSelectUser,
  onClear
}) => {
  const intl = useIntl();

  const handleSelect = (user: SelectedUser) => {
    if (user?.id) {
      onSelectUser(user.id, getUserDisplayName(user));
    }
  };

  return (
    <Accordion
      id={id}
      label={label}
      separator={false}
      // @ts-ignore
      header={FilterAccordionHeader}
      displayClearButton={!!userName}
      onClearFilter={() => onClear(filterGroupName)}
    >
      {userName ? (
        <TextField
          value={userName}
          hasClearIcon
          readOnly
          aria-label={tString(intl, 'find-user.label')}
          onClearField={() => onClear(filterGroupName)}
        />
      ) : (
        <Pluggable
          aria-haspopup="true"
          type="find-user"
          dataKey={filterGroupName}
          selectUser={handleSelect}
          searchLabel={tString(intl, 'find-user.label')}
          searchButtonStyle="default"
        >
          <span>{t('find-user.plugin-unavailable')}</span>
        </Pluggable>
      )}
    </Accordion>
  );
};


