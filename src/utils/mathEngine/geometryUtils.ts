export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function midpoint(x1: number, y1: number, x2: number, y2: number) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

export function slope(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1e-12) return Infinity;
  return (y2 - y1) / dx;
}
