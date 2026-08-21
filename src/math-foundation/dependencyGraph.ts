import { collectSymbols, parseMath } from "./parser";
import { evaluateMath, type EvaluationEnvironment } from "./evaluator";
import type { DefinitionNode, MathAssumption, MathDiagnostic, MathResult } from "./types";

export type RecalculationStatus = "CLEAN" | "DIRTY" | "CALCULATING" | "ERROR";
export type DependencyRecord = {
  id: string;
  symbol: string;
  source: string;
  ast: DefinitionNode;
  dependencies: string[];
  result: MathResult;
  status: RecalculationStatus;
  revision: number;
};
export type GraphSnapshot = { records: DependencyRecord[]; assumptions: MathAssumption[]; revision: number; diagnostics: MathDiagnostic[] };
type GraphListener = (snapshot: GraphSnapshot, changedIds: string[]) => void;
type StoredState = { records: { id: string; source: string; revision: number }[]; assumptions: MathAssumption[] };

const clone = <T>(value: T): T => structuredClone(value);

export class MathDependencyGraph {
  private records = new Map<string, DependencyRecord>();
  private symbolIds = new Map<string, string>();
  private assumptions: MathAssumption[] = [];
  private revision = 0;
  private diagnostics: MathDiagnostic[] = [];
  private listeners = new Set<GraphListener>();
  private undoStack: StoredState[] = [];
  private redoStack: StoredState[] = [];
  private transactionStart?: StoredState;

  define(source: string, stableId?: string): DependencyRecord | undefined {
    const parsed = parseMath(source);
    if (!parsed.ast || parsed.ast.type !== "DEFINITION" || parsed.diagnostics.some((entry) => entry.severity === "ERROR")) {
      this.diagnostics = parsed.ast?.type !== "DEFINITION" ? [...parsed.diagnostics, { code: "DEFINITION_REQUIRED", severity: "ERROR", message: "Dependency graph entries must be symbol or function definitions." }] : parsed.diagnostics;
      this.emit([]);
      return undefined;
    }
    const ast = parsed.ast;
    this.captureUndo();
    const existingId = this.symbolIds.get(ast.name);
    const id = stableId ?? existingId ?? crypto.randomUUID();
    const dependencies = collectSymbols(ast.expression, new Set(ast.parameters)).filter((symbol) => symbol !== ast.name);
    const existing = this.records.get(id);
    const record: DependencyRecord = { id, symbol: ast.name, source, ast, dependencies, result: { status: "UNSUPPORTED", assumptionsUsed: [], diagnostics: [], provenance: [] }, status: "DIRTY", revision: (existing?.revision ?? 0) + 1 };
    if (existing && existing.symbol !== record.symbol) this.symbolIds.delete(existing.symbol);
    this.records.set(id, record); this.symbolIds.set(record.symbol, id); this.revision += 1; this.redoStack = [];
    this.recalculate([record.symbol]);
    return this.records.get(id);
  }

  remove(id: string) {
    const record = this.records.get(id); if (!record) return;
    this.captureUndo(); this.records.delete(id); this.symbolIds.delete(record.symbol); this.revision += 1; this.redoStack = []; this.recalculate([record.symbol]);
  }

  setAssumptions(assumptions: MathAssumption[]) { this.captureUndo(); this.assumptions = clone(assumptions); this.revision += 1; this.redoStack = []; this.recalculate([...this.symbolIds.keys()]); }
  beginTransaction() { if (!this.transactionStart) this.transactionStart = this.exportState(); }
  commitTransaction() { if (this.transactionStart) { this.undoStack.push(this.transactionStart); this.transactionStart = undefined; this.redoStack = []; } }
  rollbackTransaction() { if (this.transactionStart) { const state = this.transactionStart; this.transactionStart = undefined; this.restoreState(state, false); } }
  canUndo() { return this.undoStack.length > 0; }
  canRedo() { return this.redoStack.length > 0; }
  undo() { const state = this.undoStack.pop(); if (!state) return false; this.redoStack.push(this.exportState()); this.restoreState(state, false); return true; }
  redo() { const state = this.redoStack.pop(); if (!state) return false; this.undoStack.push(this.exportState()); this.restoreState(state, false); return true; }
  subscribe(listener: GraphListener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  getSnapshot(): GraphSnapshot { return { records: [...this.records.values()].map(clone), assumptions: clone(this.assumptions), revision: this.revision, diagnostics: clone(this.diagnostics) }; }
  getRecord(idOrSymbol: string) { return this.records.get(idOrSymbol) ?? (this.symbolIds.get(idOrSymbol) ? this.records.get(this.symbolIds.get(idOrSymbol) as string) : undefined); }
  getEnvironment(): EvaluationEnvironment { const environment: EvaluationEnvironment = {}; for (const record of this.topologicalRecords().records) if (record.result.value) environment[record.symbol] = record.result.value; return environment; }
  evaluateExpression(source: string): MathResult {
    const parsed = parseMath(source);
    if (!parsed.ast) return { status: "ERROR", assumptionsUsed: [], diagnostics: parsed.diagnostics, provenance: [] };
    const result = evaluateMath(parsed.ast, this.getEnvironment(), this.assumptions);
    return { ...result, diagnostics: [...parsed.diagnostics, ...result.diagnostics] };
  }
  exportState(): StoredState { return { records: [...this.records.values()].map((record) => ({ id: record.id, source: record.source, revision: record.revision })), assumptions: clone(this.assumptions) }; }
  importState(state: StoredState) { this.captureUndo(); this.restoreState(state, false); this.redoStack = []; }

  private recalculate(changedSymbols: string[]) {
    const affected = new Set(changedSymbols);
    let expanded = true;
    while (expanded) { expanded = false; for (const record of this.records.values()) if (record.dependencies.some((dependency) => affected.has(dependency)) && !affected.has(record.symbol)) { affected.add(record.symbol); expanded = true; } }
    for (const record of this.records.values()) if (affected.has(record.symbol)) record.status = "DIRTY";
    const topology = this.topologicalRecords();
    this.diagnostics = topology.diagnostics;
    const environment: EvaluationEnvironment = {};
    const changedIds: string[] = [];
    for (const record of topology.records) {
      if (record.status === "DIRTY") {
        record.status = "CALCULATING";
        const missing = record.dependencies.filter((dependency) => !this.symbolIds.has(dependency));
        record.result = missing.length ? { status: "ERROR", assumptionsUsed: [], diagnostics: missing.map((symbol) => ({ code: "UNDEFINED_SYMBOL", severity: "ERROR", message: `Symbol '${symbol}' is not defined.`, nodeId: record.ast.id })), provenance: [] } : evaluateMath(record.ast, environment, this.assumptions);
        record.status = record.result.status === "ERROR" ? "ERROR" : "CLEAN"; changedIds.push(record.id);
      }
      if (record.result.value) environment[record.symbol] = record.result.value;
    }
    for (const cycleId of topology.cycleIds) { const record = this.records.get(cycleId); if (record) { record.status = "ERROR"; record.result = { status: "ERROR", assumptionsUsed: [], diagnostics: topology.diagnostics.filter((entry) => entry.code === "CIRCULAR_DEPENDENCY"), provenance: [] }; changedIds.push(cycleId); } }
    this.emit(changedIds);
  }

  private topologicalRecords(): { records: DependencyRecord[]; cycleIds: string[]; diagnostics: MathDiagnostic[] } {
    const indegree = new Map<string, number>(); const children = new Map<string, string[]>();
    for (const record of this.records.values()) { indegree.set(record.id, 0); children.set(record.id, []); }
    for (const record of this.records.values()) for (const dependency of record.dependencies) { const parentId = this.symbolIds.get(dependency); if (parentId) { indegree.set(record.id, (indegree.get(record.id) ?? 0) + 1); children.get(parentId)?.push(record.id); } }
    const queue = [...this.records.values()].filter((record) => indegree.get(record.id) === 0).sort((a, b) => a.id.localeCompare(b.id)); const ordered: DependencyRecord[] = [];
    while (queue.length) { const record = queue.shift() as DependencyRecord; ordered.push(record); for (const childId of (children.get(record.id) ?? []).sort()) { indegree.set(childId, (indegree.get(childId) ?? 0) - 1); if (indegree.get(childId) === 0) { const child = this.records.get(childId); if (child) { queue.push(child); queue.sort((a, b) => a.id.localeCompare(b.id)); } } } }
    const cycleIds = [...this.records.keys()].filter((id) => !ordered.some((record) => record.id === id)).sort();
    const diagnostics = cycleIds.length ? [{ code: "CIRCULAR_DEPENDENCY", severity: "ERROR" as const, message: `Circular dependency detected: ${cycleIds.map((id) => this.records.get(id)?.symbol).join(" → ")}.`, details: { nodeIds: cycleIds } }] : [];
    return { records: ordered, cycleIds, diagnostics };
  }

  private captureUndo() { if (!this.transactionStart) this.undoStack.push(this.exportState()); }
  private restoreState(state: StoredState, capture = true) {
    if (capture) this.captureUndo(); this.records.clear(); this.symbolIds.clear(); this.assumptions = clone(state.assumptions);
    for (const stored of state.records) { const parsed = parseMath(stored.source); const ast = parsed.ast; if (ast?.type === "DEFINITION") { const record: DependencyRecord = { id: stored.id, symbol: ast.name, source: stored.source, ast, dependencies: collectSymbols(ast.expression, new Set(ast.parameters)).filter((symbol) => symbol !== ast.name), result: { status: "UNSUPPORTED", assumptionsUsed: [], diagnostics: [], provenance: [] }, status: "DIRTY", revision: stored.revision }; this.records.set(record.id, record); this.symbolIds.set(record.symbol, record.id); } }
    this.revision += 1; this.recalculate([...this.symbolIds.keys()]);
  }
  private emit(changedIds: string[]) { const snapshot = this.getSnapshot(); this.listeners.forEach((listener) => listener(snapshot, changedIds)); }
}
