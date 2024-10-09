import React from 'react';
import { IconButton, Tooltip } from '@folio/stripes/components';
import { t } from '../../../../services';
import css from './CrossTenantIcon.css';

export const CrossTenantIcon = () => {
  return (
    <Tooltip
      text={t('cross-tenant-message')}
    >
      {  // @ts-ignore
        ({ ref, ariaIds }) => (
          <span>
            <IconButton
              iconClassName={css.crossTenantIcon}
              ref={ref}
              size="small"
              icon="exclamation-circle"
              aria-labelledby={ariaIds.text}
              aria-describedby={ariaIds.sub}
            />
          </span>
        )}
    </Tooltip>
  );
};

