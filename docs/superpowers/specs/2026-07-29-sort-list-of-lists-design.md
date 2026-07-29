# Sort the list of lists by name, last updated date, and records count

## Problem

The Lists landing page shows up to 100 lists per page with no way to reorder them. Users
scanning a large set cannot bring the most recently touched or largest lists to the top.

Three columns become sortable, each in both directions:

- List name (`name`)
- Last updated (`updatedDate`)
- Records (`recordsCount`)

The remaining columns — record type, status, source, visibility — stay non-interactive.

## Scope

UI only. `mod-lists-backend` already implements sorting: `GET /lists` accepts `sortBy`
(`name` | `updatedDate` | `recordsCount`) and `sortOrder` (`asc` | `desc`), and applies them
as a DB-level `ORDER BY` before `LIMIT`/`OFFSET` (`ListController.getSort`). `recordsCount`
maps to `successRefresh.recordsCount`, with nulls first on ascending and nulls last on
descending. The backend's fallback when no params are sent is `name` ascending.

No new translation strings: the column headers already exist, and `MultiColumnList` supplies
the carets and `aria-sort` attributes.

## Decisions

**Default sort is `name` ascending.** It matches the backend fallback, so the initial page
load is unchanged from today. The UI sends the params explicitly rather than relying on the
fallback, so the caret shown always reflects what was actually requested.

**Sort state lives in URL query params only** — `?sorting=name&sortingDirection=ascending`,
via `useLocationSorting` from `@folio/stripes-acq-components`. This is the same helper
`ui-bulk-edit`'s `BulkEditLogs.js` uses, and filters in this app already live in the URL. It
gives shareable links and back-button support for free. Sort is not mirrored to
sessionStorage; returning to `/lists` without a query string falls back to the default.

**Sorting is owned by `ListsTable`, not `ListPage`.** Sorting has no representation in the
Search & filter pane, and `ListsTable` already owns pagination and the `useLists` call.
`ListPage` needs no changes.

**Column keys need no mapping.** `COLUMNS_NAME` values are already identical to the backend's
`sortBy` enum values, so only the direction needs translating: `ascending`/`descending` (the
vocabulary of MCL and `stripes-acq-components`) to `asc`/`desc` (the API's).

## Architecture

```
URL ?sorting=name&sortingDirection=ascending
      │
      ▼
useListsSorting ──┬─► MCL: sortOrder / sortDirection / onHeaderClick / showSortIndicator
                  │
                  └─► sortQuery ──┬─► useLists ─────────► GET /lists?…&sortBy&sortOrder
                                  └─► useListsIdsToTrack ► GET /lists?ids=…&sortBy&sortOrder
```

### `src/hooks/useListsSorting/` (new)

A thin wrapper over `useLocationSorting`. It owns the three things worth testing in isolation:
the sortable-field list, the default sorting, and the direction-to-API mapping.

Accepts a `resetData` callback, invoked by `useSorting` on every sort change. Returns:

| Field | Example | Consumer |
| --- | --- | --- |
| `sortField` | `'name'` | MCL `sortOrder` |
| `sortDirection` | `'ascending'` | MCL `sortDirection` |
| `changeSorting` | function | MCL `onHeaderClick` |
| `sortQuery` | `{ sortBy: 'name', sortOrder: 'asc' }` | `useLists`, `useListsIdsToTrack` |

`resetData` is wrapped in `useCallback` and the hook's dependency array is limited to
`[location.search]`, so the URL-sync effect does not re-run on every render.

Direction toggling comes from the existing `useSorting` behaviour and already matches the
acceptance criteria: clicking a new column sorts ascending, clicking the same column again
flips to descending.

### `src/components/ListsTable/ListsTable.tsx`

- Calls `useListsSorting`, passing `resetData = () => { gotToFirstPage(); setRecordIds([]); }`.
  Without the page reset, a sort change would leave the user at, say, offset 300 of a freshly
  reordered set.
- Passes `sortQuery` into both `useLists` and `useListsIdsToTrack`.
- Adds MCL props: `sortOrder`, `sortDirection`, `onHeaderClick`, `showSortIndicator`, and
  `nonInteractiveHeaders={['entityTypeName', 'isActive', 'createdByUsername', 'isPrivate']}`.
- Replaces the `isLoading` early return with `loading={isLoading}` on MCL, so the header row
  and carets stay mounted while rows are replaced instead of the whole table being swapped for
  a spinner on every fetch.

### `src/hooks/useListsIdsToTrack.ts`

Accepts the sort params and includes them in its request URL.

This is the non-obvious part of the change. The hook polls `GET /lists?ids=…` every few
seconds, and `ListsTable` swaps its content in over `useLists`' content. Without sort params
the poll returns backend-default `name` ascending, so rows would silently re-order a few
seconds after any sort. Because the poll re-requests the same id set, sorting it identically
reproduces the same order.

`useListsFetchedSinceTimestamp` needs no change — it only detects newly created lists to raise
a callout, and never feeds the table.

### `src/utils/helpers.ts` and `src/interfaces/lists.ts`

`ListsRequest` gains optional `sortBy` and `sortOrder` fields; `buildListsUrl` appends each
when present.

## Behaviour against the acceptance criteria

| Scenario | How it is satisfied |
| --- | --- |
| Sortable column shows an indicator | `showSortIndicator` on MCL; `nonInteractiveHeaders` keeps the other four headers inert |
| Selected field and direction are indicated | MCL renders an up caret for `ascending`, a down caret for `descending`, driven by `sortField`/`sortDirection` |
| First click ascending, second descending | Existing `useSorting` toggle semantics |
| More than 100 results sort in full | Backend `ORDER BY` precedes `LIMIT`/`OFFSET`; nothing is sorted client-side |
| Filter or search added, sort retained | Sort occupies its own URL params; `useFilters.setValues` preserves unrelated params, and `useLocationSorting` preserves the `filters` param |
| Reset all does not reset sort | `resetFilters` only rewrites the `filters` param. Needs an explicit regression test — this is easy to break later |
| Sort change returns to the first page | `resetData` calls `gotToFirstPage()` and clears tracked ids |

## Testing

Tests follow the pattern already established in `ListsTable.test.tsx`: read the mocked MCL's
last props via `(MultiColumnList as jest.Mock).mock.calls.at(-1)[0]`, and capture request URLs
via `server.pretender.handledRequest`.

**`useListsSorting`**

- Defaults to `name` / `ascending` with no URL params.
- Reads field and direction from existing URL params.
- Clicking a new field yields ascending; clicking the same field again yields descending.
- A non-sortable field is ignored.
- `sortQuery` maps `ascending` to `asc` and `descending` to `desc`.
- `resetData` is invoked on a sort change.

**`buildListsUrl`**

- Appends `sortBy` and `sortOrder` when supplied.
- Omits both when absent.

**`ListsTable`**

- The default request carries `sortBy=name&sortOrder=asc`.
- A header click pushes the sort to the URL and re-requests with `sortOrder=desc`.
- The tracked-ids poll request carries the same sort params.
- Sort params survive a change of active filters.
- MCL receives `showSortIndicator` and the expected `nonInteractiveHeaders`.
- A sort change resets pagination offset to 0.
- MCL receives `loading: true` then `loading: false` — this replaces the two existing
  `describe('Loading')` cases, which assert on the `<Loading>` mock's text and will no longer
  apply once the early return is gone.

The existing axe test covers the accessibility of the newly interactive headers.

## Out of scope

- Backend changes.
- Sorting any column other than the three named above.
- Persisting sort across sessions.
- Sorting the record-set table inside an individual list.
