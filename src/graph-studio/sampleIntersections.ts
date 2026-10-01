import type { GraphSample } from "../utils/mathEngine/graphSampler";

type Segment = { a: { x: number; y: number }; b: { x: number; y: number } };

function segments(points: GraphSample[]): Segment[] {
  const result: Segment[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (!a.valid || !b.valid || a.y === null || b.y === null) continue;
    if (!Number.isFinite(a.x) || !Number.isFinite(b.x) || !Number.isFinite(a.y) || !Number.isFinite(b.y)) continue;
    result.push({ a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } });
  }
  return result;
}

function crossing(left: Segment, right: Segment): { x: number; y: number } | null {
  const rx = left.b.x - left.a.x;
  const ry = left.b.y - left.a.y;
  const sx = right.b.x - right.a.x;
  const sy = right.b.y - right.a.y;
  const denominator = rx * sy - ry * sx;
  if (Math.abs(denominator) < 1e-12) return null;
  const qx = right.a.x - left.a.x;
  const qy = right.a.y - left.a.y;
  const t = (qx * sy - qy * sx) / denominator;
  const u = (qx * ry - qy * rx) / denominator;
  if (t < -1e-9 || t > 1 + 1e-9 || u < -1e-9 || u > 1 + 1e-9) return null;
  return { x: left.a.x + t * rx, y: left.a.y + t * ry };
}

export function sampledGraphIntersections(series: Array<{ id: string; points: GraphSample[] }>, limit = 12) {
  const points: Array<{ x: number; y: number }> = [];
  for (let leftIndex = 0; leftIndex < series.length; leftIndex += 1) {
    const left = segments(series[leftIndex].points);
    for (let rightIndex = leftIndex + 1; rightIndex < series.length; rightIndex += 1) {
      const right = segments(series[rightIndex].points);
      if (!left.length || !right.length) continue;
      let minX = Infinity;
      let maxX = -Infinity;
      for (const segment of [...left, ...right]) {
        minX = Math.min(minX, segment.a.x, segment.b.x);
        maxX = Math.max(maxX, segment.a.x, segment.b.x);
      }
      const bucketWidth = Math.max(1e-9, (maxX - minX) / 256);
      const bucket = (x: number) => Math.max(0, Math.min(255, Math.floor((x - minX) / bucketWidth)));
      const rightBuckets = new Map<number, Segment[]>();
      for (const segment of right) {
        const from = bucket(Math.min(segment.a.x, segment.b.x));
        const to = bucket(Math.max(segment.a.x, segment.b.x));
        for (let index = from; index <= to; index += 1) {
          const values = rightBuckets.get(index) ?? [];
          values.push(segment);
          rightBuckets.set(index, values);
        }
      }
      for (const segment of left) {
        const candidates = new Set<Segment>();
        const from = bucket(Math.min(segment.a.x, segment.b.x));
        const to = bucket(Math.max(segment.a.x, segment.b.x));
        for (let index = from; index <= to; index += 1) {
          for (const candidate of rightBuckets.get(index) ?? []) candidates.add(candidate);
        }
        for (const candidate of candidates) {
          if (Math.max(segment.a.y, segment.b.y) < Math.min(candidate.a.y, candidate.b.y) ||
              Math.max(candidate.a.y, candidate.b.y) < Math.min(segment.a.y, segment.b.y)) continue;
          const point = crossing(segment, candidate);
          if (!point) continue;
          if (points.some((existing) => Math.hypot(existing.x - point.x, existing.y - point.y) < 1e-3)) continue;
          points.push(point);
          if (points.length >= limit) return points.sort((a, b) => a.x - b.x || a.y - b.y);
        }
      }
    }
  }
  return points.sort((a, b) => a.x - b.x || a.y - b.y);
}
