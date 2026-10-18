export type RiemannMethod = "left" | "right" | "mid";
export const rectangleCounts = [1, 4, 8, 16, 32, 64];
export function riemannRectangles(practice: boolean, n: number, method: RiemannMethod) {
  if (!Number.isInteger(n) || n < 1 || n > 4096) throw new RangeError("Rectangle count must be an integer from 1 to 4096");
  const dx = 2 / n;
  return Array.from({ length: n }, (_, i) => {
    const sample = (i + (method === "left" ? 0 : method === "right" ? 1 : .5)) * dx;
    return { left: i * dx, right: (i + 1) * dx, sample, height: practice ? 4 - sample * sample : sample * sample, dx };
  });
}
export function riemannResult(practice: boolean, n: number, method: RiemannMethod) {
  const rectangles = riemannRectangles(practice, n, method);
  const approximate = rectangles.reduce((total, r) => total + r.height * r.dx, 0);
  const exact = practice ? 16 / 3 : 8 / 3;
  return { rectangles, approximate, exact, error: approximate - exact, absoluteError: Math.abs(approximate - exact), dx: 2 / n };
}
export function isPracticeAreaCorrect(answer: string) {
  const text = answer.trim().replace(/\s/g, "").replace(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2");
  if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(text)) return false;
  const parts = text.split("/").map(Number), value = parts.length === 2 ? parts[0] / parts[1] : parts[0];
  return Number.isFinite(value) && Math.abs(value - 16 / 3) < .0005;
}
