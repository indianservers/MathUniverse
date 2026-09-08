export type DynamicParameters55 = { a: number; b: number; c: number };
export type DynamicBounds55 = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const DEFAULT_DYNAMIC_55: DynamicParameters55 = { a: 2, b: 1.5, c: 0.5 };
export const DYNAMIC_BOUNDS_55: DynamicBounds55 = {
  xMin: -2.5 * Math.PI,
  xMax: 2.5 * Math.PI,
  yMin: -4,
  yMax: 4.5,
};

export function dynamicValue55(parameters: DynamicParameters55, x: number) {
  return parameters.a * Math.sin(parameters.b * x) + parameters.c;
}

export function dynamicPeriod55(parameters: DynamicParameters55) {
  return (2 * Math.PI) / Math.abs(parameters.b);
}

export function dynamicRange55(parameters: DynamicParameters55) {
  const amplitude = Math.abs(parameters.a);
  return { min: parameters.c - amplitude, max: parameters.c + amplitude };
}

export function dynamicGraphPoint55(
  x: number,
  y: number,
  bounds: DynamicBounds55,
  width: number,
  height: number,
) {
  return {
    x: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function dynamicCurve55(
  parameters: DynamicParameters55,
  bounds: DynamicBounds55,
  width: number,
  height: number,
) {
  const points: string[] = [];
  for (let pixel = 0; pixel <= width; pixel += 3) {
    const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
    const point = dynamicGraphPoint55(
      x,
      dynamicValue55(parameters, x),
      bounds,
      width,
      height,
    );
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }
  return points.join(" ");
}

export function scaledBounds55(scale: number): DynamicBounds55 {
  const factor = Math.max(0.65, Math.min(1.6, scale));
  return {
    xMin: DYNAMIC_BOUNDS_55.xMin * factor,
    xMax: DYNAMIC_BOUNDS_55.xMax * factor,
    yMin: DYNAMIC_BOUNDS_55.yMin * factor,
    yMax: DYNAMIC_BOUNDS_55.yMax * factor,
  };
}

export function animatedParameters55(step: number): DynamicParameters55 {
  const phase = (step % 180) / 180;
  return {
    a: 0.5 + 3.5 * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2)),
    b: 0.5 + 1.5 * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2 + 2.1)),
    c: 1.5 * Math.sin(phase * Math.PI * 2 + 4.2),
  };
}
