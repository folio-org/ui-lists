import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import moment from 'moment';
import {
  Icon,
  Pane,
  PaneMenu,
  Paneset,
  Button,
  // @ts-ignore:next-line
  FilterGroups,
  LoadingPane
} from '@folio/stripes/components';
// @ts-ignore:next-line
import { CollapseFilterPaneButton, ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';

import { ListsTable, ListAppIcon } from '../../components';
import { useListsLastFetchedTimestamp, useLocalStorageToggle } from '../../hooks';
import { t } from '../../services';
import { CREATE_LIST_URL } from '../../constants';
import { FILTER_PANE_VISIBILITY_KEY, USER_PERMS } from '../../utils/constants';
import { useFilterConfig, useFilters } from './hooks';
import { useMessages } from '../../hooks/useMessages';

import css from './ListPage.module.css';

let listsLastFetchedTimestamp = moment.utc().format();

export const ListPage: React.FC = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterPaneIsVisible, toggleFilterPane] = useLocalStorageToggle(FILTER_PANE_VISIBILITY_KEY, true);
  const { filterConfig, isLoadingConfigData } = useFilterConfig();
  const {
    onChangeFilter,
    onResetAll,
    onClearGroup,
    filterCount,
    activeFilters,
    appliedFilters
  } = useFilters(filterConfig);
  const { showSuccessMessage } = useMessages();

  const updatedListsData = useListsLastFetchedTimestamp({ listsLastFetchedTimestamp });
  const updatedListsContent = updatedListsData?.listsData?.content;

  if (updatedListsContent?.length) {
    listsLastFetchedTimestamp = moment.utc().format();

    if (updatedListsContent.length > 1) {
      showSuccessMessage({ message: t('callout.list.multiple-created') });
    } else {
      const listName = updatedListsContent[0].name;

      showSuccessMessage({ message: t('callout.list.created', { listName }) });
    }
  }

  if (isLoadingConfigData) return <LoadingPane />;

  return (
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
              buttonStyle="default"
              disabled={!filterCount}
              id="clickable-reset-all"
              onClick={onResetAll}
            >
              <Icon icon="times-circle-solid">
                <FormattedMessage id="stripes-smart-components.resetAll" />
              </Icon>
            </Button>
          </div>
          <FilterGroups
            config={filterConfig}
            filters={appliedFilters}
            onChangeFilter={onChangeFilter}
            onClearFilter={onClearGroup}
          />
        </Pane>
      }
      <Pane
        defaultWidth="fill"
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
  );
};
