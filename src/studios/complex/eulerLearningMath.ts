import { taylorExpITheta, type C } from "./complexLabMath";

export type EulerCamera = { position: [number, number, number]; target: [number, number, number] };
export const DEFAULT_EULER_CAMERA: EulerCamera = { position: [4, 4.2, 6], target: [0, 2, 0] };

export const EULER_ANGLE_LIMIT = 720;
export const eulerPoint = (degrees: number): C => ({ re: Math.cos(degrees * Math.PI / 180), im: Math.sin(degrees * Math.PI / 180) });
export function boundedEulerValue(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
export function radiansLabel(degrees: number) {
  if (degrees === 0) return "0 rad";
  if (degrees % 90 === 0) {
    const halves = degrees / 90;
    return `${halves % 2 === 0 ? (halves / 2 === 1 ? "" : halves / 2) : (halves === 1 ? "" : halves)}π${halves % 2 ? "/2" : ""} rad`;
  }
  return `${(degrees * Math.PI / 180).toFixed(3)} rad`;
}
export function taylorPartialSums(theta: number, terms: number) {
  return Array.from({ length: terms }, (_, index) => taylorExpITheta(theta, index + 1));
}
export function eulerError(degrees: number, terms: number) {
  const exact = eulerPoint(degrees), approx = taylorExpITheta(degrees * Math.PI / 180, terms);
  return Math.hypot(exact.re - approx.re, exact.im - approx.im);
}
export function evaluateEulerIdentity(answer: string) {
  if (!answer.trim()) return { correct: false, message: "Enter an answer before checking." };
  const value = Number(answer);
  if (!Number.isFinite(value)) return { correct: false, message: "Enter a finite number. Hint: cos π = −1 and sin π = 0." };
  return value === 0
    ? { correct: true, message: "Correct: eⁱπ = −1, so eⁱπ + 1 = 0." }
    : { correct: false, message: "Try again: substitute cos π = −1 and sin π = 0 into Euler’s formula, then add 1." };
}
