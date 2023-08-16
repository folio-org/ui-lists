import { POLLING_STATUS } from '../../interfaces';

export const isSuccess = (status: POLLING_STATUS) => {
  return status === POLLING_STATUS.SUCCESS;
};

export const isFailed = (status: POLLING_STATUS) => {
  return status === POLLING_STATUS.FAILED;
};

export const isCancelled = (status: POLLING_STATUS) => {
  return status === POLLING_STATUS.CANCELLED;
};
