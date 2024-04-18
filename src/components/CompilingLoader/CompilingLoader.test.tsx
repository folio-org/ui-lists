import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';

import { CompilingLoader } from './CompilingLoader';

describe('CompilingLoader', () => {
  it('expected to renders the CompilingLoader component', () => {
    render(<CompilingLoader />);

    const loader = screen.getByText('ui-lists.lists.item.compiling');

    expect(loader).toBeInTheDocument();
  });

  it('should render with no axe errors', async () => {
    render(<CompilingLoader />);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
