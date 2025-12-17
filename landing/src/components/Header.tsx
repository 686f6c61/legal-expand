/**
 * legal-expand - Componente Header
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Cabecera de la landing page con logo, navegación, selector de idioma
 * y toggle de tema. Sticky al hacer scroll.
 */

import { useTheme } from '@hooks/useTheme';
import { useTranslation } from '@hooks/useTranslation';
import { MoonIcon, SunIcon } from './Icons';
import './Header.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <header className="header">
      <div className="container">
        <nav className="header-nav">
          <div className="header-logo">
            <a href="#hero">
              <span className="logo-text">legal-expand</span>
            </a>
          </div>

          <ul className="header-links">
            <li><a href="#quick-start">{t.quickstart.install}</a></li>
            <li><a href="#demo">{t.demo.title}</a></li>
            <li><a href="#use-cases">{t.usecases.title}</a></li>
            <li><a href="#api">{t.api.title}</a></li>
            <li><a href="#siglas">{t.siglas.title}</a></li>
            <li>
              <a
                href="https://github.com/686f6c61/legal-expand"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.footer.github}
              </a>
            </li>
          </ul>

          <div className="header-controls">
            <button
              className="control-button"
              onClick={toggleLanguage}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}
            >
              {language.toUpperCase()}
            </button>

            <button
              className="control-button"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? t.theme.dark : t.theme.light}
            >
              {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
