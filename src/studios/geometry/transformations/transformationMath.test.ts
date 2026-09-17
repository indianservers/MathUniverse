import { describe, expect, it } from "vitest";
import { applyTransform, distance, isIsometry, rotate } from "./transformationMath";

describe("transformation math", () => {
  it("sends (1,0) to (-1,0) under 180° rotation about the origin", () => {
    const image = rotate({ x: 1, y: 0 }, { x: 0, y: 0 }, 180);
    expect(image.x).toBeCloseTo(-1);
    expect(image.y).toBeCloseTo(0);
  });

  it("preserves distance for isometries and not for a non-unit dilation", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 2, y: 0 };
    const t = { x: 1, y: 0 };
    const ta = applyTransform("Translate", a, t, 0, 1, { x: 0, y: 0 });
    const tb = applyTransform("Translate", b, t, 0, 1, { x: 0, y: 0 });
    expect(distance(ta, tb)).toBeCloseTo(distance(a, b));
    expect(isIsometry("Dilate", 2)).toBe(false);
  });
});
