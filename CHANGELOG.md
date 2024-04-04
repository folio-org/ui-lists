# Change history for ui-lists

## [3.0.0](https://github.com/folio-org/ui-lists/tree/v3.0.0) (2024-03-22)
* Use background polling to pick up new list updates. Refs [UILISTS-9]
* Add tooltips to the New List page. Refs [UILISTS-2]
* Fix pagination bug
* Update translations. Refs [UILISTS-9]
* Add tooltips for the shared and private settings. Refs [UILISTS-2]
* Add default filters for the list landing page. Refs [UILISTS-10]
* Add enabler for IDs tracking. Refs [UILISTS-67]
* Add support for duplicating lists. Refs [UILISTS-68]
* Remove explicit typescript version. Refs [UILISTS-85]
* Remove dependence on calendar typings. Refs [UILISTS-49]
* Minor cleanup. Refs [UILISTS-95]
* Fix incorrect types for CheckboxFilter. Refs [UILISTS-92]
* Add redirect from empty page. Refs [UILISTS-62]
* Add missing dependency on the query builder plugin. Refs [UILISTS-77]
* Add column width configuration. Refs [UILISTS-105]
* Add entity type to list details and edit pages. Refs [UILISTS-98]
* New lists display with columns selected when building a query. Refs [UILISTS-77]
* Update HTML page title on List detail page. Refs [UILISTS-80]
* Send list of columns when exporting a list. Refs [UILISTS-110]
* Bump up stripes-acq-components from 5.0.0 to 5.1.0
* Improve exception handling. Refs [UILISTS-121]
* Send list of selected columns as parameter to GET /lists/{listId}/contents API. Refs [UILISTS-109]
* Lists - Add accessibility testing to automated tests. Refs [UILISTS-99]

[UILISTS-9]: https://folio-org.atlassian.net/browse/UILISTS-9
[UILISTS-2]: https://folio-org.atlassian.net/browse/UILISTS-2
[UILISTS-9]: https://folio-org.atlassian.net/browse/UILISTS-9
[UILISTS-2]: https://folio-org.atlassian.net/browse/UILISTS-2
[UILISTS-10]: https://folio-org.atlassian.net/browse/UILISTS-10
[UILISTS-67]: https://folio-org.atlassian.net/browse/UILISTS-67
[UILISTS-68]: https://folio-org.atlassian.net/browse/UILISTS-68
[UILISTS-85]: https://folio-org.atlassian.net/browse/UILISTS-85
[UILISTS-49]: https://folio-org.atlassian.net/browse/UILISTS-49
[UILISTS-95]: https://folio-org.atlassian.net/browse/UILISTS-95
[UILISTS-92]: https://folio-org.atlassian.net/browse/UILISTS-92
[UILISTS-62]: https://folio-org.atlassian.net/browse/UILISTS-62
[UILISTS-77]: https://folio-org.atlassian.net/browse/UILISTS-77
[UILISTS-105]: https://folio-org.atlassian.net/browse/UILISTS-105
[UILISTS-98]: https://folio-org.atlassian.net/browse/UILISTS-98
[UILISTS-77]: https://folio-org.atlassian.net/browse/UILISTS-77
[UILISTS-80]: https://folio-org.atlassian.net/browse/UILISTS-80
[UILISTS-110]: https://folio-org.atlassian.net/browse/UILISTS-110
[UILISTS-121]: https://folio-org.atlassian.net/browse/UILISTS-121
[UILISTS-109]: https://folio-org.atlassian.net/browse/UILISTS-109
[UILISTS-99]: https://folio-org.atlassian.net/browse/UILISTS-99

## 2.0.x

# [2.0.6](https://github.com/folio-org/ui-lists/tree/v2.0.5) (2023-12-07)
* Revert all changes from 2.0.5 except for the "(Beta)" added to the app title

# [2.0.5](https://github.com/folio-org/ui-lists/tree/v2.0.5) (2023-12-01)

* Use background polling to pick up new list updates. Refs UILISTS-9
* Add tooltips to the New List page. Refs UILISTS-2
* Fix pagination bug
* Update translations. Refs UILISTS-9
* Add tooltips for the shared and private settings. Refs UILISTS-2
* Add default filters for the list landing page. Refs UILISTS-10
* Add "(Beta)" to the app title

# [2.0.4](https://github.com/folio-org/ui-lists/tree/v2.0.4) (2023-11-09)

* Add translation for invalid request. Refs UILISTS-14.
* Restrict user access to the list which is private or removed. Refs UILISTS-58.
* Sort record types when creating lists. Refs UILISTS-61.
* Fix display unknown user for list detail page. Refs UILISTS-63.

# [2.0.3](https://github.com/folio-org/ui-lists/tree/v2.0.3) (2023-11-07)

* Fix source of lastUpdatedDate and lastUpdatedBy fields. Refs UILISTS-54.
* Update error message and polling delay. Refs UILISTS-59.
* Fix list icon whichs gets cut off when the list name is long. Refs UILISTS-4.

# [2.0.2](https://github.com/folio-org/ui-lists/tree/v2.0.2) (2023-10-26)

* Add missing cancel export permission. Refs UILISTS-52.
* Added new translation keys for errors. Refs UILISTS-40, UILISTS-53, UILISTS-51, UILISTS-56.

# [2.0.1](https://github.com/folio-org/ui-lists/tree/v2.0.1) (2023-10-24)

* Fix select in list create.
* Permissions Fix. Refs UILISTS-39.
* Fix clear group icon to disappear when no items selected. Refs UILISTS-25.

# [2.0.0](https://github.com/folio-org/ui-lists/tree/v2.0.0) (2023-10-13)

* Initial release with core functionality.
* Update Stripes, React, React-Intl dependencies for Poppy release.
* Edit Query button width incorrect. Refs UILISTS-41.
* Implement granular permissions. Refs UILISTS-39.

## 1.0.0

* New app created with stripes-cli
