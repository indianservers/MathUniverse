import { describe, expect, it } from "vitest";
import { escapeTime, inMainCardioid, juliaConnected, periodBulbLabel } from "./fractalMath";

describe("fractal math", () => {
  it("keeps c=0 bounded and escapes a far c", () => {
    expect(escapeTime(0, 0, 0, 0, 40)).toBe(40);
    expect(escapeTime(0, 0, 2, 2, 40)).toBeLessThan(8);
    expect(inMainCardioid(-0.1, 0)).toBe(true);
    expect(periodBulbLabel(-0.1, 0)).toBe("period-1 cardioid");
    expect(periodBulbLabel(-1, 0)).toBe("period-2 bulb");
    expect(juliaConnected(-1, 0)).toBe(true);
    expect(juliaConnected(0.4, 0.6)).toBe(false);
  });
});

describe("fractal worker grid", () => {
  it("changes the set when c moves", async () => {
    const { computeFractalGrid } = await import("./fractalWorker");
    const a = computeFractalGrid({ kind: "julia", cx: 0, cy: 0, iter: 12, cols: 8, rows: 6 });
    const b = computeFractalGrid({ kind: "julia", cx: 0.8, cy: 0.8, iter: 12, cols: 8, rows: 6 });
    expect(a.some((cell, i) => cell.k !== b[i]?.k)).toBe(true);
  });
});
