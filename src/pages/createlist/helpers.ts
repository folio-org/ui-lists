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
    .map(({ id, label }) => ({
      label,
      value: id,
      selected: id === selected,
    })) as EntityTypeSelectOption[];

  // EntityTypeSelectOption has label as ReactNode, but we just created it above
  // where all these labels are string only, so we can safely coerce to string
  options.sort((a, b) => (a.label as string).localeCompare(b.label as string));

  if (!selected) {
    options = [defaultPlaceholder, ...options];
  }

  return options;
};
