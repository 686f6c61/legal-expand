/**
 * Script para limpiar duplicados del diccionario
 * Mantiene solo las versiones cortas y exactas de cada sigla
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { CompiledDictionary } from '../src/types/index.js';

/**
 * IDs de entradas a eliminar (duplicados innecesarios)
 */
const ENTRIES_TO_REMOVE = [
  // DUA - eliminar ambos por incertidumbre
  'entry-043', // Documento Unico Aduanero
  'entry-042', // documento único administrativo

  // Duplicados de capitalización - eliminar minúsculas
  'entry-070', // impuestos especiales
  'entry-280', // audiencia provincial
  'entry-293', // CC con fecha
  'entry-297', // CE solo (mantener el dual)
  'entry-390', // impuesto sobre actividades económicas
  'entry-392', // impuesto sobre bienes inmuebles
  'entry-399', // impuesto sobre la renta de las personas físicas
  'entry-401', // impuesto sobre sociedades
  'entry-402', // impuesto sobre sucesiones y donaciones
  'entry-406', // impuesto sobre transmisiones patrimoniales y actos jurídicos documentados
  'entry-407', // impuesto sobre el valor añadido
  'entry-607', // plan general de contabilidad (minúsculas)
  'entry-608', // presupuestos generales del Estado (minúsculas)
  'entry-622', // real decreto (minúsculas)
  'entry-625', // real decreto ley (minúsculas)
  'entry-184', // Real Decreto Legislativo (mayúsculas inicial, mantener minúsculas)
  'entry-684', // texto articulado (minúsculas)
  'entry-700', // texto refundido (minúsculas)
  'entry-717', // tribunal superior de justicia (minúsculas)

  // Versiones con fechas/referencias legales - mantener solo versión corta
  'entry-103', // LCAP con fecha
  'entry-108', // LEC con fecha
  'entry-110', // LECrim con fecha
  'entry-112', // LEF con fecha
  'entry-118', // LGP con fecha
  'entry-120', // LGSS con fecha
  'entry-122', // LGT con fecha
  'entry-124', // LH con fecha
  'entry-131', // LJCA con fecha
  'entry-135', // LOFAGE con fecha (mantener versión corta sin fecha)
  'entry-140', // LOPJ con fecha
  'entry-142', // LOTC con fecha
  'entry-145', // LOTJ con fecha
  'entry-147', // LPA con fecha
  'entry-152', // LPL con fecha
  'entry-154', // LPRL con fecha
  'entry-158', // LRJAP y PAC con fecha
  'entry-176', // PGC con espacio extra
  'entry-189', // REF con fecha
  'entry-194', // RGR con fecha
  'entry-105', // LCSP con fecha
  'entry-115', // LG con fecha (mantener versión corta)
  'entry-116', // LGDCU sin "y otras leyes" (mantener con "y otras leyes")
  'entry-127', // LIRPF con fecha
  'entry-128', // LIS con fecha
  'entry-129', // LISOS "de" (mantener "sobre")
  'entry-130', // LIVA con fecha
  'entry-134', // LODE sin "reguladora" (mantener sin)
  'entry-144', // LOTCU con fecha
  'entry-150', // LPAP con fecha (mantener versión corta)
  'entry-160', // LRJSP con fecha
  'entry-161', // LSA Sociedades Anónimas (mantener, eliminar Seguridad Aérea)
  'entry-185', // RDU con fecha
  'entry-197', // RGU con fecha
  'entry-202', // RPU con fecha
  'entry-252', // TRLSRU con fecha
  'entry-253', // TRRL con fecha

  // Confrontar vs confróntese - mantener confróntese
  'entry-028', // Confrontar

  // S.A., S.L., etc - mantener minúsculas (más correcto según RAE)
  'entry-206', // Sociedad anónima (mayúsculas)
  'entry-208', // Sociedad anónima laboral (mayúsculas)
  'entry-210', // Sociedad cooperativa (mayúsculas)
  'entry-212', // Sociedad limitada (mayúsculas)

  // Ss. - mantener solo "siguientes" (más común en jurídico)
  'entry-679', // Seguridad Social
  'entry-229', // Sentencias

  // CE - mantener solo "Constitución Española"
  'entry-023', // Comunidad Europea o Constitución Española (dual confuso)

  // CES - mantener "Consejo Económico y Social" (más común en España)
  'entry-026', // Comité Económico y Social

  // DGT - mantener solo "Dirección General de Tributos"
  'entry-035', // Dirección General de Tributos/Dirección General de Tráfico

  // INSERSO - eliminar versión con error gramatical
  'entry-082', // Instituto de Nacional Servicios Sociales (error: "de Nacional")

  // ISFAS - eliminar versión con error gramatical
  'entry-091', // Instituto Social de la Fuerzas Armadas (error: "la Fuerzas")

  // LBRL - mantener con "del"
  'entry-417', // sin "del"

  // LGDCU - mantener sin "y otras leyes complementarias"
  'entry-465', // con "y otras leyes complementarias"

  // LISOS - mantener "de" en lugar de "sobre"
  'entry-482', // "sobre"

  // LODE - mantener sin "reguladora"
  'entry-505', // con "reguladora"

  // LPAP - mantener versión corta
  'entry-537', // versión corta (mantener esta, eliminar la de fecha)

  // LSA - mantener Sociedades Anónimas, eliminar Seguridad Aérea
  'entry-558', // Ley de Seguridad Aérea

  // MUFACE - mantener "Mutualidad General de Funcionarios Civiles del Estado" (oficial)
  'entry-164', // Mutualidad de Funcionarios de la Administración Civil del Estado

  // REF - mantener con mayúscula en Forzosa, eliminar minúscula
  'entry-190', // Reglamento de la Ley de Expropiación forzosa (minúscula)

  // RS - mantener "Reglamento del Senado"
  'entry-203', // Resolución

  // SEPI - mantener "Sociedad Estatal de Participaciones Industriales" (oficial)
  'entry-675', // Sociedad Española de Participaciones Industriales

  // TA - mantener mayúsculas
  'entry-232', // Texto articulado (mayúsculas - mantener)

  // TCJ - mantener "Tribunal de Conflictos de Jurisdicción" (oficial)
  'entry-236', // Tribunal de Conflictos Jurisdiccionales

  // TR - mantener mayúsculas
  'entry-245', // Texto refundido (mayúsculas - mantener)
];

function cleanDictionary() {
  // Leer diccionario actual
  const dictPath = join(process.cwd(), 'src', 'data', 'dictionary.json');
  let dictContent: string;

  try {
    dictContent = readFileSync(dictPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error leyendo ${dictPath}:`, error);
    process.exit(1);
  }

  const currentDict: CompiledDictionary = JSON.parse(dictContent);

  // Filtrar entradas eliminando las marcadas
  const filteredEntries = currentDict.entries.filter(
    entry => !ENTRIES_TO_REMOVE.includes(entry.id)
  );

  // Reconstruir índices
  const exactIndex: Record<string, string[]> = {};
  const normalizedIndex: Record<string, string[]> = {};

  for (const entry of filteredEntries) {
    for (const variant of entry.variants) {
      if (!exactIndex[variant]) {
        exactIndex[variant] = [];
      }
      exactIndex[variant].push(entry.id);

      const normalizedVariant = variant.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
      if (!normalizedIndex[normalizedVariant]) {
        normalizedIndex[normalizedVariant] = [];
      }
      normalizedIndex[normalizedVariant].push(entry.id);
    }
  }

  // Reconstruir conflictos (solo los que quedan después de limpiar)
  const conflicts = currentDict.conflicts
    .map(conflict => {
      // Filtrar variantes que ya no existen
      const remainingVariants = conflict.variants.filter(
        v => !ENTRIES_TO_REMOVE.includes(v.id)
      );

      // Si solo queda una variante, ya no es conflicto
      if (remainingVariants.length <= 1) {
        return null;
      }

      // Actualizar defaultId si el anterior fue eliminado
      let defaultId = conflict.defaultId;
      if (ENTRIES_TO_REMOVE.includes(defaultId)) {
        defaultId = remainingVariants[0].id;
      }

      return {
        sigla: conflict.sigla,
        variants: remainingVariants,
        defaultId
      };
    })
    .filter(c => c !== null);

  // Crear diccionario limpio
  const cleanedDict: CompiledDictionary = {
    version: '1.2.0',
    buildDate: new Date().toISOString(),
    entries: filteredEntries,
    index: {
      exact: exactIndex,
      normalized: normalizedIndex
    },
    conflicts
  };

  // Escribir diccionario limpio
  try {
    writeFileSync(dictPath, JSON.stringify(cleanedDict, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error escribiendo diccionario:', error);
    process.exit(1);
  }

  // Reportar estadísticas
  console.error('✅ Diccionario limpiado correctamente');
  console.error('');
  console.error('📊 Estadísticas:');
  console.error(`   • Entradas antes: ${currentDict.entries.length}`);
  console.error(`   • Entradas eliminadas: ${ENTRIES_TO_REMOVE.length}`);
  console.error(`   • Entradas después: ${cleanedDict.entries.length}`);
  console.error(`   • Conflictos antes: ${currentDict.conflicts.length}`);
  console.error(`   • Conflictos después: ${cleanedDict.conflicts.length}`);
  console.error('');
}

// Ejecutar
cleanDictionary();
