import React, {useState, FC, ChangeEvent, useEffect} from "react";
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

  useEffect(() => {
    if (focused) {
      return
    }

    const firstFilterButton = getStatusButtonElem()

    if (firstFilterButton) {
      firstFilterButton.focus();
      setFocused(true)
    }
  })

  return (
    <div id='mainFiltersWrapper'>
      <FilterGroups
        config={config}
        filters={filters}
        onChangeFilter={onChangeFilter}
        onClearFilter={onClearFilter}
      />
    </div>
  )
}
