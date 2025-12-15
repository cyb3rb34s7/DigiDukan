/**
 * Language Context - Multi-language Support
 * Supports: English, Hindi, Hinglish
 * Persists language preference in localStorage
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// Import locale files
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import hinglish from '@/locales/hinglish.json';

export type Language = 'en' | 'hi' | 'hinglish';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  languages: readonly Language[];
  languageNames: Record<Language, string>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'munafa-language';

const locales: Record<Language, Record<string, string>> = {
  en,
  hi,
  hinglish,
};

const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  hinglish: 'Hinglish',
};

const LANGUAGES: readonly Language[] = ['en', 'hi', 'hinglish'] as const;

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'hi',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern for SSR
    setMounted(true);

    const storedLang = localStorage.getItem(STORAGE_KEY) as Language | null;

    if (storedLang && LANGUAGES.includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  // Update document lang attribute
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    // Set lang attribute for accessibility
    root.setAttribute('lang', language === 'en' ? 'en' : 'hi');
  }, [language, mounted]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const translations = locales[language];
      const value = translations[key];

      if (value) {
        return value;
      }

      // Fallback to English if key not found
      const enValue = locales.en[key];
      if (enValue) {
        return enValue;
      }

      // Return fallback or key itself
      return fallback || key;
    },
    [language]
  );

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
    languages: LANGUAGES,
    languageNames,
  };

  // Always render children - language will be applied once mounted
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

// Hook for just the translation function
export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}

// Export context for advanced usage
export { LanguageContext };
export type { LanguageContextValue };
