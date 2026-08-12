import ExcelJS from "exceljs";
import { emptySheet, type SpreadsheetStudioWorkbook } from "./spreadsheetStudioEngine";

export async function spreadsheetWorkbookToXlsx(workbook: SpreadsheetStudioWorkbook): Promise<ArrayBuffer> {
  const book = new ExcelJS.Workbook();
  workbook.sheets.forEach((sheet) => {
    const worksheet = book.addWorksheet(safeSheetName(sheet.name));
    sheet.cells.forEach((row) => worksheet.addRow(row.map((value) => value.startsWith("=") ? { formula: value.slice(1) } : value)));
  });
  return book.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

export async function spreadsheetWorkbookFromXlsx(data: ArrayBuffer, name = "Imported workbook"): Promise<SpreadsheetStudioWorkbook> {
  const source = new ExcelJS.Workbook();
  await source.xlsx.load(data);
  const sheets = source.worksheets.map((sourceSheet, index) => {
    const values: string[][] = [];
    sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      values[rowNumber - 1] = [];
      row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
        const formula = typeof cell.value === "object" && cell.value && "formula" in cell.value ? String(cell.value.formula) : null;
        values[rowNumber - 1][columnNumber - 1] = formula ? `=${formula}` : String(cell.text ?? "");
      });
    });
    const rows = Math.max(values.length, 20);
    const columns = Math.max(8, ...values.map((row) => row.length));
    const sheet = emptySheet(`xlsx-${index}-${Date.now()}`, sourceSheet.name, rows, columns);
    values.forEach((row, rowIndex) => row.forEach((value, columnIndex) => { sheet.cells[rowIndex][columnIndex] = String(value ?? ""); }));
    return sheet;
  });
  if (!sheets.length) throw new Error("Workbook has no sheets");
  return {
    id: `xlsx-${Date.now()}`,
    name,
    sheets,
    activeSheetId: sheets[0].id,
    namedRanges: {},
    updatedAt: Date.now(),
  };
}

function safeSheetName(name: string) {
  return (name.replace(/[\\/?*[\]:]/g, " ").trim() || "Sheet").slice(0, 31);
}
