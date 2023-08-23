import { DisablingConditions } from './types';

export const isRefreshDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isRefreshInProgress,
    isListInactive,
    isListInDraft,
    isExportInProgress
  } = conditions;

  return Boolean(
    isRefreshInProgress ??
    isListInactive ??
    isListInDraft ??
    isExportInProgress
  );
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

  return Boolean(
    isRefreshInProgress ??
    isListCanned ??
    isExportInProgress
  );
};

export const isDeleteDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isDeleteInProgress,
    isRefreshInProgress,
    isListCanned,
    isExportInProgress
  } = conditions;

  return Boolean(
    isDeleteInProgress ??
    isRefreshInProgress ??
    isListCanned ??
    isExportInProgress
  );
};

export const isExportDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isRefreshInProgress,
    isDeleteInProgress,
    isExportInProgress,
    isListInDraft,
    isListInactive
  } = conditions;

  return Boolean(
    isRefreshInProgress ??
    isDeleteInProgress ??
    isListInDraft ??
    isExportInProgress ??
    isListInactive
  );
};

export const isCancelExportDisabled = (conditions: DisablingConditions): boolean => {
  const {
    isCancelExportInProgress
  } = conditions;

  return Boolean(isCancelExportInProgress);
};
