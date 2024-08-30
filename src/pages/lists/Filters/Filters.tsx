import React, {useState, FC, ChangeEvent} from "react";
import { FilterGroups, FilterGroupsConfig } from "@folio/stripes/components";
import { getStatusButtonElem } from '../../../utils'

type FiltersProps = {
  config: FilterGroupsConfig,
  filters: {
    [key: string]: boolean
  },
  onChangeFilter: (e: ChangeEvent<HTMLInputElement>) => void,
  onClearFilter: (groupName: string) => void
}

export const Filters:FC<FiltersProps> = ({
   config,
   filters,
   onChangeFilter,
   onClearFilter
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div id='mainFiltersWrapper' ref={(e) => {
      if (focused) return;

        if(e) {
          getStatusButtonElem()?.focus();
          setFocused(true)
        }
    }}>
      <FilterGroups
        config={config}
        filters={filters}
        onChangeFilter={onChangeFilter}
        onClearFilter={onClearFilter}
      />
    </div>
  )
}
