export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function interpolate(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function formatCoefficient(value: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export function formatTerm(coefficient: number, variable: string) {
  if (coefficient === 0) return "";
  if (coefficient === 1) return variable;
  return `${formatCoefficient(coefficient)}${variable}`;
}

export function expandSquareOfSum(a: number, b: number) {
  return { whole: (a + b) ** 2, a2: a ** 2, twoab: 2 * a * b, b2: b ** 2 };
}

export function expandSquareOfDifference(a: number, b: number) {
  return { whole: (a - b) ** 2, a2: a ** 2, minusTwoab: -2 * a * b, b2: b ** 2 };
}

export function differenceOfSquares(a: number, b: number) {
  return { difference: a ** 2 - b ** 2, factored: (a - b) * (a + b) };
}

export function productOfBinomials(x: number, a: number, b: number) {
  return { x2: x ** 2, ax: a * x, bx: b * x, ab: a * b, middle: (a + b) * x, total: (x + a) * (x + b) };
}

export function distributiveAreaTerms(a: number, b: number, c: number, d: number) {
  return { ac: a * c, ad: a * d, bc: b * c, bd: b * d, total: (a + b) * (c + d) };
}

export function threeTermSquareTerms(a: number, b: number, c: number) {
  return {
    a2: a ** 2,
    b2: b ** 2,
    c2: c ** 2,
    twoab: 2 * a * b,
    twobc: 2 * b * c,
    twoca: 2 * c * a,
    total: (a + b + c) ** 2,
  };
}

export function getAreaModelRects(widthParts: number[], heightParts: number[], x: number, y: number, width: number, height: number) {
  const widthTotal = widthParts.reduce((sum, part) => sum + part, 0);
  const heightTotal = heightParts.reduce((sum, part) => sum + part, 0);
  let currentY = y;
  return heightParts.flatMap((heightPart, row) => {
    const rectHeight = (heightPart / heightTotal) * height;
    let currentX = x;
    const rowRects = widthParts.map((widthPart, column) => {
      const rectWidth = (widthPart / widthTotal) * width;
      const rect = { x: currentX, y: currentY, width: rectWidth, height: rectHeight, row, column };
      currentX += rectWidth;
      return rect;
    });
    currentY += rectHeight;
    return rowRects;
  });
}
