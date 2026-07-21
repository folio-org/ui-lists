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
import { SingleSearchForm } from '@folio/stripes-acq-components';
import { IfPermission } from '@folio/stripes/core';
import { RecordTypesFilter } from './RecordTypesFilter';
import { Filters } from './Filters';
import { UserFilter } from './UserFilter';
import { ListsTable, ListAppIcon, HasCommandWrapper } from '../../components';
import {
  useKeyCommandsMessages,
  useListAppPermissions,
  useListsFetchedSinceTimestamp,
  useLocalStorageToggle
} from '../../hooks';
import { t, UI_LISTS_NAMESPACE } from '../../services';
import { CREATE_LIST_URL } from '../../constants';
import { FILTER_PANE_VISIBILITY_KEY, USER_PERMS, CREATED_BY_PREFIX, UPDATED_BY_PREFIX } from '../../utils/constants';
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
    setUserFilter,
    clearUserFilter,
    createdByFilter,
    updatedByFilter,
    filterCount,
    filtersObject,
    activeFilters,
    isDefaultState
  } = useFilters();

  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const hasSearchInput = !!searchValue.trim();
  const hasAppliedSearch = !!searchTerm;
  const hasUserFilter = !!createdByFilter.userId || !!updatedByFilter.userId;
  const isResetDisabled = isDefaultState && !hasSearchInput && !hasAppliedSearch && !hasUserFilter;

  const applySearch = () => {
    setSearchTerm(searchValue.trim());
  };

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);

    if (!value) {
      setSearchTerm('');
    }
  };

  const onResetAllHandler = () => {
    onResetAll();
    setSearchValue('');
    setSearchTerm('');
  };

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
          <SingleSearchForm
            ariaLabelId={`${UI_LISTS_NAMESPACE}.lists.searchInputLabel`}
            applySearch={applySearch}
            changeSearch={changeSearch}
            searchQuery={searchValue}
          />
          <div className={css.resetButtonWrap}>
            <Button
              // @ts-ignore:next-line
              buttonStyle="none"
              id="clickable-reset-all"
              disabled={isResetDisabled}
              onClick={onResetAllHandler}
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
          <UserFilter
            id="created-by-filter"
            label={t('filter-label.created-by')}
            filterGroupName={CREATED_BY_PREFIX}
            userName={createdByFilter.userName}
            onSelectUser={(userId, userName) => setUserFilter(CREATED_BY_PREFIX, userId, userName)}
            onClear={clearUserFilter}
          />
          <UserFilter
            id="updated-by-filter"
            label={t('filter-label.updated-by')}
            filterGroupName={UPDATED_BY_PREFIX}
            userName={updatedByFilter.userName}
            onSelectUser={(userId, userName) => setUserFilter(UPDATED_BY_PREFIX, userId, userName)}
            onClear={clearUserFilter}
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
            searchTerm={searchTerm}
            setTotalRecords={setTotalRecords}
          />
        </Pane>
      </Paneset>
    </HasCommandWrapper>
  );
};
