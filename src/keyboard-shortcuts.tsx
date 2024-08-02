import { t } from './services';



const shortcutItem = (labelKey: string, shortcut: string) => {
  return {
    label: t(labelKey),
    shortcut
  }
};

export const commandsGeneral = [
  shortcutItem('commands-label.create', 'Alt + n'),
  shortcutItem('commands-label.edit', 'Mod + Alt + e'),
  shortcutItem('commands-label.save', 'Mod + s'),
  shortcutItem('commands-label.duplicate', 'Alt + C'),
  shortcutItem('commands-label.toggle-lists-detail-accordion', 'spacebar'),
  shortcutItem('commands-label.expand-list-detail-accordions', 'Mod + Alt + b'),
  shortcutItem('commands-label.collapse-list-detail-accordions', 'Mod + Alt + g'),
  shortcutItem('commands-label.go-to-filter-pane', 'Mod + Alt + h'),
  shortcutItem('commands-label.open-shortcuts-modal', 'Mod + Alt + k'),
];
