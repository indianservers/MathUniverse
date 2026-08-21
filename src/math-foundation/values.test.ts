import { describe, expect, it } from "vitest";
import { evaluateMath } from "./evaluator";
import { parseMath } from "./parser";
import { normalizeFraction } from "./values";

const evaluate = (source: string) => { const ast = parseMath(source).ast; if (!ast) throw new Error("parse failed"); return evaluateMath(ast); };
describe("typed mathematical values", () => {
  it("preserves exact rational arithmetic", () => expect(evaluate("1/3 + 1/6")).toMatchObject({ status: "EXACT", exactForm: "1/2" }));
  it("preserves exact complex arithmetic", () => expect(evaluate("(2 + 3i) + (4 - i)")).toMatchObject({ status: "EXACT", exactForm: "6 + 2i" }));
  it("distinguishes division by zero", () => expect(evaluate("1/0")).toMatchObject({ status: "UNDEFINED", diagnostics: [{ code: "DIVISION_BY_ZERO" }] }));
  it("normalizes rational signs and common factors", () => expect(normalizeFraction(12n, -18n)).toEqual({ numerator: -2n, denominator: 3n }));
  it("returns typed matrix dimension diagnostics", () => expect(evaluate("[[1,2]]*[[1,2]]").diagnostics).toMatchObject([{ code: "INVALID_MATRIX_DIMENSIONS" }]));
});
