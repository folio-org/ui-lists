import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore:next-line
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { STATUS_VALUES, STATUS, VISIBILITY, VISIBILITY_VALUES } from '../../types';
import { t } from '../../../../services';
import { useRecordsLimit, useMessages } from '../../../../hooks';
import { HOME_PAGE_URL } from '../../../../constants';

import './QueryBuilder.module.css';

type QueryBuilderProps = {
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

// @ts-ignore:next-line
export const QueryBuilder:FC<QueryBuilderProps> = (
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
  const { showSuccessMessage } = useMessages();
  const triggerButtonLabel = isEditQuery ? t('list.modal.edit-query') : undefined;

  const entityTypeDataSource = async () => {
    return ky.get(`entity-types/${selectedType}`).json();
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

  const getParamsSource = async ({ entityTypeId, columnName, searchValue }: any) => {
    return ky.get(`entity-types/${entityTypeId}/columns/${columnName}/values?search=${searchValue}`).json();
  };

  const cancelQueryDataSource = async ({ queryId } : { queryId: string }) => {
    return ky.delete(`query/${queryId}`);
  };

  return (
    selectedType &&
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
      onQueryRunFail={() => {}}
      recordsLimit={recordsLimit}
      saveBtnLabel={t('list.modal.run-query-and-save')}
      triggerButtonLabel={triggerButtonLabel}
    />
  );
};
