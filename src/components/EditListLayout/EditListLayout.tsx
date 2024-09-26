import React, { FC, ReactElement, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { isNumber, noop } from 'lodash';
import { Layer, Loading, Pane, PaneFooter, Paneset } from '@folio/stripes/components';
import { Buttons } from '../Buttons';
import { t } from '../../services';
import { ListAppIcon } from '../ListAppIcon';

type EditListLayoutProps = {
  isSaveButtonDisabled?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  children?: ReactNode,
  name: string,
  title: string | ReactElement,
  recordsCount?: number,
  lastMenu?: ReactElement
};

export const EditListLayout: FC<EditListLayoutProps> = ({
  children,
  name,
  title,
  isLoading,
  recordsCount,
  onCancel = noop,
  isSaveButtonDisabled,
  onSave = noop,
  lastMenu
}) => {
  const { formatNumber } = useIntl();
  const getRecordCountString = (count: any) => {
    if (isNumber(count)) {
      return t('mainPane.subTitle', { count: formatNumber(count) });
    }
    return '';
  };

  const paneSub =
    !isLoading ? getRecordCountString(recordsCount)
      : <>{t('lists.item.loading')}<Loading /></>;

  if (isLoading) {
    return <Loading />;
  }

  // @ts-ignore
  return (
    <Paneset>
      <Layer isOpen contentLabel={name}>
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            appIcon={<ListAppIcon />}
            paneTitle={title}
            paneSub={paneSub}
            onClose={onCancel}
            lastMenu={lastMenu}
            footer={<PaneFooter
              renderStart={
                <Buttons.Cancel
                  onCancel={onCancel}
                />
              }
              renderEnd={
                <Buttons.Save
                  disabled={!!isSaveButtonDisabled}
                  onSave={onSave}
                />}
            />}
          >
            {children}
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};
