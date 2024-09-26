import React, { FC, ReactElement, useState } from 'react';
import { Pane, PaneFooter, Loading } from '@folio/stripes/components';
import { CancelEditModal, ListAppIcon, Buttons } from '../../../../components';
import { t } from '../../../../services';

import css from './CreateListLayout.module.css';

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
  const cancelHandler = () => {
    if (showModalOnCancel) {
      setShowConfirmCancelEditModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      <Pane
        dismissible
        onClose={onClose}
        padContent={false}
        defaultWidth="fill"
        appIcon={<ListAppIcon />}
        paneTitle={t('create-list.title')}
        paneSub={!isSavingInProgress ?
          t('create-list.subtitle') :
          <>
            {t('create-list.saving')} <Loading />
          </>}
        footer={
          <div className={css.createListFooterWrap}>
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
          </div>
      }
      >
        <div className={css.createListForm}>
          <Pane
            renderHeader={() => <span />}
            defaultWidth="fill"
          >
            {children}
          </Pane>
        </div>
      </Pane>
      <CancelEditModal
        onCancel={() => {
          setShowConfirmCancelEditModal(false);
          onClose();
        }}
        onKeepEdit={() => setShowConfirmCancelEditModal(false)}
        open={showModalOnCancel && showConfirmCancelEditModal}
      />
    </>
  );
};
