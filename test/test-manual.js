/**
 * legal-expand - Suite de Tests Manuales Completos
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Script de testing manual exhaustivo que valida todas las funcionalidades
 * de la librería contra el build compilado (dist/esm).
 *
 * PROPÓSITO:
 * Validar manualmente el comportamiento de la librería en condiciones reales,
 * complementando los tests unitarios automatizados. Útil para:
 * - Smoke testing después de builds
 * - Validación visual de formatos de salida
 * - Debugging de comportamientos complejos
 * - Documentación viva de casos de uso
 *
 * COBERTURA:
 * - Expansión básica y múltiple
 * - Todos los formatos (plain, html, structured)
 * - Configuración global y local
 * - Opciones avanzadas (expandOnlyFirst, exclude, include)
 * - Resolución de duplicados
 * - Protección de contextos (URLs, emails)
 * - API de consulta del diccionario
 *
 * EJECUCIÓN:
 * npm run build && node test-manual.js
 */

import {
  expandirSiglas,
  configurarGlobalmente,
  obtenerConfiguracionGlobal,
  resetearConfiguracion,
  buscarSigla,
  listarSiglas,
  obtenerEstadisticas
} from '../dist/esm/index.js';

// ============================================================================
// CONFIGURACIÓN DE TESTS
// ============================================================================

console.log('='.repeat(80));
console.log('TEST MANUAL COMPLETO - legal-expand');
console.log('='.repeat(80));
console.log('');

// Test 1: Expansión básica
console.log('Test 1: Expansión básica');
const result1 = expandirSiglas('La AEAT notifica el IVA');
console.log('Entrada:', 'La AEAT notifica el IVA');
console.log('Salida:', result1);
console.log('');

// Test 2: Múltiples siglas
console.log('Test 2: Múltiples siglas');
const result2 = expandirSiglas('Según el art. 123 del CC y la LEC, la AEAT debe procesar el BOE.');
console.log('Entrada:', 'Según el art. 123 del CC y la LEC, la AEAT debe procesar el BOE.');
console.log('Salida:', result2);
console.log('');

// Test 3: Formato HTML
console.log('Test 3: Formato HTML');
const result3 = expandirSiglas('La AEAT notifica', { format: 'html' });
console.log('Entrada:', 'La AEAT notifica');
console.log('Salida:', result3);
console.log('');

// Test 4: Formato estructurado
console.log('Test 4: Formato estructurado (JSON)');
const result4 = expandirSiglas('AEAT y BOE', { format: 'structured' });
console.log('Entrada:', 'AEAT y BOE');
console.log('Salida:', JSON.stringify(result4, null, 2));
console.log('');

// Test 5: Control global - desactivar
console.log('Test 5: Control global - desactivar expansión');
configurarGlobalmente({ enabled: false });
const result5a = expandirSiglas('La AEAT notifica');
console.log('Entrada:', 'La AEAT notifica');
console.log('Salida (con enabled:false):', result5a);
console.log('');

// Test 6: forceExpansion (override)
console.log('Test 6: forceExpansion - override de configuración global');
const result6 = expandirSiglas('La AEAT notifica', { forceExpansion: true });
console.log('Entrada:', 'La AEAT notifica');
console.log('Salida (con forceExpansion:true):', result6);
console.log('');

// Resetear configuración
resetearConfiguracion();
console.log('Configuración reseteada a valores por defecto');
console.log('');

// Test 7: Obtener configuración global
console.log('Test 7: Obtener configuración global');
const config = obtenerConfiguracionGlobal();
console.log('Configuración actual:', JSON.stringify(config, null, 2));
console.log('');

// Test 8: Buscar sigla específica
console.log('Test 8: Buscar sigla específica');
const search = buscarSigla('AEAT');
console.log('Buscar "AEAT":', JSON.stringify(search, null, 2));
console.log('');

// Test 9: Estadísticas del diccionario
console.log('Test 9: Estadísticas del diccionario');
const stats = obtenerEstadisticas();
console.log('Estadísticas:', JSON.stringify(stats, null, 2));
console.log('');

// Test 10: Listar todas las siglas
console.log('Test 10: Listar todas las siglas (primeras 20)');
const todasSiglas = listarSiglas();
console.log('Total de siglas:', todasSiglas.length);
console.log('Primeras 20:', todasSiglas.slice(0, 20).join(', '));
console.log('');

// Test 11: Detección de variantes (siglas con puntos)
console.log('Test 11: Detección de variantes');
const result11a = expandirSiglas('El art. 5 establece');
const result11b = expandirSiglas('El art 5 establece'); // Sin punto
console.log('Entrada (con punto):', 'El art. 5 establece');
console.log('Salida:', result11a);
console.log('Entrada (sin punto):', 'El art 5 establece');
console.log('Salida:', result11b);
console.log('');

// Test 12: expandOnlyFirst
console.log('Test 12: expandOnlyFirst - solo expandir primera ocurrencia');
const result12 = expandirSiglas('AEAT procesa IVA. AEAT también cobra IVA.', { expandOnlyFirst: true });
console.log('Entrada:', 'AEAT procesa IVA. AEAT también cobra IVA.');
console.log('Salida:', result12);
console.log('');

// Test 13: exclude - excluir siglas específicas
console.log('Test 13: exclude - excluir siglas específicas');
const result13 = expandirSiglas('AEAT y BOE y CC', { exclude: ['BOE', 'CC'] });
console.log('Entrada:', 'AEAT y BOE y CC');
console.log('Salida (excluyendo BOE y CC):', result13);
console.log('');

// Test 14: include - incluir solo siglas específicas
console.log('Test 14: include - incluir solo siglas específicas');
const result14 = expandirSiglas('AEAT y BOE y CC', { include: ['AEAT'] });
console.log('Entrada:', 'AEAT y BOE y CC');
console.log('Salida (incluyendo solo AEAT):', result14);
console.log('');

// Test 15: preserveCase
console.log('Test 15: preserveCase - mantener mayúsculas originales');
const result15a = expandirSiglas('La AEAT notifica', { preserveCase: true });
const result15b = expandirSiglas('La AEAT notifica', { preserveCase: false });
console.log('Entrada:', 'La AEAT notifica');
console.log('Salida (preserveCase: true):', result15a);
console.log('Salida (preserveCase: false):', result15b);
console.log('');

// Test 16: autoResolveDuplicates
console.log('Test 16: autoResolveDuplicates - resolver duplicados automáticamente');
const result16 = expandirSiglas('El CE establece', { autoResolveDuplicates: true });
console.log('Entrada:', 'El CE establece');
console.log('Salida (autoResolveDuplicates: true):', result16);
console.log('');

// Test 17: duplicateResolution - resolución manual de duplicados
console.log('Test 17: duplicateResolution - resolución manual de duplicados');
const result17 = expandirSiglas('El CE establece', {
  duplicateResolution: { 'CE': 'Constitución Española' }
});
console.log('Entrada:', 'El CE establece');
console.log('Salida (especificando CE = Constitución Española):', result17);
console.log('');

// Test 18: Configuración global con opciones por defecto
console.log('Test 18: Configuración global con opciones por defecto');
configurarGlobalmente({
  enabled: true,
  defaultOptions: {
    expandOnlyFirst: true,
    preserveCase: true
  }
});
const result18 = expandirSiglas('AEAT procesa IVA. AEAT cobra IVA.');
console.log('Entrada:', 'AEAT procesa IVA. AEAT cobra IVA.');
console.log('Salida (con expandOnlyFirst global):', result18);
resetearConfiguracion();
console.log('');

// Test 19: Protección de contextos - URLs
console.log('Test 19: Protección de contextos - URLs');
const result19 = expandirSiglas('Visita https://aeat.es para más info de AEAT');
console.log('Entrada:', 'Visita https://aeat.es para más info de AEAT');
console.log('Salida:', result19);
console.log('');

// Test 20: Protección de contextos - emails
console.log('Test 20: Protección de contextos - emails');
const result20 = expandirSiglas('Contacta en info@boe.es sobre el BOE');
console.log('Entrada:', 'Contacta en info@boe.es sobre el BOE');
console.log('Salida:', result20);
console.log('');

// Test 21: Texto sin siglas
console.log('Test 21: Texto sin siglas');
const result21 = expandirSiglas('Este es un texto normal sin siglas legales.');
console.log('Entrada:', 'Este es un texto normal sin siglas legales.');
console.log('Salida:', result21);
console.log('');

// Test 22: Texto vacío
console.log('Test 22: Texto vacío');
const result22 = expandirSiglas('');
console.log('Entrada:', '(vacío)');
console.log('Salida:', result22);
console.log('');

console.log('='.repeat(80));
console.log('TODOS LOS TESTS COMPLETADOS');
console.log('='.repeat(80));
console.log('');
console.log('Para exportar todas las siglas a TXT, ejecuta:');
console.log('  npm run export-siglas');
console.log('');
