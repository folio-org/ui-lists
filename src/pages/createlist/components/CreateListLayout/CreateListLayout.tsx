import React, { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { Layer, Loading, Pane, PaneFooter, Paneset } from '@folio/stripes/components';
import { CancelEditModal, ListAppIcon, Buttons } from '../../../../components';
import { t, tString } from '../../../../services';

type CreateListLayoutProps = {
    isSaveButtonDisabled?: boolean;
    isSavingInProgress?: boolean;
    onSave?: () => void;
    onClose?: () => void;
    showModalOnCancel?: boolean;
    children?: ReactElement;
    showConfirmCancelEditModal: boolean;
    keepEditHandler: ()=> void;
    setShowConfirmCancelEditModal: (value: boolean)=> void;
    continueNavigation: ()=> void;
    onCancel: ()=> void;
};

export const CreateListLayout: FC<CreateListLayoutProps> = ({
  isSaveButtonDisabled = false,
  isSavingInProgress = false,
  onSave = () => {},
  onClose = () => {},
  showModalOnCancel = false,
  children,
  showConfirmCancelEditModal = false,
  keepEditHandler,
  setShowConfirmCancelEditModal,
  continueNavigation,
  onCancel
}) => {
  const intl = useIntl();

  const cancelHandler = () => {
    if (!showConfirmCancelEditModal) {
      setShowConfirmCancelEditModal(true);
    }
    continueNavigation();
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
            paneSub={!isSavingInProgress ? (
              t('create-list.subtitle')
            ) : (
              <>
                {t('create-list.saving')} <Loading />
              </>
            )}
            footer={
              <PaneFooter
                renderStart={
                  <Buttons.Cancel onCancel={() => {
                    onCancel();
                    cancelHandler();
                  }
                  }
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
                cancelHandler();
                setShowConfirmCancelEditModal(false);
              }}
              onKeepEdit={keepEditHandler}
              open={showModalOnCancel && showConfirmCancelEditModal}
            />
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};
