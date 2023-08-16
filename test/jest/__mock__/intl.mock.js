import React from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
    formatNumber: ({ id }) => id
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, values, children }) => {
      if (children) {
        return children([id]);
      }

      const valuesString = values ? (`-${JSON.stringify(values)}`) : '';

      return `${id}${valuesString}`;
    }),
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});
