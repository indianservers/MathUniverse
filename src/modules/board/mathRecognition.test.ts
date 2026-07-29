import { describe, expect, it } from "vitest";
import { createMathRecognitionProvider, createRecognitionInput, DevelopmentMathRecognitionProvider, HttpMathRecognitionProvider, normalizeRecognitionResponse } from "./mathRecognition";
import type { StrokeElement } from "./types";

function makeStroke(id: string, offset = 0): StrokeElement {
  return {
    id,
    type: "stroke",
    points: [
      { x: offset, y: 0, pressure: 0.5, time: 0 },
      { x: offset + 10, y: 10, pressure: 0.5, time: 1 },
    ],
    tool: "pen",
    width: 2,
    opacity: 1,
    color: "#000",
    bounds: { x: offset, y: 0, width: 10, height: 10 },
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("math recognition pipeline", () => {
  it("crops selected strokes with padding and preserves vector metadata", () => {
    const input = createRecognitionInput([makeStroke("a"), makeStroke("b", 20)], 5);
    expect(input.bounds).toEqual({ x: -5, y: -5, width: 40, height: 20 });
    expect(input.strokes.map((stroke) => stroke.id)).toEqual(["a", "b"]);
  });

  it("does not return canned circle equations in development recognition", async () => {
    const provider = new DevelopmentMathRecognitionProvider();
    const input = createRecognitionInput([makeStroke("a")]);
    const result = await provider.recognize(input);
    expect(provider.production).toBe(false);
    expect(result.latex).not.toBe("x^2+y^2=1");
    expect(result.warnings?.[0]).toContain("VITE_BOARD_RECOGNITION_ENDPOINT");
  });

  it("can use a configured production HTTP recognition model", async () => {
    const provider = createMathRecognitionProvider("/api/board/recognize");
    expect(provider).toBeInstanceOf(HttpMathRecognitionProvider);
    expect(provider.production).toBe(true);
  });

  it("normalizes model responses from common OCR service shapes", () => {
    expect(normalizeRecognitionResponse({
      candidates: [{ latex: "\\sin 60^\\circ", confidence: 0.91 }],
      confidence_score: 0.91,
    })).toMatchObject({
      latex: "\\sin 60^\\circ",
      confidence: 0.91,
      detectedType: "unknown",
    });
  });

  it("supports cancellation and empty-selection failures", async () => {
    expect(() => createRecognitionInput([])).toThrow(/select at least one/i);
    const controller = new AbortController();
    controller.abort();
    await expect(new DevelopmentMathRecognitionProvider().recognize(
      createRecognitionInput([makeStroke("a")]),
      { signal: controller.signal },
    )).rejects.toMatchObject({ name: "AbortError" });
  });
});
