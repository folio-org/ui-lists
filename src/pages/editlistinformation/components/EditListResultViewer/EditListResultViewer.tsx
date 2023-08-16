// @ts-ignore
import { useOkapiKy, Pluggable } from '@folio/stripes/core';
import React, { FC, useState } from 'react';
import { t } from '../../../../services';
import { getVisibleColumnsKey } from '../../../../utils/helpers';

import { QueryBuilder } from '../../../createlist/components/QueryBuilder';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../types';

type EditListResultViewerProps = {
    id: string,
    version: number,
    entityTypeId: string,
    fqlQuery: string,
    userFriendlyQuery: string,
    contentVersion: number,
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
    description
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
      additionalControls={
        <QueryBuilder
          listId={id}
          version={version}
          isEditQuery
          initialValues={fqlQuery ? JSON.parse(fqlQuery) : undefined}
          selectedType={entityTypeId}
          isQueryButtonDisabled={false}
          listName={listName}
          status={status === STATUS_VALUES.ACTIVE ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE}
          visibility={visibility === VISIBILITY_VALUES.SHARED ? VISIBILITY_VALUES.SHARED : VISIBILITY_VALUES.PRIVATE}
          description={description}
        />}
    >
      {t('loading-fallback')}
    </Pluggable>
  );
};
