import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import { noop } from 'lodash';
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HOME_PAGE_URL } from '../../constants';
import { useMessages, useRecordsLimit } from '../../hooks';
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
}) => {
  const history = useHistory();
  const ky = useOkapiKy();
  const recordsLimit = useRecordsLimit();
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const [columns, setColumns] = useState<string[]>([]);
  const triggerButtonLabel = initialValues ? t('list.modal.edit-query') : undefined;

  const entityTypeDataSource = async () => {
    return selectedType ? ky.get(`entity-types/${selectedType}`).json() : noop;
  };

  const queryDetailsDataSource = async ({
    queryId,
    includeContent,
    offset,
    limit,
  }: {
    queryId: string;
    includeContent: boolean;
    offset: number;
    limit: number;
  }) => {
    const searchParams = {
      includeResults: includeContent,
      offset,
      limit,
    };

    return ky.get(`query/${queryId}`, { searchParams }).json();
  };

  const testQueryDataSource = async ({ fqlQuery }: { fqlQuery: FqlQuery }) => {
    return ky.post('query', { json: {
      entityTypeId: selectedType,
      fqlQuery: JSON.stringify(fqlQuery),
    } }).json();
  };

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
    showSuccessMessage({ message: t('callout.list.save.success', {
      listName
    }) });

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

  const getParamsSource = async ({
    entityTypeId,
    columnName,
    searchValue,
  }: {
    entityTypeId: string;
    columnName: string;
    searchValue: string;
  }) => {
    return ky
      .get(`entity-types/${entityTypeId}/columns/${columnName}/values`, {
        searchParams: {
          search: searchValue,
        },
      })
      .json();
  };

  const cancelQueryDataSource = async ({ queryId }: { queryId: string }) => {
    return ky.delete(`query/${queryId}`);
  };

  return (
    <Pluggable
      componentType="builder"
      type="query-builder"
      recordColumns={recordColumns}
      onSetDefaultVisibleColumns={setColumns}
      key={selectedType}
      disabled={isQueryButtonDisabled}
      initialValues={initialValues}
      entityTypeDataSource={entityTypeDataSource}
      testQueryDataSource={testQueryDataSource}
      getParamsSource={getParamsSource}
      runQueryDataSource={runQueryDataSource}
      cancelQueryDataSource={cancelQueryDataSource}
      queryDetailsDataSource={queryDetailsDataSource}
      onQueryRunSuccess={onQueryRunSuccess}
      onQueryRunFail={onQueryRunFail}
      recordsLimit={recordsLimit}
      saveBtnLabel={t('list.modal.run-query-and-save')}
      triggerButtonLabel={triggerButtonLabel}
    />
  );
};
