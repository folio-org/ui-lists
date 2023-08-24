import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { ListAppIcon } from './ListAppIcon';

describe('ListAppIcon', () => {
  beforeEach(() => {
    render(<ListAppIcon />);
  });

  it('expected to renders the ListAppIcon component', () => {
    const icon = screen.getByTestId('app-icon');

    expect(icon).toBeInTheDocument();
  });

  it('expected to pass correct app name for the app icon', () => {
    const icon = screen.getByTestId('app-icon');

    expect(icon).toContainHTML('@folio/lists');
  });

  it('expected to pass correct iconKey for the app icon', () => {
    const icon = screen.getByTestId('app-icon');

    expect(icon).toContainHTML('app');
  });

  it('expected to has the correct icon size', () => {
    const icon = screen.getByTestId('app-icon');

    expect(icon).toContainHTML('small');
  });
});
