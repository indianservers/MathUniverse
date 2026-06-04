import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";

export type CasOperation = "simplify" | "factor" | "expand" | "solve" | "differentiate" | "integrate";

export type CasResult = {
  ok: boolean;
  output: string;
};

export function runCasOperation(input: string, operation: CasOperation): CasResult {
  const expression = input.trim();
  if (!expression) return { ok: false, output: "Enter an expression first." };
  const engine = nerdamer as unknown as {
    (value: string): {
      toString(): string;
      factor(): { toString(): string };
      expand(): { toString(): string };
    };
    solveEquations(value: string, variable: string): { toString(): string };
    diff(value: string, variable: string): { toString(): string };
    integrate(value: string, variable: string): { toString(): string };
  };

  try {
    if (operation === "solve") return { ok: true, output: engine.solveEquations(normalizeEquation(expression), "x").toString() };
    if (operation === "differentiate") return { ok: true, output: engine.diff(expression, "x").toString() };
    if (operation === "integrate") return { ok: true, output: engine.integrate(expression, "x").toString() };

    const parsed = engine(expression);
    if (operation === "factor") return { ok: true, output: parsed.factor().toString() };
    if (operation === "expand") return { ok: true, output: parsed.expand().toString() };
    return { ok: true, output: parsed.toString() };
  } catch (error) {
    return { ok: false, output: error instanceof Error ? error.message : "CAS could not process this expression." };
  }
}

function normalizeEquation(expression: string) {
  if (expression.includes("=")) return expression;
  return `${expression}=0`;
}
