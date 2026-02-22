/**
 * legal-expand - Expansión inteligente de siglas legales españolas
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * API pública del paquete. Este archivo exporta todas las funciones, tipos y
 * utilidades disponibles para los usuarios del paquete.
 *
 * @packageDocumentation
 */

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================
// Exportar funciones para expandir y buscar siglas en textos legales
export {
  expandirSiglas,
  expandirSiglasDetallado,
  buscarSigla,
  listarSiglas,
  obtenerEstadisticas
} from './core/engine.js';

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================
// Exportar funciones para gestionar la configuración global del paquete
// Permite activar/desactivar la expansión globalmente y definir opciones por defecto
export {
  configurarGlobalmente,
  obtenerConfiguracionGlobal,
  resetearConfiguracion
} from './config/global-config.js';

// ============================================================================
// FORMATTERS (EXTENSIBILIDAD)
// ============================================================================
// Exportar sistema de formatters para permitir formatos de salida personalizados
// Los usuarios pueden crear sus propios formatters registrándolos con FormatterFactory
export { FormatterFactory, type Formatter } from './formatters/index.js';

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================
// Exportar todos los tipos públicos para TypeScript
// Proporciona autocompletado e IntelliSense en IDEs
export type {
  DiagnosticOutput,
  ExpansionOptions,
  ExpandedAcronym,
  OmittedAcronym,
  OmittedAcronymReason,
  StructuredOutput,
  GlobalConfig,
  AcronymSearchResult,
  DictionaryStats
} from './types/index.js';
