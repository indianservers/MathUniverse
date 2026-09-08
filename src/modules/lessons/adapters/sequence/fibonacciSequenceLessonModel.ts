export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
export type FibonacciSquare = {
  index: number;
  x: number;
  y: number;
  size: number;
  arc: string;
};
export function fibonacciSequenceAnalysis(
  firstValue: number,
  secondValue: number,
  countValue = 12,
) {
  const first = Math.max(1, Math.round(firstValue)),
    second = Math.max(1, Math.round(secondValue)),
    count = Math.max(2, Math.min(100, Math.round(countValue))),
    terms = [first, second];
  for (let index = 2; index < count; index += 1)
    terms.push(terms[index - 1] + terms[index - 2]);
  const ratios = terms.map((value, index) =>
      index ? value / terms[index - 1] : Number.NaN,
    ),
    phiErrors = ratios.map((value) => Math.abs(value - GOLDEN_RATIO));
  return {
    first,
    second,
    count,
    terms,
    ratios,
    phiErrors,
    term(nValue: number) {
      return terms[Math.max(1, Math.round(nValue)) - 1] ?? null;
    },
  };
}
export function standardBinet(nValue: number) {
  const n = Math.max(1, Math.round(nValue)),
    psi = 1 - GOLDEN_RATIO;
  return Math.round((GOLDEN_RATIO ** n - psi ** n) / Math.sqrt(5));
}
export function fibonacciSpiralSquares(terms: number[]): FibonacciSquare[] {
  if (terms.length < 8) return [];
  const scale = 238 / Math.max(1, terms[7]),
    x0 = 4,
    y0 = 4,
    s = (index: number) => Math.max(2, terms[index] * scale),
    raw = [
      { index: 7, x: x0, y: y0, size: s(7), orientation: 0 },
      { index: 6, x: x0 + s(7), y: y0, size: s(6), orientation: 1 },
      {
        index: 5,
        x: x0 + s(7) + s(6) - s(5),
        y: y0 + s(6),
        size: s(5),
        orientation: 2,
      },
      {
        index: 4,
        x: x0 + s(7),
        y: y0 + s(6) + s(5) - s(4),
        size: s(4),
        orientation: 3,
      },
      { index: 3, x: x0 + s(7), y: y0 + s(6), size: s(3), orientation: 0 },
      {
        index: 2,
        x: x0 + s(7) + s(3),
        y: y0 + s(6),
        size: s(2),
        orientation: 1,
      },
      {
        index: 1,
        x: x0 + s(7) + s(3),
        y: y0 + s(6) + s(2),
        size: s(1),
        orientation: 2,
      },
    ];
  return raw.map((item) => {
    const { x, y, size, orientation, index } = item,
      endpoints =
        orientation === 0
          ? [x, y + size, x + size, y]
          : orientation === 1
            ? [x, y, x + size, y + size]
            : orientation === 2
              ? [x + size, y, x, y + size]
              : [x + size, y + size, x, y],
      arc = `M${endpoints[0]} ${endpoints[1]} A${size} ${size} 0 0 1 ${endpoints[2]} ${endpoints[3]}`;
    return { index, x, y, size, arc };
  });
}
