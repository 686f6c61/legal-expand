/**
 * legal-expand - Hook useTranslation para Internacionalización
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Hook personalizado para gestionar traducciones entre español e inglés.
 * Usa el TranslationContext para compartir el idioma entre todos los componentes.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, language, toggleLanguage } = useTranslation();
 *   return <h1>{t.hero.title}</h1>;
 * }
 * ```
 */

import { useContext } from 'react';
import { TranslationContext } from '../contexts/TranslationContext';

export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}
