import { describe, expect, it } from "vitest";
import { binarySearchSteps, bubbleSortFrames, euclidSteps, mergeSortFrames } from "./algorithmMath";

describe("algorithm math", () => {
  it("sorts with bubble and merge", () => {
    const data = [4, 1, 3, 2];
    expect(bubbleSortFrames(data).at(-1)?.arr).toEqual([1, 2, 3, 4]);
    expect(mergeSortFrames(data).at(-1)?.arr).toEqual([1, 2, 3, 4]);
  });

  it("counts Euclid steps and finds a binary hit", () => {
    expect(euclidSteps(84, 60).gcd).toBe(12);
    expect(euclidSteps(84, 60).count).toBeGreaterThan(1);
    expect(binarySearchSteps([1, 4, 7, 9], 7).steps.some((s) => s.note.includes("Found"))).toBe(true);
  });
});
