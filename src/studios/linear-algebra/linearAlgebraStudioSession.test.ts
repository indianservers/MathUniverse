import { describe, expect, it } from "vitest";
import { continueLinearHref, LINEAR_SEARCH_ALIASES } from "./linearAlgebraStudioSession";
import { classifySystem, composeNamed, det2, multiply, parallel2 } from "./linearAlgebraLabMath";

describe("linear algebra studio session", () => {
  it("resumes the last mode on continue", () => {
    expect(continueLinearHref({
      lastRoute: "/linear-algebra/vectors",
      lastMode: "Dot",
      lastLabel: "Vectors",
      completed: ["vectors"],
      xp: 10,
      theme: "light",
      darkCanvas: false,
      boardMode: false,
      teacherMode: false,
      hintDismissed: false,
      levelFilter: "All",
    })).toContain("mode=Dot");
    expect(LINEAR_SEARCH_ALIASES["λ"]?.id).toBe("eigenvectors");
    expect(LINEAR_SEARCH_ALIASES.rref?.id).toBe("row-reduction");
  });
});

describe("linear algebra lab math", () => {
  it("multiplies, detects incompatibility, and classifies systems", () => {
    expect(multiply([[1, 2], [3, 4]], [[1], [0]])).toEqual([[1], [3]]);
    expect(multiply([[1, 2]], [[1]])).toBeNull();
    expect(classifySystem([[1, 0], [0, 1]], [2, 3]).kind).toBe("unique");
    expect(classifySystem([[1, 2], [2, 4]], [3, 7]).kind).toBe("inconsistent");
    expect(det2(composeNamed(["I", "R90"]))).toBe(1);
    expect(parallel2([1, 0], [2, 0])).toBe(true);
  });
});
