/**
 * legal-expand - Tipos TypeScript
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Definiciones de tipos para la landing page.
 */

export interface DictionaryEntry {
  id: string;
  original: string;
  significado: string;
  variants: string[];
  priority: number;
}

export interface CompiledDictionary {
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

export type Category = 'Todas' | 'Impuestos' | 'Leyes' | 'Organismos' | 'Abreviaturas' | 'Otros';
