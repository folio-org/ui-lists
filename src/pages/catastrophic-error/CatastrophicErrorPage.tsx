import React, { ReactNode, useMemo } from 'react';
import { Headline } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { FormattedMessage, useIntl } from 'react-intl';
import css from './CatastrophicErrorPage.module.css';
import { FQMError } from '../../interfaces';

/**
 * Get translation keys for a given catastrophic error.
 *
 * If no error, this means we have no entity types, so return that case (missing permissions to access any).
 * Otherwise, try to find specific heading/messages from the code. If no dedicated heading exists, use our fallback.
 * If no dedicated message keys exist, try to find it from our error component translations, or fallback to a generic
 * "please contact your system administrator" message.
 */
export function getErrorTranslations(
  error: FQMError | null,
  messages: Record<string, unknown>,
): {
  headingKey: string;
  messageKey: string;
  values?: Record<string, ReactNode>;
} {
  if (!error) {
    return {
      headingKey: 'ui-lists.catastrophic-error.missing-all-entity-type-permissions.heading',
      messageKey: 'ui-lists.catastrophic-error.fallback.message',
    };
  }

  const errorCode = error.code;
  const possibleHeadings = [
    `ui-lists.catastrophic-error.${errorCode}.heading`,
    `ui-lists.error-component.${errorCode}`,
    `ui-lists.${errorCode}`,
  ];
  const possibleMessages = [`ui-lists.catastrophic-error.${errorCode}.message`];
  return {
    headingKey:
      possibleHeadings.find((key) => key in messages) ||
      'ui-lists.catastrophic-error.fallback.heading',
    messageKey:
      possibleMessages.find((key) => key in messages) ||
      'ui-lists.catastrophic-error.fallback.message',
    values: error.parameters?.reduce(
      (acc, param) => {
        acc[param.key] = param.value;
        return acc;
      },
      {} as Record<string, ReactNode>,
    ),
  };
}

export function CatastrophicErrorPage({ error }: Readonly<{ error: FQMError | null }>) {
  const intl = useIntl();

  const { headingKey, messageKey, values } = useMemo(
    () => getErrorTranslations(error, intl.messages),
    [intl, error],
  );

  return (
    <Pluggable type="frontpage">
      <div className={css.titleWrap}>
        <Headline faded tag="h1" margin="none" className={css.title}>
          <FormattedMessage id={headingKey} values={values} />
        </Headline>
        <Headline faded tag="h3" margin="none" className={css.title}>
          <FormattedMessage id={messageKey} values={values} />
        </Headline>
      </div>
    </Pluggable>
  );
}
