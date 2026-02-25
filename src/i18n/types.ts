export type SupportedLocale = 'en' | 'es';

export type TranslationMap = Record<string, string>;

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'es'];

export const LOCALE_STORAGE_KEY = 'preferred-locale';

export const DEFAULT_LOCALE: SupportedLocale = 'en';
