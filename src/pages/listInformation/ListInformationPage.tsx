import React, { useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { uniqueId } from 'lodash';
import {
  AccordionStatus,
  AccordionSet,
  Layer,
  LoadingPane,
  Pane,
  Paneset,
  expandAllSections,
  collapseAllSections
} from '@folio/stripes/components';
import { HTTPError } from 'ky';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { TitleManager } from '@folio/stripes/core';
import {
  t,
  isInactive,
  isInDraft,
  isCanned,
  computeErrorMessage,
  isEmptyList,
  isEditDisabled
} from '../../services';
import {
  useListDetails,
  useRefresh,
  useDeleteList,
  useCSVExport,
  useMessages,
  useVisibleColumns,
  useRecordTypeLabel,
  useKeyCommandsMessages,
  useListAppPermissions,
  useCrossTenantCheck
} from '../../hooks';
import {
  ListAppIcon, ListInformationMenu,
  MetaSectionAccordion,
  SuccessRefreshSection,
  ListInformationResultViewer,
  CrossTenantListWarning,
  SubHeaderBannersLayout
} from './components';

import { HOME_PAGE_URL } from '../../constants';
import { QueryBuilderColumnMetadata } from '../../interfaces';

import {
  ConfirmDeleteModal,
  CompilingLoader,
  ErrorComponent,
  HasCommandWrapper
} from '../../components';
import { handleKeyCommand } from '../../utils';
import { AddCommand } from '../../keyboard-shortcuts';

export const ListInformationPage: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const { canDelete, canUpdate, canExport, canRefresh } = useListAppPermissions();
  const { showCommandError } = useKeyCommandsMessages();
  const { id }: {id: string} = useParams();
  const accordionStatusRef = useRef(null);
  const { isCrossTenant } = useCrossTenantCheck();
  const {
    handleColumnsChange,
    visibleColumns,
    setDefaultVisibleColumns
  } = useVisibleColumns(id);

  const { data: listData, isLoading: isDetailsLoading, refetchDetails, detailsError } = useListDetails(id, {
    onSuccess: (newData) => {
      setDefaultVisibleColumns(newData.fields);
    }
  });

  const { name: listName = '' } = listData ?? {};
  const [refreshTrigger, setRefreshTrigger] = useState(uniqueId());
  const recordTypeLabel = useRecordTypeLabel(listData?.entityTypeId);
  const [columnControls, setColumnControls] = useState<QueryBuilderColumnMetadata[]>([]);

  const { requestExport, isExportInProgress, isCancelExportInProgress, cancelExport } = useCSVExport({
    listId: id,
    listName,
    columns: columnControls.map(({ value }) => value)
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

  const shouldShowCrossTenantWarning = isCrossTenant(listData?.entityTypeId || '');

  const buttonHandlers : any = {};

  if (canRefresh) {
    buttonHandlers['cancel-refresh'] = () => {
      cancelRefresh();
    };
    buttonHandlers.refresh = () => {
      refresh();
    };
  }

  if (canUpdate) {
    buttonHandlers.edit = () => {
      history.push(`${id}/edit`);
    };
    buttonHandlers.copy = () => {
      history.push(`${id}/copy`);
    };
  }

  if (canDelete) {
    buttonHandlers.delete = () => {
      setShowConfirmDeleteModal(true);
    };
  }

  if (canExport) {
    buttonHandlers['export-all'] = () => requestExport({ allColumns: true });
    buttonHandlers['export-visible'] = () => requestExport({});

    buttonHandlers['cancel-export'] = () => cancelExport();
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

  const shortcuts = [
    AddCommand.duplicate(handleKeyCommand(
      () => history.push(`${id}/copy`),
      canUpdate,
      () => showCommandError(!canUpdate)
    )),
    AddCommand.edit(handleKeyCommand(
      () => history.push(`${id}/edit`),
      canUpdate && !isEditDisabled(conditions),
      () => showCommandError(!canUpdate)
    )),
    AddCommand.expandSections((e: KeyboardEvent) => expandAllSections(e, accordionStatusRef)),
    AddCommand.collapseSections((e: KeyboardEvent) => collapseAllSections(e, accordionStatusRef))
  ];

  return (
    <HasCommandWrapper
      commands={shortcuts}
    >
      <TitleManager
        page={intl.formatMessage({ id:'ui-lists.title.infoList' }, { listName })}
      >
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
                    { count: intl.formatNumber(recordCount) })
                  :
                  <CompilingLoader />}
                lastMenu={<ListInformationMenu
                  visibleColumns={visibleColumns}
                  columns={columnControls}
                  onColumnsChange={handleColumnsChange}
                  buttonHandlers={buttonHandlers}
                  conditions={conditions}
                />}
                onClose={() => history.push(HOME_PAGE_URL)}
                subheader={
                  <SubHeaderBannersLayout hasBannersToDisplay={shouldShowCrossTenantWarning || showSuccessRefreshMessage}>
                    <CrossTenantListWarning shouldShow={shouldShowCrossTenantWarning} />
                    <SuccessRefreshSection
                      shouldShow={showSuccessRefreshMessage}
                      recordsCount={intl.formatNumber(polledData?.successRefresh?.recordsCount ?? 0)}
                      onViewListClick={onVewListClickHandler}
                    />
                  </SubHeaderBannersLayout>
              }
              >
                <AccordionStatus ref={accordionStatusRef}>
                  <AccordionSet>
                    <MetaSectionAccordion listInfo={listData} recordType={recordTypeLabel} />
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
                </AccordionStatus>
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
      </TitleManager>
    </HasCommandWrapper>
  );
};
