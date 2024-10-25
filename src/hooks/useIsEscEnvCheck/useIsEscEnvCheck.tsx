import { useStripes } from '@folio/stripes/core';


export const useIsEscEnvCheck = () => {
  const stripes = useStripes();

  return {
    // @ts-ignore
    isESC: Boolean(stripes?.user?.user?.consortium)
  };
};
