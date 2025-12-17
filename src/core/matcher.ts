/**
 * legal-expand - Sistema de Matching y Detección de Siglas
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Motor de detección de siglas legales en texto mediante expresiones regulares
 * precompiladas y validación contextual multinivel.
 *
 * ARQUITECTURA:
 * - DictionaryIndex: Índice optimizado para búsquedas O(1) por variante
 * - SiglasMatcher: Motor de regex con validación de contexto
 * - Sistema de 3 niveles de búsqueda: exact → flexible → normalized
 *
 * CARACTERÍSTICAS:
 * - Regex precompilada con todas las variantes (construcción única)
 * - Ordenación por longitud para prevenir matches parciales ("art" vs "art.")
 * - Validación contextual: URLs, emails, código, word boundaries
 * - Resolución de conflictos con sistema de prioridades
 * - Soporte para filtros include/exclude y opciones avanzadas
 *
 * DECISIONES DE DISEÑO:
 * - Singleton del matcher para evitar recompilación de regex
 * - Índices múltiples (exact/normalized) para búsquedas rápidas
 * - Lookahead/lookbehind en regex para word boundaries precisos
 * - Validación de contexto especial para prevenir false positives
 */

import dictionaryData from '../data/dictionary.json' with { type: 'json' };
import type { CompiledDictionary, DictionaryEntry, MatchInfo, InternalGlobalConfig } from '../types/index.js';
import {
  normalize,
  escapeRegex,
  isPartOfLargerWord,
  isInSpecialContext
} from './normalizer.js';

// Cast del JSON importado al tipo compilado
const dictionary = dictionaryData as CompiledDictionary;

// ============================================================================
// ÍNDICE DEL DICCIONARIO
// ============================================================================

/**
 * Índice optimizado del diccionario para búsquedas O(1).
 *
 * Construye múltiples estructuras de datos en memoria para permitir búsquedas
 * ultrarrápidas de siglas por diferentes variantes (exact, normalized) y gestionar
 * conflictos de siglas con múltiples significados.
 *
 * ÍNDICES MANTENIDOS:
 * - entries: Map de todas las entradas por ID (acceso directo)
 * - exactIndex: Map de variantes exactas → IDs (case-sensitive)
 * - normalizedIndex: Map de variantes normalizadas → IDs (case-insensitive)
 * - conflictMap: Map de siglas ambiguas → resolución de conflicto
 */
class DictionaryIndex {
  private entries: Map<string, DictionaryEntry>;
  private exactIndex: Map<string, string[]>;
  private normalizedIndex: Map<string, string[]>;
  private conflictMap: Map<string, { defaultId: string; variants: Array<{ id: string; significado: string; priority: number }> }>;

  constructor() {
    this.entries = new Map();
    this.exactIndex = new Map();
    this.normalizedIndex = new Map();
    this.conflictMap = new Map();

    this.buildIndices();
  }

  private buildIndices() {
    // Indexar entradas
    for (const entry of dictionary.entries) {
      this.entries.set(entry.id, entry);
    }

    // Indexar por variantes
    for (const [key, ids] of Object.entries(dictionary.index.exact)) {
      this.exactIndex.set(key, ids);
    }

    for (const [key, ids] of Object.entries(dictionary.index.normalized)) {
      this.normalizedIndex.set(key, ids);
    }

    // Indexar conflictos
    for (const conflict of dictionary.conflicts) {
      this.conflictMap.set(conflict.sigla, {
        defaultId: conflict.defaultId,
        variants: conflict.variants
      });
    }
  }

  /**
   * Busca una sigla con estrategia de 3 niveles
   */
  lookup(sigla: string, caseSensitive: boolean = true): DictionaryEntry | null {
    // Nivel 1: Exact match
    let ids = this.exactIndex.get(sigla);
    if (ids && ids.length > 0) {
      return this.resolveIds(ids, sigla);
    }

    // Nivel 2: Flexible match (sin puntos)
    const flexible = sigla.replace(/\./g, '').replace(/\s+/g, '');
    ids = this.exactIndex.get(flexible);
    if (ids && ids.length > 0) {
      return this.resolveIds(ids, sigla);
    }

    // Nivel 3: Normalized match (case-insensitive)
    if (!caseSensitive) {
      const normalized = normalize(sigla);
      ids = this.normalizedIndex.get(normalized);
      if (ids && ids.length > 0) {
        return this.resolveIds(ids, sigla);
      }
    }

    return null;
  }

  private resolveIds(ids: string[], sigla: string): DictionaryEntry | null {
    if (ids.length === 1) {
      return this.entries.get(ids[0]) || null;
    }

    // Múltiples matches - buscar resolución de conflictos
    // Primero intentar por sigla normalizada
    for (const [conflictSigla, resolution] of this.conflictMap) {
      const normalizedConflict = normalize(conflictSigla);
      const normalizedSigla = normalize(sigla);

      if (normalizedConflict === normalizedSigla) {
        return this.entries.get(resolution.defaultId) || null;
      }
    }

    // Fallback: retornar el primero (debería ser el de mayor prioridad)
    return this.entries.get(ids[0]) || null;
  }

  /**
   * Obtiene todas las entradas del diccionario
   */
  getAllEntries(): DictionaryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Busca información de conflicto para una sigla
   */
  getConflictInfo(sigla: string) {
    return this.conflictMap.get(sigla);
  }

  /**
   * Verifica si una sigla tiene múltiples significados
   */
  hasMultipleMeanings(sigla: string): boolean {
    return this.conflictMap.has(sigla);
  }

  /**
   * Obtiene todos los significados posibles de una sigla
   */
  getAllMeanings(sigla: string): string[] {
    const conflict = this.conflictMap.get(sigla);
    if (!conflict) {
      const entry = this.lookup(sigla, true);
      return entry ? [entry.significado] : [];
    }

    return conflict.variants.map(v => v.significado);
  }
}

/**
 * Matcher de siglas con regex precompilada y validación de contexto
 */
export class SiglasMatcher {
  private index: DictionaryIndex;
  private pattern: RegExp;

  constructor() {
    this.index = new DictionaryIndex();
    this.pattern = this.compilePattern();
  }

  /**
   * Compila el patrón regex con todas las variantes
   * Ordena por longitud (más largas primero) para evitar matches parciales
   */
  private compilePattern(): RegExp {
    const allVariants = new Set<string>();

    for (const entry of this.index.getAllEntries()) {
      allVariants.add(entry.original);
      for (const variant of entry.variants) {
        allVariants.add(variant);
      }
    }

    // Ordenar por longitud descendente
    const sorted = Array.from(allVariants).sort((a, b) => b.length - a.length);

    // Escapar caracteres especiales
    const escaped = sorted.map(v => escapeRegex(v));

    // Crear pattern con word boundaries usando lookahead/lookbehind
    // Nota: En JavaScript, \w no incluye acentos, así que usamos una clase más amplia
    return new RegExp(
      `(?<![a-zA-ZáéíóúñÑüÜ0-9])(${escaped.join('|')})(?![a-zA-ZáéíóúñÑüÜ0-9])`,
      'g'
    );
  }

  /**
   * Encuentra todos los matches de siglas en el texto
   */
  findMatches(text: string, options: InternalGlobalConfig['defaultOptions']): MatchInfo[] {
    const matches: MatchInfo[] = [];
    const seen = new Set<string>();

    // Reset del regex global
    this.pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = this.pattern.exec(text)) !== null) {
      const matched = match[0];
      const startPos = match.index;
      const endPos = startPos + matched.length;

      // Validación 1: No es parte de palabra más larga
      if (isPartOfLargerWord(text, startPos, endPos)) {
        continue;
      }

      // Validación 2: No está en contexto especial (URL, email, código)
      const specialContext = isInSpecialContext(text, startPos, endPos, {
        skipUrls: true,
        skipEmails: true,
        skipCodeBlocks: true,
        skipInlineCode: true
      });

      if (specialContext) {
        continue;
      }

      // Validación 3: Verificar exclude/include
      if (options.exclude && options.exclude.length > 0) {
        const normalizedMatched = normalize(matched);
        const isExcluded = options.exclude.some(ex => normalize(ex) === normalizedMatched);
        if (isExcluded) {
          continue;
        }
      }

      if (options.include && options.include.length > 0) {
        const normalizedMatched = normalize(matched);
        const isIncluded = options.include.some(inc => normalize(inc) === normalizedMatched);
        if (!isIncluded) {
          continue;
        }
      }

      // Validación 4: expandOnlyFirst - skip si ya vimos esta sigla
      if (options.expandOnlyFirst) {
        const normalizedMatched = normalize(matched);
        if (seen.has(normalizedMatched)) {
          continue;
        }
        seen.add(normalizedMatched);
      }

      // Buscar en diccionario
      const entry = this.index.lookup(matched, options.preserveCase);

      if (!entry) {
        continue; // No encontrado
      }

      // Verificar si tiene múltiples significados
      const hasMultipleMeanings = this.index.hasMultipleMeanings(entry.original);
      const allMeanings = hasMultipleMeanings ? this.index.getAllMeanings(entry.original) : undefined;

      // Si tiene múltiples significados y no tenemos resolución, skip
      if (hasMultipleMeanings) {
        // Verificar si hay resolución manual
        const normalizedMatched = normalize(matched);
        const hasManualResolution = options.duplicateResolution &&
          Object.keys(options.duplicateResolution).some(k => normalize(k) === normalizedMatched);

        if (!hasManualResolution && !options.autoResolveDuplicates) {
          // No expandir duplicados sin resolver
          continue;
        }

        // Si hay resolución manual, aplicarla
        if (hasManualResolution && options.duplicateResolution) {
          const manualKey = Object.keys(options.duplicateResolution).find(
            k => normalize(k) === normalizedMatched
          );
          if (manualKey) {
            const resolvedMeaning = options.duplicateResolution[manualKey];
            matches.push({
              original: matched,
              expansion: resolvedMeaning,
              startPos,
              endPos,
              confidence: 1.0,
              hasMultipleMeanings,
              allMeanings
            });
            continue;
          }
        }
      }

      // Añadir match
      matches.push({
        original: matched,
        expansion: entry.significado,
        startPos,
        endPos,
        confidence: 1.0,
        hasMultipleMeanings,
        allMeanings
      });
    }

    return matches;
  }

  /**
   * Obtiene información de una sigla específica
   */
  buscarSigla(sigla: string): { acronym: string; meanings: string[]; hasDuplicates: boolean } | null {
    const entry = this.index.lookup(sigla, true);
    if (!entry) {
      return null;
    }

    const hasDuplicates = this.index.hasMultipleMeanings(entry.original);
    const meanings = hasDuplicates ? this.index.getAllMeanings(entry.original) : [entry.significado];

    return {
      acronym: entry.original,
      meanings,
      hasDuplicates
    };
  }

  /**
   * Lista todas las siglas disponibles
   */
  listarSiglas(): string[] {
    return this.index.getAllEntries().map(e => e.original);
  }

  /**
   * Obtiene estadísticas del diccionario
   */
  obtenerEstadisticas() {
    const entries = this.index.getAllEntries();
    return {
      totalAcronyms: entries.length,
      acronymsWithDuplicates: Array.from(this.index.getAllEntries())
        .filter(e => this.index.hasMultipleMeanings(e.original)).length,
      acronymsWithPunctuation: entries.filter(e => e.original.includes('.')).length
    };
  }
}

// Singleton del matcher (se carga una vez)
let matcherInstance: SiglasMatcher | null = null;

export function getMatcher(): SiglasMatcher {
  if (!matcherInstance) {
    matcherInstance = new SiglasMatcher();
  }
  return matcherInstance;
}
