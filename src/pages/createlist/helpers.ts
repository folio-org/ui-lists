import { EntityTypeOption, EntityTypeSelectOption } from '../../interfaces';
import { t } from '../../services';

export const computeRecordTypeOptions = (
  entityTypes: EntityTypeOption[],
  selected = '',
): EntityTypeSelectOption[] => {
  const defaultPlaceholder = {
    label: t('create-list.choose-record-type'),
    selected: false,
    value: '',
  };

  let options = entityTypes
    .toSorted((a, b) => a.label.localeCompare(b.label))
    .map(({ id, label }) => ({
      label,
      value: id,
      selected: id === selected,
    })) as EntityTypeSelectOption[];

  if (!selected) {
    options = [defaultPlaceholder, ...options];
  }

  return options;
};
