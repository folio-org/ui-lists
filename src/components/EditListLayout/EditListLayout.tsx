import React, { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { isNumber } from 'lodash';
import { Button, Layer, Loading, Pane, PaneFooter, Paneset } from '@folio/stripes/components';
import { t } from '../../services';
import { ListAppIcon } from '../ListAppIcon';

type EditListLayoutProps = {
  isSaveButtonDisabled?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  children?: ReactElement[],
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
  onCancel,
  isSaveButtonDisabled,
  onSave,
  lastMenu
}) => {
  const { formatNumber } = useIntl();
  const getRecordCountString = (count: any) => {
    return isNumber(count) ? t('mainPane.subTitle',
      { count: formatNumber(count) }) : '';
  };

  const paneSub = !isLoading ? getRecordCountString(recordsCount)
    :
  <>{t('lists.item.loading')}<Loading /></>;

  if (isLoading) {
    return <Loading />;
  }

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
                <Button
                  onClick={onCancel}
                >
                  {t('button.cancel')}
                </Button>}
              renderEnd={
                <Button
                  buttonStyle="primary"
                  disabled={isSaveButtonDisabled}
                  onClick={onSave}
                >
                  {t('button.save')}
                </Button>}
            />}
          >
            {children}
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};
