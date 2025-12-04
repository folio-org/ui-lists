import React, { useState } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';
import {
  AppContextMenu,
  coreEvents,
  IfPermission
} from '@folio/stripes/core';
import {
  CommandList,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
  HasCommand,
  checkScope
} from '@folio/stripes/components';
import {
  CatastrophicErrorPage,
  CopyListPage,
  CreateListPage,
  EditListPage,
  ListInformationPage,
  ListPage,
} from './pages';
import { useRecordTypes } from './hooks';
import { t } from './services';
import {
  getStatusButtonElem,
  USER_PERMS,
  handleKeyCommand
} from './utils';

import { commandsGeneral, AddCommand } from './keyboard-shortcuts';

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

  const history = useHistory();
  const { recordTypes, isLoading, error } = useRecordTypes();

  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const shortcutModalToggle = (handleToggle: () => void) => {
    handleToggle();
    setShowKeyboardShortcutsModal(true);
  };

  const focusStatus = () => {
    const el = getStatusButtonElem();

    if (el) {
      el.focus();
    } else {
      history.push('/lists');
    }
  };

  const focusStatusDropdown = (handleToggle?: () => void) => {
    focusStatus();

    handleToggle?.();
  };

  const shortcuts = [
    AddCommand.goToFilter(handleKeyCommand(focusStatus)),
    AddCommand.openModal(handleKeyCommand(() => {
      setShowKeyboardShortcutsModal(true);
    }))
  ];

  if (!isLoading && recordTypes?.length === 0) {
    return <CatastrophicErrorPage error={error} />;
  }

  return (
    <CommandList commands={commandsGeneral}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <AppContextMenu>
          {(handleToggle: () => void) => (
            <NavList>
              <NavListSection>
                <NavListItem
                  data-testid="list-app-home"
                  onClick={() => { focusStatusDropdown(handleToggle); }}
                >
                  {t('app-menu.list-app-home')}
                </NavListItem>
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
            allCommands={commandsGeneral}
            onClose={() => { setShowKeyboardShortcutsModal(false); }}
            open
          />
        )}
      </HasCommand>
    </CommandList>
  );
};

ListsApp.eventHandler = (event: any) => {
  if (event === coreEvents.LOGIN) {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('@folio/lists')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export default ListsApp;
