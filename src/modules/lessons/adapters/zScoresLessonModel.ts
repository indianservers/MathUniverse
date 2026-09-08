import { normalCdf } from "../../../phase4/statistics";
export function zScore(x: number, mean: number, sd: number) { return sd > 0 ? (x - mean) / sd : null; }
export function percentileFromZ(z: number) { return normalCdf(z) * 100; }
export function zAnswer(x: number, mean: number, sd: number, answer: string) { const value = zScore(x, mean, sd); return value !== null && Math.abs(Number(answer) - value) < .01; }
