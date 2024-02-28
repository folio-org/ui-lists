import React, { FC, useState } from 'react';
import {
  Accordion,
  AccordionSet,
  Layout,
  Loading,
  // @ts-ignore:next-line
  MetaSection,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { HTTPError } from 'ky';
import { useCSVExport, useDeleteList, useListDetails, useMessages } from '../../hooks';
import { t, computeErrorMessage, isInactive, isInDraft, isCanned, isEmptyList } from '../../services';
import {
  MainListInfoForm,
  CancelEditModal,
  ConfirmDeleteModal,
  ErrorComponent,
  EditListResultViewer,
  EditListLayout
} from '../../components';

import { EditListMenu } from './components';
import { useEditListFormState, useEditList } from './hooks';

import { FIELD_NAMES } from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';


export const EditListPage:FC = () => {
  const history = useHistory();
  const stripes = useStripes();
  const { id }: {id: string} = useParams();
  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);

  const listName = listDetails?.name ?? '';

  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, hasChanges, onValueChange, isListBecameActive } = useEditListFormState(listDetails, loadingListDetails);
  const { requestExport, isExportInProgress, cancelExport, isCancelExportInProgress } = useCSVExport({ listId: id, listName });
  const { deleteList, isDeleteInProgress } = useDeleteList(({ id,
    onSuccess: () => {
      showSuccessMessage({
        message: t('callout.list.delete.success', {
          listName
        })
      });
      history.push(HOME_PAGE_URL);
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.delete.error', {
        listName
      });

      showErrorMessage({ message: errorMessage });
    } }));

  const [showConfirmCancelEditModal, setShowConfirmCancelEditModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const deleteListHandler = () => {
    setShowConfirmDeleteModal(false);
    deleteList();
  };

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
          }),
          // Auto-removing does not work if messages appears in same time and has same timout
          timeout: 5999 });
        }
        backToList();
      },
      onError: (error: HTTPError) => {
        (async () => {
          const errorMessage = await computeErrorMessage(error, 'callout.list.save.error', {
            listName: state[FIELD_NAMES.LIST_NAME]
          });

          showErrorMessage({ message: errorMessage });
        })();
      },
      onChangeVersionError: () => {
        showErrorMessage({ message: t('update-optimistic.lock.exception', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });
      }
    }
  );

  if (detailsError) {
    return <ErrorComponent error={detailsError} />;
  }

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
    'delete': () => {
      setShowConfirmDeleteModal(true);
    },
    'export': () => {
      requestExport();
    },
    'cancel-export': () => {
      cancelExport();
    }
  };

  const conditions = {
    isDeleteInProgress,
    isExportInProgress,
    isCancelExportInProgress,
    isListInactive: isInactive(listDetails),
    isListInDraft: isInDraft(listDetails),
    isListCanned: isCanned(listDetails),
    isListEmpty: isEmptyList(listDetails)
  };

  if (loadingListDetails) {
    return <Loading />;
  }

  return (
    <EditListLayout
      lastMenu={
        <EditListMenu
          conditions={conditions}
          buttonHandlers={buttonHandlers}
          stripes={stripes}
        />
    }
      isLoading={loadingListDetails}
      recordsCount={listDetails?.successRefresh?.recordsCount ?? 0}
      onCancel={closeHandler}
      onSave={onSave}
      name={listName}
      title={t('lists.edit.title', { listName })}
      isSaveButtonDisabled={!hasChanges || !state[FIELD_NAMES.LIST_NAME] || isLoading}
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
        fields={listDetails?.fields || []}
        fqlQuery={listDetails?.fqlQuery ?? ''}
        userFriendlyQuery={listDetails?.userFriendlyQuery ?? ''}
        contentVersion={listDetails?.successRefresh?.contentVersion ?? 0}
        entityTypeId={listDetails?.entityTypeId ?? ''}
        status={state[FIELD_NAMES.STATUS]}
        listName={state[FIELD_NAMES.LIST_NAME]}
        visibility={state[FIELD_NAMES.VISIBILITY]}
        description={state[FIELD_NAMES.DESCRIPTION]}
      />
      <CancelEditModal
        onCancel={() => {
          setShowConfirmCancelEditModal(false);
          backToList();
        }}
        onKeepEdit={() => setShowConfirmCancelEditModal(false)}
        open={showConfirmCancelEditModal}
      />
      <ConfirmDeleteModal
        listName={listName}
        onCancel={() => setShowConfirmDeleteModal(false)}
        onConfirm={() => {
          deleteListHandler();
        }}
        open={showConfirmDeleteModal}
      />
    </EditListLayout>
  );
};
