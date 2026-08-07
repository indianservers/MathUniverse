import { useEffect, useMemo, useState } from "react";
import { evaluateSpreadsheetGrid, fillDownFormula, type SpreadsheetGrid } from "../../../workspace/spreadsheetKernel";
import { createSpreadsheetWorkspaceObjects } from "../../../workspace/dataWorkspaceIntegration";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const initialGrid: SpreadsheetGrid = [
  ["x", "y", "change"],
  ["1", "3", "=B2-A2"],
  ["2", "5", "=B3-A3"],
  ["3", "8", "=B4-A4"],
  ["4", "12", "=B5-A5"],
];

function spreadsheetGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("data entry")) return ["Data Entry Grid", "Use clear headings and one value per cell.", "Unlabelled data is hard to trust."];
  if (name.includes("cell formulas")) return ["Cell Formulas", "Start formulas with equals.", "Check the computed result."];
  if (name.includes("fill") || name.includes("copy")) return ["Fill and Copy", "Copy formulas and inspect references.", "References may change."];
  if (name.includes("relative references")) return ["Relative References", "Plain references adjust when copied.", "Use them when row patterns should move."];
  if (name.includes("absolute references")) return ["Absolute References", "Dollar signs keep cells fixed.", "Use them for constants."];
  if (name === "sorting") return ["Sorting", "Sort the whole table together.", "Do not separate row data."];
  if (name === "filtering") return ["Filtering", "Show rows matching a condition.", "Filtering hides, not deletes."];
  if (name.includes("lists from cells")) return ["Lists from Cells", "Preserve order and data type.", "Do not mix labels into numeric lists."];
  if (name.includes("points from columns")) return ["Points from Columns", "Pair x and y by matching rows.", "Do not mismatch rows."];
  if (name.includes("matrices from cells")) return ["Matrices from Cells", "Select a rectangular range.", "Matrix shape matters."];
  if (name.includes("frequency tables")) return ["Frequency Tables", "Count each value once.", "Use clear categories."];
  if (name.includes("summary statistics")) return ["Summary Statistics", "Use centre and spread together.", "One number may not describe all data."];
  if (name.includes("spreadsheet charts")) return ["Spreadsheet Charts", "Match chart type to the data.", "Use bars for categories and scatter plots for paired numbers."];
  if (name.includes("regression from data")) return ["Regression from Data", "Fit a model only after plotting paired data.", "Check residuals before trusting predictions."];
  if (name.includes("dynamic cell links")) return ["Dynamic Cell Links", "Link outputs to the correct source range.", "Changing a source cell should update the output."];
  if (name.includes("import csv")) return ["Import CSV", "Check the delimiter, headings, and data types.", "Wrong separators shift columns."];
  if (name.includes("export data")) return ["Export Data", "Export the intended range with headings.", "Labels make shared data readable."];
  return ["Spreadsheet", "Keep cells labelled and formulas checked.", "Ranges and references matter."];
}

export default function SpreadsheetLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [grid, setGrid] = useState<SpreadsheetGrid>(() => initialGrid.map((row) => [...row]));
  useEffect(() => setGrid(initialGrid.map((row) => [...row])), [resetToken]);
  const evaluated = useMemo(() => evaluateSpreadsheetGrid(grid), [grid]);
  const linked = useMemo(() => createSpreadsheetWorkspaceObjects(grid, { id: `lesson-sheet-${lesson.id}`, range: "A2:C5" }), [grid, lesson.id]);
  const numericY = evaluated.values.slice(1).map((row) => Number(row[1])).filter(Number.isFinite);
  const max = Math.max(...numericY, 1);
  const guidance = spreadsheetGuidanceFor(lesson.title);
  const edit = (row: number, column: number, value: string) => {
    setGrid((current) => current.map((items, r) => items.map((cell, c) => r === row && c === column ? value : cell)));
    onInteraction();
  };
  const fill = () => {
    setGrid((current) => fillDownFormula(current, "C2", "C2:C5"));
    onInteraction();
  };

  return (
    <AdapterFrame title={`${lesson.title} - linked sheet`} value={linked.objects[1]?.value} footer="Editable cells are evaluated by the spreadsheet kernel and published to the shared data workspace object model.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-12 bg-slate-100 p-2 dark:bg-white/10" />
                {["A", "B", "C"].map((name) => <th key={name} className="bg-slate-100 p-2 font-black dark:bg-white/10">{name}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th className="bg-slate-100 p-2 dark:bg-white/10">{rowIndex + 1}</th>
                  {row.map((cell, columnIndex) => (
                    <td key={columnIndex} className="border border-slate-200 p-1 dark:border-white/10">
                      <input
                        value={cell}
                        onChange={(event) => edit(rowIndex, columnIndex, event.target.value)}
                        className="min-h-10 w-full min-w-28 rounded-md bg-transparent px-2 font-mono outline-none focus:bg-cyan-50 dark:focus:bg-cyan-400/10"
                        aria-label={`Cell ${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`}
                      />
                      {cell.startsWith("=") ? <span className="block px-2 text-[10px] font-bold text-emerald-600">= {evaluated.values[rowIndex]?.[columnIndex]}</span> : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <div className="flex h-40 items-end gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900" aria-label="Chart linked to column B">
            {numericY.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-bold">{value}</span>
                <div className="w-full rounded-t bg-cyan-500" style={{ height: `${Math.max(5, value / max * 105)}px` }} />
              </div>
            ))}
          </div>
          <button type="button" className="action-secondary w-full justify-center" onClick={fill}>Fill formula down</button>
          <div className="rounded-xl bg-slate-100 p-3 text-xs dark:bg-white/10">
            <strong>{linked.objects.length} linked objects</strong>
            <p className="mt-1 text-slate-500 dark:text-slate-300">{evaluated.errors.length ? evaluated.errors.map((error) => `${error.cell}: ${error.message}`).join(" - ") : "All formulas valid"}</p>
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}
