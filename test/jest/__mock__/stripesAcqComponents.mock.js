import React from 'react';

jest.mock('@folio/stripes-acq-components', () => ({
  PrevNextPagination: jest.fn(({ ...rest }) => <div {...rest} />),
  usePagination: () => ({ pagination: { limit: 100, offset: 0 }, changePage: jest.fn() }),
  useShowCallout: jest.fn(() => jest.fn()),
  SingleSearchForm: jest.fn(({
    searchQuery = '',
    changeSearch,
    applySearch,
    ariaLabelId,
  }) => (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        applySearch();
      }}
    >
      <input
        type="search"
        aria-label={ariaLabelId}
        value={searchQuery}
        onChange={changeSearch}
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="clear search"
          onClick={() => changeSearch({ target: { value: '' } })}
        >
          clear
        </button>
      )}
      <button type="submit" disabled={!searchQuery}>
        stripes-acq-components.search
      </button>
    </form>
  ))
}));
