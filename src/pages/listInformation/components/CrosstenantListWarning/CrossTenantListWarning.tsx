import React, { FC } from 'react';
import { MessageBanner } from '@folio/stripes/components';
import { t } from '../../../../services';

export const CrossTenantListWarning: FC<{shouldShow: boolean}> = ({ shouldShow }) => {
  return (
    <MessageBanner show={shouldShow} type="warning">
      {t('cross-tenant-message')}
    </MessageBanner>
  );
};
