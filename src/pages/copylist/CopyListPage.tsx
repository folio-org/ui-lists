import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Accordion, AccordionSet, Layout, Loading } from '@folio/stripes/components';
// @ts-ignore:next-line
import { TitleManager } from '@folio/stripes/core';
import { useHistory, useParams } from 'react-router-dom';
import { HTTPError } from 'ky';
import { useCreateList, useInitRefresh, useListDetails, useMessages } from '../../hooks';
import { computeErrorMessage, t } from '../../services';
import { ConfigureQuery, EditListLayout, ErrorComponent, MainListInfoForm } from '../../components';
import { useCopyListFormState } from './hooks';
import { FIELD_NAMES, ListsRecordBase, STATUS_VALUES } from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';

import css from './CopyListPage.module.css';

export const CopyListPage:FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const { id }: {id: string} = useParams();
  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);

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
      listObject: { ...state, fqlQuery, recordType },
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

  return (
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
                isLoading={loadingListDetails}
              />
            </Layout>
          </Accordion>
        </AccordionSet>
        <div className={css.queryBuilderButton}>
          <ConfigureQuery
            initialValues={fqlQuery && JSON.parse(fqlQuery)}
            selectedType={listDetails?.entityTypeId}
            isQueryButtonDisabled={hasName || isLoading}
            listName={state[FIELD_NAMES.LIST_NAME]}
            status={state[FIELD_NAMES.STATUS]}
            visibility={state[FIELD_NAMES.VISIBILITY]}
            description={state[FIELD_NAMES.DESCRIPTION]}
          />
        </div>
      </EditListLayout>
    </TitleManager>
  );
};
