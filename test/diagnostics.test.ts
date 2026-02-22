import { afterEach, describe, expect, it } from 'vitest';
import {
  configurarGlobalmente,
  expandirSiglasDetallado,
  resetearConfiguracion,
  type OmittedAcronymReason
} from '../src/index';

afterEach(() => {
  resetearConfiguracion();
});

describe('expandirSiglasDetallado', () => {
  it('reports excluded acronyms', () => {
    const result = expandirSiglasDetallado('AEAT y BOE', { exclude: ['BOE'] });

    expect(result.acronyms).toHaveLength(1);
    expect(result.omittedAcronyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          acronym: 'BOE',
          reason: 'excluded'
        })
      ])
    );
  });

  it('reports include-filter omissions', () => {
    const result = expandirSiglasDetallado('AEAT y BOE', { include: ['AEAT'] });

    expect(result.acronyms).toHaveLength(1);
    expect(result.omittedAcronyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          acronym: 'BOE',
          reason: 'not-in-include'
        })
      ])
    );
  });

  it('reports repeated acronyms skipped by expandOnlyFirst', () => {
    const result = expandirSiglasDetallado('AEAT y AEAT', { expandOnlyFirst: true });

    expect(result.acronyms).toHaveLength(1);
    expect(result.omittedAcronyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          acronym: 'AEAT',
          reason: 'expand-only-first'
        })
      ])
    );
  });

  it('reports omissions for protected contexts', () => {
    const text = 'Visita https://aeat.es y escribe a info@boe.es y usa `AEAT` fuera AEAT';
    const result = expandirSiglasDetallado(text);

    const reasons = new Set(result.omittedAcronyms.map(item => item.reason));

    expect(reasons.has('inside-url')).toBe(true);
    expect(reasons.has('inside-email')).toBe(true);
    expect(reasons.has('inside-inline-code')).toBe(true);

    expect(result.expandedText).toContain('fuera AEAT (Agencia Estatal de Administración Tributaria)');
  });

  it('returns empty diagnostic output when expansion is globally disabled', () => {
    configurarGlobalmente({ enabled: false });
    const result = expandirSiglasDetallado('AEAT y BOE');

    expect(result.acronyms).toHaveLength(0);
    expect(result.omittedAcronyms).toHaveLength(0);
    expect(result.stats.totalAcronymsFound).toBe(0);
  });

  it('exposes stable reason enum values', () => {
    const reasons: OmittedAcronymReason[] = [
      'excluded',
      'not-in-include',
      'expand-only-first',
      'ambiguous-unresolved',
      'inside-url',
      'inside-email',
      'inside-code-block',
      'inside-inline-code',
      'not-found'
    ];

    expect(reasons).toHaveLength(9);
  });
});
