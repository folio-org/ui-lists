import React from 'react';
// @ts-ignore:next-line
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { t } from '../../../../services';
import { EntityTypeColumn } from '../../../../interfaces';

type ListInformationResultViewerType = {
  userFriendlyQuery?: string,
  contentVersion?: number,
  setColumnControlList?: (columns:EntityTypeColumn[]) => void,
  setDefaultVisibleColumns?: (columns:string[]) => void,
  listID?: string,
  entityTypeId?: string,
  visibleColumns?: string[] | null
}


export const ListInformationResultViewer: React.FC<ListInformationResultViewerType> = ({
  userFriendlyQuery = '',
  contentVersion = 0,
  setColumnControlList = () => {},
  listID = '',
  entityTypeId = '',
  setDefaultVisibleColumns = () => {},
  visibleColumns = []
}) => {
  const ky = useOkapiKy();

  const getAsyncContentData = ({ limit, offset }: any) => {
    return ky.get(`lists/${listID}/contents?offset=${offset}&size=${limit}`).json();
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
          { query: userFriendlyQuery || '' })}
      headline={({ totalRecords }: any) => (
        t('mainPane.subTitle',
          { count: totalRecords === 'NaN' ? 0 : totalRecords })
      )}
      refreshTrigger={contentVersion}
      contentDataSource={getAsyncContentData}
      entityTypeDataSource={getAsyncEntityType}
      visibleColumns={visibleColumns}
      onSetDefaultVisibleColumns={setDefaultVisibleColumns}
      onSetDefaultColumns={setColumnControlList}
      height={500}
    >
      No loaded
    </Pluggable>

  );
};
