export type Cubic54 = {
  id: string;
  label: string;
  a: number;
  b: number;
  c: number;
};

export type Point54 = { x: number; y: number };
export type Bounds54 = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const CUBICS_54: Cubic54[] = [
  { id: "c1", label: "f(x) = x³ - 3x", a: 1, b: -3, c: 0 },
  { id: "c2", label: "f(x) = 0.5x³ - 2x", a: 0.5, b: -2, c: 0 },
  { id: "c3", label: "f(x) = x³ - 3x + 1", a: 1, b: -3, c: 1 },
];

export const INSPECT_BOUNDS_54: Bounds54 = {
  xMin: -3.2,
  xMax: 3.2,
  yMin: -6,
  yMax: 6,
};
export const FIT_BOUNDS_54: Bounds54 = {
  xMin: -2.4,
  xMax: 2.4,
  yMin: -3.5,
  yMax: 3.5,
};

export function cubicValue54(cubic: Cubic54, x: number) {
  return cubic.a * x ** 3 + cubic.b * x + cubic.c;
}

export function cubicDerivative54(cubic: Cubic54, x: number) {
  return 3 * cubic.a * x * x + cubic.b;
}

export function cubicSecondDerivative54(cubic: Cubic54, x: number) {
  return 6 * cubic.a * x;
}

export function criticalPoints54(cubic: Cubic54): Point54[] {
  const square = -cubic.b / (3 * cubic.a);
  if (square <= 0) return [];
  const x = Math.sqrt(square);
  return [-x, x].map((value) => ({ x: value, y: cubicValue54(cubic, value) }));
}

export function roots54(cubic: Cubic54): Point54[] {
  const roots: number[] = [];
  const step = 0.025;
  let left = -8;
  let leftValue = cubicValue54(cubic, left);
  for (let right = left + step; right <= 8; right += step) {
    const rightValue = cubicValue54(cubic, right);
    if (Math.abs(leftValue) < 1e-7) roots.push(left);
    if (leftValue * rightValue < 0) {
      let low = left;
      let high = right;
      for (let index = 0; index < 40; index += 1) {
        const middle = (low + high) / 2;
        if (cubicValue54(cubic, low) * cubicValue54(cubic, middle) <= 0)
          high = middle;
        else low = middle;
      }
      roots.push((low + high) / 2);
    }
    left = right;
    leftValue = rightValue;
  }
  return roots
    .filter(
      (value, index) =>
        index === 0 || Math.abs(value - roots[index - 1]) > 0.01,
    )
    .map((x) => ({ x, y: 0 }));
}

export function averageRate54(cubic: Cubic54, from = -1, to = 1) {
  return (cubicValue54(cubic, to) - cubicValue54(cubic, from)) / (to - from);
}

export function graphPoint54(
  point: Point54,
  bounds: Bounds54,
  width: number,
  height: number,
) {
  return {
    x: ((point.x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - point.y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function graphPath54(
  cubic: Cubic54,
  bounds: Bounds54,
  width: number,
  height: number,
) {
  const points: string[] = [];
  for (let pixel = 0; pixel <= width; pixel += 3) {
    const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
    const point = graphPoint54(
      { x, y: cubicValue54(cubic, x) },
      bounds,
      width,
      height,
    );
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }
  return points.join(" ");
}

export function xFromPixel54(pixel: number, bounds: Bounds54, width: number) {
  const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
  return Math.max(bounds.xMin, Math.min(bounds.xMax, Math.round(x * 20) / 20));
}

export function formatNumber54(value: number) {
  if (Math.abs(value) < 0.0005) return "0";
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(3).replace(/0+$/, "");
}
