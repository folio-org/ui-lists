import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { computeErrorMessage, t } from '../../services';
import { useCreateList, useCreateListFormState } from './hooks';
import { useMessages } from '../../hooks';
import { AsideForm, CreateListLayout, MainCreateListForm } from './components';
import { HOME_PAGE_URL } from '../../constants';
import { ListsRecordBase } from '../../interfaces';
import { FIELD_NAMES } from './types';


export const CreateListPage:FC = () => {
  const history = useHistory();
  const { state, onValueChange, hasChanges } = useCreateListFormState();
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const { saveList, isLoading } = useCreateList({
    listObject: state,
    onError: async (error) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.save.error', {
        listName: state[FIELD_NAMES.LIST_NAME]
      });

      showErrorMessage({ message: errorMessage });
    },
    onSuccess: (list: ListsRecordBase) => {
      if (list.id) {
        showSuccessMessage({ message: t('callout.list.save.success', {
          listName: state[FIELD_NAMES.LIST_NAME]
        }) });

        history.push(`list/${list?.id}`);
      }
    }
  });
  const closeViewHandler = useCallback(() => history.push(HOME_PAGE_URL),
    [history]);

  const { description, listName, visibility, status, recordType } = state;
  const isRequiredMissing = !listName?.length || !recordType?.length;

  const renderAside = () => (
    <AsideForm
      selectedType={recordType}
      onValueChange={onValueChange}
      listName={listName}
      status={status}
      visibility={visibility}
      description={description}
      isQueryButtonDisabled={isRequiredMissing || isLoading}
    />
  );
  const renderMain = () => (
    <MainCreateListForm
      descriptionField={description}
      listNameField={listName}
      visibilityField={visibility}
      statusField={status}
      onValueChange={onValueChange}
    />
  );

  return (
    <CreateListLayout
      renderAsideContent={renderAside}
      renderMainContent={renderMain}
      isSavingInProgress={isLoading}
      isSaveButtonDisabled={isRequiredMissing || isLoading}
      onSave={saveList}
      onClose={closeViewHandler}
      onCancel={closeViewHandler}
      showModalOnCancel={hasChanges}
    />
  );
};

