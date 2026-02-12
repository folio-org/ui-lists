import { Loading } from '@folio/stripes/components';
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HOME_PAGE_URL } from '../../constants';
import { useMessages, useRecordsLimit, useRecordTypes } from '../../hooks';
import { useQueryBuilderCommonSources } from '../../hooks/useQueryBuilderSources';
import {
  FqlQuery,
  ListForCreation,
  ListForUpdate,
  STATUS,
  STATUS_VALUES,
  VISIBILITY,
  VISIBILITY_VALUES,
} from '../../interfaces';
import { computeErrorMessage, t } from '../../services';

export interface ConfigureQueryProps {
  selectedType?: string;
  isQueryButtonDisabled?: boolean;
  listName?: string;
  status?: STATUS;
  visibility?: VISIBILITY;
  description?: string;
  isEditQuery?: boolean;
  listId?: string;
  version?: number;
  recordColumns?: string[];
  initialValues?: Record<string, unknown>;
  setIsModalShown?: (isShown: boolean) => void;
}

export const ConfigureQuery: FC<ConfigureQueryProps> = ({
  selectedType = '',
  isQueryButtonDisabled = true,
  listName = '',
  status,
  visibility,
  description = '',
  isEditQuery = false,
  listId,
  version,
  recordColumns,
  initialValues,
  setIsModalShown = () => ({}),
}) => {
  const history = useHistory();
  const ky = useOkapiKy();
  const recordsLimit = useRecordsLimit();
  const { labelMapping, isLoading } = useRecordTypes();
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const [columns, setColumns] = useState<string[]>([]);
  const triggerButtonLabel = initialValues ? t('list.modal.edit-query') : undefined;

  const runQueryDataSource = ({ fqlQuery, queryId }: { fqlQuery: FqlQuery; queryId: string }) => {
    if (isEditQuery) {
      const data: ListForUpdate = {
        name: listName,
        description,
        fields: columns,
        isActive: status === STATUS_VALUES.ACTIVE,
        isPrivate: visibility === VISIBILITY_VALUES.PRIVATE,
        queryId,
        version: version as number,
        fqlQuery: JSON.stringify(fqlQuery),
      };

      return ky.put(`lists/${listId}`, { json: data }).json();
    } else {
      const data: ListForCreation = {
        name: listName,
        description,
        fields: columns,
        isActive: status === STATUS_VALUES.ACTIVE,
        isPrivate: visibility === VISIBILITY_VALUES.PRIVATE,
        queryId,
        fqlQuery: JSON.stringify(fqlQuery),
        entityTypeId: selectedType,
      };

      return ky.post('lists', { json: data }).json();
    }
  };

  const onQueryRunSuccess = ({ id }: { id: string }) => {
    showSuccessMessage({
      message: t('callout.list.save.success', {
        listName,
      }),
    });

    history.push(`${HOME_PAGE_URL}/list/${id}`);
  };

  const onQueryRunFail = (error: HTTPError) => {
    (async () => {
      const errorMessage = await computeErrorMessage(error, 'update-optimistic.lock.exception', {
        listName,
      });

      showErrorMessage({ message: errorMessage });
    })();
  };

  const cancelQueryDataSource = async ({ queryId }: { queryId: string }) => {
    return ky.delete(`query/${queryId}`);
  };

  const commonSources = useQueryBuilderCommonSources(selectedType, labelMapping);

  if (isLoading) return <Loading />;

  return (
    <Pluggable
      paneSub={t('list.modal.pane-sub', { listName })}
      componentType="builder"
      type="query-builder"
      recordColumns={recordColumns}
      onSetDefaultVisibleColumns={setColumns}
      key={selectedType}
      disabled={isQueryButtonDisabled}
      initialValues={initialValues}
      runQueryDataSource={runQueryDataSource}
      cancelQueryDataSource={cancelQueryDataSource}
      {...commonSources}
      onQueryRunSuccess={onQueryRunSuccess}
      onQueryRunFail={onQueryRunFail}
      recordsLimit={recordsLimit}
      saveBtnLabel={t('list.modal.run-query-and-save')}
      triggerButtonLabel={triggerButtonLabel}
      setIsModalShown={setIsModalShown}
    />
  );
};
