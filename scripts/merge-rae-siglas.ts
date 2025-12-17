/**
 * legal-expand - Script de Merge: Integración de Siglas RAE
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Script para incorporar siglas de la Real Academia Española al diccionario
 * existente, evitando duplicados mediante normalización inteligente.
 *
 * FLUJO DE PROCESAMIENTO:
 * 1. Lee siglas-rae.txt (formato: SIGLA|Significado)
 * 2. Lee diccionario existente (src/data/dictionary.json)
 * 3. Normaliza y detecta duplicados exactos
 * 4. Identifica nuevos significados para siglas existentes
 * 5. Genera entradas nuevas con variantes
 * 6. Actualiza índices y conflictos
 * 7. Escribe diccionario actualizado
 *
 * MANEJO DE CONFLICTOS:
 * - Duplicados exactos (sigla + significado): Omitidos
 * - Misma sigla, diferente significado: Añadido como conflicto
 * - Siglas completamente nuevas: Añadidas normalmente
 *
 * CUÁNDO EJECUTAR:
 * - Al incorporar nuevas siglas de la RAE
 * - Para actualizar el diccionario con fuentes oficiales
 * - Como parte de mantenimiento periódico
 *
 * ENTRADA: siglas-rae.txt en la raíz del proyecto
 * COMANDO: npm run merge-rae
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { CompiledDictionary, DictionaryEntry, ConflictInfo } from '../src/types/index.js';

// ============================================================================
// FUNCIONES AUXILIARES (duplicadas de build-data para independencia)
// ============================================================================

/**
 * Limpia una sigla eliminando espacios, tabs, etc.
 */
function cleanSigla(sigla: string | undefined): string | null {
  if (!sigla || typeof sigla !== 'string') return null;

  return sigla
    .trim()
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Limpia un significado
 */
function cleanSignificado(significado: string | undefined): string | null {
  if (!significado || typeof significado !== 'string') return null;

  let cleaned = significado
    .trim()
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ');

  if (cleaned.endsWith('.')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Genera todas las variantes posibles de una sigla para matching
 */
function generateVariants(sigla: string): string[] {
  const variants = new Set<string>([sigla]);

  if (sigla.endsWith('.')) {
    variants.add(sigla.slice(0, -1));
  }

  if (sigla.includes('.')) {
    const withoutPeriods = sigla.replace(/\./g, '');
    variants.add(withoutPeriods);

    if (sigla.endsWith('.')) {
      const withoutFinalPeriod = sigla.slice(0, -1);
      variants.add(withoutFinalPeriod.replace(/\./g, ''));
    }
  }

  if (sigla.includes(' ')) {
    const withoutSpaces = sigla.replace(/\s+/g, '');
    variants.add(withoutSpaces);

    const normalized = withoutSpaces.replace(/\./g, '');
    variants.add(normalized);
  }

  if (sigla.includes('/')) {
    const parts = sigla.split('/').map(p => p.trim());

    variants.add(sigla.replace(/\//g, ''));

    if (parts.length === 2 && parts[0].length > 1 && parts[1].length > 1) {
      parts.forEach(part => {
        if (part && part.length > 1) {
          variants.add(part);
        }
      });
    }
  }

  if (sigla === sigla.toLowerCase() && sigla.includes('.')) {
    const upper = sigla.toUpperCase();
    variants.add(upper);
    if (upper.endsWith('.')) {
      variants.add(upper.slice(0, -1));
    }
  }

  return Array.from(variants);
}

/**
 * Normaliza una sigla para detección de duplicados
 */
function normalizeForDuplication(sigla: string): string {
  return sigla
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, '')
    .replace(/\//g, '-');
}

/**
 * Calcula prioridad automática para una entrada
 */
function calculatePriority(sigla: string, significado: string): number {
  let priority = 100;

  if (significado.length < 50) priority += 10;
  if (significado.length > 150) priority -= 10;

  if (!/[\/]/.test(sigla)) priority += 5;

  if (sigla === sigla.toUpperCase() && sigla.length > 1) priority += 5;

  if (significado.includes('Impuesto')) priority += 15;
  if (significado.includes('Ley')) priority += 10;
  if (significado.includes('Reglamento')) priority += 10;
  if (significado.includes('Real Decreto Legislativo')) priority -= 5;

  return priority;
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE MERGE
// ============================================================================

/**
 * Script principal de merge.
 *
 * Integra siglas de RAE al diccionario existente con detección inteligente
 * de duplicados y actualización de conflictos.
 */
function mergeSiglas() {
  // 1. Leer archivo de siglas RAE
  const raePath = join(process.cwd(), 'siglas-rae.txt');
  let raeContent: string;

  try {
    raeContent = readFileSync(raePath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error leyendo ${raePath}:`, error);
    process.exit(1);
  }

  // 2. Parsear siglas RAE (formato: SIGLA|Significado)
  const raeLines = raeContent.split('\n').filter(line => line.trim());
  const raeSiglas: Array<{ sigla: string; significado: string }> = [];

  for (const line of raeLines) {
    const [rawSigla, rawSignificado] = line.split('|');
    const sigla = cleanSigla(rawSigla);
    const significado = cleanSignificado(rawSignificado);

    if (sigla && significado) {
      raeSiglas.push({ sigla, significado });
    }
  }

  // 3. Leer diccionario actual
  const dictPath = join(process.cwd(), 'src', 'data', 'dictionary.json');
  let dictContent: string;

  try {
    dictContent = readFileSync(dictPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error leyendo ${dictPath}:`, error);
    process.exit(1);
  }

  const currentDict: CompiledDictionary = JSON.parse(dictContent);

  // 4. Crear mapa de siglas existentes (normalizadas)
  const existingNormalized = new Set<string>();
  const existingSignificadosMap = new Map<string, Set<string>>();

  for (const entry of currentDict.entries) {
    const normalized = normalizeForDuplication(entry.original);
    existingNormalized.add(normalized);

    if (!existingSignificadosMap.has(normalized)) {
      existingSignificadosMap.set(normalized, new Set());
    }
    existingSignificadosMap.get(normalized)!.add(entry.significado);
  }

  // 5. Filtrar nuevas siglas (no duplicadas)
  const newSiglas: Array<{ sigla: string; significado: string; isNewMeaning: boolean }> = [];
  let duplicatesSkipped = 0;

  for (const { sigla, significado } of raeSiglas) {
    const normalized = normalizeForDuplication(sigla);

    // Verificar si es un duplicado exacto
    if (existingNormalized.has(normalized)) {
      const meanings = existingSignificadosMap.get(normalized);
      if (meanings && meanings.has(significado)) {
        // Duplicado exacto (sigla + significado ya existe)
        duplicatesSkipped++;
        continue;
      } else {
        // Misma sigla, diferente significado (conflicto nuevo)
        newSiglas.push({ sigla, significado, isNewMeaning: true });
      }
    } else {
      // Sigla completamente nueva
      newSiglas.push({ sigla, significado, isNewMeaning: false });
    }
  }

  // 6. Generar nuevas entradas
  let entryIdCounter = currentDict.entries.length + 1;
  const newEntries: DictionaryEntry[] = [];
  const newConflicts: Map<string, Array<{ id: string; significado: string; priority: number }>> = new Map();

  for (const { sigla, significado, isNewMeaning } of newSiglas) {
    const entryId = `entry-${String(entryIdCounter++).padStart(3, '0')}`;
    const priority = calculatePriority(sigla, significado);
    const variants = generateVariants(sigla);

    const entry: DictionaryEntry = {
      id: entryId,
      original: sigla,
      significado,
      variants,
      priority
    };

    newEntries.push(entry);

    // Si es un nuevo significado para una sigla existente, preparar para conflicto
    if (isNewMeaning) {
      const normalized = normalizeForDuplication(sigla);
      if (!newConflicts.has(normalized)) {
        newConflicts.set(normalized, []);
      }
      newConflicts.get(normalized)!.push({ id: entryId, significado, priority });
    }
  }

  // 7. Combinar entradas (existentes + nuevas)
  const allEntries = [...currentDict.entries, ...newEntries];

  // 8. Reconstruir índices
  const exactIndex: Record<string, string[]> = {};
  const normalizedIndex: Record<string, string[]> = {};

  for (const entry of allEntries) {
    for (const variant of entry.variants) {
      if (!exactIndex[variant]) {
        exactIndex[variant] = [];
      }
      exactIndex[variant].push(entry.id);

      const normalizedVariant = variant.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
      if (!normalizedIndex[normalizedVariant]) {
        normalizedIndex[normalizedVariant] = [];
      }
      normalizedIndex[normalizedVariant].push(entry.id);
    }
  }

  // 9. Reconstruir conflictos
  const allConflicts: ConflictInfo[] = [...currentDict.conflicts];

  // Actualizar conflictos existentes si hay nuevos significados
  for (const [normalized, newMeanings] of newConflicts) {
    // Buscar si ya existe un conflicto para esta sigla
    const existingConflict = allConflicts.find(c => normalizeForDuplication(c.sigla) === normalized);

    if (existingConflict) {
      // Añadir nuevos significados al conflicto existente
      existingConflict.variants.push(...newMeanings);
      // Re-ordenar por prioridad
      existingConflict.variants.sort((a, b) => b.priority - a.priority);
      existingConflict.defaultId = existingConflict.variants[0].id;
    } else {
      // Crear nuevo conflicto
      const siglaOriginal = newSiglas.find(s => normalizeForDuplication(s.sigla) === normalized)!.sigla;

      // Buscar todas las variantes (existentes + nuevas) para esta sigla normalizada
      const allVariantsForSigla: Array<{ id: string; significado: string; priority: number }> = [];

      for (const entry of allEntries) {
        if (normalizeForDuplication(entry.original) === normalized) {
          allVariantsForSigla.push({
            id: entry.id,
            significado: entry.significado,
            priority: entry.priority
          });
        }
      }

      if (allVariantsForSigla.length > 1) {
        allVariantsForSigla.sort((a, b) => b.priority - a.priority);
        allConflicts.push({
          sigla: siglaOriginal,
          variants: allVariantsForSigla,
          defaultId: allVariantsForSigla[0].id
        });
      }
    }
  }

  // 10. Crear diccionario actualizado
  const updatedDict: CompiledDictionary = {
    version: '1.1.0',
    buildDate: new Date().toISOString(),
    entries: allEntries,
    index: {
      exact: exactIndex,
      normalized: normalizedIndex
    },
    conflicts: allConflicts
  };

  // 11. Escribir diccionario actualizado
  try {
    writeFileSync(dictPath, JSON.stringify(updatedDict, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error escribiendo diccionario:', error);
    process.exit(1);
  }

  // 12. Reportar estadísticas
  console.error('✅ Diccionario actualizado correctamente');
  console.error('');
  console.error('📊 Estadísticas:');
  console.error(`   • Siglas RAE procesadas: ${raeSiglas.length}`);
  console.error(`   • Duplicados omitidos: ${duplicatesSkipped}`);
  console.error(`   • Nuevas siglas añadidas: ${newEntries.length}`);
  console.error(`   • Total siglas en diccionario anterior: ${currentDict.entries.length}`);
  console.error(`   • Total siglas en diccionario actualizado: ${updatedDict.entries.length}`);
  console.error(`   • Total conflictos: ${updatedDict.conflicts.length}`);
  console.error('');
}

// Ejecutar
mergeSiglas();
