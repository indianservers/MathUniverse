import { describe, expect, it } from "vitest";
import { createGraph3DSurface, migrateGraph3DSurfaces } from "./graph3dSurfaceModel";

describe("3D graph surface model", () => {
  it("creates independent editable surface styles", () => {
    const first = createGraph3DSurface("x+y", 0);
    const second = createGraph3DSurface("x-y", 1);
    expect(first.id).not.toBe(second.id);
    expect(first.colorLow).not.toBe(second.colorLow);
    expect(second.expression).toBe("x-y");
  });

  it("migrates the legacy primary and secondary state", () => {
    const surfaces = migrateGraph3DSurfaces({ expression: "x^2", secondaryExpression: "y^2", secondaryVisible: true, opacity: 0.6, palette: "thermal" });
    expect(surfaces).toHaveLength(2);
    expect(surfaces[0]).toMatchObject({ expression: "x^2", opacity: 0.6, palette: "thermal" });
    expect(surfaces[1].expression).toBe("y^2");
  });

  it("preserves an unlimited surface collection", () => {
    const source = Array.from({ length: 12 }, (_, index) => createGraph3DSurface(`x+${index}`, index));
    expect(migrateGraph3DSurfaces({ surfaces: source })).toHaveLength(12);
  });
});
