/**
 * legal-expand - Script de Build: CSV → JSON Compilado
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Script de build-time que transforma el CSV de siglas legales en un diccionario
 * JSON optimizado para runtime con índices precomputados y resolución de conflictos.
 *
 * FLUJO DE PROCESAMIENTO:
 * 1. Lee siglas_legales.csv
 * 2. Parsea y limpia datos (espacios, puntuación, encoding)
 * 3. Genera variantes de matching para cada sigla
 * 4. Detecta y marca conflictos (siglas con múltiples significados)
 * 5. Aplica sistema de prioridades (manual + automático)
 * 6. Construye índices optimizados (exact, normalized)
 * 7. Escribe src/data/dictionary.json
 *
 * DECISIONES DE DISEÑO:
 * - Variantes generadas en build-time para performance en runtime
 * - Sistema de prioridades para resolver duplicados conocidos
 * - Índices múltiples para búsquedas O(1)
 * - Validación de datos y limpieza de typos
 *
 * CUÁNDO EJECUTAR:
 * - Después de modificar siglas_legales.csv
 * - Al añadir nuevas siglas al diccionario
 * - Como parte del proceso de release
 *
 * COMANDO: npm run build-data
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from 'csv-parse/sync';
import type { CompiledDictionary, DictionaryEntry, ConflictInfo } from '../src/types/index.js';

// ============================================================================
// CONFIGURACIÓN DE PRIORIDADES
// ============================================================================

/**
 * Prioridades manuales para resolver duplicados conocidos.
 *
 * Cuando una sigla tiene múltiples significados, estas prioridades
 * determinan cuál se usa por defecto. Prioridad 0 = excluir.
 */
const MANUAL_PRIORITIES: Record<string, Record<string, number>> = {
  'IVTM': {
    'Impuesto sobre vehículos de tracción mecánica': 100,
    'Iimpuesto sobre vehículos de tracción mecánica': 100, // Typo, pero es el correcto
    'Impuesto de Arrendamientos Urbanos': 0  // Error, debe ser IAU
  },
  'DGT': {
    'Dirección General de Tributos': 90,
    'Dirección General de Tráfico': 90
  },
  'CE': {
    'Constitución Española': 100,
    'Comunidad Europea': 80
  },
  'cfr.': {
    'confróntese': 100,
    'Confrontar': 95
  },
  'DUA': {
    'Documento Unico Aduanero': 100,
    'documento único administrativo': 90
  }
};

// ============================================================================
// FUNCIONES DE LIMPIEZA Y NORMALIZACIÓN
// ============================================================================

/**
 * Limpia una sigla eliminando espacios, tabs y caracteres problemáticos.
 *
 * @param sigla - Sigla raw del CSV
 * @returns Sigla limpia o null si inválida
 */
function cleanSigla(sigla: string | undefined): string | null {
  if (!sigla || typeof sigla !== 'string') return null;

  return sigla
    .trim()
    .replace(/\t/g, ' ')  // Tabs → espacios
    .replace(/\s+/g, ' '); // Espacios múltiples → uno solo
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

  // Remover punto final para consistencia (se puede añadir al mostrar)
  if (cleaned.endsWith('.')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Genera todas las variantes posibles de una sigla para matching
 */
function generateVariants(sigla: string): string[] {
  const variants = new Set<string>([sigla]); // Incluir original

  // Tipo 1: Variantes con/sin punto final
  if (sigla.endsWith('.')) {
    variants.add(sigla.slice(0, -1)); // "art." → "art"
  }

  // Tipo 2: Variantes con/sin puntos internos
  if (sigla.includes('.')) {
    const withoutPeriods = sigla.replace(/\./g, '');
    variants.add(withoutPeriods); // "A.E.A.T." → "AEAT"

    // También versión sin punto final si lo tenía
    if (sigla.endsWith('.')) {
      const withoutFinalPeriod = sigla.slice(0, -1);
      variants.add(withoutFinalPeriod.replace(/\./g, '')); // "A.E.A.T." → "AEAT"
    }
  }

  // Tipo 3: Variantes con/sin espacios internos
  if (sigla.includes(' ')) {
    const withoutSpaces = sigla.replace(/\s+/g, '');
    variants.add(withoutSpaces); // "II. EE." → "II.EE."

    // Combinación: sin espacios NI puntos
    const normalized = withoutSpaces.replace(/\./g, '');
    variants.add(normalized); // "II. EE." → "IIEE"
  }

  // Tipo 4: Casos especiales con slash
  if (sigla.includes('/')) {
    // "AT/EP" → split variants (pero no los añadimos como individuales)
    // Los splits se manejarán en el matching si es necesario
    const parts = sigla.split('/').map(p => p.trim());

    // Solo añadir versión sin slash
    variants.add(sigla.replace(/\//g, '')); // "AT/EP" → "ATEP"

    // Para casos como "CCom./CCo." → añadir ambas partes
    if (parts.length === 2 && parts[0].length > 1 && parts[1].length > 1) {
      parts.forEach(part => {
        if (part && part.length > 1) {
          variants.add(part);
        }
      });
    }
  }

  // Tipo 5: Variantes uppercase para lowercase con puntos
  if (sigla === sigla.toLowerCase() && sigla.includes('.')) {
    const upper = sigla.toUpperCase();
    variants.add(upper); // "art." → "ART."
    if (upper.endsWith('.')) {
      variants.add(upper.slice(0, -1)); // "ART." → "ART"
    }
  }

  return Array.from(variants);
}

/**
 * Normaliza una sigla para detección de duplicados
 * (solo para agrupar, no para matching)
 */
function normalizeForDuplication(sigla: string): string {
  return sigla
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, '')
    .replace(/\//g, '-'); // Mantener slash como distinción
}

/**
 * Calcula prioridad automática para una entrada
 */
function calculatePriority(sigla: string, significado: string): number {
  let priority = 100; // Base

  // Rule 1: Preferir definiciones cortas (más legibles)
  if (significado.length < 50) priority += 10;
  if (significado.length > 150) priority -= 10;

  // Rule 2: Preferir sin caracteres especiales en sigla
  if (!/[\\/]/.test(sigla)) priority += 5;

  // Rule 3: Preferir uppercase
  if (sigla === sigla.toUpperCase() && sigla.length > 1) priority += 5;

  // Rule 4: Dominio específico
  if (significado.includes('Impuesto')) priority += 15;
  if (significado.includes('Ley')) priority += 10;
  if (significado.includes('Reglamento')) priority += 10;
  if (significado.includes('Real Decreto Legislativo')) priority -= 5; // Muy específico

  return priority;
}

/**
 * Script principal de build
 */
function buildDictionary() {
  // 1. Leer CSV
  const csvPath = './siglas_legales.csv';
  let csvContent: string;

  try {
    csvContent = readFileSync(csvPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error leyendo ${csvPath}:`, error);
    process.exit(1);
  }

  // 2. Parsear CSV (manejar BOM UTF-8)
  let records: any[];
  try {
    // csv-parse maneja BOM automáticamente
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true  // Manejar BOM
    });
  } catch (error) {
    console.error('❌ Error parseando CSV:', error);
    process.exit(1);
  }

  // 3. Procesar y agrupar por sigla normalizada
  const grouped = new Map<string, Array<{ original: string; significado: string }>>();
  let skipped = 0;

  for (const record of records) {
    const sigla = cleanSigla(record.SIGLAS);
    const significado = cleanSignificado(record.SIGNIFICADO);

    if (!sigla || !significado) {
      skipped++;
      continue;
    }

    const normalized = normalizeForDuplication(sigla);

    if (!grouped.has(normalized)) {
      grouped.set(normalized, []);
    }

    const group = grouped.get(normalized)!;

    // Evitar duplicados exactos
    if (!group.some(item => item.original === sigla && item.significado === significado)) {
      group.push({ original: sigla, significado });
    }
  }


  // 4. Generar entradas del diccionario
  const entries: DictionaryEntry[] = [];
  const conflicts: ConflictInfo[] = [];
  const exactIndex: Record<string, string[]> = {};
  const normalizedIndex: Record<string, string[]> = {};

  let entryIdCounter = 1;
  let duplicatesCount = 0;
  let withPunctuation = 0;

  for (const [normalized, group] of grouped) {
    if (group.length > 1) {
      duplicatesCount++;
    }

    // Crear entradas para cada variante
    const conflictVariants: ConflictInfo['variants'] = [];

    for (const { original, significado } of group) {
      const entryId = `entry-${String(entryIdCounter++).padStart(3, '0')}`;

      // Calcular prioridad
      let priority = calculatePriority(original, significado);

      // Aplicar prioridades manuales
      if (MANUAL_PRIORITIES[original]?.[significado] !== undefined) {
        priority = MANUAL_PRIORITIES[original][significado];
      }

      // Generar variantes
      const variants = generateVariants(original);

      // Crear entrada
      const entry: DictionaryEntry = {
        id: entryId,
        original,
        significado,
        variants,
        priority
      };

      // Skip si prioridad es 0 (marcado para eliminar)
      if (priority === 0) {
        continue;
      }

      entries.push(entry);

      // Indexar por variantes
      for (const variant of variants) {
        if (!exactIndex[variant]) {
          exactIndex[variant] = [];
        }
        exactIndex[variant].push(entryId);

        const normalizedVariant = variant.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
        if (!normalizedIndex[normalizedVariant]) {
          normalizedIndex[normalizedVariant] = [];
        }
        normalizedIndex[normalizedVariant].push(entryId);
      }

      // Añadir a conflictos si es duplicado
      if (group.length > 1) {
        conflictVariants.push({ id: entryId, significado, priority });
      }

      // Contar puntuación
      if (original.includes('.')) {
        withPunctuation++;
      }
    }

    // Registrar conflicto si hay duplicados
    if (conflictVariants.length > 1) {
      // Ordenar por prioridad y elegir default
      conflictVariants.sort((a, b) => b.priority - a.priority);

      conflicts.push({
        sigla: group[0].original, // Usar original del primero
        variants: conflictVariants,
        defaultId: conflictVariants[0].id
      });
    }
  }


  // 5. Crear diccionario compilado
  const dictionary: CompiledDictionary = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    entries,
    index: {
      exact: exactIndex,
      normalized: normalizedIndex
    },
    conflicts
  };

  // 6. Escribir JSON
  mkdirSync('./src/data', { recursive: true });
  const outputPath = './src/data/dictionary.json';

  try {
    writeFileSync(outputPath, JSON.stringify(dictionary, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error escribiendo diccionario:', error);
    process.exit(1);
  }

}

// Ejecutar
buildDictionary();
