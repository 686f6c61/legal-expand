/**
 * legal-expand - Componente Hero
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Sección principal de la landing con título, subtítulo, badge y CTAs.
 */

import { useTranslation } from '@hooks/useTranslation';
import { DownloadIcon } from './Icons';
import './Hero.css';

export default function Hero() {
  const { t } = useTranslation();

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install legal-expand');
  };

  return (
    <section id="hero" className="hero section">
      <div className="container">
        <div className="hero-content text-center">
          <div className="hero-badge">
            {t.hero.badge}
          </div>

          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <p className="hero-description text-secondary">
            {t.hero.description}
          </p>

          <div className="hero-ctas">
            <button className="button button-primary button-with-icon" onClick={handleCopyInstall}>
              <DownloadIcon size={20} />
              {t.hero.cta_install}
            </button>
            <a href="#demo" className="button button-secondary">
              {t.hero.cta_demo}
            </a>
          </div>

          <div className="hero-install-command">
            <code className="code-inline">npm install legal-expand</code>
          </div>
        </div>
      </div>
    </section>
  );
}
