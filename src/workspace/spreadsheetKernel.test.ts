import { describe, expect, it } from "vitest";
import { cellName, evaluateSpreadsheetGrid, fillDownFormula, parseCellName, rangeToCsv } from "./spreadsheetKernel";

describe("spreadsheet kernel", () => {
  it("evaluates cell references and detects cycles", () => {
    const evaluated = evaluateSpreadsheetGrid([
      ["1", "2", "=A1+B1"],
      ["=C1*2", "=B2", ""],
    ]);

    expect(evaluated.values[0][2]).toBe("3");
    expect(evaluated.values[1][0]).toBe("6");
    expect(evaluated.errors.some((error) => error.message.includes("Circular"))).toBe(true);
  });

  it("fills formulas down with shifted references", () => {
    const grid = [["x", "y", ""], ["1", "2", "=A2+B2"], ["3", "4", ""]];
    const filled = fillDownFormula(grid, "C2", "C3:C3");
    const evaluated = evaluateSpreadsheetGrid(filled);

    expect(filled[2][2]).toBe("=A3+B3");
    expect(evaluated.values[2][2]).toBe("7");
  });

  it("parses cell names and exports ranges", () => {
    expect(cellName(0, 27)).toBe("AB1");
    expect(parseCellName("C4")).toEqual({ row: 3, column: 2 });
    expect(rangeToCsv([["a", "b"], ["1", "2"]], "A1:B2")).toContain("\"a\",\"b\"");
  });
});
