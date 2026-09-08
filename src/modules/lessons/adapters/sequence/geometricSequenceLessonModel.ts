export type GeometricBehavior = "Growth" | "Constant" | "Decay";
export type GeometricSolver = "n" | "first" | "ratio";
const clean = (value: number) => Number(value.toFixed(6));
export function geometricSequenceAnalysis(
  firstValue: number,
  ratioValue: number,
  countValue = 10,
) {
  const first = Number.isFinite(firstValue) ? firstValue : 0,
    ratio = Number.isFinite(ratioValue) ? ratioValue : 0,
    count = Math.max(1, Math.min(100, Math.round(countValue))),
    term = (nValue: number) =>
      first * ratio ** (Math.max(1, Math.round(nValue)) - 1),
    terms = Array.from({ length: count }, (_, index) => term(index + 1)),
    magnitude = Math.abs(ratio),
    behavior: GeometricBehavior =
      magnitude > 1 ? "Growth" : magnitude === 1 ? "Constant" : "Decay",
    sign =
      ratio < 0
        ? "Alternating"
        : terms.every((value) => value >= 0)
          ? "All positive"
          : "All negative",
    minimum = Math.min(...terms),
    maximum = Math.max(...terms),
    padding = Math.max(1, (maximum - minimum) * 0.08),
    linearMin = minimum >= 0 ? 0 : minimum - padding,
    linearMax = maximum <= 0 ? 0 : maximum + padding;
  return {
    first,
    ratio,
    count,
    terms,
    term,
    behavior,
    sign,
    linearMin,
    linearMax,
    firstIndexBeyond(thresholdValue: number, maxIndex = 1000) {
      const threshold = Math.abs(thresholdValue);
      for (let n = 1; n <= maxIndex; n += 1)
        if (Math.abs(term(n)) > threshold) return n;
      return null;
    },
  };
}
export function solveGeometricUnknown(
  mode: GeometricSolver,
  givenValue: number,
  indexValue: number,
  firstValue: number,
  ratioValue: number,
) {
  const given = Number(givenValue),
    n = Math.max(1, Math.round(indexValue)),
    first = Number(firstValue),
    ratio = Number(ratioValue);
  if (![given, n, first, ratio].every(Number.isFinite))
    return "Enter valid values.";
  if (mode === "first") return `a₁ = ${clean(given / ratio ** (n - 1))}`;
  if (mode === "ratio") {
    if (n === 1) return "r is not determined by a₁ alone";
    const base = given / first,
      power = n - 1;
    if (first === 0)
      return given === 0 ? "r is not determined" : "No real ratio";
    if (base < 0 && power % 2 === 0) return "No real ratio";
    return `r = ${clean(Math.sign(base) * Math.abs(base) ** (1 / power))}`;
  }
  if (
    first === 0 ||
    ratio === 0 ||
    ratio === 1 ||
    ratio < 0 ||
    given / first <= 0
  )
    return given === first ? "n = 1" : "No real index";
  const result = 1 + Math.log(given / first) / Math.log(ratio);
  return Math.abs(result - Math.round(result)) < 1e-8
    ? `n = ${Math.round(result)}`
    : `n ≈ ${clean(result)}`;
}
