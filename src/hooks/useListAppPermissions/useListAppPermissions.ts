import { useStripes } from '@folio/stripes/core';
import { USER_PERMS } from '../../utils';

export function useListAppPermissions() {
  const stripes = useStripes();

  return {
    canRefresh: stripes.hasPerm(USER_PERMS.RefreshList),
    canUpdate: stripes.hasPerm(USER_PERMS.UpdateList),
    canDelete: stripes.hasPerm(USER_PERMS.DeleteList),
    canExport: stripes.hasPerm(USER_PERMS.ExportList),
    canCreate: stripes.hasPerm(USER_PERMS.CreateList),
  };
}
