import { Pluggable } from '@folio/stripes/core';
import React, { FC, useMemo } from 'react';
import { useVisibleColumns } from '../../hooks';
import { useQueryBuilderResultViewerSources } from '../../hooks/useQueryBuilderSources';
import { QueryBuilderColumnMetadata, STATUS_VALUES, VISIBILITY_VALUES } from '../../interfaces';
import { t } from '../../services';
import { ConfigureQuery } from '../ConfigureQuery';

import css from './EditListResultViewer.module.css';

export interface EditListResultViewerProps {
  id: string;
  version?: number;
  entityTypeId?: string;
  fqlQuery: string;
  contentVersion: number;
  fields?: string[];
  status: string;
  listName: string;
  visibility: string;
  description: string;
  isDuplicating?: boolean;
  isQueryButtonDisabled?: boolean;
  setColumns?: (columns: QueryBuilderColumnMetadata[]) => void;
  setIsModalShown?: (isShown: boolean) => void;
}

export const EditListResultViewer: FC<EditListResultViewerProps> = ({
  id,
  version,
  entityTypeId,
  fqlQuery,
  contentVersion,
  status,
  listName,
  visibility,
  description,
  fields,
  setColumns,
  isDuplicating = false,
  isQueryButtonDisabled = false,
  setIsModalShown,
}) => {
  const { visibleColumns } = useVisibleColumns(id);

  const fqlQueryParsed = useMemo(() => (fqlQuery ? JSON.parse(fqlQuery) : undefined), [fqlQuery]);

  return (
    <Pluggable
      paneSub={t('list.modal.pane-sub', { listName })}
      type="query-builder"
      componentType="viewer"
      showQueryAccordion
      headline={({ totalRecords }: any) => t('mainPane.subTitle', { count: totalRecords })}
      refreshTrigger={contentVersion}
      fqlQuery={fqlQueryParsed}
      {...useQueryBuilderResultViewerSources(entityTypeId, id, visibleColumns)}
      visibleColumns={visibleColumns}
      onSetDefaultColumns={setColumns}
      contentQueryKeys={visibleColumns}
      height={500}
      additionalControls={
        <div className={css.queryBuilderButton}>
          <ConfigureQuery
            listId={isDuplicating ? undefined : id}
            version={isDuplicating ? undefined : version}
            isEditQuery={!isDuplicating}
            initialValues={fqlQueryParsed}
            selectedType={entityTypeId}
            recordColumns={fields}
            isQueryButtonDisabled={isQueryButtonDisabled}
            listName={listName}
            status={status === STATUS_VALUES.ACTIVE ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE}
            visibility={
              visibility === VISIBILITY_VALUES.SHARED
                ? VISIBILITY_VALUES.SHARED
                : VISIBILITY_VALUES.PRIVATE
            }
            description={description}
            setIsModalShown={setIsModalShown}
          />
        </div>
      }
    >
      {t('loading-fallback')}
    </Pluggable>
  );
};
