import { describe, expect, it } from "vitest";
import {
  evaluateNotebookCellInState,
  evaluateNotebookCells,
  operationOptions,
  serializeCasNotebookMarkdown,
  type NotebookCell,
  type NotebookState,
} from "./casNotebookEngine";

function cell(id: string, input: string, operation: NotebookCell["operation"]): NotebookCell {
  return {
    id,
    input,
    operation,
    output: "",
    ok: false,
    detail: "",
    steps: [],
    createdAt: "test",
  };
}

describe("casNotebookEngine", () => {
  it("runs cells in worksheet order and resolves assignments plus answer references", () => {
    const cells = [
      cell("c3", "a*x + #2", "expand"),
      cell("c2", "x + 2", "simplify"),
      cell("c1", "a := 3", "simplify"),
    ];

    const evaluated = evaluateNotebookCells(cells, "x real", "exact");
    const assignment = evaluated.find((item) => item.id === "c1");
    const reference = evaluated.find((item) => item.id === "c3");

    expect(assignment?.output).toBe("a := 3");
    expect(reference?.resolvedInput).toContain("(3)*x");
    expect(reference?.resolvedInput).toContain("(2+x)");
    expect(reference?.dependencies).toContain("a := 3");
    expect(reference?.dependencies).toContain("In [2]");
    expect(reference?.output).toContain("x");
  });

  it("can evaluate one cell using earlier solved worksheet memory", () => {
    const firstRun = evaluateNotebookCells([
      cell("c2", "ans1 + 4", "simplify"),
      cell("c1", "2 + 3", "simplify"),
    ], "", "exact");

    const changed = firstRun.map((item) => (item.id === "c2" ? { ...item, input: "#1 * 2" } : item));
    const rerun = evaluateNotebookCellInState("c2", changed, "", "exact");
    const target = rerun.find((item) => item.id === "c2");

    expect(target?.resolvedInput).toBe("(5) * 2");
    expect(target?.output).toBe("10");
  });

  it("keeps numeric mode separate from exact mode", () => {
    const [evaluated] = evaluateNotebookCells([cell("c1", "sqrt(34)", "simplify")], "", "numeric");

    expect(evaluated.output).toBe("5.830952 -> 5.830952");
    expect(evaluated.exact).toBe("sqrt(34)");
    expect(evaluated.numeric).toBe("5.830952 -> 5.830952");
  });

  it("adds deeper matrix and list summaries", () => {
    const evaluated = evaluateNotebookCells([
      cell("list", "4, 6, 8, 10", "list"),
      cell("matrix", "[[1,2],[3,4]]", "matrix"),
    ], "", "exact");

    expect(evaluated.find((item) => item.id === "matrix")?.output).toContain("det=-2");
    expect(evaluated.find((item) => item.id === "matrix")?.steps.join(" ")).toContain("RREF");
    expect(evaluated.find((item) => item.id === "list")?.output).toContain("median=7");
    expect(evaluated.find((item) => item.id === "list")?.output).toContain("stdev=");
  });

  it("exposes stronger symbolic operations through notebook cells", () => {
    const evaluated = evaluateNotebookCells([
      cell("definite", "x^2, 0, 2, x", "definite-integral"),
      cell("tangent", "x^2, 3, x", "tangent-line"),
      cell("identity", "tan(x), sin(x)/cos(x), x", "verify-identity"),
    ], "", "exact");

    expect(operationOptions.map((item) => item.value)).toEqual(expect.arrayContaining(["definite-integral", "tangent-line", "verify-identity"]));
    expect(evaluated.find((item) => item.id === "definite")?.output).toBe("8/3");
    expect(evaluated.find((item) => item.id === "tangent")?.output).toBe("y = -9+6*x");
    expect(evaluated.find((item) => item.id === "identity")?.output).toBe("Identity verified");
    expect(evaluated.find((item) => item.id === "identity")?.steps.join(" ")).toContain("sample values were checked");
  });

  it("exports a markdown solution notebook", () => {
    const cells = evaluateNotebookCells([cell("c1", "x^2-5*x+6", "factor")], "x real", "exact");
    const markdown = serializeCasNotebookMarkdown({ cells, assumptions: "x real", mode: "exact" } satisfies NotebookState);

    expect(markdown).toContain("# CAS Notebook Export");
    expect(markdown).toContain("## In [1] factor");
    expect(markdown).toContain("Output:");
    expect(markdown).toContain("Steps:");
  });
});
