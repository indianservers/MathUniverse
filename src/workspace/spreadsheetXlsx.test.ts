import { describe, expect, it } from "vitest";
import { createDefaultSpreadsheetWorkbook } from "./spreadsheetStudioEngine";
import { spreadsheetWorkbookFromXlsx, spreadsheetWorkbookToXlsx } from "./spreadsheetXlsx";

describe("spreadsheetXlsx", () => {
  it("round-trips all default workbook sheets through a readable XLSX file", async () => {
    const source = createDefaultSpreadsheetWorkbook();
    const file = await spreadsheetWorkbookToXlsx(source);
    const restored = await spreadsheetWorkbookFromXlsx(file, "Round trip");

    expect(file.byteLength).toBeGreaterThan(1_000);
    expect(restored.sheets.map((sheet) => sheet.name)).toEqual(source.sheets.map((sheet) => sheet.name));
    expect(restored.sheets[0].cells[0].slice(0, 5)).toEqual(source.sheets[0].cells[0].slice(0, 5));
    expect(restored.sheets[0].cells[1][2]).toContain("FORECAST");
  });
});
