import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { MemoryRouter } from 'react-router';
// @ts-ignore
import {runAxeTest} from "@folio/stripes-testing";

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
    it('is expected to render list app', () => {
      renderLists()

      const shortcuts = screen.getByTestId('shortcuts')

      expect(shortcuts).toBeTruthy();
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