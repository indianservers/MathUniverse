import { describe, expect, it } from "vitest";
import {
  buildCompassCopyConstruction,
  buildDilateTransformPayload,
  buildFixedLengthSegmentConstruction,
  buildIntersectionConstruction,
  buildMidpointConstruction,
  buildMirrorTransformPayload,
  buildParallelConstruction,
  buildParallelPerpendicularFromPoints,
  buildPerpendicularConstruction,
  buildPointOnCircleConstraint,
  buildRegularPolygonConstruction,
  buildRotateTransformPayload,
  buildSelectedPointsTransform,
  buildTranslateTransformPayload,
  buildUnsupportedAdvancedConstruction,
} from "./geometryAdvancedConstructionBuilder";
import type { Construction } from "./geometryCommandController";
import type { GeometryIdFactory } from "./geometryConstructionBuilder";

const baseConstruction: Construction = {
  points: [
    { id: "A", x: 0, y: 0, label: "A" },
    { id: "B", x: 100, y: 0, label: "B" },
    { id: "C", x: 0, y: 100, label: "C" },
    { id: "D", x: 100, y: 100, label: "D" },
  ],
  lines: [
    { id: "line-ab", a: "A", b: "B" },
    { id: "line-cd", a: "C", b: "D" },
    { id: "line-ac", a: "A", b: "C" },
  ],
  circles: [{ id: "circle-a-b", center: "A", edge: "B" }],
  polygons: [],
  arcs: [],
  loci: [],
  constraints: [],
};

function cloneConstruction() {
  return structuredClone(baseConstruction);
}

function ids(prefix = "advanced"): GeometryIdFactory {
  let index = 0;
  return () => `${prefix}-${++index}`;
}

describe("geometry advanced construction builder", () => {
  it("creates a midpoint constraint from two valid points", () => {
    const construction = cloneConstruction();
    const result = buildMidpointConstruction(construction, ["A", "B"], { idFactory: ids("mid") });

    expect(result.construction).not.toBe(construction);
    expect(result.construction.points.at(-1)).toMatchObject({ id: "mid-1", x: 50, y: 0, label: "E" });
    expect(result.construction.constraints.at(-1)).toMatchObject({ id: "mid-2", type: "midpoint", a: "A", b: "B", point: "mid-1" });
    expect(construction.points).toHaveLength(4);
  });

  it("keeps midpoint incomplete picks non-destructive", () => {
    const construction = cloneConstruction();
    const result = buildMidpointConstruction(construction, ["A"], { idFactory: ids("mid") });

    expect(result.construction).toBe(construction);
    expect(result.selectedPointIds).toEqual(["A"]);
    expect(result.status.type).toBe("info");
  });

  it("creates parallel and perpendicular lines from an existing source line", () => {
    const parallel = buildParallelConstruction(cloneConstruction(), "line-ab", "C", { idFactory: ids("parallel") });
    const perpendicular = buildPerpendicularConstruction(cloneConstruction(), "line-ab", "C", { idFactory: ids("perp") });

    expect(parallel.construction.lines.at(-1)).toMatchObject({ id: "parallel-2", a: "C", b: "parallel-1", style: { color: "#10b981", label: "parallel" } });
    expect(parallel.construction.constraints.at(-1)).toMatchObject({ id: "parallel-3", type: "parallel", sourceLine: "line-ab", throughPoint: "C", line: "parallel-2" });
    expect(perpendicular.construction.points.at(-1)).toMatchObject({ id: "perp-1", x: 0, y: 220 });
    expect(perpendicular.construction.constraints.at(-1)).toMatchObject({ id: "perp-3", type: "perpendicular" });
  });

  it("fails parallel and perpendicular invalid base selections safely", () => {
    const construction = cloneConstruction();
    const parallel = buildParallelConstruction(construction, "missing", "A", { idFactory: ids("parallel") });
    const perpendicular = buildPerpendicularConstruction(construction, "line-ab", "missing", { idFactory: ids("perp") });

    expect(parallel.construction).toBe(construction);
    expect(perpendicular.construction).toBe(construction);
    expect(parallel.status.type).toBe("warning");
    expect(perpendicular.status.type).toBe("warning");
  });

  it("creates parallel and perpendicular constraints from three picked points", () => {
    const parallel = buildParallelPerpendicularFromPoints(cloneConstruction(), "parallel", ["A", "B", "C"], { idFactory: ids("pp") });
    const perpendicular = buildParallelPerpendicularFromPoints(cloneConstruction(), "perpendicular", ["A", "B", "C"], { idFactory: ids("pd") });

    expect(parallel.construction.lines).toHaveLength(5);
    expect(parallel.construction.constraints.at(-1)).toMatchObject({ type: "parallel", sourceLine: "pp-1", throughPoint: "C" });
    expect(perpendicular.construction.points.at(-1)).toMatchObject({ x: 0, y: 220 });
  });

  it("creates fixed-length constraints and rejects invalid length", () => {
    const valid = buildFixedLengthSegmentConstruction(cloneConstruction(), "A", "B", { idFactory: ids("fixed") });
    const invalid = buildFixedLengthSegmentConstruction(cloneConstruction(), "A", "B", { idFactory: ids("fixed"), length: 0 });

    expect(valid.construction.constraints.at(-1)).toMatchObject({ id: "fixed-1", type: "fixed-length", anchor: "A", point: "B", length: 100 });
    expect(invalid.construction.constraints).toHaveLength(0);
    expect(invalid.status.type).toBe("warning");
  });

  it("creates point-on-circle constraints and fails invalid objects safely", () => {
    const valid = buildPointOnCircleConstraint(cloneConstruction(), "C", "circle-a-b", { idFactory: ids("circle") });
    const invalid = buildPointOnCircleConstraint(cloneConstruction(), "missing", "circle-a-b", { idFactory: ids("circle") });

    expect(valid.construction.constraints.at(-1)).toMatchObject({ id: "circle-1", type: "on-circle", point: "C", circle: "circle-a-b" });
    expect(invalid.construction.constraints).toHaveLength(0);
    expect(invalid.status.type).toBe("warning");
  });

  it("creates selected object intersections and rejects unsupported pairs safely", () => {
    const construction = {
      ...cloneConstruction(),
      lines: [
        ...baseConstruction.lines,
        { id: "line-ad", a: "A", b: "D" },
        { id: "line-bc", a: "B", b: "C" },
      ],
    };
    const valid = buildIntersectionConstruction(construction, "line-ad", "line-bc", { firstType: "line", secondType: "line", idFactory: ids("hit") });
    const unsupported = buildIntersectionConstruction(construction, "line-ab", "line-ac", { firstType: "line", secondType: "circle", idFactory: ids("hit") });

    expect(valid.construction.points.at(-1)).toMatchObject({ id: "hit-1", x: 50, y: 50, style: { color: "#f97316" } });
    expect(valid.construction.constraints.at(-1)).toMatchObject({ id: "hit-2", type: "intersection", first: "line-ad", second: "line-bc", point: "hit-1" });
    expect(unsupported.construction.points).toHaveLength(4);
    expect(unsupported.status.type).toBe("warning");
  });

  it("creates all available intersections when no explicit pair is provided", () => {
    const result = buildIntersectionConstruction(cloneConstruction(), undefined, undefined, { idFactory: ids("all-hit") });

    expect(result.construction.points.length).toBeGreaterThan(4);
    expect(result.status.type).toBe("success");
  });

  it("copies compass radius and fails missing source or target safely", () => {
    const valid = buildCompassCopyConstruction(cloneConstruction(), "A", "B", "C", { idFactory: ids("compass") });
    const invalid = buildCompassCopyConstruction(cloneConstruction(), "A", "missing", "C", { idFactory: ids("compass") });

    expect(valid.construction.points.at(-1)).toMatchObject({ id: "compass-1", x: 100, y: 100 });
    expect(valid.construction.circles.at(-1)).toMatchObject({ id: "compass-2", center: "C", edge: "compass-1" });
    expect(invalid.construction).not.toBe(valid.construction);
    expect(invalid.status.type).toBe("warning");
  });

  it("rejects invalid regular polygon sides and creates supported polygons", () => {
    const invalid = buildRegularPolygonConstruction(cloneConstruction(), ["A", "B"], 2, { idFactory: ids("poly") });
    const valid = buildRegularPolygonConstruction(cloneConstruction(), ["A", "B"], 5, { idFactory: ids("poly") });

    expect(invalid.construction.polygons).toHaveLength(0);
    expect(invalid.status.type).toBe("warning");
    expect(valid.construction.polygons.at(-1)?.points).toHaveLength(5);
    expect(valid.construction.points).toHaveLength(7);
  });

  it("validates mirror payloads and creates mirrored points", () => {
    const valid = buildMirrorTransformPayload(cloneConstruction(), "D", "A", "C", { idFactory: ids("mirror") });
    const invalid = buildMirrorTransformPayload(cloneConstruction(), "D", "A", "A", { idFactory: ids("mirror") });

    expect(valid.construction.points.at(-1)).toMatchObject({ id: "mirror-1", x: -100, y: 100, style: { color: "#ec4899" } });
    expect(valid.construction.lines.at(-1)).toMatchObject({ id: "mirror-2", a: "D", b: "mirror-1" });
    expect(invalid.status.type).toBe("warning");
  });

  it("validates rotate payloads and creates rotated points", () => {
    const valid = buildRotateTransformPayload(cloneConstruction(), "B", "A", 90, { idFactory: ids("rotate") });
    const invalid = buildRotateTransformPayload(cloneConstruction(), "B", "A", Number.NaN, { idFactory: ids("rotate") });

    expect(valid.construction.points.at(-1)?.x).toBeCloseTo(0, 6);
    expect(valid.construction.points.at(-1)?.y).toBeCloseTo(100, 6);
    expect(invalid.status.type).toBe("warning");
  });

  it("validates dilate payloads and creates dilated points", () => {
    const valid = buildDilateTransformPayload(cloneConstruction(), "B", "A", 1.5, { idFactory: ids("dilate") });
    const invalid = buildDilateTransformPayload(cloneConstruction(), "B", "A", 0, { idFactory: ids("dilate") });

    expect(valid.construction.points.at(-1)).toMatchObject({ id: "dilate-1", x: 150, y: 0, style: { color: "#10b981" } });
    expect(invalid.status.type).toBe("warning");
  });

  it("validates translate payloads and creates translated points", () => {
    const valid = buildTranslateTransformPayload(cloneConstruction(), "D", "A", "B", { idFactory: ids("translate") });
    const invalid = buildTranslateTransformPayload(cloneConstruction(), "D", "A", "A", { idFactory: ids("translate") });

    expect(valid.construction.points.at(-1)).toMatchObject({ id: "translate-1", x: 200, y: 100, style: { color: "#06b6d4" } });
    expect(invalid.status.type).toBe("warning");
  });

  it("transforms selected points immutably", () => {
    const construction = cloneConstruction();
    const translated = buildSelectedPointsTransform(construction, ["A", "B"], "translate");
    const rotated = buildSelectedPointsTransform(construction, ["A", "B"], "rotate");
    const dilated = buildSelectedPointsTransform(construction, ["A", "B"], "dilate");

    expect(translated.construction.points.find((point) => point.id === "A")).toMatchObject({ x: 24, y: -18 });
    expect(rotated.construction.points.find((point) => point.id === "B")?.y).toBeGreaterThan(0);
    expect(dilated.construction.points.find((point) => point.id === "B")?.x).toBeGreaterThan(100);
    expect(construction.points.find((point) => point.id === "A")).toMatchObject({ x: 0, y: 0 });
  });

  it("returns clear unsupported advanced construction status", () => {
    const construction = cloneConstruction();
    const result = buildUnsupportedAdvancedConstruction(construction, "Experimental advanced tool");

    expect(result.construction).toBe(construction);
    expect(result.status.type).toBe("unsupported");
    expect(result.status.message).toContain("Experimental advanced tool");
  });
});
