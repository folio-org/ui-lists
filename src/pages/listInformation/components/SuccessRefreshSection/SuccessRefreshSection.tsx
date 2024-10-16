import React, { FC } from 'react';

/* @ts-ignore:next-line */
import { MessageBanner, TextLink } from '@folio/stripes/components';
import { t } from '../../../../services';

export interface RefreshStatusToastProps {
    shouldShow: boolean,
    recordsCount?: number | string,
    onViewListClick?: () => void
}

export const SuccessRefreshSection :FC<RefreshStatusToastProps> = (
  { shouldShow,
    recordsCount = 0,
    onViewListClick = () => {} }
) => {
  if (!shouldShow) {
    return <div />;
  }

  return (
    <div style={{ marginBottom: '15px' }}>
      <MessageBanner show={shouldShow} type="success">
        <span style={{ color: 'black' }}>
          {(t('status-toast.success.refresh-complete', { count: recordsCount }))}
        </span>
        <TextLink style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={onViewListClick}>
          <strong>
            {t('status-toast.success.link')}
          </strong>
        </TextLink>
      </MessageBanner>
    </div>
  );
};
