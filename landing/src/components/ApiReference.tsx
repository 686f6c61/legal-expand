/**
 * legal-expand - Componente ApiReference
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Documentación completa de la API: funciones principales, consulta,
 * tipos TypeScript y formatters.
 */

import { useTranslation } from '@hooks/useTranslation';
import { CodeIcon, SearchIcon, FileTextIcon, LayersIcon } from './Icons';
import './ApiReference.css';

export default function ApiReference() {
  const { t } = useTranslation();

  return (
    <section id="api" className="api-reference section">
      <div className="container">
        <h2 className="text-center">{t.api.title}</h2>

        <div className="api-section">
          <div className="section-header">
            <CodeIcon className="section-icon" size={24} />
            <h3>{t.api.main_functions}</h3>
          </div>

          <div className="api-function">
            <h4><code>expandirSiglas(texto, opciones?)</code></h4>
            <p>{t.api.expand_description}</p>

            <div className="api-params">
              <strong>{t.api.parameters}:</strong>
              <ul>
                <li><code>texto</code> (string): {t.api.param_text}</li>
                <li><code>opciones</code> (ExpansionOptions, opcional): {t.api.param_options}
                  <ul>
                    <li><code>format</code>: 'plain' | 'html' | 'structured' (default: 'plain')</li>
                    <li><code>expandOnlyFirst</code>: boolean - {t.api.param_expand_only_first} (default: false)</li>
                    <li><code>forceExpansion</code>: boolean - {t.api.param_force_expansion} (default: undefined)</li>
                    <li><code>preserveCase</code>: boolean - {t.api.param_preserve_case} (default: true)</li>
                    <li><code>autoResolveDuplicates</code>: boolean - {t.api.param_auto_resolve} (default: false)</li>
                    <li><code>duplicateResolution</code>: Record&lt;string, string&gt; - {t.api.param_duplicate_resolution}</li>
                    <li><code>exclude</code>: string[] - {t.api.param_exclude}</li>
                    <li><code>include</code>: string[] - {t.api.param_include}</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="api-returns">
              <strong>{t.api.returns}:</strong> string | StructuredOutput
            </div>

            <div className="api-examples">
              <strong>{t.api.examples}:</strong>
              <div className="code-block">
                <pre><code>{`// Ejemplo básico
expandirSiglas('La AEAT gestiona el IVA');
// "La AEAT (Agencia Estatal...) gestiona el IVA (Impuesto...)"

// Documentos largos (solo primera ocurrencia)
expandirSiglas(texto, { expandOnlyFirst: true });

// Formato HTML con semántica
expandirSiglas(texto, { format: 'html' });
// '<abbr title="Agencia...">AEAT</abbr>'

// Formato estructurado (JSON)
const result = expandirSiglas(texto, { format: 'structured' });
// { originalText, expandedText, acronyms: [...], stats: {...} }

// Excluir siglas específicas
expandirSiglas(texto, { exclude: ['art.', 'Sr.'] });

// Solo incluir siglas específicas
expandirSiglas(texto, { include: ['AEAT', 'BOE'] });

// Resolver duplicados manualmente
expandirSiglas(texto, {
  duplicateResolution: { 'DGT': 'Dirección General de Tributos' }
});

// Combinar opciones
expandirSiglas(texto, {
  format: 'html',
  expandOnlyFirst: true,
  exclude: ['art.', 'párr.']
});`}</code></pre>
              </div>
            </div>
          </div>

          <div className="api-function">
            <h4><code>configurarGlobalmente(config)</code></h4>
            <p>{t.api.config_global_description}</p>

            <div className="code-block">
              <pre><code>{`configurarGlobalmente({
  enabled: true,
  expandOnlyFirst: true,
  format: 'plain'
});`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4><code>obtenerConfiguracionGlobal()</code></h4>
            <p>{t.api.get_config_description}</p>
          </div>

          <div className="api-function">
            <h4><code>resetearConfiguracion()</code></h4>
            <p>{t.api.reset_config_description}</p>
          </div>
        </div>

        <div className="api-section">
          <div className="section-header">
            <SearchIcon className="section-icon" size={24} />
            <h3>{t.api.query_functions}</h3>
          </div>

          <div className="api-function">
            <h4><code>buscarSigla(sigla): AcronymSearchResult | null</code></h4>
            <p>{t.api.search_description}</p>

            <div className="code-block">
              <pre><code>{`// Sigla simple
const info = buscarSigla('AEAT');
// → { acronym: 'AEAT', meanings: ['Agencia Estatal...'], hasDuplicates: false }

// Sigla con múltiples significados
const duplicada = buscarSigla('CE');
// → { acronym: 'CE', meanings: ['Constitución Española', 'Comunidad Europea'], hasDuplicates: true }

// Sigla inexistente
buscarSigla('NOEXISTE'); // → null`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4><code>listarSiglas(): string[]</code></h4>
            <p>{t.api.list_description}</p>

            <div className="code-block">
              <pre><code>{`const todas = listarSiglas();
console.log(todas.length); // 646
console.log(todas.slice(0, 5)); // ['AEAT', 'BOE', 'CC', 'CE', 'IVA']`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4><code>obtenerEstadisticas(): DictionaryStats</code></h4>
            <p>{t.api.stats_description}</p>

            <div className="code-block">
              <pre><code>{`const stats = obtenerEstadisticas();
// → {
//   totalAcronyms: 646,
//   acronymsWithDuplicates: 47,
//   acronymsWithPunctuation: 156
// }`}</code></pre>
            </div>
          </div>
        </div>

        <div className="api-section">
          <div className="section-header">
            <FileTextIcon className="section-icon" size={24} />
            <h3>{t.api.types}</h3>
          </div>

          <div className="api-function">
            <h4>ExpansionOptions</h4>
            <div className="code-block">
              <pre><code>{`interface ExpansionOptions {
  format?: 'plain' | 'html' | 'structured';
  forceExpansion?: boolean;
  preserveCase?: boolean;
  autoResolveDuplicates?: boolean;
  duplicateResolution?: Record<string, string>;
  expandOnlyFirst?: boolean;
  exclude?: string[];
  include?: string[];
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>GlobalConfig</h4>
            <div className="code-block">
              <pre><code>{`interface GlobalConfig {
  enabled?: boolean;
  defaultOptions?: Partial<ExpansionOptions>;
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>StructuredOutput</h4>
            <div className="code-block">
              <pre><code>{`interface StructuredOutput {
  originalText: string;
  expandedText: string;
  acronyms: ExpandedAcronym[];
  stats: {
    totalAcronymsFound: number;
    totalExpanded: number;
    ambiguousNotExpanded: number;
  };
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>ExpandedAcronym</h4>
            <div className="code-block">
              <pre><code>{`interface ExpandedAcronym {
  acronym: string;
  expansion: string;
  position: {
    start: number;
    end: number;
  };
  hasMultipleMeanings: boolean;
  allMeanings?: string[];
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>AcronymSearchResult</h4>
            <div className="code-block">
              <pre><code>{`interface AcronymSearchResult {
  acronym: string;
  meanings: string[];
  hasDuplicates: boolean;
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>DictionaryStats</h4>
            <div className="code-block">
              <pre><code>{`interface DictionaryStats {
  totalAcronyms: number;
  acronymsWithDuplicates: number;
  acronymsWithPunctuation: number;
}`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>Formatter</h4>
            <div className="code-block">
              <pre><code>{`interface Formatter {
  format(
    originalText: string,
    expansions: Map<ExpandedAcronym, string>
  ): string | StructuredOutput;
}`}</code></pre>
            </div>
          </div>
        </div>

        <div className="api-section">
          <div className="section-header">
            <LayersIcon className="section-icon" size={24} />
            <h3>{t.api.formatters}</h3>
          </div>

          <p>{t.api.formatters_intro}</p>

          <div className="api-function">
            <h4><code>FormatterFactory.registerFormatter(name, formatter)</code></h4>
            <p>{t.api.register_formatter_description}</p>

            <div className="code-block">
              <pre><code>{`import { FormatterFactory, type Formatter } from 'legal-expand';

class MarkdownFormatter implements Formatter {
  format(text, expansions) {
    // Tu implementación personalizada
    return text.replace(/SIGLA/g, '**SIGLA**');
  }
}

// Registrar formatter
FormatterFactory.registerFormatter('markdown', new MarkdownFormatter());

// Usar formatter personalizado
expandirSiglas(texto, { format: 'markdown' as any });`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4><code>FormatterFactory.listFormatters(): string[]</code></h4>
            <p>{t.api.list_formatters_description}</p>

            <div className="code-block">
              <pre><code>{`const formats = FormatterFactory.listFormatters();
console.log(formats); // ['plain', 'html', 'structured']

// Después de registrar custom formatter
FormatterFactory.registerFormatter('markdown', new MarkdownFormatter());
console.log(FormatterFactory.listFormatters()); // ['plain', 'html', 'structured', 'markdown']`}</code></pre>
            </div>
          </div>
        </div>

        <div className="api-section">
          <h3>{t.api.duplicates_title}</h3>

          <p>{t.api.duplicates_intro}</p>

          <div className="api-function">
            <h4>{t.api.duplicates_method1_title}</h4>
            <p>{t.api.duplicates_method1_description}</p>
            <div className="code-block">
              <pre><code>{`expandirSiglas(texto, {
  duplicateResolution: {
    'DGT': 'Dirección General de Tributos',
    'CE': 'Constitución Española'
  }
});`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>{t.api.duplicates_method2_title}</h4>
            <p>{t.api.duplicates_method2_description}</p>
            <div className="code-block">
              <pre><code>{`expandirSiglas(texto, {
  autoResolveDuplicates: true  // Usa el de mayor prioridad
});`}</code></pre>
            </div>
          </div>

          <div className="api-function">
            <h4>{t.api.duplicates_method3_title}</h4>
            <p>{t.api.duplicates_method3_description} <code>src/data/dictionary.json</code>:</p>
            <div className="code-block">
              <pre><code>{`{
  "entries": [
    {
      "id": "entry-332",
      "original": "DGT",
      "significado": "Dirección General de Tributos",
      "variants": ["DGT"],
      "priority": 120  // ← Número mayor = más prioridad
    },
    {
      "id": "entry-500",
      "original": "DGT",
      "significado": "Dirección General de Tráfico",
      "variants": ["DGT"],
      "priority": 80   // ← Prioridad más baja
    }
  ]
}`}</code></pre>
            </div>
            <p><strong>{t.api.priority_scale}</strong></p>
            <ul>
              <li><strong>120-150</strong>: {t.api.priority_very_high}</li>
              <li><strong>100-119</strong>: {t.api.priority_high}</li>
              <li><strong>80-99</strong>: {t.api.priority_medium}</li>
              <li><strong>60-79</strong>: {t.api.priority_low}</li>
              <li><strong>&lt;60</strong>: {t.api.priority_very_low}</li>
            </ul>
            <p className="text-secondary"><strong>Nota:</strong> {t.api.priority_note} <code>npm run build</code> {t.api.priority_note_action}</p>
          </div>
        </div>

        <div className="api-section">
          <h3>{t.api.context_protection_title}</h3>

          <p>{t.api.context_protection_intro}</p>

          <ul>
            <li><strong>URLs</strong>: {t.api.context_urls} https://ejemplo.com/BOE/123</li>
            <li><strong>Emails</strong>: {t.api.context_emails} usuario@BOE.es</li>
            <li><strong>Bloques de código</strong>: {t.api.context_code_blocks} ```código```</li>
            <li><strong>Código inline</strong>: {t.api.context_inline_code} `código`</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
