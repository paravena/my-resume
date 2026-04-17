import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { useContext } from 'react';
import { LocaleContext, LocaleProvider } from '../i18n/LocaleContext';
import { LOCALE_STORAGE_KEY } from '../i18n/types';

// Helper component that consumes the context
function TestConsumer() {
  const ctx = useContext(LocaleContext);
  if (!ctx) return <div>No context</div>;
  return (
    <div>
      <span data-testid="locale">{ctx.locale}</span>
      <span data-testid="loading">{String(ctx.isLoading)}</span>
      <span data-testid="translated">{ctx.t('greeting')}</span>
      <span data-testid="missing">{ctx.t('missing.key')}</span>
      <button onClick={() => ctx.setLocale('es')}>Switch to ES</button>
      <button onClick={() => ctx.setLocale('en')}>Switch to EN</button>
    </div>
  );
}

describe('LocaleProvider', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  const enTranslations = { greeting: 'Hello', farewell: 'Goodbye' };
  const esTranslations = { greeting: 'Hola', farewell: 'Adiós' };

  beforeEach(() => {
    localStorage.clear();
    fetchSpy = vi.fn((url: string) => {
      if (url.includes('/en.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(enTranslations),
        });
      }
      if (url.includes('/es.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(esTranslations),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to English locale when localStorage is empty', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('fetches English locale file on init', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/locales/en.json');
    });
  });

  it('reads persisted locale from localStorage on init', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'es');

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('es');
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/locales/es.json');
    });
  });

  it('defaults to en if localStorage has invalid locale', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });

  it('t() returns translated value when key exists', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('translated')).toHaveTextContent('Hello');
    });
  });

  it('t() returns key itself when key is missing', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('missing')).toHaveTextContent('missing.key');
  });

  it('fetches new locale and persists to localStorage on setLocale', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByText('Switch to ES'));

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es');
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/locales/es.json');
    });
    await waitFor(() => {
      expect(screen.getByTestId('translated')).toHaveTextContent('Hola');
    });
  });

  it('falls back to English on fetch failure and logs error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(LOCALE_STORAGE_KEY, 'es');

    fetchSpy.mockImplementation((url: string) => {
      if (url.includes('/es.json')) {
        return Promise.reject(new Error('Network error'));
      }
      if (url.includes('/en.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(enTranslations),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(screen.getByTestId('translated')).toHaveTextContent('Hello');
    consoleSpy.mockRestore();
  });

  it('continues displaying previous translations while loading new locale', async () => {
    let resolveEs: ((value: Response) => void) | undefined;

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    // Wait for initial English load
    await waitFor(() => {
      expect(screen.getByTestId('translated')).toHaveTextContent('Hello');
    });

    // Make ES fetch hang
    fetchSpy.mockImplementation((url: string) => {
      if (url.includes('/es.json')) {
        return new Promise(resolve => {
          resolveEs = resolve;
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(enTranslations),
      });
    });

    // Switch to ES
    await act(async () => {
      screen.getByText('Switch to ES').click();
    });

    // Should still show English translations while loading
    expect(screen.getByTestId('translated')).toHaveTextContent('Hello');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    // Resolve the ES fetch
    await act(async () => {
      resolveEs!({
        ok: true,
        json: () => Promise.resolve(esTranslations),
      } as Response);
    });

    await waitFor(() => {
      expect(screen.getByTestId('translated')).toHaveTextContent('Hola');
    });
  });
});
