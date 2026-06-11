export type TracePoint = { x: number; y: number };

export const DEFAULT_TRACE_MAX_SAMPLES = 240;
export const DEFAULT_TRACE_MIN_DISTANCE = 2;

export function appendTraceSample(
  samples: TracePoint[],
  sample: TracePoint,
  options: { minDistance?: number; maxSamples?: number } = {},
): TracePoint[] {
  const minDistance = options.minDistance ?? DEFAULT_TRACE_MIN_DISTANCE;
  const maxSamples = Math.max(2, options.maxSamples ?? DEFAULT_TRACE_MAX_SAMPLES);
  const last = samples[samples.length - 1];
  if (last && distanceBetweenTracePoints(last, sample) < minDistance) return samples;
  return [...samples, { x: roundTraceCoordinate(sample.x), y: roundTraceCoordinate(sample.y) }].slice(-maxSamples);
}

export function seedTraceSamples(sample: TracePoint, maxSamples = DEFAULT_TRACE_MAX_SAMPLES): TracePoint[] {
  return appendTraceSample([], sample, { maxSamples, minDistance: 0 });
}

export function nextTraceLabel(existingCount: number, pointLabel?: string) {
  const base = pointLabel ? `trace(${pointLabel})` : "trace";
  return existingCount ? `${base} ${existingCount + 1}` : base;
}

export function traceDefinition(sampleCount: number, pointLabel?: string) {
  return pointLabel ? `Trace(${pointLabel}, ${sampleCount} samples)` : `Trace(${sampleCount} samples)`;
}

function distanceBetweenTracePoints(a: TracePoint, b: TracePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function roundTraceCoordinate(value: number) {
  return Math.round(value * 100) / 100;
}
