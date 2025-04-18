import React, { ChangeEvent, useState, FocusEvent } from 'react';
import { useIntl } from 'react-intl';
import { Layout,
  RadioButton,
  RadioButtonGroup,
  TextArea,
  TextField,
  Col,
  KeyValue,
  Row,
  Selection,
  InfoPopover } from '@folio/stripes/components';
import { FIELD_NAMES, STATUS_VALUES, VISIBILITY_VALUES } from './type';
import { EntityTypeSelectOption } from '../../interfaces';
import {
  MAX_SUPPORTED_DESCRIPTION_LENGTH,
  MAX_SUPPORTED_NAME_LENGTH
} from './constants';
import { t, tString } from '../../services';
import { VisibilityTooltip } from './VisibilityTooltip';
import { filterByIncludes } from '../../utils';
import { useIsEscEnvCheck } from '../../hooks';


import css from './MainListInfoForm.module.css';

type MainListInfoFormProps = {
    onValueChange?: (field: {[key: string]: string}) => void;
    listName: string,
    description: string,
    visibility: string,
    status: string,
    isLoading?: boolean,
    showInactiveWarning?: boolean,
    recordTypeOptions?: EntityTypeSelectOption[],
    recordTypeLabel?: string;
    isCrossTenant?: boolean;
}

export const MainListInfoForm = ({
  showInactiveWarning = false,
  onValueChange = () => {},
  listName,
  description,
  visibility,
  status,
  isLoading,
  recordTypeOptions,
  recordTypeLabel,
  isCrossTenant = false
}: MainListInfoFormProps) => {
  const intl = useIntl();

  const { isESC } = useIsEscEnvCheck();

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onValueChange({ [event.target.name]: event.target.value });
  };

  const onTrimOnBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onValueChange({ [event.target.name]: event.target.value.trim() });
  };
  const [isNameWasFocused, setIsNameWasFocused] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const shouldShowError = isNameWasFocused && !listName && !isLoading;
  const listNameError = shouldShowError ? t('form.field.empty-error') : '';

  const showInactiveRadioWarning = showInactiveWarning && isStatusChanged && status === STATUS_VALUES.INACTIVE;
  const activeRadioWarning = showInactiveRadioWarning ? t('warning.inactive-status') : '';

  const renderRecordType = () => {
    if (recordTypeLabel) {
      return (
        <Row>
          <Col xs={2}>
            <KeyValue
              label={t('list.info.record-type')}
              value={recordTypeLabel}
            />
          </Col>
        </Row>
      );
    }
  };

  const renderSelect = () => {
    if (recordTypeOptions?.length) {
      /**
       * Select component breaks in cases where amount of options changes after selection
       * even if they have selected property, so we duplicate selected value in value
       */

      const value = recordTypeOptions?.find(item => item.selected)?.value;

      return (
        <div
          key={recordTypeOptions.length}
          className={css.recordTypeField}
        >
          <Selection
            required
            value={value}
            onFilter={filterByIncludes}
            name={FIELD_NAMES.RECORD_TYPE}
            dataOptions={recordTypeOptions}
            placeholder={tString(intl, 'create-list.choose-record-type')}
            onChange={(selection: string) => {
              onValueChange({ [FIELD_NAMES.RECORD_TYPE]: selection });
            }}
            label={t('create-list.aside.record-types')}
          />
        </div>);
    }

    return null;
  };

  return (
    <>
      <TextField
        required
        autoFocus
        error={listNameError}
        value={listName}
        onChange={onChangeHandler}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          onTrimOnBlur(event);
          setIsNameWasFocused(true);
        }}
        name={FIELD_NAMES.LIST_NAME}
        maxLength={MAX_SUPPORTED_NAME_LENGTH}
        label={t('create-list.main.list-name')}
      />
      <TextArea
        value={description}
        onBlur={onTrimOnBlur}
        onChange={onChangeHandler}
        name={FIELD_NAMES.DESCRIPTION}
        maxLength={MAX_SUPPORTED_DESCRIPTION_LENGTH}
        label={t('create-list.main.list-description')}
      />
      {renderSelect()}
      {renderRecordType()}
      <Layout className="display-flex flex-align-items-start">
        <RadioButtonGroup
          readOnly={isCrossTenant}
          value={visibility}
          onChange={onChangeHandler}
          name={FIELD_NAMES.VISIBILITY}
          className={css.mainFormVisibility}
          defaultValue={isCrossTenant ? VISIBILITY_VALUES.PRIVATE : VISIBILITY_VALUES.SHARED}
          label={
            <span className={css.radioLabels}>
              {t('create-list.main.list-visibility')}
              <VisibilityTooltip isECS={isESC} />
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
            readOnly={isCrossTenant}
            inline
            value={VISIBILITY_VALUES.PRIVATE}
            name={FIELD_NAMES.VISIBILITY}
            label={t('create-list.main.list-private')}
          />
        </RadioButtonGroup>
        <RadioButtonGroup
          value={status}
          warning={activeRadioWarning}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setIsStatusChanged(true);
            onChangeHandler(event);
          }}
          name={FIELD_NAMES.STATUS}
          label={
            <span className={css.radioLabels}>
              {t('create-list.main.list-status')}
              <InfoPopover
                iconSize="medium"
                content={t('create-list.main.list-status.tooltip')}
              />
            </span>
            }
        >
          <RadioButton
            inline
            value={STATUS_VALUES.ACTIVE}
            name={FIELD_NAMES.STATUS}
            label={t('create-list.main.list-active')}
          />
          <RadioButton
            inline
            value={STATUS_VALUES.INACTIVE}
            name={FIELD_NAMES.STATUS}
            label={t('create-list.main.list-inactive')}
          />
        </RadioButtonGroup>
      </Layout>
    </>
  );
};
