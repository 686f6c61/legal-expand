/**
 * legal-expand - Interfaz Base de Formatters
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Define el contrato que todos los formatters deben implementar para transformar
 * matches de siglas en diferentes formatos de salida.
 *
 * PATRÓN DE DISEÑO:
 * Usa el patrón Strategy para permitir diferentes estrategias de formateo
 * intercambiables. Cada formatter implementa esta interfaz y puede ser registrado
 * en el FormatterFactory.
 *
 * FORMATTERS BUILT-IN:
 * - PlainTextFormatter: Texto plano "AEAT (Agencia...)"
 * - HtmlFormatter: Semantic HTML con <abbr> tags
 * - StructuredFormatter: Objeto JSON con metadata
 *
 * EXTENSIBILIDAD:
 * Los usuarios pueden crear formatters personalizados implementando esta interfaz
 * y registrándolos via FormatterFactory.registerFormatter().
 */

import type { MatchInfo, StructuredOutput } from '../types/index.js';

/**
 * Interfaz que deben implementar todos los formatters.
 *
 * Un formatter toma el texto original y los matches encontrados, y produce
 * una representación formateada según su estrategia específica.
 */
export interface Formatter {
  /**
   * Transforma texto y matches en el formato de salida deseado.
   *
   * @param originalText - Texto original sin modificar
   * @param matches - Array de matches encontrados por el matcher
   * @returns Texto formateado (string) o estructura de datos (StructuredOutput)
   */
  format(originalText: string, matches: MatchInfo[]): string | StructuredOutput;
}
