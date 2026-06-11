import { describe, expect, it } from "vitest";
import { createMathObject } from "./coreObjects";
import { point } from "./geometry2dKernel";
import { createLineObject, createPointObject } from "./geometry2dWorkspaceEngine";
import { point3, vector3 } from "./geometry3dKernel";
import { createPlane3DObject, createPoint3DObject, createSphere3DObject } from "./geometry3dWorkspaceEngine";
import {
  buildSharedWorkspaceModel,
  geometry2DToMathObject,
  geometry3DToMathObject,
  mathObjectToGeometry2D,
  mathObjectToGeometry3D,
  objectsWithEngineMeasurements,
} from "./workspaceEngineBridge";

describe("workspace engine bridge", () => {
  it("converts canonical 2D math objects into geometry engine objects and measurements", () => {
    const a = createMathObject({ id: "A", label: "A", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 0, y: 0, z: 0 } } });
    const b = createMathObject({ id: "B", label: "B", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 3, y: 4, z: 0 } } });
    const segment = createMathObject({
      id: "s",
      label: "s",
      kind: "segment",
      dimension: "2d",
      geometry: { type: "segment", start: { x: 0, y: 0, z: 0 }, end: { x: 3, y: 4, z: 0 } },
      dependencies: [{ id: "A", label: "A", role: "parent" }, { id: "B", label: "B", role: "parent" }],
    });
    const model = buildSharedWorkspaceModel([a, b, segment]);

    expect(model.geometry2d.objects).toHaveLength(3);
    expect(mathObjectToGeometry2D(segment)[0]?.kind).toBe("segment");
    expect(model.measurements.some((measurement) => measurement.label === "s" && measurement.value.includes("5"))).toBe(true);
  });

  it("converts canonical 3D math objects into geometry engine sections and measurements", () => {
    const sphere = createMathObject({
      id: "sphere",
      label: "sphere",
      kind: "solid",
      dimension: "3d",
      geometry: { type: "sphere", center: { x: 0, y: 0, z: 0 }, radius: 3 },
    });
    const plane = createMathObject({
      id: "plane",
      label: "plane",
      kind: "plane",
      dimension: "3d",
      geometry: { type: "plane", point: { x: 0, y: 0, z: 1 }, normal: { x: 0, y: 0, z: 1 } },
    });
    const model = buildSharedWorkspaceModel([sphere, plane]);

    expect(model.geometry3d.objects).toHaveLength(2);
    expect(mathObjectToGeometry3D(sphere)[0]?.kind).toBe("sphere");
    expect(model.measurements.some((measurement) => measurement.value.includes("circle center"))).toBe(true);
  });

  it("converts 2D and 3D engine objects back into canonical math objects", () => {
    const a = createPointObject("A", "A", 0, 0);
    const b = createPointObject("B", "B", 1, 0);
    const line = createLineObject("l", "l", a, b);
    const center = createPoint3DObject("O", "O", 0, 0, 0);
    const sphere = createSphere3DObject("S", "S", center, 2);
    const plane = createPlane3DObject("P", "P", center, vector3(0, 0, 1));

    expect(geometry2DToMathObject(line).geometry?.type).toBe("line");
    expect(geometry3DToMathObject(sphere).geometry?.type).toBe("sphere");
    expect(geometry3DToMathObject(plane).linkedViews).toContain("3D");
  });

  it("adds engine measurements without duplicating authored objects", () => {
    const pointObject = createMathObject({ id: "P", label: "P", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 1, y: 2, z: 0 } } });
    const lineObject = geometry2DToMathObject(createLineObject("line", "line", createPointObject("A", "A", 0, 0), createPointObject("B", "B", 0, 4)));
    const bridged = objectsWithEngineMeasurements([pointObject, lineObject]);

    expect(bridged.some((object) => object.id === "P")).toBe(true);
    expect(bridged.some((object) => object.metadata?.source === "engine-measurement")).toBe(true);
    expect(mathObjectToGeometry2D(createMathObject({ id: "circle", label: "circle", kind: "circle", dimension: "2d", geometry: { type: "circle", center: { x: point(0, 0).x, y: 0, z: 0 }, radius: 1 } }))[0]?.kind).toBe("circle");
    expect(mathObjectToGeometry3D(createMathObject({ id: "Q", label: "Q", kind: "point", dimension: "3d", geometry: { type: "point", position: point3(1, 2, 3) } }))[0]?.kind).toBe("point");
  });
});
