// @ts-ignore
import { useOkapiKy, Pluggable } from '@folio/stripes/core';
import React, { FC, useState } from 'react';
import { t } from '../../services';
import { getVisibleColumnsKey } from '../../utils';

import { ConfigureQuery } from '../ConfigureQuery';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../interfaces';
import css from './EditListResultViewer.module.css';

type EditListResultViewerProps = {
    id: string,
    version: number,
    entityTypeId: string,
    fqlQuery: string,
    userFriendlyQuery: string,
    contentVersion: number,
    fields?: string[],
    status: string,
    listName: string,
    visibility: string,
    description: string
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
    fields
  }
) => {
  const ky = useOkapiKy();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const handleDefaultVisibleColumnsSet = (defaultColumns: string[]) => {
    const cachedColumns = localStorage.getItem(getVisibleColumnsKey(id));
    const finalVisibleColumns = cachedColumns ? JSON.parse(cachedColumns) : defaultColumns;

    setVisibleColumns(finalVisibleColumns);
  };

  const getAsyncContentData = ({ limit, offset }: any) => {
    return ky.get(`lists/${id}/contents?offset=${offset}&size=${limit}`).json();
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
      onSetDefaultVisibleColumns={handleDefaultVisibleColumnsSet}
      onSetDefaultColumns={() => {}}
      height={500}
      additionalControls={(
        <div className={css.queryBuilderButton}>
          <ConfigureQuery
            listId={id}
            version={version}
            isEditQuery
            initialValues={fqlQuery ? JSON.parse(fqlQuery) : undefined}
            selectedType={entityTypeId}
            recordColumns={fields}
            isQueryButtonDisabled={false}
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
