/**
 * legal-expand - Utilidades de Normalización y Validación de Contexto
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Colección de funciones utilitarias para normalización de texto, detección de
 * contextos especiales y validación de word boundaries. Estas funciones son el
 * corazón de la precisión del matcher, previniendo false positives y permitiendo
 * búsquedas flexibles.
 *
 * CATEGORÍAS DE FUNCIONALIDADES:
 *
 * 1. NORMALIZACIÓN:
 *    - Eliminación de puntos, espacios y case-folding
 *    - Escape de caracteres especiales regex
 *    - Preparación de texto para comparación fuzzy
 *
 * 2. VALIDACIÓN DE WORD BOUNDARIES:
 *    - Detección de caracteres alfanuméricos (incluye acentos españoles)
 *    - Verificación de límites de palabra para prevenir matches parciales
 *
 * 3. DETECCIÓN DE CONTEXTOS ESPECIALES:
 *    - URLs (http://, www., patterns de dominio)
 *    - Emails (patterns completos de RFC)
 *    - Bloques de código markdown (```)
 *    - Código inline markdown (`)
 *
 * DECISIONES DE DISEÑO:
 * - Funciones puras sin efectos secundarios
 * - Búsqueda con ventana de contexto (100 chars) para performance
 * - Soporte completo de caracteres españoles (ñ, tildes)
 * - Detección heurística de contextos (no requiere parsing completo)
 */

// ============================================================================
// NORMALIZACIÓN DE TEXTO
// ============================================================================

/**
 * Normaliza una sigla para comparación case-insensitive y flexible.
 *
 * Remueve elementos que varían en la escritura pero no en el significado:
 * puntos de abreviación, espacios y diferencias de case. Esto permite matchear
 * "A.E.A.T." con "AEAT" o "a e a t".
 *
 * @param text - Texto a normalizar
 * @returns Texto normalizado (lowercase, sin puntos ni espacios)
 *
 * @example
 * normalize("A.E.A.T.") // → "aeat"
 * normalize("art.") // → "art"
 * normalize("II. EE.") // → "iiee"
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\./g, '')       // Remover puntos
    .replace(/\s+/g, '');     // Remover espacios
}

/**
 * Escapa caracteres especiales de regex para uso seguro en expresiones regulares.
 *
 * Previene que caracteres con significado especial en regex (como ., *, +, etc.)
 * sean interpretados literalmente cuando se construyen patrones dinámicamente.
 *
 * @param str - String a escapar
 * @returns String con caracteres especiales escapados
 *
 * @example
 * escapeRegex("art.") // → "art\\."
 * escapeRegex("C++") // → "C\\+\\+"
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// VALIDACIÓN DE WORD BOUNDARIES
// ============================================================================

/**
 * Verifica si un carácter es alfanumérico (incluye acentos españoles).
 *
 * Extiende la definición estándar de \w de JavaScript para incluir caracteres
 * españoles (ñ, tildes) que son comunes en siglas legales españolas.
 *
 * @param char - Carácter a verificar
 * @returns true si es alfanumérico (incluye español), false en caso contrario
 *
 * @example
 * isAlphanumeric('A') // → true
 * isAlphanumeric('ñ') // → true
 * isAlphanumeric('.') // → false
 */
export function isAlphanumeric(char: string): boolean {
  return /[a-zA-ZáéíóúñÑüÜ0-9]/.test(char);
}

/**
 * Verifica si hay word boundary en una posición del texto.
 *
 * Un word boundary existe cuando hay transición entre alfanumérico y no-alfanumérico.
 * Crucial para prevenir matches parciales como "AEAT" dentro de "CREATION".
 *
 * @param text - Texto completo
 * @param position - Posición a verificar
 * @param direction - Dirección del boundary ('before' o 'after')
 * @returns true si hay word boundary, false en caso contrario
 */
export function isWordBoundary(text: string, position: number, direction: 'before' | 'after'): boolean {
  if (direction === 'before') {
    if (position === 0) return true;
    const char = text[position - 1];
    return !isAlphanumeric(char);
  } else {
    if (position >= text.length) return true;
    const char = text[position];
    return !isAlphanumeric(char);
  }
}

// ============================================================================
// DETECCIÓN DE CONTEXTOS ESPECIALES
// ============================================================================

/**
 * Detecta si una posición está dentro de una URL.
 *
 * Usa ventanas de contexto para buscar patrones de URL sin necesidad de parsear
 * todo el documento. Detecta protocolos (http://), prefijos www, y patterns de dominio.
 *
 * RAZÓN: Prevenir expansión de siglas que forman parte de URLs como
 * "https://boe.es" donde "BOE" es parte del dominio, no una sigla a expandir.
 *
 * @param text - Texto completo
 * @param startPos - Inicio del potencial match
 * @param endPos - Fin del potencial match
 * @returns true si está dentro de una URL
 */
export function isInsideUrl(text: string, startPos: number, endPos: number): boolean {
  const window = 100;
  const before = text.substring(Math.max(0, startPos - window), startPos);
  const after = text.substring(endPos, Math.min(text.length, endPos + window));

  // Buscar protocolo HTTP/HTTPS
  if (/https?:\/\/\S*$/.test(before)) {
    return true;
  }

  // Buscar www
  if (/www\.\S*$/.test(before)) {
    return true;
  }

  // Buscar patrón de dominio
  if (/\S+\.\S+$/.test(before) && /^\S+/.test(after)) {
    // Puede ser domain.com/SIGLA/path
    return true;
  }

  return false;
}

/**
 * Detecta si una posición está dentro de un email
 */
export function isInsideEmail(text: string, startPos: number, endPos: number): boolean {
  const window = 50;
  const before = text.substring(Math.max(0, startPos - window), startPos);
  const after = text.substring(endPos, Math.min(text.length, endPos + window));

  // Patrón: algo@dominio.com o algo.SIGLA@dominio.com
  return /\S+@?\S*$/.test(before) && /^\S*@?\S+\.\S+/.test(after);
}

/**
 * Detecta si una posición está dentro de un bloque de código markdown
 */
export function isInsideCodeBlock(text: string, position: number): boolean {
  const before = text.substring(0, position);
  const tripleBackticks = (before.match(/```/g) || []).length;

  // Número impar = estamos dentro de un bloque
  return tripleBackticks % 2 === 1;
}

/**
 * Detecta si una posición está dentro de código inline markdown
 */
export function isInsideInlineCode(text: string, position: number): boolean {
  const before = text.substring(0, position);

  // Contar backticks simples (no triple backticks)
  const backticks = before.split('```').join(''); // Remover triple backticks primero
  const singleBackticks = (backticks.match(/`/g) || []).length;

  // Número impar = estamos dentro de código inline
  return singleBackticks % 2 === 1;
}

/**
 * Detecta si una posición está en contexto especial donde no debemos expandir
 */
export function isInSpecialContext(
  text: string,
  startPos: number,
  endPos: number,
  options: { skipUrls?: boolean; skipEmails?: boolean; skipCodeBlocks?: boolean; skipInlineCode?: boolean }
): string | null {
  const { skipUrls = true, skipEmails = true, skipCodeBlocks = true, skipInlineCode = true } = options;

  if (skipUrls && isInsideUrl(text, startPos, endPos)) {
    return 'url';
  }

  if (skipEmails && isInsideEmail(text, startPos, endPos)) {
    return 'email';
  }

  if (skipCodeBlocks && isInsideCodeBlock(text, startPos)) {
    return 'code-block';
  }

  if (skipInlineCode && isInsideInlineCode(text, startPos)) {
    return 'inline-code';
  }

  return null;
}

/**
 * Verifica si una posición es parte de una palabra más larga
 * (para evitar matchear "AEAT" dentro de "CREATION")
 */
export function isPartOfLargerWord(text: string, startPos: number, endPos: number): boolean {
  const before = startPos > 0 ? text[startPos - 1] : '';
  const after = endPos < text.length ? text[endPos] : '';

  return isAlphanumeric(before) || isAlphanumeric(after);
}
