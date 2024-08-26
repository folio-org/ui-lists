// @ts-ignore
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import React, { FC } from 'react';
import { useVisibleColumns } from '../../hooks';
import { QueryBuilderColumnMetadata, STATUS_VALUES, VISIBILITY_VALUES } from '../../interfaces';
import { t } from '../../services';
import { ConfigureQuery } from '../ConfigureQuery';

import css from './EditListResultViewer.module.css';

interface EditListResultViewerProps {
  id: string,
  version?: number,
  entityTypeId?: string,
  fqlQuery: string,
  userFriendlyQuery: string,
  contentVersion: number,
  fields?: string[],
  status: string,
  listName: string,
  visibility: string,
  description: string,
  isDuplicating?: boolean,
  isQueryButtonDisabled?: boolean,
  setColumns?: (columns: QueryBuilderColumnMetadata[]) => void;
}

export const EditListResultViewer:FC<EditListResultViewerProps> = (
  {
    id,
    version,
    entityTypeId,
    fqlQuery,
    userFriendlyQuery = '',
    contentVersion,
    status,
    listName,
    visibility,
    description,
    fields,
    setColumns,
    isDuplicating = false,
    isQueryButtonDisabled = false
  }
) => {
  const ky = useOkapiKy();

  const {
    visibleColumns,
  } = useVisibleColumns(id);

  const getAsyncContentData = ({ limit, offset }: any) => {
    return ky.get(`lists/${id}/contents?offset=${offset}&size=${limit}&fields=${visibleColumns?.join(',')}`).json();
  };

  const getAsyncEntityType = () => {
    return ky.get(`entity-types/${entityTypeId}`).json();
  };

  return (
    <Pluggable
      type="query-builder"
      componentType="viewer"
      accordionHeadline={
        t('accordion.title.query',
          { query: userFriendlyQuery })}
      headline={({ totalRecords }: any) => (
        t('mainPane.subTitle',
          { count: totalRecords }))}
      refreshTrigger={contentVersion}
      contentDataSource={getAsyncContentData}
      entityTypeDataSource={getAsyncEntityType}
      visibleColumns={visibleColumns}
      onSetDefaultColumns={setColumns}
      contentQueryKeys={visibleColumns}
      height={500}
      additionalControls={(
        <div className={css.queryBuilderButton}>
          <ConfigureQuery
            listId={isDuplicating ? undefined : id}
            version={isDuplicating ? undefined : version}
            isEditQuery={!isDuplicating}
            initialValues={fqlQuery ? JSON.parse(fqlQuery) : undefined}
            selectedType={entityTypeId}
            recordColumns={fields}
            isQueryButtonDisabled={isQueryButtonDisabled}
            listName={listName}
            status={status === STATUS_VALUES.ACTIVE ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE}
            visibility={visibility === VISIBILITY_VALUES.SHARED ? VISIBILITY_VALUES.SHARED : VISIBILITY_VALUES.PRIVATE}
            description={description}
          />
        </div>
      )}
    >
      {t('loading-fallback')}
    </Pluggable>
  );
};
