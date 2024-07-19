import React, { FC, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
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
import {
  CopyListPage,
  CreateListPage,
  EditListPage,
  ListInformationPage,
  ListPage,
  MissingAllEntityTypePermissionsPage,
} from './pages';
import { useRecordTypes } from './hooks';
import { t } from "./services";
import { USER_PERMS } from './utils/constants';

interface IListsApp {
  match: {
    path: string
  };
}

export const ListsApp: FC<IListsApp> = (props) => {
  const { match: { path } } = props;
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const shortcutModalToggle = (handleToggle: () => {}) => {
    handleToggle();
    setShowKeyboardShortcutsModal(true);
  };

  const shortcuts = [
    {
      name: 'openShortcutModal',
      handler: setShowKeyboardShortcutsModal
    }
  ];

  const { recordTypes, isLoading } = useRecordTypes();

  if (!isLoading && recordTypes?.length === 0) {
    return <MissingAllEntityTypePermissionsPage />;
  }

  return (
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
                  data-testid="shortcuts"
                  onClick={() => { shortcutModalToggle(handleToggle); }}
                >
                  {t('app-menu.keyboard-shortcuts')}
                </NavListItem>
              </NavListSection>
            </NavList>
          )}
        </AppContextMenu>
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
    </HasCommand>
</CommandList>
  );
};

export default ListsApp;
