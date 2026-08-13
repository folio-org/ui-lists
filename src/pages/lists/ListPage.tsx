import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  Icon,
  Pane,
  PaneMenu,
  Paneset,
  Button,
  LoadingPane
} from '@folio/stripes/components';
import { CollapseFilterPaneButton, ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import { PluggableUserFilter, SingleSearchForm } from '@folio/stripes-acq-components';
import { IfPermission } from '@folio/stripes/core';
import { RecordTypesFilter } from './RecordTypesFilter';
import { Filters } from './Filters';
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

  // searchValue is the live text bound to the search input; searchTerm is the applied
  // query actually sent to ListsTable, set only on submit (or cleared when the input is emptied).
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
          <PluggableUserFilter
            id="created-by-filter"
            activeFilters={createdByFilter.userId ? [createdByFilter.userId] : []}
            closedByDefault={false}
            labelId={`${UI_LISTS_NAMESPACE}.filter-label.created-by`}
            name="createdBy"
            onChange={({ values }: { values: string[] }) => (
              values.length
                ? setUserFilter(CREATED_BY_PREFIX, values[0])
                : clearUserFilter(CREATED_BY_PREFIX)
            )}
          />
          <PluggableUserFilter
            id="updated-by-filter"
            activeFilters={updatedByFilter.userId ? [updatedByFilter.userId] : []}
            closedByDefault={false}
            labelId={`${UI_LISTS_NAMESPACE}.filter-label.updated-by`}
            name="updatedBy"
            onChange={({ values }: { values: string[] }) => (
              values.length
                ? setUserFilter(UPDATED_BY_PREFIX, values[0])
                : clearUserFilter(UPDATED_BY_PREFIX)
            )}
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
              <Button
                to={CREATE_LIST_URL}
                bottomMargin0
                buttonStyle="primary"
              >
                {t('paneHeader.button.new')}
              </Button>
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
