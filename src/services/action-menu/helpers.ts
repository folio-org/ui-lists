import { DisablingConditions } from './types';

export const isRefreshDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isRefreshInProgress,
    isListInactive,
    isListInDraft,
    isExportInProgress
  } = conditions;

  return [isRefreshInProgress,
    isListInactive,
    isListInDraft,
    isExportInProgress].some(value => value);
};

export const isCancelRefreshDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isCancelRefreshInProgress
  } = conditions;

  return Boolean(isCancelRefreshInProgress);
};

export const isEditDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isRefreshInProgress,
    isListCanned,
    isExportInProgress
  } = conditions;

  return [isRefreshInProgress,
    isListCanned,
    isExportInProgress].some(value => value);
};

export const isDeleteDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isDeleteInProgress,
    isRefreshInProgress,
    isListCanned,
    isExportInProgress
  } = conditions;

  return [isDeleteInProgress,
    isRefreshInProgress,
    isListCanned,
    isExportInProgress].some(value => value);
};

export const isExportDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isRefreshInProgress,
    isDeleteInProgress,
    isExportInProgress,
    isListInDraft,
    isListInactive,
    isListEmpty
  } = conditions;

  return [isRefreshInProgress,
    isDeleteInProgress,
    isExportInProgress,
    isListInDraft,
    isListEmpty,
    isListInactive].some(value => value);
};

export const isCancelExportDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isCancelExportInProgress
  } = conditions;

  return Boolean(isCancelExportInProgress);
};
