import { describe, expect, it } from "vitest";
import { shapesExplorerPathFromSolidMode } from "./geometryLabUx";

describe("geometry solids redirect", () => {
  it("sends cylinder mode to Shapes Explorer", () => {
    expect(shapesExplorerPathFromSolidMode("Cylinders")).toBe("/shapes?shape=cylinder");
    expect(shapesExplorerPathFromSolidMode("cones")).toBe("/shapes?shape=cone");
    expect(shapesExplorerPathFromSolidMode(null)).toBe("/shapes");
  });
});
