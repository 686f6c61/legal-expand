/**
 * legal-expand - Componente QuickStart
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Sección de inicio rápido con instalación y ejemplos de uso básico.
 */

import { useTranslation } from '@hooks/useTranslation';
import { DownloadIcon, CodeIcon, SettingsIcon, LayersIcon, SearchIcon } from './Icons';
import './QuickStart.css';

export default function QuickStart() {
  const { t } = useTranslation();

  return (
    <section id="quick-start" className="quick-start section">
      <div className="container">
        <h2 className="text-center">{t.quickstart.title}</h2>

        <div className="quick-start-content">
          <div className="quick-start-section">
            <div className="section-header">
              <DownloadIcon className="section-icon" size={24} />
              <h3>{t.quickstart.install}</h3>
            </div>
            <div className="code-block">
              <pre><code>npm install legal-expand</code></pre>
            </div>
          </div>

          <div className="quick-start-section">
            <div className="section-header">
              <CodeIcon className="section-icon" size={24} />
              <h3>{t.quickstart.basic_usage}</h3>
            </div>
            <div className="code-block">
              <pre><code>{`import { expandirSiglas } from 'legal-expand';

const texto = 'La AEAT notifica el IVA';
const resultado = expandirSiglas(texto);
// "La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido)"`}</code></pre>
            </div>
          </div>

          <div className="quick-start-section">
            <div className="section-header">
              <SettingsIcon className="section-icon" size={24} />
              <h3>{t.quickstart.common_options}</h3>
            </div>
            <div className="code-block">
              <pre><code>{`// Expandir solo la primera ocurrencia
expandirSiglas(texto, { expandOnlyFirst: true });

// Formato HTML
expandirSiglas(texto, { format: 'html' });

// Excluir siglas específicas
expandirSiglas(texto, { exclude: ['IVA'] });`}</code></pre>
            </div>
          </div>

          <div className="quick-start-section">
            <div className="section-header">
              <LayersIcon className="section-icon" size={24} />
              <h3>{t.quickstart.module_usage}</h3>
            </div>
            <div className="code-block">
              <pre><code>{`// ESM
import { expandirSiglas } from 'legal-expand';

// CommonJS
const { expandirSiglas } = require('legal-expand');`}</code></pre>
            </div>
          </div>

          <div className="quick-start-section">
            <div className="section-header">
              <SearchIcon className="section-icon" size={24} />
              <h3>{t.quickstart.diagnostic_usage}</h3>
            </div>
            <div className="code-block">
              <pre><code>{`import { expandirSiglasDetallado } from 'legal-expand';

const debug = expandirSiglasDetallado('AEAT y BOE', { include: ['AEAT'] });
console.log(debug.omittedAcronyms);
// [{ acronym: 'BOE', reason: 'not-in-include', ... }]`}</code></pre>
            </div>
          </div>

          <div className="quick-start-link">
            <a href="#api" className="button button-secondary">
              {t.quickstart.learn_more}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
