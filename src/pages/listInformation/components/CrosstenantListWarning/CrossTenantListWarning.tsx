import React, { FC } from 'react';
import { MessageBanner } from '@folio/stripes/components';
import { t } from '../../../../services';

export const CrossTenantListWarning: FC<{shouldShow: boolean}> = ({ shouldShow }) => {
  const padding = {
    marginBottom: shouldShow ? '15px' : 0
  };

  return (
    <div style={padding}>
      <MessageBanner show={shouldShow} type="warning">
        {t('cross-tenant-message')}
      </MessageBanner>
    </div>
  );
};
