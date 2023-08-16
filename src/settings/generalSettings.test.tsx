import React from 'react';
import { Router } from 'react-router-dom';
import {
  render,
  cleanup,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';

import '../../test/jest/__mock__';
import { GeneralSettings } from './generalSettings';
import { GetTranslateText } from '../../test/utils';

const label = GetTranslateText('ui-lists.settings.general.message');

const renderSettingsPage = () => {
  const history = createMemoryHistory();
  return render(
    <Router history={history}>
      <GeneralSettings label={label} />
    </Router>
  );
};

describe('General Settings Page', () => {
  let page: { container: HTMLElement };

  beforeEach(() => {
    page = renderSettingsPage();
  });

  afterEach(cleanup);

  it('should be rendered', () => {
    const { container } = page;
    const content = container.querySelector('[data-test-application-settings-general-message]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();
    expect(content?.innerHTML).toEqual(label);
  });
});
