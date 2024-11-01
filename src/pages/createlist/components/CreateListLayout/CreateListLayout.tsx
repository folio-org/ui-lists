import React, { FC, ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import { Layer, Loading, Pane, PaneFooter, Paneset } from '@folio/stripes/components';
import { CancelEditModal, ListAppIcon, Buttons } from '../../../../components';
import { t, tString } from '../../../../services';

type CreateListLayoutProps = {
    isSaveButtonDisabled?: boolean;
    isSavingInProgress?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onClose?: () => void;
    showModalOnCancel?: boolean,
    children?: ReactElement
};

export const CreateListLayout:FC<CreateListLayoutProps> = ({
  isSaveButtonDisabled = false,
  isSavingInProgress = false,
  onCancel = () => {},
  onSave = () => {},
  onClose = () => {},
  showModalOnCancel = false,
  children
}) => {
  const [showConfirmCancelEditModal, setShowConfirmCancelEditModal] = useState(false);
  const intl = useIntl();

  const cancelHandler = () => {
    if (showModalOnCancel) {
      setShowConfirmCancelEditModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <Paneset>
      <Layer isOpen contentLabel={tString(intl, 'create-list.title')}>
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            onClose={onClose}
            appIcon={<ListAppIcon />}
            paneTitle={t('create-list.title')}
            paneSub={!isSavingInProgress ?
              t('create-list.subtitle') :
              <>
                {t('create-list.saving')} <Loading />
              </>}
            footer={
              <PaneFooter
                renderStart={
                  <Buttons.Cancel
                    onCancel={cancelHandler}
                  />
              }
                renderEnd={
                  <Buttons.Save
                    disabled={isSaveButtonDisabled || isSavingInProgress}
                    onSave={onSave}
                  />
              }
              />
              }
          >
            {children}
            <CancelEditModal
              onCancel={() => {
                setShowConfirmCancelEditModal(false);
                onClose();
              }}
              onKeepEdit={() => setShowConfirmCancelEditModal(false)}
              open={showModalOnCancel && showConfirmCancelEditModal}
            />
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};
