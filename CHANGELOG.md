# Change history for ui-lists

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
