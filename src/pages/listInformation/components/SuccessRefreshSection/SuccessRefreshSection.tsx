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
  const wrapperIndent = {
    marginTop: shouldShow ? '15px' : 0,
    paddingRight: '15px',
    paddingLeft: '15px'
  };

  return (
    <div style={wrapperIndent}>
      <MessageBanner show={shouldShow} type="success">
        <span style={{ color: 'black' }}>
          {(t('status-toast.success.refresh-complete', { count: recordsCount }))}
        </span>
        <TextLink style={{ cursor: 'pointer' }} onClick={onViewListClick}>
          <strong>
            {t('status-toast.success.link')}
          </strong>
        </TextLink>
      </MessageBanner>
    </div>
  );
};
