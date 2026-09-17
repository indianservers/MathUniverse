import { describe, expect, it } from "vitest";
import { calculateBounds } from "./boardGeometry";
import {
  classifyDigit,
  recognizeHandwrittenMath,
  reconcileRecognition,
  replaceConfusedAngle,
} from "./strokeMathRecognizer";
import type { StrokeElement } from "./types";

function strokeFrom(id: string, units: Array<[number, number]>, originX = 0, originY = 0, scaleX = 40, scaleY = 70): StrokeElement {
  const points = units.map(([x, y], index) => ({
    x: originX + x * scaleX,
    y: originY + y * scaleY,
    pressure: 0.5,
    time: index,
  }));
  return {
    id,
    type: "stroke",
    points,
    tool: "pen",
    width: 2,
    opacity: 1,
    color: "#000",
    bounds: calculateBounds(points),
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function rightLobe(cx: number, cy: number, rx: number, ry: number, from: number, to: number, step: number) {
  const points: Array<[number, number]> = [];
  const direction = from < to ? 1 : -1;
  for (let angle = from; direction > 0 ? angle <= to : angle >= to; angle += direction * step) {
    points.push([cx + rx * Math.cos(angle), cy - ry * Math.sin(angle)]);
  }
  return points;
}

function digitThree(originX: number) {
  return strokeFrom(
    "three",
    [
      ...rightLobe(0.34, 0.27, 0.5, 0.22, Math.PI / 2, -Math.PI / 2, 0.1),
      ...rightLobe(0.34, 0.73, 0.52, 0.22, Math.PI / 2, -Math.PI / 2, 0.1),
    ],
    originX,
  );
}

function digitSix(originX: number) {
  const tail: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.06) {
    tail.push([0.72 - 0.5 * t, 0.06 + 0.42 * t]);
  }
  const loop: Array<[number, number]> = [];
  for (let angle = Math.PI; angle <= Math.PI * 3.05; angle += 0.1) {
    loop.push([0.46 + 0.36 * Math.cos(angle), 0.68 + 0.26 * Math.sin(angle)]);
  }
  return strokeFrom("six", [...tail, ...loop], originX);
}

function digitZero(originX: number) {
  const loop: Array<[number, number]> = [];
  for (let angle = 0; angle <= Math.PI * 2.02; angle += 0.12) {
    loop.push([0.5 + 0.42 * Math.cos(angle), 0.5 + 0.46 * Math.sin(angle)]);
  }
  return strokeFrom("zero", loop, originX);
}

function letterS(originX: number) {
  const points: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.04) {
    points.push([0.5 + 0.38 * Math.sin(t * Math.PI * 2), t]);
  }
  return strokeFrom("s", points, originX, 0, 28, 70);
}

function letterI(originX: number) {
  return strokeFrom("i", [[0.5, 0.05], [0.5, 0.95]], originX, 0, 12, 70);
}

function letterN(originX: number) {
  return strokeFrom(
    "n",
    [
      [0.1, 0.95],
      [0.12, 0.08],
      [0.88, 0.92],
      [0.9, 0.1],
    ],
    originX,
    0,
    32,
    70,
  );
}

function paren(id: string, originX: number, openRight: boolean) {
  return strokeFrom(
    id,
    rightLobe(openRight ? 0.25 : 0.75, 0.5, 0.45, 0.46, Math.PI / 2, -Math.PI / 2, 0.12).map(
      ([x, y]) => [openRight ? x : 1 - x, y],
    ),
    originX,
    0,
    16,
    78,
  );
}

describe("stroke digit intelligence", () => {
  it("classifies an open two-lobe glyph as 3, not 6", () => {
    const ranked = classifyDigit(digitThree(0).points);
    expect(ranked[0]?.symbol).toBe("3");
    expect(ranked.find((item) => item.symbol === "6")?.confidence ?? 1).toBeLessThan(ranked[0]!.confidence);
  });

  it("reads a standalone handwritten 3 as the digit 3", () => {
    const result = recognizeHandwrittenMath([digitThree(0)]);
    expect(result.digits).toBe("3");
    expect(result.latex).not.toMatch(/6/);
  });

  it("does not flip a true 6 into a 3", () => {
    expect(classifyDigit(digitSix(0).points)[0]?.symbol).toBe("6");
    const sixty = recognizeHandwrittenMath([digitSix(0), digitZero(50)]);
    expect(sixty.digits).toBe("60");
    expect(replaceConfusedAngle("\\sin 60^\\circ", "60")).toBe("\\sin 60^\\circ");
  });

  it("reads SIN(30) instead of inventing sin 60", () => {
    const result = recognizeHandwrittenMath([
      letterS(0),
      letterI(36),
      letterN(52),
      paren("lp", 92, true),
      digitThree(112),
      digitZero(158),
      paren("rp", 204, false),
    ]);
    expect(result.digits).toBe("30");
    expect(result.latex).toMatch(/sin.*30/i);
    expect(result.latex).not.toMatch(/60/);
  });

  it("corrects a model that reports 60 when the ink is 30", () => {
    expect(replaceConfusedAngle("\\sin 60^\\circ", "30")).toBe("\\sin 30^\\circ");
    const reconciled = reconcileRecognition(
      {
        latex: "\\sin 60^\\circ",
        plainText: "sine sixty degrees",
        confidence: 0.38,
        alternatives: [
          { latex: "\\sin 60^\\circ", confidence: 0.38 },
          { latex: "\\sin 6\\theta", confidence: 0.24 },
        ],
      },
      [digitThree(0), digitZero(50)],
    );
    expect(reconciled.latex).toContain("30");
    expect(reconciled.latex).not.toContain("60");
  });
});
