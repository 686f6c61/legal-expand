/**
 * Valida integridad del diccionario compilado antes de publicar.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CompiledDictionary, DictionaryEntry } from '../src/types/index.js';

function normalizeAcronym(value: string): string {
  return value.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
}

function loadDictionary(): CompiledDictionary {
  const filePath = resolve(process.cwd(), 'src/data/dictionary.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as CompiledDictionary;
}

function validateDictionary(dictionary: CompiledDictionary): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(dictionary.entries) || dictionary.entries.length === 0) {
    errors.push('El diccionario no contiene entradas.');
    return { errors, warnings };
  }

  const ids = new Set<string>();
  const originals = new Set<string>();

  for (const entry of dictionary.entries) {
    if (!entry.id?.trim()) {
      errors.push('Entrada con id vacío.');
      continue;
    }

    if (ids.has(entry.id)) {
      errors.push(`ID duplicado detectado: ${entry.id}`);
    }
    ids.add(entry.id);

    if (!entry.original?.trim()) {
      errors.push(`Entrada ${entry.id} sin sigla original.`);
    }

    if (!entry.significado?.trim()) {
      errors.push(`Entrada ${entry.id} sin significado.`);
    }

    if (!Array.isArray(entry.variants) || entry.variants.length === 0) {
      errors.push(`Entrada ${entry.id} no tiene variantes.`);
      continue;
    }

    if (!entry.variants.includes(entry.original)) {
      warnings.push(`Entrada ${entry.id} no incluye original en variants (${entry.original}).`);
    }

    const uniqueVariants = new Set(entry.variants);
    if (uniqueVariants.size !== entry.variants.length) {
      warnings.push(`Entrada ${entry.id} contiene variants repetidas.`);
    }

    if (originals.has(entry.original)) {
      warnings.push(`Sigla original repetida detectada: ${entry.original}`);
    }
    originals.add(entry.original);
  }

  const allIndexMaps = [
    { name: 'index.exact', map: dictionary.index.exact },
    { name: 'index.normalized', map: dictionary.index.normalized }
  ];

  for (const { name, map } of allIndexMaps) {
    for (const [key, value] of Object.entries(map)) {
      if (!key.trim()) {
        errors.push(`${name} contiene una clave vacía.`);
      }

      if (!Array.isArray(value) || value.length === 0) {
        errors.push(`${name}[${key}] no tiene IDs.`);
        continue;
      }

      for (const id of value) {
        if (!ids.has(id)) {
          errors.push(`${name}[${key}] referencia ID inexistente: ${id}`);
        }
      }
    }
  }

  const byNormalized = new Map<string, DictionaryEntry[]>();
  for (const entry of dictionary.entries) {
    const normalized = normalizeAcronym(entry.original);
    const current = byNormalized.get(normalized) ?? [];
    current.push(entry);
    byNormalized.set(normalized, current);
  }

  for (const conflict of dictionary.conflicts) {
    if (!conflict.sigla?.trim()) {
      errors.push('Conflicto con sigla vacía.');
      continue;
    }

    if (!ids.has(conflict.defaultId)) {
      errors.push(`Conflicto ${conflict.sigla} referencia defaultId inexistente: ${conflict.defaultId}`);
    }

    if (!Array.isArray(conflict.variants) || conflict.variants.length < 2) {
      warnings.push(`Conflicto ${conflict.sigla} tiene menos de 2 variantes.`);
      continue;
    }

    const conflictIds = new Set(conflict.variants.map(v => v.id));
    if (!conflictIds.has(conflict.defaultId)) {
      errors.push(`Conflicto ${conflict.sigla} no incluye defaultId dentro de variants.`);
    }

    for (const variant of conflict.variants) {
      if (!ids.has(variant.id)) {
        errors.push(`Conflicto ${conflict.sigla} referencia variant id inexistente: ${variant.id}`);
      }
      if (!Number.isFinite(variant.priority)) {
        errors.push(`Conflicto ${conflict.sigla} tiene prioridad inválida en ${variant.id}.`);
      }
    }
  }

  const conflictNormalizedSet = new Set(dictionary.conflicts.map(c => normalizeAcronym(c.sigla)));
  for (const [normalized, entries] of byNormalized.entries()) {
    if (entries.length > 1 && !conflictNormalizedSet.has(normalized)) {
      warnings.push(`Sigla ambigua sin bloque de conflicto: ${entries.map(e => e.original).join(', ')}`);
    }
  }

  return { errors, warnings };
}

function main() {
  const dictionary = loadDictionary();
  const { errors, warnings } = validateDictionary(dictionary);

  if (warnings.length > 0) {
    console.warn(`⚠️  Validación: ${warnings.length} warning(s)`);
    for (const warning of warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Validación: ${errors.length} error(es)`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`✅ Diccionario válido: ${dictionary.entries.length} entradas, ${dictionary.conflicts.length} conflictos.`);
}

main();
