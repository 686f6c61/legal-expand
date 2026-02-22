/**
 * legal-expand - Motor Principal de Expansión de Siglas
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Punto de entrada principal del motor de expansión de siglas legales españolas.
 * Orquesta el flujo completo: configuración → matching → formateo → salida.
 *
 * ARQUITECTURA:
 * 1. Verifica configuración global y opciones locales
 * 2. Delega detección de siglas al módulo matcher
 * 3. Aplica el formatter apropiado según opciones
 * 4. Retorna el texto expandido o datos estructurados
 *
 * RESPONSABILIDADES:
 * - Coordinar los diferentes módulos del sistema
 * - Validar y combinar opciones de configuración
 * - Proporcionar la API pública de alto nivel
 * - Manejar casos edge (texto vacío, expansión desactivada)
 *
 * INTEGRACIÓN CON OTROS MÓDULOS:
 * - global-config: Gestión de configuración y opciones
 * - matcher: Detección y validación de siglas en texto
 * - formatters: Transformación de matches a salida formateada
 */

import type {
  DiagnosticOutput,
  ExpansionOptions,
  OmittedAcronym,
  StructuredOutput
} from '../types/index.js';
import { _getConfigManager } from '../config/global-config.js';
import { getMatcher } from './matcher.js';
import { FormatterFactory } from '../formatters/index.js';
import { StructuredFormatter } from '../formatters/structured.js';

// ============================================================================
// API PRINCIPAL DE EXPANSIÓN
// ============================================================================

/**
 * Expande siglas legales españolas encontradas en un texto.
 *
 * Función principal de la librería. Analiza el texto de entrada, identifica siglas
 * legales del diccionario y las expande según las opciones configuradas. Soporta
 * múltiples formatos de salida y control granular del comportamiento.
 *
 * FLUJO DE PROCESAMIENTO:
 * 1. Verifica si la expansión está habilitada (respeta forceExpansion)
 * 2. Combina opciones locales con configuración global
 * 3. Busca matches de siglas usando el matcher
 * 4. Aplica el formatter según el formato especificado
 * 5. Retorna el resultado en el formato solicitado
 *
 * @param texto - Texto a procesar
 * @param opciones - Opciones de expansión (opcional)
 * @returns Texto expandido (string) o datos estructurados (StructuredOutput)
 *
 * @example
 * // Uso básico
 * expandirSiglas('La AEAT notifica el IVA')
 * // → 'La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido)'
 *
 * @example
 * // Forzar expansión aunque esté desactivado globalmente
 * configurarGlobalmente({ enabled: false });
 * expandirSiglas('Texto con AEAT', { forceExpansion: true })
 *
 * @example
 * // Formato HTML con semantic markup
 * expandirSiglas('La AEAT...', { format: 'html' })
 * // → 'La <abbr title="Agencia Estatal de Administración Tributaria">AEAT</abbr> (Agencia...)'
 *
 * @example
 * // Obtener objeto estructurado para análisis
 * const result = expandirSiglas('Texto con AEAT', { format: 'structured' });
 * console.log(result.stats.totalExpanded); // 1
 * console.log(result.acronyms[0].expansion); // "Agencia Estatal de Administración Tributaria"
 *
 * @example
 * // Expandir solo primera ocurrencia de cada sigla
 * expandirSiglas('AEAT procesa IVA. AEAT cobra IVA.', { expandOnlyFirst: true })
 * // → Solo expande las primeras ocurrencias de AEAT e IVA
 */
export function expandirSiglas(
  texto: string,
  opciones?: ExpansionOptions
): string | StructuredOutput {
  const configManager = _getConfigManager();

  // Verificar si debe expandir (respeta forceExpansion sobre config.enabled)
  if (!configManager.shouldExpand(opciones)) {
    // Expansión desactivada: retornar texto sin modificar
    if (opciones?.format === 'structured') {
      // Para formato estructurado, retornar objeto vacío pero válido
      return {
        originalText: texto,
        expandedText: texto,
        acronyms: [],
        stats: {
          totalAcronymsFound: 0,
          totalExpanded: 0,
          ambiguousNotExpanded: 0
        }
      };
    }
    return texto;
  }

  // Combinar opciones locales con defaults globales (locales tienen prioridad)
  const mergedOptions = configManager.mergeOptions(opciones);

  // Obtener instancia del matcher (Singleton)
  const matcher = getMatcher();

  // Buscar todas las siglas en el texto
  const { matches, stats } = matcher.findMatches(texto, mergedOptions);

  // Aplicar el formatter apropiado para el formato solicitado
  const formatter = FormatterFactory.getFormatter(mergedOptions.format);
  if (mergedOptions.format === 'structured' && formatter instanceof StructuredFormatter) {
    return formatter.formatWithStats(texto, matches, stats);
  }

  return formatter.format(texto, matches);
}

/**
 * Expande siglas y devuelve diagnóstico completo de omisiones.
 *
 * Además de la salida estructurada estándar, incluye una lista de siglas
 * detectadas pero no expandidas, con la razón exacta de omisión.
 *
 * @param texto - Texto a procesar
 * @param opciones - Opciones de expansión (opcional)
 * @returns Objeto de diagnóstico con expansiones y omisiones
 */
export function expandirSiglasDetallado(
  texto: string,
  opciones?: ExpansionOptions
): DiagnosticOutput {
  const configManager = _getConfigManager();

  if (!configManager.shouldExpand(opciones)) {
    return {
      originalText: texto,
      expandedText: texto,
      acronyms: [],
      omittedAcronyms: [],
      stats: {
        totalAcronymsFound: 0,
        totalExpanded: 0,
        ambiguousNotExpanded: 0
      }
    };
  }

  const mergedOptions = configManager.mergeOptions(opciones);
  const matcher = getMatcher();
  const { matches, omittedMatches, stats } = matcher.findMatches(texto, mergedOptions);

  const structuredFormatter = new StructuredFormatter();
  const structured = structuredFormatter.formatWithStats(texto, matches, stats);

  const omittedAcronyms: OmittedAcronym[] = omittedMatches.map(omitted => ({
    acronym: omitted.original,
    position: {
      start: omitted.startPos,
      end: omitted.endPos
    },
    reason: omitted.reason,
    details: omitted.details
  }));

  return {
    ...structured,
    omittedAcronyms
  };
}

// ============================================================================
// API DE CONSULTA DEL DICCIONARIO
// ============================================================================

/**
 * Busca información sobre una sigla específica en el diccionario.
 *
 * Útil para construir UIs de autocompletado, tooltips o para validar si una
 * sigla está en el diccionario antes de procesarla. También indica si la sigla
 * tiene múltiples significados posibles (duplicados).
 *
 * @param sigla - La sigla a buscar (ej: "AEAT", "BOE")
 * @returns Objeto con información de la sigla, o null si no existe
 *
 * @example
 * buscarSigla('AEAT')
 * // → {
 * //   acronym: 'AEAT',
 * //   meanings: ['Agencia Estatal de Administración Tributaria'],
 * //   hasDuplicates: false
 * // }
 *
 * @example
 * buscarSigla('CE')
 * // → {
 * //   acronym: 'CE',
 * //   meanings: ['Constitución Española', 'Comunidad Europea'],
 * //   hasDuplicates: true
 * // }
 *
 * @example
 * buscarSigla('NOEXISTE')
 * // → null
 */
export function buscarSigla(sigla: string) {
  const matcher = getMatcher();
  return matcher.buscarSigla(sigla);
}

/**
 * Obtiene una lista de todas las siglas disponibles en el diccionario.
 *
 * Útil para generar índices, construir selectores de autocompletado o
 * para propósitos de documentación. Retorna las formas originales de las siglas
 * tal como aparecen en el diccionario fuente.
 *
 * @returns Array de strings con todas las siglas
 *
 * @example
 * const siglas = listarSiglas();
 * console.log(siglas.length); // ~800
 * console.log(siglas.slice(0, 5)); // ['AEAT', 'BOE', 'CC', 'CE', 'IVA']
 */
export function listarSiglas(): string[] {
  const matcher = getMatcher();
  return matcher.listarSiglas();
}

/**
 * Obtiene estadísticas generales sobre el diccionario de siglas.
 *
 * Proporciona métricas útiles para debugging, monitoreo y documentación del
 * tamaño y características del diccionario. Incluye conteo total de siglas,
 * siglas con múltiples significados y siglas que contienen puntuación.
 *
 * @returns Objeto con estadísticas del diccionario
 *
 * @example
 * const stats = obtenerEstadisticas();
 * // → {
 * //   totalAcronyms: 823,
 * //   acronymsWithDuplicates: 47,
 * //   acronymsWithPunctuation: 156
 * // }
 */
export function obtenerEstadisticas() {
  const matcher = getMatcher();
  return matcher.obtenerEstadisticas();
}
