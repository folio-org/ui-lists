import React from 'react';
import { FormattedMessage, FormattedNumber, FormattedTime, FormattedDate, IntlShape } from 'react-intl';

export const UI_LISTS_NAMESPACE = 'ui-lists';

/** Translate a given translation ID, returning a JSX element */
export const t = (id: string, values?: {
    [key: string]: string | number
}) => {
  const idWithPrefix = `${UI_LISTS_NAMESPACE}.${id}`;

  return <FormattedMessage id={idWithPrefix} values={values} />;
};

/**
 * Translate a given translation ID, returning a string
 *
 * @param intl should come from useIntl() in the calling code
 */
export const tString = (intl: IntlShape, id: string, values?: Record<string, string|number>) => {
  const idWithPrefix = `${UI_LISTS_NAMESPACE}.${id}`;

  return intl.formatMessage({ id: idWithPrefix }, values);
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
