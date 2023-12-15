import {
  FormStateType,
  CreateListFormatType
} from '../../../interfaces';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../../components/MainListInfoForm';

export const checkIsActive = (value: string) => {
  return value === STATUS_VALUES.ACTIVE;
};

export const checkIsPrivate = (value: string) => {
  return value === VISIBILITY_VALUES.PRIVATE;
};

export const prepareDataForRequest = (
  {
    description,
    listName,
    visibility,
    status,
    fqlQuery = '',
    recordType
  } : FormStateType & {fqlQuery?: string}
): CreateListFormatType => {
  const object: CreateListFormatType = {
    name: listName,
    description,
    fqlQuery,
    isActive: checkIsActive(status),
    isPrivate: checkIsPrivate(visibility)
  };

  if (recordType) {
    object.entityTypeId = recordType;
  }

  return object;
};
