import { describe, expect, it } from "vitest";
import { parseGeometrySolidInput } from "./arGeometrySolids";
import { comparisonSummary, createAnimation, createMeasurement, createObjectDimensionMeasurement, feedbackFor, lessonFor, measurementValue, parseSceneJson, serializeScene } from "./arInteractiveTools";

function solid(input: string) {
  const result = parseGeometrySolidInput(input);
  if (!result.ok) throw new Error(result.message);
  return result.solid;
}

describe("AR Math Lab interactive tools", () => {
  it("creates free measurements with calculated labels", () => {
    const distance = createMeasurement("distance", "object-1", "cm");
    const angle = createMeasurement("angle", "object-1", "deg");

    expect(distance.value).toBe(1);
    expect(distance.label).toContain("Distance");
    expect(measurementValue("angle", angle.points)).toBeCloseTo(90);
    expect(angle.label).toContain("deg");
  });

  it("creates dimension measurements from generated solids", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");
    const slant = createObjectDimensionMeasurement(cone, "slantHeight");

    expect(slant.objectId).toBe(cone.id);
    expect(slant.type).toBe("slant_height");
    expect(slant.value).toBeCloseTo(13);
    expect(slant.label).toContain("Slant Height");
  });

  it("builds animation presets for selected objects", () => {
    const animation = createAnimation("solid-1", "rotation", "y");

    expect(animation.objectId).toBe("solid-1");
    expect(animation.target).toBe("rotation");
    expect(animation.to).toBeCloseTo(Math.PI * 2);
    expect(animation.loop).toBe(true);
  });

  it("returns lessons, feedback, and comparison summaries", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");
    const cylinder = solid("Cylinder radius 5 cm height 12 cm");

    expect(lessonFor(undefined, cone).title).toBe("Cone");
    expect(feedbackFor("Cone radius 5 cm height 12 cm", undefined, cone).join(" ")).toContain("5-12-13");
    expect(comparisonSummary({ enabled: true, mode: "side-by-side", syncScale: true, objectAId: cone.id, objectBId: cylinder.id }, [], [cone, cylinder])).toContain("one-third");
  });

  it("serializes and validates scene JSON", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");
    const saved = serializeScene({
      graphs: [],
      solids: [cone],
      measurements: [],
      animations: [],
      comparison: { enabled: false, mode: "side-by-side", syncScale: true },
      settings: { showGrid: true, showAxes: true, showLabels: true },
    });
    const parsed = parseSceneJson(JSON.stringify(saved));

    expect(parsed.module).toBe("ARMathLab");
    expect(parsed.solids[0].solidType).toBe("cone");
    expect(() => parseSceneJson("{}")).toThrow("Invalid scene file");
  });
});
