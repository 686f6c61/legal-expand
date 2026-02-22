/**
 * legal-expand - Formatter de Texto Plano
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Formatea siglas expandidas en texto plano simple, añadiendo el significado
 * entre paréntesis inmediatamente después de cada sigla.
 *
 * FORMATO DE SALIDA:
 * "AEAT (Agencia Estatal de Administración Tributaria)"
 *
 * USO TÍPICO:
 * - Documentos de texto plano (.txt)
 * - Emails en formato texto
 * - Consola / logs
 * - Conversión a otros formatos que no soportan markup
 *
 * VENTAJAS:
 * - Universal: Funciona en cualquier contexto
 * - Legible: No requiere interpretación de tags
 * - Simple: Formato más básico y directo
 */

import type { Formatter } from './base.js';
import type { MatchInfo } from '../types/index.js';

/**
 * Formatter que produce texto plano con expansiones inline.
 *
 * Es el formatter por defecto de la librería debido a su universalidad
 * y simplicidad. No añade ningún markup, solo inserta el significado
 * entre paréntesis.
 */
export class PlainTextFormatter implements Formatter {
  /**
   * Formatea el texto insertando expansiones entre paréntesis.
   *
   * ALGORITMO:
   * 1. Ordena matches en orden descendente (previene invalidación de índices)
   * 2. Inserta " (significado)" después de cada sigla encontrada
   * 3. Procesa desde el final del texto hacia el inicio
   *
   * @param originalText - Texto original
   * @param matches - Matches encontrados
   * @returns Texto plano con expansiones inline
   */
  format(originalText: string, matches: MatchInfo[]): string {
    if (matches.length === 0) {
      return originalText;
    }

    // Ordenar descendente para no afectar índices al reemplazar
    const sortedMatches = [...matches].sort((a, b) => b.startPos - a.startPos);

    let result = originalText;

    for (const match of sortedMatches) {
      // Reemplazar el segmento por el formato canónico + expansión.
      const before = result.substring(0, match.startPos);
      const after = result.substring(match.endPos);
      result = `${before}${match.original} (${match.expansion})${after}`;
    }

    return result;
  }
}
