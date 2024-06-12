import React, { FC, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IfPermission, AppContextMenu } from '@folio/stripes/core';
import {
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
  checkScope,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { ListPage, ListInformationPage, CreateListPage, EditListPage, CopyListPage } from './pages';
import { USER_PERMS } from './utils/constants';
import {t} from "./services";

interface IListsApp {
  match: {
    path: string
  };
}

export const queryClient = new QueryClient();

export const ListsApp: FC<IListsApp> = (props) => {
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const shortcutModalToggle = (handleToggle: () => {}) => {
    handleToggle();
    setShowKeyboardShortcutsModal(true);
  };

  const shortcuts = [
    {
      name: 'search',
      handler: () => {
        alert('hi')
      }
    },
    {
      name: 'openShortcutModal',
      handler: setShowKeyboardShortcutsModal
    },
  ];

  const { match: { path } } = props;

  return (
    <>
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(handleToggle: () => {}) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="shortcuts"
                    onClick={() => { shortcutModalToggle(handleToggle); }}
                  >
                    {t('app-menu.keyboard-shortcuts')}
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
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
            {showKeyboardShortcutsModal && (
              <KeyboardShortcutsModal
                allCommands={defaultKeyboardShortcuts}
                onClose={() => { setShowKeyboardShortcutsModal(false); }}
                open
              />
            )}
          </QueryClientProvider>
        </HasCommand>
      </CommandList>
    </>
  );
};

export default ListsApp;
