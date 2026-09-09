import { describe, expect, it } from "vitest";
import { createMathObject, normalizeMathObject } from "./coreObjects";

describe("canonical math object hardening", () => {
  it("repairs non-finite geometry before it reaches canvas or WebGL engines", () => {
    const object = createMathObject({
      id: "unsafe-sphere",
      label: "Unsafe sphere",
      kind: "solid",
      dimension: "3d",
      geometry: {
        type: "sphere",
        center: { x: Number.NaN, y: Number.POSITIVE_INFINITY, z: 4 },
        radius: -3,
      },
      style: { strokeWidth: Number.POSITIVE_INFINITY },
    });

    expect(object.geometry).toEqual({ type: "sphere", center: { x: 0, y: 0, z: 4 }, radius: 3 });
    expect(object.style?.strokeWidth).toBe(2);
  });

  it("repairs zero plane normals and orders graph surface domains", () => {
    const plane = normalizeMathObject({
      ...createMathObject({ id: "plane", label: "Plane", kind: "plane" }),
      geometry: { type: "plane", point: { x: 1, y: 2, z: 3 }, normal: { x: 0, y: 0, z: 0 } },
    });
    const surface = createMathObject({
      id: "surface",
      label: "Surface",
      kind: "surface",
      geometry: { type: "surface", expression: "  sin(x)  ", domain: { u: [5, -5], v: [Number.NaN, 2] } },
    });

    expect(plane.geometry).toMatchObject({ type: "plane", normal: { x: 0, y: 0, z: 1 } });
    expect(surface.geometry).toMatchObject({ type: "surface", expression: "sin(x)", domain: { u: [-5, 5], v: [-10, 2] } });
  });
});
