import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { COLUMNS_NAME } from '../../../constants';

export const listTableMapping: Record<string, ReactNode> = {
  [COLUMNS_NAME.LIST_NAME]: <FormattedMessage
    id="ui-lists.lists.columns.list-name"
  />,
  [COLUMNS_NAME.RECORD_TYPE]: <FormattedMessage
    id="ui-lists.lists.columns.record-type"
  />,
  [COLUMNS_NAME.RECORDS]: <FormattedMessage
    id="ui-lists.lists.columns.records"
  />,
  [COLUMNS_NAME.STATUS]: <FormattedMessage
    id="ui-lists.lists.columns.status"
  />,
  [COLUMNS_NAME.SOURCE]: <FormattedMessage
    id="ui-lists.lists.columns.source"
  />,
  [COLUMNS_NAME.LAST_UPDATED]: <FormattedMessage
    id="ui-lists.lists.columns.last-updated"
  />,
  [COLUMNS_NAME.VISIBILITY]: <FormattedMessage
    id="ui-lists.lists.columns.visibility"
  />,
};
