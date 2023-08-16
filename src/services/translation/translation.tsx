import React from 'react';
import { FormattedMessage, FormattedNumber, FormattedTime, FormattedDate } from 'react-intl';

export const UI_LISTS_NAMESPACE = 'ui-lists';

export const t = (id: string, values?: {
    [key: string]: string | number
}) => {
  const idWithPrefix = `${UI_LISTS_NAMESPACE}.${id}`;

  return <FormattedMessage id={idWithPrefix} values={values} />;
};

export const formatNumber = (number: (string | number) = 0) => {
  return <FormattedNumber value={Number(number)} />;
};

export const formatTime = (date: (string | number | Date)) => {
  return <FormattedTime value={date} />;
};


export const formatDate = (date: (string | number | Date)) => {
  return <FormattedDate value={date} />;
};
