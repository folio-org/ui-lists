import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { CompilingLoader } from './CompilingLoader';

describe('CompilingLoader', () => {
  it('expected to renders the CompilingLoader component', () => {
    render(<CompilingLoader />);

    const loader = screen.getByText('ui-lists.lists.item.compiling');

    expect(loader).toBeInTheDocument();
  });
});
