# ui-lists

Copyright (C) 2021 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

The Lists UI Module, or `ui-lists`, is a Stripes UI Module used to create and manage Lists which are queries across multiple modules (for example: find all items marked as missing or declared lost, or find all open loans assigned to inactive users).

## Prerequisites

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. The [testing-backend](https://app.vagrantup.com/folio/boxes/testing-backend) Vagrant box should work if your app does not yet have its own backend module.

Additionally, the `mod-lists` module needs to be running.

## Build and serve

Run the following from the ui-lists directory to serve your new app using a development server:
```
yarn start
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
yarn start --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than `http://localhost:9130` pass the `--okapi` and `--tenant` options.
```
yarn start --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Run the tests

Run the included UI tests with the following command:
```
yarn test
```

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UICAL](https://issues.folio.org/browse/UICAL)
at the [FOLIO issue tracker](https://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
