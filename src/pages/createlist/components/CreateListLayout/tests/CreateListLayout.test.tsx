import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { jest } from '@jest/globals';
import React from 'react';
import { CreateListLayout } from '../CreateListLayout';

const onCancelMock = jest.fn();
const keepEditHandlerMock = jest.fn();
const setShowConfirmCancelEditModalMock = jest.fn();
const continueNavigationMock = jest.fn();

describe('CreateListLayout', () => {
  test('Expected to call onClose function when user click on close button', async () => {
    const onCloseHandlerMock = jest.fn();

    const configuredComponent = (
      <CreateListLayout
        onClose={onCloseHandlerMock}
        onCancel={onCancelMock}
        keepEditHandler={keepEditHandlerMock}
        showConfirmCancelEditModal={false}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
      >
        <h1>Main</h1>
      </CreateListLayout>
    );

    render(configuredComponent);

    const closeButton = screen.getByRole('button', {
      name: /close button/i
    });

    await user.click(closeButton);

    expect(onCloseHandlerMock).toBeCalled();
  });

  test('Expected to render main content', () => {
    const configuredComponent = (
      <CreateListLayout
        onCancel={onCancelMock}
        keepEditHandler={keepEditHandlerMock}
        showConfirmCancelEditModal={false}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
      >
        <span>Main content</span>
      </CreateListLayout>
    );

    render(configuredComponent);

    const asideContent = screen.getByText(/Main content/i);

    expect(asideContent).toBeInTheDocument();
  });

  test('Expected to render cancel button', async () => {
    const configuredComponent = (
      <CreateListLayout
        onCancel={onCancelMock}
        keepEditHandler={keepEditHandlerMock}
        showConfirmCancelEditModal={false}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
      >
        <section>Main</section>
      </CreateListLayout>
    );

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.cancel');

    await user.click(cancelButton);

    expect(onCancelMock).toBeCalled();
  });


  test('Expected to render save button', async () => {
    const onSaveMock = jest.fn();
    const configuredComponent = (
      <CreateListLayout
        onSave={onSaveMock}
        showConfirmCancelEditModal={false}
        onCancel={onCancelMock}
        keepEditHandler={keepEditHandlerMock}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
      >
        <section>Main</section>
      </CreateListLayout>
    );

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    await user.click(cancelButton);

    expect(onSaveMock).toBeCalled();
  });

  test('Expected to disable save button when isSaveButtonDisabled passed', async () => {
    const configuredComponent = (
      <CreateListLayout
        onCancel={onCancelMock}
        showConfirmCancelEditModal={false}
        keepEditHandler={keepEditHandlerMock}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
        isSaveButtonDisabled
      >
        <section>Main</section>
      </CreateListLayout>
    );

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    expect(cancelButton).toHaveProperty('disabled', true);
  });

  test('Expected to disable save button when isSavingInProgress is passed', async () => {
    const configuredComponent = (
      <CreateListLayout
        isSavingInProgress
        showConfirmCancelEditModal={false}
        onCancel={onCancelMock}
        keepEditHandler={keepEditHandlerMock}
        setShowConfirmCancelEditModal={setShowConfirmCancelEditModalMock}
        continueNavigation={continueNavigationMock}
      >
        <section>Main</section>
      </CreateListLayout>
    );

    render(configuredComponent);

    const cancelButton = screen.getByText('ui-lists.button.save');

    expect(cancelButton).toHaveProperty('disabled', true);
  });
});

