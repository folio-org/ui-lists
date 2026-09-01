import React, { FC } from 'react';
import { useIntl } from 'react-intl';

/* @ts-ignore:next-line */
import { MessageBanner, TextLink } from '@folio/stripes/components';
import { t, tString } from '../../../../services';

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
  const intl = useIntl();

  if (!shouldShow) {
    return <div />;
  }

  return (
    <div style={{ marginBottom: '15px' }}>
      <MessageBanner show={shouldShow} type="success">
        <span style={{ color: 'black' }}>
          {(t('status-toast.success.refresh-complete', { count: recordsCount }))}
        </span>
        {/* Rendered as a native <button> so it is reachable via Tab and triggerable with Enter/Space */}
        <TextLink
          element="button"
          type="button"
          aria-label={tString(intl, 'status-toast.success.link')}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={onViewListClick}
        >
          <strong>
            {t('status-toast.success.link')}
          </strong>
        </TextLink>
      </MessageBanner>
    </div>
  );
};
