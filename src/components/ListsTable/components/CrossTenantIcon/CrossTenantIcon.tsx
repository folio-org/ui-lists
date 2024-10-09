import React from 'react';
import { Icon, Tooltip } from '@folio/stripes/components';
import { t } from '../../../../services';

export const CrossTenantIcon = () => {
  return (
    <Tooltip
      text={t('cross-tenant-message')}
    >
      {  // @ts-ignore
        ({ ref, ariaIds }) => (
          <span style={{ cursor: 'pointer' }}>
            <Icon
              status="error"
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

