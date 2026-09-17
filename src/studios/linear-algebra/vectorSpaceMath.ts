export function spanDimension(count: number, independent: boolean) {
  if (count <= 0) return 0;
  if (!independent) return Math.min(count - 1, 2);
  return Math.min(count, 2);
}

export function areIndependent(ax: number, ay: number, bx: number, by: number) {
  return Math.abs(ax * by - ay * bx) > 1e-6;
}

export function coordinates(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const det = ax * by - ay * bx;
  if (Math.abs(det) < 1e-8) return null;
  return { s: (px * by - py * bx) / det, t: (ax * py - ay * px) / det };
}

export function gramSchmidt(ax: number, ay: number, bx: number, by: number) {
  const magA = Math.hypot(ax, ay) || 1e-9;
  const u1x = ax / magA;
  const u1y = ay / magA;
  const proj = bx * u1x + by * u1y;
  const v2x = bx - proj * u1x;
  const v2y = by - proj * u1y;
  const mag2 = Math.hypot(v2x, v2y);
  const u2x = mag2 < 1e-8 ? -u1y : v2x / mag2;
  const u2y = mag2 < 1e-8 ? u1x : v2y / mag2;
  return {
    u1: [u1x, u1y] as const,
    u2: [u2x, u2y] as const,
    residual: [v2x, v2y] as const,
    orthogonal: mag2 > 1e-6,
  };
}
