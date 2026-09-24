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
import {
  FILTER_PANE_VISIBILITY_KEY,
  USER_PERMS,
  CREATED_BY_PREFIX,
  UPDATED_BY_PREFIX,
  RELATED_USERS_TYPE
} from '../../utils/constants';
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
    createdByUserIds,
    updatedByUserIds,
    filterCount,
    filtersObject,
    activeFilters,
    isDefaultState
  } = useFilters();

  // searchValue is the live text bound to the search input; searchTerm is the applied
  // query actually sent to ListsTable, set only on submit (or cleared when the input is emptied).
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatedByOpen, setIsCreatedByOpen] = useState(false);
  const [isUpdatedByOpen, setIsUpdatedByOpen] = useState(false);

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
  const hasUserFilter = createdByUserIds.length > 0 || updatedByUserIds.length > 0;
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
    setIsCreatedByOpen(false);
    setIsUpdatedByOpen(false);
  };

  const onChangeUserFilter = (prefix: string) => (userIds: string[]) => (
    userIds.length
      ? setUserFilter(prefix, userIds)
      : clearUserFilter(prefix)
  );

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
            name="createdBy"
            label={t('filter-label.created-by')}
            type={RELATED_USERS_TYPE.CreatedBy}
            open={isCreatedByOpen}
            onToggle={() => setIsCreatedByOpen((isOpen) => !isOpen)}
            selectedUserIds={createdByUserIds}
            onChange={onChangeUserFilter(CREATED_BY_PREFIX)}
            onClear={() => clearUserFilter(CREATED_BY_PREFIX)}
          />
          <UserFilter
            id="updated-by-filter"
            name="updatedBy"
            label={t('filter-label.updated-by')}
            type={RELATED_USERS_TYPE.UpdatedBy}
            open={isUpdatedByOpen}
            onToggle={() => setIsUpdatedByOpen((isOpen) => !isOpen)}
            selectedUserIds={updatedByUserIds}
            onChange={onChangeUserFilter(UPDATED_BY_PREFIX)}
            onClear={() => clearUserFilter(UPDATED_BY_PREFIX)}
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
