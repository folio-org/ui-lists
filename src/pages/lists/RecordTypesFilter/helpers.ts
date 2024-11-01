import { EntityTypeSelectOption } from '../../../interfaces';
import { filterByIncludes } from '../../../utils';

export const filterEntityTypes = (term: string, options: EntityTypeSelectOption[]) => {
  return {
    renderedItems: filterByIncludes(term, options)
  };
};
