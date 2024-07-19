import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IfPermission, coreEvents } from '@folio/stripes/core';

import {
  CopyListPage,
  CreateListPage,
  EditListPage,
  ListInformationPage,
  ListPage,
  MissingAllEntityTypePermissionsPage,
} from './pages';
import { useRecordTypes } from './hooks';
import { USER_PERMS } from './utils/constants';

interface ListsAppProps {
  match: {
    path: string
  };
}

type IListsApp = React.FunctionComponent<ListsAppProps> & {
  eventHandler: (event: string) => void
}

export const ListsApp:IListsApp = (props) => {
  const { match: { path } } = props;

  const { recordTypes, isLoading } = useRecordTypes();

  if (!isLoading && recordTypes?.length === 0) {
    return <MissingAllEntityTypePermissionsPage />;
  }

  return (
    <Switch>
      <Route
        path={path}
        exact
        render={() => (
          <IfPermission perm={USER_PERMS.ReadList}>
            <ListPage />
          </IfPermission>
        )}
      />
      <Route
        path={`${path}/list/:id`}
        exact
        render={() => (
          <IfPermission perm={USER_PERMS.ReadList}>
            <ListInformationPage />
          </IfPermission>
        )}
      />
      <Route
        path={`${path}/list/:id/edit`}
        exact
        render={() => (
          <IfPermission perm={USER_PERMS.UpdateList}>
            <EditListPage />
          </IfPermission>
        )}
      />
      <Route
        path={`${path}/list/:id/copy`}
        exact
        render={() => (
          <IfPermission perm={USER_PERMS.UpdateList}>
            <CopyListPage />
          </IfPermission>
        )}
      />
      <Route
        path={`${path}/new`}
        exact
        render={() => (
          <IfPermission perm={USER_PERMS.CreateList}>
            <CreateListPage />
          </IfPermission>
        )}
      />
    </Switch>
  );
};

ListsApp.eventHandler = (event: any) => {
  if (event === coreEvents.LOGIN) {
    sessionStorage.clear()
  }
};

export default ListsApp;
