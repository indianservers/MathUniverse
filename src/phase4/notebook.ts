import { evaluateCertifiedCas } from "./casEngine";
import type { Phase4Notebook, Phase4NotebookCell } from "./types";

export function createPhase4Notebook(id = "phase4-notebook"): Phase4Notebook { return { id, version: "1.0.0", assumptions: [], cells: [], datasets: [], simulations: [], analysisCards: [], updatedAt: "2026-08-20T00:00:00.000Z" }; }
export function addNotebookCell(notebook: Phase4Notebook, cell: Omit<Phase4NotebookCell, "status" | "result" | "provenance" | "revision">): Phase4Notebook { return { ...notebook, cells: [...notebook.cells, { ...cell, status: "DIRTY", provenance: [], revision: 1 }], updatedAt: "2026-08-20T00:00:00.000Z" }; }
export function moveNotebookCell(notebook: Phase4Notebook, id: string, targetIndex: number) { const cells = [...notebook.cells]; const index = cells.findIndex((item) => item.id === id); if (index < 0) return notebook; const [cell] = cells.splice(index, 1); cells.splice(Math.max(0, Math.min(targetIndex, cells.length)), 0, cell); return { ...notebook, cells }; }

export function evaluatePhase4Notebook(notebook: Phase4Notebook): Phase4Notebook {
  const ids = new Set(notebook.cells.map((cell) => cell.id)); const cycle = detectCycle(notebook.cells); const assumptions = notebook.assumptions.filter((item) => item.enabled).map((item) => item.source); const results = new Map<string, unknown>();
  const cells = notebook.cells.map((cell) => {
    if (cycle.has(cell.id)) return { ...cell, status: "ERROR" as const, result: { diagnostic: "Circular notebook dependency." }, revision: cell.revision + 1 };
    const missing = cell.dependencyNodeIds.filter((id) => !ids.has(id)); if (missing.length) return { ...cell, status: "ERROR" as const, result: { diagnostic: `Missing dependencies: ${missing.join(", ")}` }, revision: cell.revision + 1 };
    if (cell.status === "FROZEN") { results.set(cell.id, cell.result); return cell; }
    if (cell.type === "ASSUMPTION") { results.set(cell.id, cell.source); return { ...cell, status: "COMPLETE" as const, result: cell.source, provenance: [`assumption:${cell.source}`], revision: cell.revision + 1 }; }
    if (cell.type === "CAS" || cell.type === "DEFINITION") { const result = evaluateCertifiedCas(cell.source, assumptions); results.set(cell.id, result); return { ...cell, status: result.status === "ERROR" ? "ERROR" as const : "COMPLETE" as const, result, provenance: result.provenance.map((item) => item.id), revision: cell.revision + 1 }; }
    return { ...cell, status: "COMPLETE" as const, result: { source: cell.source, dependencyResults: cell.dependencyNodeIds.map((id) => results.get(id)) }, provenance: cell.dependencyNodeIds, revision: cell.revision + 1 };
  });
  return { ...notebook, cells, updatedAt: "2026-08-20T00:00:00.000Z" };
}

export function serializePhase4Notebook(notebook: Phase4Notebook) { return JSON.stringify(sortValue(notebook), null, 2); }
export function loadPhase4Notebook(serialized: string): Phase4Notebook { const parsed = JSON.parse(serialized) as Phase4Notebook; if (parsed.version !== "1.0.0" || !Array.isArray(parsed.cells)) throw new Error("Unsupported or corrupted Phase 4 notebook."); return parsed; }

function detectCycle(cells: Phase4NotebookCell[]) { const graph = new Map(cells.map((cell) => [cell.id, cell.dependencyNodeIds])); const visiting = new Set<string>(); const visited = new Set<string>(); const cycle = new Set<string>(); const visit = (id: string, path: string[]) => { if (visiting.has(id)) { path.slice(path.indexOf(id)).forEach((item) => cycle.add(item)); return; } if (visited.has(id)) return; visiting.add(id); for (const next of graph.get(id) ?? []) if (graph.has(next)) visit(next, [...path, next]); visiting.delete(id); visited.add(id); }; cells.forEach((cell) => visit(cell.id, [cell.id])); return cycle; }
function sortValue(value: unknown): unknown { if (Array.isArray(value)) return value.map(sortValue); if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, sortValue(entry)])); return value; }
