import { describe, expect, it } from "vitest";
import {
  financeLessonPreset,
  financeLessonPresets,
} from "./financeLessonPresets";

describe("finance lesson presets", () => {
  it("covers every finance lesson exactly once with a lesson-specific preset", () => {
    expect(financeLessonPresets).toHaveLength(27);
    expect(financeLessonPresets.map((preset) => preset.lessonId)).toEqual(
      Array.from({ length: 27 }, (_, index) => 591 + index),
    );
    expect(new Set(financeLessonPresets.map((preset) => preset.id)).size).toBe(
      27,
    );
  });

  it("keeps mathematically different finance concepts distinct", () => {
    expect(financeLessonPreset(592).mode).toBe("compound-interest");
    expect(financeLessonPreset(597).mode).toBe("loan-emi");
    expect(financeLessonPreset(603).mode).toBe("break-even");
    expect(financeLessonPreset(615).mode).toBe("residual");
    expect(financeLessonPreset(617).mode).toBe("linear-programming");
  });
});
