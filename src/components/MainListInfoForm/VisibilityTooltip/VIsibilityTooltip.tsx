import React from 'react';
import { InfoPopover } from '@folio/stripes/components';
import { t } from '../../../services';

export const VisibilityTooltip = () => {
  return (
    <InfoPopover
      iconSize="medium"
      content={
        <div>
          {t('create-list.main.list-visibility.tooltip')}
          <br />
          <br />
          {t('create-list.cross-tenant-tip')}
        </div>
      }
    />
  );
};
