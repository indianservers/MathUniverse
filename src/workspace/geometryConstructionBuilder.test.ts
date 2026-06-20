import { describe, expect, it } from "vitest";
import {
  buildAngleFromPoints,
  buildCircleFromPoints,
  buildCircleThroughThreePoints,
  buildLineFromPoints,
  buildMeasurementFromSelection,
  buildPointCreation,
  buildPolygonCompletion,
  buildPolygonDraftUpdate,
  buildRayFromPoints,
  buildSegmentFromPoints,
  nextGeometryPointLabel,
  type GeometryIdFactory,
} from "./geometryConstructionBuilder";
import type { Construction } from "./geometryCommandController";

const baseConstruction: Construction = {
  points: [
    { id: "A", x: 0, y: 0, label: "A" },
    { id: "B", x: 4, y: 0, label: "B" },
    { id: "C", x: 0, y: 3, label: "C" },
  ],
  lines: [],
  circles: [],
  polygons: [],
  arcs: [],
  loci: [],
  constraints: [],
};

function cloneConstruction() {
  return structuredClone(baseConstruction);
}

function ids(prefix = "id"): GeometryIdFactory {
  let index = 0;
  return () => `${prefix}-${++index}`;
}

describe("geometry construction builder", () => {
  it("creates a point immutably with structural id and label data", () => {
    const construction = cloneConstruction();
    const result = buildPointCreation(construction, { x: 12.345, y: 67.891 }, { idFactory: ids("point"), round: (value) => Math.round(value * 100) / 100 });

    expect(result.construction).not.toBe(construction);
    expect(result.construction.points).toHaveLength(4);
    expect(result.construction.points[3]).toMatchObject({ id: "point-1", x: 12.35, y: 67.89, label: "D" });
    expect(result.createdPointId).toBe("point-1");
    expect(construction.points).toHaveLength(3);
    expect(nextGeometryPointLabel(construction.points)).toBe("D");
  });

  it("creates line, segment, ray, and vector line-family objects from two points", () => {
    const line = buildLineFromPoints(cloneConstruction(), ["A", "B"], { idFactory: ids("line") });
    const segment = buildSegmentFromPoints(cloneConstruction(), ["A", "B"], { idFactory: ids("segment") });
    const ray = buildRayFromPoints(cloneConstruction(), ["A", "B"], { idFactory: ids("ray") });
    const vector = buildLineFromPoints(cloneConstruction(), ["A", "B"], { tool: "vector", idFactory: ids("vector") });

    expect(line.construction.lines[0]).toMatchObject({ id: "line-1", a: "A", b: "B", style: { label: "line", color: "#8b5cf6" } });
    expect(segment.construction.lines[0]).toMatchObject({ id: "segment-1", style: { label: "segment", color: "#22d3ee" } });
    expect(ray.construction.lines[0]).toMatchObject({ id: "ray-1", style: { label: "ray", color: "#a78bfa" } });
    expect(vector.construction.lines[0]).toMatchObject({ id: "vector-1", style: { label: "vector", color: "#10b981", strokeWidth: 5 } });
  });

  it("returns instructional status for incomplete or repeated line picks", () => {
    const construction = cloneConstruction();
    const incomplete = buildLineFromPoints(construction, ["A"], { idFactory: ids("line") });
    const repeated = buildLineFromPoints(construction, ["A", "A"], { idFactory: ids("line") });

    expect(incomplete.construction).toBe(construction);
    expect(incomplete.selectedPointIds).toEqual(["A"]);
    expect(incomplete.status?.type).toBe("info");
    expect(repeated.construction.lines).toHaveLength(0);
    expect(repeated.status?.type).toBe("warning");
  });

  it("creates a circle from valid center and edge picks", () => {
    const result = buildCircleFromPoints(cloneConstruction(), ["A", "C"], { idFactory: ids("circle") });

    expect(result.construction.circles[0]).toEqual({ id: "circle-1", center: "A", edge: "C" });
    expect(result.selectedPointIds).toEqual([]);
    expect(result.status?.type).toBe("success");
  });

  it("preserves polygon draft until completion and blocks early completion", () => {
    const construction = cloneConstruction();
    const first = buildPolygonDraftUpdate(construction, [], "A");
    const second = buildPolygonDraftUpdate(construction, first.polygonDraft ?? [], "B");
    const early = buildPolygonCompletion(construction, second.polygonDraft ?? [], { idFactory: ids("poly") });

    expect(first.construction).toBe(construction);
    expect(first.polygonDraft).toEqual(["A"]);
    expect(second.polygonDraft).toEqual(["A", "B"]);
    expect(early.construction.polygons).toHaveLength(0);
    expect(early.status?.type).toBe("info");
  });

  it("creates polygon and triangle completions and clears draft", () => {
    const result = buildPolygonCompletion(cloneConstruction(), ["A", "B", "C"], { idFactory: ids("poly") });

    expect(result.construction.polygons[0]).toEqual({ id: "poly-1", points: ["A", "B", "C"], style: undefined });
    expect(result.polygonDraft).toEqual([]);
    expect(result.selectedPointIds).toEqual([]);
    expect(result.status?.type).toBe("success");
  });

  it("creates angle measurement arcs from three distinct points", () => {
    const result = buildAngleFromPoints(cloneConstruction(), ["A", "B", "C"], { idFactory: ids("angle") });

    expect(result.construction.arcs[0]).toMatchObject({
      id: "angle-1",
      start: "A",
      center: "B",
      end: "C",
      kind: "angle",
      style: { color: "#14b8a6", strokeWidth: 6, labelMode: "both" },
    });
    expect(result.selectedPointIds).toEqual([]);
  });

  it("routes supported and unsupported measurement requests safely", () => {
    const angle = buildMeasurementFromSelection(cloneConstruction(), ["A", "B", "C"], "angle", { idFactory: ids("angle") });
    const distance = buildMeasurementFromSelection(cloneConstruction(), ["A", "B"], "distance", { idFactory: ids("distance") });

    expect(angle.construction.arcs).toHaveLength(1);
    expect(distance.construction.lines).toHaveLength(0);
    expect(distance.status?.type).toBe("unsupported");
  });

  it("creates a circle through three non-collinear points and rejects collinear picks", () => {
    const construction = cloneConstruction();
    const result = buildCircleThroughThreePoints(construction, ["A", "B", "C"], { idFactory: ids("circle3") });
    const collinear: Construction = {
      ...construction,
      points: [
        { id: "A", x: 0, y: 0, label: "A" },
        { id: "B", x: 1, y: 0, label: "B" },
        { id: "C", x: 2, y: 0, label: "C" },
      ],
    };
    const rejected = buildCircleThroughThreePoints(collinear, ["A", "B", "C"], { idFactory: ids("circle3") });

    expect(result.construction.points[3]).toMatchObject({ id: "circle3-1", label: "D", style: { color: "#f97316" } });
    expect(result.construction.circles[0]).toMatchObject({ id: "circle3-2", center: "circle3-1", edge: "A", style: { color: "#f97316" } });
    expect(rejected.construction.circles).toHaveLength(0);
    expect(rejected.status?.type).toBe("warning");
  });
});
