export type LinearSystemVerdict = "unique" | "none" | "infinite";

export type GroupedClass = {
  lower: number;
  upper: number;
  frequency: number;
};

export function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function safeNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function tangentLength(pointDistance: number, radius: number) {
  if (pointDistance <= radius) return 0;
  return Math.sqrt(pointDistance ** 2 - radius ** 2);
}

export function tangentCase(pointDistance: number, radius: number) {
  if (pointDistance < radius) return "inside: no tangent";
  if (pointDistance === radius) return "on circle: one tangent";
  return "outside: two equal tangents";
}

export function bptRatios(cutAB: number, cutAC: number) {
  const clampedAB = Math.min(0.95, Math.max(0.05, cutAB));
  const clampedAC = Math.min(0.95, Math.max(0.05, cutAC));
  const ratioAB = clampedAB / (1 - clampedAB);
  const ratioAC = clampedAC / (1 - clampedAC);
  return {
    ratioAB,
    ratioAC,
    parallel: Math.abs(ratioAB - ratioAC) < 0.03,
  };
}

export function similarTriangleAreaRatio(sideRatio: number) {
  return sideRatio ** 2;
}

export function classifyLinearSystem(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): LinearSystemVerdict {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) > 1e-9) return "unique";
  const consistent = Math.abs(a1 * c2 - a2 * c1) < 1e-9 && Math.abs(b1 * c2 - b2 * c1) < 1e-9;
  return consistent ? "infinite" : "none";
}

export function solveLinearSystem(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;
  return {
    x: (c1 * b2 - c2 * b1) / det,
    y: (a1 * c2 - a2 * c1) / det,
  };
}

export function groupedStats(rows: GroupedClass[], assumedMean?: number) {
  const validRows = rows.filter((row) => row.upper > row.lower && row.frequency >= 0);
  const midpoints = validRows.map((row) => (row.lower + row.upper) / 2);
  const totalFrequency = validRows.reduce((sum, row) => sum + row.frequency, 0);
  const fx = validRows.reduce((sum, row, index) => sum + row.frequency * midpoints[index], 0);
  const mean = totalFrequency > 0 ? fx / totalFrequency : 0;
  const classWidth = validRows[0] ? validRows[0].upper - validRows[0].lower : 1;
  const A = assumedMean ?? midpoints[Math.floor(midpoints.length / 2)] ?? 0;
  const fu = validRows.reduce((sum, row, index) => sum + row.frequency * ((midpoints[index] - A) / classWidth), 0);
  const assumedMeanValue = totalFrequency > 0 ? A + classWidth * (fu / totalFrequency) : 0;
  const cumulative = validRows.reduce<number[]>((acc, row) => {
    acc.push((acc.at(-1) ?? 0) + row.frequency);
    return acc;
  }, []);
  const modalIndex = validRows.reduce((best, row, index) => row.frequency > validRows[best].frequency ? index : best, 0);
  const medianIndex = cumulative.findIndex((value) => value >= totalFrequency / 2);
  const modal = modeForGrouped(validRows, modalIndex, classWidth);
  const median = medianForGrouped(validRows, medianIndex < 0 ? 0 : medianIndex, cumulative, totalFrequency, classWidth);
  return { rows: validRows, midpoints, cumulative, totalFrequency, mean, assumedMean: assumedMeanValue, modalIndex, medianIndex, modal, median };
}

function modeForGrouped(rows: GroupedClass[], index: number, h: number) {
  const row = rows[index];
  if (!row) return 0;
  const f1 = row.frequency;
  const f0 = rows[index - 1]?.frequency ?? 0;
  const f2 = rows[index + 1]?.frequency ?? 0;
  const denominator = 2 * f1 - f0 - f2;
  if (denominator === 0) return row.lower;
  return row.lower + ((f1 - f0) / denominator) * h;
}

function medianForGrouped(rows: GroupedClass[], index: number, cumulative: number[], n: number, h: number) {
  const row = rows[index];
  if (!row || row.frequency === 0) return 0;
  const cfBefore = cumulative[index - 1] ?? 0;
  return row.lower + ((n / 2 - cfBefore) / row.frequency) * h;
}

export function sectorArea(radius: number, angleDegrees: number) {
  return Math.PI * radius ** 2 * (angleDegrees / 360);
}

export function triangleAreaFromTwoRadii(radius: number, angleDegrees: number) {
  return 0.5 * radius ** 2 * Math.sin((Math.PI * angleDegrees) / 180);
}

export function segmentArea(radius: number, angleDegrees: number) {
  return sectorArea(radius, angleDegrees) - triangleAreaFromTwoRadii(radius, angleDegrees);
}

export function annulusArea(outerRadius: number, innerRadius: number) {
  return Math.PI * (outerRadius ** 2 - innerRadius ** 2);
}

export function cylinderVolume(radius: number, height: number) {
  return Math.PI * radius ** 2 * height;
}

export function coneVolume(radius: number, height: number) {
  return (Math.PI * radius ** 2 * height) / 3;
}

export function sphereVolume(radius: number) {
  return (4 * Math.PI * radius ** 3) / 3;
}

export function hemisphereCSA(radius: number) {
  return 2 * Math.PI * radius ** 2;
}

export function coneSlantHeight(radius: number, height: number) {
  return Math.sqrt(radius ** 2 + height ** 2);
}

export function frustumSlantHeight(R: number, r: number, h: number) {
  return Math.sqrt((R - r) ** 2 + h ** 2);
}

export function frustumVolume(R: number, r: number, h: number) {
  return (Math.PI * h * (R ** 2 + r ** 2 + R * r)) / 3;
}

export function frustumCSA(R: number, r: number, l: number) {
  return Math.PI * (R + r) * l;
}

export function frustumTSA(R: number, r: number, l: number) {
  return frustumCSA(R, r, l) + Math.PI * (R ** 2 + r ** 2);
}

export function heightFromAngleDistance(angleDegrees: number, distance: number) {
  return distance * Math.tan((Math.PI * angleDegrees) / 180);
}

export function distanceFromHeightAngle(height: number, angleDegrees: number) {
  const tan = Math.tan((Math.PI * angleDegrees) / 180);
  return tan === 0 ? 0 : height / tan;
}
