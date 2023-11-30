export type FilterConfigType = {
  label: string,
  name: string,
  values: string[] | {name: string, displayName: string}[]
}[];


export type FilterOptionType = {
  label: string,
  name: string,
  values: string[] | {name: string, displayName: string}[]
}

export type AppliedFiltersType = {
  [key: string | number]: FilterOptionType | boolean
}
