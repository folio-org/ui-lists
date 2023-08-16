import { HTTPError } from 'ky';
import { t } from '../translation';


export const parseErrorPayload = (error: HTTPError): Promise<{[key: string]: string}> => {
  return error.response.json();
};


export const computeErrorMessage = async (error: HTTPError, fallbackKey: string, options: {[key: string]: string}) => {
  const { code } = await parseErrorPayload(error);

  return t(code || fallbackKey, options);
};
