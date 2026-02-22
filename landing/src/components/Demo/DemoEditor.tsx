/**
 * legal-expand - Componente DemoEditor
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Editor en vivo que permite probar la funcionalidad de legal-expand.
 * Integra el paquete real y muestra resultados con opciones configurables.
 */

import { useState } from 'react';
import { expandirSiglas, expandirSiglasDetallado } from 'legal-expand';
import type { DiagnosticOutput, ExpansionOptions, StructuredOutput } from 'legal-expand';
import { useTranslation } from '@hooks/useTranslation';
import './DemoEditor.css';

interface DemoEditorProps {
  initialText?: string;
}

export default function DemoEditor({ initialText = '' }: DemoEditorProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState('');
  const [format, setFormat] = useState<'plain' | 'html' | 'structured' | 'diagnostic'>('plain');
  const [expandOnlyFirst, setExpandOnlyFirst] = useState(false);
  const [excludeInput, setExcludeInput] = useState('');
  const [stats, setStats] = useState({ found: 0, expanded: 0, omitted: 0 });

  const handleExpand = () => {
    if (!text.trim()) {
      setResult('');
      setStats({ found: 0, expanded: 0, omitted: 0 });
      return;
    }

    const options: ExpansionOptions = {
      format: format === 'diagnostic' ? 'structured' : format,
      expandOnlyFirst,
      exclude: excludeInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      // Calcular estadísticas básicas
      const siglasPattern = /[A-ZÑÁÉÍÓÚ][A-ZÑÁÉÍÓÚ.\/\s]+/g;
      const foundMatches = text.match(siglasPattern) || [];

      // Manejar diferentes formatos de retorno
      let resultText: string;
      let expandedCount: number;
      let omittedCount = 0;

      const expanded = format === 'diagnostic'
        ? expandirSiglasDetallado(text, options)
        : expandirSiglas(text, options);

      if (typeof expanded === 'string') {
        resultText = expanded;
        expandedCount = (expanded.match(/\(/g) || []).length;
      } else {
        // StructuredOutput
        resultText = JSON.stringify(expanded, null, 2);
        expandedCount = (expanded as StructuredOutput).acronyms.length;
        omittedCount = (expanded as DiagnosticOutput).omittedAcronyms?.length ?? 0;
      }

      setResult(resultText);
      setStats({
        found: foundMatches.length,
        expanded: expandedCount,
        omitted: omittedCount,
      });
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : t.demo.error_unknown}`);
      setStats({ found: 0, expanded: 0, omitted: 0 });
    }
  };

  return (
    <div className="demo-editor">
      <div className="demo-editor-controls">
        <div className="control-group">
          <label htmlFor="format">{t.demo.format_label}</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
          >
            <option value="plain">{t.demo.format_plain}</option>
            <option value="html">{t.demo.format_html}</option>
            <option value="structured">{t.demo.format_structured}</option>
            <option value="diagnostic">{t.demo.format_diagnostic}</option>
          </select>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={expandOnlyFirst}
              onChange={(e) => setExpandOnlyFirst(e.target.checked)}
            />
            {t.demo.only_first_label}
          </label>
        </div>

        <div className="control-group">
          <label htmlFor="exclude">{t.demo.exclude_label}</label>
          <input
            id="exclude"
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            placeholder="IVA, BOE"
          />
        </div>
      </div>

      <div className="demo-editor-textarea">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.demo.placeholder}
          rows={10}
        />
      </div>

      <button className="button button-primary" onClick={handleExpand}>
        {t.demo.expand_button}
      </button>

      {result && (
        <div className="demo-editor-result">
          <div className="demo-stats">
            <span>{stats.found} {t.demo.stats_found}</span>
            <span>{stats.expanded} {t.demo.stats_expanded}</span>
            <span>{stats.omitted} {t.demo.stats_omitted}</span>
          </div>

          <div className="result-content">
            {format === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: result }} />
            ) : (
              <pre>{result}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
