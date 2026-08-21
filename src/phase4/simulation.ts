import type { SimulationRecord } from "./types";

export function runSamplingSimulation(options: { seed: number; trials: number; sampleSize: number; probability?: number; kind?: "COIN_MEAN" | "DICE_MEAN" | "RANDOM_WALK" }): SimulationRecord {
  const trials = Math.max(1, Math.min(1_000_000, Math.floor(options.trials))); const sampleSize = Math.max(1, Math.min(100_000, Math.floor(options.sampleSize))); const kind = options.kind ?? "COIN_MEAN"; const random = mulberry32(options.seed); const results: number[] = [];
  for (let trial = 0; trial < trials; trial += 1) { let sum = 0; if (kind === "RANDOM_WALK") { for (let draw = 0; draw < sampleSize; draw += 1) sum += random() < 0.5 ? -1 : 1; results.push(sum); continue; } for (let draw = 0; draw < sampleSize; draw += 1) sum += kind === "DICE_MEAN" ? 1 + Math.floor(random() * 6) : random() < (options.probability ?? 0.5) ? 1 : 0; results.push(sum / sampleSize); }
  const mean = results.reduce((a, b) => a + b, 0) / results.length; const variance = results.length > 1 ? results.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (results.length - 1) : 0;
  return { id: `simulation-${kind.toLowerCase()}-${options.seed}-${trials}-${sampleSize}`, kind, seed: options.seed, generator: "mulberry32", parameters: { sampleSize, probability: options.probability ?? 0.5 }, trials, executionVersion: "1.0.0", results, summary: { mean, variance, standardDeviation: Math.sqrt(variance), minimum: Math.min(...results), maximum: Math.max(...results) }, reproduction: `runSamplingSimulation({seed:${options.seed},trials:${trials},sampleSize:${sampleSize},kind:"${kind}"})`, nodeId: `simulation-node-${kind.toLowerCase()}-${options.seed}` };
}

export function mulberry32(seed: number) { let state = seed >>> 0; return () => { state += 0x6d2b79f5; let value = state; value = Math.imul(value ^ value >>> 15, value | 1); value ^= value + Math.imul(value ^ value >>> 7, value | 61); return ((value ^ value >>> 14) >>> 0) / 4294967296; }; }
