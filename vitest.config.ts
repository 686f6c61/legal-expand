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
 * - Lines: 83% mínimo
 * - Functions: 85% mínimo
 * - Branches: 70% mínimo (más permisivo por validaciones complejas)
 * - Statements: 83% mínimo
 *
 * EXCLUSIONES:
 * - dist/: Código compilado (no testear builds)
 * - landing/: Sitio de marketing (pipeline independiente)
 * - scripts/: Scripts de utilidad (testeados manualmente)
 * - test/: Utilidades y scripts de prueba manual
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
      include: ['src/**/*.ts'],
      exclude: [
        'dist/**',
        'landing/**',
        'scripts/**',
        'test/**',
        '**/*.test.ts',
        '**/*.bench.ts',
        'vitest.config.ts',
        'src/index.ts',
        'src/formatters/base.ts',
        'src/types/**'
      ],
      thresholds: {
        lines: 83,
        functions: 85,
        branches: 70,
        statements: 83
      }
    }
  }
});
