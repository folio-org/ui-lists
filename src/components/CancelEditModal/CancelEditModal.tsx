import { ConfirmationModal } from '@folio/stripes/components';
import React, { FC } from 'react';
import { t } from '../../services';

type CancelEditModalProps = {
  onCancel: () => void,
  onKeepEdit: () => void,
  open: boolean
}

export const CancelEditModal: FC<CancelEditModalProps> = ({ onCancel, onKeepEdit, open }) => {
  return (
    <ConfirmationModal
      confirmLabel={t('list.modal.keep-edit')}
      cancelLabel={t('list.modal.cancel-edit')}
      heading={t('list.model.sure-heading')}
      message={t('list.modal.confirm-cancel-message')}
      onCancel={onCancel}
      onConfirm={onKeepEdit}
      open={open}
    />
  );
};
