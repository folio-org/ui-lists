import { ListsRecordDetails } from '../../interfaces';

export const isInactive = (list?: ListsRecordDetails) => !list?.isActive;

export const isInDraft = (list?: ListsRecordDetails) => !list?.fqlQuery;

export const isCanned = (list?: ListsRecordDetails) => Boolean(list?.isCanned);
