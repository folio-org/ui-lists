import { t } from './services';



const shortcutItem = (labelKey: string, shortcut: string) => {
  return {
    label: t(labelKey),
    shortcut
  }
};

export const commandsGeneral = [
  shortcutItem('commands-label.create', 'Option + n'),
  shortcutItem('commands-label.edit', 'Cmd + Option + e'),
  shortcutItem('commands-label.save', 'Cmd + s'),
  shortcutItem('commands-label.duplicate', 'Option + C'),
  shortcutItem('commands-label.toggle-lists-detail-accordion', 'spacebar'),
  shortcutItem('commands-label.expand-list-detail-accordions', 'Cmd  + Option + b'),
  shortcutItem('commands-label.collapse-list-detail-accordions', 'Cmd  + Option + g'),
  shortcutItem('commands-label.go-to-filter-pane', 'Cmd + s'),
];
