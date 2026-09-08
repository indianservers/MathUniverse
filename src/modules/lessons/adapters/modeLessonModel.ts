export const modeDefault = [2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 7];
export function frequencies(values: number[]) { return values.reduce<Record<number, number>>((result, value) => { result[value] = (result[value] ?? 0) + 1; return result; }, {}); }
export function modes(values: number[]) { const counts = frequencies(values); const highest = Math.max(0, ...Object.values(counts)); return Object.keys(counts).map(Number).filter(value => counts[value] === highest).sort((a, b) => a - b); }
export function isModeAnswer(values: number[], answer: string) { return answer.split(",").map(part => Number(part.trim())).filter(Number.isFinite).join(",") === modes(values).join(","); }
