import React, { useState } from 'react';

import { Route, Switch, useHistory, matchPath } from 'react-router-dom';
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

import {useMessages, useRecordTypes} from './hooks';
import { t } from "./services";
import {
  getStatusButtonElem,
  USER_PERMS,
  handleKeyEvent
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
  const { showErrorMessage } = useMessages();

  const history = useHistory();
  const currentPathname = history.location.pathname;

  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

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

  const checkPageUrl = (target: string, current: string, ) => {
    const match = matchPath(current, {
      path: target,
      exact: true,
      strict: false
    })

    return !!match
  }


  const isEditPage = (pathname: string) => {
    return checkPageUrl(`${path}/list/:id/edit`, pathname)
  }

  const isCreatePage = (pathname: string) => {
    return checkPageUrl(`${path}/list/new`, pathname)
  }

  const isDetailsPage = (pathname: string) => {
    return checkPageUrl(`${path}/list/:id`, pathname)
  }

  const isListsPage = (pathname: string) => {
    return checkPageUrl(`${path}`, pathname)
  }


  const shortcuts = [
    AddCommand.duplicate(handleKeyEvent(() => {
      if(!isDetailsPage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.save(handleKeyEvent(() => {
      if(!isEditPage(currentPathname) || !isCreatePage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.create(handleKeyEvent(() => {
      if(!isListsPage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.edit(handleKeyEvent(() => {
      if(!isDetailsPage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.collapseSections(handleKeyEvent(() => {
      if(isListsPage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.expandSections(handleKeyEvent(() => {
      if(isListsPage(currentPathname)) {
        showErrorMessage({ message: t('commands-error.unavailable') })
      }
    })),
    AddCommand.goToFilter(handleKeyEvent(focusStatus)),
    AddCommand.openModal(handleKeyEvent(() => {
      setShowKeyboardShortcutsModal(true);
    }))
  ];

  const { recordTypes, isLoading } = useRecordTypes();

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
