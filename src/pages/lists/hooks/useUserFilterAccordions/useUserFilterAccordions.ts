import { useState } from 'react';
import { useNamespace } from '@folio/stripes/core';
import { useSessionStorage } from '../../../../hooks';

type AccordionsState = { createdBy: boolean, updatedBy: boolean };

const CLOSED: AccordionsState = { createdBy: false, updatedBy: false };

// Mirrors filters/search/sort (useRestoreListsView): persisted so the accordions only
// collapse on an explicit Reset all, not on every remount caused by navigating to
// New/Edit/Copy and back. Kept separate from useRestoreListsView, which is specifically
// about restoring URL params - this is plain UI state that must never go in the URL.
export const useUserFilterAccordions = () => {
  const [namespace] = useNamespace();
  const { getItem, setItem } = useSessionStorage<AccordionsState>(`${namespace}/userFilterAccordions`);
  const [state, setState] = useState<AccordionsState>(() => getItem() ?? CLOSED);

  const toggle = (key: keyof AccordionsState) => () => {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };

      setItem(next);

      return next;
    });
  };

  const resetToClosed = () => {
    setState(CLOSED);
    setItem(CLOSED);
  };

  return {
    isCreatedByOpen: state.createdBy,
    isUpdatedByOpen: state.updatedBy,
    toggleCreatedBy: toggle('createdBy'),
    toggleUpdatedBy: toggle('updatedBy'),
    resetToClosed
  };
};
