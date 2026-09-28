import { describe, expect, it } from "vitest";
import { parseSimpleInterest, formatInterestValue } from "./simpleInterest";
import { solveProblem } from "./problemSolverEngine";

describe("simple interest solver", () => {
  it("uses the same parsed amounts in the engine and visual", () => {
    const input = "Simple interest principal 5000 rate 8 time 2 years";
    const finance = parseSimpleInterest(input);
    const result = solveProblem(input).result;
    expect(finance).toMatchObject({ principal: 5000, rate: 8, time: 2, interest: 800, amount: 5800, currency: null });
    expect(result.result).toBe("Interest = 800, Amount = 5,800");
    expect(result.verification).toHaveLength(2);
  });

  it("parses grouped amounts and preserves explicit currency", () => {
    const finance = parseSimpleInterest("Simple interest principal ₹12,500 rate 7.5 time 2 years");
    expect(finance).toMatchObject({ principal: 12500, rate: 7.5, time: 2, interest: 1875, amount: 14375, currency: "INR" });
    expect(formatInterestValue(finance!.amount, finance!.currency)).toBe("₹14,375");
    expect(solveProblem("Simple interest principal ₹12,500 rate 7.5 time 2 years").result.result).toBe("Interest = ₹1,875, Amount = ₹14,375");
  });

  it("rejects missing values and invalid durations", () => {
    expect(parseSimpleInterest("Simple interest principal 1000 rate 8")).toBeNull();
    expect(parseSimpleInterest("Simple interest principal 1000 rate 8 time -2 years")).toBeNull();
  });

  it("accepts values stated before their labels", () => {
    expect(parseSimpleInterest("Simple interest 5000 principal 8 rate 2 years")?.interest).toBe(800);
  });
});
