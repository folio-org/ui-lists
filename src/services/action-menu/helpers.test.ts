import { isRefreshDisabled,
  isCancelRefreshDisabled,
  isEditDisabled,
  isDeleteDisabled,
  isExportDisabled,
  isCancelExportDisabled } from './helpers';

describe('helpers', () => {
  describe('isCancelRefreshDisabled', () => {
    it('is expected to return true if isCancelRefreshInProgress true', () => {
      expect(isCancelRefreshDisabled({ isCancelRefreshInProgress: true })).toEqual(true);
    });
    it('is expected to return false if isCancelRefreshInProgress false', () => {
      expect(isCancelRefreshDisabled({ isCancelRefreshInProgress: false })).toEqual(false);
    });
  });

  describe('isCancelExportDisabled', () => {
    it('is expected to return true if isCancelExportInProgress true', () => {
      expect(isCancelExportDisabled({ isCancelExportInProgress: true })).toEqual(true);
    });
    it('is expected to return false if isCancelExportInProgress false', () => {
      expect(isCancelExportDisabled({ isCancelExportInProgress: false })).toEqual(false);
    });
  });

  describe('isRefreshDisabled', () => {
    it.each`
  refreshing | inactive | inDraft  | exporting   | expected
  ${true}    | ${false} | ${false} | ${false}    | ${true}
  ${false}   | ${true}  | ${false} | ${false}    | ${true}
  ${false}   | ${false} | ${true}  | ${false}    | ${true}
  ${false}   | ${false} | ${false} | ${true}     | ${true}
  ${false}   | ${false} | ${false} | ${false}    | ${false}
`('returns $expected when one of conditions $expected', async (
      { refreshing,
        inactive,
        inDraft,
        exporting,
        expected }
    ) => {
      expect(isRefreshDisabled(
        { isRefreshInProgress: refreshing,
          isListInactive: inactive,
          isListInDraft: inDraft,
          isExportInProgress: exporting }
      )).toBe(expected);
    });
  });

  describe('isEditDisabled', () => {
    it.each`
  isRefreshInProgress | isListCanned   | isExportInProgress   | expected
  ${true}             | ${false}       | ${false}             | ${true}
  ${false}            | ${true}        | ${false}             | ${true}
  ${false}            | ${false}       | ${true}              | ${true}
  ${false}            | ${false}       | ${false}             | ${false}
`('returns $expected when one of conditions $expected', async (
      { isRefreshInProgress,
        isListCanned,
        isExportInProgress,
        expected }
    ) => {
      expect(isEditDisabled(
        { isRefreshInProgress,
          isListCanned,
          isExportInProgress }
      )).toBe(expected);
    });
  });

  describe('isDeleteDisabled', () => {
    it.each`
  deleting | refreshing   | canned   | exporting | expected
  ${true}  | ${false}     | ${false} | ${false}  | ${true}
  ${false} | ${true}      | ${false} | ${false}  | ${true}
  ${false} | ${false}     | ${true}  | ${false}  | ${true}
  ${false} | ${false}     | ${false} | ${true}   | ${true}
  ${false} | ${false}     | ${false} | ${false}  | ${false}
`('returns $expected when one of conditions $expected', async (
      { deleting,
        refreshing,
        canned,
        exporting,
        expected }
    ) => {
      expect(isDeleteDisabled({ isDeleteInProgress: deleting,
        isRefreshInProgress: refreshing,
        isListCanned: canned,
        isExportInProgress: exporting })).toBe(expected);
    });
  });

  describe('isExportDisabled', () => {
    it.each`
  deleting | refreshing | inDraft  | inactive | exporting | expected
  ${true}  | ${false}   | ${false} | ${false} | ${false}  | ${true}
  ${false} | ${true}    | ${false} | ${false} | ${false}  | ${true}
  ${false} | ${false}   | ${true}  | ${false} | ${false}  | ${true}
  ${false} | ${false}   | ${false} | ${true}  | ${false}  | ${true}
  ${false} | ${false}   | ${false} | ${false} | ${true}   | ${true}
  ${false} | ${false}   | ${false} | ${false} | ${false}  | ${false}
`('returns $expected when one of conditions $expected', async (
      { deleting,
        refreshing,
        inDraft,
        inactive,
        exporting,
        expected }
    ) => {
      expect(isExportDisabled({
        isRefreshInProgress: refreshing,
        isDeleteInProgress: deleting,
        isExportInProgress: exporting,
        isListInDraft: inDraft,
        isListInactive: inactive
      })).toBe(expected);
    });
  });
});
