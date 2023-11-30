export type FilterOptionType = {
  label: string,
  name: string,
  values: string[] | {name: string, displayName: string}[]
}

export type FilterConfigType = FilterOptionType[];

export type AppliedFiltersType = {
  [key: string | number]: FilterOptionType | boolean
}
