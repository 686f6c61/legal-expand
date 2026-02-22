import { describe, expect, it } from 'vitest';
import {
  escapeRegex,
  isAlphanumeric,
  isInSpecialContext,
  isInsideCodeBlock,
  isInsideEmail,
  isInsideInlineCode,
  isInsideUrl,
  isPartOfLargerWord,
  isWordBoundary,
  normalize
} from '../src/core/normalizer';

describe('normalize utilities', () => {
  it('normalizes dots, spaces and case', () => {
    expect(normalize('A.E.A.T.')).toBe('aeat');
    expect(normalize('II. EE.')).toBe('iiee');
  });

  it('escapes regex metacharacters', () => {
    expect(escapeRegex('art.+')).toBe('art\\.\\+');
  });

  it('checks alphanumeric including spanish characters', () => {
    expect(isAlphanumeric('A')).toBe(true);
    expect(isAlphanumeric('ñ')).toBe(true);
    expect(isAlphanumeric('.')).toBe(false);
  });
});

describe('word boundary helpers', () => {
  it('detects boundaries before and after tokens', () => {
    const text = ' AEAT.';

    expect(isWordBoundary(text, 1, 'before')).toBe(true);
    expect(isWordBoundary(text, 5, 'after')).toBe(true);
  });

  it('detects when token is part of larger word', () => {
    const text = 'CREATION';
    const start = text.indexOf('EAT');
    const end = start + 'EAT'.length;

    expect(isPartOfLargerWord(text, start, end)).toBe(true);
    expect(isPartOfLargerWord(' AEAT ', 1, 5)).toBe(false);
  });
});

describe('special context detection', () => {
  it('detects urls in different forms', () => {
    const text1 = 'Visita https://aeat.es/AEAT para más info';
    const start1 = text1.lastIndexOf('AEAT');
    const end1 = start1 + 4;

    const text2 = 'Revisa www.boe.es/BOE hoy';
    const start2 = text2.lastIndexOf('BOE');
    const end2 = start2 + 3;

    expect(isInsideUrl(text1, start1, end1)).toBe(true);
    expect(isInsideUrl(text2, start2, end2)).toBe(true);
  });

  it('detects emails', () => {
    const text = 'Contacto info@boe.es para dudas';
    const start = text.indexOf('@') + 1;
    const end = start + 2;

    expect(isInsideEmail(text, start, end)).toBe(true);
  });

  it('detects markdown code blocks and inline code', () => {
    const block = 'Inicio\n```\nAEAT\n```\nFin';
    const blockPos = block.indexOf('AEAT');

    const inline = 'Texto `AEAT` final';
    const inlinePos = inline.indexOf('AEAT');

    expect(isInsideCodeBlock(block, blockPos)).toBe(true);
    expect(isInsideInlineCode(inline, inlinePos)).toBe(true);
  });

  it('supports disabling specific context checks', () => {
    const text = 'Contacto info@boe.es y BOE';
    const start = text.indexOf('boe');
    const end = start + 3;

    const noEmailSkip = isInSpecialContext(text, start, end, {
      skipUrls: true,
      skipEmails: false,
      skipCodeBlocks: true,
      skipInlineCode: true
    });

    expect(noEmailSkip).toBeNull();
  });
});
