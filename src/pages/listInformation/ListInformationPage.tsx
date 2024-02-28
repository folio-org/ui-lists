import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { uniqueId } from 'lodash';
import {
  AccordionSet,
  Layer,
  LoadingPane,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { HTTPError } from 'ky';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useStripes } from '@folio/stripes/core';
import { t, isInactive, isInDraft, isCanned, computeErrorMessage, isEmptyList } from '../../services';
import { useListDetails, useRefresh, useDeleteList, useCSVExport, useMessages, useVisibleColumns } from '../../hooks';
import {
  ListAppIcon, ListInformationMenu,
  MetaSectionAccordion,
  SuccessRefreshSection,
  ListInformationResultViewer
} from './components';

import { HOME_PAGE_URL } from '../../constants';
import {ListsRecordDetails, QueryBuilderColumnMetadata} from '../../interfaces';

import { ConfirmDeleteModal, CompilingLoader, ErrorComponent } from '../../components';
import { USER_PERMS } from '../../utils/constants';

export const ListInformationPage: React.FC = () => {
  const history = useHistory();
  const stripes = useStripes();
  const { formatNumber } = useIntl();
  const { id }: {id: string} = useParams();


  const {
    handleColumnsChange,
    visibleColumns,
    setDefaultVisibleColumns
  } = useVisibleColumns(id);

  const { data: listData, isLoading: isDetailsLoading, refetchDetails, detailsError } = useListDetails(id, {
    onSuccess: (listData: ListsRecordDetails) => {
      setDefaultVisibleColumns(listData.fields)
    }
  });

  const { name: listName = '' } = listData ?? {};
  const [refreshTrigger, setRefreshTrigger] = useState(uniqueId());

  const { requestExport, isExportInProgress, isCancelExportInProgress, cancelExport } = useCSVExport({
    listId: id,
    listName
  });
  const queryClient = useQueryClient();
  const [showSuccessRefreshMessage, setShowSuccessRefreshMessage] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { initRefresh, isRefreshInProgress, cancelRefresh, isCancelRefreshInProgress, polledData } = useRefresh({
    listId: id,
    inProgressRefresh: listData?.inProgressRefresh,
    onErrorPolling: (code) => {
      showErrorMessage({
        message: t(code || 'callout.list.refresh.ErrorComponent', {
          listName
        })
      });
    },
    onSuccessPolling: () => {
      setShowSuccessRefreshMessage(true);
    },
    onError: (error: HTTPError) => {
      (async () => {
        const errorMessage = await computeErrorMessage(error, 'callout.list.refresh.ErrorComponent', {
          listName
        });

        showErrorMessage({ message: errorMessage });
      })();
    },
    onCancelError: (error: HTTPError) => {
      (async () => {
        const errorMessage = await computeErrorMessage(error, 'cancel-refresh.default', {
          listName
        });

        showErrorMessage({ message: errorMessage });
      })();
    },
    onCancelSuccess: () => {
      refetchDetails();
      showSuccessMessage({
        message: t('cancel-refresh.success', {
          listName
        })
      });
    }
  });

  const { isDeleteInProgress, deleteList } = useDeleteList({ id,
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
    } });

  const updateListDetailsData = () => {
    queryClient.setQueryData(['listDetails', id], polledData);
  };

  const deleteListHandler = () => {
    setShowConfirmDeleteModal(false);
    deleteList();
  };

  const closeSuccessMessage = () => {
    setShowSuccessRefreshMessage(false);
  };
  const [columnControls, setColumnControls] = useState<QueryBuilderColumnMetadata[]>([]);

  if (detailsError) {
    return <ErrorComponent error={detailsError} />;
  }

  const refresh = () => {
    if (!listData?.inProgressRefresh) {
      initRefresh();
      closeSuccessMessage();
      if (showSuccessRefreshMessage && polledData) {
        updateListDetailsData();
      }
    }
  };

  const onVewListClickHandler = () => {
    if (polledData) {
      updateListDetailsData();
    }
    setRefreshTrigger(uniqueId());
    setShowSuccessRefreshMessage(false);
  };


  if (isDetailsLoading) {
    return <LoadingPane />;
  }

  const recordCount = listData?.successRefresh?.recordsCount ?? 0;

  const buttonHandlers : any = {};

  if (stripes.hasPerm(USER_PERMS.RefreshList)) {
    buttonHandlers['cancel-refresh'] = () => {
      cancelRefresh();
    };
    buttonHandlers.refresh = () => {
      refresh();
    };
  }

  if (stripes.hasPerm(USER_PERMS.UpdateList)) {
    buttonHandlers.edit = () => {
      history.push(`${id}/edit`);
    };
    buttonHandlers.copy = () => {
      history.push(`${id}/copy`);
    };
  }

  if (stripes.hasPerm(USER_PERMS.DeleteList)) {
    buttonHandlers.delete = () => {
      setShowConfirmDeleteModal(true);
    };
  }

  if (stripes.hasPerm(USER_PERMS.ExportList)) {
    buttonHandlers.export = () => {
      requestExport();
    };
    buttonHandlers['cancel-export'] = () => {
      cancelExport();
    };
  }

  const conditions = {
    isRefreshInProgress,
    isCancelRefreshInProgress,
    isExportInProgress,
    isCancelExportInProgress,
    isDeleteInProgress,
    isListInactive: isInactive(listData),
    isListInDraft: isInDraft(listData),
    isListCanned: isCanned(listData),
    isListEmpty: isEmptyList(listData)
  };

  return (
    <Paneset data-testid="listInformation">
      <Layer isOpen contentLabel={listName}>
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            appIcon={<ListAppIcon />}
            paneTitle={listName}
            paneSub={!isRefreshInProgress ?
              t('mainPane.subTitle',
                { count: formatNumber(recordCount) })
              :
              <CompilingLoader />}
            lastMenu={<ListInformationMenu
              stripes={stripes}
              visibleColumns={visibleColumns}
              columns={columnControls}
              onColumnsChange={handleColumnsChange}
              buttonHandlers={buttonHandlers}
              conditions={conditions}
            />}
            onClose={() => history.push(HOME_PAGE_URL)}
            subheader={<SuccessRefreshSection
              shouldShow={showSuccessRefreshMessage}
              recordsCount={formatNumber(polledData?.successRefresh?.recordsCount ?? 0)}
              onViewListClick={onVewListClickHandler}
            />}
          >
            <AccordionSet>
              <MetaSectionAccordion listInfo={listData} />
            </AccordionSet>

            <AccordionSet>
              <ListInformationResultViewer
                refreshInProgress={isRefreshInProgress}
                listID={listData?.id}
                userFriendlyQuery={listData?.userFriendlyQuery}
                entityTypeId={listData?.entityTypeId}
                refreshTrigger={Number(refreshTrigger)}
                setColumnControlList={setColumnControls}
                visibleColumns={visibleColumns}
              />
            </AccordionSet>
          </Pane>
        </Paneset>
      </Layer>
      <ConfirmDeleteModal
        listName={listName}
        onCancel={() => setShowConfirmDeleteModal(false)}
        onConfirm={() => {
          deleteListHandler();
        }}
        open={showConfirmDeleteModal}
      />
    </Paneset>
  );
};
