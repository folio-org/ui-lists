import React, { FC, useState, useRef } from 'react';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Layout,
  Loading,
  MetaSection,
  HasCommand,
  checkScope,
  expandAllSections,
  collapseAllSections
} from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { HTTPError } from 'ky';
import { useCSVExport, useDeleteList, useListDetails, useMessages, useRecordTypeLabel } from '../../hooks';
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

import {FIELD_NAMES, QueryBuilderColumnMetadata} from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';
import {SHORTCUTS_NAMES} from "../../keyboard-shortcuts";
import {handleKeyEvent} from "../../utils";


export const EditListPage:FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const accordionStatusRef = useRef(null);
  const stripes = useStripes();
  const { id }: { id: string } = useParams();
  const [columns, setColumns] = useState<QueryBuilderColumnMetadata[]>([]);

  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);

  const listName = listDetails?.name ?? '';

  const recordTypeLabel = useRecordTypeLabel(listDetails?.entityTypeId);

  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, hasChanges, onValueChange, isListBecameActive } = useEditListFormState(listDetails, loadingListDetails);
  const { requestExport, isExportInProgress, cancelExport, isCancelExportInProgress } = useCSVExport({
    listId: id,
    listName,
    listDetails,
    columns: columns.map(({value}) => value)
  });
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
    'delete': () => setShowConfirmDeleteModal(true),
    'export-all': () => requestExport({}),
    'export-visible': () => requestExport({allColumns: true}),
    'cancel-export': () => cancelExport(),
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

  const isSaveDisabled = !hasChanges || !state[FIELD_NAMES.LIST_NAME] || isLoading;


  const shortcuts = [
    {
      name: SHORTCUTS_NAMES.SAVE,
      handler: handleKeyEvent(() => {
        if (!isSaveDisabled) {
          onSave()
        }
      })
    },
    {
      name: SHORTCUTS_NAMES.EXPAND_ALL_SECTIONS ,
      handler: (e: KeyboardEvent) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: SHORTCUTS_NAMES.COLLAPSE_ALL_SECTIONS,
      handler: (e: KeyboardEvent) => collapseAllSections(e, accordionStatusRef)
    }
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <AccordionStatus ref={accordionStatusRef}>
        <TitleManager
          record={intl.formatMessage({ id:'ui-lists.title.editList' }, { listName })}
        >
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
            isSaveButtonDisabled={isSaveDisabled}
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
                    recordTypeLabel={recordTypeLabel}
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
              setColumns={setColumns}
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
        </TitleManager>
      </AccordionStatus>
    </HasCommand>
  );
};
