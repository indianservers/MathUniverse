import { describe, expect, it } from "vitest";
import { createMathObject } from "./coreObjects";
import { buildRuntimeWorkspaceObjects } from "./workspaceRuntimeModel";

describe("workspace runtime model", () => {
  it("adds shared engine measurements behind authored workspace objects", () => {
    const a = createMathObject({ id: "A", label: "A", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 0, y: 0, z: 0 } } });
    const b = createMathObject({ id: "B", label: "B", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 3, y: 4, z: 0 } } });
    const segment = createMathObject({
      id: "s",
      label: "s",
      kind: "segment",
      dimension: "2d",
      geometry: { type: "segment", start: { x: 0, y: 0, z: 0 }, end: { x: 3, y: 4, z: 0 } },
    });

    const runtime = buildRuntimeWorkspaceObjects([a, b, segment]);
    const firstMeasurement = runtime.findIndex((object) => object.metadata?.source === "engine-measurement");

    expect(runtime.slice(0, 3).map((object) => object.id)).toEqual(expect.arrayContaining(["A", "B", "s"]));
    expect(firstMeasurement).toBeGreaterThan(2);
    expect(runtime.some((object) => object.role === "measurement" && object.value.includes("5"))).toBe(true);
  });

  it("recomputes measurements without retaining stale derived objects", () => {
    const segment = createMathObject({
      id: "s",
      label: "s",
      kind: "segment",
      dimension: "2d",
      geometry: { type: "segment", start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 4, z: 0 } },
    });
    const firstRuntime = buildRuntimeWorkspaceObjects([segment]);
    const nextSegment = { ...segment, geometry: { type: "segment" as const, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 6, z: 0 } } };
    const nextRuntime = buildRuntimeWorkspaceObjects([...firstRuntime, nextSegment]);
    const measurementValues = nextRuntime.filter((object) => object.metadata?.source === "engine-measurement").map((object) => object.value);

    expect(measurementValues.some((value) => value.includes("6"))).toBe(true);
    expect(measurementValues.some((value) => value.includes("4 unit"))).toBe(false);
  });

  it("adds 3D section and solid measurements at runtime", () => {
    const sphere = createMathObject({
      id: "sphere",
      label: "sphere",
      kind: "solid",
      dimension: "3d",
      geometry: { type: "sphere", center: { x: 0, y: 0, z: 0 }, radius: 2 },
    });
    const plane = createMathObject({
      id: "plane",
      label: "plane",
      kind: "plane",
      dimension: "3d",
      geometry: { type: "plane", point: { x: 0, y: 0, z: 1 }, normal: { x: 0, y: 0, z: 1 } },
    });

    const runtime = buildRuntimeWorkspaceObjects([sphere, plane]);

    expect(runtime.some((object) => object.metadata?.measurementKind === "volume")).toBe(true);
    expect(runtime.some((object) => object.value.includes("circle center"))).toBe(true);
  });
});
