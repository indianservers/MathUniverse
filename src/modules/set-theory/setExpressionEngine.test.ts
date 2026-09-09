import { describe, expect, it } from "vitest";
import { evaluateSetExpression, expressionSteps, parseSetExpression, type ExpressionToken } from "./setExpressionEngine";

const set = (value: string): ExpressionToken => ({ kind: "set", value });
const op = (value: "union" | "intersection" | "difference" | "symmetric-difference"): ExpressionToken => ({ kind: "operator", value });

describe("set expression engine", () => {
  const sets = { A: ["1", "2"], B: ["2", "3"], C: ["2", "4"] };
  const universe = ["1", "2", "3", "4", "5"];
  it("honours intersection precedence over union", () => {
    const tree = parseSetExpression([set("A"), op("union"), set("B"), op("intersection"), set("C")]);
    expect(evaluateSetExpression(tree, sets, universe)).toEqual(["1", "2"]);
  });
  it("evaluates grouped difference and exposes intermediate steps", () => {
    const tree = parseSetExpression([{ kind: "left" }, set("A"), op("union"), set("B"), { kind: "right" }, op("intersection"), set("C")]);
    expect(evaluateSetExpression(tree, sets, universe)).toEqual(["2"]);
    expect(expressionSteps(tree, sets, universe)).toHaveLength(2);
  });
  it("rejects incomplete and unbalanced expressions", () => {
    expect(() => parseSetExpression([set("A"), op("union")])).toThrow();
    expect(() => parseSetExpression([{ kind: "left" }, set("A"), op("union"), set("B")])).toThrow(/closing parenthesis/);
  });
});
