import { getErrorTranslations } from './CatastrophicErrorPage';

describe('CatastrophicErrorPage translation calculations', () => {
  it('returns missing-all-entity-type-permissions when no error is provided', () => {
    const { headingKey, messageKey } = getErrorTranslations(null, {});
    expect(headingKey).toBe('ui-lists.catastrophic-error.missing-all-entity-type-permissions.heading');
    expect(messageKey).toBe('ui-lists.catastrophic-error.fallback.message');
  });

  it('falls back to generic keys when specific ones are not found', () => {
    const error = { message: '', code: '_misc_error' } as const;
    const { headingKey, messageKey } = getErrorTranslations(error, {});
    expect(headingKey).toBe('ui-lists.catastrophic-error.fallback.heading');
    expect(messageKey).toBe('ui-lists.catastrophic-error.fallback.message');
  });

  it('returns specific heading and message keys when they exist', () => {
    const error = { message: '', code: '_misc_error' } as const;
    const messages = {
      'ui-lists.catastrophic-error._misc_error.heading': 'Some heading',
      'ui-lists.catastrophic-error._misc_error.message': 'Some message',
    };
    const { headingKey, messageKey } = getErrorTranslations(error, messages);
    expect(headingKey).toBe('ui-lists.catastrophic-error._misc_error.heading');
    expect(messageKey).toBe('ui-lists.catastrophic-error._misc_error.message');
  });

  it('falls back to error-component and code keys for message if specific one is not found', () => {
    const error = { message: '', code: '_misc_error' } as const;
    const messages = {
      'ui-lists.catastrophic-error._misc_error.message': 'Some message',
      'ui-lists.error-component._misc_error': 'Error component message',
      'ui-lists._misc_error': 'Generic error message',
    };
    const { headingKey, messageKey } = getErrorTranslations(error, messages);
    expect(headingKey).toBe('ui-lists.error-component._misc_error');
    expect(messageKey).toBe('ui-lists.catastrophic-error._misc_error.message');
  });

  it('computes values from error parameters', () => {
    const error = {
      message: '',
      code: '_misc_error',
      parameters: [
        { key: 'param1', value: 'value1' },
        { key: 'param2', value: 'value2' },
      ],
    } as const;
    const { values } = getErrorTranslations(error, {});
    expect(values).toEqual({
      param1: 'value1',
      param2: 'value2',
    });
  });
});
