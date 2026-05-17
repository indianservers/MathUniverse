import { linearY, quadraticY } from "./math";

export type GraphPoint = { x: number; y: number };

export function generateRange(min: number, max: number, step = 1) {
  const values: number[] = [];
  for (let value = min; value <= max + step / 2; value += step) {
    values.push(Number(value.toFixed(10)));
  }
  return values;
}

export function generateFunctionData(fn: (x: number) => number, min: number, max: number, step = 1): GraphPoint[] {
  return generateRange(min, max, step).map((x) => ({ x, y: fn(x) }));
}

export function generateLinearData(m: number, c: number, min = -10, max = 10, step = 1) {
  return generateFunctionData((x) => linearY(x, m, c), min, max, step);
}

export function generateQuadraticData(a: number, b: number, c: number, min = -10, max = 10, step = 1) {
  return generateFunctionData((x) => quadraticY(x, a, b, c), min, max, step);
}

export function generateSineData(amplitude = 1, frequency = 1, phase = 0, min = 0, max = Math.PI * 2, step = 0.2) {
  return generateFunctionData((x) => amplitude * Math.sin(frequency * x + phase), min, max, step);
}

export function generateCosineData(amplitude = 1, frequency = 1, phase = 0, min = 0, max = Math.PI * 2, step = 0.2) {
  return generateFunctionData((x) => amplitude * Math.cos(frequency * x + phase), min, max, step);
}
