import React, { FC } from 'react';
import { InfoPopover } from '@folio/stripes/components';
import { t } from '../../../services';

type VisibilityTooltipProps = {
  isECS: boolean
}

export const VisibilityTooltip:FC<VisibilityTooltipProps> = ({ isECS }) => {
  return (
    <InfoPopover
      iconSize="medium"
      content={
        <div>
          {t('create-list.main.list-visibility.tooltip')}
          {
            isECS ? (
              <>
                <br />
                <br />
                {t('create-list.cross-tenant-tip')}
              </>
            ) : (
              ''
            )
          }

        </div>
      }
    />
  );
};
