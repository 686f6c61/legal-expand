import { afterEach, describe, expect, it } from 'vitest';
import {
  configurarGlobalmente,
  expandirSiglas,
  obtenerConfiguracionGlobal,
  resetearConfiguracion,
  type StructuredOutput
} from '../src/index';

afterEach(() => {
  resetearConfiguracion();
});

describe('matching variants', () => {
  it('expands lowercase acronyms', () => {
    const result = expandirSiglas('La aeat notifica el iva');

    expect(result).toContain('aeat');
    expect(result).toContain('Agencia Estatal de Administración Tributaria');
    expect(result).toContain('iva');
    expect(result).toContain('Impuesto sobre el Valor Añadido');
  });

  it('expands dotted acronyms', () => {
    const result = expandirSiglas('La A.E.A.T. notifica');

    expect(result).toContain('A.E.A.T.');
    expect(result).toContain('Agencia Estatal de Administración Tributaria');
  });

  it('still expands with preserveCase disabled', () => {
    const result = expandirSiglas('La aeat notifica', { preserveCase: false });

    expect(result).toContain('AEAT');
    expect(result).toContain('Agencia Estatal de Administración Tributaria');
  });
});

describe('global config', () => {
  it('supports forceExpansion override', () => {
    configurarGlobalmente({ enabled: false });

    expect(expandirSiglas('La AEAT notifica')).toBe('La AEAT notifica');

    const forced = expandirSiglas('La AEAT notifica', { forceExpansion: true });
    expect(forced).toContain('Agencia Estatal de Administración Tributaria');
  });

  it('returns immutable-looking global config snapshot', () => {
    configurarGlobalmente({
      enabled: true,
      defaultOptions: {
        format: 'html',
        expandOnlyFirst: true
      }
    });

    const config = obtenerConfiguracionGlobal();
    expect(config.enabled).toBe(true);
    expect(config.defaultOptions?.format).toBe('html');
    expect(config.defaultOptions?.expandOnlyFirst).toBe(true);
  });

  it('returns empty structured output when expansion is disabled globally', () => {
    configurarGlobalmente({ enabled: false });
    const result = expandirSiglas('AEAT', { format: 'structured' }) as StructuredOutput;

    expect(result.originalText).toBe('AEAT');
    expect(result.expandedText).toBe('AEAT');
    expect(result.stats.totalExpanded).toBe(0);
    expect(result.stats.totalAcronymsFound).toBe(0);
  });
});

describe('filters and structured output', () => {
  it('applies include/exclude case-insensitively', () => {
    const result = expandirSiglas('AEAT y BOE', {
      include: ['aeat'],
      exclude: ['boe']
    });

    expect(result).toContain('Agencia Estatal de Administración Tributaria');
    expect(result).not.toContain('Boletín Oficial del Estado');
  });

  it('reports structured stats coherently', () => {
    const result = expandirSiglas('AEAT y IVA', { format: 'structured' }) as StructuredOutput;

    expect(result.stats.totalAcronymsFound).toBe(2);
    expect(result.stats.totalExpanded).toBe(2);
    expect(result.stats.ambiguousNotExpanded).toBe(0);
    expect(result.acronyms).toHaveLength(2);
  });

  it('does not expand acronyms inside emails', () => {
    const result = expandirSiglas('Contacta en info@boe.es sobre el BOE');

    expect(result).toContain('info@boe.es');
    expect(result).toContain('BOE (Boletín Oficial del Estado)');
    expect(result).not.toContain('info@boe (Boletín Oficial del Estado).es');
  });
});
