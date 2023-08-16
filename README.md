# ui-lists

Copyright (C) 2021 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

Congratulations on creating a new Stripes UI app module!  Follow the instructions below to run ui-lists and start your development.

TODO: Modify this README to replace these sections about getting started.

## Prerequisites

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. The [testing-backend](https://app.vagrantup.com/folio/boxes/testing-backend) Vagrant box should work if your app does not yet have its own backend module.

## Run your new app

Run the following from the ui-lists directory to serve your new app using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than `http://localhost:9130` pass the `--okapi` and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Run the tests

Run the included UI tests with the following command:
```
stripes test karma
```

## What to do next?

Now that your new app is running, search the code for "`new-app`" to find comments and subbed placeholders that may need your attention.

Please remove or customize the sample strings in `en.json` (lines 3-10) before merging this file to master; the translators do not need to be providing translations for these sample strings.

Read the [Stripes Module Developer's Guide](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md).

When your new UI app is ready and being built by CI, then adjust its Jenkinsfile to remove the `npmDeploy = 'no'` parameter (which is then superfluous).

TODO: Modify this README to replace these sections about getting started, link to your issue tracker, etc.

