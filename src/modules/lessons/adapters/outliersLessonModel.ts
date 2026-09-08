import { quartiles } from "./quartilesLessonModel";
export const outliersDefault = [-3, 0, 1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 14, 15];
export function flaggedOutliers(values: number[]) { const summary = quartiles(values); if (!summary) return []; return values.filter(value => value < summary.lowerFence || value > summary.upperFence).sort((a, b) => a - b); }
export function fences(values: number[]) { const summary = quartiles(values); return summary ? { lower: summary.lowerFence, upper: summary.upperFence } : null; }
export function outlierAnswer(values: number[], answer: string) { return answer.split(",").map(value => Number(value.trim())).filter(Number.isFinite).sort((a, b) => a - b).join(",") === flaggedOutliers(values).join(","); }
