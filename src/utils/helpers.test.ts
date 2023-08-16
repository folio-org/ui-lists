/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { getListsFilterUrlParams } from './helpers';

describe('Get Lists Filters', () => {
  it('should return empty string when no filters are applied', async () => {
    const result = getListsFilterUrlParams([]);

    expect(result.toString()).toEqual('');
  });

  it('should set active=true when Active checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['status.Active']);

    expect(result.toString()).toEqual('active=true');
  });

  it('should set active=false when Inactive checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['status.Inactive']);

    expect(result.toString()).toEqual('active=false');
  });

  it('should omit active when both Active and Inactive checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['status.Active', 'status.Inactive']);

    expect(result.toString()).toEqual('');
  });

  it('should set private=true when Private checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['visibility.Private']);

    expect(result.toString()).toEqual('private=true');
  });

  it('should set private=false when Shared checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['visibility.Shared']);

    expect(result.toString()).toEqual('private=false');
  });

  it('should omit visibility when both Private and Shared checkbox is checked', async () => {
    const result = getListsFilterUrlParams(['visibility.Private', 'visibility.Shared']);

    expect(result.toString()).toEqual('');
  });

  it('should include entity type GUID if checked', async () => {
    const result = getListsFilterUrlParams(['record_types.1234']);

    expect(result.toString()).toEqual('entityTypeIds=1234');
  });

  it('should include multiple entity type GUIDs if checked', async () => {
    const result = getListsFilterUrlParams(['record_types.1234', 'record_types.5678']);

    expect(result.toString()).toEqual('entityTypeIds=1234%2C5678');
  });

  it('should create a complex URL string if multipled filters are checked', async () => {
    const result = getListsFilterUrlParams(['status.Active', 'visibility.Private', 'record_types.1234', 'record_types.5678']);

    expect(result.toString()).toEqual('active=true&private=true&entityTypeIds=1234%2C5678');
  });
});
