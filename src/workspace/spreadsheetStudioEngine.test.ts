import { describe, expect, it } from "vitest";
import { calculateLinearRegression, createDefaultSpreadsheetWorkbook, evaluateSpreadsheetWorkbook, extractFormulaReferences, parseDelimitedText } from "./spreadsheetStudioEngine";

describe("CAS Spreadsheet studio engine", () => {
  it("evaluates functions, absolute references, cross-sheet references, and dependencies", () => {
    const workbook = createDefaultSpreadsheetWorkbook();
    const evaluated = evaluateSpreadsheetWorkbook(workbook);

    expect(evaluated.values["dataset-1"][5][2]).toBe("7.34");
    expect(Number(evaluated.values.regression[4][1])).toBeGreaterThan(0.99);
    expect(evaluated.values.residuals[1][0]).toBe("-5.6");
    expect(extractFormulaReferences("=A2+$B$2+'Regression'!B3", "dataset-1", workbook)).toEqual(expect.arrayContaining(["dataset-1!A2", "dataset-1!B2", "regression!B3"]));
  });

  it("evaluates functions nested inside arithmetic and conditions", () => {
    const workbook = createDefaultSpreadsheetWorkbook();
    const evaluated = evaluateSpreadsheetWorkbook(workbook);

    expect(evaluated.values.residuals[1][3]).not.toMatch(/^#/);
    expect(evaluated.values.residuals[1][4]).toBe("No");
    expect(evaluated.values.residuals.slice(1, 6).flat()).not.toContain("#NAME?");
  });

  it("detects circular references", () => {
    const workbook = createDefaultSpreadsheetWorkbook();
    workbook.sheets[0].cells[10][0] = "=B11";
    workbook.sheets[0].cells[10][1] = "=A11";
    const evaluated = evaluateSpreadsheetWorkbook(workbook);
    expect(Object.values(evaluated.errors).some((error) => error.includes("Circular"))).toBe(true);
  });

  it("calculates verified regression values", () => {
    const regression = calculateLinearRegression([
      { row: 2, x: -4, y: -5.6 }, { row: 3, x: -2, y: -2.2 }, { row: 4, x: 0, y: 0.7 }, { row: 5, x: 2, y: 4.1 }, { row: 6, x: 4, y: 7.4 },
    ]);
    expect(regression.slope).toBeCloseTo(1.615, 3);
    expect(regression.intercept).toBeCloseTo(0.88, 2);
    expect(regression.r2).toBeGreaterThan(0.99);
  });

  it("parses CSV, TSV, and quoted values", () => {
    expect(parseDelimitedText('x,y,note\n1,2,"a,b"')[1]).toEqual(["1", "2", "a,b"]);
    expect(parseDelimitedText("x\ty\n1\t2")[1]).toEqual(["1", "2"]);
  });
});
