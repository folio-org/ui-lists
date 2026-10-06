import { useQueryClient } from 'react-query';

// Every lists-collection query (regardless of filters/search/sort/page) is keyed
// ['lists', request] (src/hooks/useLists.ts), so this one call invalidates all of them.
export const useInvalidateLists = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries(['lists']);
};
