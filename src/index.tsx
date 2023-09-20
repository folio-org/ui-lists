import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IfPermission } from '@folio/stripes/core';

import { ListPage, ListInformationPage, CreateListPage, EditListPage } from './pages';

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
            <IfPermission perm="lists.collection.get">
              <ListPage />
            </IfPermission>
          )}
        />
        <Route
          path={`${path}/list/:id`}
          exact
          render={() => (
            <IfPermission perm="lists.item.get">
              <ListInformationPage />
            </IfPermission>
          )}
        />
        <Route
          path={`${path}/list/:id/edit`}
          exact
          render={() => (
            <IfPermission perm="lists.item.update">
              <EditListPage />
            </IfPermission>
          )}
        />
        <Route
          path={`${path}/new`}
          exact
          render={() => (
            <IfPermission perm="lists.collection.post">
              <CreateListPage />
            </IfPermission>
          )}
        />
      </Switch>
    </QueryClientProvider>
  );
};

export default ListsApp;
