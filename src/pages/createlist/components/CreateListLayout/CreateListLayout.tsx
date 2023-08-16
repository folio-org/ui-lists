import React, { FC, ReactNode, useState } from 'react';
import { Pane, PaneFooter, Button, Loading, ConfirmationModal } from '@folio/stripes/components';
import { ListAppIcon } from '../../../../components';
import { t } from '../../../../services';

import css from './CreateListLayout.module.css';

type CreateListLayoutProps = {
    renderAsideContent: () => ReactNode;
    renderMainContent: () => ReactNode;
    isSaveButtonDisabled?: boolean;
    isSavingInProgress?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onClose?: () => void;
    showModalOnCancel?: boolean
};

export const CreateListLayout:FC<CreateListLayoutProps> = ({ renderAsideContent,
  renderMainContent,
  isSaveButtonDisabled = false,
  isSavingInProgress = false,
  onCancel = () => {},
  onSave = () => {},
  onClose = () => {},
  showModalOnCancel = false }) => {
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
                <Button
                  onClick={cancelHandler}
                >
                  {t('button.cancel')}
                </Button>}
              renderEnd={
                <Button
                  buttonStyle="primary"
                  disabled={isSaveButtonDisabled || isSavingInProgress}
                  onClick={onSave}
                >
                  {t('button.save')}
                </Button>}
            />
          </div>
      }
      >
        <div className={css.createListForm}>
          <Pane
            defaultWidth="20%"
            paneTitle={t('create-list.aside.set-criteria')}
          >
            {renderAsideContent()}
          </Pane>
          <Pane
            renderHeader={() => <span />}
            defaultWidth="80%"
          >
            {renderMainContent()}
          </Pane>
        </div>
      </Pane>
      <ConfirmationModal
        confirmLabel={t('list.modal.keep-edit')}
        cancelLabel={t('list.modal.cancel-edit')}
        heading={t('list.model.sure-heading')}
        message={t('list.modal.confirm-cancel-message')}
        onCancel={() => {
          setShowConfirmCancelEditModal(false);
          onClose();
        }}
        onConfirm={() => setShowConfirmCancelEditModal(false)}
        open={showModalOnCancel && showConfirmCancelEditModal}
      />
    </>
  );
};
