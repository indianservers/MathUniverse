export function escapeTime(x0: number, y0: number, cx: number, cy: number, max: number) {
  let zx = x0;
  let zy = y0;
  let k = 0;
  while (zx * zx + zy * zy < 4 && k < max) {
    const nx = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = nx;
    k += 1;
  }
  return k;
}

export function orbit(zx0: number, zy0: number, cx: number, cy: number, steps: number) {
  const pts: Array<{ x: number; y: number }> = [];
  let zx = zx0;
  let zy = zy0;
  for (let i = 0; i < steps; i += 1) {
    pts.push({ x: zx, y: zy });
    const nx = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = nx;
    if (zx * zx + zy * zy > 16) break;
  }
  return pts;
}

export function inMainCardioid(cx: number, cy: number) {
  const q = (cx - 0.25) ** 2 + cy * cy;
  return q * (q + (cx - 0.25)) < 0.25 * cy * cy;
}

export function inPeriod2Bulb(cx: number, cy: number) {
  return (cx + 1) ** 2 + cy * cy < 0.25 * 0.25;
}

export function periodBulbLabel(cx: number, cy: number) {
  if (inMainCardioid(cx, cy)) return "period-1 cardioid";
  if (inPeriod2Bulb(cx, cy)) return "period-2 bulb";
  return "other / hyperbolic";
}

export function juliaConnected(cx: number, cy: number) {
  return inMainCardioid(cx, cy) || inPeriod2Bulb(cx, cy);
}
