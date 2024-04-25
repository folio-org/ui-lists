import { EntityTypeOption, EntityTypeSelectOption } from '../../interfaces';

export const computeRecordTypeOptions = (
  entityTypes: EntityTypeOption[],
  selected = '',
): EntityTypeSelectOption[] => {
  let options = entityTypes
    .map(({ id, label }) => ({
      label,
      value: id,
      selected: id === selected,
    })) as EntityTypeSelectOption[];

  // EntityTypeSelectOption has label as ReactNode, but we just created it above
  // where all these labels are string only, so we can safely coerce to string
  options.sort((a, b) => (a.label as string).localeCompare(b.label as string));

  return options;
};
