import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useLocale } from '../i18n/useLocale';
import { LocaleProvider } from '../i18n/LocaleContext';

describe('useLocale', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  const enTranslations = { greeting: 'Hello' };

  beforeEach(() => {
    localStorage.clear();
    fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(enTranslations),
      }),
    );
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when used outside LocaleProvider', () => {
    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useLocale());
    }).toThrow('useLocale must be used within a LocaleProvider');

    consoleSpy.mockRestore();
  });

  it('returns context value when used inside LocaleProvider', async () => {
    function TestComponent() {
      const { locale, t } = useLocale();
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="translated">{t('greeting')}</span>
        </div>
      );
    }

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    await waitFor(() => {
      expect(screen.getByTestId('translated')).toHaveTextContent('Hello');
    });
  });
});
