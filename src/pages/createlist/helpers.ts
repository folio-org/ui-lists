import { EntityType, EntityTypeOption } from '../../interfaces';
import { t } from '../../services';

export const computeRecordTypeOptions = (entityTypes: EntityType[], selected: string): EntityTypeOption[] => {
  const defaultPlaceholder = {
    label: t('list.edit.entity-type-default'),
    selected: false,
    value: '',
  };

  let options = entityTypes.map(({ id, label }) => ({
    label,
    value: id,
    selected: id === selected
  })) as EntityTypeOption[];

  if (!selected) {
    options = [defaultPlaceholder, ...options];
  }

  return options;
};
