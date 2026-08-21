import { describe, expect, it } from "vitest";
import { collectSymbols, parseMath, serializeAst } from "./parser";

describe("universal math parser", () => {
  it("respects precedence, right-associative powers, and source metadata", () => {
    const result = parseMath("1 + 2 * 3^2");
    expect(result.diagnostics).toEqual([]);
    expect(result.ast).toMatchObject({ type: "BINARY_OPERATION", operator: "+", right: { type: "BINARY_OPERATION", operator: "*", right: { type: "BINARY_OPERATION", operator: "^" } }, sourceRange: { start: 0, end: 11 }, validation: "VALID" });
  });
  it.each(["a = 2", "f(x) = x^2 + a", "[1,2,3]", "[[1,2],[3,4]]", "(a, f(a))", "x <= 2"])("parses %s", (source) => expect(parseMath(source).diagnostics).toEqual([]));
  it("collects function dependencies without parameters", () => { const ast = parseMath("f(x)=x^2+b").ast; expect(ast?.type).toBe("DEFINITION"); if (ast?.type === "DEFINITION") expect(collectSymbols(ast.expression, new Set(ast.parameters))).toEqual(["b"]); });
  it("returns deterministic syntax diagnostics", () => expect(parseMath("1 + )").diagnostics.map((entry) => entry.code)).toContain("EXPECTED_EXPRESSION"));
  it("serializes the complete AST deterministically", () => { const ast = parseMath("f(x)=x^2+1").ast!; const serialized = serializeAst(ast); expect(serialized).toContain('"expression"'); expect(serialized).toContain('"operator":"^"'); expect(serializeAst(ast)).toBe(serialized); });
});
