import { useContext } from 'react';
import { LocaleContext } from './LocaleContext';
import type { LocaleContextValue } from './LocaleContext';

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (context === null) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
