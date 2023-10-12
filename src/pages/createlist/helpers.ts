import { EntityType, EntityTypeOption } from '../../interfaces';
import { t } from '../../services';

export const computeRecordTypeOptions = (entityTypes: EntityType[], selected = ''): EntityTypeOption[] => {
  const defaultPlaceholder = {
    label: t('create-list.choose-record-type'),
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
