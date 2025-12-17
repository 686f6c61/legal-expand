/**
 * legal-expand - Componente Footer
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Pie de página con links, información de licencia y autor.
 */

import { useTranslation } from '@hooks/useTranslation';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>legal-expand</h4>
            <p className="text-secondary">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="footer-section">
            <h4>{t.footer.links}</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/686f6c61/legal-expand"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.footer.github}
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/legal-expand"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.footer.npm}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/686f6c61/legal-expand/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.footer.report_issues}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t.footer.license}</h4>
            <p className="text-secondary">
              {t.footer.author}: <a href="https://github.com/686f6c61" target="_blank" rel="noopener noreferrer">686f6c61</a>
            </p>
            <p className="text-secondary">
              {t.footer.version}: 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
