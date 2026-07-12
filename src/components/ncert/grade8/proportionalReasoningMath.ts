export type LengthUnit = "mm" | "cm" | "m" | "km";
export type RelationshipType = "direct" | "inverse";

export type MathResult<T> = { ok: true; value: T; steps: string[] } | { ok: false; error: string; steps: string[] };

const lengthToMeters: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
};

export function gcd(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("gcd requires finite numbers.");
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function validateRatioInputs(parts: number[]): MathResult<number[]> {
  if (parts.length < 2) return { ok: false, error: "A ratio needs at least two parts.", steps: [] };
  if (parts.length > 5) return { ok: false, error: "This Grade 8 lab supports up to five ratio parts.", steps: [] };
  if (parts.some((part) => !Number.isFinite(part))) return { ok: false, error: "Every ratio part must be a finite number.", steps: [] };
  if (parts.some((part) => part <= 0)) return { ok: false, error: "Ratio parts must be positive.", steps: [] };
  return { ok: true, value: parts, steps: [`Ratio parts accepted: ${parts.join(":")}.`] };
}

export function simplifyRatio(parts: number[]) {
  const valid = validateRatioInputs(parts);
  if (!valid.ok) throw new Error(valid.error);
  const integers = parts.map((part) => Math.round(part * 1000000));
  const divisor = integers.reduce((acc, part) => gcd(acc, part));
  return integers.map((part) => part / divisor);
}

export function scaleRatio(parts: number[], factor: number) {
  const valid = validateRatioInputs(parts);
  if (!valid.ok) throw new Error(valid.error);
  if (!Number.isFinite(factor) || factor <= 0) throw new Error("Scale factor must be positive.");
  return parts.map((part) => part * factor);
}

export function areRatiosEquivalent(leftParts: number[], rightParts: number[]) {
  if (leftParts.length !== rightParts.length) return false;
  return simplifyRatio(leftParts).join(":") === simplifyRatio(rightParts).join(":");
}

export function solveCrossMultiplication(a: number, b: number, c: number) {
  if (a === 0 || b === 0) throw new Error("Known numerator and denominator must be non-zero.");
  return {
    left: a,
    right: b * c,
    missing: (b * c) / a,
    steps: [`Use a/b = c/d -> a x d = b x c.`, `${a} x d = ${b} x ${c}`, `d = ${(b * c) / a}`],
  };
}

export function getMissingProportionValue({
  a,
  b,
  c,
  d,
  position,
}: {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  position: "a" | "b" | "c" | "d";
}) {
  const requireValue = (value: number | undefined, label: string) => {
    if (!Number.isFinite(value)) throw new Error(`Known value ${label} is required.`);
    return value as number;
  };
  if (position === "a") return (requireValue(b, "b") * requireValue(c, "c")) / requireValue(d, "d");
  if (position === "b") return (requireValue(a, "a") * requireValue(d, "d")) / requireValue(c, "c");
  if (position === "c") return (requireValue(a, "a") * requireValue(d, "d")) / requireValue(b, "b");
  return (requireValue(b, "b") * requireValue(c, "c")) / requireValue(a, "a");
}

export function getDirectProportionValue({ x1, y1, x2 }: { x1: number; y1: number; x2: number }) {
  if (x1 === 0) throw new Error("x1 cannot be zero for direct proportion.");
  const k = y1 / x1;
  return { y2: k * x2, constant: k, steps: [`k = y1/x1 = ${y1}/${x1} = ${k}`, `y2 = k x x2 = ${k} x ${x2} = ${k * x2}`] };
}

export function getInverseProportionValue({ x1, y1, x2 }: { x1: number; y1: number; x2: number }) {
  if (x2 === 0) throw new Error("x2 cannot be zero for inverse proportion.");
  const k = x1 * y1;
  return { y2: k / x2, constant: k, steps: [`k = x1 x y1 = ${x1} x ${y1} = ${k}`, `y2 = k/x2 = ${k}/${x2} = ${k / x2}`] };
}

export function convertLength(value: number, fromUnit: LengthUnit, toUnit: LengthUnit) {
  if (!Number.isFinite(value)) throw new Error("Length must be finite.");
  return (value * lengthToMeters[fromUnit]) / lengthToMeters[toUnit];
}

export function getRepresentativeFraction({ mapDistance, actualDistance, mapUnit, actualUnit }: { mapDistance: number; actualDistance: number; mapUnit: LengthUnit; actualUnit: LengthUnit }) {
  if (mapDistance <= 0 || actualDistance <= 0) throw new Error("Map and actual distances must be positive.");
  const actualInMapUnit = convertLength(actualDistance, actualUnit, mapUnit);
  const denominator = actualInMapUnit / mapDistance;
  return {
    denominator,
    text: `1:${round(denominator, 4)}`,
    steps: [`Convert actual distance: ${actualDistance} ${actualUnit} = ${round(actualInMapUnit, 6)} ${mapUnit}.`, `RF = map/actual = ${mapDistance}/${round(actualInMapUnit, 6)} = 1:${round(denominator, 4)}.`],
  };
}

export function getActualDistanceFromMapScale({ mapDistance, scaleDenominator, mapUnit, outputUnit }: { mapDistance: number; scaleDenominator: number; mapUnit: LengthUnit; outputUnit: LengthUnit }) {
  if (mapDistance <= 0 || scaleDenominator <= 0) throw new Error("Map distance and scale denominator must be positive.");
  const actualInMapUnit = mapDistance * scaleDenominator;
  const actual = convertLength(actualInMapUnit, mapUnit, outputUnit);
  return { actual, steps: [`Actual distance = ${mapDistance} x ${scaleDenominator} = ${actualInMapUnit} ${mapUnit}.`, `Convert ${actualInMapUnit} ${mapUnit} = ${round(actual, 6)} ${outputUnit}.`] };
}

export function getMapDistanceFromActualScale({ actualDistance, scaleDenominator, actualUnit, outputUnit }: { actualDistance: number; scaleDenominator: number; actualUnit: LengthUnit; outputUnit: LengthUnit }) {
  if (actualDistance <= 0 || scaleDenominator <= 0) throw new Error("Actual distance and scale denominator must be positive.");
  const actualInOutputUnit = convertLength(actualDistance, actualUnit, outputUnit);
  const map = actualInOutputUnit / scaleDenominator;
  return { map, steps: [`Convert actual distance: ${actualDistance} ${actualUnit} = ${round(actualInOutputUnit, 6)} ${outputUnit}.`, `Map distance = ${round(actualInOutputUnit, 6)} / ${scaleDenominator} = ${round(map, 6)} ${outputUnit}.`] };
}

export function divideWholeInRatio(total: number, ratioParts: number[]) {
  if (!Number.isFinite(total) || total < 0) throw new Error("Total must be a non-negative finite number.");
  const valid = validateRatioInputs(ratioParts);
  if (!valid.ok) throw new Error(valid.error);
  const sum = ratioParts.reduce((acc, part) => acc + part, 0);
  return ratioParts.map((part) => (total * part) / sum);
}

export function getRatioShare(total: number, ratioParts: number[], index: number) {
  return divideWholeInRatio(total, ratioParts)[index] ?? 0;
}

export function getPieAnglesFromRatio(ratioParts: number[]) {
  const valid = validateRatioInputs(ratioParts);
  if (!valid.ok) throw new Error(valid.error);
  const sum = ratioParts.reduce((acc, part) => acc + part, 0);
  const raw = ratioParts.map((part) => (part / sum) * 360);
  const rounded = raw.map((value) => round(value, 2));
  const diff = round(360 - rounded.reduce((acc, value) => acc + value, 0), 2);
  rounded[rounded.length - 1] = round(rounded[rounded.length - 1] + diff, 2);
  return rounded;
}

export function getPiePercentagesFromRatio(ratioParts: number[]) {
  const valid = validateRatioInputs(ratioParts);
  if (!valid.ok) throw new Error(valid.error);
  const sum = ratioParts.reduce((acc, part) => acc + part, 0);
  const raw = ratioParts.map((part) => (part / sum) * 100);
  const rounded = raw.map((value) => round(value, 2));
  const diff = round(100 - rounded.reduce((acc, value) => acc + value, 0), 2);
  rounded[rounded.length - 1] = round(rounded[rounded.length - 1] + diff, 2);
  return rounded;
}

export function getConstantOfProportionality(points: Array<{ x: number; y: number }>) {
  if (!points.length) throw new Error("At least one point is required.");
  const ratios = points.map(({ x, y }) => {
    if (x === 0) throw new Error("x cannot be zero for constant ratio.");
    return y / x;
  });
  return ratios.every((ratio) => Math.abs(ratio - ratios[0]) < 1e-9) ? ratios[0] : null;
}

export function generateProportionTable({ relationshipType, constant, xValues }: { relationshipType: RelationshipType; constant: number; xValues: number[] }) {
  if (!Number.isFinite(constant)) throw new Error("Constant must be finite.");
  return xValues.map((x) => {
    if (relationshipType === "inverse" && x === 0) throw new Error("x cannot be zero in an inverse proportion table.");
    return { x, y: relationshipType === "direct" ? constant * x : constant / x };
  });
}

export function round(value: number, digits = 4) {
  const scale = 10 ** digits;
  return Math.round((value + Number.EPSILON) * scale) / scale;
}
