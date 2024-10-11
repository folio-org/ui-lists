import React, { ChangeEventHandler, FC } from 'react';
import { RadioButton, RadioButtonGroup, Icon } from '@folio/stripes/components';
import { FIELD_NAMES, VISIBILITY_VALUES } from '../type';

import css from '../MainListInfoForm.module.css';
import { t } from '../../../services';
import { VisibilityTooltip } from '../VisibilityTooltip';

type VisibilityRadioProps = {
  value: string,
  onChange: (changeEvent: ChangeEventHandler<HTMLInputElement>) => void,
}

export const VisibilityRadio: FC<VisibilityRadioProps> = ({
  value,
  onChange,
  isCrossTenant,
}) => {
  return (
    <RadioButtonGroup
      value={value}
      onChange={onChange}
      name={FIELD_NAMES.VISIBILITY}
      className={css.mainFormVisibility}
      defaultValue={isCrossTenant ? VISIBILITY_VALUES.PRIVATE : VISIBILITY_VALUES.SHARED}
      label={
        <span className={css.radioLabels}>
          {t('create-list.main.list-visibility')}
          <VisibilityTooltip />
        </span>
      }
    >
      <RadioButton
        inline
        value={VISIBILITY_VALUES.SHARED}
        disabled={isCrossTenant}
        name={FIELD_NAMES.VISIBILITY}
        label={t('create-list.main.list-shared')}
      />
      <RadioButton
        readOnly
        inline
        value={VISIBILITY_VALUES.PRIVATE}
        name={FIELD_NAMES.VISIBILITY}
        label={t('create-list.main.list-private')}
      />
      <Icon
        icon="bookmark"
        size="small"
        iconClassName="myClass"
      />
    </RadioButtonGroup>
  );
};
