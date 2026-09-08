import { describe, expect, it } from "vitest";
import { conditionalCounts, INITIAL_STUDENTS, probabilityFraction, STUDENT_REGIONS, studentPositions, studentRegionAt, type StudentRegion } from "./conditionalProbabilityModel";
describe("conditional student model", () => {
  it("derives the target counts and both conditional directions", () => {
    expect(conditionalCounts(INITIAL_STUDENTS)).toMatchObject({ a: 10, both: 8, b: 8, neither: 14, A: 18, B: 16, total: 40, givenB: .5, givenA: 8 / 18 });
  });
  it("classifies a point in each drop region", () => {
    expect([studentRegionAt(75, 140), studentRegionAt(175, 140), studentRegionAt(280, 140), studentRegionAt(25, 30)]).toEqual(STUDENT_REGIONS);
  });
  it("fits all 40 distinct student positions in any single region", () => {
    for (const region of STUDENT_REGIONS) {
      const points = studentPositions(Array<StudentRegion>(40).fill(region));
      expect(new Set(points.map(p => `${p.x},${p.y}`)).size).toBe(40);
      for (const p of points) {
        expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
        expect(studentRegionAt(p.x, p.y)).toBe(region);
      }
    }
  });
  it("preserves total when a student changes membership", () => {
    const changed = [...INITIAL_STUDENTS]; changed[0] = "both";
    expect(conditionalCounts(changed)).toMatchObject({ total: 40, A: 18, B: 17, both: 9, givenB: 9 / 17 });
  });
  it("handles impossible conditioning and all-student overlap", () => {
    expect(conditionalCounts(Array<StudentRegion>(40).fill("neither"))).toMatchObject({ givenA: null, givenB: null });
    expect(conditionalCounts(Array<StudentRegion>(40).fill("both"))).toMatchObject({ givenA: 1, givenB: 1 });
    expect(probabilityFraction(8, 16)).toBe("1/2");
    expect(probabilityFraction(0, 16)).toBe("0/1");
    expect(probabilityFraction(0, 0)).toBe("Undefined");
  });
});
