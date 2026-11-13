export const LISTS_DEFAULT_PAGE_AMOUNT = 100;

export const HOME_PAGE_URL = '/lists';
export const CREATE_LIST_URL = `${HOME_PAGE_URL}/new`;

// Router location state for the list information page when it is opened right after the user saved a query.
// The list's previous record count and rows are obsolete at that point, so the page must not present them.
export const QUERY_SAVED_LOCATION_STATE = { querySaved: true };
