import React, { FC, useState } from 'react';
// @ts-ignore:next-line
import { AccordionSet, Accordion, TextLink } from '@folio/stripes/components';
import { t } from '../../../../services';
import { EntityTypeSelectOption } from '../../../../interfaces';
import { ChangedFieldType, STATUS, VISIBILITY } from '../../types';
import { MainListInfoForm, ConfigureQuery } from '../../../../components';

import css from './MainCreateListForm.module.css';


type MainCreateListFormProps = {
  onValueChange?: (field: ChangedFieldType) => void;
  listNameField: string,
  descriptionField: string,
  visibilityField: VISIBILITY,
  statusField: STATUS,
  isQueryButtonDisabled?: boolean,
  recordTypesOptions: EntityTypeSelectOption[],
  selectedType?: string
}

export const MainCreateListForm:FC<MainCreateListFormProps> = (
  { onValueChange = () => {},
    listNameField,
    descriptionField,
    visibilityField,
    statusField,
    selectedType = '',
    recordTypesOptions,
    isQueryButtonDisabled }
) => {
  const [isOpened, setIsOpened] = useState(true);
  const onToggleHandler = () => {
    setIsOpened((prevValue) => !prevValue);
  };

  const renderCollapseButton = () => {
    return (
      <TextLink onClick={onToggleHandler}>
        {isOpened ?
          (
            t('create-list.main.collapse-all')
          )
          :
          (
            t('create-list.main.expand-all')
          )
        }
      </TextLink>);
  };

  return (
    <div>
      <div className={css.mainFormCollapseButton}>
        {renderCollapseButton()}
      </div>
      <AccordionSet>
        <Accordion
          label={t('create-list.main.list-information')}
          open={isOpened}
          onToggle={onToggleHandler}
        >
          <MainListInfoForm
            onValueChange={onValueChange}
            recordTypeOptions={recordTypesOptions}
            listName={listNameField}
            description={descriptionField}
            visibility={visibilityField}
            status={statusField}
          />
        </Accordion>
      </AccordionSet>
      <div className={css.queryBuilderButton}>
        <ConfigureQuery
          selectedType={selectedType}
          isQueryButtonDisabled={isQueryButtonDisabled}
          listName={listNameField}
          status={statusField}
          visibility={visibilityField}
          description={descriptionField}
        />
      </div>
    </div>
  );
};
