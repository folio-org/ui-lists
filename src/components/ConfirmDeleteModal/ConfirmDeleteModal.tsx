import { ConfirmationModal } from '@folio/stripes/components';
import React, { FC } from 'react';
import { t } from '../../services';

type ConfirmDeleteModalProps = {
  listName: string,
  onCancel: () => void,
  onConfirm: () => void,
  open: boolean
}


export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({ listName, onConfirm, onCancel, open }) => {
  return (
    <ConfirmationModal
      buttonStyle="danger"
      confirmLabel={t('list.modal.delete')}
      heading={t('list.modal.delete-list')}
      message={t('list.modal.confirm-message', { listName })}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
    />
  );
};
