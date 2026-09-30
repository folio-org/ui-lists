import { useHistory } from 'react-router-dom';

export const SEARCH_URL_KEY = 'search';

export const useSearch = () => {
  const history = useHistory();
  const { location } = history;
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get(SEARCH_URL_KEY) ?? '';

  const setSearchTerm = (term: string) => {
    const currentLocation = history.location;
    const nextParams = new URLSearchParams(currentLocation.search);

    if (term) {
      nextParams.set(SEARCH_URL_KEY, term);
    } else {
      nextParams.delete(SEARCH_URL_KEY);
    }

    history.push(`${currentLocation.pathname}?${nextParams.toString()}`);
  };

  return { searchTerm, setSearchTerm };
};
