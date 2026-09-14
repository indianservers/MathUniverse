import { describe, expect, it } from "vitest";
import { defaultConstruction, descendantsOf, evaluate } from "./constructionEngine";

describe("constructionEngine", () => {
  it("builds a Thales circle from a diameter", () => {
    const world = evaluate([
      { id: "A", kind: "freePoint", label: "A", parents: [], visible: true, locked: false, constructed: true, params: { x: -2, y: 0 } },
      { id: "B", kind: "freePoint", label: "B", parents: [], visible: true, locked: false, constructed: true, params: { x: 2, y: 0 } },
      { id: "c", kind: "circleDiameter", label: "c", parents: ["A", "B"], visible: true, locked: false, constructed: true },
    ]);

    expect(world.c.circle?.center).toEqual({ x: 0, y: 0 });
    expect(world.c.circle?.r).toBeCloseTo(2);
  });

  it("updates dependent midpoint, bisector, and circle when a free point moves", () => {
    const objects = defaultConstruction();
    const before = evaluate(objects);
    expect(before.O.point).toEqual({ x: 0, y: 0 });
    expect(before.C.point?.x).toBeCloseTo(0);
    expect(before.C.point?.y).toBeCloseTo(2);
    expect(before.CA.polygon && before.CB.polygon).toBeTruthy();
    const moved = objects.map((o) => o.id === "A" ? { ...o, params: { x: -4, y: 0 } } : o);
    const after = evaluate(moved);
    expect(after.O.point).toEqual({ x: -1, y: 0 });
    expect(after.c1.circle?.r).toBeCloseTo(3);
    expect(after.C.point?.x).toBeCloseTo(-1);
    expect(Math.abs(after.C.point!.y)).toBeCloseTo(3);
  });

  it("marks an intersection undefined when parents no longer meet", () => {
    const world = evaluate([
      { id: "A", kind: "freePoint", label: "A", parents: [], visible: true, locked: false, constructed: true, params: { x: 0, y: 0 } },
      { id: "B", kind: "freePoint", label: "B", parents: [], visible: true, locked: false, constructed: true, params: { x: 1, y: 0 } },
      { id: "C", kind: "freePoint", label: "C", parents: [], visible: true, locked: false, constructed: true, params: { x: 0, y: 1 } },
      { id: "D", kind: "freePoint", label: "D", parents: [], visible: true, locked: false, constructed: true, params: { x: 1, y: 1 } },
      { id: "l1", kind: "line", label: "l1", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "l2", kind: "line", label: "l2", parents: ["C", "D"], visible: true, locked: false, constructed: true },
      { id: "X", kind: "intersection", label: "X", parents: ["l1", "l2"], visible: true, locked: false, constructed: true, params: { index: 0 } },
    ]);
    expect(world.X.point).toBeNull();
    expect(world.X.undefinedReason).toMatch(/intersect/i);
  });

  it("lists descendants so deleting a parent can warn", () => {
    expect(descendantsOf(defaultConstruction(), "AB")).toEqual(expect.arrayContaining([]));
    expect(descendantsOf(defaultConstruction(), "A").length).toBeGreaterThan(0);
  });
});
