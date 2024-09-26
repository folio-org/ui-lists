import { Button } from '@folio/stripes/components';
import React from 'react';
import { t } from '../../services';

const Cancel = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <Button
      // @ts-ignore
      buttonStyle="default mega"
      onClick={onCancel}
    >
      {t('button.cancel')}
    </Button>
  );
};

const Save = ({ disabled = false, onSave }: { disabled: boolean, onSave: () => void }) => {
  return (
    <Button
      // @ts-ignore
      buttonStyle="primary mega"
      disabled={disabled}
      onClick={onSave}
    >
      {t('button.save')}
    </Button>
  );
};

export const Buttons = {
  Save,
  Cancel
};
