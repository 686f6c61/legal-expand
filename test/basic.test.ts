/**
 * legal-expand - Tests básicos
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { expandirSiglas, buscarSigla, listarSiglas, obtenerEstadisticas } from '../src/index';

describe('expandirSiglas', () => {
  it('should expand a single acronym', () => {
    const result = expandirSiglas('La AEAT notifica');
    expect(result).toContain('AEAT');
    expect(result).toContain('Agencia Estatal de Administración Tributaria');
  });

  it('should expand multiple acronyms', () => {
    const result = expandirSiglas('La AEAT gestiona el IVA');
    expect(result).toContain('AEAT');
    expect(result).toContain('IVA');
  });

  it('should return original text when no acronyms found', () => {
    const result = expandirSiglas('texto sin siglas');
    expect(result).toBe('texto sin siglas');
  });

  it('should respect expandOnlyFirst option', () => {
    const result = expandirSiglas('AEAT y AEAT', { expandOnlyFirst: true });
    const matches = result.match(/Agencia Estatal de Administración Tributaria/g);
    expect(matches).toHaveLength(1);
  });

  it('should exclude specified acronyms', () => {
    const result = expandirSiglas('AEAT y BOE', { exclude: ['BOE'] });
    expect(result).toContain('Agencia Estatal');
    expect(result).not.toContain('Boletín Oficial');
  });
});

describe('buscarSigla', () => {
  it('should find an existing acronym', () => {
    const result = buscarSigla('AEAT');
    expect(result).not.toBeNull();
    expect(result?.acronym).toBe('AEAT');
    expect(result?.meanings.length).toBeGreaterThan(0);
  });

  it('should return null for non-existing acronym', () => {
    const result = buscarSigla('NOEXISTE');
    expect(result).toBeNull();
  });
});

describe('listarSiglas', () => {
  it('should return array of acronyms', () => {
    const siglas = listarSiglas();
    expect(Array.isArray(siglas)).toBe(true);
    expect(siglas.length).toBeGreaterThan(0);
    expect(siglas).toContain('AEAT');
  });
});

describe('obtenerEstadisticas', () => {
  it('should return statistics object', () => {
    const stats = obtenerEstadisticas();
    expect(stats).toHaveProperty('totalAcronyms');
    expect(stats).toHaveProperty('acronymsWithDuplicates');
    expect(stats).toHaveProperty('acronymsWithPunctuation');
    expect(stats.totalAcronyms).toBeGreaterThan(0);
  });
});
