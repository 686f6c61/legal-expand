/**
 * legal-expand - Factory y Registro de Formatters
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Factory centralizada para gestión de formatters con soporte de registro
 * dinámico de formatters personalizados.
 *
 * PATRÓN DE DISEÑO:
 * Implementa el patrón Factory para centralizar la creación de formatters
 * y permitir extensibilidad mediante registro de formatters custom.
 *
 * FORMATTERS BUILT-IN:
 * - 'plain': PlainTextFormatter (defecto)
 * - 'html': HtmlFormatter
 * - 'structured': StructuredFormatter
 *
 * EXTENSIBILIDAD:
 * Los desarrolladores pueden registrar formatters personalizados:
 * FormatterFactory.registerFormatter('markdown', new MarkdownFormatter())
 *
 * RESPONSABILIDADES:
 * - Mantener registro de formatters disponibles
 * - Proporcionar acceso type-safe a formatters
 * - Validar existencia de formatters solicitados
 * - Permitir extensión del sistema sin modificar código core
 */

import type { Formatter } from './base.js';
import { PlainTextFormatter } from './plain-text.js';
import { HtmlFormatter } from './html.js';
import { StructuredFormatter } from './structured.js';

/**
 * Factory centralizada para gestión de formatters.
 *
 * Mantiene un registro estático de formatters y proporciona métodos
 * para obtenerlos, registrar nuevos y listar los disponibles.
 */
export class FormatterFactory {
  private static formatters: Map<string, Formatter> = new Map<string, Formatter>([
    ['plain', new PlainTextFormatter()],
    ['html', new HtmlFormatter()],
    ['structured', new StructuredFormatter()]
  ]);

  /**
   * Obtiene un formatter por su nombre.
   *
   * Lanza error si el formatter solicitado no existe, proporcionando
   * lista de formatters disponibles para ayudar al debugging.
   *
   * @param format - Nombre del formatter ('plain', 'html', 'structured', etc.)
   * @returns Instancia del formatter solicitado
   * @throws Error si el formatter no existe
   *
   * @example
   * const formatter = FormatterFactory.getFormatter('html');
   */
  static getFormatter(format: string): Formatter {
    const formatter = this.formatters.get(format);
    if (!formatter) {
      throw new Error(
        `Unknown format: ${format}. Available formats: ${Array.from(this.formatters.keys()).join(', ')}`
      );
    }
    return formatter;
  }

  /**
   * Registra un formatter personalizado en el sistema.
   *
   * Permite a los usuarios extender la librería con formatters propios
   * sin necesidad de modificar el código fuente. El formatter debe
   * implementar la interfaz Formatter.
   *
   * @param name - Nombre identificador del formatter
   * @param formatter - Instancia del formatter que implementa Formatter
   *
   * @example
   * // Crear formatter personalizado
   * class MarkdownFormatter implements Formatter {
   *   format(text: string, matches: MatchInfo[]): string {
   *     // Implementación custom
   *   }
   * }
   *
   * // Registrar
   * FormatterFactory.registerFormatter('markdown', new MarkdownFormatter());
   *
   * // Usar
   * expandirSiglas('texto', { format: 'markdown' as any });
   */
  static registerFormatter(name: string, formatter: Formatter): void {
    this.formatters.set(name, formatter);
  }

  /**
   * Lista todos los nombres de formatters registrados.
   *
   * Útil para debugging, validación y construcción de UIs dinámicas
   * que permiten al usuario elegir el formato de salida.
   *
   * @returns Array con nombres de todos los formatters disponibles
   *
   * @example
   * const formats = FormatterFactory.listFormatters();
   * console.log(formats); // ['plain', 'html', 'structured']
   */
  static listFormatters(): string[] {
    return Array.from(this.formatters.keys());
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Exportar tipos y clases
export type { Formatter } from './base.js';
export { PlainTextFormatter } from './plain-text.js';
export { HtmlFormatter } from './html.js';
export { StructuredFormatter } from './structured.js';
