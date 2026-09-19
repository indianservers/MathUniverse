import { describe, expect, it } from "vitest";
import { embedSceneFromGeometryConstruction, embedSceneFromGraphFunctions, embedSceneFromPortable } from "./fromWorkspace";

describe("workspace to embed scene", () => {
  it("turns graph functions and a view into twodgraph objects", () => {
    const scene = embedSceneFromGraphFunctions(
      [{ id: "a", input: "x^2", color: "#2563eb", visible: true, label: "parabola" }],
      { xMin: -4, xMax: 4, yMin: -1, yMax: 8 },
    );
    expect(scene.kind).toBe("twodgraph");
    expect(scene.objects[0]?.expression).toBe("x^2");
    expect(scene.view.xmin).toBe(-4);
  });

  it("turns geometry points and segments into coordinates", () => {
    const scene = embedSceneFromGeometryConstruction({
      construction: {
        points: [{ id: "A", x: 0, y: 0, label: "A" }, { id: "B", x: 4, y: 0, label: "B" }],
        lines: [{ id: "ab", a: "A", b: "B" }],
        circles: [],
        polygons: [],
      },
      camera: { x: -1, y: -1, width: 10, height: 8 },
    });
    expect(scene.kind).toBe("twodgeometry");
    expect(scene.objects.some((item) => item.type === "segment" && item.x2 === 4)).toBe(true);
  });

  it("maps portable 3d-graph surfaces", () => {
    const scene = embedSceneFromPortable("3d-graph", { surfaces: [{ id: "s", expression: "x^2 + y^2", visible: true }], xRange: 2, yRange: 2 }, "saddle");
    expect(scene?.kind).toBe("threedgraph");
    expect(scene?.objects[0]?.expression).toBe("x^2 + y^2");
  });

  it("maps portable 2d-graph plots from a workspace snapshot", () => {
    const scene = embedSceneFromPortable("2d-graph", {
      workspaceSnapshot: { plots: [{ id: "p1", expression: "sin(x)", color: "#db2777", visible: true, name: "sine" }] },
      view: { xMin: -3, xMax: 3, yMin: -1, yMax: 1 },
    });
    expect(scene?.kind).toBe("twodgraph");
    expect(scene?.objects[0]?.expression).toBe("sin(x)");
    expect(scene?.view.xmax).toBe(3);
  });

  it("does not embed CAS notebooks", () => {
    expect(embedSceneFromPortable("cas", {})).toBeNull();
  });
});
