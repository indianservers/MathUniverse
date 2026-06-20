import { describe, expect, it } from "vitest";
import {
  createGeometryTransformRequest,
  createNoSelectionDeleteAction,
  deleteGeometryObjectFromConstruction,
  deleteGeometrySelection,
  geometryObjectBySelection,
  patchGeometryObject,
  pointById,
  pointIdsForObject,
  type Construction,
} from "./geometryCommandController";

const fixture: Construction = {
  points: [
    { id: "A", x: 0, y: 0, label: "A", style: { color: "#0ea5e9" } },
    { id: "B", x: 4, y: 0, label: "B" },
    { id: "C", x: 4, y: 3, label: "C" },
    { id: "D", x: 1, y: 2, label: "D" },
  ],
  lines: [
    { id: "line-ab", a: "A", b: "B", style: { strokeWidth: 2 } },
    { id: "line-cd", a: "C", b: "D" },
  ],
  circles: [{ id: "circle-ac", center: "A", edge: "C" }],
  polygons: [{ id: "poly-abcd", points: ["A", "B", "C", "D"] }],
  arcs: [{ id: "arc-abc", center: "A", start: "B", end: "C", kind: "arc" }],
  loci: [
    { id: "locus-d", label: "Trace D", sourcePointId: "D", mode: "trace", points: [{ x: 1, y: 2 }] },
    { id: "locus-static", label: "Static", points: [{ x: 0, y: 0 }], mode: "static" },
  ],
  constraints: [
    { id: "parallel-1", type: "parallel", sourceLine: "line-ab", throughPoint: "D", line: "line-cd" },
    { id: "midpoint-1", type: "midpoint", a: "A", b: "C", point: "D" },
  ],
};

function cloneFixture() {
  return structuredClone(fixture);
}

describe("geometry command controller", () => {
  it("finds points and selected objects without mutating the construction", () => {
    const construction = cloneFixture();

    expect(pointById(construction.points, "B")?.label).toBe("B");
    expect(pointById(construction.points, "missing")).toBeUndefined();
    expect(geometryObjectBySelection(construction, { type: "circle", id: "circle-ac" })?.style).toBeUndefined();
    expect(geometryObjectBySelection(construction, { type: "polygon", id: "poly-abcd" })).toEqual(construction.polygons[0]);
    expect(geometryObjectBySelection(construction, { type: "line", id: "missing" })).toBeNull();
  });

  it("resolves point dependencies for every selectable geometry object type", () => {
    const construction = cloneFixture();

    expect(pointIdsForObject(construction, { type: "point", id: "A" })).toEqual(["A"]);
    expect(pointIdsForObject(construction, { type: "line", id: "line-ab" })).toEqual(["A", "B"]);
    expect(pointIdsForObject(construction, { type: "circle", id: "circle-ac" })).toEqual(["A", "C"]);
    expect(pointIdsForObject(construction, { type: "polygon", id: "poly-abcd" })).toEqual(["A", "B", "C", "D"]);
    expect(pointIdsForObject(construction, { type: "arc", id: "arc-abc" })).toEqual(["A", "B", "C"]);
    expect(pointIdsForObject(construction, { type: "locus", id: "locus-d" })).toEqual([]);
    expect(pointIdsForObject(construction, { type: "line", id: "missing" })).toEqual([]);
  });

  it("patches geometry style immutably and supports explicit style reset", () => {
    const construction = cloneFixture();
    const patched = patchGeometryObject(construction, { type: "line", id: "line-ab" }, { style: { color: "#ef4444", strokeWidth: 5 } });
    const reset = patchGeometryObject(patched, { type: "line", id: "line-ab" }, { style: {} });

    expect(patched).not.toBe(construction);
    expect(patched.lines[0].style).toEqual({ strokeWidth: 5, color: "#ef4444" });
    expect(construction.lines[0].style).toEqual({ strokeWidth: 2 });
    expect(reset.lines[0].style).toEqual({});
  });

  it("deletes a point and cascades dependent geometry safely", () => {
    const construction = cloneFixture();
    const deleted = deleteGeometryObjectFromConstruction(construction, { type: "point", id: "D" });

    expect(deleted.points.map((point) => point.id)).toEqual(["A", "B", "C"]);
    expect(deleted.lines.map((line) => line.id)).toEqual(["line-ab"]);
    expect(deleted.circles.map((circle) => circle.id)).toEqual(["circle-ac"]);
    expect(deleted.polygons).toHaveLength(1);
    expect(deleted.polygons[0].points).toEqual(["A", "B", "C"]);
    expect(deleted.arcs.map((arc) => arc.id)).toEqual(["arc-abc"]);
    expect(deleted.loci.map((locus) => locus.id)).toEqual(["locus-static"]);
    expect(deleted.constraints).toHaveLength(0);
    expect(construction.points).toHaveLength(4);
  });

  it("deletes selected non-point geometry without touching unrelated collections", () => {
    const construction = cloneFixture();

    expect(deleteGeometryObjectFromConstruction(construction, { type: "line", id: "line-ab" }).lines.map((line) => line.id)).toEqual(["line-cd"]);
    expect(deleteGeometryObjectFromConstruction(construction, { type: "circle", id: "circle-ac" }).circles).toHaveLength(0);
    expect(deleteGeometryObjectFromConstruction(construction, { type: "polygon", id: "poly-abcd" }).polygons).toHaveLength(0);
    expect(deleteGeometryObjectFromConstruction(construction, { type: "arc", id: "arc-abc" }).arcs).toHaveLength(0);
    expect(deleteGeometryObjectFromConstruction(construction, { type: "locus", id: "locus-d" }).loci.map((locus) => locus.id)).toEqual(["locus-static"]);
  });

  it("returns shared unsupported-action contracts for no-selection delete", () => {
    const construction = cloneFixture();
    const result = deleteGeometrySelection(construction, null);
    const shortcut = createNoSelectionDeleteAction();

    expect(result.ok).toBe(false);
    expect(result.value).toBe(construction);
    if (!result.ok) {
      expect(result.unsupported.ok).toBe(false);
      expect(result.unsupported.preservesState).toBe(true);
      expect(result.unsupported.reason).toContain("no selected geometry");
    }
    expect(shortcut.actionName).toBe("Delete selection");
    expect(shortcut.preservesState).toBe(true);
  });

  it("creates transform requests from selected points or selected objects", () => {
    const construction = cloneFixture();
    const selectedPoints = createGeometryTransformRequest(construction, null, ["A", "A", "B"], "translate");
    const selectedObject = createGeometryTransformRequest(construction, { type: "circle", id: "circle-ac" }, [], "rotate");

    expect(selectedPoints.ok).toBe(true);
    if (selectedPoints.ok) expect(selectedPoints.value).toEqual({ mode: "translate", pointIds: ["A", "B"], source: "selected-points" });
    expect(selectedObject.ok).toBe(true);
    if (selectedObject.ok) expect(selectedObject.value).toEqual({ mode: "rotate", pointIds: ["A", "C"], source: "selected-object" });
  });

  it("blocks transform commands with no selected geometry while preserving state", () => {
    const construction = cloneFixture();
    const result = createGeometryTransformRequest(construction, null, [], "dilate");

    expect(result.ok).toBe(false);
    expect(result.value).toBeNull();
    if (!result.ok) {
      expect(result.unsupported.actionName).toBe("Geometry transform");
      expect(result.unsupported.preservesState).toBe(true);
      expect(result.unsupported.suggestions).toContain("Select points on the board.");
    }
  });
});
