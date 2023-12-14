import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IfPermission } from '@folio/stripes/core';

import { ListPage, ListInformationPage, CreateListPage, EditListPage, CopyListPage } from './pages';
import { USER_PERMS } from './utils/constants';

interface IListsApp {
  match: {
    path: string
  };
}

export const queryClient = new QueryClient();


export const ListsApp: FC<IListsApp> = (props) => {
  const { match: { path } } = props;

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default ListsApp;
