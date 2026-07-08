import { describe, expect, it } from "vitest";
import { parseGeometrySolidInput } from "./arGeometrySolids";
import { defaultGraphSettings } from "./arGraphGenerator";
import { buildLearningState, createARLearningEvent } from "./arLearningEngine";
import type { ARComparison, ARGeneratedGeometrySolid, ARGeneratedGraphObject } from "./types";

const emptyComparison: ARComparison = { enabled: false, mode: "side-by-side", syncScale: true };

function build(input: string, overrides: Partial<Parameters<typeof buildLearningState>[1]> = {}) {
  return buildLearningState(input, {
    graphSettings: defaultGraphSettings,
    parameterValues: {},
    measurements: [],
    comparison: emptyComparison,
    graphs: [],
    solids: [],
    ...overrides,
  });
}

function solid(input: string) {
  const parsed = parseGeometrySolidInput(input, "cm");
  if (!parsed.ok) throw new Error(parsed.message);
  return parsed.solid;
}

describe("arLearningEngine", () => {
  it("explains wave parameter changes with a live formula", () => {
    const state = build("z = sin(x) * sin(y)", {
      parameterValues: { a: 2, k: 3 },
      lastEvent: createARLearningEvent("graph_parameter_changed", "g1", { key: "k", value: 3 }),
    });

    expect(state.activeConcept).toBe("Wave surface");
    expect(state.whatChanged).toContain("Frequency changed");
    expect(state.liveFormula).toContain("2 sin(3x) sin(3y)");
    expect(state.quiz.correctAnswer).toBe("closer together");
  });

  it("warns students when a paraboloid is mistaken for a sphere", () => {
    const state = build("z = x^2 + y^2");

    expect(state.activeConcept).toBe("Paraboloid");
    expect(state.misconceptionWarning).toContain("not a sphere");
  });

  it("connects cone dimension changes to radius-squared volume growth", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");
    const state = build(cone.createdFromInput, {
      selectedSolid: cone,
      solids: [cone],
      lastEvent: createARLearningEvent("geometry_dimension_changed", cone.id, { key: "radius", value: 8 }),
    });

    expect(state.activeConcept).toBe("Cone");
    expect(state.liveFormula).toContain("Volume");
    expect(state.whatChanged).toContain("r^2");
  });

  it("spots implicit cylinders when z is unrestricted", () => {
    const state = build("x^2 + y^2 = 9");

    expect(state.activeConcept).toBe("Implicit cylinder");
    expect(state.misconceptionWarning).toContain("cylinder");
  });

  it("summarizes cone versus cylinder comparison for classroom discussion", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");
    const cylinder = solid("Cylinder radius 5 cm height 12 cm");
    const state = build(cone.createdFromInput, {
      selectedSolid: cone,
      solids: [cone, cylinder] as ARGeneratedGeometrySolid[],
      comparison: { enabled: true, mode: "side-by-side", syncScale: true, objectAId: cone.id, objectBId: cylinder.id },
    });

    expect(state.comparisonInsight).toContain("one-third");
  });

  it("summarizes paraboloid versus saddle comparison", () => {
    const paraboloid = { id: "p", name: "Paraboloid", equation: "z = x^2 + y^2", type: "explicit_surface" } as ARGeneratedGraphObject;
    const saddle = { id: "s", name: "Saddle", equation: "z = x^2 - y^2", type: "explicit_surface" } as ARGeneratedGraphObject;
    const state = build(paraboloid.equation, {
      selectedGraph: paraboloid,
      graphs: [paraboloid, saddle],
      comparison: { enabled: true, mode: "side-by-side", syncScale: true, objectAId: paraboloid.id, objectBId: saddle.id },
    });

    expect(state.comparisonInsight).toContain("rises on one axis");
  });
});
