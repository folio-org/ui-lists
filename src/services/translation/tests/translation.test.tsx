import { describe } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { createIntl } from 'react-intl';
import { UI_LISTS_NAMESPACE, t, tString } from '../translation';

describe('Wrapper for translation', () => {
  it('is expected to return (JSX) key with prefix', () => {
    const translationKey = 'button-text';
    const translationKeyWithPrefix = `${UI_LISTS_NAMESPACE}.${translationKey}`;
    render(<button type="button">{t('button-text')}</button>);

    const button = screen.getByRole('button', {
      name: translationKeyWithPrefix
    });

    expect(button).toBeInTheDocument();
  });
  it('is expected to return (JSX) key with prefix and values', () => {
    const translationKey = `button-text-${JSON.stringify({ count: 1 })}`;
    const translationKeyWithPrefixAndValues = `${UI_LISTS_NAMESPACE}.${translationKey}`;
    render(<button type="button">{t('button-text', { count: 1 })}</button>);

    const button = screen.getByRole('button', {
      name: translationKeyWithPrefixAndValues
    });

    expect(button).toBeInTheDocument();
  });
  it('is expected to return (string) key with prefix', () => {
    const translationKey = 'test';
    const intl = createIntl({
      locale: 'en',
      messages: {
        'ui-lists.test': 'translated value',
      },
    });

    expect(tString(intl, translationKey)).toEqual('translated value');
  });
  it('is expected to return (string) key with prefix and values', () => {
    const translationKey = 'test';
    const intl = createIntl({
      locale: 'en',
      messages: {
        'ui-lists.test': 'count={count}',
      },
    });

    expect(tString(intl, translationKey, { count: 1 })).toEqual('count=1');
  });
});
