import { describe, expect, it } from "vitest";
import {
  angleBisectorCheck,
  compareFractions,
  integerOperation,
  mean,
  median,
  mode,
  percentValue,
  perpendicularBisectorCheck,
  profitLoss,
  simpleInterest,
  solveSimpleEquation,
  substituteLinearExpression,
  triangleInequality,
} from "./grade7ManipulativeUtils";

describe("Grade 7 manipulative utilities", () => {
  it("solves integer and equation operations", () => {
    expect(integerOperation(-3, 7, "add")).toBe(4);
    expect(integerOperation(-3, 7, "multiply")).toBe(-21);
    expect(solveSimpleEquation(3, 2, 11)).toBe(3);
  });

  it("checks rational, percent, and algebra calculations", () => {
    expect(compareFractions({ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 4 }).comparison).toBe("less");
    expect(percentValue(800, 15)).toBe(120);
    expect(profitLoss(200, 250).type).toBe("profit");
    expect(simpleInterest(1000, 10, 2)).toBe(200);
    expect(substituteLinearExpression(2, 3, 4)).toBe(11);
  });

  it("computes data handling summaries", () => {
    expect(mean([4, 6, 8])).toBe(6);
    expect(median([8, 4, 6])).toBe(6);
    expect(mode([2, 3, 3, 4])).toEqual([3]);
  });

  it("validates construction conditions", () => {
    expect(perpendicularBisectorCheck(100, 300, 200).ok).toBe(true);
    expect(angleBisectorCheck(35, 35.5).ok).toBe(true);
    expect(triangleInequality(3, 4, 5)).toBe(true);
    expect(triangleInequality(1, 2, 5)).toBe(false);
  });
});
