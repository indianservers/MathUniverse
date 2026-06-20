import { describe, expect, it } from "vitest";
import {
  createCone3DObject,
  createCylinder3DObject,
  createGeometry3DTransformHandles,
  createLine3DObject,
  createPlane3DObject,
  createPoint3DObject,
  createSection3DObjects,
  createSphere3DObject,
  createVector3DObject,
  measureGeometry3D,
  snapPointToGeometry3D,
  solveGeometry3DScene,
  transformGeometry3DObject,
  type Geometry3DScene,
} from "./geometry3dWorkspaceEngine";
import { point3, vector3 } from "./geometry3dKernel";
import { createUnsupportedWorkspaceAction } from "./unsupportedWorkspaceAction";

function scene3d(): Geometry3DScene {
  const origin = createPoint3DObject("O", "O", 0, 0, 0);
  const a = createPoint3DObject("A", "A", 3, 0, 0);
  const b = createPoint3DObject("B", "B", 0, 3, 0);
  const line = createLine3DObject("l", "line OA", origin, a);
  const plane = createPlane3DObject("p", "plane z=0", origin, vector3(0, 0, 1));
  const sphere = createSphere3DObject("s", "sphere", origin, 2);
  const cylinder = createCylinder3DObject("cyl", "cylinder", b, 1, 3);
  const cone = createCone3DObject("cone", "cone", a, 1, 3);
  const vector = createVector3DObject("v", "v", vector3(1, 2, 3));
  return { objects: [origin, a, b, line, plane, sphere, cylinder, cone, vector], constraints: [] };
}

describe("3D workspace smoke and safety", () => {
  it("keeps the 3D engine scene non-empty and measurable", () => {
    const scene = solveGeometry3DScene(scene3d());
    expect(scene.objects.length).toBeGreaterThanOrEqual(9);

    const measurements = measureGeometry3D(scene);
    expect(measurements.some((item) => item.kind === "volume" && item.label === "volume sphere")).toBe(true);
    expect(measurements.some((item) => item.kind === "surface-area" && item.label === "surface cylinder")).toBe(true);
    expect(measurements.some((item) => item.kind === "direction" && item.label === "direction line OA")).toBe(true);

    const sections = createSection3DObjects(scene);
    expect(sections.length).toBeGreaterThan(0);

    const snap = snapPointToGeometry3D(point3(0.1, 0.1, 0.1), scene, { threshold: 0.5 });
    expect(["point", "grid", "object", "intersection"]).toContain(snap.kind);

    const moved = transformGeometry3DObject(scene.objects[0], { type: "translate", vector: vector3(1, 2, 3) });
    expect(moved).toMatchObject({ point: { x: 1, y: 2, z: 3 } });

    const handles = createGeometry3DTransformHandles("translate", 1);
    expect(handles.length).toBeGreaterThan(0);
    expect(handles[0].mode).toBe("translate");
  });

  it("fails unsupported 3D commands safely", () => {
    const scene = scene3d();
    const unsupported = createUnsupportedWorkspaceAction("4D hypersurface", "The 3D workspace only supports browser-safe 3D objects.");

    expect(unsupported.ok).toBe(false);
    expect(unsupported.preservesState).toBe(true);
    expect(scene.objects).toHaveLength(9);
  });
});
