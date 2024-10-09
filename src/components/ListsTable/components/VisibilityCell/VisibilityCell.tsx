import React, { FC } from 'react';
import { useCrossTenantCheck } from '../../../../hooks';
import { t } from '../../../../services';
import { CrossTenantIcon } from '../CrossTenantIcon';
import { ListsRecord } from '../../../../interfaces';


export const VisibilityCell: FC<{record: ListsRecord}> = ({ record }) => {
  const { isCrossTenant } = useCrossTenantCheck();

  return (
    <>
      {
        t(record.isPrivate
          ? 'lists.item.private'
          : 'lists.item.shared')
      }
      {
        isCrossTenant(record.id) && <CrossTenantIcon />
      }
    </>
  );
};
