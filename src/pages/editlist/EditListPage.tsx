import React, { FC, useState } from 'react';
import {
  Accordion,
  AccordionSet, Button, ConfirmationModal,
  Layer,
  Layout,
  Loading,
  // @ts-ignore:next-line
  MetaSection,
  Pane,
  PaneFooter,
  Paneset
} from '@folio/stripes/components';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { HTTPError } from 'ky';
import { useCSVExport, useListDetails, useMessages } from '../../hooks';
import { t, computeErrorMessage, isInactive, isInDraft, isCanned } from '../../services';
import { MainListInfoForm, ListAppIcon } from '../../components';

import { EditListResultViewer, EditListMenu } from './components';
import { useEditListFormState, useEditList } from './hooks';

import { FIELD_NAMES } from './types';
import { HOME_PAGE_URL } from '../../constants';


export const EditListPage:FC = () => {
  const history = useHistory();
  const { formatNumber } = useIntl();
  const { id }: {id: string} = useParams();
  const { data: listDetails, isLoading: loadingListDetails } = useListDetails(id);
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, hasChanges, onValueChange, isListBecameActive } = useEditListFormState(listDetails, loadingListDetails);
  const [showConfirmCancelEditModal, setShowConfirmCancelEditModal] = useState(false);
  const { requestExport, isExportInProgress, cancelExport, isCancelExportInProgress } = useCSVExport({ listId: id, listName: listDetails?.name || '' });
  const backToList = () => {
    history.push(`${HOME_PAGE_URL}/list/${id}`);
  };

  const version = listDetails?.version ?? 0;

  const { saveList, isLoading } = useEditList(
    {
      id,
      version,
      listObject: { ...state, fqlQuery: listDetails?.fqlQuery ?? '' },
      onSuccess: () => {
        showSuccessMessage({ message: t('callout.list.save.success', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });

        if (isListBecameActive) {
          showSuccessMessage({ message: t('callout.list.active', {
            listName: state[FIELD_NAMES.LIST_NAME]
          }) });
        }
        backToList();
      },
      onError: async (error: HTTPError) => {
        const errorMessage = await computeErrorMessage(error, 'callout.list.save.error', {
          listName: state[FIELD_NAMES.LIST_NAME]
        });

        showErrorMessage({ message: errorMessage });
      },
      onChangeVersionError: () => {
        showErrorMessage({ message: t('update-optimistic.lock.exception', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });
      }
    }
  );


  const closeHandler = () => {
    if (hasChanges) {
      setShowConfirmCancelEditModal(true);
    } else {
      backToList();
    }
  };

  const onSave = () => {
    saveList();
  };

  const buttonHandlers = {
    'delete': () => {},
    'export': () => {
      requestExport();
    },
    'cancel-export': () => {
      cancelExport();
    }
  };

  const conditions = {
    isExportInProgress,
    isCancelExportInProgress,
    isListInactive: isInactive(listDetails),
    isListInDraft: isInDraft(listDetails),
    isListCanned: isCanned(listDetails)
  };

  if (loadingListDetails) {
    return <Loading />;
  }

  return (
    <Paneset>
      <Layer isOpen contentLabel="">
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            appIcon={<ListAppIcon />}
            paneTitle={t('lists.edit.title', { listName: listDetails?.name || '' })}
            paneSub={!loadingListDetails ?
              t('mainPane.subTitle',
                { count: formatNumber(listDetails?.successRefresh?.recordsCount || 0) })
              :
              <>{t('lists.item.loading')}<Loading /></>}
            onClose={closeHandler}
            lastMenu={<EditListMenu
              conditions={conditions}
              buttonHandlers={buttonHandlers}
            />}
            footer={<PaneFooter
              renderStart={
                <Button
                  onClick={closeHandler}
                >
                  {t('button.cancel')}
                </Button>}
              renderEnd={
                <Button
                  buttonStyle="primary"
                  disabled={!hasChanges || !state[FIELD_NAMES.LIST_NAME] || isLoading}
                  onClick={onSave}
                >
                  {t('button.save')}
                </Button>}
            />}
          >
            <AccordionSet>
              <Accordion
                data-testid="metaSectionAccordion"
                label={<FormattedMessage id="ui-lists.accordion.title.list-information" />}
              >
                <Layout>
                  <MetaSection
                    contentId="userInfoRecordMetaContent"
                    createdDate={listDetails?.createdDate}
                    createdBy={listDetails?.createdByUsername}
                    id="userInfoRecordMeta"
                    lastUpdatedDate={listDetails?.successRefresh?.refreshEndDate}
                    lastUpdatedBy={listDetails?.successRefresh?.refreshedByUsername}
                  />
                  <MainListInfoForm
                    onValueChange={onValueChange}
                    status={state[FIELD_NAMES.STATUS]}
                    listName={state[FIELD_NAMES.LIST_NAME]}
                    visibility={state[FIELD_NAMES.VISIBILITY]}
                    description={state[FIELD_NAMES.DESCRIPTION]}
                    isLoading={loadingListDetails}
                    showInactiveWarning
                  />
                </Layout>
              </Accordion>
            </AccordionSet>
            <EditListResultViewer
              id={id}
              version={version}
              // @ts-ignore:next-line
              fqlQuery={listDetails?.fqlQuery}
              userFriendlyQuery={listDetails?.userFriendlyQuery || ''}
              contentVersion={listDetails?.successRefresh?.contentVersion || 0}
              entityTypeId={listDetails?.entityTypeId || ''}
              status={state[FIELD_NAMES.STATUS]}
              listName={state[FIELD_NAMES.LIST_NAME]}
              visibility={state[FIELD_NAMES.VISIBILITY]}
              description={state[FIELD_NAMES.DESCRIPTION]}
            />
          </Pane>
        </Paneset>
      </Layer>
      <ConfirmationModal
        confirmLabel={t('list.modal.keep-edit')}
        cancelLabel={t('list.modal.cancel-edit')}
        heading={t('list.model.sure-heading')}
        message={t('list.modal.confirm-cancel-message')}
        onCancel={() => {
          setShowConfirmCancelEditModal(false);
          backToList();
        }}
        onConfirm={() => setShowConfirmCancelEditModal(false)}
        open={showConfirmCancelEditModal}
      />
    </Paneset>
  );
};
