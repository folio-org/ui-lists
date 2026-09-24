import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { RelatedUser, RelatedUsersResponse } from '../../interfaces';
import { RELATED_USERS_LIMIT, RELATED_USERS_TYPE, RELATED_USERS_URL } from '../../utils/constants';

const RELATED_USERS_HASH = 'relatedUsers';

export const getUserName = ({ fullName, id }: RelatedUser) => fullName || id;

// The endpoint is expected to return distinct users in alphabetical order already,
// but dedupe and sort here too so the dropdown stays stable either way.
export const getSortedUserOptions = (users: RelatedUser[] = []) => {
  const uniqueUsers = new Map<string, string>();

  users.forEach((user) => {
    if (user?.id && !uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, getUserName(user));
    }
  });

  return Array.from(uniqueUsers, ([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const useRelatedUsers = (type: RELATED_USERS_TYPE) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery({
    queryKey: [RELATED_USERS_HASH, type],
    queryFn: () => ky.get(RELATED_USERS_URL, {
      searchParams: { role: type, limit: RELATED_USERS_LIMIT }
    }).json<RelatedUsersResponse>(),
    select: (response) => getSortedUserOptions(response?.relatedUsers),
    refetchOnWindowFocus: false,
  });

  return {
    userOptions: data || [],
    isLoading,
  };
};
