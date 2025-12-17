/**
 * legal-expand - Definiciones de tipos TypeScript
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Este archivo contiene todas las definiciones de tipos e interfaces TypeScript
 * utilizadas en el paquete. Proporciona type safety y autocompletado en IDEs.
 */

// ============================================================================
// OPCIONES Y CONFIGURACIÓN
// ============================================================================

/**
 * Opciones de expansión de siglas
 *
 * Configura el comportamiento de la función expandirSiglas() permitiendo
 * controlar el formato de salida, el manejo de duplicados, y qué siglas expandir.
 */
export interface ExpansionOptions {
  /**
   * Formato de salida deseado
   * @default 'plain'
   */
  format?: 'plain' | 'html' | 'structured';

  /**
   * Si true, ignora la configuración global y siempre expande
   * Si false, ignora la configuración global y nunca expande
   * Si undefined, respeta la configuración global
   * @default undefined
   */
  forceExpansion?: boolean;

  /**
   * Si true, mantiene las mayúsculas originales de la sigla
   * @default true
   */
  preserveCase?: boolean;

  /**
   * Resolver automáticamente duplicados usando el primer significado (por prioridad)
   * Si false, no expandirá siglas con múltiples significados
   * @default false
   */
  autoResolveDuplicates?: boolean;

  /**
   * Mapa personalizado para resolver duplicados específicos
   * @example { 'DGT': 'Dirección General de Tributos' }
   */
  duplicateResolution?: Record<string, string>;

  /**
   * Si true, expande solo la primera ocurrencia de cada sigla
   * @default false
   */
  expandOnlyFirst?: boolean;

  /**
   * Lista de siglas a ignorar (no expandir)
   * @example ['art.', 'CC']
   */
  exclude?: string[];

  /**
   * Lista de siglas a incluir (solo expandir estas)
   * Si se proporciona, solo se expandirán las siglas en esta lista
   * @example ['AEAT', 'BOE']
   */
  include?: string[];
}

/**
 * Información de una sigla expandida encontrada en el texto
 */
export interface ExpandedAcronym {
  /** Sigla original encontrada en el texto */
  acronym: string;

  /** Significado completo de la sigla */
  expansion: string;

  /** Posición en el texto original */
  position: {
    start: number;
    end: number;
  };

  /** Indica si la sigla tiene múltiples significados posibles */
  hasMultipleMeanings: boolean;

  /** Todos los significados posibles (si hay duplicados) */
  allMeanings?: string[];
}

/**
 * Salida estructurada con metadata completa
 */
export interface StructuredOutput {
  /** Texto original sin modificar */
  originalText: string;

  /** Texto con siglas expandidas */
  expandedText: string;

  /** Lista de todas las siglas encontradas y expandidas */
  acronyms: ExpandedAcronym[];

  /** Estadísticas de la expansión */
  stats: {
    /** Total de siglas detectadas en el texto */
    totalAcronymsFound: number;

    /** Total de siglas efectivamente expandidas */
    totalExpanded: number;

    /** Total de siglas ambiguas que no se expandieron */
    ambiguousNotExpanded: number;
  };
}

/**
 * Configuración global del paquete
 */
export interface GlobalConfig {
  /**
   * Activar/desactivar expansión globalmente
   * @default true
   */
  enabled?: boolean;

  /**
   * Opciones por defecto para todas las expansiones
   */
  defaultOptions?: Partial<ExpansionOptions>;
}

/**
 * Interfaz base para formatters personalizados
 */
export interface Formatter {
  format(
    originalText: string,
    expansions: Map<ExpandedAcronym, string>
  ): string | StructuredOutput;
}

/**
 * Resultado de búsqueda de una sigla en el diccionario
 */
export interface AcronymSearchResult {
  /** Sigla buscada */
  acronym: string;

  /** Lista de significados encontrados */
  meanings: string[];

  /** Indica si hay múltiples significados (duplicados) */
  hasDuplicates: boolean;
}

/**
 * Estadísticas del diccionario de siglas
 */
export interface DictionaryStats {
  /** Total de siglas únicas en el diccionario */
  totalAcronyms: number;

  /** Número de siglas con múltiples significados */
  acronymsWithDuplicates: number;

  /** Número de siglas que contienen puntuación */
  acronymsWithPunctuation: number;
}

/**
 * Formato interno del diccionario compilado (generado en build time)
 * @internal
 */
export interface CompiledDictionary {
  version: string;
  buildDate: string;
  entries: DictionaryEntry[];
  index: {
    exact: Record<string, string[]>;
    normalized: Record<string, string[]>;
  };
  conflicts: ConflictInfo[];
}

/**
 * Entrada individual del diccionario
 * @internal
 */
export interface DictionaryEntry {
  id: string;
  original: string;
  significado: string;
  variants: string[];
  priority: number;
}

/**
 * Información de conflictos/duplicados
 * @internal
 */
export interface ConflictInfo {
  sigla: string;
  variants: Array<{
    id: string;
    significado: string;
    priority: number;
  }>;
  defaultId: string;
}

/**
 * Configuración interna global (uso interno)
 * @internal
 */
export interface InternalGlobalConfig {
  enabled: boolean;
  defaultOptions: {
    format: 'plain' | 'html' | 'structured';
    forceExpansion: boolean | undefined;
    preserveCase: boolean;
    autoResolveDuplicates: boolean;
    duplicateResolution: Record<string, string>;
    expandOnlyFirst: boolean;
    exclude: string[];
    include: string[] | undefined;
  };
}

/**
 * Información de un match encontrado (uso interno)
 * @internal
 */
export interface MatchInfo {
  original: string;
  expansion: string;
  startPos: number;
  endPos: number;
  confidence: number;
  hasMultipleMeanings: boolean;
  allMeanings?: string[];
}
