import React, { FC, useState, useRef } from 'react';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Layout,
  Loading,
  MetaSection,
  expandAllSections,
  collapseAllSections
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { HTTPError } from 'ky';
import {
  useCrossTenantCheck,
  useCSVExport,
  useDeleteList,
  useKeyCommandsMessages,
  useListDetails,
  useMessages,
  useNavigationBlock,
  useRecordTypeLabel
} from '../../hooks';
import { t, computeErrorMessage, isInactive, isInDraft, isCanned, isEmptyList } from '../../services';
import {
  MainListInfoForm,
  CancelEditModal,
  ConfirmDeleteModal,
  ErrorComponent,
  EditListResultViewer,
  EditListLayout, HasCommandWrapper
} from '../../components';

import { EditListMenu } from './components';
import { useEditListFormState, useEditList } from './hooks';

import { FIELD_NAMES, QueryBuilderColumnMetadata } from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';
import { AddCommand } from '../../keyboard-shortcuts';
import { handleKeyCommand } from '../../utils';


export const EditListPage:FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const { isCrossTenant } = useCrossTenantCheck();
  const accordionStatusRef = useRef(null);
  const { id }: { id: string } = useParams();
  const [columns, setColumns] = useState<QueryBuilderColumnMetadata[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isQueryBuilderOpen, setIsQueryBuilderOpen] = useState(false);

  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);
  const { showCommandError } = useKeyCommandsMessages();

  const listName = listDetails?.name ?? '';

  const recordTypeLabel = useRecordTypeLabel(listDetails?.entityTypeId);

  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, hasChanges, onValueChange, isListBecameActive } = useEditListFormState(listDetails, loadingListDetails);
  const { isExportInProgress, isCancelExportInProgress } = useCSVExport({
    listId: id,
    listName,
    listDetails,
    columns: columns.map(({ value }) => value)
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

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const deleteListHandler = () => {
    setShowConfirmDeleteModal(false);
    deleteList();
  };

  const version = listDetails?.version ?? 0;

  // we only want to show the modal when we have form changes and the QB has not been invoked.
  // if the QB is invoked, its own test/run query and save will handle saving, not us.
  const {
    showConfirmCancelEditModal,
    continueNavigation,
    keepEditHandler,
    setShowConfirmCancelEditModal
  } = useNavigationBlock(hasChanges && !isQueryBuilderOpen, isSaving, true);

  const backToList = () => {
    continueNavigation();
    setIsSaving(false);
  };

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

        const searchParams = new URLSearchParams(window.location.search).toString();
        history.push({
          pathname: `${HOME_PAGE_URL}/list/${id}`,
          search: searchParams
        });
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

  const onSave = () => {
    setIsSaving(true);
    saveList();
  };

  const buttonHandlers = {
    'delete': () => setShowConfirmDeleteModal(true),
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

  const closeHandler = () => {
    setShowConfirmCancelEditModal(true);
    const searchParams = new URLSearchParams(window.location.search).toString();
    history.push(
      {
        pathname: `${HOME_PAGE_URL}/list/${id}`,
        search: searchParams,
      }
    );
    backToList();
  };


  const shortcuts = [
    AddCommand.save(handleKeyCommand(
      () => onSave(),
      !isSaveDisabled,
      () => showCommandError()
    )),
    AddCommand.expandSections((e: KeyboardEvent) => expandAllSections(e, accordionStatusRef)),
    AddCommand.collapseSections((e: KeyboardEvent) => collapseAllSections(e, accordionStatusRef))
  ];

  return (
    <HasCommandWrapper
      commands={shortcuts}
    >
      <TitleManager
        record={intl.formatMessage({ id:'ui-lists.title.editList' }, { listName })}
      >
        <EditListLayout
          lastMenu={
            <EditListMenu
              conditions={conditions}
              buttonHandlers={buttonHandlers}
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
          <AccordionStatus ref={accordionStatusRef}>
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
                    isCrossTenant={isCrossTenant(listDetails?.entityTypeId || '')}
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
              contentVersion={listDetails?.successRefresh?.contentVersion ?? 0}
              entityTypeId={listDetails?.entityTypeId ?? ''}
              status={state[FIELD_NAMES.STATUS]}
              listName={state[FIELD_NAMES.LIST_NAME]}
              visibility={state[FIELD_NAMES.VISIBILITY]}
              description={state[FIELD_NAMES.DESCRIPTION]}
              setColumns={setColumns}
              // QB will save the description/name/etc; we just need to turn off the "there are unsaved changes"
              // dialog when the QB closes
              setIsModalShown={setIsQueryBuilderOpen}
            />
          </AccordionStatus>
          <CancelEditModal
            onCancel={() => {
              setShowConfirmCancelEditModal(false);
              backToList();
            }}
            onKeepEdit={keepEditHandler}
            open={showConfirmCancelEditModal && hasChanges}
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
    </HasCommandWrapper>
  );
};
