import { useStripes } from '@folio/stripes/core';
import { useListAppPermissions } from './useListAppPermissions';

const useStripesMock = useStripes as unknown as jest.Mock<typeof useStripes>;

it('returns proper results', () => {
  useStripesMock.mockImplementation(
    () => ({ hasPerm: (p: string) => p }) as any,
  );

  expect(useListAppPermissions()).toEqual({
    canRefresh: 'lists.item.post',
    canUpdate: 'lists.item.update',
    canDelete: 'lists.item.delete',
    canExport: 'lists.item.export.get',
    canCreate: 'lists.collection.post',
  });
});
