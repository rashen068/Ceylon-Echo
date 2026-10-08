import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import zh from '@/locales/zh.json';
import { getSavedLanguage, saveLanguage, type AppLanguage } from '@/lib/language-preference';

const translations: Record<AppLanguage, Partial<Record<TranslationKey, string>>> = {
  en,
  fr,
  zh,
};
export type TranslationKey = keyof typeof en;

type LanguageContextValue = {
  language: AppLanguage;
  hasSelectedLanguage: boolean;
  isReady: boolean;
  initializationError: string | null;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  setLanguage: (language: AppLanguage) => Promise<void>;
  retryInitialization: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    getSavedLanguage()
      .then((savedLanguage) => {
        if (!active) return;
        if (savedLanguage) {
          setLanguageState(savedLanguage);
          setHasSelectedLanguage(true);
        } else {
          setLanguageState('en');
          setHasSelectedLanguage(false);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setInitializationError(
            error instanceof Error ? error.message : 'Could not load your saved language.',
          );
        }
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    setInitializationError(null);
    await saveLanguage(nextLanguage);
    setHasSelectedLanguage(true);
  }, []);

  const retryInitialization = useCallback(() => {
    setIsReady(false);
    setInitializationError(null);
    setRetryCount((count) => count + 1);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => {
      const template = translations[language][key] ?? translations.en[key] ?? key;
      return Object.entries(values ?? {}).reduce(
        (text, [name, value]) => text.split(`{${name}}`).join(String(value)),
        template,
      );
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      hasSelectedLanguage,
      isReady,
      initializationError,
      t,
      setLanguage,
      retryInitialization,
    }),
    [
      language,
      hasSelectedLanguage,
      isReady,
      initializationError,
      t,
      setLanguage,
      retryInitialization,
    ],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }
  return context;
}
