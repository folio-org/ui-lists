import React, {FC, useRef} from 'react';
import {useIntl} from 'react-intl';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  collapseAllSections,
  expandAllSections,
  HasCommand,
  Layout,
  Loading
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useHistory, useParams } from 'react-router-dom';
import { HTTPError } from 'ky';
import { useCreateList, useInitRefresh, useListDetails, useMessages, useRecordTypeLabel} from '../../hooks';
import { computeErrorMessage, t } from '../../services';
import { EditListLayout, EditListResultViewer, ErrorComponent, MainListInfoForm } from '../../components';
import { useCopyListFormState } from './hooks';
import { FIELD_NAMES, ListsRecordBase, STATUS_VALUES } from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';
import { SHORTCUTS_NAMES } from "../../keyboard-shortcuts";

export const CopyListPage:FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const { id }: {id: string} = useParams();
  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);
  const recordTypeLabel = useRecordTypeLabel(listDetails?.entityTypeId);
  const accordionStatusRef = useRef(null);
  const listName = listDetails?.name ?? '';
  const fqlQuery = listDetails?.fqlQuery ?? '';

  const redirectToNewList = (newListId: string) => {
    history.push(`${HOME_PAGE_URL}/list/${newListId}`);
  };

  const backToList = () => {
    history.push(`${HOME_PAGE_URL}/list/${id}`);
  };

  const { initRefresh } = useInitRefresh({ onSuccess: (data) => {
    redirectToNewList(data.listId);
  } });
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, onValueChange } = useCopyListFormState(listDetails, loadingListDetails);


  const recordType = listDetails?.entityTypeId;
  const { saveList, isLoading } = useCreateList(
    {
      listObject: { ...state, fields: listDetails?.fields, fqlQuery, recordType },
      onSuccess: (list: ListsRecordBase) => {
        showSuccessMessage({ message: t('callout.list.save.success', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });

        if (state[FIELD_NAMES.STATUS] === STATUS_VALUES.INACTIVE || !fqlQuery) {
          redirectToNewList(list.id);
        }

        initRefresh(list.id);
      },
      onError: (error: HTTPError) => {
        (async () => {
          const errorMessage = await computeErrorMessage(error, 'callout.list.save.error', {
            listName: state[FIELD_NAMES.LIST_NAME]
          });

          showErrorMessage({ message: errorMessage });
        })();
      }
    }
  );

  if (detailsError) {
    return <ErrorComponent error={detailsError} />;
  }

  const closeHandler = () => {
    backToList();
  };

  const onSave = () => {
    saveList();
  };

  const hasName = !state[FIELD_NAMES.LIST_NAME];

  if (loadingListDetails) {
    return <Loading />;
  }

  const shortcuts = [
    {
      name: SHORTCUTS_NAMES.SAVE,
      handler: (e: KeyboardEvent) => {
        e.preventDefault()

        if (!hasName && !isLoading) {
          onSave()
        }
      },
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
          record={intl.formatMessage({ id:'ui-lists.title.duplicateList' }, { listName })}
        >
          <EditListLayout
            name={listName}
            onSave={onSave}
            onCancel={closeHandler}
            title={t('lists.copy.title', { listName })}
            isLoading={loadingListDetails}
            isSaveButtonDisabled={hasName || isLoading}
          >
            <AccordionSet>
              <Accordion
                data-testid="metaSectionAccordion"
                label={t('accordion.title.list-information')}
              >
                <Layout>
                  <MainListInfoForm
                    onValueChange={onValueChange}
                    status={state[FIELD_NAMES.STATUS]}
                    listName={state[FIELD_NAMES.LIST_NAME]}
                    visibility={state[FIELD_NAMES.VISIBILITY]}
                    description={state[FIELD_NAMES.DESCRIPTION]}
                    recordTypeLabel={recordTypeLabel}
                    isLoading={loadingListDetails}
                  />
                </Layout>
              </Accordion>
            </AccordionSet>

            <EditListResultViewer
              isDuplicating
              id={id}
              version={listDetails?.version}
              fields={listDetails?.fields}
              fqlQuery={listDetails?.fqlQuery ?? ''}
              userFriendlyQuery={listDetails?.userFriendlyQuery ?? ''}
              contentVersion={listDetails?.successRefresh?.contentVersion ?? 0}
              entityTypeId={listDetails?.entityTypeId}
              status={state[FIELD_NAMES.STATUS]}
              listName={state[FIELD_NAMES.LIST_NAME]}
              visibility={state[FIELD_NAMES.VISIBILITY]}
              description={state[FIELD_NAMES.DESCRIPTION]}
              isQueryButtonDisabled={hasName || isLoading}
            />
          </EditListLayout>
        </TitleManager>
      </AccordionStatus>
    </HasCommand>
  );
};
