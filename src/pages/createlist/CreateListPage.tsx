import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore:next-line
import { TitleManager } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import { computeErrorMessage, t } from '../../services';
import { useCreateListFormState } from './hooks';
import {
  useMessages,
  useRecordTypes,
  useCreateList,
  useKeyCommandsMessages, useNavigationBlock
} from '../../hooks';
import { CreateListLayout, MainCreateListForm } from './components';
import { HasCommandWrapper } from '../../components';
import { computeRecordTypeOptions } from './helpers';
import { handleKeyCommand } from '../../utils';
import { AddCommand } from '../../keyboard-shortcuts';
import { HOME_PAGE_URL } from '../../constants';

import { ListsRecordBase, FIELD_NAMES } from '../../interfaces';

export const CreateListPage:FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const { state, onValueChange, hasChanges, crossTenantType } = useCreateListFormState();
  const { isLoading: isLoadingRecords, recordTypes = [] } = useRecordTypes();
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { showCommandError } = useKeyCommandsMessages();

  const {
    showConfirmCancelEditModal,
    continueNavigation,
    keepEditHandler,
    setShowConfirmCancelEditModal
  } = useNavigationBlock(hasChanges);

  const { saveList, isLoading } = useCreateList({
    listObject: state,
    onError: (error) => {
      (async () => {
        const errorMessage = await computeErrorMessage(error, 'callout.list.save.error', {
          listName: state[FIELD_NAMES.LIST_NAME]
        });

        showErrorMessage({ message: errorMessage });
      })();
    },
    onSuccess: (list: ListsRecordBase) => {
      if (list.id) {
        showSuccessMessage({ message: t('callout.list.save.success', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });

        history.push(`list/${list?.id}`);
        continueNavigation();
      }
    }
  });
  const closeViewHandler = useCallback(() => history.push(HOME_PAGE_URL),
    [history]);

  const { description, listName, visibility, status, recordType } = state;
  const isRequiredMissing = !listName?.length || !recordType?.length;

  const recordTypesOptions = computeRecordTypeOptions(
    recordTypes,
    recordType
  );

  if (isLoading || isLoadingRecords) {
    return <LoadingPane />;
  }

  const isSaveDisabled = isRequiredMissing || isLoading;

  const shortcuts = [
    AddCommand.save(handleKeyCommand(
      () => saveList(),
      !isSaveDisabled,
      () => showCommandError()
    ))
  ];

  return (
    <HasCommandWrapper
      commands={shortcuts}
    >
      <TitleManager
        record={intl.formatMessage({ id:'ui-lists.title.createList' })}
      >
        <CreateListLayout
          isSavingInProgress={isLoading}
          isSaveButtonDisabled={isSaveDisabled}
          onSave={saveList}
          onClose={closeViewHandler}
          showModalOnCancel={hasChanges}
          showConfirmCancelEditModal={showConfirmCancelEditModal}
          keepEditHandler={keepEditHandler}
          setShowConfirmCancelEditModal={setShowConfirmCancelEditModal}
          continueNavigation={continueNavigation}
          onCancel={closeViewHandler}
        >
          <MainCreateListForm
            selectedType={recordType}
            descriptionField={description}
            listNameField={listName}
            visibilityField={visibility}
            statusField={status}
            onValueChange={onValueChange}
            recordTypesOptions={recordTypesOptions}
            isQueryButtonDisabled={isRequiredMissing || isLoading}
            isCrossTenant={crossTenantType}
          />
        </CreateListLayout>
      </TitleManager>
    </HasCommandWrapper>
  );
};
