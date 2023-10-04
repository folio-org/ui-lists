import { ICONS } from '../../interfaces';

export type DisablingConditions = {
  isRefreshInProgress?: boolean,
  isCancelRefreshInProgress?: boolean,
  isCancelExportInProgress?: boolean,
  isDeleteInProgress?: boolean,
  isExportInProgress?: boolean,
  isListInactive?: boolean,
  isListInDraft?: boolean,
  isListCanned?: boolean,
  isListEmpty?: boolean
};


export interface ActionButton {
  label: string
  icon: ICONS
  onClick: () => void
  disabled: boolean
}
