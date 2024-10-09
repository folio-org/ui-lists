import React, { FC } from 'react';
import { useCrossTenantCheck } from '../../../../hooks';
import { t } from '../../../../services';
import { CrossTenantIcon } from '../CrossTenantIcon';
import { ListsRecord } from '../../../../interfaces';


export const VisibilityCell: FC<{record: ListsRecord}> = ({ record }) => {
  const { isCrossTenant } = useCrossTenantCheck();
  const visibilityLabel = t(record.isPrivate
    ? 'lists.item.private'
    : 'lists.item.shared');

  return (
    <>
      {visibilityLabel}
      {
        isCrossTenant(record.id) && <CrossTenantIcon />
      }
    </>
  );
};
