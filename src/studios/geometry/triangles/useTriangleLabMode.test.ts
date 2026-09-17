import { describe, expect, it } from "vitest";
import { parseTriangleMode } from "./useTriangleLabMode";

describe("parseTriangleMode", () => {
  it("maps canonical ids, labels, and aliases to five modes", () => {
    expect(parseTriangleMode(null)).toBe("explorer");
    expect(parseTriangleMode("explorer")).toBe("explorer");
    expect(parseTriangleMode("Triangle Explorer")).toBe("explorer");
    expect(parseTriangleMode("Congruence")).toBe("congruence");
    expect(parseTriangleMode("similar")).toBe("similarity");
    expect(parseTriangleMode("centre")).toBe("centers");
    expect(parseTriangleMode("triangle inequality")).toBe("inequalities");
  });
});
