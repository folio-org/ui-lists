import { ICONS } from '../../interfaces';

export interface ActionButton {
    label: string
    icon: ICONS
    onClick: () => void
    disabled: boolean
}
