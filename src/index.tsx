import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
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
          component={ListPage}
        />
        <Route
          path={`${path}/list/:id`}
          exact
          component={ListInformationPage}
        />
        <Route
          path={`${path}/list/:id/edit`}
          exact
          component={EditListPage}
        />
        <Route
          path={`${path}/new`}
          exact
          component={CreateListPage}
        />
      </Switch>
    </QueryClientProvider>
  );
};

export default ListsApp;
