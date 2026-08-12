import {
  AlignCenter, AlignLeft, AlignRight, ArrowDownToLine, ArrowUpFromLine, BarChart3, Bold, BookOpen, Braces, Calculator, ChartScatter, Check, ChevronDown,
  CircleUserRound, Clipboard, ClipboardCopy, Copy, Download, Expand, Eye, FileDown, FileSpreadsheet, Filter, FolderInput,
  FunctionSquare, Grid3X3, Highlighter, Italic, Link2, ListFilter, Maximize2, Menu, Minus, PanelRightClose, PanelRightOpen,
  Plus, Redo2, RotateCcw, Save, Search, Settings, Share2, Sigma, SlidersHorizontal, SortAsc, SortDesc, Table2, Trash2,
  Underline, Undo2, Upload, Wand2, WrapText, X, type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  calculateLinearRegression,
  calculateSpreadsheetStatistics,
  createDefaultSpreadsheetWorkbook,
  emptySheet,
  evaluateSpreadsheetWorkbook,
  extractFormulaReferences,
  parseDelimitedText,
  serializeWorkbook,
  type SpreadsheetCellStyle,
  type SpreadsheetValidationRule,
  type SpreadsheetRegression,
  type SpreadsheetStudioSheet,
  type SpreadsheetStudioWorkbook,
} from "../../workspace/spreadsheetStudioEngine";
import { cellName, parseCellName, rangeToCsv } from "../../workspace/spreadsheetKernel";
import { createMathWorkspacePayload } from "../../workspace/mathWorkspaces";
import { spreadsheetWorkbookFromXlsx, spreadsheetWorkbookToXlsx } from "../../workspace/spreadsheetXlsx";
import { readWorkspaceTransfer, saveWorkspaceTransfer } from "../../workspace/workspaceTransfer";

type RibbonTab = "Home" | "Insert" | "Data" | "Formulas" | "Analysis" | "View";
type InspectorTab = "Insights" | "Properties" | "Objects";
type Selection = { anchor: string; focus: string };
type HistoryEntry = { workbook: SpreadsheetStudioWorkbook; label: string };
type RibbonCommand = { id: string; label: string; icon: LucideIcon; disabled?: boolean; group: string };
type DialogKind = "find" | "validation" | "sort" | "named-range" | "functions" | "export" | null;

const STORAGE_KEY = "math-universe-cas-spreadsheet-v1";
const referenceColors = ["#2563eb", "#16a34a", "#ea580c", "#9333ea"];
const visibleColumns = 8;

const ribbonCommands: Record<RibbonTab, RibbonCommand[]> = {
  Home: [
    { id: "cut", label: "Cut", icon: Clipboard, group: "Clipboard" }, { id: "copy", label: "Copy", icon: Copy, group: "Clipboard" }, { id: "paste", label: "Paste", icon: ClipboardCopy, group: "Clipboard" },
    { id: "undo", label: "Undo", icon: Undo2, group: "History" }, { id: "redo", label: "Redo", icon: Redo2, group: "History" },
    { id: "add-row", label: "Add row", icon: Plus, group: "Cells" }, { id: "add-column", label: "Add column", icon: Plus, group: "Cells" }, { id: "delete-row", label: "Delete row", icon: Trash2, group: "Cells" }, { id: "delete-column", label: "Delete column", icon: Trash2, group: "Cells" },
    { id: "bold", label: "Bold", icon: Bold, group: "Format" }, { id: "italic", label: "Italic", icon: Italic, group: "Format" }, { id: "underline", label: "Underline", icon: Underline, group: "Format" },
    { id: "text-color", label: "Text colour", icon: Highlighter, group: "Format" }, { id: "fill-color", label: "Fill colour", icon: Highlighter, group: "Format" },
    { id: "align-left", label: "Align left", icon: AlignLeft, group: "Alignment" }, { id: "align-center", label: "Align centre", icon: AlignCenter, group: "Alignment" }, { id: "align-right", label: "Align right", icon: AlignRight, group: "Alignment" }, { id: "wrap", label: "Wrap text", icon: WrapText, group: "Alignment" },
    { id: "number", label: "Number format", icon: Calculator, group: "Number" }, { id: "decimals", label: "Decimal places", icon: SlidersHorizontal, group: "Number" }, { id: "clear-format", label: "Clear formatting", icon: RotateCcw, group: "Number" },
    { id: "merge", label: "Merge", icon: Grid3X3, group: "Cells" }, { id: "border", label: "Borders", icon: Grid3X3, group: "Format" },
  ],
  Insert: [
    { id: "add-row", label: "Row", icon: Plus, group: "Cells" }, { id: "add-column", label: "Column", icon: Plus, group: "Cells" }, { id: "add-sheet", label: "Sheet", icon: FileSpreadsheet, group: "Cells" },
    { id: "table", label: "Table", icon: Table2, group: "Objects" }, { id: "chart", label: "Chart", icon: BarChart3, group: "Objects" }, { id: "scatter", label: "Scatter plot", icon: ChartScatter, group: "Objects" },
    { id: "function", label: "Function", icon: FunctionSquare, group: "Math" }, { id: "formula", label: "Formula", icon: Sigma, group: "Math" }, { id: "named-range", label: "Named range", icon: Link2, group: "Math" },
    { id: "comment", label: "Comment", icon: BookOpen, group: "Cell" }, { id: "checkbox", label: "Checkbox", icon: Check, group: "Cell" }, { id: "slider", label: "Slider", icon: SlidersHorizontal, group: "Cell" },
    { id: "linked-object", label: "Linked object", icon: Braces, group: "Math" },
  ],
  Data: [
    { id: "import-csv", label: "Import CSV", icon: FolderInput, group: "Import" }, { id: "import-xlsx", label: "Import workbook", icon: Upload, group: "Import" }, { id: "paste-dataset", label: "Paste dataset", icon: ClipboardCopy, group: "Import" },
    { id: "sort-asc", label: "Sort ascending", icon: SortAsc, group: "Sort & Filter" }, { id: "sort-desc", label: "Sort descending", icon: SortDesc, group: "Sort & Filter" }, { id: "multi-sort", label: "Multi-column sort", icon: ListFilter, group: "Sort & Filter" }, { id: "filter", label: "Filter", icon: Filter, group: "Sort & Filter" },
    { id: "dedupe", label: "Remove duplicates", icon: Trash2, group: "Clean" }, { id: "find", label: "Find and replace", icon: Search, group: "Clean" }, { id: "missing", label: "Missing values", icon: Wand2, group: "Clean" },
    { id: "split", label: "Split column", icon: Grid3X3, group: "Clean" }, { id: "validation", label: "Data validation", icon: Check, group: "Clean" }, { id: "text-columns", label: "Text to columns", icon: Table2, group: "Clean" }, { id: "refresh", label: "Refresh linked data", icon: RotateCcw, group: "Import" },
  ],
  Formulas: [
    { id: "function", label: "Insert function", icon: FunctionSquare, group: "Library" }, { id: "function-library", label: "Function library", icon: BookOpen, group: "Library" }, { id: "named-range", label: "Named ranges", icon: Link2, group: "Library" },
    { id: "recalculate", label: "Recalculate", icon: Calculator, group: "Calculate" }, { id: "calculation-mode", label: "Calculation mode", icon: Settings, group: "Calculate" }, { id: "show-formulas", label: "Show formulas", icon: Eye, group: "Audit" },
    { id: "trace-precedents", label: "Trace precedents", icon: Link2, group: "Audit" }, { id: "trace-dependents", label: "Trace dependents", icon: Link2, group: "Audit" }, { id: "error-check", label: "Error checking", icon: Check, group: "Audit" },
    { id: "cas", label: "CAS functions", icon: Sigma, group: "Math" }, { id: "matrix", label: "Matrix functions", icon: Grid3X3, group: "Math" }, { id: "statistics", label: "Statistical functions", icon: BarChart3, group: "Math" },
  ],
  Analysis: [
    { id: "statistics", label: "Descriptive statistics", icon: BarChart3, group: "Statistics" }, { id: "correlation", label: "Correlation", icon: Link2, group: "Statistics" }, { id: "covariance", label: "Covariance", icon: Grid3X3, group: "Statistics" },
    { id: "linear-regression", label: "Linear regression", icon: ChartScatter, group: "Regression" }, { id: "polynomial-regression", label: "Polynomial regression", icon: ChartScatter, group: "Regression", disabled: true }, { id: "exponential-regression", label: "Exponential regression", icon: ChartScatter, group: "Regression", disabled: true }, { id: "logistic-regression", label: "Logistic regression", icon: ChartScatter, group: "Regression", disabled: true },
    { id: "residuals", label: "Residual analysis", icon: BarChart3, group: "Regression" }, { id: "forecast", label: "Forecasting", icon: Wand2, group: "Regression" },
    { id: "plot", label: "Plot data", icon: ChartScatter, group: "Workspaces" }, { id: "cas", label: "Analyse in CAS", icon: Sigma, group: "Workspaces" },
    { id: "hypothesis", label: "Hypothesis testing", icon: Calculator, group: "Advanced", disabled: true }, { id: "confidence", label: "Confidence intervals", icon: BarChart3, group: "Advanced", disabled: true }, { id: "distribution", label: "Distribution analysis", icon: BarChart3, group: "Advanced", disabled: true },
  ],
  View: [
    { id: "freeze-rows", label: "Freeze rows", icon: Grid3X3, group: "Panes" }, { id: "freeze-columns", label: "Freeze columns", icon: Grid3X3, group: "Panes" }, { id: "gridlines", label: "Gridlines", icon: Grid3X3, group: "Display" },
    { id: "show-formulas", label: "Formula display", icon: Eye, group: "Display" }, { id: "compact", label: "Compact mode", icon: Minus, group: "Display" }, { id: "fullscreen", label: "Full screen", icon: Maximize2, group: "Window" },
    { id: "zoom", label: "Zoom", icon: SlidersHorizontal, group: "Window" }, { id: "inspector", label: "Show inspector", icon: PanelRightOpen, group: "Window" }, { id: "objects", label: "Object panel", icon: Braces, group: "Window" }, { id: "dependency-arrows", label: "Dependency arrows", icon: Link2, group: "Display" },
  ],
};

export default function CasSpreadsheetStudio({ legacyGrid, onLegacyGridChange }: { legacyGrid: string[][]; onLegacyGridChange: (grid: string[][]) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const routePayload = (location.state as { mathWorkspacePayload?: ReturnType<typeof createMathWorkspacePayload> } | null)?.mathWorkspacePayload;
  const incomingPayloadRef = useRef(routePayload ?? readWorkspaceTransfer("spreadsheet"));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [workbook, setWorkbook] = useState<SpreadsheetStudioWorkbook>(() => readWorkbook() ?? createDefaultSpreadsheetWorkbook());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const [ribbonTab, setRibbonTab] = useState<RibbonTab>("Home");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("Insights");
  const [selection, setSelection] = useState<Selection>({ anchor: "C6", focus: "C6" });
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [formulaDraft, setFormulaDraft] = useState("");
  const [internalClipboard, setInternalClipboard] = useState("");
  const [status, setStatus] = useState("Ready");
  const [showInspector, setShowInspector] = useState(() => typeof window === "undefined" || window.innerWidth > 760);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showDependencies, setShowDependencies] = useState(true);
  const [compact, setCompact] = useState(false);
  const [freezeRows, setFreezeRows] = useState(true);
  const [freezeColumns, setFreezeColumns] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [selectedObjectId, setSelectedObjectId] = useState("dataset");
  const [renaming, setRenaming] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [replaceQuery, setReplaceQuery] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [validationType, setValidationType] = useState<SpreadsheetValidationRule["type"]>("number");
  const [validationValues, setValidationValues] = useState("Yes,No");
  const [secondarySortColumn, setSecondarySortColumn] = useState(1);
  const [nameBoxDraft, setNameBoxDraft] = useState(selection.focus);
  const [calculationMode, setCalculationMode] = useState<"automatic" | "manual">("automatic");
  const [formulaExpanded, setFormulaExpanded] = useState(false);

  const activeSheet = workbook.sheets.find((sheet) => sheet.id === workbook.activeSheetId) ?? workbook.sheets[0];
  const evaluation = useMemo(() => evaluateSpreadsheetWorkbook(workbook), [workbook]);
  const activeValues = evaluation.values[activeSheet.id] ?? activeSheet.cells;
  const selectedRef = parseCellName(selection.focus) ?? { row: 0, column: 0 };
  const selectedRaw = activeSheet.cells[selectedRef.row]?.[selectedRef.column] ?? "";
  const selectedValue = activeValues[selectedRef.row]?.[selectedRef.column] ?? "";
  const selectedKey = `${activeSheet.id}!${selection.focus}`;
  const formulaReferences = useMemo(() => selectedRaw.startsWith("=") ? extractFormulaReferences(selectedRaw, activeSheet.id, workbook) : [], [activeSheet.id, selectedRaw, workbook]);
  const points = useMemo(() => activeValues.slice(1).flatMap((row, index) => {
    if (row[0] === "" || row[1] === "") return [];
    const point = { row: index + 2, x: Number(row[0]), y: Number(row[1]) };
    return Number.isFinite(point.x) && Number.isFinite(point.y) ? [point] : [];
  }), [activeValues]);
  const regression = useMemo(() => calculateLinearRegression(points), [points]);
  const selectionValues = useMemo(() => valuesForSelection(activeValues, selection), [activeValues, selection]);
  const selectionStats = useMemo(() => calculateSpreadsheetStatistics(selectionValues), [selectionValues]);
  const visibleRows = useMemo(() => activeSheet.cells.map((_, index) => index).filter((index) => !filterActive || index === 0 || activeValues[index]?.some((value) => value !== "")), [activeSheet.cells, activeValues, filterActive]);
  const workbookObjects = useMemo(() => [
    { id: "dataset", name: "Dataset 1", type: "Imported dataset", detail: `${points.length} data rows`, visible: true },
    { id: "regression", name: "Linear regression", type: "Linked model", detail: regression.equation, visible: true },
    { id: "chart", name: "Regression preview", type: "Scatter chart", detail: `${points.length} points`, visible: true },
    ...Object.entries(workbook.namedRanges).map(([name, detail]) => ({ id: `range-${name}`, name, type: "Named range", detail, visible: true })),
  ], [points.length, regression.equation, workbook.namedRanges]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, serializeWorkbook(workbook));
      onLegacyGridChange(activeSheet.id === "dataset-1" ? activeSheet.cells : legacyGrid);
      setStatus("Saved");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activeSheet.cells, activeSheet.id, legacyGrid, onLegacyGridChange, workbook]);

  useEffect(() => setFormulaDraft(selectedRaw), [selectedRaw, selection.focus]);
  useEffect(() => setNameBoxDraft(selection.anchor === selection.focus ? selection.focus : `${selection.anchor}:${selection.focus}`), [selection]);

  useEffect(() => {
    const payload = incomingPayloadRef.current;
    if (!payload) return;
    incomingPayloadRef.current = null;
    setSelection({ anchor: "A1", focus: "A1" });
    setWorkbook((current) => {
      const sheet = cloneSheet(current.sheets.find((item) => item.id === current.activeSheetId) ?? current.sheets[0]);
      sheet.cells[0][0] = payload.value;
      return { ...current, sheets: current.sheets.map((item) => item.id === sheet.id ? sheet : item), updatedAt: Date.now() };
    });
    setStatus(`Inserted ${payload.label} into A1`);
  }, []);

  const commitWorkbook = useCallback((next: SpreadsheetStudioWorkbook, label: string) => {
    setHistory((current) => [...current.slice(-39), { workbook, label }]);
    setFuture([]);
    setWorkbook({ ...next, updatedAt: Date.now() });
    setStatus("Calculating");
  }, [workbook]);

  const patchActiveSheet = useCallback((patcher: (sheet: SpreadsheetStudioSheet) => SpreadsheetStudioSheet, label: string) => {
    commitWorkbook({ ...workbook, sheets: workbook.sheets.map((sheet) => sheet.id === activeSheet.id ? patcher(cloneSheet(sheet)) : sheet) }, label);
  }, [activeSheet.id, commitWorkbook, workbook]);

  const updateCell = useCallback((address: string, value: string, label = `Edit ${address}`) => {
    const ref = parseCellName(address);
    if (!ref || activeSheet.protected) return;
    patchActiveSheet((sheet) => {
      ensureGridSize(sheet.cells, ref.row + 1, ref.column + 1);
      sheet.cells[ref.row][ref.column] = value;
      return sheet;
    }, label);
  }, [activeSheet.protected, patchActiveSheet]);

  const confirmFormula = () => {
    updateCell(selection.focus, formulaDraft);
    setEditingCell(null);
    setStatus("Ready");
  };

  const cancelFormula = () => { setFormulaDraft(selectedRaw); setEditingCell(null); setStatus("Ready"); };
  const selectCell = (address: string, event?: MouseEvent) => {
    setSelection((current) => event?.shiftKey ? { ...current, focus: address } : { anchor: address, focus: address });
    setStatus("Ready");
  };

  const undo = useCallback(() => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((current) => [{ workbook, label: previous.label }, ...current]);
    setHistory((current) => current.slice(0, -1));
    setWorkbook(previous.workbook);
    setStatus(`Undo: ${previous.label}`);
  }, [history, workbook]);

  const redo = useCallback(() => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, { workbook, label: next.label }]);
    setFuture((current) => current.slice(1));
    setWorkbook(next.workbook);
    setStatus(`Redo: ${next.label}`);
  }, [future, workbook]);

  const copySelection = useCallback(async (cut = false) => {
    const range = selectionBounds(selection);
    const text = activeSheet.cells.slice(range.start.row, range.end.row + 1).map((row) => row.slice(range.start.column, range.end.column + 1).join("\t")).join("\n");
    setInternalClipboard(text);
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    if (cut) patchActiveSheet((sheet) => { forEachSelectionCell(selection, (address, row, column) => { sheet.cells[row][column] = ""; delete sheet.styles[address]; }); return sheet; }, `Cut ${selectionLabel(selection)}`);
    setStatus(cut ? "Cut" : "Copied");
  }, [activeSheet.cells, patchActiveSheet, selection]);

  const pasteSelection = useCallback(async () => {
    const text = await navigator.clipboard?.readText().catch(() => internalClipboard) || internalClipboard;
    if (!text) return;
    const rows = parseDelimitedText(text, text.includes("\t") ? "\t" : undefined);
    const start = parseCellName(selection.focus);
    if (!start) return;
    patchActiveSheet((sheet) => {
      ensureGridSize(sheet.cells, start.row + rows.length, start.column + Math.max(...rows.map((row) => row.length), 1));
      rows.forEach((row, rowOffset) => row.forEach((value, columnOffset) => { sheet.cells[start.row + rowOffset][start.column + columnOffset] = value; }));
      return sheet;
    }, `Paste into ${selection.focus}`);
  }, [internalClipboard, patchActiveSheet, selection.focus]);

  const applyStyle = (patch: Partial<SpreadsheetCellStyle>, label: string) => patchActiveSheet((sheet) => {
    forEachSelectionCell(selection, (address) => { sheet.styles[address] = { ...(sheet.styles[address] ?? {}), ...patch }; });
    return sheet;
  }, label);

  const clearSelection = () => patchActiveSheet((sheet) => { forEachSelectionCell(selection, (_address, row, column) => { sheet.cells[row][column] = ""; }); return sheet; }, `Clear ${selectionLabel(selection)}`);
  const selectAll = () => setSelection({ anchor: "A1", focus: `${columnName(Math.max(activeSheet.cells[0]?.length ?? visibleColumns, 1) - 1)}${activeSheet.cells.length}` });
  const goToRange = () => {
    const [anchor, focus = anchor] = nameBoxDraft.toUpperCase().replace(/\s/g, "").split(":");
    if (!parseCellName(anchor) || !parseCellName(focus)) { setStatus("Enter a valid cell or range"); return; }
    setSelection({ anchor, focus }); setStatus(`Selected ${anchor === focus ? anchor : `${anchor}:${focus}`}`);
  };

  const mergeSelection = () => patchActiveSheet((sheet) => {
    const label = selectionLabel(selection); const ranges = new Set(sheet.mergedRanges ?? []);
    if (ranges.has(label)) ranges.delete(label); else ranges.add(label);
    sheet.mergedRanges = [...ranges];
    forEachSelectionCell(selection, (address) => { sheet.styles[address] = { ...(sheet.styles[address] ?? {}), merged: ranges.has(label) }; });
    return sheet;
  }, "Toggle merged range");

  const applyBorder = () => applyStyle({ border: (activeSheet.styles[selection.focus]?.border ?? "none") === "all" ? "none" : "all" }, "Toggle cell borders");

  const fillSelection = () => {
    const source = activeSheet.cells[selectedRef.row]?.[selectedRef.column] ?? "";
    patchActiveSheet((sheet) => { forEachSelectionCell(selection, (_address, row, column) => { sheet.cells[row][column] = source; }); return sheet; }, `Fill ${selectionLabel(selection)}`);
  };

  const replaceMatches = (all: boolean) => {
    if (!replaceQuery) return;
    patchActiveSheet((sheet) => {
      let replaced = 0;
      sheet.cells.forEach((row) => row.forEach((value, column) => {
        if ((all || replaced === 0) && value.toLowerCase().includes(replaceQuery.toLowerCase())) { row[column] = value.replace(new RegExp(escapeRegExp(replaceQuery), "gi"), replaceValue); replaced += 1; }
      }));
      setStatus(`${replaced} replacement${replaced === 1 ? "" : "s"}`);
      return sheet;
    }, all ? "Replace all" : "Replace next");
  };

  const applyValidation = () => patchActiveSheet((sheet) => {
    sheet.validations ??= {};
    const rule: SpreadsheetValidationRule = { type: validationType, values: validationType === "list" ? validationValues.split(",").map((value) => value.trim()).filter(Boolean) : undefined };
    forEachSelectionCell(selection, (address) => { sheet.validations![address] = rule; });
    return sheet;
  }, `Validate ${selectionLabel(selection)}`);

  const splitColumn = () => patchActiveSheet((sheet) => {
    ensureGridSize(sheet.cells, sheet.cells.length, selectedRef.column + 2);
    sheet.cells.forEach((row, index) => { if (index === 0) return; const parts = String(row[selectedRef.column] ?? "").split(/[\s,;|]+/); row[selectedRef.column] = parts.shift() ?? ""; row[selectedRef.column + 1] = parts.join(" "); });
    return sheet;
  }, "Split column");

  const multiSort = () => patchActiveSheet((sheet) => {
    const [header, ...rows] = sheet.cells;
    rows.sort((left, right) => compareValues(left[selectedRef.column], right[selectedRef.column]) || compareValues(left[secondarySortColumn], right[secondarySortColumn]));
    sheet.cells = [header, ...rows]; return sheet;
  }, "Multi-column sort");

  const addRow = () => patchActiveSheet((sheet) => { sheet.cells.splice(selectedRef.row + 1, 0, Array.from({ length: Math.max(visibleColumns, sheet.cells[0]?.length ?? 0) }, () => "")); return sheet; }, "Add row");
  const addColumn = () => patchActiveSheet((sheet) => { sheet.cells.forEach((row) => row.splice(selectedRef.column + 1, 0, "")); return sheet; }, "Add column");
  const deleteRow = () => patchActiveSheet((sheet) => { if (sheet.cells.length > 1) sheet.cells.splice(selectedRef.row, 1); return sheet; }, "Delete row");
  const deleteColumn = () => patchActiveSheet((sheet) => { if ((sheet.cells[0]?.length ?? 0) > 1) sheet.cells.forEach((row) => row.splice(selectedRef.column, 1)); return sheet; }, "Delete column");

  const addSheet = () => {
    const id = `sheet-${Date.now()}`;
    commitWorkbook({ ...workbook, sheets: [...workbook.sheets, emptySheet(id, `Sheet ${workbook.sheets.length + 1}`)], activeSheetId: id }, "Add sheet");
    setSelection({ anchor: "A1", focus: "A1" });
  };

  const duplicateSheet = () => {
    const id = `${activeSheet.id}-copy-${Date.now()}`;
    const copy = { ...cloneSheet(activeSheet), id, name: `${activeSheet.name} Copy` };
    commitWorkbook({ ...workbook, sheets: [...workbook.sheets, copy], activeSheetId: id }, "Duplicate sheet");
  };

  const deleteSheet = () => {
    if (workbook.sheets.length <= 1) return;
    const remaining = workbook.sheets.filter((sheet) => sheet.id !== activeSheet.id);
    commitWorkbook({ ...workbook, sheets: remaining, activeSheetId: remaining[0].id }, "Delete sheet");
  };

  const sortData = (direction: "asc" | "desc") => patchActiveSheet((sheet) => {
    const [header, ...rows] = sheet.cells;
    rows.sort((left, right) => compareValues(left[selectedRef.column], right[selectedRef.column]) * (direction === "asc" ? 1 : -1));
    sheet.cells = [header, ...rows];
    return sheet;
  }, `Sort ${direction}`);

  const removeDuplicates = () => patchActiveSheet((sheet) => {
    const [header, ...rows] = sheet.cells;
    const seen = new Set<string>();
    sheet.cells = [header, ...rows.filter((row) => { const key = JSON.stringify(row); if (seen.has(key)) return false; seen.add(key); return true; })];
    return sheet;
  }, "Remove duplicates");

  const fillMissing = () => patchActiveSheet((sheet) => {
    for (let row = 1; row < sheet.cells.length; row += 1) if (!sheet.cells[row][selectedRef.column]) sheet.cells[row][selectedRef.column] = "0";
    return sheet;
  }, "Fill missing values");

  const openInCas = () => {
    const value = selectedRaw.startsWith("=") ? selectedRaw.slice(1) : selectedValue || regression.equation.replace(/^y = /, "");
    const payload = createMathWorkspacePayload({ sourceWorkspace: "cas", objectType: "expression", label: `${activeSheet.name} ${selection.focus}`, value, metadata: { source: "spreadsheet", sheet: activeSheet.name, cell: selection.focus } });
    saveWorkspaceTransfer(payload, "cas");
    navigate("/workspace/data", { state: { mathWorkspacePayload: payload } });
  };

  const openInGraphs = () => {
    const payload = createMathWorkspacePayload({ sourceWorkspace: "cas", objectType: "expression", label: "Spreadsheet regression", value: `${regression.slope}*x${regression.intercept >= 0 ? "+" : ""}${regression.intercept}`, metadata: { source: "spreadsheet", points: JSON.stringify(points), r2: regression.r2 } });
    saveWorkspaceTransfer(payload, "graphs");
    navigate("/workspace/graph", { state: { mathWorkspacePayload: payload } });
  };

  const importFile = async (file?: File) => {
    if (!file) return;
    if (/\.json$/i.test(file.name)) {
      try { const imported = JSON.parse(await file.text()) as SpreadsheetStudioWorkbook; if (!imported.sheets?.length) throw new Error(); commitWorkbook(imported, `Import ${file.name}`); setStatus(`Imported ${imported.sheets.length} sheets`); }
      catch { setStatus("Invalid workbook file"); }
      return;
    }
    if (/\.xlsx$/i.test(file.name)) {
      try {
        const imported = await spreadsheetWorkbookFromXlsx(await file.arrayBuffer(), file.name.replace(/\.xlsx$/i, ""));
        commitWorkbook(imported, `Import ${file.name}`);
        setStatus(`Imported ${imported.sheets.length} Excel sheets`);
      } catch { setStatus("Could not read this Excel workbook"); }
      return;
    }
    if (!/\.(csv|tsv|txt)$/i.test(file.name)) { setStatus("Unsupported import. Use XLSX, JSON, CSV or TSV."); return; }
    const text = await file.text();
    const rows = parseDelimitedText(text);
    if (!rows.length) { setStatus("Import contained no rows."); return; }
    patchActiveSheet((sheet) => { ensureGridSize(rows, Math.max(rows.length, 20), Math.max(...rows.map((row) => row.length), visibleColumns)); sheet.cells = rows; return sheet; }, `Import ${file.name}`);
    setStatus(`Imported ${rows.length} rows`);
  };

  const exportWorkbook = () => downloadFile(`${fileSlug(workbook.name)}.json`, serializeWorkbook(workbook), "application/json");
  const exportXlsx = async () => downloadFile(`${fileSlug(workbook.name)}.xlsx`, await spreadsheetWorkbookToXlsx(workbook), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const exportCsv = () => downloadFile(`${fileSlug(activeSheet.name)}.csv`, rangeToCsv(activeValues, `A1:${columnName(Math.max(...activeValues.map((row) => row.length), 1) - 1)}${activeValues.length}`), "text/csv");
  const exportTsv = () => downloadFile(`${fileSlug(activeSheet.name)}.tsv`, activeValues.map((row) => row.join("\t")).join("\n"), "text/tab-separated-values");
  const printSheet = () => { window.print(); setStatus("Print dialog opened"); };
  const share = async () => { await navigator.clipboard?.writeText(window.location.href); setStatus("Link copied"); };

  const runCommand = async (id: string) => {
    const selectedStyle = activeSheet.styles[selection.focus] ?? {};
    switch (id) {
      case "cut": await copySelection(true); break;
      case "copy": await copySelection(false); break;
      case "paste": await pasteSelection(); break;
      case "undo": undo(); break;
      case "redo": redo(); break;
      case "add-row": addRow(); break;
      case "add-column": addColumn(); break;
      case "delete-row": deleteRow(); break;
      case "delete-column": deleteColumn(); break;
      case "bold": applyStyle({ bold: !selectedStyle.bold }, "Toggle bold"); break;
      case "italic": applyStyle({ italic: !selectedStyle.italic }, "Toggle italic"); break;
      case "underline": applyStyle({ underline: !selectedStyle.underline }, "Toggle underline"); break;
      case "text-color": applyStyle({ textColor: selectedStyle.textColor === "#7c3aed" ? "#0f172a" : "#7c3aed" }, "Text colour"); break;
      case "fill-color": applyStyle({ fillColor: selectedStyle.fillColor === "#cffafe" ? "#ffffff" : "#cffafe" }, "Fill colour"); break;
      case "align-left": applyStyle({ align: "left" }, "Align left"); break;
      case "align-center": applyStyle({ align: "center" }, "Align centre"); break;
      case "align-right": applyStyle({ align: "right" }, "Align right"); break;
      case "wrap": applyStyle({ wrap: !selectedStyle.wrap }, "Wrap text"); break;
      case "number": applyStyle({ numberFormat: nextNumberFormat(selectedStyle.numberFormat) }, "Number format"); break;
      case "decimals": applyStyle({ decimals: ((selectedStyle.decimals ?? 2) + 1) % 5 }, "Decimal places"); break;
      case "clear-format": patchActiveSheet((sheet) => { delete sheet.styles[selection.focus]; return sheet; }, "Clear formatting"); break;
      case "merge": mergeSelection(); break;
      case "border": applyBorder(); break;
      case "add-sheet": addSheet(); break;
      case "table": setSelectedObjectId("dataset"); setInspectorTab("Objects"); setShowInspector(true); break;
      case "chart": case "scatter": setInspectorTab("Insights"); setShowInspector(true); break;
      case "function": setFormulaDraft("=SUM("); setEditingCell(selection.focus); break;
      case "formula": setFormulaDraft("="); setEditingCell(selection.focus); break;
      case "named-range": setDialog("named-range"); break;
      case "comment": setInspectorTab("Properties"); setShowInspector(true); patchActiveSheet((sheet) => { sheet.comments[selection.focus] = sheet.comments[selection.focus] || "Add a note in Properties."; return sheet; }, "Add comment"); break;
      case "checkbox": updateCell(selection.focus, selectedValue === "TRUE" ? "FALSE" : "TRUE", "Toggle checkbox"); break;
      case "slider": updateCell(selection.focus, "0", "Insert slider value"); break;
      case "linked-object": openInCas(); break;
      case "import-csv": fileInputRef.current?.click(); break;
      case "import-xlsx": fileInputRef.current?.click(); break;
      case "paste-dataset": await pasteSelection(); break;
      case "sort-asc": sortData("asc"); break;
      case "sort-desc": sortData("desc"); break;
      case "multi-sort": setDialog("sort"); break;
      case "filter": setFilterActive((value) => !value); break;
      case "dedupe": removeDuplicates(); break;
      case "find": setDialog("find"); break;
      case "missing": fillMissing(); break;
      case "split": case "text-columns": splitColumn(); break;
      case "validation": setDialog("validation"); break;
      case "refresh": case "recalculate": setWorkbook((current) => ({ ...current, updatedAt: Date.now() })); setStatus("Recalculated"); break;
      case "function-library": setDialog("functions"); break;
      case "show-formulas": setShowFormulas((value) => !value); break;
      case "trace-precedents": setShowDependencies(true); setInspectorTab("Properties"); break;
      case "trace-dependents": setShowDependencies(true); setInspectorTab("Properties"); break;
      case "error-check": setStatus(Object.keys(evaluation.errors).length ? `${Object.keys(evaluation.errors).length} formula errors` : "No formula errors"); break;
      case "cas": openInCas(); break;
      case "matrix": setFormulaDraft("=MMULT(A1:B2,D1:E2)"); setEditingCell(selection.focus); break;
      case "statistics": case "correlation": case "covariance": setInspectorTab("Insights"); setShowInspector(true); break;
      case "linear-regression": setInspectorTab("Insights"); setSelectedObjectId("regression"); setShowInspector(true); break;
      case "residuals": setWorkbook((current) => ({ ...current, activeSheetId: "residuals" })); break;
      case "forecast": setFormulaDraft(`=FORECAST(${selection.focus},$B$2:$B$6,$A$2:$A$6)`); setEditingCell(selection.focus); break;
      case "plot": openInGraphs(); break;
      case "freeze-rows": setFreezeRows((value) => !value); break;
      case "freeze-columns": setFreezeColumns((value) => !value); break;
      case "gridlines": setShowGridlines((value) => !value); break;
      case "compact": setCompact((value) => !value); break;
      case "fullscreen": if (document.fullscreenElement) await document.exitFullscreen(); else await shellRef.current?.requestFullscreen(); break;
      case "zoom": setZoom((value) => value >= 140 ? 80 : value + 10); break;
      case "inspector": setShowInspector((value) => !value); break;
      case "objects": setInspectorTab("Objects"); setShowInspector(true); break;
      case "dependency-arrows": setShowDependencies((value) => !value); break;
      case "calculation-mode": setCalculationMode((mode) => { const next = mode === "automatic" ? "manual" : "automatic"; setStatus(`${next[0].toUpperCase() + next.slice(1)} calculation mode`); return next; }); break;
    }
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (editingCell) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") { event.preventDefault(); void copySelection(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") { event.preventDefault(); void pasteSelection(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") { event.preventDefault(); setSearchOpen(true); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") { event.preventDefault(); selectAll(); return; }
    if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); clearSelection(); return; }
    if (event.key === "F2") { event.preventDefault(); setEditingCell(selection.focus); return; }
    if (event.key === "Enter") { event.preventDefault(); moveSelection(event.shiftKey ? -1 : 1, 0); return; }
    if (event.key === "Tab") { event.preventDefault(); moveSelection(0, event.shiftKey ? -1 : 1); return; }
    const moves: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Home: [0, -selectedRef.column], End: [0, visibleColumns - 1 - selectedRef.column] };
    if (moves[event.key]) { event.preventDefault(); if (event.shiftKey) extendSelection(...moves[event.key]); else moveSelection(...moves[event.key]); }
  };

  const moveSelection = (rowDelta: number, columnDelta: number) => {
    const row = Math.max(0, Math.min(activeSheet.cells.length - 1, selectedRef.row + rowDelta));
    const column = Math.max(0, Math.min((activeSheet.cells[0]?.length ?? visibleColumns) - 1, selectedRef.column + columnDelta));
    const address = cellName(row, column);
    setSelection({ anchor: address, focus: address });
  };
  const extendSelection = (rowDelta: number, columnDelta: number) => {
    const focus = parseCellName(selection.focus) ?? selectedRef;
    const row = Math.max(0, Math.min(activeSheet.cells.length - 1, focus.row + rowDelta));
    const column = Math.max(0, Math.min((activeSheet.cells[0]?.length ?? visibleColumns) - 1, focus.column + columnDelta));
    setSelection((current) => ({ ...current, focus: cellName(row, column) }));
  };

  return (
    <div ref={shellRef} className={`cas-sheet-shell ${compact ? "is-compact" : ""}`} data-testid="cas-spreadsheet-studio">
      <input ref={fileInputRef} type="file" aria-label="Import spreadsheet file" accept=".xlsx,.json,.csv,.tsv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json,text/csv,text/tab-separated-values" className="sr-only" onChange={(event) => { void importFile(event.target.files?.[0]); event.target.value = ""; }} />
      <header className="cas-sheet-header">
        <div className="cas-sheet-brand"><span><FileSpreadsheet /></span><div><strong>CAS Spreadsheet</strong><small>CAS / Data sub-workspace</small></div></div>
        <div className="cas-sheet-file-name">
          {renaming ? <input autoFocus value={workbook.name} onChange={(event) => setWorkbook((current) => ({ ...current, name: event.target.value }))} onBlur={() => setRenaming(false)} onKeyDown={(event) => event.key === "Enter" && setRenaming(false)} /> : <button type="button" onClick={() => setRenaming(true)}>{workbook.name}<ChevronDown /></button>}
        </div>
        <div className="cas-sheet-header-actions">
          <button type="button" onClick={undo} disabled={!history.length} title="Undo"><Undo2 /></button><button type="button" onClick={redo} disabled={!future.length} title="Redo"><Redo2 /></button>
          <button type="button" onClick={() => setSearchOpen((value) => !value)} title="Search"><Search /></button><button type="button" onClick={() => void share()} title="Share"><Share2 /></button>
          <button type="button" onClick={() => setDialog("export")} title="Export"><Download /></button><button type="button" onClick={() => { setInspectorTab("Properties"); setShowInspector(true); }} title="Settings"><Settings /></button>
          <div className="cas-sheet-profile"><button type="button" onClick={() => setProfileOpen((value) => !value)} title="User profile"><CircleUserRound /></button>{profileOpen && <div><strong>Math Explorer</strong><span>Local workspace</span></div>}</div>
        </div>
      </header>

      <section className="cas-sheet-ribbon" aria-label="Spreadsheet ribbon">
        <div className="cas-sheet-ribbon-tabs" role="tablist">{(Object.keys(ribbonCommands) as RibbonTab[]).map((tab) => <button key={tab} type="button" role="tab" aria-selected={ribbonTab === tab} className={ribbonTab === tab ? "is-active" : ""} onClick={() => setRibbonTab(tab)}>{tab}</button>)}</div>
        <div className="cas-sheet-ribbon-tools" role="toolbar" aria-label={`${ribbonTab} commands`}>
          {groupCommands(ribbonCommands[ribbonTab]).map(({ group, commands }) => <div key={group} className="cas-sheet-ribbon-group"><div>{commands.map((command) => <RibbonButton key={command.id} command={command} onClick={() => void runCommand(command.id)} active={commandActive(command.id, { showFormulas, showGridlines, showDependencies, compact, freezeRows, freezeColumns, filterActive })} />)}</div><span>{group}</span></div>)}
        </div>
      </section>

      <section className={`cas-sheet-formula-bar ${formulaExpanded ? "is-expanded" : ""}`} aria-label="Formula bar">
        <form className="cas-sheet-name-box" onSubmit={(event) => { event.preventDefault(); goToRange(); }}><input value={nameBoxDraft} onChange={(event) => setNameBoxDraft(event.target.value)} aria-label="Name box: go to cell or range" /><button type="submit" aria-label="Go to range"><ChevronDown /></button></form>
        <button type="button" className="cas-sheet-fx" onClick={() => { setFormulaDraft(selectedRaw.startsWith("=") ? selectedRaw : "="); setEditingCell(selection.focus); }} aria-label="Insert function"><FunctionSquare /></button>
        <label className="cas-sheet-formula-input"><span className="sr-only">Formula for {selection.focus}</span><textarea value={formulaDraft} onFocus={() => { setEditingCell(selection.focus); setStatus("Editing"); }} onChange={(event) => setFormulaDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); confirmFormula(); } if (event.key === "Escape") cancelFormula(); }} aria-invalid={Boolean(evaluation.errors[selectedKey])} /></label>
        <button type="button" onClick={cancelFormula} aria-label="Cancel edit"><X /></button><button type="button" onClick={confirmFormula} aria-label="Confirm edit"><Check /></button><button type="button" className={formulaExpanded ? "is-active" : ""} onClick={() => setFormulaExpanded((value) => !value)} aria-label="Expand formula editor"><Expand /></button>
        {evaluation.errors[selectedKey] && <span className="cas-sheet-formula-error" role="alert">{evaluation.errors[selectedKey]}</span>}
      </section>

      <div className={`cas-sheet-body ${showInspector ? "has-inspector" : ""}`}>
        <main className="cas-sheet-main">
          {searchOpen && <div className="cas-sheet-search"><Search /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Find cells, formulas or values" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); const matches = searchMatches(activeSheet, searchQuery); const next = matches[(Math.max(matches.indexOf(selection.focus), -1) + 1) % Math.max(matches.length, 1)]; if (next) setSelection({ anchor: next, focus: next }); } }} /><span>{searchMatches(activeSheet, searchQuery).length} matches</span><button type="button" onClick={() => { const matches = searchMatches(activeSheet, searchQuery); const next = matches[(Math.max(matches.indexOf(selection.focus), -1) + 1) % Math.max(matches.length, 1)]; if (next) setSelection({ anchor: next, focus: next }); }}>Next</button><button type="button" onClick={() => { setSearchQuery(""); setSearchOpen(false); }}><X /></button></div>}
          <div className="cas-sheet-grid-scroll" style={{ "--sheet-zoom": zoom / 100 } as CSSProperties}>
            <div className={`cas-sheet-grid ${showGridlines ? "show-gridlines" : ""} ${freezeRows ? "freeze-row" : ""} ${freezeColumns ? "freeze-column" : ""}`} role="region" aria-label={`${activeSheet.name} spreadsheet grid`} tabIndex={0} onKeyDown={onGridKeyDown}>
              <button type="button" className="cas-sheet-corner" onClick={selectAll} aria-label="Select all cells"><Menu /></button>
              {activeSheet.cells[0].slice(0, visibleColumns).map((_, column) => <button key={column} type="button" aria-label={`Select column ${columnName(column)}`} className="cas-sheet-column-header" onClick={() => setSelection({ anchor: `${columnName(column)}1`, focus: `${columnName(column)}${activeSheet.cells.length}` })}>{columnName(column)}<span /></button>)}
              {visibleRows.map((row) => <SpreadsheetRow key={row} row={row} sheet={activeSheet} values={activeValues} selection={selection} editingCell={editingCell} formulaDraft={formulaDraft} references={formulaReferences} searchQuery={searchQuery} showFormulas={showFormulas} regression={regression} onSelect={selectCell} onSelectRow={(rowIndex) => setSelection({ anchor: `A${rowIndex + 1}`, focus: `${columnName(Math.max(activeSheet.cells[0]?.length ?? visibleColumns, 1) - 1)}${rowIndex + 1}` })} onFill={fillSelection} onStartEdit={(address) => { setSelection({ anchor: address, focus: address }); setEditingCell(address); setFormulaDraft(activeSheet.cells[row][parseCellName(address)?.column ?? 0] ?? ""); }} onDraftChange={setFormulaDraft} onConfirm={confirmFormula} onCancel={cancelFormula} />)}
            </div>
          </div>
          <SheetTabs workbook={workbook} activeSheet={activeSheet} onActivate={(id) => { setWorkbook((current) => ({ ...current, activeSheetId: id })); setSelection({ anchor: "A1", focus: "A1" }); }} onAdd={addSheet} onDuplicate={duplicateSheet} onDelete={deleteSheet} onRename={(name) => patchActiveSheet((sheet) => ({ ...sheet, name }), "Rename sheet")} onProtect={() => patchActiveSheet((sheet) => ({ ...sheet, protected: !sheet.protected }), "Protect sheet")} />
        </main>

        {showInspector && <SpreadsheetInspector tab={inspectorTab} onTabChange={setInspectorTab} onClose={() => setShowInspector(false)} sheet={activeSheet} selectedAddress={selection.focus} selectedRaw={selectedRaw} selectedValue={selectedValue} selectedStyle={activeSheet.styles[selection.focus]} selectedComment={activeSheet.comments[selection.focus] ?? ""} onCommentChange={(comment) => patchActiveSheet((sheet) => { sheet.comments[selection.focus] = comment; return sheet; }, "Edit comment")} dependencies={evaluation.dependencies[selectedKey] ?? []} dependents={evaluation.dependents[selectedKey] ?? []} stats={selectionStats} regression={regression} points={points} selectedRow={selectedRef.row + 1} objects={workbookObjects} selectedObjectId={selectedObjectId} onSelectObject={setSelectedObjectId} onOpenGraph={openInGraphs} onOpenCas={openInCas} onExportGraph={() => exportGraphSvg(regression)} />}
        {!showInspector && <button type="button" className="cas-sheet-open-inspector" onClick={() => setShowInspector(true)} aria-label="Open inspector"><PanelRightOpen /></button>}
      </div>

      <footer className="cas-sheet-status">
        <span>{status}</span><span>{selection.anchor === selection.focus ? selection.focus : `${selection.anchor}:${selection.focus}`}</span><span>Count {selectionStats.count}</span><span>Sum {selectionStats.sum}</span><span>Average {selectionStats.mean}</span><span>Min {selectionStats.min}</span><span>Max {selectionStats.max}</span><button type="button" onClick={() => setCalculationMode((mode) => mode === "automatic" ? "manual" : "automatic")}>{calculationMode === "automatic" ? "Auto" : "Manual"}</button><span>RAD</span>
        <label><button type="button" onClick={() => setZoom((value) => Math.max(60, value - 10))}><Minus /></button><strong>{zoom}%</strong><input type="range" min="60" max="160" step="10" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Spreadsheet zoom" /><button type="button" onClick={() => setZoom((value) => Math.min(160, value + 10))}><Plus /></button></label>
        <button type="button" onClick={() => void runCommand("fullscreen")} aria-label="Full screen"><Maximize2 /></button>
      </footer>
      {dialog && <SpreadsheetDialog kind={dialog} onClose={() => setDialog(null)} replaceQuery={replaceQuery} replaceValue={replaceValue} onReplaceQuery={setReplaceQuery} onReplaceValue={setReplaceValue} onReplace={replaceMatches} validationType={validationType} validationValues={validationValues} onValidationType={setValidationType} onValidationValues={setValidationValues} onApplyValidation={() => { applyValidation(); setDialog(null); }} secondarySortColumn={secondarySortColumn} onSecondarySortColumn={setSecondarySortColumn} onMultiSort={() => { multiSort(); setDialog(null); }} workbook={workbook} selection={selection} sheet={activeSheet} onCreateNamedRange={(name) => { commitWorkbook({ ...workbook, namedRanges: { ...workbook.namedRanges, [name]: `'${activeSheet.name}'!${selectionLabel(selection)}` } }, `Create named range ${name}`); setDialog(null); }} onInsertFunction={(formula) => { setFormulaDraft(formula); setEditingCell(selection.focus); setDialog(null); }} onExportWorkbook={exportWorkbook} onExportXlsx={exportXlsx} onExportCsv={exportCsv} onExportTsv={exportTsv} onPrint={printSheet} />}
    </div>
  );
}

function SpreadsheetRow({ row, sheet, values, selection, editingCell, formulaDraft, references, searchQuery, showFormulas, regression, onSelect, onSelectRow, onFill, onStartEdit, onDraftChange, onConfirm, onCancel }: {
  row: number; sheet: SpreadsheetStudioSheet; values: string[][]; selection: Selection; editingCell: string | null; formulaDraft: string; references: string[]; searchQuery: string; showFormulas: boolean; regression: SpreadsheetRegression;
  onSelect: (address: string, event?: MouseEvent) => void; onSelectRow: (row: number) => void; onFill: () => void; onStartEdit: (address: string) => void; onDraftChange: (value: string) => void; onConfirm: () => void; onCancel: () => void;
}) {
  const range = selectionBounds(selection);
  return <>
    <button type="button" aria-label={`Select row ${row + 1}`} className="cas-sheet-row-header" onClick={() => onSelectRow(row)}>{row + 1}</button>
    {sheet.cells[row].slice(0, visibleColumns).map((raw, column) => {
      const address = cellName(row, column);
      const key = `${sheet.id}!${address}`;
      const referenceIndex = references.indexOf(key);
      const selected = address === selection.focus;
      const inRange = row >= range.start.row && row <= range.end.row && column >= range.start.column && column <= range.end.column;
      const style = sheet.styles[address] ?? {};
      const validation = sheet.validations?.[address];
      const validationError = validation ? !validForRule(raw, validation) : false;
      const value = showFormulas && raw.startsWith("=") ? raw : formatCellValue(values[row]?.[column] ?? "", style);
      const highlighted = Boolean(searchQuery && `${raw} ${value}`.toLowerCase().includes(searchQuery.toLowerCase()));
      const dependencyStyle = referenceIndex >= 0 ? { "--reference-color": referenceColors[referenceIndex % referenceColors.length] } as CSSProperties : undefined;
      return <div key={column} data-cell-address={address} aria-current={selected ? "true" : undefined} aria-invalid={validationError} title={validationError ? `Value does not satisfy ${validation?.type} validation` : undefined} className={`cas-sheet-cell ${selected ? "is-selected" : ""} ${inRange ? "in-range" : ""} ${referenceIndex >= 0 ? "is-reference" : ""} ${highlighted ? "is-search-match" : ""} ${validationError ? "has-validation-error" : ""} ${row === regression.points.find((point) => point.row === row + 1)?.row && selected ? "is-data-point" : ""}`} style={{ ...cellStyle(style), ...dependencyStyle }} onClick={(event) => onSelect(address, event)} onDoubleClick={() => onStartEdit(address)}>
        {editingCell === address ? <input autoFocus value={formulaDraft} onChange={(event) => onDraftChange(event.target.value)} onBlur={onConfirm} onKeyDown={(event) => { if (event.key === "Enter") onConfirm(); if (event.key === "Escape") onCancel(); }} aria-label={`Edit ${address}`} /> : <span>{value}</span>}
        {raw.startsWith("=") && <i aria-hidden="true" />}{sheet.comments[address] && <b aria-hidden="true" />}{selected && <button type="button" className="cas-sheet-fill-handle" onClick={(event) => { event.stopPropagation(); onFill(); }} aria-label="Fill selected range" />}
      </div>;
    })}
  </>;
}

function SpreadsheetInspector(props: {
  tab: InspectorTab; onTabChange: (tab: InspectorTab) => void; onClose: () => void; sheet: SpreadsheetStudioSheet; selectedAddress: string; selectedRaw: string; selectedValue: string; selectedStyle?: SpreadsheetCellStyle; selectedComment: string; onCommentChange: (value: string) => void; dependencies: string[]; dependents: string[]; stats: ReturnType<typeof calculateSpreadsheetStatistics>; regression: SpreadsheetRegression; points: Array<{ row: number; x: number; y: number }>; selectedRow: number; objects: Array<{ id: string; name: string; type: string; detail: string; visible: boolean }>; selectedObjectId: string; onSelectObject: (id: string) => void; onOpenGraph: () => void; onOpenCas: () => void; onExportGraph: () => void;
}) {
  return <aside className="cas-sheet-inspector" aria-label="Spreadsheet inspector">
    <div className="cas-sheet-inspector-tabs">{(["Insights", "Properties", "Objects"] as InspectorTab[]).map((tab) => <button key={tab} type="button" aria-pressed={props.tab === tab} className={props.tab === tab ? "is-active" : ""} onClick={() => props.onTabChange(tab)}>{tab}</button>)}<button type="button" onClick={props.onClose} aria-label="Close inspector"><PanelRightClose /></button></div>
    <div className="cas-sheet-inspector-scroll">
      {props.tab === "Insights" && <>
        <section className="cas-sheet-insight-block"><div className="cas-sheet-insight-heading"><div><span>Verified analysis</span><h3>Data overview</h3></div><button type="button" onClick={props.onExportGraph} title="Export graph"><FileDown /></button></div><RegressionPreview regression={props.regression} selectedRow={props.selectedRow} /><div className="cas-sheet-regression-summary"><span>Linear regression</span><strong>{props.regression.equation}</strong><p>R<sup>2</sup> = {props.regression.r2} · adjusted {props.regression.adjustedR2}</p><div><button type="button" onClick={props.onOpenGraph}>Open full graph</button><button type="button" onClick={props.onOpenCas}>Analyse in CAS</button></div></div></section>
        <section className="cas-sheet-insight-block"><h3>Selection statistics</h3><div className="cas-sheet-stat-grid"><Metric label="Count" value={props.stats.count} /><Metric label="Mean" value={props.stats.mean} /><Metric label="Median" value={props.stats.median} /><Metric label="Std dev" value={props.stats.standardDeviation} /><Metric label="Min" value={props.stats.min} /><Metric label="Max" value={props.stats.max} /><Metric label="Q1" value={props.stats.q1} /><Metric label="Q3" value={props.stats.q3} /></div></section>
        <section className="cas-sheet-ai-insight"><span>AI-generated observation</span><strong>{insightText(props.regression)}</strong><p>Verified statistics: correlation {props.regression.correlation}; residual standard error {props.regression.residualStandardError}.</p></section>
      </>}
      {props.tab === "Properties" && <>
        <section className="cas-sheet-property-card"><div><span>Selected cell</span><strong>{props.selectedAddress}</strong></div><Property label="Displayed value" value={props.selectedValue || "Empty"} /><Property label="Raw value" value={props.selectedRaw || "Empty"} /><Property label="Formula" value={props.selectedRaw.startsWith("=") ? props.selectedRaw : "Not a formula"} /><Property label="Data type" value={cellDataType(props.selectedRaw, props.selectedValue)} /><Property label="Number format" value={props.selectedStyle?.numberFormat ?? "General"} /><Property label="Validation" value={validationLabel(props.sheet.validations?.[props.selectedAddress])} /><Property label="Merged range" value={props.sheet.mergedRanges?.find((range) => rangeIncludes(range, props.selectedAddress)) ?? "None"} /><Property label="Sheet" value={props.sheet.name} /><Property label="Dependencies" value={props.dependencies.length ? props.dependencies.join(", ") : "None"} /><Property label="Dependents" value={props.dependents.length ? props.dependents.join(", ") : "None"} /></section>
        <label className="cas-sheet-comment-editor">Comment<textarea value={props.selectedComment} onChange={(event) => props.onCommentChange(event.target.value)} placeholder="Add a cell comment" /></label>
      </>}
      {props.tab === "Objects" && <div className="cas-sheet-object-list">{props.objects.map((object) => <button key={object.id} type="button" className={props.selectedObjectId === object.id ? "is-active" : ""} onClick={() => props.onSelectObject(object.id)}><span>{object.type}</span><strong>{object.name}</strong><small>{object.detail}</small><Eye /></button>)}</div>}
    </div>
  </aside>;
}

function RegressionPreview({ regression, selectedRow }: { regression: SpreadsheetRegression; selectedRow: number }) {
  if (!regression.points.length) return <div className="cas-sheet-empty-chart">Select two numeric columns to create a chart.</div>;
  const xs = regression.points.map((point) => point.x); const ys = regression.points.flatMap((point) => [point.y, point.predicted]);
  const xMin = Math.min(...xs); const xMax = Math.max(...xs); const yMin = Math.min(...ys); const yMax = Math.max(...ys);
  const sx = (x: number) => 30 + ((x - xMin) / (xMax - xMin || 1)) * 270; const sy = (y: number) => 150 - ((y - yMin) / (yMax - yMin || 1)) * 120;
  return <svg className="cas-sheet-regression-chart" viewBox="0 0 330 175" role="img" aria-label={`Scatter plot with ${regression.equation}`}><defs><linearGradient id="regLine" x1="0" x2="1"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs><g className="grid">{[0,1,2,3,4].map((index) => <line key={`h${index}`} x1="30" x2="300" y1={30+index*30} y2={30+index*30}/>)}</g><line className="axis" x1="30" y1="150" x2="308" y2="150"/><line className="axis" x1="30" y1="158" x2="30" y2="20"/><line className="fit" x1={sx(xMin)} y1={sy(regression.slope*xMin+regression.intercept)} x2={sx(xMax)} y2={sy(regression.slope*xMax+regression.intercept)}/>{regression.points.map((point) => <circle key={point.row} className={point.row===selectedRow?"selected":""} cx={sx(point.x)} cy={sy(point.y)} r={point.row===selectedRow?6:4}/>)}</svg>;
}

function SheetTabs({ workbook, activeSheet, onActivate, onAdd, onDuplicate, onDelete, onRename, onProtect }: { workbook: SpreadsheetStudioWorkbook; activeSheet: SpreadsheetStudioSheet; onActivate: (id: string) => void; onAdd: () => void; onDuplicate: () => void; onDelete: () => void; onRename: (name: string) => void; onProtect: () => void }) {
  const [actionsOpen, setActionsOpen] = useState(false); const [renameOpen, setRenameOpen] = useState(false); const [draft, setDraft] = useState(activeSheet.name);
  useEffect(() => setDraft(activeSheet.name), [activeSheet.name]);
  return <div className="cas-sheet-tabs"><button type="button" onClick={() => setActionsOpen((value) => !value)} aria-label="Sheet actions"><Menu /></button>{workbook.sheets.filter((sheet) => !sheet.hidden).map((sheet) => <button key={sheet.id} type="button" className={sheet.id === activeSheet.id ? "is-active" : ""} style={{ "--tab-color": sheet.tabColor } as CSSProperties} onClick={() => onActivate(sheet.id)}>{sheet.name}{sheet.protected && <small>Locked</small>}</button>)}<button type="button" onClick={onAdd} aria-label="Add sheet"><Plus /></button>{actionsOpen && <div className="cas-sheet-tab-menu">{renameOpen ? <form onSubmit={(event) => { event.preventDefault(); onRename(draft); setRenameOpen(false); setActionsOpen(false); }}><input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} /><button>Save</button></form> : <><button type="button" onClick={() => setRenameOpen(true)}>Rename sheet</button><button type="button" onClick={() => { onDuplicate(); setActionsOpen(false); }}>Duplicate sheet</button><button type="button" onClick={() => { onProtect(); setActionsOpen(false); }}>{activeSheet.protected ? "Unprotect" : "Protect"} sheet</button><button type="button" onClick={() => { onDelete(); setActionsOpen(false); }} disabled={workbook.sheets.length <= 1}>Delete sheet</button></>}</div>}</div>;
}

function SpreadsheetDialog(props: {
  kind: Exclude<DialogKind, null>; onClose: () => void; replaceQuery: string; replaceValue: string; onReplaceQuery: (value: string) => void; onReplaceValue: (value: string) => void; onReplace: (all: boolean) => void;
  validationType: SpreadsheetValidationRule["type"]; validationValues: string; onValidationType: (value: SpreadsheetValidationRule["type"]) => void; onValidationValues: (value: string) => void; onApplyValidation: () => void;
  secondarySortColumn: number; onSecondarySortColumn: (value: number) => void; onMultiSort: () => void; workbook: SpreadsheetStudioWorkbook; selection: Selection; sheet: SpreadsheetStudioSheet; onCreateNamedRange: (name: string) => void;
  onInsertFunction: (formula: string) => void; onExportWorkbook: () => void; onExportXlsx: () => void; onExportCsv: () => void; onExportTsv: () => void; onPrint: () => void;
}) {
  const [rangeName, setRangeName] = useState("SELECTION");
  const functions = ["=SUM(A1:A10)", "=AVERAGE(A1:A10)", "=MEDIAN(A1:A10)", "=STDEV(A1:A10)", "=CORREL(A1:A10,B1:B10)", "=SLOPE(B1:B10,A1:A10)", "=FORECAST(A1,B1:B10,A1:A10)", "=IF(A1>0,\"Yes\",\"No\")"];
  return <div className="cas-sheet-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && props.onClose()}><section className="cas-sheet-dialog" role="dialog" aria-modal="true" aria-label={`${props.kind} dialog`}><header><div><span>Spreadsheet tool</span><h2>{dialogTitle(props.kind)}</h2></div><button type="button" onClick={props.onClose} aria-label="Close dialog"><X /></button></header>
    {props.kind === "find" && <div className="cas-sheet-dialog-form"><label>Find<input autoFocus value={props.replaceQuery} onChange={(event) => props.onReplaceQuery(event.target.value)} /></label><label>Replace with<input value={props.replaceValue} onChange={(event) => props.onReplaceValue(event.target.value)} /></label><div className="cas-sheet-dialog-actions"><button type="button" onClick={() => props.onReplace(false)}>Replace next</button><button type="button" className="primary" onClick={() => props.onReplace(true)}>Replace all</button></div></div>}
    {props.kind === "validation" && <div className="cas-sheet-dialog-form"><p>Apply a rule to {selectionLabel(props.selection)}.</p><label>Rule<select value={props.validationType} onChange={(event) => props.onValidationType(event.target.value as SpreadsheetValidationRule["type"])}><option value="number">Number only</option><option value="text">Text only</option><option value="list">Allowed list</option></select></label>{props.validationType === "list" && <label>Allowed values<input value={props.validationValues} onChange={(event) => props.onValidationValues(event.target.value)} placeholder="Yes, No, Maybe" /></label>}<button type="button" className="primary" onClick={props.onApplyValidation}>Apply validation</button></div>}
    {props.kind === "sort" && <div className="cas-sheet-dialog-form"><p>Sort first by column {columnName((parseCellName(props.selection.focus)?.column ?? 0))}, then by:</p><label>Secondary column<select value={props.secondarySortColumn} onChange={(event) => props.onSecondarySortColumn(Number(event.target.value))}>{props.sheet.cells[0].map((_, index) => <option key={index} value={index}>Column {columnName(index)}</option>)}</select></label><button type="button" className="primary" onClick={props.onMultiSort}>Sort rows</button></div>}
    {props.kind === "named-range" && <div className="cas-sheet-dialog-form"><p>{`'${props.sheet.name}'!${selectionLabel(props.selection)}`}</p><label>Name<input autoFocus value={rangeName} onChange={(event) => setRangeName(event.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))} /></label><button type="button" className="primary" disabled={!rangeName} onClick={() => props.onCreateNamedRange(rangeName)}>Create named range</button>{Object.entries(props.workbook.namedRanges).map(([name, value]) => <small key={name}><strong>{name}</strong> {value}</small>)}</div>}
    {props.kind === "functions" && <div className="cas-sheet-function-list">{functions.map((formula) => <button key={formula} type="button" onClick={() => props.onInsertFunction(formula)}><FunctionSquare /><span><strong>{formula.slice(1).split("(")[0]}</strong><small>{formula}</small></span></button>)}</div>}
    {props.kind === "export" && <div className="cas-sheet-export-grid"><button type="button" onClick={props.onExportXlsx}><FileSpreadsheet /><span>Excel workbook</span></button><button type="button" onClick={props.onExportWorkbook}><Save /><span>Workbook JSON</span></button><button type="button" onClick={props.onExportCsv}><FileDown /><span>Current sheet CSV</span></button><button type="button" onClick={props.onExportTsv}><ArrowDownToLine /><span>Current sheet TSV</span></button><button type="button" onClick={props.onPrint}><ArrowUpFromLine /><span>Print / PDF</span></button></div>}
  </section></div>;
}

function RibbonButton({ command, onClick, active }: { command: RibbonCommand; onClick: () => void; active: boolean }) { const Icon = command.icon; return <button type="button" className={active ? "is-active" : ""} onClick={onClick} disabled={command.disabled} title={command.disabled ? `${command.label} is not available in this build` : command.label}><Icon /><span>{command.label}</span></button>; }
function Metric({ label, value }: { label: string; value: number }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function Property({ label, value }: { label: string; value: string }) { return <p><span>{label}</span><strong>{value}</strong></p>; }
function groupCommands(commands: RibbonCommand[]) { const groups = new Map<string, RibbonCommand[]>(); commands.forEach((command) => groups.set(command.group, [...(groups.get(command.group) ?? []), command])); return [...groups.entries()].map(([group, items]) => ({ group, commands: items })); }
function commandActive(id: string, state: { showFormulas: boolean; showGridlines: boolean; showDependencies: boolean; compact: boolean; freezeRows: boolean; freezeColumns: boolean; filterActive: boolean }) { return ({ "show-formulas": state.showFormulas, gridlines: state.showGridlines, "dependency-arrows": state.showDependencies, compact: state.compact, "freeze-rows": state.freezeRows, "freeze-columns": state.freezeColumns, filter: state.filterActive } as Record<string, boolean>)[id] ?? false; }
function selectionBounds(selection: Selection) { const a = parseCellName(selection.anchor) ?? { row:0,column:0 }; const b = parseCellName(selection.focus) ?? a; return { start:{row:Math.min(a.row,b.row),column:Math.min(a.column,b.column)}, end:{row:Math.max(a.row,b.row),column:Math.max(a.column,b.column)} }; }
function selectionLabel(selection: Selection) { return selection.anchor === selection.focus ? selection.focus : `${selection.anchor}:${selection.focus}`; }
function forEachSelectionCell(selection: Selection, callback: (address: string, row: number, column: number) => void) { const range = selectionBounds(selection); for (let row = range.start.row; row <= range.end.row; row += 1) for (let column = range.start.column; column <= range.end.column; column += 1) callback(cellName(row, column), row, column); }
function valuesForSelection(values: string[][], selection: Selection) { const range=selectionBounds(selection); const output:string[]=[]; for(let row=range.start.row;row<=range.end.row;row++)for(let col=range.start.column;col<=range.end.column;col++)output.push(values[row]?.[col]??""); return output; }
function ensureGridSize(grid: string[][], rows: number, columns: number) { while(grid.length<rows)grid.push([]); grid.forEach((row)=>{while(row.length<columns)row.push("");}); }
function cloneSheet(sheet: SpreadsheetStudioSheet): SpreadsheetStudioSheet { return { ...sheet, cells:sheet.cells.map((row)=>[...row]), styles:Object.fromEntries(Object.entries(sheet.styles).map(([key,value])=>[key,{...value}])), comments:{...sheet.comments}, validations:Object.fromEntries(Object.entries(sheet.validations ?? {}).map(([key,value])=>[key,{...value,values:value.values?[...value.values]:undefined}])), mergedRanges:[...(sheet.mergedRanges ?? [])] }; }
function columnName(index:number){let output="";let value=index+1;while(value>0){const remainder=(value-1)%26;output=String.fromCharCode(65+remainder)+output;value=Math.floor((value-1)/26);}return output;}
function compareValues(left:string,right:string){const a=Number(left),b=Number(right);return Number.isFinite(a)&&Number.isFinite(b)?a-b:left.localeCompare(right);}
function nextNumberFormat(current?:SpreadsheetCellStyle["numberFormat"]):SpreadsheetCellStyle["numberFormat"]{const values:SpreadsheetCellStyle["numberFormat"][]=["general","number","percent","currency","scientific","text"];return values[(values.indexOf(current??"general")+1)%values.length];}
function formatCellValue(value:string,style:SpreadsheetCellStyle){const numeric=Number(value);if(!Number.isFinite(numeric)||style.numberFormat==="text")return value;const digits=style.decimals??2;if(style.numberFormat==="percent")return `${(numeric*100).toFixed(digits)}%`;if(style.numberFormat==="currency")return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:digits}).format(numeric);if(style.numberFormat==="scientific")return numeric.toExponential(digits);if(style.numberFormat==="number")return numeric.toFixed(digits);return value;}
function cellStyle(style:SpreadsheetCellStyle):CSSProperties{return{fontWeight:style.bold?800:undefined,fontStyle:style.italic?"italic":undefined,textDecoration:style.underline?"underline":undefined,textAlign:style.align,color:style.textColor,backgroundColor:style.fillColor,whiteSpace:style.wrap?"normal":undefined,border:style.border==="all"?"1px solid #4f46e5":undefined,borderBottom:style.border==="bottom"?"2px solid #4f46e5":undefined};}
function cellDataType(raw:string,value:string){if(raw.startsWith("="))return"Formula";if(/^(TRUE|FALSE)$/i.test(value))return"Boolean";if(value!==""&&Number.isFinite(Number(value)))return Number.isInteger(Number(value))?"Integer":"Number (float)";if(/^\d{4}-\d{2}-\d{2}/.test(value))return"Date";return value?"Text":"Empty";}
function searchMatches(sheet:SpreadsheetStudioSheet,query:string){if(!query)return[];const matches:string[]=[];sheet.cells.forEach((row,rowIndex)=>row.forEach((cell,columnIndex)=>{if(cell.toLowerCase().includes(query.toLowerCase()))matches.push(cellName(rowIndex,columnIndex));}));return matches;}
function insightText(regression:SpreadsheetRegression){const strength=Math.abs(regression.correlation)>0.9?"Strong":Math.abs(regression.correlation)>0.6?"Moderate":"Weak";const direction=regression.correlation>=0?"positive":"negative";return `${strength} ${direction} linear relationship detected.`;}
function readWorkbook(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)??"null") as SpreadsheetStudioWorkbook|null;return value?.sheets?.length?value:null;}catch{return null;}}
function fileSlug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"workbook";}
function escapeRegExp(value:string){return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function validForRule(value:string,rule:SpreadsheetValidationRule){if(!value)return true;if(rule.type==="number")return Number.isFinite(Number(value));if(rule.type==="text")return !Number.isFinite(Number(value));return rule.values?.some((allowed)=>allowed.toLowerCase()===value.toLowerCase())??true;}
function validationLabel(rule?:SpreadsheetValidationRule){if(!rule)return"None";return rule.type==="list"?`List: ${rule.values?.join(", ")||"empty"}`:`${rule.type[0].toUpperCase()+rule.type.slice(1)} only`;}
function rangeIncludes(range:string,address:string){const [anchor,focus=anchor]=range.split(":");const bounds=selectionBounds({anchor,focus});const ref=parseCellName(address);return Boolean(ref&&ref.row>=bounds.start.row&&ref.row<=bounds.end.row&&ref.column>=bounds.start.column&&ref.column<=bounds.end.column);}
function dialogTitle(kind:Exclude<DialogKind,null>){return ({find:"Find and replace",validation:"Data validation",sort:"Multi-column sort","named-range":"Named range",functions:"Function library",export:"Export spreadsheet"} as const)[kind];}
function downloadFile(name:string,content:string|ArrayBuffer,type:string){const url=URL.createObjectURL(new Blob([content],{type}));const anchor=document.createElement("a");anchor.href=url;anchor.download=name;anchor.click();URL.revokeObjectURL(url);}
function exportGraphSvg(regression:SpreadsheetRegression){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="100%" height="100%" fill="white"/><text x="40" y="50" font-family="sans-serif" font-size="24">${regression.equation}; R2=${regression.r2}</text></svg>`;downloadFile("regression-graph.svg",svg,"image/svg+xml");}
