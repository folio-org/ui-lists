import React from 'react';
import { Headline } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import css from './MissingAllEntityTypePermissionsPage.module.css';

export function MissingAllEntityTypePermissionsPage() {
  return (
    <Pluggable type="frontpage">
      <div className={css.titleWrap}>
        <Headline faded tag="h1" margin="none" className={css.title}>
          <FormattedMessage id="ui-lists.missing-all-entity-type-permissions.heading" />
        </Headline>
        <Headline faded tag="h3" margin="none" className={css.title}>
          <FormattedMessage id="ui-lists.missing-all-entity-type-permissions.message" />
        </Headline>
      </div>
    </Pluggable>
  );
}
