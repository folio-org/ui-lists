import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import user from '@testing-library/user-event';

import { MemoryRouter } from 'react-router';
// @ts-ignore
import { runAxeTest } from "@folio/stripes-testing";

import { QueryClientProvider } from 'react-query';

import { queryClient } from "../test/utils";
import { HOME_PAGE_URL } from "./constants";
import {expect} from "@jest/globals";

import ListApp from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory:  jest.fn().mockReturnValue({
    push: jest.fn(),
    location: {
      search: ''
    }
  })
}));

const renderLists = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[HOME_PAGE_URL]}>
        <ListApp match={{path: ''}}/>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ListApp component', () => {
  describe('Render ListApp', () => {
    it('is expected to render list app', async () => {
      renderLists()

      const shortcutsButton = screen.getByTestId('shortcuts')

      await user.click(shortcutsButton)


      const modal = screen.getByText('KeyboardShortcutsModal')

      expect(modal).toBeTruthy();
    })
  })

  describe('AXE', () => {
    it('is expected to render without axe errors', async () => {
      await runAxeTest({
        rootNode: document.body,
      });
    })
  })
});