import { describe, expect, it } from "vitest";
import { analyzeFunction2d } from "./analysis2d";
import { createAudioTraceFrames, semanticGraphNarration } from "./audioTrace";

describe("nonvisual graph access", () => {
  it("maps graph values into bounded pitch, stereo, and semantic cues", () => {
    const analysis = analyzeFunction2d("f", "x", { min: -1, max: 1 });
    const frames = createAudioTraceFrames([{ x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }], { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }, analysis.points);
    expect(frames.every((frame) => frame.frequencyHz! >= 180 && frame.frequencyHz! <= 880)).toBe(true);
    expect(frames[0].stereoPan).toBe(-0.85); expect(frames[2].stereoPan).toBe(0.85);
    expect(frames.some((frame) => frame.cue === "POINT_OF_INTEREST" || frame.cue === "X_AXIS_CROSSING")).toBe(true);
    expect(semanticGraphNarration({ curveCount: 1, viewport: { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }, analysis })).toContain("detected root");
  });
});
