import { ConfirmationModal } from '@folio/stripes/components';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { t, tString } from '../../services';

type ConfirmDeleteModalProps = {
  listName: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  listName,
  onConfirm,
  onCancel,
  open,
}) => {
  const intl = useIntl();

  return (
    <ConfirmationModal
      buttonStyle="danger"
      confirmLabel={t('list.modal.delete')}
      heading={tString(intl, 'list.modal.delete-list')}
      message={t('list.modal.confirm-message', { listName })}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
    />
  );
};
