import { describe, expect, it } from "vitest";
import { createObjectFromDefinition, evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";

describe("dynamic workspace engine", () => {
  it("creates canonical algebra rows for free and dependent 2D objects", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(3,4)", [a]);
    const line = createObjectFromDefinition("l=Line[A,B]", [a, b]);
    const result = evaluateDynamicWorkspace([a, b, line]);
    const algebraLine = result.algebra.find((row) => row.name === "l");

    expect(algebraLine?.free).toBe(false);
    expect(algebraLine?.parentIds).toEqual(expect.arrayContaining([a.id, b.id]));
    expect(result.objects.find((object) => object.label === "l")?.geometry?.type).toBe("line");
  });

  it("recomputes dependent objects when a parent point definition changes", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(3,4)", [a]);
    const segment = createObjectFromDefinition("s=Segment[A,B]", [a, b]);
    const movedB = { ...b, definition: { ...b.definition!, source: "B=(6,8)" } };
    const result = evaluateDynamicWorkspace([a, movedB, segment]);
    const recomputed = result.objects.find((object) => object.label === "s");

    expect(recomputed?.geometry?.type).toBe("segment");
    if (recomputed?.geometry?.type === "segment") {
      expect(recomputed.geometry.end.x).toBe(6);
      expect(recomputed.geometry.end.y).toBe(8);
    }
  });

  it("materializes graph and 3D definitions into canonical objects", () => {
    const graph = createObjectFromDefinition("f(x)=x^2+y^2=9");
    const sphere = createObjectFromDefinition("S=Sphere[(0,0,0), 3]");
    const result = evaluateDynamicWorkspace([graph, sphere]);

    expect(result.algebra.map((row) => row.name)).toEqual(expect.arrayContaining(["f", "S"]));
    expect(result.objects.find((object) => object.label === "f")?.metadata?.graphKind).toBe("implicit");
    expect(result.objects.find((object) => object.label === "S")?.dimension).toBe("3d");
  });
});
