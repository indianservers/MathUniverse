export type TrigFamily = "Sine" | "Cosine" | "Tangent";
export type InverseFamily = "Arcsin" | "Arccos" | "Arctan";

const toRadians = (degrees: number) => degrees * Math.PI / 180;
const toDegrees = (radians: number) => radians * 180 / Math.PI;

export function transformedTrig(
  family: TrigFamily,
  x: number,
  amplitude: number,
  frequency: number,
  phaseShift: number,
  verticalShift: number,
) {
  const argument = frequency * (x - phaseShift);
  const parent = family === "Cosine"
    ? Math.cos(argument)
    : family === "Tangent"
      ? Math.tan(argument)
      : Math.sin(argument);
  return amplitude * parent + verticalShift;
}

export function inversePrincipal(family: InverseFamily, input: number) {
  if (family === "Arctan") return Math.atan(input);
  const bounded = Math.min(1, Math.max(-1, input));
  return family === "Arccos" ? Math.acos(bounded) : Math.asin(bounded);
}

export type ObliqueSolution = {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  area: number;
  semiperimeter: number;
  circumradius: number;
  valid: boolean;
};

export function solveObliqueSas(a: number, b: number, angleCDegrees: number): ObliqueSolution {
  const safeA = Math.max(0, a);
  const safeB = Math.max(0, b);
  const C = Math.min(179.999, Math.max(0.001, angleCDegrees));
  const cSquared = safeA ** 2 + safeB ** 2 - 2 * safeA * safeB * Math.cos(toRadians(C));
  const c = Math.sqrt(Math.max(0, cSquared));
  const valid = safeA > 0 && safeB > 0 && c > 0
    && safeA + safeB > c
    && safeA + c > safeB
    && safeB + c > safeA;
  const denominator = 2 * safeB * c;
  const cosineA = denominator > 0
    ? Math.min(1, Math.max(-1, (safeB ** 2 + c ** 2 - safeA ** 2) / denominator))
    : 1;
  const A = toDegrees(Math.acos(cosineA));
  const B = 180 - A - C;
  const area = 0.5 * safeA * safeB * Math.sin(toRadians(C));
  const semiperimeter = (safeA + safeB + c) / 2;
  const circumradius = area > 0 ? safeA * safeB * c / (4 * area) : 0;
  return { a: safeA, b: safeB, c, A, B, C, area, semiperimeter, circumradius, valid };
}

export function composeWaves(
  time: number,
  wave1: { amplitude: number; frequency: number; phase: number; shift: number },
  wave2: { amplitude: number; frequency: number; phase: number; shift: number },
) {
  const y1 = wave1.amplitude * Math.sin(2 * Math.PI * wave1.frequency * time + wave1.phase) + wave1.shift;
  const y2 = wave2.amplitude * Math.sin(2 * Math.PI * wave2.frequency * time + wave2.phase) + wave2.shift;
  return {
    y1,
    y2,
    resultant: y1 + y2,
    beatFrequency: Math.abs(wave2.frequency - wave1.frequency),
  };
}
