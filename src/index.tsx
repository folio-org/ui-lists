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
  NavListSection
} from '@folio/stripes/components';
import {
  CopyListPage,
  CreateListPage,
  EditListPage,
  ListInformationPage,
  ListPage,
  MissingAllEntityTypePermissionsPage
} from './pages';
import { HasCommandWrapper } from './components';

import {
  useRecordTypes,
  useKeyCommandsMessages
} from './hooks';
import { t } from "./services";
import {
  getStatusButtonElem,
  USER_PERMS,
  handleKeyCommand,
  isEditPage,
  isCreatePage,
  isDetailsPage,
  isListsPage,
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
  const { actionUnavailableError } = useKeyCommandsMessages();
  const { recordTypes, isLoading } = useRecordTypes();

  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const currentPathname = history.location.pathname;


  const shortcutModalToggle = (handleToggle: () => {}) => {
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
  }

  const focusStatusDropdown = (handleToggle?: () => {}) => {
    focusStatus();

    handleToggle?.();
  };

  const showCommandErrorConditionally = (condition: boolean) => {
    if (condition) {
      actionUnavailableError();
    }
  }

  const shortcuts = [
    AddCommand.duplicate(handleKeyCommand(() => {
      showCommandErrorConditionally(!isDetailsPage(path, currentPathname))
    })),
    AddCommand.save(handleKeyCommand(() => {
      const saveUnavailable = !isEditPage(path, currentPathname) || !isCreatePage(path, currentPathname);
      showCommandErrorConditionally(saveUnavailable)
    })),
    AddCommand.create(handleKeyCommand(() => {
      showCommandErrorConditionally(!isListsPage(path, currentPathname))
    })),
    AddCommand.edit(handleKeyCommand(() => {
      showCommandErrorConditionally(!isDetailsPage(path, currentPathname))
    })),
    AddCommand.collapseSections(handleKeyCommand(() => {
      showCommandErrorConditionally(isListsPage(path, currentPathname))
    })),
    AddCommand.expandSections(handleKeyCommand(() => {
      showCommandErrorConditionally(isListsPage(path, currentPathname))
    })),
    AddCommand.goToFilter(handleKeyCommand(focusStatus)),
    AddCommand.openModal(handleKeyCommand(() => {
      setShowKeyboardShortcutsModal(true);
    }))
  ];

  if (!isLoading && recordTypes?.length === 0) {
    return <MissingAllEntityTypePermissionsPage />;
  }

  return (
    <CommandList commands={commandsGeneral}>
      <HasCommandWrapper
        commands={shortcuts}
      >
        <AppContextMenu>
          {(handleToggle: () => {}) => (
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
    </HasCommandWrapper>
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
