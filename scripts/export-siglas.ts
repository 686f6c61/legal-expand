/**
 * legal-expand - Script de Exportación: JSON → TXT Listado
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Script utilitario que exporta el diccionario compilado a un archivo de texto
 * plano legible por humanos, organizado alfabéticamente.
 *
 * FORMATO DE SALIDA:
 * - Encabezado con estadísticas
 * - Agrupación por letra inicial
 * - Marcador (*) para siglas con múltiples significados
 * - Formato: "  SIGLA → Significado"
 *
 * PROPÓSITO:
 * - Revisión manual del diccionario
 * - Documentación para usuarios finales
 * - Control de calidad de datos
 * - Compartir listado en formato no-técnico
 *
 * CUÁNDO EJECUTAR:
 * - Para generar documentación actualizada
 * - Antes de releases para validación
 * - Cuando se necesite un listado legible
 *
 * SALIDA: siglas-listado.txt en la raíz del proyecto
 * COMANDO: npm run export-siglas
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface DictionaryEntry {
  id: string;
  original: string;
  significado: string;
  variants: string[];
  priority: number;
}

interface CompiledDictionary {
  version: string;
  buildDate: string;
  entries: DictionaryEntry[];
  index: {
    exact: Record<string, string[]>;
    normalized: Record<string, string[]>;
  };
  conflicts: Array<{
    sigla: string;
    defaultId: string;
    variants: Array<{
      id: string;
      significado: string;
      priority: number;
    }>;
  }>;
}

/**
 * Función principal de exportación.
 *
 * Lee el diccionario compilado, organiza las siglas alfabéticamente,
 * y genera un archivo TXT legible con formato estructurado.
 */
function exportarSiglas() {
  // Leer dictionary.json compilado
  const dictPath = join(process.cwd(), 'src', 'data', 'dictionary.json');
  const dictContent = readFileSync(dictPath, 'utf-8');
  const dictionary: CompiledDictionary = JSON.parse(dictContent);

  // Preparar array de siglas para procesamiento
  const siglas: Array<{ sigla: string; significado: string; hasDuplicates: boolean }> = [];

  // Crear mapa de conflictos para marcar siglas con múltiples significados
  const conflictosMap = new Set(dictionary.conflicts.map(c => c.sigla));

  for (const entry of dictionary.entries) {
    const hasDuplicates = conflictosMap.has(entry.original);

    siglas.push({
      sigla: entry.original,
      significado: entry.significado,
      hasDuplicates
    });
  }

  // Ordenar alfabéticamente por sigla
  siglas.sort((a, b) => a.sigla.localeCompare(b.sigla, 'es'));

  // Contar siglas con duplicados
  const siglasDuplicadas = siglas.filter(s => s.hasDuplicates).length;

  // Generar contenido del archivo TXT
  const lineas: string[] = [];

  lineas.push('SIGLAS LEGALES ESPAÑOLAS');
  lineas.push('='.repeat(80));
  lineas.push('');
  lineas.push(`Total de siglas: ${siglas.length}`);
  lineas.push(`Siglas con múltiples significados: ${siglasDuplicadas}`);
  lineas.push(`Versión del diccionario: ${dictionary.version}`);
  lineas.push(`Fecha de build: ${dictionary.buildDate}`);
  lineas.push(`Fecha de exportación: ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  lineas.push('');
  lineas.push('-'.repeat(80));
  lineas.push('');

  // Agrupar por categoría (opcional: basado en la primera letra)
  const categorias: Map<string, typeof siglas> = new Map();

  for (const sigla of siglas) {
    const letra = sigla.sigla[0].toUpperCase();
    if (!categorias.has(letra)) {
      categorias.set(letra, []);
    }
    categorias.get(letra)!.push(sigla);
  }

  // Generar listado por categoría
  for (const [letra, siglasPorLetra] of Array.from(categorias.entries()).sort()) {
    lineas.push(`[${letra}]`);
    lineas.push('');

    for (const { sigla, significado, hasDuplicates } of siglasPorLetra) {
      // Formatear para que quede alineado
      const marca = hasDuplicates ? ' *' : '  ';
      const linea = `${marca} ${sigla.padEnd(20)} → ${significado}`;
      lineas.push(linea);
    }

    lineas.push('');
  }

  // Añadir leyenda si hay duplicados
  if (siglasDuplicadas > 0) {
    lineas.push('-'.repeat(80));
    lineas.push('');
    lineas.push('LEYENDA:');
    lineas.push('  * = Sigla con múltiples significados posibles');
    lineas.push('');
  }

  lineas.push('-'.repeat(80));
  lineas.push('');
  lineas.push('Generado por: legal-expand');
  lineas.push('Comando: npm run export-siglas');
  lineas.push('');

  // Escribir archivo
  const outputPath = join(process.cwd(), 'siglas-listado.txt');
  const contenido = lineas.join('\n');
  writeFileSync(outputPath, contenido, 'utf-8');
}

// Ejecutar
exportarSiglas();
