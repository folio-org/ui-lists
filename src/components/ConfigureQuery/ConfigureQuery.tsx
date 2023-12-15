import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore:next-line
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { noop } from 'lodash';
import { HTTPError } from 'ky';
import { STATUS_VALUES, STATUS, VISIBILITY, VISIBILITY_VALUES } from '../../pages/createlist/types';
import { computeErrorMessage, t } from '../../services';
import { useRecordsLimit, useMessages } from '../../hooks';
import { HOME_PAGE_URL } from '../../constants';

type ConfigureQueryProps = {
  selectedType?: string,
  isQueryButtonDisabled?: boolean,
  listName?: string,
  status?: STATUS,
  visibility?: VISIBILITY,
  description?: string,
  isEditQuery?: boolean,
  listId?: string,
  version?: number,
  initialValues?: Record<string, unknown>
}

export const ConfigureQuery:FC<ConfigureQueryProps> = (
  {
    selectedType = '',
    isQueryButtonDisabled = true,
    listName = '',
    status,
    visibility,
    description = '',
    isEditQuery = false,
    listId,
    version,
    initialValues
  }
) => {
  const history = useHistory();
  const ky = useOkapiKy();
  const recordsLimit = useRecordsLimit();
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const triggerButtonLabel = initialValues ? t('list.modal.edit-query') : undefined;

  const entityTypeDataSource = async () => {
    return selectedType ? ky.get(`entity-types/${selectedType}`).json() : noop;
  };

  const queryDetailsDataSource = async ({ queryId, includeContent, offset, limit }
    : { queryId: string, includeContent: boolean, offset: number, limit: number }) => {
    const searchParams = {
      includeResults: includeContent,
      offset,
      limit
    };

    return ky.get(`query/${queryId}`, { searchParams }).json();
  };

  const testQueryDataSource = async ({ fqlQuery } : { fqlQuery: any }) => {
    return ky.post('query', { json: {
      entityTypeId: selectedType,
      fqlQuery: JSON.stringify(fqlQuery)
    } }).json();
  };

  const runQueryDataSource = ({ fqlQuery, queryId } : { fqlQuery: any, queryId: string }) => {
    const data = {
      name: listName,
      description,
      isActive: status === STATUS_VALUES.ACTIVE,
      isPrivate: visibility === VISIBILITY_VALUES.PRIVATE,
      queryId,
      version,
      fqlQuery: JSON.stringify(fqlQuery)
    };

    if (!isEditQuery) {
      // @ts-ignore:next-line
      data.entityTypeId = selectedType;
    }

    return isEditQuery ? ky.put(`lists/${listId}`, { json: data }).json() : ky.post('lists', { json: data }).json();
  };

  const onQueryRunSuccess = ({ id } : { id: string}) => {
    showSuccessMessage({ message: t('callout.list.save.success', {
      listName
    }) });

    history.push(`${HOME_PAGE_URL}/list/${id}`);
  };

  const onQueryRunFail = (error: HTTPError) => {
    (async () => {
      const errorMessage = await computeErrorMessage(error, 'update-optimistic.lock.exception', {
        listName
      });

      showErrorMessage({ message: errorMessage });
    })();
  };

  const getParamsSource = async ({ entityTypeId, columnName, searchValue }: any) => {
    return ky.get(`entity-types/${entityTypeId}/columns/${columnName}/values?search=${searchValue}`).json();
  };

  const cancelQueryDataSource = async ({ queryId } : { queryId: string }) => {
    return ky.delete(`query/${queryId}`);
  };

  return (
    <Pluggable
      componentType="builder"
      type="query-builder"
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
