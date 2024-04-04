import type { HTTPError } from 'ky';
import { parseErrorPayload } from './error-message-extractor';

describe('Error message extractor', () => {
  it.each([null, undefined, {}, { response: null }])(
    'resolves missing HTTPError %s to undefined',
    async (error) => expect(await parseErrorPayload(error as unknown as HTTPError)).toBeUndefined(),
  );

  it('handles properly-formed HTTPError correctly', async () => {
    expect(
      await parseErrorPayload({
        response: { json: () => Promise.resolve({ code: 'code' }) },
      } as HTTPError),
    ).toEqual({ code: 'code' });
  });
});
