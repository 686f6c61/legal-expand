import { describe, expect, it } from 'vitest';
import { FormatterFactory } from '../src/formatters';
import { HtmlFormatter } from '../src/formatters/html';
import { PlainTextFormatter } from '../src/formatters/plain-text';
import { StructuredFormatter } from '../src/formatters/structured';
import type { MatchInfo } from '../src/types';

describe('formatters', () => {
  it('plain formatter returns original text when no matches', () => {
    const formatter = new PlainTextFormatter();
    expect(formatter.format('sin siglas', [])).toBe('sin siglas');
  });

  it('html formatter escapes html entities', () => {
    const formatter = new HtmlFormatter();
    const matches: MatchInfo[] = [
      {
        original: 'AEAT',
        expansion: 'Agencia <Tributaria> & "Fiscal"',
        startPos: 3,
        endPos: 7,
        confidence: 1,
        hasMultipleMeanings: false
      }
    ];

    const result = formatter.format('La AEAT notifica', matches);
    expect(result).toContain('&lt;Tributaria&gt;');
    expect(result).toContain('&amp;');
    expect(result).toContain('&quot;Fiscal&quot;');
  });

  it('structured formatter accepts external matcher stats', () => {
    const formatter = new StructuredFormatter();
    const matches: MatchInfo[] = [
      {
        original: 'AEAT',
        expansion: 'Agencia Estatal de Administración Tributaria',
        startPos: 3,
        endPos: 7,
        confidence: 1,
        hasMultipleMeanings: false
      }
    ];

    const result = formatter.formatWithStats('La AEAT notifica', matches, {
      totalAcronymsFound: 2,
      ambiguousNotExpanded: 1
    });

    expect(result.stats.totalAcronymsFound).toBe(2);
    expect(result.stats.totalExpanded).toBe(1);
    expect(result.stats.ambiguousNotExpanded).toBe(1);
  });
});

describe('formatter factory', () => {
  it('lists and resolves built-in formatters', () => {
    const formats = FormatterFactory.listFormatters();
    expect(formats).toContain('plain');
    expect(formats).toContain('html');
    expect(formats).toContain('structured');

    const formatter = FormatterFactory.getFormatter('plain');
    expect(typeof formatter.format).toBe('function');
  });

  it('throws for unknown format', () => {
    expect(() => FormatterFactory.getFormatter('unknown')).toThrow(/Unknown format/);
  });

  it('registers custom formatter', () => {
    FormatterFactory.registerFormatter('custom-test', {
      format: () => 'ok'
    });

    const formatter = FormatterFactory.getFormatter('custom-test');
    expect(formatter.format('x', [])).toBe('ok');
  });
});
