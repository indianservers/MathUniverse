import { describe, expect, it } from "vitest";
import {
  allSceneIntersections3D,
  createGeometry3DTransformHandles,
  createLine3DObject,
  createPlane3DObject,
  createPoint3DObject,
  createSection3DObjects,
  createSphere3DObject,
  generateLocus3D,
  measureGeometry3D,
  snapPointToGeometry3D,
  solveGeometry3DScene,
  transformGeometry3DObject,
  type Geometry3DScene,
} from "./geometry3dWorkspaceEngine";
import { point3, vector3 } from "./geometry3dKernel";

describe("geometry 3D workspace engine", () => {
  it("creates dependency-aware objects and measures 3D solids", () => {
    const center = createPoint3DObject("O", "O", 0, 0, 0);
    const sphere = createSphere3DObject("s", "s", center, 3);
    const plane = createPlane3DObject("p", "p", center, vector3(0, 0, 1));
    const scene: Geometry3DScene = { objects: [center, sphere, plane], constraints: [] };
    const measurements = measureGeometry3D(scene);

    expect(sphere.parents).toEqual(["O"]);
    expect(measurements.find((item) => item.label === "volume s")?.value).toBeCloseTo(113.097);
    expect(measurements.some((item) => item.kind === "section" && String(item.value).includes("circle"))).toBe(true);
  });

  it("solves exact 3D constraints through the shared kernel", () => {
    const a = createPoint3DObject("A", "A", 0, 0, -2);
    const b = createPoint3DObject("B", "B", 0, 0, 2);
    const target = createPoint3DObject("X", "X", 0, 0, 0);
    const line = createLine3DObject("line3:A:B", "l", a, b);
    const plane = createPlane3DObject("plane", "z=1", createPoint3DObject("P", "P", 0, 0, 1), vector3(0, 0, 1));
    const solved = solveGeometry3DScene({
      objects: [a, b, target, line, plane],
      constraints: [{ id: "hit", type: "line-plane-intersection", target: "X", line: "line3:A:B", plane: "plane" }],
    });

    const hit = solved.objects.find((object) => object.id === "X");
    expect(hit?.kind).toBe("point");
    if (hit?.kind === "point") expect(hit.point.z).toBeCloseTo(1);
  });

  it("snaps to points, objects, and 3D intersections", () => {
    const a = createPoint3DObject("A", "A", 0, 0, -2);
    const b = createPoint3DObject("B", "B", 0, 0, 2);
    const line = createLine3DObject("line", "line", a, b);
    const plane = createPlane3DObject("plane", "plane", createPoint3DObject("P", "P", 0, 0, 1), vector3(0, 0, 1));
    const scene: Geometry3DScene = { objects: [a, b, line, plane], constraints: [] };

    expect(snapPointToGeometry3D(point3(0.1, 0.1, -2.1), scene, { gridSize: 1 }).kind).toBe("point");
    expect(snapPointToGeometry3D(point3(0.1, 0.1, 1.1), scene, { gridSize: 1 }).kind).toBe("intersection");
    expect(allSceneIntersections3D(scene)).toHaveLength(1);
  });

  it("creates sections, transform handles, transforms objects, and generates loci", () => {
    const center = createPoint3DObject("O", "O", 1, 0, 0);
    const sphere = createSphere3DObject("s", "s", center, 2);
    const plane = createPlane3DObject("p", "p", createPoint3DObject("P", "P", 0, 0, 0), vector3(0, 0, 1));
    const sections = createSection3DObjects({ objects: [sphere, plane], constraints: [] });
    const handles = createGeometry3DTransformHandles("rotate");
    const rotated = transformGeometry3DObject(center, { type: "rotate", center: point3(0, 0, 0), axis: "z", degrees: 90 });
    const scaled = transformGeometry3DObject(sphere, { type: "scale", center: point3(0, 0, 0), factor: 2 });
    const locus = generateLocus3D("locus", "locus", center, { axis: "z", center: point3(0, 0, 0), radius: 2, samples: 16 });

    expect(sections).toHaveLength(1);
    expect(handles.map((handle) => handle.axis)).toEqual(["x", "y", "z"]);
    expect(rotated.kind).toBe("point");
    if (rotated.kind === "point") expect(rotated.point.y).toBeCloseTo(1);
    expect(scaled.kind).toBe("sphere");
    if (scaled.kind === "sphere") expect(scaled.object.radius).toBe(4);
    expect(locus.kind).toBe("locus");
    if (locus.kind === "locus") expect(locus.points).toHaveLength(17);
  });
});
