import { describe, expect, it } from "vitest";
import { createMathObject } from "./coreObjects";
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

  it("uses the newest value for duplicate ids and reports the repair", () => {
    const oldPoint = createObjectFromDefinition("A=(1,1)");
    const newPoint = { ...createObjectFromDefinition("A=(8,9)"), id: oldPoint.id };
    const result = evaluateDynamicWorkspace([oldPoint, newPoint]);

    expect(result.objects).toHaveLength(1);
    expect(result.objects[0].geometry).toMatchObject({ type: "point", position: { x: 8, y: 9 } });
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ severity: "warning", message: expect.stringContaining("Duplicate object id") }));
  });

  it("blocks circular and missing dependencies instead of computing misleading fallback geometry", () => {
    const first = createMathObject({
      id: "first",
      label: "first",
      kind: "line",
      dimension: "2d",
      definition: { source: "first=Line[second,missing]", parentIds: ["second", "missing"] },
      dependencies: [{ id: "second", label: "second", role: "parent" }],
    });
    const second = createMathObject({
      id: "second",
      label: "second",
      kind: "line",
      dimension: "2d",
      definition: { source: "second=Line[first,missing]", parentIds: ["first", "missing"] },
      dependencies: [{ id: "first", label: "first", role: "parent" }],
    });
    const result = evaluateDynamicWorkspace([first, second]);

    expect(result.objects.every((object) => object.status === "error")).toBe(true);
    expect(result.diagnostics.filter((diagnostic) => diagnostic.message === "Circular dependency detected.")).toHaveLength(2);
  });

  it("reports unresolved command references even when legacy metadata omitted parent ids", () => {
    const line = createMathObject({
      id: "line",
      label: "line",
      kind: "line",
      dimension: "2d",
      definition: { source: "line=Line[A,B]", parentIds: [] },
    });
    const result = evaluateDynamicWorkspace([line]);

    expect(result.objects[0].status).toBe("error");
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ message: "Missing dependencies: A, B." }));
  });
});
