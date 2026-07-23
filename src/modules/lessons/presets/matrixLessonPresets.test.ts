import { describe, expect, it } from "vitest";
import {
  matrixLessonPreset,
  matrixLessonPresets,
} from "./matrixLessonPresets";

describe("matrix lesson presets", () => {
  it("covers IDs 347–364 exactly once with distinct presets", () => {
    expect(matrixLessonPresets).toHaveLength(18);
    expect(matrixLessonPresets.map((preset) => preset.lessonId)).toEqual(
      Array.from({ length: 18 }, (_, index) => 347 + index),
    );
    expect(new Set(matrixLessonPresets.map((preset) => preset.id)).size).toBe(
      18,
    );
  });

  it("keeps core operations and vector-space concepts distinct", () => {
    expect(matrixLessonPreset(350).mode).toBe("matrix-multiplication");
    expect(matrixLessonPreset(356).mode).toBe("rref");
    expect(matrixLessonPreset(359).mode).toBe("eigen-directions");
    expect(matrixLessonPreset(363).mode).toBe("gram-schmidt");
    expect(matrixLessonPreset(364).mode).toBe("least-squares");
  });
});
