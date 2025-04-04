import { t } from './services';


export enum SHORTCUTS_NAMES {
  SEARCH = 'search',
  NEW = 'new',
  EDIT = 'edit',
  SAVE = 'save',
  DUPLICATE_RECORD = 'duplicateRecord',
  EXPAND_OR_COLLAPSE = 'expandOrCollapseAccordion',
  EXPAND_ALL_SECTIONS = 'expandAllSections',
  COLLAPSE_ALL_SECTIONS = 'collapseAllSections',
  GO_TO_FILTER = 'goToFilter',
  OPEN_MODAL = 'openShortcutModal'
}


const shortcutItem = (labelKey: string, name: string, shortcut: string) => {
  return {
    label: t(labelKey),
    name,
    shortcut
  };
};

export const commandsGeneral = [
  shortcutItem('commands-label.create', SHORTCUTS_NAMES.NEW, 'alt + n'),
  shortcutItem('commands-label.edit', SHORTCUTS_NAMES.EDIT, 'mod + alt + e'),
  shortcutItem('commands-label.save', SHORTCUTS_NAMES.SAVE, 'mod + s'),
  shortcutItem('commands-label.duplicate', SHORTCUTS_NAMES.DUPLICATE_RECORD, 'alt + c'),
  shortcutItem('commands-label.toggle-lists-detail-accordion', SHORTCUTS_NAMES.EXPAND_OR_COLLAPSE, 'spacebar'),
  shortcutItem('commands-label.expand-list-detail-accordions', SHORTCUTS_NAMES.EXPAND_ALL_SECTIONS, 'mod + alt + b'),
  shortcutItem('commands-label.collapse-list-detail-accordions', SHORTCUTS_NAMES.COLLAPSE_ALL_SECTIONS, 'mod + alt + g'),
  shortcutItem('commands-label.go-to-filter-pane', SHORTCUTS_NAMES.GO_TO_FILTER, 'mod + alt + h'),
  shortcutItem('commands-label.open-shortcuts-modal', SHORTCUTS_NAMES.OPEN_MODAL, 'mod + alt + k'),
];

export const AddCommand = {
  create: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.NEW,
    handler
  }),
  edit: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.EDIT,
    handler
  }),
  save: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.SAVE,
    handler
  }),
  duplicate: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.DUPLICATE_RECORD,
    handler
  }),
  expandSections: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.EXPAND_ALL_SECTIONS,
    handler
  }),
  collapseSections: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.COLLAPSE_ALL_SECTIONS,
    handler
  }),
  goToFilter: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.GO_TO_FILTER,
    handler
  }),
  openModal: (handler: (event: KeyboardEvent) => void) => ({
    name: SHORTCUTS_NAMES.OPEN_MODAL,
    handler
  })
};
