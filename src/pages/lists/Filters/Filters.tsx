import React, {useState, FC, ChangeEvent} from "react";
import { getStatusButtonElem } from "../../../utils";
import {FilterGroups, FilterGroupsConfig} from "@folio/stripes/components";

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
    <div ref={() => {
      if (focused) return;

      const el = getStatusButtonElem();

      if(el) {
        el.focus()
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
