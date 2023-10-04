import { Loading } from '@folio/stripes/components';
import React, { FC } from 'react';
import { t } from '../../services';
import css from './CompilingLoader.modult.css';


export const CompilingLoader: FC = () => {
  return (
    <span className={css.compilerWrapper}><span>{t('lists.item.compiling')}</span><Loading /></span>
  );
};
