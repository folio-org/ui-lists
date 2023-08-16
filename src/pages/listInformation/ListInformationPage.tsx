import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  AccordionSet,
  ConfirmationModal,
  Layer,
  Loading,
  LoadingPane,
  Pane,
  Paneset,
} from '@folio/stripes/components';
// @ts-ignore:next-line
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import { useIntl } from 'react-intl';
import { t, isActive, isInDraft, isCanned, computeErrorMessage } from '../../services';
import { useListDetails, useRefresh, useDeleteList, useCSVExport } from '../../hooks';
import { useMessageContext } from '../../contexts/MessageContext';
import {
  ListAppIcon, ListInformationMenu,
  MetaSectionAccordion,
  SuccessRefreshSection
} from './components';
import { HOME_PAGE_URL } from '../../constants';
import { EntityTypeColumn, ListsRecordDetails, ICONS } from '../../interfaces';
import { getVisibleColumnsKey } from '../../utils/helpers';
import { ActionButton } from '../../components';

import './ListInformationPage.module.css';

export const ListInformationPage: React.FC = () => {
  const history = useHistory();
  const ky = useOkapiKy();
  const { formatNumber } = useIntl();
  const { id }: {id: string} = useParams();

  const { data: initialInfo, isLoading: isDetailsLoading } = useListDetails(id);

  const { requestExport, isExportInProgress, cancelInProgress: cancelExportInProgress, cancelExport } = useCSVExport({
    listId: id,
    listName: initialInfo?.name || ''
  });

  const [pulledInfo, setPulledInfo] = useState<ListsRecordDetails | null>(null);
  const [showSuccessRefreshMessage, setShowSuccessRefreshMessage] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { showSuccessMessage, showErrorMessage } = useMessageContext();
  const { initRefresh, isRefreshInProgress, cancelRefresh, cancelInProgress } = useRefresh({
    listId: id,
    shouldStartPulling: Boolean(initialInfo?.inProgressRefresh),
    onErrorPulling: (code) => {
      showErrorMessage({
        message: t(code || 'callout.list.refresh.error', {
          listName: initialInfo?.name || ''
        })
      });
    },
    onSuccessPulling: (data) => {
      setPulledInfo(data);
      setShowSuccessRefreshMessage(true);
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.refresh.error', {
        listName: initialInfo?.name || ''
      });

      showErrorMessage({ message: errorMessage });
    },
    onCancelError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'cancel-refresh.default', {
        listName: initialInfo?.name || ''
      });

      showErrorMessage({ message: errorMessage });
    },
    onCancelSuccess: () => {
      showSuccessMessage({
        message: t('cancel-refresh.success', {
          listName: initialInfo?.name || ''
        })
      });
    }
  });

  const { isDeleteInProgress, deleteList } = useDeleteList({ id,
    onSuccess: () => {
      showSuccessMessage({
        message: t('callout.list.delete.success', {
          listName: initialInfo?.name || ''
        })
      });
      history.push(HOME_PAGE_URL);
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.delete.error', {
        listName: initialInfo?.name || ''
      });

      showErrorMessage({ message: errorMessage });
    } });

  const deleteListHandler = async () => {
    setShowConfirmDeleteModal(false);
    await deleteList();
  };
  const closeSuccessMessage = () => {
    setShowSuccessRefreshMessage(false);
  };

  const [currentInfo, setCurrentInfo] = useState<ListsRecordDetails>();
  const [columnFilterList, setColumnControlList] = useState<EntityTypeColumn[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const handleColumnsChange = ({ values }: {values: string[]}) => {
    // There is always should be at least one selected column
    if (values.length === 0) {
      return;
    }
    localStorage.setItem(getVisibleColumnsKey(initialInfo?.id), JSON.stringify(values));

    setVisibleColumns(values);
  };

  const refreshButtonClickHandler = async () => {
    if (!initialInfo?.inProgressRefresh) {
      initRefresh();
      closeSuccessMessage();
      if (pulledInfo) {
        setCurrentInfo(pulledInfo);
      }
    }
  };

  const onVewListClickHandler = () => {
    if (pulledInfo) {
      setCurrentInfo(pulledInfo);
    }

    setShowSuccessRefreshMessage(false);
  };

  const handleDefaultVisibleColumnsSet = (defaultColumns: string[]) => {
    const cachedColumns = localStorage.getItem(getVisibleColumnsKey(initialInfo?.id));
    const finalVisibleColumns = cachedColumns ? JSON.parse(cachedColumns) : defaultColumns;

    setVisibleColumns(finalVisibleColumns);
  };

  const getAsyncContentData = ({ limit, offset }: any) => {
    return ky.get(`lists/${id}/contents?offset=${offset}&size=${limit}`).json();
  };

  const getAsyncEntityType = () => {
    return ky.get(`entity-types/${initialInfo?.entityTypeId}`).json();
  };

  if (isDetailsLoading) {
    return <LoadingPane />;
  }

  const dataToDisplay = currentInfo || initialInfo;
  const recordCount = dataToDisplay?.successRefresh?.recordsCount || 0;


  const cancelRefreshButton = {
    label: 'cancel-refresh',
    icon: ICONS.refresh,
    onClick: cancelRefresh,
    disabled: cancelInProgress
  };

  const refreshButton = {
    label: 'refresh',
    icon: ICONS.refresh,
    onClick: refreshButtonClickHandler,
    disabled:
      isRefreshInProgress ||
      !isActive(initialInfo) ||
      isInDraft(initialInfo) ||
      isExportInProgress
  };

  const initExportButton = {
    label: 'export',
    icon: ICONS.download,
    onClick: () => {
      requestExport();
    },
    disabled:
      isRefreshInProgress ||
      isDeleteInProgress ||
      isInDraft(initialInfo) ||
      isExportInProgress ||
      !isActive(initialInfo)
  };

  const cancelExportButton = {
    label: 'cancel-export',
    icon: ICONS.download,
    onClick: () => {
      cancelExport();
    },
    disabled: cancelExportInProgress
  };

  const refreshSlot = isRefreshInProgress ? (
    cancelRefreshButton
  ) : (
    refreshButton
  );

  const exportSlot = isExportInProgress ? cancelExportButton : initExportButton;

  const actionButtons:ActionButton[] = [
    refreshSlot,
    {
      label: 'edit',
      icon: ICONS.edit,
      onClick: () => {
        history.push(`${id}/edit`);
      },
      disabled:
        isRefreshInProgress ||
        isCanned(initialInfo) ||
        isExportInProgress
    },
    {
      label: 'delete',
      icon: ICONS.trash,
      onClick: () => setShowConfirmDeleteModal(true),
      disabled:
        isDeleteInProgress ||
        isRefreshInProgress ||
        isCanned(initialInfo) ||
        isExportInProgress
    },
    exportSlot
  ];

  return (
    <Paneset data-testid="listInformation">
      <Layer isOpen contentLabel="">
        <Paneset isRoot>
          <Pane
            dismissible
            defaultWidth="fill"
            appIcon={<ListAppIcon />}
            paneTitle={dataToDisplay?.name}
            paneSub={!isRefreshInProgress ?
              t('mainPane.subTitle',
                { count: formatNumber(recordCount) })
              :
              <>{t('lists.item.compiling')}<Loading /></>}
            lastMenu={<ListInformationMenu
              visibleColumns={visibleColumns}
              columns={columnFilterList}
              onChange={handleColumnsChange}
              actionButtons={actionButtons}
            />}
            onClose={() => history.push(HOME_PAGE_URL)}
            subheader={<SuccessRefreshSection
              shouldShow={showSuccessRefreshMessage}
              recordsCount={formatNumber(pulledInfo?.successRefresh?.recordsCount || 0)}
              onViewListClick={onVewListClickHandler}
            />}
          >
            <AccordionSet>
              <MetaSectionAccordion listInfo={dataToDisplay} />
            </AccordionSet>

            <AccordionSet>
              <Pluggable
                type="query-builder"
                componentType="viewer"
                accordionHeadline={
                  t('accordion.title.query',
                    { query: dataToDisplay?.userFriendlyQuery || '' })}
                headline={({ totalRecords }: any) => (
                  t('mainPane.subTitle',
                    { count: totalRecords === 'NaN' ? 0 : totalRecords })
                )}
                refreshTrigger={dataToDisplay?.successRefresh?.contentVersion}
                contentDataSource={getAsyncContentData}
                entityTypeDataSource={getAsyncEntityType}
                visibleColumns={visibleColumns}
                onSetDefaultVisibleColumns={handleDefaultVisibleColumnsSet}
                onSetDefaultColumns={setColumnControlList}
                height={500}
              >
                No loaded
              </Pluggable>
            </AccordionSet>
          </Pane>
        </Paneset>
      </Layer>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={t('list.modal.delete')}
        heading={t('list.modal.delete-list')}
        message={t('list.modal.confirm-message', { listName: dataToDisplay?.name || '' })}
        onCancel={() => setShowConfirmDeleteModal(false)}
        onConfirm={() => {
          deleteListHandler();
        }}
        open={showConfirmDeleteModal}
      />
    </Paneset>
  );
};
