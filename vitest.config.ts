/**
 * legal-expand - Configuración de Vitest
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Configuración del framework de testing Vitest para el proyecto.
 *
 * CONFIGURACIÓN:
 * - Globals: APIs de testing disponibles globalmente (describe, it, expect)
 * - Environment: Node.js (no navegador, SSR-compatible)
 * - Coverage: V8 provider con múltiples reportes (text, json, html)
 *
 * THRESHOLDS DE COBERTURA:
 * - Lines: 90% mínimo
 * - Functions: 90% mínimo
 * - Branches: 85% mínimo (más permisivo por validaciones complejas)
 * - Statements: 90% mínimo
 *
 * EXCLUSIONES:
 * - dist/: Código compilado (no testear builds)
 * - scripts/: Scripts de utilidad (testeados manualmente)
 * - *.test.ts: Archivos de test (no testear tests)
 * - src/types/: Type definitions (solo tipos, no runtime)
 *
 * EJECUCIÓN:
 * - npm test: Ejecutar tests
 * - npm run test:coverage: Ejecutar con reporte de cobertura
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        'scripts/**',
        '**/*.test.ts',
        '**/*.bench.ts',
        'vitest.config.ts',
        'src/types/**'
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90
      }
    }
  }
});
