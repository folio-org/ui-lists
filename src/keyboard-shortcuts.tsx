import { t } from './services';



const shortcutItem = (labelKey: string, shortcut: string) => {
  return {
    label: t(labelKey),
    shortcut
  }
};

export const commandsGeneral = [
  shortcutItem('commands-label.create', 'Option + n'),
  shortcutItem('commands-label.edit', 'cmd + Option + e'),
  shortcutItem('commands-label.save', 'cmd + s'),
  shortcutItem('commands-label.duplicate', 'Option + C'),
  shortcutItem('commands-label.toggle-lists-detail-accordion', 'spacebar'),
  shortcutItem('commands-label.expand-list-detail-accordions', 'cmd  + Option + b'),
  shortcutItem('commands-label.collapse-list-detail-accordions', 'cmd  + Option + g'),
  shortcutItem('commands-label.go-to-filter-pane', 'cmd + s'),
];