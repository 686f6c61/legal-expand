# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-22

### Added

- Nueva API `expandirSiglasDetallado()` para inspeccionar omisiones con motivo exacto.
- Nuevos tipos públicos: `DiagnosticOutput`, `OmittedAcronym`, `OmittedAcronymReason`.
- Validación de diccionario con `npm run validate:dictionary`.
- Benchmark de umbrales con `npm run bench:check` (pensado para CI).
- Workflow de CI reforzado con validación de diccionario y benchmark.
- Landing actualizada con documentación/ejemplos de diagnóstico y soporte ESM+CJS.

### Changed

- Distribución dual de módulos: `import` (ESM) y `require` (CJS).
- `package.json` actualizado con `exports.import` + `exports.require`.
- `prepublishOnly` ahora ejecuta validación de diccionario, build, cobertura y benchmark.
- Soporte de workspaces para flujo monorepo (librería + landing).
- README ampliado con compatibilidad ESM/CJS, API de diagnóstico y comandos de calidad.
- Versión de librería y landing actualizada a `1.2.0`.

### Fixed

- Métricas estructuradas y diagnóstico de omisiones alineadas con el resultado real del matcher.
- Cobertura y pruebas ampliadas para proteger regresiones en matching, contexto y formatters.

## [1.0.0] - 2025-01-XX

### Added

#### Core Features
- Initial public release of legal-expand
- Complete dictionary with 646 verified Spanish legal acronyms
- Support for official sources: RAE, BOE, and DPEJ
- Intelligent variant detection (e.g., AEAT, A.E.A.T., A.E.A.T)
- Three output formats: plain text, HTML, and structured JSON
- Selective expansion with `expandOnlyFirst` option for long documents
- Global configuration system with `configurarGlobalmente()`
- Configuration override capability with `forceExpansion` option

#### Expansion Options
- `format`: Choose between 'plain', 'html', or 'structured' output
- `expandOnlyFirst`: Expand only the first occurrence of each acronym
- `forceExpansion`: Override global configuration for specific calls
- `preserveCase`: Maintain original capitalization in expansions
- `autoResolveDuplicates`: Automatically resolve ambiguous acronyms using priority
- `duplicateResolution`: Manually specify meanings for ambiguous acronyms
- `exclude`: Exclude specific acronyms from expansion
- `include`: Expand only specified acronyms

#### Duplicate Handling
- Priority-based automatic resolution for acronyms with multiple meanings
- Manual resolution via `duplicateResolution` option
- Configurable priority system in dictionary (scale: 60-150)
- 47 acronyms with multiple meanings properly handled

#### Query Functions
- `buscarSigla(sigla)`: Search for specific acronym in dictionary
- `listarSiglas()`: Get list of all available acronyms
- `obtenerEstadisticas()`: Retrieve dictionary statistics

#### Context Protection
- Automatic protection for URLs (e.g., https://ejemplo.com/BOE/123)
- Automatic protection for email addresses (e.g., usuario@BOE.es)
- Automatic protection for code blocks (```)
- Automatic protection for inline code (`)

#### TypeScript Support
- Full TypeScript type definitions
- Exported interfaces: `ExpansionOptions`, `GlobalConfig`, `StructuredOutput`, `ExpandedAcronym`, `AcronymSearchResult`, `DictionaryStats`, `Formatter`
- Complete IntelliSense support in modern IDEs

#### Extensibility
- Custom formatter registration via `FormatterFactory.registerFormatter()`
- Formatter interface for creating custom output formats
- `FormatterFactory.listFormatters()` to discover available formatters

#### Performance
- Optimized for long documents with selective expansion
- Tree-shakeable ESM bundle (approximately 4KB gzipped)
- Zero runtime dependencies
- SSR-safe for Next.js, Remix, SvelteKit, and other frameworks

#### Dictionary Statistics
- Total acronyms: 646
- Acronyms with duplicates: 47
- Acronyms with punctuation: 156
- Categories: Tax law, Constitutional law, Procedural law, Administrative law, Abbreviations

#### Package Configuration
- ESM module format
- Proper package.json exports configuration
- Side-effects free (supports tree-shaking)
- MIT License

### Documentation

- Comprehensive README.md with usage examples
- API reference documentation
- Interactive demo landing page at https://legal-expand.onrender.com
- TypeScript type definitions included
- Examples for all major features
- Duplicate handling documentation with three resolution methods
- Priority scale documentation (60-150 range)
- Context protection documentation

### Development

- TypeScript 5.3+ source code
- Vitest test suite
- Build scripts for compilation
- Scripts for dictionary management
- Export utilities for acronym lists

---

## Release Notes

### What's New in v1.0.0

This is the initial release of **legal-expand**, a TypeScript library designed to automatically expand Spanish legal acronyms in legal texts. The library includes 646 verified acronyms from official sources (RAE, BOE, DPEJ) and provides intelligent expansion with multiple output formats.

**Key Features:**
- Comprehensive dictionary of 646 verified Spanish legal acronyms
- Intelligent variant detection and duplicate handling
- Three output formats (plain text, HTML with semantic markup, structured JSON)
- Optimized for long documents with selective first-occurrence expansion
- Full TypeScript support with complete type definitions
- Zero runtime dependencies and tree-shakeable
- SSR-safe for modern frameworks
- Extensible formatter system

**Use Cases:**
- Law students studying complex legal texts
- Competitive exam candidates (opositores) preparing materials
- Legal professionals reviewing documents
- Academies and universities creating educational content
- Public administration improving citizen communications
- Developers building legal applications and APIs

**Getting Started:**
```bash
npm install legal-expand
```

```typescript
import { expandirSiglas } from 'legal-expand';

const texto = 'La AEAT notifica el IVA';
const resultado = expandirSiglas(texto);
// "La AEAT (Agencia Estatal de Administración Tributaria) notifica el IVA (Impuesto sobre el Valor Añadido)"
```

For complete documentation, visit: https://legal-expand.onrender.com

---

[1.2.0]: https://github.com/686f6c61/legal-expand/releases/tag/v1.2.0
[1.0.0]: https://github.com/686f6c61/legal-expand/releases/tag/v1.0.0
