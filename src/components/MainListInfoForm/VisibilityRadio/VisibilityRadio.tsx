import React, { ChangeEventHandler, FC } from 'react';
import { RadioButton, RadioButtonGroup, Icon } from '@folio/stripes/components';
import { FIELD_NAMES, VISIBILITY_VALUES } from '../type';

import css from '../MainListInfoForm.module.css';
import { t } from '../../../services';
import { VisibilityTooltip } from '../VisibilityTooltip';

type VisibilityRadioProps = {
  value: string,
  onChange: (changeEvent: ChangeEventHandler<HTMLInputElement>) => void,
  isCrossTenant?: boolean
}

export const VisibilityRadio: FC<VisibilityRadioProps> = ({
  value,
  onChange,
  isCrossTenant = false,
}) => {
  // @ts-ignore
  return (
    <RadioButtonGroup
      value={VISIBILITY_VALUES.PRIVATE}
      // @ts-ignore
      onChange={onChange}
      name={FIELD_NAMES.VISIBILITY}
      className={css.mainFormVisibility}
      defaultValue={VISIBILITY_VALUES.PRIVATE}
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
        // @ts-ignore
        selected
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
