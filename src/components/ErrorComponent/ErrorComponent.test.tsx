import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { HTTPError } from 'ky';
import { ErrorComponent } from './ErrorComponent';

describe('ErrorComponent', () => {
  it.each([undefined, null])('renders nothing when no error is present (%s)', (error) => {
    const { container } = render(<ErrorComponent error={error as unknown as HTTPError} />);

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    {},
    { response: null },
    { response: { json: () => Promise.resolve(null) } },
    { response: { json: () => Promise.resolve('foo') } },
    { response: { json: () => Promise.resolve({}) } },
    { response: { json: () => Promise.resolve({ notAnError: [] }) } },
  ])('handles improperly-formed HTTPError %s gracefully', async (error) => {
    render(<ErrorComponent error={error as HTTPError} />);

    await waitFor(() => expect(screen.queryByText('ui-lists.error-component.unknown')).toBeVisible());
  });

  it('handles properly-formed HTTPError gracefully', async () => {
    render(
      <ErrorComponent
        error={{ response: { json: () => Promise.resolve({ code: 'code' }) } } as HTTPError}
      />,
    );

    await waitFor(() => expect(screen.queryByText('ui-lists.error-component.code')).toBeVisible());
  });
});
