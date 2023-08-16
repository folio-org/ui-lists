import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { CreateListLayout } from '../CreateListLayout';

describe('CreateListLayout', () => {
  test('Expected to call onClose function when user click on close button', async () => {
    const onCloseHandlerMock = jest.fn();

    const configuredComponent = <CreateListLayout
      onClose={onCloseHandlerMock}
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <h1>Main</h1>}
    />;

    render(configuredComponent);

    const closeButton = screen.getByRole('button', {
      name: /close button/i
    });

    await user.click(closeButton);

    expect(onCloseHandlerMock).toBeCalled();
  });

  test('Expected to render main content', () => {
    const configuredComponent = <CreateListLayout
      renderAsideContent={() => <section>Aside content</section>}
      renderMainContent={() => <span>Main content</span>}
    />;

    render(configuredComponent);

    const asideContent = screen.getByText(/aside content/i);

    expect(asideContent).toBeInTheDocument();
  });

  test('Expected to render aside content', () => {
    const configuredComponent = <CreateListLayout
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <section>Main content</section>}
    />;

    render(configuredComponent);

    const mainContent = screen.getByText(/main content/i);

    expect(mainContent).toBeInTheDocument();
  });

  test('Expected to render cancel button', async () => {
    const onCancelMock = jest.fn();
    const configuredComponent = <CreateListLayout
      onCancel={onCancelMock}
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <section>Main</section>}
    />;

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.cancel');

    await user.click(cancelButton);

    expect(onCancelMock).toBeCalled();
  });


  test('Expected to render save button', async () => {
    const onSaveMock = jest.fn();
    const configuredComponent = <CreateListLayout
      onSave={onSaveMock}
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <section>Main</section>}
    />;

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    await user.click(cancelButton);

    expect(onSaveMock).toBeCalled();
  });

  test('Expected to disable save button when isSaveButtonDisabled passed', async () => {
    const configuredComponent = <CreateListLayout
      isSaveButtonDisabled
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <section>Main</section>}
    />;

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    expect(cancelButton).toHaveProperty('disabled', true);
  });

  test('Expected to disable save button when isSavingInProgress is passed', async () => {
    const configuredComponent = <CreateListLayout
      isSavingInProgress
      renderAsideContent={() => <h1>Aside</h1>}
      renderMainContent={() => <section>Main</section>}
    />;

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    expect(cancelButton).toHaveProperty('disabled', true);
  });
});

