# Change history for ui-lists

## In progress

* Toast messages should appear for a longer time during exports [UILISTS-210]
* Increase the width of the record type dropdown. [UILISTS-212]
* Prompt for unsaved changes when we duplicate the list. [UILISTS-207]

[UILISTS-210]: https://folio-org.atlassian.net/browse/UILISTS-210
[UILISTS-212]: https://folio-org.atlassian.net/browse/UILISTS-212
[UILISTS-207]: https://folio-org.atlassian.net/browse/UILISTS-207

## [3.1.6](https://github.com/folio-org/ui-lists/tree/v3.1.6) (2025-01-23)

* Stream export file during download. [MODLISTS-186]

[MODLISTS-186]: https://folio-org.atlassian.net/browse/MODLISTS-186

## [3.1.5](https://github.com/folio-org/ui-lists/tree/v3.1.5) (2025-01-17)

* The filters reset after closing list on nth pages. [UILISTS-211]

[UILISTS-211]: https://folio-org.atlassian.net/browse/UILISTS-211

## [3.1.4](https://github.com/folio-org/ui-lists/tree/v3.1.4) (2025-01-09)

* Lists > Errors when query includes a deleted custom field [UILISTS-205]
* Prompt for unsaved changes when clicking on the Lists app home from the app context menu [UILISTS-177]
* Don't revert visibility setting when creating a new list. [UILISTS-203]

[UILISTS-177]: https://folio-org.atlassian.net/browse/UILISTS-177
[UILISTS-205]: https://folio-org.atlassian.net/browse/UILISTS-205
[UILISTS-203]: https://folio-org.atlassian.net/browse/UILISTS-203

## [3.1.3](https://github.com/folio-org/ui-lists/tree/v3.1.3) (2024-11-27)
* Stop polling after X attempts result in 500 errors [UILISTS-161]
* Update language used for export actions [UILISTS-201]

[UILISTS-161]: https://folio-org.atlassian.net/browse/UILISTS-161
[UILISTS-201]: https://folio-org.atlassian.net/browse/UILISTS-201

## [3.1.2](https://github.com/folio-org/ui-lists/tree/v3.1.2) (2024-11-12)
* Remove backslashes from user-friendly query string [UILISTS-196]
* Use tenant timezone for building queries (adds use of permission `configuration.entries.collection.get`) [UIPQB-126]
* [ECS] The visibility for cross tenant record types changes to "Shared" when the user makes any changes after selecting the entity type [UILISTS-198]
* Remove module declaration for `@folio/stripes-acq-components` in the `global.d.ts` file [UILISTS-199]

[UILISTS-196]: https://folio-org.atlassian.net/browse/UILISTS-196
[UILISTS-199]: https://folio-org.atlassian.net/browse/UILISTS-198
[UILISTS-199]: https://folio-org.atlassian.net/browse/UILISTS-199
[UIPQB-126]: https://folio-org.atlassian.net/browse/UIPQB-126

## [3.1.1](https://github.com/folio-org/ui-lists/tree/v3.1.1) (2024-11-05)
* Update `stripes-acq-components` to 6.0.0 [UILISTS-197]

[UILISTS-197]: https://folio-org.atlassian.net/browse/UILISTS-197

## [3.1.0](https://github.com/folio-org/ui-lists/tree/v3.1.0) (2024-11-01)
* Lists app - Modal: Shortcut Keys List [UILISTS-137]
* Results List: Update Record type filter display [UILISTS-145]
* Lists app: Implement App context menu [UILISTS-138]
* Move stripes-testing in dev dependencies [UILISTS-138]
* Support export of visible columns and export of all columns [UILISTS-157]
* Handle updated entity-types API response format [UILISTS-170]
* Lists app - Implement Shortcut Keys [UILISTS-158]
* Add resolution entry in to package.json to pin TS version [UILISTS-179]
* Add autofocus for edit and create mode [UILISTS-182]
* Change save/cancel buttons styles [UILISTS-183]
* Fix issue with absent blue bar [UILISTS-172]
* Add cross-tenant logic for list-table [UILISTS-185]
* Cross-tenant indicator for list detail page [UILISTS-173]
* Fix GitHub Actions workflow not running for tags [FOLIO-4086]
* Add Cross-tenant default state for edit/duplicate/create modes [UILISTS-175]
* Supply necessary a11y props to `<Layer>` [UILISTS-195]


[UILISTS-175]: https://folio-org.atlassian.net/browse/UILISTS-175
[UILISTS-173]: https://folio-org.atlassian.net/browse/UILISTS-173
[UILISTS-185]: https://folio-org.atlassian.net/browse/UILISTS-185
[UILISTS-182]: https://folio-org.atlassian.net/browse/UILISTS-182
[UILISTS-183]: https://folio-org.atlassian.net/browse/UILISTS-183
[UILISTS-172]: https://folio-org.atlassian.net/browse/UILISTS-172
[UILISTS-179]: https://folio-org.atlassian.net/browse/UILISTS-179
[UILISTS-170]: https://folio-org.atlassian.net/browse/UILISTS-170
[UILISTS-157]: https://folio-org.atlassian.net/browse/UILISTS-157
[UILISTS-138]: https://folio-org.atlassian.net/browse/UILISTS-138
[UILISTS-138]: https://folio-org.atlassian.net/browse/UILISTS-138
[UILISTS-137]: https://folio-org.atlassian.net/browse/UILISTS-137
[UILISTS-145]: https://folio-org.atlassian.net/browse/UILISTS-145
[UILISTS-158]: https://folio-org.atlassian.net/browse/UILISTS-158
[FOLIO-4086]: https://folio-org.atlassian.net/browse/FOLIO-4086

## [3.0.2](https://github.com/folio-org/ui-lists/tree/v3.0.2) (2024-08-07)
* Fix type issue with `<DropdownMenu>` [UILISTS-168]

[UILISTS-168]: https://folio-org.atlassian.net/browse/UILISTS-168

## [3.0.1](https://github.com/folio-org/ui-lists/tree/v3.0.1) (2024-04-16)
* Duplicated lists have all columns selected [UILISTS-118]
* Change the app display name from Lists (beta) to Lists [UILISTS-125]

[UILISTS-118]: https://folio-org.atlassian.net/browse/UILISTS-118
[UILISTS-125]: https://folio-org.atlassian.net/browse/UILISTS-125

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
