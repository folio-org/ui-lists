import { Loading } from '@folio/stripes/components';
import React, { FC } from 'react';
import { t } from '../../services';


export const CompilingLoader: FC = () => {
  return (
    <><span>{t('lists.item.compiling')}</span><Loading /></>
  );
};
