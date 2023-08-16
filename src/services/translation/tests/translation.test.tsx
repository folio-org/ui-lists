import { render, screen } from '@testing-library/react';
import { describe } from '@jest/globals';
import { t, UI_LISTS_NAMESPACE } from '../translation';

describe('Wrapper for translation', () => {
  it('is expected to return sting with prefix', () => {
    const translationKey = 'button-text';
    const translationKeyWithPrefix = `${UI_LISTS_NAMESPACE}.${translationKey}`;
    render(<button type="button">{t('button-text')}</button>);

    const button = screen.getByRole('button', {
      name: translationKeyWithPrefix
    });

    expect(button).toBeInTheDocument();
  });
  it('is expected to return key with prefix and values', () => {
    const translationKey = `button-text-${JSON.stringify({ count: 1 })}`;
    const translationKeyWithPrefixAndValues = `${UI_LISTS_NAMESPACE}.${translationKey}`;
    render(<button type="button">{t('button-text', { count: 1 })}</button>);

    const button = screen.getByRole('button', {
      name: translationKeyWithPrefixAndValues
    });

    expect(button).toBeInTheDocument();
  });
});
