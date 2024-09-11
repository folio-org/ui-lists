import { useStripes } from '@folio/stripes/core';
import {USER_PERMS} from "../../utils";



export const useListAppPermissions = () => {
  const stripes = useStripes();

  const canRefresh = stripes.hasPerm(USER_PERMS.RefreshList);
  const canUpdate = stripes.hasPerm(USER_PERMS.UpdateList);
  const canDelete = stripes.hasPerm(USER_PERMS.DeleteList);
  const canExport = stripes.hasPerm(USER_PERMS.ExportList);
  const canCreate = stripes.hasPerm(USER_PERMS.CreateList);

  return {
    canRefresh,
    canUpdate,
    canDelete,
    canExport,
    canCreate
  }
}