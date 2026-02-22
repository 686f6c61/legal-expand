/**
 * legal-expand - Formatter Estructurado JSON
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Formatter que devuelve un objeto estructurado con datos completos de las siglas
 * encontradas y estadísticas de procesamiento.
 *
 * FORMATO DE SALIDA:
 * {
 *   originalText: "texto original",
 *   expandedText: "texto expandido",
 *   acronyms: [...],
 *   stats: { totalAcronymsFound, totalExpanded, ambiguousNotExpanded }
 * }
 *
 * USO TÍPICO:
 * - APIs que necesitan retornar datos estructurados
 * - Análisis y procesamiento posterior de siglas
 * - UIs que muestran información detallada de cada sigla
 * - Sistemas de logging y auditoría
 * - Generación de reportes
 *
 * VENTAJAS:
 * - Máxima información: Posiciones, significados alternativos, stats
 * - Programático: Fácil de procesar por otros sistemas
 * - Flexible: Permite construir UIs personalizadas
 */

import type { Formatter } from './base.js';
import type { MatchInfo, MatchRunStats, StructuredOutput, ExpandedAcronym } from '../types/index.js';
import { PlainTextFormatter } from './plain-text.js';

/**
 * Formatter que produce un objeto JSON estructurado con metadata completa.
 *
 * Delega el formateo del texto expandido al PlainTextFormatter y añade
 * información estructurada sobre cada sigla encontrada más estadísticas
 * de procesamiento.
 */
export class StructuredFormatter implements Formatter {
  /**
   * Formatea el resultado estructurado usando estadísticas explícitas del matcher.
   *
   * @param originalText - Texto original
   * @param matches - Matches efectivamente expandidos
   * @param stats - Estadísticas del matcher (incluye ambiguas no expandidas)
   * @returns Objeto StructuredOutput con métricas consistentes
   */
  formatWithStats(
    originalText: string,
    matches: MatchInfo[],
    stats: MatchRunStats
  ): StructuredOutput {
    return this.buildOutput(originalText, matches, stats);
  }

  /**
   * Formatea el resultado como objeto JSON estructurado.
   *
   * ESTRUCTURA DE SALIDA:
   * - originalText: Texto sin modificar
   * - expandedText: Texto con expansiones (formato plain)
   * - acronyms: Array de objetos con datos de cada sigla
   * - stats: Estadísticas de procesamiento
   *
   * @param originalText - Texto original
   * @param matches - Matches encontrados
   * @returns Objeto StructuredOutput con datos completos
   */
  format(originalText: string, matches: MatchInfo[]): StructuredOutput {
    return this.buildOutput(originalText, matches);
  }

  private buildOutput(
    originalText: string,
    matches: MatchInfo[],
    stats?: MatchRunStats
  ): StructuredOutput {
    // Generar texto expandido reutilizando PlainTextFormatter
    const plainFormatter = new PlainTextFormatter();
    const expandedText = plainFormatter.format(originalText, matches);

    // Transformar matches internos a formato público ExpandedAcronym
    const acronyms: ExpandedAcronym[] = matches.map(match => ({
      acronym: match.original,
      expansion: match.expansion,
      position: {
        start: match.startPos,
        end: match.endPos
      },
      hasMultipleMeanings: match.hasMultipleMeanings,
      allMeanings: match.allMeanings
    }));

    // Calcular estadísticas de procesamiento
    const totalAcronymsFound = stats?.totalAcronymsFound ?? matches.length;
    const totalExpanded = matches.filter(m => !m.hasMultipleMeanings || m.expansion).length;
    const ambiguousNotExpanded = stats?.ambiguousNotExpanded ?? (totalAcronymsFound - totalExpanded);

    return {
      originalText,
      expandedText,
      acronyms,
      stats: {
        totalAcronymsFound,
        totalExpanded,
        ambiguousNotExpanded
      }
    };
  }
}
