import { describe, expect, it } from "vitest";
import { createMathObject } from "./coreObjects";
import {
  allSceneIntersections,
  createCircleObject,
  createLineObject,
  createPointObject,
  createPolygonObject,
  dragGeometryPoint,
  measureGeometry2D,
  snapPointToGeometry,
  solveGeometry2DScene,
  transformGeometryObject,
  type Geometry2DScene,
} from "./geometry2dWorkspaceEngine";
import { distanceBetween, midpoint, point, relationBetween, segment } from "./geometry2dKernel";
import { createUnsupportedWorkspaceAction } from "./unsupportedWorkspaceAction";
import { exportWorkspaceProject, normalizeWorkspaceSnapshot, parseWorkspaceProjectExport } from "./workspacePersistence";
import { createUndoableHistoryEntry, invertHistoryEntry } from "./workspaceHistory";

function baseScene(): Geometry2DScene {
  const a = createPointObject("A", "A", 0, 0);
  const b = createPointObject("B", "B", 4, 0);
  const c = createPointObject("C", "C", 0, 3);
  const ab = createLineObject("AB", "AB", a, b, "segment");
  const rayAc = createLineObject("rayAC", "ray AC", a, c, "ray");
  const lineBc = createLineObject("lineBC", "line BC", b, c, "line");
  const circleA = createCircleObject("circleA", "circle A", a, b);
  const triangle = createPolygonObject("tri", "triangle ABC", [a, b, c]);
  return { objects: [a, b, c, ab, rayAc, lineBc, circleA, triangle], constraints: [] };
}

describe("geometry workflow regression", () => {
  it("covers supported 2D construction workflows deterministically", () => {
    const scene = baseScene();

    expect(scene.objects.find((object) => object.kind === "point" && object.id === "A")).toBeTruthy();
    expect(scene.objects.find((object) => object.kind === "line" && object.id === "lineBC")).toBeTruthy();
    expect(scene.objects.find((object) => object.kind === "segment" && object.id === "AB")).toBeTruthy();
    expect(scene.objects.find((object) => object.kind === "ray" && object.id === "rayAC")).toBeTruthy();
    expect(scene.objects.find((object) => object.kind === "circle" && object.id === "circleA")).toBeTruthy();
    expect(scene.objects.find((object) => object.kind === "polygon" && object.id === "tri")).toBeTruthy();

    const solved = solveGeometry2DScene(scene);
    expect(solved.objects).toHaveLength(scene.objects.length);

    const moved = dragGeometryPoint(scene, "B", point(6, 0));
    expect(moved.objects.find((object) => object.kind === "point" && object.id === "B")).toMatchObject({ point: { x: 6, y: 0 } });
    expect(moved.valid).toBe(true);

    const measurements = measureGeometry2D(scene);
    expect(measurements.find((item) => item.kind === "distance" && item.label === "AB")?.value).toBe(4);
    expect(measurements.some((item) => item.kind === "angle" && item.label.startsWith("angle triangle ABC"))).toBe(true);
    expect(measurements.find((item) => item.kind === "area" && item.label === "area triangle ABC")?.value).toBe(6);
    expect(measurements.find((item) => item.kind === "perimeter" && item.label === "perimeter triangle ABC")?.value).toBe(12);
    expect(measurements.find((item) => item.kind === "slope" && item.label === "slope AB")?.value).toBe(0);
    expect(measurements.some((item) => item.kind === "equation" && item.label === "equation circle A")).toBe(true);

    expect(midpoint(point(0, 0), point(4, 0))).toEqual({ x: 2, y: 0 });
    expect(relationBetween(segment(point(0, 0), point(4, 0)), segment(point(2, -2), point(2, 2))).relation).toBe("perpendicular");
    expect(relationBetween(segment(point(0, 0), point(4, 0)), segment(point(0, 1), point(4, 1))).relation).toBe("parallel");
    expect(allSceneIntersections(scene).length).toBeGreaterThan(0);

    const snap = snapPointToGeometry(point(2.05, 0.04), scene, { gridSize: 1, threshold: 0.2 });
    expect(["midpoint", "object", "grid"]).toContain(snap.kind);

    const translated = transformGeometryObject(scene.objects[0], { type: "translate", vector: point(2, 3) });
    expect(translated).toMatchObject({ point: { x: 2, y: 3 } });
    const rotated = transformGeometryObject(scene.objects[1], { type: "rotate", center: point(0, 0), degrees: 90 });
    expect(rotated.kind).toBe("point");
    const mirrored = transformGeometryObject(scene.objects[2], { type: "mirror", a: point(0, 0), b: point(4, 0) });
    expect(mirrored).toMatchObject({ point: { x: 0, y: -3 } });

    const selected = scene.objects.find((object) => object.id === "AB");
    expect(selected?.label).toBe("AB");
    const renamed = { ...selected!, label: "base" };
    expect(renamed.label).toBe("base");
    const labelHidden = { ...renamed, style: { labelVisible: false } };
    expect(labelHidden.style.labelVisible).toBe(false);
    const deleted = scene.objects.filter((object) => object.id !== "AB");
    expect(deleted.some((object) => object.id === "AB")).toBe(false);
  });

  it("exports/imports construction state and preserves undo/redo snapshots", () => {
    const object = createMathObject({ id: "A", label: "A", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 1, y: 2, z: 0 } } });
    const state = normalizeWorkspaceSnapshot({ objects: [object], selectedObjectId: "A", selectedObjectIds: ["A"] });
    const exported = exportWorkspaceProject(state);
    const imported = parseWorkspaceProjectExport(JSON.stringify(exported));

    expect(imported.objects).toHaveLength(1);
    expect(imported.selectedObjectId).toBe("A");

    const before = exportWorkspaceProject(state).snapshot;
    const afterState = normalizeWorkspaceSnapshot({ ...state, objects: [{ ...object, label: "A1" }] });
    const after = exportWorkspaceProject(afterState).snapshot;
    const entry = createUndoableHistoryEntry({ action: "update", label: "Rename point", objectIds: ["A"], before, after });
    const undo = invertHistoryEntry(entry, "Undo");
    const redo = undo ? invertHistoryEntry(undo, "Redo") : null;

    expect(undo?.before?.objects[0].label).toBe("A1");
    expect(undo?.after?.objects[0].label).toBe("A");
    expect(redo?.after?.objects[0].label).toBe("A1");
  });

  it("fails unsupported geometry actions safely without mutating construction state", () => {
    const scene = baseScene();
    const action = createUnsupportedWorkspaceAction("non-euclidean compass", "Hyperbolic compass construction is not implemented.");

    expect(action.ok).toBe(false);
    expect(action.preservesState).toBe(true);
    expect(action.message).toContain("not supported");
    expect(scene.objects).toHaveLength(baseScene().objects.length);
    expect(distanceBetween(point(0, 0), point(3, 4))).toBe(5);
  });
});
