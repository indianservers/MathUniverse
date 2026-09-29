export type PopulationShape = "skewed" | "uniform";

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawSample(shape: PopulationShape, size: number, seed: number) {
  const next = random(seed);
  const values = Array.from({ length: size }, () => {
    const u = Math.min(1 - 1e-9, Math.max(1e-9, next()));
    return shape === "uniform" ? 50 + (u - 0.5) * 20 * Math.sqrt(3) : 40 - 10 * Math.log(1 - u);
  });
  return { values, mean: values.reduce((sum, value) => sum + value, 0) / size };
}

export function sampleMeans(shape: PopulationShape, size: number, count: number, seedOffset: number) {
  return Array.from({ length: count }, (_, index) => drawSample(shape, size, seedOffset + index * 7919).mean);
}

export function meanOf(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function spreadOf(values: number[]) {
  if (values.length < 2) return 0;
  const center = meanOf(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - center) ** 2, 0) / (values.length - 1));
}
