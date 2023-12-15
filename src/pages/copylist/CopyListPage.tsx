import React, { FC } from 'react';
import {
  Accordion,
  AccordionSet,
  Button,
  Layer,
  Layout,
  Loading,
  Pane,
  PaneFooter,
  Paneset
} from '@folio/stripes/components';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { HTTPError } from 'ky';
import { useListDetails, useMessages, useInitRefresh } from '../../hooks';
import { computeErrorMessage, t } from '../../services';
import { ConfigureQuery, ErrorComponent, ListAppIcon, MainListInfoForm } from '../../components';
import { useCopyListFormState } from './hooks';
import { FIELD_NAMES, ListsRecordBase } from '../../interfaces';
import { HOME_PAGE_URL } from '../../constants';
import { useCreateList } from '../createlist/hooks';

import css from './CopyListPage.module.css';

export const CopyListPage:FC = () => {
  const history = useHistory();
  const { formatNumber } = useIntl();
  const { id }: {id: string} = useParams();
  const { data: listDetails, isLoading: loadingListDetails, detailsError } = useListDetails(id);

  const listName = listDetails?.name ?? '';

  const { initRefresh } = useInitRefresh({ onSuccess: (data) => {
    history.push(`/lists/list/${data.listId}`);
  } });
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { state, onValueChange } = useCopyListFormState(listDetails, loadingListDetails);

  const backToList = () => {
    history.push(`${HOME_PAGE_URL}/list/${id}`);
  };

  const { fqlQuery = '' } = listDetails || {};
  const recordType = listDetails?.entityTypeId;
  const { saveList, isLoading } = useCreateList(
    {
      listObject: { ...state, fqlQuery, recordType },
      onSuccess: (list: ListsRecordBase) => {
        if (list.id) {
          showSuccessMessage({ message: t('callout.list.save.success', {
            listName: state[FIELD_NAMES.LIST_NAME]
          }) });

          initRefresh(list.id);
        }
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
    <Paneset>
      <Layer isOpen contentLabel={listName}>
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            appIcon={<ListAppIcon />}
            paneTitle={t('lists.copy.title', { listName })}
            paneSub={!loadingListDetails ?
              t('mainPane.subTitle',
                { count: formatNumber(listDetails?.successRefresh?.recordsCount ?? 0) })
              :
              <>{t('lists.item.loading')}<Loading /></>}
            onClose={closeHandler}
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
                  disabled={hasName || isLoading}
                  onClick={onSave}
                >
                  {t('button.save')}
                </Button>}
            />}
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
                    showInactiveWarning
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
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};
