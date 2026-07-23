import { describe, expect, it } from "vitest";
import {
  sequenceLessonPreset,
  sequenceLessonPresets,
} from "./sequenceLessonPresets";

describe("sequence lesson presets", () => {
  it("covers IDs 334–346 exactly once with distinct presets", () => {
    expect(sequenceLessonPresets).toHaveLength(13);
    expect(sequenceLessonPresets.map((preset) => preset.lessonId)).toEqual(
      Array.from({ length: 13 }, (_, index) => 334 + index),
    );
    expect(new Set(sequenceLessonPresets.map((preset) => preset.id)).size).toBe(
      13,
    );
  });

  it("does not collapse advanced series concepts into arithmetic or geometric defaults", () => {
    expect(sequenceLessonPreset(339).mode).toBe("sigma");
    expect(sequenceLessonPreset(343).mode).toBe("power-series");
    expect(sequenceLessonPreset(344).mode).toBe("taylor-maclaurin");
    expect(sequenceLessonPreset(345).mode).toBe("binomial-series");
    expect(sequenceLessonPreset(346).mode).toBe("recurrence-model");
  });
});
