import { Loading } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import React, { useMemo } from 'react';
import { useQueryBuilderResultViewerSources } from '../../../../hooks/useQueryBuilderSources';
import { QueryBuilderColumnMetadata } from '../../../../interfaces';
import { t } from '../../../../services';

type ListInformationResultViewerType = {
  refreshTrigger?: number | boolean;
  setColumnControlList?: (columns: QueryBuilderColumnMetadata[]) => void;
  setDefaultVisibleColumns?: (columns: string[]) => void;
  listId?: string;
  fqlQuery?: string;
  entityTypeId?: string;
  visibleColumns?: string[] | null;
  refreshInProgress: boolean;
};

export const ListInformationResultViewer: React.FC<ListInformationResultViewerType> = ({
  refreshTrigger = 0,
  setColumnControlList = () => {},
  listId = '',
  fqlQuery,
  entityTypeId = '',
  setDefaultVisibleColumns = () => {},
  visibleColumns = [],
  refreshInProgress,
}) => {
  const fqlQueryParsed = useMemo(() => (fqlQuery ? JSON.parse(fqlQuery) : undefined), [fqlQuery]);

  return (
    <Pluggable
      type="query-builder"
      componentType="viewer"
      showQueryAccordion
      fqlQuery={fqlQueryParsed}
      headline={({ totalRecords }: any) => t('mainPane.subTitle', { count: totalRecords === 'NaN' ? 0 : totalRecords })}
      refreshInProgress={refreshInProgress}
      refreshTrigger={refreshTrigger}
      {...useQueryBuilderResultViewerSources(entityTypeId, listId, visibleColumns)}
      visibleColumns={visibleColumns}
      onSetDefaultVisibleColumns={setDefaultVisibleColumns}
      onSetDefaultColumns={setColumnControlList}
      height={500}
      contentQueryKeys={visibleColumns}
    >
      <Loading />
    </Pluggable>
  );
};
