[![npm version](https://badge.fury.io/js/legal-expand.svg)](https://www.npmjs.com/package/legal-expand)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Siglas legales españolas para documentos jurídicos

**646 siglas legales españolas verificadas** | Expansión inteligente para textos jurídicos

**[Demo interactiva en vivo](https://legal-expand.onrender.com)** | Prueba la expansión de siglas en tiempo real

## ¿Qué hace este paquete?

`legal-expand` es una librería TypeScript que **expande automáticamente siglas legales** en textos jurídicos españoles, añadiendo su significado completo entre paréntesis para facilitar la comprensión.

**Ejemplo:**
```
Entrada: "La AEAT notifica el IVA según el art. 123 del CC"
Salida:  "La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido) según el art. (artículo) 123 del CC (Código Civil)"
```

### Características principales

- **646 siglas verificadas** de leyes, organismos, impuestos, tribunales y procedimientos
- **Fuentes oficiales**: RAE, DPEJ, BOE y legislación vigente
- **Detección inteligente** de variantes (AEAT, aeat, A.E.A.T.)
- **Múltiples formatos**: texto plano, HTML semántico, JSON estructurado
- **Documentos largos optimizados**: expandir solo primera ocurrencia para evitar repeticiones
- **Control granular**: configuración global + override por llamada
- **SSR-safe**: compatible con Next.js, Remix, SvelteKit
- **Zero dependencies**: sin dependencias en runtime
- **Tree-shakeable**: solo importas lo que usas (~4KB gzipped)
- **TypeScript first**: types completos incluidos
- **Dual module support**: compatible con `import` (ESM) y `require` (CJS)
- **API de diagnóstico**: trazabilidad de siglas omitidas y motivo exacto
- **Calidad automatizada**: validación de diccionario + benchmarks con umbrales en CI

## Índice

- [Siglas legales españolas para documentos jurídicos](#siglas-legales-españolas-para-documentos-jurídicos)
  - [¿Qué hace este paquete?](#qué-hace-este-paquete)
    - [Características principales](#características-principales)
  - [Índice](#índice)
  - [Instalación](#instalación)
  - [Uso básico](#uso-básico)
    - [Expansión simple](#expansión-simple)
    - [Expansión de múltiples siglas](#expansión-de-múltiples-siglas)
    - [Detección de variantes](#detección-de-variantes)
  - [Formatos de salida](#formatos-de-salida)
    - [Formato de texto plano (por defecto)](#formato-de-texto-plano-por-defecto)
    - [Formato HTML semántico](#formato-html-semántico)
    - [Formato estructurado (objeto JSON)](#formato-estructurado-objeto-json)
  - [Control global y override](#control-global-y-override)
    - [Configuración global](#configuración-global)
    - [Desactivación global](#desactivación-global)
    - [Override de configuración global](#override-de-configuración-global)
    - [Resetear configuración](#resetear-configuración)
  - [Opciones avanzadas](#opciones-avanzadas)
    - [Expandir solo primera ocurrencia](#expandir-solo-primera-ocurrencia)
    - [Excluir siglas específicas](#excluir-siglas-específicas)
    - [Incluir solo siglas específicas](#incluir-solo-siglas-específicas)
    - [Combinar opciones](#combinar-opciones)
  - [Manejo de duplicados](#manejo-de-duplicados)
    - [Problema de duplicados](#problema-de-duplicados)
    - [Resolución manual de duplicados](#resolución-manual-de-duplicados)
    - [Auto-resolver duplicados](#auto-resolver-duplicados)
    - [Consultar duplicados](#consultar-duplicados)
  - [Funciones auxiliares](#funciones-auxiliares)
    - [Buscar sigla específica](#buscar-sigla-específica)
    - [Listar todas las siglas](#listar-todas-las-siglas)
    - [Obtener estadísticas](#obtener-estadísticas)
  - [Uso en frameworks](#uso-en-frameworks)
    - [Next.js (App Router)](#nextjs-app-router)
    - [Next.js (Pages Router)](#nextjs-pages-router)
    - [React](#react)
    - [Vue 3](#vue-3)
    - [Svelte](#svelte)
    - [Angular](#angular)
  - [Casos de uso completos](#casos-de-uso-completos)
    - [Procesamiento de sentencias judiciales](#procesamiento-de-sentencias-judiciales)
    - [Sistema de ayuda contextual](#sistema-de-ayuda-contextual)
    - [Generación de glosarios automáticos](#generación-de-glosarios-automáticos)
    - [Validación de consistencia de documentos](#validación-de-consistencia-de-documentos)
    - [Comparación de versiones de documentos](#comparación-de-versiones-de-documentos)
  - [Uso en backend para LLMs](#uso-en-backend-para-llms)
    - [Beneficios de pre-formatear para LLMs](#beneficios-de-pre-formatear-para-llms)
    - [Next.js 13+ (App Router) - API route](#nextjs-13-app-router---api-route)
    - [Next.js 13+ - Server actions](#nextjs-13---server-actions)
    - [Express.js backend](#expressjs-backend)
    - [Serverless functions (Vercel, Netlify)](#serverless-functions-vercel-netlify)
    - [AWS Lambda con Node.js](#aws-lambda-con-nodejs)
    - [Caso de uso completo: pipeline de análisis legal](#caso-de-uso-completo-pipeline-de-análisis-legal)
    - [Integración con streaming de LLMs](#integración-con-streaming-de-llms)
    - [Ventajas del enfoque backend](#ventajas-del-enfoque-backend)
    - [Ejemplo con caché](#ejemplo-con-caché)
  - [Protección de contextos](#protección-de-contextos)
    - [URLs](#urls)
    - [Direcciones de email](#direcciones-de-email)
    - [Bloques de código](#bloques-de-código)
    - [Código inline](#código-inline)
  - [Extensibilidad](#extensibilidad)
    - [Crear formatter personalizado](#crear-formatter-personalizado)
    - [Formatter para tooltips con CSS](#formatter-para-tooltips-con-css)
  - [API completa](#api-completa)
    - [expandirSiglas(texto, opciones?)](#expandirsiglastexto-opciones)
    - [configurarGlobalmente(config)](#configurarglobalmenteconfig)
    - [obtenerConfiguracionGlobal()](#obtenerconfiguracionglobal)
    - [resetearConfiguracion()](#resetearconfiguracion)
    - [buscarSigla(sigla)](#buscarsiglasigla)
    - [listarSiglas()](#listarsiglas)
    - [obtenerEstadisticas()](#obtenerestadisticas)
  - [Siglas incluidas](#siglas-incluidas)
    - [Impuestos y tributos (45 siglas)](#impuestos-y-tributos-45-siglas)
    - [Leyes y normativa (80+ siglas)](#leyes-y-normativa-80-siglas)
    - [Organismos e instituciones (60+ siglas)](#organismos-e-instituciones-60-siglas)
    - [Abreviaturas comunes (30+ siglas)](#abreviaturas-comunes-30-siglas)
    - [Tipos de sociedades (15+ siglas)](#tipos-de-sociedades-15-siglas)
    - [Otros (30+ siglas)](#otros-30-siglas)
  - [TypeScript](#typescript)
  - [Rendimiento](#rendimiento)
  - [Compatibilidad](#compatibilidad)
  - [Fuentes de las siglas](#fuentes-de-las-siglas)
    - [Fuentes institucionales](#fuentes-institucionales)
      - [Real Academia Española (RAE) - Libro de Estilo de la Justicia](#real-academia-española-rae---libro-de-estilo-de-la-justicia)
      - [Diccionario Panhispánico del Español Jurídico (DPEJ) - RAE](#diccionario-panhispánico-del-español-jurídico-dpej---rae)
    - [Fuentes propias](#fuentes-propias)
    - [Proceso de validación](#proceso-de-validación)
  - [Contribuir](#contribuir)
    - [Añadir nuevas siglas](#añadir-nuevas-siglas)
      - [1. Editar el archivo dictionary.json](#1-editar-el-archivo-dictionaryjson)
      - [2. Actualizar los índices](#2-actualizar-los-índices)
      - [3. Recompilar el paquete](#3-recompilar-el-paquete)
      - [4. Verificar el resultado](#4-verificar-el-resultado)
      - [5. Exportar listado de siglas](#5-exportar-listado-de-siglas)
      - [6. Buenas prácticas](#6-buenas-prácticas)
      - [7. Casos especiales](#7-casos-especiales)
  - [Reportar problemas](#reportar-problemas)
  - [Licencia](#licencia)
  - [Créditos](#créditos)

## Instalación

```bash
npm install legal-expand
```

```bash
yarn add legal-expand
```

```bash
pnpm add legal-expand
```

### Compatibilidad de módulos (ESM + CJS)

```typescript
// ESM
import { expandirSiglas } from 'legal-expand';

// CJS
const { expandirSiglas } = require('legal-expand');
```

## Uso básico

### Expansión simple

El caso de uso más común es expandir siglas en un texto legal. El paquete detecta automáticamente las siglas y añade su significado entre paréntesis.

```typescript
import { expandirSiglas } from 'legal-expand';

const texto = 'La AEAT notifica el IVA';
const resultado = expandirSiglas(texto);

console.log(resultado);
// Salida: 'La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido)'
```

### Expansión de múltiples siglas

El paquete puede procesar textos complejos con múltiples siglas diferentes, manteniendo la estructura y formato original del texto.

```typescript
const texto = 'Según el art. 123 del CC y la LEC, la AEAT debe procesar el BOE.';
const resultado = expandirSiglas(texto);

console.log(resultado);
// Salida: 'Según el art. (Artículo) 123 del CC (Código Civil) y la LEC (Ley de Enjuiciamiento Civil),
//          la AEAT (Agencia Estatal de Administración Tributaria) debe procesar el BOE (Boletín Oficial del Estado).'
```

### Detección de variantes

El sistema detecta automáticamente variantes de siglas con o sin puntos, mayúsculas/minúsculas, y espacios internos. Esto asegura que las siglas se expandan independientemente de cómo estén escritas en el documento.

```typescript
// Todas estas variantes se detectan y expanden correctamente:

expandirSiglas('El art. 5 establece');
// Salida: 'El art. (Artículo) 5 establece'

expandirSiglas('El art 5 establece');  // Sin punto
// Salida: 'El art (Artículo) 5 establece'

expandirSiglas('La AEAT notifica');
// Salida: 'La AEAT (Agencia Estatal de Administración Tributaria) notifica'

expandirSiglas('La aeat notifica');  // Minúsculas
// Salida: 'La aeat (Agencia Estatal de Administración Tributaria) notifica'

expandirSiglas('La A.E.A.T. notifica');  // Con puntos
// Salida: 'La A.E.A.T. (Agencia Estatal de Administración Tributaria) notifica'
```

### Diagnóstico detallado de omisiones

Para depurar por qué algunas siglas no se expanden, usa `expandirSiglasDetallado`.

```typescript
import { expandirSiglasDetallado } from 'legal-expand';

const debug = expandirSiglasDetallado('AEAT y BOE', { include: ['AEAT'] });

console.log(debug.omittedAcronyms);
// [
//   {
//     acronym: 'BOE',
//     position: { start: 7, end: 10 },
//     reason: 'not-in-include'
//   }
// ]
```

## Formatos de salida

### Formato de texto plano (por defecto)

El formato de texto plano añade el significado entre paréntesis inmediatamente después de cada sigla. Es el formato más simple y legible para documentos de texto.

```typescript
const resultado = expandirSiglas('La AEAT notifica el IVA');
// Salida: 'La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido)'
```

### Formato HTML semántico

El formato HTML utiliza la etiqueta `<abbr>` con el atributo `title`, proporcionando tooltips nativos del navegador al pasar el cursor sobre las siglas. Ideal para aplicaciones web.

```typescript
const resultado = expandirSiglas('La AEAT notifica', { format: 'html' });
console.log(resultado);
// Salida: 'La <abbr title="Agencia Estatal de Administración Tributaria">AEAT</abbr> (Agencia Estatal de Administración Tributaria) notifica'
```

**Uso en componentes:**

```typescript
function DocumentoLegal({ texto }) {
  const htmlExpandido = expandirSiglas(texto, { format: 'html' });
  return <div dangerouslySetInnerHTML={{ __html: htmlExpandido }} />;
}
```

### Formato estructurado (objeto JSON)

El formato estructurado devuelve un objeto con metadata completa sobre las siglas encontradas y expandidas. Útil para análisis, debugging, o crear interfaces interactivas.

```typescript
const resultado = expandirSiglas('AEAT y BOE', { format: 'structured' });

console.log(resultado);
/*
{
  originalText: 'AEAT y BOE',
  expandedText: 'AEAT (Agencia Estatal de Administración Tributaria) y BOE (Boletín Oficial del Estado)',
  acronyms: [
    {
      acronym: 'AEAT',
      expansion: 'Agencia Estatal de Administración Tributaria',
      position: { start: 0, end: 4 },
      hasMultipleMeanings: false
    },
    {
      acronym: 'BOE',
      expansion: 'Boletín Oficial del Estado',
      position: { start: 7, end: 10 },
      hasMultipleMeanings: false
    }
  ],
  stats: {
    totalAcronymsFound: 2,
    totalExpanded: 2,
    ambiguousNotExpanded: 0
  }
}
*/
```

**Caso de uso - Análisis de documento:**

```typescript
const analisis = expandirSiglas(documento, { format: 'structured' });

console.log(`Documento procesado:`);
console.log(`- Siglas encontradas: ${analisis.stats.totalAcronymsFound}`);
console.log(`- Siglas expandidas: ${analisis.stats.totalExpanded}`);
console.log(`- Siglas ambiguas no expandidas: ${analisis.stats.ambiguousNotExpanded}`);

analisis.acronyms.forEach(sigla => {
  console.log(`  • ${sigla.acronym} → ${sigla.expansion}`);
});
```

## Control global y override

### Configuración global

Puedes configurar el comportamiento del paquete globalmente para toda tu aplicación. Esto es útil cuando quieres establecer un comportamiento por defecto y aplicarlo en múltiples lugares.

```typescript
import { configurarGlobalmente } from 'legal-expand';

// Configurar opciones por defecto para toda la aplicación
configurarGlobalmente({
  enabled: true,
  defaultOptions: {
    format: 'html',
    expandOnlyFirst: true
  }
});

// Ahora todas las llamadas usarán estas opciones por defecto
expandirSiglas('AEAT y BOE');  // Usará format='html' y expandOnlyFirst=true
```

### Desactivación global

Puedes desactivar la expansión globalmente, útil para entornos de prueba o cuando quieres controlar manualmente cuándo expandir.

```typescript
import { configurarGlobalmente, expandirSiglas } from 'legal-expand';

// Desactivar expansión globalmente
configurarGlobalmente({ enabled: false });

expandirSiglas('La AEAT notifica el IVA');
// Salida: 'La AEAT notifica el IVA' (sin expandir)
```

### Override de configuración global

El parámetro `forceExpansion` permite anular la configuración global para llamadas específicas. Esto proporciona control granular sobre qué textos se expanden.

```typescript
configurarGlobalmente({ enabled: false });

// No se expande (respeta configuración global)
expandirSiglas('La AEAT notifica');
// Salida: 'La AEAT notifica'

// Forzar expansión aunque esté desactivado globalmente
expandirSiglas('La AEAT notifica', { forceExpansion: true });
// Salida: 'La AEAT (Agencia Estatal de Administración Tributaria) notifica'

// Forzar NO expansión aunque esté activado globalmente
configurarGlobalmente({ enabled: true });
expandirSiglas('La AEAT notifica', { forceExpansion: false });
// Salida: 'La AEAT notifica'
```

**Caso de uso - Expansión selectiva:**

```typescript
function procesarDocumento(documento, tipo) {
  // Solo expandir si es un documento público
  const opciones = tipo === 'publico'
    ? { forceExpansion: true }
    : { forceExpansion: false };

  return expandirSiglas(documento, opciones);
}
```

### Resetear configuración

Restaura la configuración a sus valores por defecto originales.

```typescript
import { resetearConfiguracion } from 'legal-expand';

// Después de múltiples configuraciones...
resetearConfiguracion();
// Ahora todo vuelve a: enabled=true, format='plain', etc.
```

## Opciones avanzadas

### Expandir solo primera ocurrencia

**Ideal para documentos largos** (sentencias, contratos, informes de 100+ páginas). Cuando una sigla aparece muchas veces, expandirla en cada ocurrencia hace el texto ilegible. Con `expandOnlyFirst: true`, solo se expande la primera aparición de cada sigla, manteniendo legibilidad.

**Ejemplo: Documento de 10 páginas con AEAT repetida 50 veces**

```typescript
// Sin expandOnlyFirst: "AEAT (Agencia...) ... AEAT (Agencia...) ... AEAT (Agencia...)" 50 veces
// Con expandOnlyFirst: "AEAT (Agencia...) ... AEAT ... AEAT" (solo 1 expansión)

const documentoLargo = `
  La AEAT ha notificado la liquidación. La AEAT requiere documentación adicional.
  El contribuyente debe presentar ante la AEAT los justificantes. La AEAT verificará
  los datos. En caso de discrepancia, la AEAT solicitará aclaraciones...
  (50 menciones más de AEAT en 100 páginas)
`;

const resultado = expandirSiglas(documentoLargo, { expandOnlyFirst: true });

// Resultado:
// "La AEAT (Agencia Estatal de Administración Tributaria) ha notificado...
//  La AEAT requiere documentación... (resto sin expandir)"
```

**Beneficios:**
- Documentos de 100 páginas permanecen legibles
- El lector ve la definición una vez y luego reconoce la sigla
- Reduce el tamaño del documento en un 70-80% cuando hay muchas siglas repetidas
- Perfecto para sentencias judiciales, contratos, informes técnicos

**Casos de uso reales:**
- Sentencias del Tribunal Supremo (50-200 páginas)
- Contratos de licitación pública con múltiples referencias a LCSP, TRLCSP
- Informes de la AEAT con cientos de menciones de IVA, IRPF, IS
- Documentos académicos sobre legislación

### Excluir siglas específicas

Puedes especificar siglas que no deben expandirse, útil cuando algunas siglas son muy comunes o el lector ya las conoce.

```typescript
const resultado = expandirSiglas('AEAT, BOE y CC', {
  exclude: ['CC']
});

console.log(resultado);
// Salida: 'AEAT (Agencia Estatal de Administración Tributaria), BOE (Boletín Oficial del Estado) y CC'
```

**Caso de uso:** Documentos especializados donde ciertas siglas son ampliamente conocidas por el público objetivo.

```typescript
// En documentos fiscales, excluir siglas muy comunes
const documentoFiscal = expandirSiglas(texto, {
  exclude: ['IVA', 'IRPF', 'IS']  // Siglas muy conocidas en ámbito fiscal
});
```

### Incluir solo siglas específicas

Opuesto a `exclude`, permite especificar exactamente qué siglas deben expandirse, ignorando todas las demás.

```typescript
const resultado = expandirSiglas('AEAT, BOE, CC, IVA y IRPF', {
  include: ['AEAT', 'BOE']
});

console.log(resultado);
// Salida: 'AEAT (Agencia Estatal de Administración Tributaria), BOE (Boletín Oficial del Estado), CC, IVA y IRPF'
```

**Caso de uso:** Documentos donde solo quieres aclarar organismos específicos.

```typescript
// Solo expandir organismos oficiales, no impuestos
const resultado = expandirSiglas(documento, {
  include: ['AEAT', 'BOE', 'CGPJ', 'TC', 'AN']
});
```

### Combinar opciones

Las opciones pueden combinarse para lograr un control preciso sobre la expansión.

```typescript
const resultado = expandirSiglas(documento, {
  format: 'html',
  expandOnlyFirst: true,
  exclude: ['CC', 'art.'],
  preserveCase: true
});
```

## Manejo de duplicados

### Problema de duplicados

Algunas siglas tienen múltiples significados posibles. Por ejemplo, "DGT" puede referirse a "Dirección General de Tributos" o "Dirección General de Tráfico". Por defecto, estas siglas **no se expanden** para evitar confusión.

```typescript
const resultado = expandirSiglas('La DGT informa');
console.log(resultado);
// Salida: 'La DGT informa' (no se expande porque tiene múltiples significados)
```

### Resolución manual de duplicados

Puedes especificar manualmente qué significado usar para cada sigla ambigua mediante el parámetro `duplicateResolution`.

```typescript
const resultado = expandirSiglas('La DGT ha emitido una consulta vinculante', {
  duplicateResolution: {
    'DGT': 'Dirección General de Tributos'
  }
});

console.log(resultado);
// Salida: 'La DGT (Dirección General de Tributos) ha emitido una consulta vinculante'
```

**Caso de uso - Contexto específico:**

```typescript
// En documentos fiscales
function procesarDocumentoFiscal(texto) {
  return expandirSiglas(texto, {
    duplicateResolution: {
      'DGT': 'Dirección General de Tributos',
      'CE': 'Constitución Española'
    }
  });
}

// En documentos de tráfico
function procesarDocumentoTrafico(texto) {
  return expandirSiglas(texto, {
    duplicateResolution: {
      'DGT': 'Dirección General de Tráfico'
    }
  });
}
```

### Auto-resolver duplicados

Si prefieres que el paquete resuelva automáticamente los duplicados usando el significado de mayor prioridad, puedes activar `autoResolveDuplicates`.

```typescript
const resultado = expandirSiglas('La DGT informa', {
  autoResolveDuplicates: true
});

console.log(resultado);
// Salida: 'La DGT (Dirección General de Tributos) informa'
// (usa el significado con mayor prioridad según el sistema de puntuación interno)
```

**Advertencia:** Esta opción puede no ser apropiada si la precisión es crítica, ya que el sistema elige automáticamente sin considerar el contexto del documento.

### Consultar duplicados

Puedes verificar qué siglas tienen múltiples significados usando la función `buscarSigla`.

```typescript
import { buscarSigla } from 'legal-expand';

const info = buscarSigla('DGT');
console.log(info);
/*
{
  acronym: 'DGT',
  meanings: [
    'Dirección General de Tributos',
    'Dirección General de Tráfico'
  ],
  hasDuplicates: true
}
*/

if (info.hasDuplicates) {
  console.log(`La sigla ${info.acronym} tiene ${info.meanings.length} significados posibles`);
}
```

## Funciones auxiliares

### Buscar sigla específica

Consulta el diccionario para obtener información sobre una sigla específica sin procesar texto.

```typescript
import { buscarSigla } from 'legal-expand';

const info = buscarSigla('AEAT');
console.log(info);
/*
{
  acronym: 'AEAT',
  meanings: ['Agencia Estatal de Administración Tributaria'],
  hasDuplicates: false
}
*/
```

**Caso de uso - Validación:**

```typescript
function validarSigla(sigla) {
  const info = buscarSigla(sigla);

  if (!info) {
    return `La sigla "${sigla}" no está en el diccionario`;
  }

  if (info.hasDuplicates) {
    return `La sigla "${sigla}" tiene múltiples significados: ${info.meanings.join(', ')}`;
  }

  return `La sigla "${sigla}" significa: ${info.meanings[0]}`;
}
```

### Listar todas las siglas

Obtiene un array con todas las siglas disponibles en el diccionario.

```typescript
import { listarSiglas } from 'legal-expand';

const siglas = listarSiglas();
console.log(`Total de siglas: ${siglas.length}`);
console.log('Primeras 10:', siglas.slice(0, 10));
// Salida: ['AEAT', 'AENA', 'AIE', 'AJD', 'AMI', ...]
```

**Caso de uso - Autocomplete:**

```typescript
function crearAutocomplete() {
  const todasLasSiglas = listarSiglas();

  return {
    suggestions: todasLasSiglas,
    filter: (query) => todasLasSiglas.filter(s =>
      s.toLowerCase().startsWith(query.toLowerCase())
    )
  };
}
```

### Obtener estadísticas

Proporciona información sobre el contenido del diccionario.

```typescript
import { obtenerEstadisticas } from 'legal-expand';

const stats = obtenerEstadisticas();
console.log(stats);
/*
{
  totalAcronyms: 261,
  acronymsWithDuplicates: 28,
  acronymsWithPunctuation: 46
}
*/

console.log(`El diccionario contiene ${stats.totalAcronyms} siglas`);
console.log(`${stats.acronymsWithDuplicates} tienen múltiples significados`);
console.log(`${stats.acronymsWithPunctuation} incluyen puntuación`);
```

## Uso en frameworks

### Next.js (App Router)

El paquete es completamente compatible con Next.js 13+ y el nuevo App Router, funcionando tanto en Server Components como en Client Components.

**Server Component:**

```typescript
// app/documento/page.tsx
import { expandirSiglas } from 'legal-expand';

export default async function DocumentoPage({ params }) {
  const documento = await fetchDocumento(params.id);
  const textoExpandido = expandirSiglas(documento.contenido);

  return (
    <article>
      <h1>{documento.titulo}</h1>
      <div>{textoExpandido}</div>
    </article>
  );
}
```

**Client Component:**

```typescript
// app/components/editor-legal.tsx
'use client';

import { useState, useEffect } from 'react';
import { expandirSiglas, configurarGlobalmente } from 'legal-expand';

export default function EditorLegal() {
  const [texto, setTexto] = useState('');
  const [expandido, setExpandido] = useState('');

  useEffect(() => {
    // Configurar para toda la aplicación cliente
    configurarGlobalmente({
      defaultOptions: {
        format: 'html',
        expandOnlyFirst: true
      }
    });
  }, []);

  const handleExpand = () => {
    setExpandido(expandirSiglas(texto));
  };

  return (
    <div>
      <textarea value={texto} onChange={e => setTexto(e.target.value)} />
      <button onClick={handleExpand}>Expandir Siglas</button>
      <div dangerouslySetInnerHTML={{ __html: expandido }} />
    </div>
  );
}
```

**API Route:**

```typescript
// app/api/expandir/route.ts
import { expandirSiglas } from 'legal-expand';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { texto, opciones } = await request.json();

  const resultado = expandirSiglas(texto, opciones);

  return NextResponse.json({ resultado });
}
```

### Next.js (Pages Router)

**Generación estática (SSG):**

```typescript
// pages/documento/[id].tsx
import { expandirSiglas } from 'legal-expand';

export async function getStaticProps({ params }) {
  const documento = await fetchDocumento(params.id);
  const textoExpandido = expandirSiglas(documento.contenido);

  return {
    props: { documento, textoExpandido }
  };
}

export default function DocumentoPage({ textoExpandido }) {
  return <div>{textoExpandido}</div>;
}
```

**Renderizado en servidor (SSR):**

```typescript
// pages/legal.tsx
import { expandirSiglas } from 'legal-expand';

export async function getServerSideProps({ query }) {
  const filtro = query.tipo || 'todos';
  const documentos = await fetchDocumentos(filtro);

  const documentosExpandidos = documentos.map(doc => ({
    ...doc,
    contenido: expandirSiglas(doc.contenido, {
      format: 'html',
      expandOnlyFirst: true
    })
  }));

  return {
    props: { documentos: documentosExpandidos }
  };
}
```

### React

Ejemplo de hook personalizado para usar con React.

```typescript
import { useState, useCallback } from 'react';
import { expandirSiglas, type ExpansionOptions } from 'legal-expand';

function useSiglasLegales(opcionesDefecto?: ExpansionOptions) {
  const [resultado, setResultado] = useState('');

  const expandir = useCallback((texto: string, opciones?: ExpansionOptions) => {
    const expandido = expandirSiglas(texto, { ...opcionesDefecto, ...opciones });
    setResultado(expandido as string);
    return expandido;
  }, [opcionesDefecto]);

  return { resultado, expandir };
}

// Uso del hook
function ComponenteDocumento() {
  const { resultado, expandir } = useSiglasLegales({ format: 'html' });

  const handleProcesar = () => {
    expandir('La AEAT notifica el IVA');
  };

  return (
    <div>
      <button onClick={handleProcesar}>Procesar</button>
      <div dangerouslySetInnerHTML={{ __html: resultado }} />
    </div>
  );
}
```

### Vue 3

**Composition API:**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { expandirSiglas } from 'legal-expand';

const textoOriginal = ref('La AEAT notifica el IVA según el art. 5 del CC');
const formatoHtml = ref(false);

const textoExpandido = computed(() => {
  return expandirSiglas(textoOriginal.value, {
    format: formatoHtml.value ? 'html' : 'plain'
  });
});
</script>

<template>
  <div>
    <textarea v-model="textoOriginal"></textarea>
    <label>
      <input type="checkbox" v-model="formatoHtml"> Formato HTML
    </label>
    <div v-if="formatoHtml" v-html="textoExpandido"></div>
    <div v-else>{{ textoExpandido }}</div>
  </div>
</template>
```

**Options API:**

```vue
<script>
import { expandirSiglas, configurarGlobalmente } from 'legal-expand';

export default {
  data() {
    return {
      documento: '',
      expandido: ''
    };
  },
  created() {
    configurarGlobalmente({
      defaultOptions: {
        expandOnlyFirst: true
      }
    });
  },
  methods: {
    procesarDocumento() {
      this.expandido = expandirSiglas(this.documento);
    }
  }
};
</script>
```

### Svelte

```svelte
<script lang="ts">
  import { expandirSiglas } from 'legal-expand';

  let textoOriginal = '';
  let formato: 'plain' | 'html' = 'plain';

  $: textoExpandido = expandirSiglas(textoOriginal, { format: formato });
</script>

<textarea bind:value={textoOriginal}></textarea>

<select bind:value={formato}>
  <option value="plain">Texto Plano</option>
  <option value="html">HTML</option>
</select>

{#if formato === 'html'}
  {@html textoExpandido}
{:else}
  {textoExpandido}
{/if}
```

### Angular

```typescript
// siglas.service.ts
import { Injectable } from '@angular/core';
import { expandirSiglas, configurarGlobalmente, type ExpansionOptions } from 'legal-expand';

@Injectable({
  providedIn: 'root'
})
export class SiglasService {
  constructor() {
    configurarGlobalmente({
      defaultOptions: {
        format: 'html',
        expandOnlyFirst: true
      }
    });
  }

  expandir(texto: string, opciones?: ExpansionOptions): string {
    return expandirSiglas(texto, opciones) as string;
  }
}

// documento.component.ts
import { Component } from '@angular/core';
import { SiglasService } from './siglas.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-documento',
  template: `
    <div [innerHTML]="textoExpandido"></div>
  `
})
export class DocumentoComponent {
  textoExpandido: SafeHtml;

  constructor(
    private siglasService: SiglasService,
    private sanitizer: DomSanitizer
  ) {
    const texto = 'La AEAT notifica el IVA';
    const expandido = this.siglasService.expandir(texto);
    this.textoExpandido = this.sanitizer.bypassSecurityTrustHtml(expandido);
  }
}
```

## Casos de uso completos

### Procesamiento de sentencias judiciales

Las sentencias judiciales suelen contener múltiples referencias a leyes, artículos y organismos mediante siglas.

```typescript
import { expandirSiglas } from 'legal-expand';

function procesarSentencia(sentencia: string) {
  return expandirSiglas(sentencia, {
    format: 'html',
    expandOnlyFirst: true,
    exclude: ['art.', 'núm.']  // Muy comunes, no expandir
  });
}

const sentencia = `
  Visto el recurso de casación interpuesto por la AEAT contra
  la sentencia dictada por la AN el 15 de marzo de 2024, en
  relación con la liquidación del IVA correspondiente al ejercicio
  2023, y de conformidad con el art. 123 de la LEC...
`;

const sentenciaExpandida = procesarSentencia(sentencia);
```

### Sistema de ayuda contextual

Mostrar información sobre siglas al usuario cuando pasa el cursor o hace clic.

```typescript
import { buscarSigla, expandirSiglas } from 'legal-expand';

function crearSistemaAyuda(texto: string) {
  const resultado = expandirSiglas(texto, { format: 'structured' });

  const mapaAyuda = new Map();

  resultado.acronyms.forEach(sigla => {
    const info = buscarSigla(sigla.acronym);
    mapaAyuda.set(sigla.acronym, {
      significado: sigla.expansion,
      posicion: sigla.position,
      tieneMultiplesSignificados: info?.hasDuplicates,
      todosLosSignificados: info?.meanings
    });
  });

  return {
    textoOriginal: resultado.originalText,
    siglas: mapaAyuda,
    obtenerAyuda: (sigla: string) => mapaAyuda.get(sigla)
  };
}

// Uso en interfaz
const ayuda = crearSistemaAyuda(documento);
const infoAEAT = ayuda.obtenerAyuda('AEAT');
console.log(`Tooltip: ${infoAEAT.significado}`);
```

### Generación de glosarios automáticos

Crear un glosario de términos al final de un documento basado en las siglas encontradas.

```typescript
import { expandirSiglas } from 'legal-expand';

function generarDocumentoConGlosario(texto: string) {
  const resultado = expandirSiglas(texto, {
    format: 'structured',
    expandOnlyFirst: true
  });

  // Generar glosario único (sin duplicados)
  const glosario = new Map();
  resultado.acronyms.forEach(sigla => {
    if (!glosario.has(sigla.acronym)) {
      glosario.set(sigla.acronym, sigla.expansion);
    }
  });

  // Construir documento final
  let documentoFinal = resultado.expandedText;

  if (glosario.size > 0) {
    documentoFinal += '\n\n## Glosario de Siglas\n\n';

    // Ordenar alfabéticamente
    const siglasOrdenadas = Array.from(glosario.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    siglasOrdenadas.forEach(([sigla, significado]) => {
      documentoFinal += `- **${sigla}**: ${significado}\n`;
    });
  }

  return documentoFinal;
}

const documento = 'La AEAT gestiona el IVA y el IRPF según normativa del BOE.';
const conGlosario = generarDocumentoConGlosario(documento);
console.log(conGlosario);
/*
La AEAT (Agencia Estatal de Administración Tributaria) gestiona el IVA (Impuesto sobre el Valor Añadido)...

## Glosario de siglas

- **AEAT**: Agencia Estatal de Administración Tributaria
- **BOE**: Boletín Oficial del Estado
- **IRPF**: Impuesto sobre la Renta de las Personas Físicas
- **IVA**: Impuesto sobre el Valor Añadido
*/
```

### Validación de consistencia de documentos

Verificar que todas las siglas usadas en un documento estén en el diccionario.

```typescript
import { buscarSigla, listarSiglas } from 'legal-expand';

function validarDocumento(texto: string) {
  // Expresión regular para encontrar posibles siglas (2+ mayúsculas)
  const patronSiglas = /\b[A-ZÁÉÍÓÚÑÜ]{2,}\.?\b/g;
  const siglasEncontradas = texto.match(patronSiglas) || [];

  const siglasConocidas = new Set(listarSiglas());
  const resultados = {
    validas: [],
    invalidas: [],
    ambiguas: []
  };

  siglasEncontradas.forEach(sigla => {
    const info = buscarSigla(sigla);

    if (!info) {
      resultados.invalidas.push(sigla);
    } else if (info.hasDuplicates) {
      resultados.ambiguas.push({
        sigla,
        significados: info.meanings
      });
    } else {
      resultados.validas.push({
        sigla,
        significado: info.meanings[0]
      });
    }
  });

  return resultados;
}

const validacion = validarDocumento(miDocumento);
console.log(`Siglas válidas: ${validacion.validas.length}`);
console.log(`Siglas no reconocidas: ${validacion.invalidas.join(', ')}`);
console.log(`Siglas ambiguas: ${validacion.ambiguas.length}`);
```

### Comparación de versiones de documentos

Expandir siglas solo en cambios entre dos versiones de un documento.

```typescript
import { expandirSiglas } from 'legal-expand';

function compararVersiones(versionAntigua: string, versionNueva: string) {
  // Encontrar diferencias (ejemplo simplificado)
  const lineasAntiguas = versionAntigua.split('\n');
  const lineasNuevas = versionNueva.split('\n');

  const diferencias = lineasNuevas.map((linea, indice) => {
    if (linea !== lineasAntiguas[indice]) {
      return {
        lineaNumero: indice + 1,
        antigua: lineasAntiguas[indice],
        nueva: linea,
        nuevaExpandida: expandirSiglas(linea, { format: 'html' })
      };
    }
    return null;
  }).filter(Boolean);

  return diferencias;
}
```

## Uso en backend para LLMs

Una de las aplicaciones más potentes del paquete es pre-procesar textos legales en el backend antes de enviarlos a un Large Language Model (LLM). Esto mejora significativamente la comprensión del modelo al proporcionar el significado completo de las siglas.

### Beneficios de pre-formatear para LLMs

1. **Mayor precisión**: El LLM entiende el contexto completo sin tener que adivinar significados
2. **Menor bundle en frontend**: El paquete solo se carga en el servidor
3. **Control centralizado**: Toda la lógica de expansión está en el backend
4. **Consistencia**: Todos los textos procesados siguen las mismas reglas

### Next.js 13+ (App Router) - API route

Procesar texto legal antes de enviarlo a OpenAI GPT-4.

```typescript
// app/api/analizar-legal/route.ts
import { expandirSiglas } from 'legal-expand';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { textoLegal } = await request.json();

  // 1. Expandir siglas en el backend
  const textoExpandido = expandirSiglas(textoLegal, {
    format: 'plain',
    expandOnlyFirst: true  // Evitar saturar el texto
  });

  // 2. Enviar al LLM con contexto completo
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente legal experto en derecho español.'
        },
        {
          role: 'user',
          content: textoExpandido
        }
      ]
    })
  });

  const resultado = await response.json();
  return NextResponse.json({
    textoOriginal: textoLegal,
    textoExpandido,
    analisisLLM: resultado.choices[0].message.content
  });
}
```

**Llamada desde el frontend:**

```typescript
// app/components/analizador-legal.tsx
'use client';

import { useState } from 'react';

export default function AnalizadorLegal() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const analizar = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analizar-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoLegal: texto })
      });

      const data = await response.json();
      setResultado(data.analisisLLM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Pega aquí tu texto legal..."
      />
      <button onClick={analizar} disabled={loading}>
        {loading ? 'Analizando...' : 'Analizar con IA'}
      </button>
      {resultado && <div className="resultado">{resultado}</div>}
    </div>
  );
}
```

### Next.js 13+ - Server actions

Usar Server Actions para una integración más directa sin necesidad de crear API routes.

```typescript
// app/actions/analizar-sentencia.ts
'use server';

import { expandirSiglas } from 'legal-expand';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function analizarSentenciaJudicial(sentencia: string) {
  // 1. Pre-procesar en backend
  const sentenciaExpandida = expandirSiglas(sentencia, {
    format: 'plain',
    expandOnlyFirst: true,
    exclude: ['art.', 'núm.']  // Muy comunes en sentencias
  });

  // 2. Enviar a LLM
  const mensaje = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',  // o cualquier otro modelo
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Analiza la siguiente sentencia judicial española y proporciona un resumen ejecutivo:\n\n${sentenciaExpandida}`
      }
    ]
  });

  return {
    textoOriginal: sentencia,
    textoExpandido: sentenciaExpandida,
    analisis: mensaje.content[0].type === 'text' ? mensaje.content[0].text : ''
  };
}
```

**Componente cliente:**

```typescript
// app/components/analizador-sentencias.tsx
'use client';

import { useState } from 'react';
import { analizarSentenciaJudicial } from '@/actions/analizar-sentencia';

export default function AnalizadorSentencias() {
  const [sentencia, setSentencia] = useState('');
  const [resultado, setResultado] = useState<any>(null);

  const handleAnalizar = async () => {
    const analisis = await analizarSentenciaJudicial(sentencia);
    setResultado(analisis);
  };

  return (
    <div>
      <textarea
        value={sentencia}
        onChange={(e) => setSentencia(e.target.value)}
        placeholder="Pega la sentencia judicial..."
      />
      <button onClick={handleAnalizar}>Analizar</button>

      {resultado && (
        <div>
          <h3>Análisis del modelo:</h3>
          <p>{resultado.analisis}</p>

          <details>
            <summary>Ver texto expandido</summary>
            <pre>{resultado.textoExpandido}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

### Express.js backend

Para aplicaciones Express tradicionales.

```typescript
// server.ts
import express from 'express';
import { expandirSiglas } from 'legal-expand';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post('/api/procesar-documento', async (req, res) => {
  try {
    const { documento, tipoDocumento } = req.body;

    // Configurar expansión según tipo de documento
    const opcionesExpansion = tipoDocumento === 'sentencia'
      ? { expandOnlyFirst: true, exclude: ['art.', 'párr.', 'núm.'] }
      : { expandOnlyFirst: false };

    // Expandir siglas
    const documentoExpandido = expandirSiglas(documento, {
      format: 'plain',
      ...opcionesExpansion
    });

    // Enviar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en derecho español. Analiza documentos legales y proporciona resúmenes claros.'
        },
        {
          role: 'user',
          content: `Analiza el siguiente documento legal:\n\n${documentoExpandido}`
        }
      ]
    });

    res.json({
      documentoExpandido,
      analisis: completion.choices[0].message.content,
      siglasProcesadas: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar documento' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
```

### Serverless functions (Vercel, Netlify)

Ideal para aplicaciones serverless que necesitan procesar textos bajo demanda.

```typescript
// api/procesar-legal.ts
import { expandirSiglas } from 'legal-expand';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { texto, llmEndpoint } = req.body;

  // Pre-formatear en serverless
  const textoFormateado = expandirSiglas(texto, {
    format: 'plain',
    expandOnlyFirst: true
  });

  // Enviar a cualquier LLM
  const respuestaLLM = await fetch(llmEndpoint || process.env.LLM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LLM_API_KEY}`
    },
    body: JSON.stringify({
      prompt: textoFormateado,
      max_tokens: 2000
    })
  });

  const resultado = await respuestaLLM.json();

  res.status(200).json({
    textoOriginal: texto,
    textoExpandido: textoFormateado,
    respuestaLLM: resultado
  });
}
```

### AWS Lambda con Node.js

Función Lambda para procesar documentos legales.

```typescript
// lambda/procesar-documento.ts
import { expandirSiglas } from 'legal-expand';
import { BedrockRuntime } from '@aws-sdk/client-bedrock-runtime';

const bedrock = new BedrockRuntime({ region: 'us-east-1' });

export const handler = async (event) => {
  const { documento } = JSON.parse(event.body);

  // Expandir siglas
  const documentoExpandido = expandirSiglas(documento, {
    format: 'plain',
    expandOnlyFirst: true
  });

  // Usar AWS Bedrock
  const response = await bedrock.invokeModel({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',  // o cualquier otro modelo
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Analiza este documento legal:\n\n${documentoExpandido}`
        }
      ]
    })
  });

  const resultadoModelo = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      documentoExpandido,
      analisis: resultadoModelo.content[0].text
    })
  };
};
```

### Caso de uso completo: pipeline de análisis legal

Sistema completo que procesa múltiples documentos en lote.

```typescript
// services/legal-processor.ts
import { expandirSiglas } from 'legal-expand';
import { OpenAI } from 'openai';

interface DocumentoLegal {
  id: string;
  tipo: 'sentencia' | 'contrato' | 'demanda' | 'resolucion';
  contenido: string;
}

interface ResultadoAnalisis {
  id: string;
  textoExpandido: string;
  resumen: string;
  siglasProcesadas: string[];
  fecha: Date;
}

class LegalProcessor {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async procesarDocumento(doc: DocumentoLegal): Promise<ResultadoAnalisis> {
    // 1. Expandir siglas con opciones según tipo
    const opcionesExpansion = this.getOpcionesPorTipo(doc.tipo);
    const resultado = expandirSiglas(doc.contenido, {
      format: 'structured',
      ...opcionesExpansion
    });

    // 2. Enviar a OpenAI con contexto expandido
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.getPromptPorTipo(doc.tipo)
        },
        {
          role: 'user',
          content: resultado.expandedText
        }
      ]
    });

    // 3. Retornar resultado estructurado
    return {
      id: doc.id,
      textoExpandido: resultado.expandedText,
      resumen: completion.choices[0].message.content || '',
      siglasProcesadas: resultado.acronyms.map(a => a.acronym),
      fecha: new Date()
    };
  }

  async procesarLote(documentos: DocumentoLegal[]): Promise<ResultadoAnalisis[]> {
    // Procesar en paralelo con límite de concurrencia
    const BATCH_SIZE = 5;
    const resultados: ResultadoAnalisis[] = [];

    for (let i = 0; i < documentos.length; i += BATCH_SIZE) {
      const batch = documentos.slice(i, i + BATCH_SIZE);
      const batchResultados = await Promise.all(
        batch.map(doc => this.procesarDocumento(doc))
      );
      resultados.push(...batchResultados);
    }

    return resultados;
  }

  private getOpcionesPorTipo(tipo: DocumentoLegal['tipo']) {
    const configuraciones = {
      sentencia: {
        expandOnlyFirst: true,
        exclude: ['art.', 'núm.', 'párr.']
      },
      contrato: {
        expandOnlyFirst: false,
        exclude: []
      },
      demanda: {
        expandOnlyFirst: true,
        exclude: ['art.']
      },
      resolucion: {
        expandOnlyFirst: true,
        exclude: ['art.', 'Rs.']
      }
    };

    return configuraciones[tipo];
  }

  private getPromptPorTipo(tipo: DocumentoLegal['tipo']): string {
    const prompts = {
      sentencia: 'Eres un experto en análisis de sentencias judiciales españolas. Proporciona un resumen ejecutivo.',
      contrato: 'Eres un experto en derecho contractual español. Analiza el contrato y destaca cláusulas importantes.',
      demanda: 'Eres un experto en procedimiento civil español. Resume la demanda y sus pretensiones.',
      resolucion: 'Eres un experto en derecho administrativo español. Resume la resolución y sus fundamentos.'
    };

    return prompts[tipo];
  }
}

// Uso del procesador
const processor = new LegalProcessor();

// Procesar un documento
const resultado = await processor.procesarDocumento({
  id: 'sent-2024-001',
  tipo: 'sentencia',
  contenido: 'La AEAT impugnó la sentencia del TSJ...'
});

// Procesar múltiples documentos
const documentos: DocumentoLegal[] = [
  { id: '1', tipo: 'sentencia', contenido: '...' },
  { id: '2', tipo: 'contrato', contenido: '...' },
  { id: '3', tipo: 'demanda', contenido: '...' }
];

const resultados = await processor.procesarLote(documentos);
console.log(`Procesados ${resultados.length} documentos`);
```

### Integración con streaming de LLMs

Para respuestas en tiempo real con streaming.

```typescript
// app/api/analizar-stream/route.ts
import { expandirSiglas } from 'legal-expand';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { texto } = await req.json();

  // Expandir siglas antes de hacer streaming
  const textoExpandido = expandirSiglas(texto, {
    format: 'plain',
    expandOnlyFirst: true
  });

  // Crear stream
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: textoExpandido }
    ],
    stream: true
  });

  // Retornar streaming response
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    }
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

### Ventajas del enfoque backend

1. **Bundle Size**: El frontend no carga el diccionario (ahorro de ~4KB gzipped)
2. **Seguridad**: Las API keys del LLM permanecen en el servidor
3. **Cache**: Puedes cachear textos expandidos para reducir procesamiento
4. **Preprocesamiento**: Puedes aplicar múltiples transformaciones antes del LLM
5. **Monitoreo**: Centraliza logs y métricas de uso
6. **Costos**: Controla exactamente cuándo y cómo se llama al LLM

### Ejemplo con caché

```typescript
// lib/cached-processor.ts
import { expandirSiglas } from 'legal-expand';
import { createHash } from 'crypto';

const cache = new Map<string, string>();

export function procesarConCache(texto: string) {
  // Generar hash del texto
  const hash = createHash('sha256').update(texto).digest('hex');

  // Verificar caché
  if (cache.has(hash)) {
    console.log('Cache hit');
    return cache.get(hash)!;
  }

  // Expandir y cachear
  const expandido = expandirSiglas(texto, {
    format: 'plain',
    expandOnlyFirst: true
  });

  cache.set(hash, expandido);
  return expandido;
}
```

Este enfoque es ideal cuando:
- No quieres cargar el paquete en el frontend
- Necesitas preprocesar antes de enviar a un LLM
- Quieres centralizar la lógica de expansión
- Trabajas con documentos confidenciales que no deben procesarse en el cliente

## Protección de contextos

El paquete incluye detección inteligente de contextos donde las siglas no deben expandirse para evitar romper URLs, direcciones de email, o código.

### URLs

Las siglas dentro de URLs no se expanden para mantener los enlaces funcionales.

```typescript
const texto = 'Visita https://aeat.es para más información sobre AEAT';
const resultado = expandirSiglas(texto);

console.log(resultado);
// Salida: 'Visita https://aeat.es para más información sobre AEAT (Agencia Estatal de Administración Tributaria)'
// La URL queda intacta
```

### Direcciones de email

Similar a las URLs, los emails no se modifican.

```typescript
const texto = 'Contacta con info@aeat.es o con la AEAT directamente';
const resultado = expandirSiglas(texto);

console.log(resultado);
// Salida: 'Contacta con info@aeat.es o con la AEAT (Agencia Estatal de Administración Tributaria) directamente'
```

### Bloques de código

En documentos markdown o técnicos, el código no se modifica.

```typescript
const texto = `
  Para usar AEAT en código:
  \`\`\`javascript
  const AEAT = require('aeat');
  \`\`\`
  La AEAT es un organismo oficial.
`;

const resultado = expandirSiglas(texto);
// El código dentro de ``` no se toca, pero "La AEAT es..." sí se expande
```

### Código inline

```typescript
const texto = 'Usa `AEAT.procesar()` para procesar con AEAT';
const resultado = expandirSiglas(texto);
// `AEAT.procesar()` no se modifica, pero "con AEAT" sí se expande
```

## Extensibilidad

### Crear formatter personalizado

Puedes crear tus propios formatters para generar salidas en formatos específicos.

```typescript
import { FormatterFactory, type Formatter } from 'legal-expand';

class MarkdownFormatter implements Formatter {
  format(originalText: string, matches: any[]): string {
    if (matches.length === 0) {
      return originalText;
    }

    let result = originalText;

    // Ordenar por posición descendente
    const sorted = [...matches].sort((a, b) => b.startPos - a.startPos);

    for (const match of sorted) {
      const before = result.substring(0, match.endPos);
      const after = result.substring(match.endPos);

      // Formato: **AEAT** (Agencia...)
      const acronym = result.substring(match.startPos, match.endPos);
      result = `${before.substring(0, match.startPos)}**${acronym}** (${match.expansion})${after}`;
    }

    return result;
  }
}

// Registrar el formatter
FormatterFactory.registerFormatter('markdown', new MarkdownFormatter());

// Usar el formatter personalizado
const resultado = expandirSiglas('La AEAT notifica', {
  format: 'markdown' as any
});
console.log(resultado);
// Salida: 'La **AEAT** (Agencia Estatal de Administración Tributaria) notifica'
```

### Formatter para tooltips con CSS

```typescript
class TooltipFormatter implements Formatter {
  format(originalText: string, matches: any[]): string {
    if (matches.length === 0) {
      return originalText;
    }

    let result = originalText;
    const sorted = [...matches].sort((a, b) => b.startPos - a.startPos);

    for (const match of sorted) {
      const acronym = originalText.substring(match.startPos, match.endPos);
      const replacement = `<span class="sigla-legal" data-tooltip="${match.expansion}">${acronym}</span>`;

      result =
        result.substring(0, match.startPos) +
        replacement +
        result.substring(match.endPos);
    }

    return result;
  }
}

FormatterFactory.registerFormatter('tooltip', new TooltipFormatter());
```

Luego en tu CSS:

```css
.sigla-legal {
  border-bottom: 1px dotted #666;
  cursor: help;
  position: relative;
}

.sigla-legal:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  z-index: 1000;
}
```

## API completa

### expandirSiglas(texto, opciones?)

Función principal que expande siglas en un texto.

**Parámetros:**
- `texto` (string): Texto a procesar
- `opciones` (ExpansionOptions, opcional): Configuración de expansión

**Retorna:** `string | StructuredOutput` según el formato especificado

### expandirSiglasDetallado(texto, opciones?)

Versión de diagnóstico que devuelve salida estructurada y listado de omisiones.

**Parámetros:**
- `texto` (string): Texto a procesar
- `opciones` (ExpansionOptions, opcional): Configuración de expansión

**Retorna:** `DiagnosticOutput`

**Tipos:**

```typescript
interface ExpansionOptions {
  format?: 'plain' | 'html' | 'structured';
  forceExpansion?: boolean;
  preserveCase?: boolean;
  autoResolveDuplicates?: boolean;
  duplicateResolution?: Record<string, string>;
  expandOnlyFirst?: boolean;
  exclude?: string[];
  include?: string[];
}

interface StructuredOutput {
  originalText: string;
  expandedText: string;
  acronyms: ExpandedAcronym[];
  stats: {
    totalAcronymsFound: number;
    totalExpanded: number;
    ambiguousNotExpanded: number;
  };
}

type OmittedAcronymReason =
  | 'excluded'
  | 'not-in-include'
  | 'expand-only-first'
  | 'ambiguous-unresolved'
  | 'inside-url'
  | 'inside-email'
  | 'inside-code-block'
  | 'inside-inline-code'
  | 'not-found';

interface OmittedAcronym {
  acronym: string;
  position: { start: number; end: number };
  reason: OmittedAcronymReason;
  details?: string;
}

interface DiagnosticOutput extends StructuredOutput {
  omittedAcronyms: OmittedAcronym[];
}
```

### configurarGlobalmente(config)

Configura el comportamiento global del paquete.

**Parámetros:**
- `config` (GlobalConfig): Configuración global

```typescript
interface GlobalConfig {
  enabled?: boolean;
  defaultOptions?: Partial<ExpansionOptions>;
}
```

### obtenerConfiguracionGlobal()

Retorna la configuración global actual.

**Retorna:** `Readonly<GlobalConfig>`

### resetearConfiguracion()

Restaura la configuración global a valores por defecto.

### buscarSigla(sigla)

Busca información sobre una sigla específica en el diccionario.

**Parámetros:**
- `sigla` (string): Sigla a buscar

**Retorna:** `AcronymSearchResult | null`

```typescript
interface AcronymSearchResult {
  acronym: string;
  meanings: string[];
  hasDuplicates: boolean;
}
```

### listarSiglas()

Retorna array con todas las siglas disponibles.

**Retorna:** `string[]`

### obtenerEstadisticas()

Retorna estadísticas del diccionario.

**Retorna:** `DictionaryStats`

```typescript
interface DictionaryStats {
  totalAcronyms: number;
  acronymsWithDuplicates: number;
  acronymsWithPunctuation: number;
}
```

## Siglas incluidas

El paquete incluye **646 siglas legales españolas**, organizadas en las siguientes categorías:

### Impuestos y tributos (45 siglas)

AEAT, IVA, IRPF, IS, ISD, ITP, AJD, IVTM, IBI, IAE, ICIO, IEPPF, IGIC, IGTE, II.EE., IIVTNU, IMIVT, IP, IPC, IRNR, etc.

### Leyes y normativa (80+ siglas)

CC, CCom, CE, LEC, LECrim, LEF, LES, LG, LGDCU, LGEP, LGP, LGSS, LGT, LH, LHL, LIRPF, LIS, LISOS, LIVA, LJCA, LOCE, LODE, LOFAGE, LOFCA, LOGSE, LOLS, LOPJ, LOTC, LOTCu, LOTJ, LPA, LPACAP, LPAP, LPGE, LPL, LPRL, LRJAE, LRJAP y PAC, LRJCA, LRJSP, LSA, LSRL, LTPOAJD, etc.

### Organismos e instituciones (60+ siglas)

AENA, AN, AP, BCE, BEI, BOCG, BOE, BOICAC, BOP, CC.AA., CEOE, CES, CGPJ, CNMV, DGCHT, DGRN, DGT, EE.GG., EE.LL., FEADER, FEDER, FEOGA, FFAA, FNMT, FOGASA, FSE, ICAC, IMSERSO, INEM, INGESA, INI, INSALUD, INSERSO, INSHT, INSS, ISFAS, ISM, JCCA, MUFACE, MUGEJU, OCDE, OIT, SENPA, SEPI, SERGAS, TC, TCJ, TCT, TEAC, TEAP, TEAR, TGSS, TJCE, TJUE, TS, TSJ, etc.

### Abreviaturas comunes (30+ siglas)

art., apdo., cfr., disp. adic., disp. derog., disp. final, disp. trans., DNI, expte., Excmo., Ilmo., núm., párr., rec., recl., Rgto., Rs., S., Ss., ss., etc.

### Tipos de sociedades (15+ siglas)

S.A., S.A.L., S.Coop., S.L., S.R.L., S.A.T., s.en C., SLNE, SCE, AIE, UTE, etc.

### Otros (30+ siglas)

AMI, ASEC, AT/EP, CAE, CTU, DUA, ERE, ET, ETT, ETVE, EVI, I+D, I+D+i, IT, LAU, PGC, PGCP, PGE, PGOU, pyme, REA, REM, RETA, RIC, SETA, SIM, SIMCAV, SMAC, SMI, SOVI, VPO, etc.

## TypeScript

El paquete está completamente tipado con TypeScript. Todos los tipos están exportados para su uso.

```typescript
import type {
  ExpansionOptions,
  ExpandedAcronym,
  StructuredOutput,
  GlobalConfig,
  AcronymSearchResult,
  DictionaryStats,
  Formatter
} from 'legal-expand';

// Uso con tipos
const opciones: ExpansionOptions = {
  format: 'html',
  expandOnlyFirst: true,
  exclude: ['CC']
};

const resultado: string = expandirSiglas('texto', opciones) as string;

// Tipo StructuredOutput
const analisis: StructuredOutput = expandirSiglas('texto', {
  format: 'structured'
}) as StructuredOutput;

console.log(analisis.stats.totalExpanded);
```

## Rendimiento

El paquete está optimizado para procesar documentos legales de forma eficiente:

- **Tamaño del paquete**: Aproximadamente 4KB gzipped
- **Tiempo de procesamiento**:
  - Textos pequeños (100 palabras): menos de 5ms
  - Textos medianos (1,000 palabras): menos de 20ms
  - Textos grandes (10,000 palabras): menos de 100ms
- **Optimizaciones**:
  - Regex pre-compilada al cargar el módulo
  - Diccionario indexado para búsquedas O(1)
  - Tree-shakeable (solo importas lo que usas)
  - Sin dependencias en runtime

## Compatibilidad

- **Node.js**: 18.0.0 o superior
- **Navegadores**: Todos los navegadores modernos (ES2020+)
- **TypeScript**: 5.0.0 o superior
- **Frameworks**: Next.js, React, Vue, Angular, Svelte, y otros

## Fuentes de las siglas

El diccionario de siglas de este paquete ha sido compilado a partir de múltiples fuentes oficiales y especializadas en terminología jurídica española:

### Fuentes institucionales

#### Real Academia Española (RAE) - Libro de Estilo de la Justicia

Apéndice 2: Siglas más usualmente empleadas en textos jurídicos españoles, incluyendo leyes orgánicas, organismos institucionales, normativa procesal y administrativa.

- **URL**: [https://www.rae.es/libro-estilo-justicia/apéndice-2-siglas](https://www.rae.es/libro-estilo-justicia/apéndice-2-siglas)
- **Cobertura**: Siglas legislativas, organismos públicos, tribunales, procedimientos judiciales
- **Actualización**: Mantenido por la Real Academia Española

#### Diccionario Panhispánico del Español Jurídico (DPEJ) - RAE

Diccionario especializado con definiciones jurídicas enriquecidas, documentación de legislación y jurisprudencia, y una sección específica dedicada a siglas del ámbito legal.

- **URL**: [https://dpej.rae.es/contenido/siglas-jurídicas](https://dpej.rae.es/contenido/siglas-jurídicas)
- **Cobertura**: Terminología jurídica panhispánica, siglas con contexto legal
- **Actualización**: Proyecto conjunto de instituciones jurídicas hispanohablantes

### Fuentes propias

Además de las fuentes institucionales, el diccionario incluye siglas recopiladas y verificadas de:

- Boletín Oficial del Estado (BOE)
- Legislación española vigente
- Documentación de organismos públicos (AEAT, Seguridad Social, etc.)
- Práctica jurídica habitual en España
- Terminología fiscal y tributaria especializada

### Proceso de validación

Todas las siglas incluidas en el diccionario han sido:

1. **Verificadas** contra fuentes oficiales
2. **Normalizadas** según criterios de la RAE
3. **Priorizadas** según frecuencia de uso en textos legales
4. **Depuradas** eliminando duplicados y variantes incorrectas

El diccionario contiene actualmente **646 siglas** verificadas y está en constante actualización.

## Calidad y mantenimiento

Comandos recomendados para validar el paquete antes de publicar:

```bash
# Validar consistencia del diccionario compilado
npm run validate:dictionary

# Ejecutar tests + cobertura
npm run test:coverage

# Benchmark de humo con umbrales (falla ante regresiones)
npm run bench:check
```

Si necesitas ajustar límites de benchmark en CI:

```bash
LEGAL_EXPAND_BENCH_MAX_AVG_MS=8 \
LEGAL_EXPAND_BENCH_MAX_P95_MS=14 \
LEGAL_EXPAND_BENCH_MAX_HEAP_MB=10 \
npm run bench:check
```

En este monorepo puedes lanzar la landing desde la raíz con:

```bash
npm run landing:dev
npm run landing:build
```

## Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y añade tests si es necesario
4. Asegúrate de que pasan validación, tests y benchmark (`npm run validate:dictionary && npm run test:coverage && npm run bench:check`)
5. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
6. Push a tu rama (`git push origin feature/nueva-funcionalidad`)
7. Crea un Pull Request

### Añadir nuevas siglas

Si quieres añadir nuevas siglas legales al diccionario, sigue estos pasos:

#### 1. Editar el archivo dictionary.json

Abre el archivo `src/data/dictionary.json` y añade una nueva entrada en el array `entries`:

```json
{
  "id": "identificador-unico",
  "original": "SIGLA",
  "significado": "Significado completo de la sigla",
  "variants": ["SIGLA", "S.I.G.L.A.", "S.I.G.L.A"],
  "priority": 100
}
```

**Campos:**

- **id**: Identificador único (ej: `"lopd-001"`)
- **original**: La sigla principal en mayúsculas
- **significado**: Definición completa oficial
- **variants**: Array con todas las variantes (con/sin puntos, espacios)
- **priority**: Prioridad (100 = estándar, mayor = más prioritario en conflictos)

**Ejemplo completo:**

```json
{
  "id": "lopd-001",
  "original": "LOPD",
  "significado": "Ley Orgánica de Protección de Datos",
  "variants": ["LOPD", "L.O.P.D.", "L.O.P.D"],
  "priority": 100
}
```

#### 2. Actualizar los índices

Después de añadir la entrada, actualiza los índices en el mismo archivo `dictionary.json`:

**En `index.exact`**, añade las variantes exactas:

```json
"index": {
  "exact": {
    "LOPD": ["lopd-001"],
    "L.O.P.D.": ["lopd-001"],
    "L.O.P.D": ["lopd-001"]
  }
}
```

**En `index.normalized`**, añade la versión normalizada (minúsculas, sin puntos):

```json
"index": {
  "normalized": {
    "lopd": ["lopd-001"]
  }
}
```

**Importante:**
- Si la sigla ya existe con otro significado, agrégala al array: `["lopd-001", "lopd-002"]`
- Esto creará un duplicado que requerirá resolución manual del usuario

#### 3. Recompilar el paquete

Después de editar el JSON, recompila el paquete:

```bash
npm run build
```

#### 4. Verificar el resultado

Ejecuta el test manual para verificar que la nueva sigla funciona correctamente:

```bash
node test/test-manual.js
```

O prueba directamente en Node.js:

```bash
node
> const { expandirSiglas } = require('./dist/cjs/index.cjs')
> expandirSiglas('La LOPD establece...')
```

#### 5. Exportar listado de siglas

Para ver todas las siglas disponibles en formato TXT y verificar que no exista ya la que quieres añadir:

```bash
npm run export-siglas
```

Este comando genera un archivo `siglas-listado.txt` con todas las siglas y sus significados, útil para:
- Verificar que la sigla no existe antes de añadirla
- Revisar el diccionario completo
- Compartir el listado con colaboradores
- Documentación externa
- Control de calidad

El archivo generado tiene el formato:

```
SIGLAS LEGALES ESPAÑOLAS
========================
Total: 646 siglas
Siglas con múltiples significados: 0

[A]
   AEAT                 → Agencia Estatal de Administración Tributaria
   BOE                  → Boletín Oficial del Estado
 * cfr.                 → confróntese (tiene múltiples significados)
...
```

#### 6. Buenas prácticas

Al añadir nuevas siglas:

- **Verifica que no exista**: Usa `npm run export-siglas` para revisar el listado actual
- **Usa el significado oficial**: Consulta fuentes oficiales (BOE, organismos públicos)
- **Genera todas las variantes**: Incluye versiones con y sin puntos, con y sin espacios
- **ID único**: Usa formato `sigla-001`, incrementando el número si hay duplicados
- **Priority coherente**:
  - 100 = prioridad estándar
  - 110+ = alta prioridad (significado más común)
  - 90- = baja prioridad (significado menos común)
- **Formato coherente**:
  - Nombres propios con mayúscula inicial
  - Siglas de leyes con formato completo: "Ley de..."
  - Organismos con nombre completo oficial

#### 7. Casos especiales

**Siglas con puntos:**

```json
{
  "id": "art-001",
  "original": "art.",
  "significado": "Artículo",
  "variants": ["art.", "art", "ART.", "ART"],
  "priority": 100
}
```

**Siglas con espacios internos:**

```json
{
  "id": "iiee-001",
  "original": "II. EE.",
  "significado": "Impuestos Especiales",
  "variants": ["II. EE.", "II.EE.", "II.EE", "IIEE"],
  "priority": 100
}
```

**Siglas con barra:**

```json
{
  "id": "atep-001",
  "original": "AT/EP",
  "significado": "Accidente de trabajo/Enfermedad profesional",
  "variants": ["AT/EP", "ATEP"],
  "priority": 100
}
```

**Múltiples significados (duplicados):**

Si una sigla tiene varios significados válidos, crea múltiples entradas y añádelas al array `conflicts`:

```json
{
  "entries": [
    {
      "id": "dgt-001",
      "original": "DGT",
      "significado": "Dirección General de Tributos",
      "variants": ["DGT"],
      "priority": 100
    },
    {
      "id": "dgt-002",
      "original": "DGT",
      "significado": "Dirección General de Tráfico",
      "variants": ["DGT"],
      "priority": 100
    }
  ],
  "conflicts": [
    {
      "sigla": "DGT",
      "defaultId": "dgt-001",
      "variants": [
        {
          "id": "dgt-001",
          "significado": "Dirección General de Tributos",
          "priority": 100
        },
        {
          "id": "dgt-002",
          "significado": "Dirección General de Tráfico",
          "priority": 100
        }
      ]
    }
  ]
}
```

El usuario deberá resolver manualmente el conflicto usando `duplicateResolution` en las opciones.

## Reportar problemas

Si encuentras un error o tienes una sugerencia:

1. Verifica que el problema no haya sido reportado previamente
2. Crea un nuevo issue con descripción detallada
3. Incluye ejemplos de código si es posible
4. Especifica tu versión de Node.js y del paquete

## Licencia

MIT

## Créditos

Desarrollado con el diccionario de 646 siglas legales españolas verificadas de fuentes oficiales (RAE, BOE, DPEJ).
