/**
 * Benchmark de humo con umbrales para detectar regresiones de rendimiento.
 */

import { performance } from 'node:perf_hooks';
import { expandirSiglas } from '../src/index.js';

const ITERATIONS = Number(process.env.LEGAL_EXPAND_BENCH_ITERATIONS ?? 80);
const WARMUP_ITERATIONS = Number(process.env.LEGAL_EXPAND_BENCH_WARMUP ?? 15);
const MAX_AVG_MS = Number(process.env.LEGAL_EXPAND_BENCH_MAX_AVG_MS ?? 12);
const MAX_P95_MS = Number(process.env.LEGAL_EXPAND_BENCH_MAX_P95_MS ?? 25);
const MAX_HEAP_MB = Number(process.env.LEGAL_EXPAND_BENCH_MAX_HEAP_MB ?? 12);

const PARAGRAPH = [
  'La AEAT notificó el IVA conforme al art. 123 del CC y a la LGT.',
  'El BOE publicó un RD que afecta al IRPF, IS e ITP.',
  'Según la LEC y la CE, el TS confirmó la sentencia del TC.'
].join(' ');

const LONG_TEXT = Array.from({ length: 40 }, () => PARAGRAPH).join(' ');

function quantile(values: number[], q: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] === undefined) {
    return sorted[base];
  }

  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function format(n: number): string {
  return Number.isFinite(n) ? n.toFixed(2) : String(n);
}

function run() {
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    expandirSiglas(LONG_TEXT, { expandOnlyFirst: true });
  }

  if (typeof global.gc === 'function') {
    global.gc();
  }

  const heapBefore = process.memoryUsage().heapUsed;
  const times: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    expandirSiglas(LONG_TEXT, { expandOnlyFirst: true });
    const end = performance.now();
    times.push(end - start);
  }

  if (typeof global.gc === 'function') {
    global.gc();
  }

  const heapAfter = process.memoryUsage().heapUsed;
  const heapDeltaMb = (heapAfter - heapBefore) / (1024 * 1024);
  const avgMs = times.reduce((acc, value) => acc + value, 0) / times.length;
  const p95Ms = quantile(times, 0.95);

  console.log('Benchmark legal-expand');
  console.log(`- Iterations: ${ITERATIONS} (+${WARMUP_ITERATIONS} warmup)`);
  console.log(`- Avg: ${format(avgMs)} ms (max ${format(MAX_AVG_MS)} ms)`);
  console.log(`- P95: ${format(p95Ms)} ms (max ${format(MAX_P95_MS)} ms)`);
  console.log(`- Heap delta: ${format(heapDeltaMb)} MB (max ${format(MAX_HEAP_MB)} MB)`);

  const failures: string[] = [];
  if (avgMs > MAX_AVG_MS) {
    failures.push(`Avg ${format(avgMs)} ms > ${format(MAX_AVG_MS)} ms`);
  }
  if (p95Ms > MAX_P95_MS) {
    failures.push(`P95 ${format(p95Ms)} ms > ${format(MAX_P95_MS)} ms`);
  }
  if (heapDeltaMb > MAX_HEAP_MB) {
    failures.push(`Heap delta ${format(heapDeltaMb)} MB > ${format(MAX_HEAP_MB)} MB`);
  }

  if (failures.length > 0) {
    console.error('❌ Benchmark threshold check failed:');
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }

  console.log('✅ Benchmark thresholds passed.');
}

run();
