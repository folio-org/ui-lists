import React from 'react';
// @ts-ignore:next-line
import { Loading, TextLink } from '@folio/stripes/components';
import { t, formatNumber, formatTime, formatDate } from '../../../services/translation';

import { VisibilitySell } from '../components/VisibilityCell';
import { HOME_PAGE_URL, COLUMNS_NAME } from '../../../constants';
import { ListsRecord } from '../../../interfaces';

export const listTableResultFormatter: Record<string, (item: ListsRecord) => React.JSX.Element> = {
  [COLUMNS_NAME.LIST_NAME]: (item) => (
    <TextLink to={`${HOME_PAGE_URL}/list/${item.id}`}>{item.name}</TextLink>
  ),
  [COLUMNS_NAME.STATUS]: (item) => (
    t(item.isActive
      ? 'lists.item.active'
      : 'lists.item.inactive')
  ),
  [COLUMNS_NAME.VISIBILITY]: (item) => (
    <VisibilitySell record={item} />
  ),
  [COLUMNS_NAME.SOURCE]: (item) => (item.isCanned ? (t('list.info.source.system')) : (<>{item.createdByUsername}</>)),
  [COLUMNS_NAME.RECORDS]: (item) => (
    item.isRefreshing
      ? <><span style={{ whiteSpace: 'nowrap' }}>{t('lists.item.compiling')}</span><Loading /></>
      : <>{formatNumber(item.recordsCount)}</>
  ),
  [COLUMNS_NAME.LAST_UPDATED]: (item) => (
    item.refreshedDate ?
      <>{formatDate(item.refreshedDate)} {formatTime(item.refreshedDate)}</>
      :
      <></>
  )
};
