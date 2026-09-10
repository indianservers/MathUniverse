import { describe, expect, it } from "vitest";
import {
  TRIGONOMETRIC_PRESETS_120,
  isTrigonometricPracticeCorrect120,
  solveTrigonometricEquation120,
  trigonometricAngleText120,
  trigonometricValue120,
} from "./trigonometricEquationsLesson120Model";

describe("trigonometricEquationsLesson120Model", () => {
  it("finds both sine solutions and their quadrants", () => {
    const result = solveTrigonometricEquation120(TRIGONOMETRIC_PRESETS_120[0]);
    expect(result.first).toBe(30);
    expect(result.second).toBe(150);
    expect(result.value).toBeCloseTo(0.5, 10);
    expect(result.quadrants).toEqual([1, 2]);
  });

  it("finds both cosine solutions and their quadrants", () => {
    const result = solveTrigonometricEquation120(TRIGONOMETRIC_PRESETS_120[1]);
    expect(result.first).toBe(60);
    expect(result.second).toBe(300);
    expect(result.quadrants).toEqual([1, 4]);
  });

  it("evaluates linked circle and wave values from the same angle", () => {
    expect(trigonometricValue120("sin", 45)).toBeCloseTo(Math.SQRT1_2, 10);
    expect(trigonometricValue120("cos", 60)).toBeCloseTo(0.5, 10);
  });

  it("formats known degree solutions as exact radian multiples", () => {
    expect(trigonometricAngleText120(30, true)).toBe("π/6");
    expect(trigonometricAngleText120(150, true)).toBe("5π/6");
    expect(trigonometricAngleText120(360, true)).toBe("2π");
  });

  it("grades both quick-practice solutions in either order", () => {
    expect(isTrigonometricPracticeCorrect120(60, 300)).toBe(true);
    expect(isTrigonometricPracticeCorrect120(300, 60)).toBe(true);
    expect(isTrigonometricPracticeCorrect120(60, 120)).toBe(false);
  });
});
