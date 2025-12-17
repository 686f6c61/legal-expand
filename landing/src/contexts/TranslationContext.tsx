/**
 * legal-expand - TranslationContext
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Contexto global para compartir el idioma entre todos los componentes.
 */

import { createContext, useState, useEffect, ReactNode } from 'react';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

type Language = 'es' | 'en';
type Translations = typeof es;

interface TranslationContextValue {
  t: Translations;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // 1. Intentar cargar preferencia guardada
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      return savedLang;
    }

    // 2. Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'en' ? 'en' : 'es') as Language;
  });

  const translations: Record<Language, Translations> = { es, en };
  const t = translations[language];

  useEffect(() => {
    // Actualizar atributo lang del documento
    document.documentElement.lang = language;

    // Guardar preferencia
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}
