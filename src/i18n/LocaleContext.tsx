import { createContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
} from './types';
import type { SupportedLocale, TranslationMap } from './types';

export interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale;
    }
  } catch {
    // localStorage may be unavailable
  }
  return DEFAULT_LOCALE;
}

async function fetchTranslations(
  locale: SupportedLocale,
): Promise<TranslationMap> {
  const response = await fetch(`/locales/${locale}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch locale file: ${response.status}`);
  }
  return response.json();
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchTranslations(locale);
        if (!cancelled) {
          setTranslations(data);
        }
      } catch (error) {
        console.error(`Failed to load locale "${locale}":`, error);
        if (locale !== DEFAULT_LOCALE) {
          try {
            const fallback = await fetchTranslations(DEFAULT_LOCALE);
            if (!cancelled) {
              setTranslations(fallback);
            }
          } catch (fallbackError) {
            console.error('Failed to load fallback locale:', fallbackError);
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[key] ?? key;
    },
    [translations],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}
