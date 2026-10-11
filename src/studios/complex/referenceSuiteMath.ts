import { mulC, fromPolar, wrapDeg, type C } from "./complexLabMath";

export function polarValues(z: C, branch: number) {
  const radius = Math.hypot(z.re, z.im);
  return {
    radius,
    angle:
      radius < 1e-12
        ? null
        : wrapDeg((Math.atan2(z.im, z.re) * 180) / Math.PI, branch),
  };
}
export function multiplicationSequence(
  z: C,
  magnitude: number,
  angle: number,
  count = 4,
) {
  const w = fromPolar(magnitude, angle);
  const values = [z];
  for (let i = 1; i < count; i++) values.push(mulC(values[i - 1], w));
  return values;
}
export function sameDirectionDegrees(answer: number, expected: number) {
  return Number.isFinite(answer) && Math.abs(wrapDeg(answer - expected)) < 0.1;
}
export function phaseTex(degrees: number) {
  const ratios: [
    [number, string],
    [number, string],
    [number, string],
    [number, string],
    [number, string],
    [number, string],
    [number, string],
  ] = [
    [0, "0"],
    [30, "\\frac{\\pi}{6}"],
    [45, "\\frac{\\pi}{4}"],
    [60, "\\frac{\\pi}{3}"],
    [90, "\\frac{\\pi}{2}"],
    [120, "\\frac{2\\pi}{3}"],
    [180, "\\pi"],
  ];
  const exact = ratios.find(([d]) => Math.abs(Math.abs(degrees) - d) < 1e-8);
  return `${degrees < 0 ? "-" : ""}${exact ? exact[1] : Number(((Math.abs(degrees) * Math.PI) / 180).toFixed(4))}`;
}
