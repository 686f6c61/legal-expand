/**
 * legal-expand - Formatter HTML con Semantic Markup
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Formatea siglas expandidas usando HTML semántico con tags <abbr> para mejorar
 * accesibilidad, SEO y experiencia de usuario.
 *
 * FORMATO DE SALIDA:
 * <abbr title="Agencia Estatal de Administración Tributaria">AEAT</abbr> (Agencia...)
 *
 * VENTAJAS DEL TAG <abbr>:
 * - Semántica: Indica explícitamente que es una abreviatura
 * - Accesibilidad: Screen readers pueden leer el título completo
 * - UX: Navegadores muestran tooltip con el significado al hover
 * - SEO: Motores de búsqueda entienden la relación sigla-significado
 *
 * SEGURIDAD:
 * Aplica escape de entidades HTML para prevenir XSS en caso de datos no confiables.
 */

import type { Formatter } from './base.js';
import type { MatchInfo } from '../types/index.js';

/**
 * Formatter que genera HTML semántico con tags <abbr>.
 *
 * Combina dos estrategias de representación:
 * 1. Tag <abbr> con title para accesibilidad y tooltips
 * 2. Expansión inline entre paréntesis para legibilidad directa
 */
export class HtmlFormatter implements Formatter {
  /**
   * Formatea el texto con HTML semántico.
   *
   * ALGORITMO:
   * 1. Ordena matches en orden descendente de posición (evita corrupción de índices)
   * 2. Para cada match, genera HTML con <abbr> + expansión inline
   * 3. Reemplaza desde el final hacia el inicio del texto
   *
   * @param originalText - Texto original
   * @param matches - Matches encontrados
   * @returns HTML con siglas expandidas
   */
  format(originalText: string, matches: MatchInfo[]): string {
    if (matches.length === 0) {
      return originalText;
    }

    // Ordenar descendente para no invalidar índices al reemplazar
    const sortedMatches = [...matches].sort((a, b) => b.startPos - a.startPos);

    let result = originalText;

    for (const match of sortedMatches) {
      const acronymText = match.original;

      // Generar reemplazo: <abbr> + expansión inline
      const replacement =
        `<abbr title="${this.escapeHtml(match.expansion)}">${this.escapeHtml(acronymText)}</abbr> ` +
        `(${this.escapeHtml(match.expansion)})`;

      result =
        result.substring(0, match.startPos) +
        replacement +
        result.substring(match.endPos);
    }

    return result;
  }

  /**
   * Escapa entidades HTML para prevenir XSS.
   *
   * Convierte caracteres especiales HTML en sus entidades equivalentes.
   * Necesario porque los significados vienen de datos externos (CSV).
   *
   * @param text - Texto a escapar
   * @returns Texto con entidades HTML escapadas
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
