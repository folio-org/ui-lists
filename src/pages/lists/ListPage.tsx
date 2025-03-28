import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { noop } from 'lodash';
import {
  Icon,
  Pane,
  PaneMenu,
  Paneset,
  Button,
  LoadingPane
} from '@folio/stripes/components';
import { CollapseFilterPaneButton, ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import { RecordTypesFilter } from './RecordTypesFilter';
import { Filters } from './Filters';
// @ts-ignore:next-line
import { ListsTable, ListAppIcon, HasCommandWrapper } from '../../components';
import {
  useKeyCommandsMessages,
  useListAppPermissions,
  useListsFetchedSinceTimestamp,
  useLocalStorageToggle
} from '../../hooks';
import { t } from '../../services';
import { CREATE_LIST_URL } from '../../constants';
import { FILTER_PANE_VISIBILITY_KEY, USER_PERMS } from '../../utils/constants';
import { useFilterConfig, useFilters } from './hooks';
import { AddCommand } from '../../keyboard-shortcuts';
import { getStatusButtonElem, handleKeyCommand } from '../../utils';

import css from './ListPage.module.css';

export const ListPage: React.FC = () => {
  const history = useHistory();
  const { canCreate } = useListAppPermissions();
  const { showCommandError } = useKeyCommandsMessages();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterPaneIsVisible, toggleFilterPane] = useLocalStorageToggle(FILTER_PANE_VISIBILITY_KEY, true);
  const { filterConfig, isLoadingConfigData, recordTypeConfig } = useFilterConfig();
  const {
    onChangeFilter,
    onChangRecordType,
    selectedRecordTypes,
    onResetAll,
    onClearGroup,
    filterCount,
    filtersObject,
    activeFilters,
    isDefaultState
  } = useFilters();

  useListsFetchedSinceTimestamp();

  const shortcuts = [
    AddCommand.create(handleKeyCommand(
      () => history.push('/lists/new'),
      canCreate,
      () => showCommandError(!canCreate)
    )),
    AddCommand.goToFilter(handleKeyCommand(() => {
      getStatusButtonElem()?.focus();
    }))
  ];


  return (
    <HasCommandWrapper
      commands={shortcuts}
    >
      <Paneset data-test-root-pane>
        {filterPaneIsVisible &&
        <Pane
          defaultWidth="20%"
          paneTitle={t('filterPane.title')}
          lastMenu={
            <PaneMenu>
              <CollapseFilterPaneButton onClick={toggleFilterPane} />
            </PaneMenu>
          }
        >
          <div className={css.resetButtonWrap}>
            <Button
              // @ts-ignore:next-line
              buttonStyle="none"
              id="clickable-reset-all"
              disabled={isDefaultState}
              onClick={onResetAll}
            >
              <Icon icon="times-circle-solid">
                <FormattedMessage id="stripes-smart-components.resetAll" />
              </Icon>
            </Button>
          </div>
          <Filters
            config={filterConfig}
            filters={filtersObject}
            onChangeFilter={onChangeFilter}
            onClearFilter={onClearGroup}
          />
          {
            isLoadingConfigData ? (<LoadingPane />) : (
              <RecordTypesFilter
                recordTypeConfig={recordTypeConfig}
                onChange={onChangRecordType}
                onClear={onClearGroup}
                selectedRecordTypes={selectedRecordTypes}
              />
            )
          }

        </Pane>
      }
        <Pane
          key={String(filterPaneIsVisible)}
          defaultWidth={filterPaneIsVisible ? '80%' : 'fill'}
          paneTitle={t('mainPane.title')}
          paneSub={t('mainPane.subTitle', { count: totalRecords })}
          appIcon={<ListAppIcon />}
          firstMenu={
          !filterPaneIsVisible ?
            (
              <PaneMenu>
                <ExpandFilterPaneButton
                  filterCount={filterCount}
                  onClick={toggleFilterPane}
                />
              </PaneMenu>
            ) : null
        }
          lastMenu={
            <IfPermission perm={USER_PERMS.CreateList}>
              <Link to={CREATE_LIST_URL}>
                <Button
                  bottomMargin0
                  buttonStyle="primary"
                  onClick={noop}
                >
                  {t('paneHeader.button.new')}
                </Button>
              </Link>
            </IfPermission>
        }
        >
          <ListsTable
            activeFilters={activeFilters}
            setTotalRecords={setTotalRecords}
          />
        </Pane>
      </Paneset>
    </HasCommandWrapper>
  );
};
