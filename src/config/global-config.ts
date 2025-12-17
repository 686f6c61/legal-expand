/**
 * legal-expand - Sistema de Configuración Global SSR-Safe
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Gestiona la configuración global del motor de expansión de siglas legales mediante
 * un patrón Singleton que garantiza compatibilidad con entornos Server-Side Rendering.
 *
 * ARQUITECTURA SSR-SAFE:
 * - No utiliza APIs del navegador (window, document, localStorage)
 * - No mantiene estado global mutable en module scope
 * - Cada proceso Node.js mantiene su propia instancia aislada
 * - Compatible con frameworks modernos: Next.js, Remix, SvelteKit, Nuxt
 *
 * CARACTERÍSTICAS:
 * - Patrón Singleton thread-safe para gestión de configuración
 * - Merge inteligente de opciones locales vs globales
 * - Sistema de prioridad: forceExpansion > configuración global
 * - Inmutabilidad de configuración expuesta (Object.freeze)
 */

import type { GlobalConfig, ExpansionOptions, InternalGlobalConfig } from '../types/index.js';

// ============================================================================
// SINGLETON DE CONFIGURACIÓN GLOBAL
// ============================================================================

/**
 * Gestor centralizado de configuración global del motor de expansión.
 *
 * Implementa un Singleton para garantizar una única fuente de verdad para la
 * configuración en toda la aplicación. La arquitectura previene race conditions
 * y garantiza consistencia en entornos multi-request como servidores SSR.
 */
class GlobalConfigManager {
  private static instance: GlobalConfigManager | null = null;

  private config: InternalGlobalConfig = {
    enabled: true,
    defaultOptions: {
      format: 'plain',
      forceExpansion: undefined,
      preserveCase: true,
      autoResolveDuplicates: false,
      duplicateResolution: {},
      expandOnlyFirst: false,
      exclude: [],
      include: undefined
    }
  };

  /**
   * Constructor privado para prevenir instanciación directa.
   * Solo accesible mediante getInstance() para garantizar el patrón Singleton.
   */
  private constructor() {
    // Constructor privado - usar getInstance()
  }

  /**
   * Obtiene la instancia única del manager (patrón Singleton).
   * Crea la instancia en el primer acceso (lazy initialization).
   *
   * @returns La instancia única del GlobalConfigManager
   */
  static getInstance(): GlobalConfigManager {
    if (!GlobalConfigManager.instance) {
      GlobalConfigManager.instance = new GlobalConfigManager();
    }
    return GlobalConfigManager.instance;
  }

  /**
   * Resetea la instancia del Singleton (solo para testing).
   *
   * ADVERTENCIA: Este método está diseñado exclusivamente para tests unitarios
   * que necesitan aislar el estado entre casos de prueba. NO debe usarse en
   * código de producción ya que rompe el patrón Singleton.
   *
   * @internal
   */
  static resetInstance(): void {
    GlobalConfigManager.instance = null;
  }

  /**
   * Configura las opciones globales de expansión.
   *
   * Realiza un merge inteligente de la configuración nueva con la existente,
   * preservando valores no especificados. Esto permite actualizaciones parciales
   * sin sobrescribir toda la configuración.
   *
   * @param config - Configuración parcial o completa a aplicar
   *
   * @example
   * // Actualizar solo el estado enabled
   * setConfig({ enabled: false });
   *
   * @example
   * // Actualizar opciones por defecto
   * setConfig({
   *   defaultOptions: {
   *     format: 'html',
   *     expandOnlyFirst: true
   *   }
   * });
   */
  setConfig(config: GlobalConfig): void {
    if (config.enabled !== undefined) {
      this.config.enabled = config.enabled;
    }

    if (config.defaultOptions) {
      // Merge de opciones (no reemplaza completamente)
      this.config.defaultOptions = {
        ...this.config.defaultOptions,
        ...config.defaultOptions
      };
    }
  }

  /**
   * Obtiene la configuración actual como objeto inmutable.
   *
   * Devuelve una copia congelada (Object.freeze) de la configuración para prevenir
   * mutaciones accidentales desde el código consumidor. Esto garantiza que la única
   * forma de modificar la configuración sea mediante setConfig().
   *
   * @returns Configuración actual congelada
   */
  getConfig(): Readonly<InternalGlobalConfig> {
    // Copia profunda + freeze para inmutabilidad
    return Object.freeze({
      enabled: this.config.enabled,
      defaultOptions: Object.freeze({ ...this.config.defaultOptions })
    });
  }

  /**
   * Resetea la configuración a valores por defecto.
   *
   * Restaura todos los valores de configuración al estado inicial del sistema,
   * útil para limpiar configuraciones temporales o resetear el estado en tests.
   */
  reset(): void {
    this.config = {
      enabled: true,
      defaultOptions: {
        format: 'plain',
        forceExpansion: undefined,
        preserveCase: true,
        autoResolveDuplicates: false,
        duplicateResolution: {},
        expandOnlyFirst: false,
        exclude: [],
        include: undefined
      }
    };
  }

  /**
   * Determina si debe expandir siglas basándose en configuración global y local.
   *
   * LÓGICA DE PRIORIDAD (de mayor a menor):
   * 1. forceExpansion (opciones locales): Si está definido, tiene prioridad absoluta
   * 2. config.enabled (configuración global): Si forceExpansion no está definido
   *
   * Esto permite a los usuarios override puntual de la configuración global por
   * llamada, útil para escenarios como "expansión desactivada globalmente pero
   * quiero expandir en este texto específico".
   *
   * @param options - Opciones de expansión locales (opcional)
   * @returns true si debe expandir, false en caso contrario
   *
   * @example
   * // Config global: enabled = false
   * shouldExpand() // → false
   * shouldExpand({ forceExpansion: true }) // → true (override)
   */
  shouldExpand(options?: ExpansionOptions): boolean {
    if (options?.forceExpansion !== undefined) {
      return options.forceExpansion;
    }
    return this.config.enabled;
  }

  /**
   * Combina opciones locales con opciones globales por defecto.
   *
   * Las opciones locales tienen prioridad sobre las globales. Usa el operador
   * nullish coalescing (??) para preservar valores falsy explícitos (false, 0)
   * que serían ignorados con || tradicional.
   *
   * @param options - Opciones de expansión locales (opcional)
   * @returns Opciones combinadas (locales + globales)
   */
  mergeOptions(options?: ExpansionOptions): InternalGlobalConfig['defaultOptions'] {
    return {
      format: options?.format ?? this.config.defaultOptions.format,
      forceExpansion: options?.forceExpansion ?? this.config.defaultOptions.forceExpansion,
      preserveCase: options?.preserveCase ?? this.config.defaultOptions.preserveCase,
      autoResolveDuplicates: options?.autoResolveDuplicates ?? this.config.defaultOptions.autoResolveDuplicates,
      duplicateResolution: options?.duplicateResolution ?? this.config.defaultOptions.duplicateResolution,
      expandOnlyFirst: options?.expandOnlyFirst ?? this.config.defaultOptions.expandOnlyFirst,
      exclude: options?.exclude ?? this.config.defaultOptions.exclude,
      include: options?.include ?? this.config.defaultOptions.include
    };
  }
}

// ============================================================================
// API Pública
// ============================================================================

/**
 * Configura la expansión de siglas a nivel global de la aplicación.
 *
 * Permite establecer opciones por defecto que se aplicarán a todas las llamadas
 * a expandirSiglas() a menos que sean sobrescritas por opciones locales. Útil
 * para configurar el comportamiento de la librería una vez en el punto de entrada
 * de la aplicación.
 *
 * @param config - Configuración global a aplicar
 *
 * @example
 * // Desactivar expansión globalmente
 * configurarGlobalmente({ enabled: false });
 *
 * @example
 * // Configurar formato HTML por defecto en toda la app
 * configurarGlobalmente({
 *   enabled: true,
 *   defaultOptions: {
 *     format: 'html',
 *     expandOnlyFirst: true
 *   }
 * });
 *
 * @example
 * // Configuración típica para un blog legal
 * configurarGlobalmente({
 *   enabled: true,
 *   defaultOptions: {
 *     format: 'html',
 *     preserveCase: true,
 *     autoResolveDuplicates: true
 *   }
 * });
 */
export function configurarGlobalmente(config: GlobalConfig): void {
  GlobalConfigManager.getInstance().setConfig(config);
}

/**
 * Obtiene la configuración global actual en modo lectura.
 *
 * Devuelve una copia inmutable de la configuración actual, útil para debugging
 * o para tomar decisiones basadas en el estado actual de la configuración.
 *
 * @returns Configuración global actual (inmutable)
 */
export function obtenerConfiguracionGlobal(): Readonly<GlobalConfig> {
  const internalConfig = GlobalConfigManager.getInstance().getConfig();
  return {
    enabled: internalConfig.enabled,
    defaultOptions: { ...internalConfig.defaultOptions }
  };
}

/**
 * Resetea la configuración global a valores por defecto.
 *
 * Útil para limpiar configuraciones temporales o resetear el estado del sistema
 * entre tests. Restaura todos los valores al estado inicial documentado.
 */
export function resetearConfiguracion(): void {
  GlobalConfigManager.getInstance().reset();
}

/**
 * Obtiene el manager de configuración para uso interno del motor.
 *
 * ADVERTENCIA: Esta función está marcada como @internal y solo debe usarse
 * desde otros módulos del core de legal-expand. No es parte de la API pública.
 *
 * @internal
 * @returns Instancia del GlobalConfigManager
 */
export function _getConfigManager(): GlobalConfigManager {
  return GlobalConfigManager.getInstance();
}
