import { MathDependencyGraph, type GraphSnapshot } from "./dependencyGraph";
import type { MathAssumption, MathDiagnostic, TransformationRecord } from "./types";

export const MATH_DOCUMENT_SCHEMA_VERSION = 2;
export type Phase2DocumentState = { objectRegistryVersion: number; objects: unknown[]; sliders: unknown[]; selections: string[]; graphView: { qualityProfile: "PERFORMANCE" | "BALANCED" | "HIGH_ACCURACY"; xMin: number; xMax: number; yMin: number; yMax: number }; geometryView: Record<string, unknown> };
export type UniversalMathDocument = {
  documentId: string; schemaVersion: number; applicationVersion: string; createdAt: string; modifiedAt: string;
  mathematicalNodes: { id: string; source: string; revision: number }[]; dependencies: { nodeId: string; symbols: string[] }[]; assumptions: MathAssumption[];
  styles: Record<string, Record<string, unknown>>; moduleViews: { id: string; module: "CAS" | "GRAPH_2D" | "TABLE" | "GEOMETRY" | "GRAPH_3D"; nodeId: string; settings: Record<string, unknown> }[];
  provenance: TransformationRecord[]; warnings: MathDiagnostic[]; curriculumReferences: string[]; capabilityReferences: string[]; accessibilityDescriptions: Record<string, string>; assessmentReferences?: string[];
  extensions?: Record<string, unknown>; phase2?: Phase2DocumentState;
};
export type DocumentLoadResult = { status: "VALID" | "MIGRATED" | "QUARANTINED"; document?: UniversalMathDocument; diagnostics: MathDiagnostic[]; quarantine?: unknown };

export function createMathDocument(snapshot: GraphSnapshot, existing?: Pick<UniversalMathDocument, "documentId" | "createdAt" | "extensions" | "phase2">): UniversalMathDocument {
  const timestamp = new Date().toISOString();
  return { documentId: existing?.documentId ?? crypto.randomUUID(), schemaVersion: MATH_DOCUMENT_SCHEMA_VERSION, applicationVersion: "1.0.1", createdAt: existing?.createdAt ?? timestamp, modifiedAt: timestamp, mathematicalNodes: snapshot.records.map((record) => ({ id: record.id, source: record.source, revision: record.revision })), dependencies: snapshot.records.map((record) => ({ nodeId: record.id, symbols: [...record.dependencies].sort() })), assumptions: structuredClone(snapshot.assumptions), styles: {}, moduleViews: snapshot.records.flatMap((record) => record.ast.parameters.length ? [{ id: `result-${record.id}`, module: "CAS" as const, nodeId: record.id, settings: {} }, { id: `plot-${record.id}`, module: "GRAPH_2D" as const, nodeId: record.id, settings: { min: -5, max: 5, qualityProfile: "BALANCED" } }, { id: `table-${record.id}`, module: "TABLE" as const, nodeId: record.id, settings: { min: -3, max: 3 } }] : []), provenance: snapshot.records.map((record) => ({ id: `definition-${record.id}-${record.revision}`, operation: "DEFINE", inputNodeIds: [record.id], timestamp, description: record.source })), warnings: snapshot.diagnostics, curriculumReferences: [], capabilityReferences: ["universal-parser", "exact-values", "reactive-dag", "native-graph-adapter", "phase2-function-analysis", "phase2-geometry-kernel"], accessibilityDescriptions: Object.fromEntries(snapshot.records.map((record) => [record.id, `${record.symbol} is defined by ${record.source}`])), extensions: existing?.extensions, phase2: existing?.phase2 ?? { objectRegistryVersion: 1, objects: [], sliders: [], selections: [], graphView: { qualityProfile: "BALANCED", xMin: -5, xMax: 5, yMin: -10, yMax: 10 }, geometryView: {} } };
}

export function stableStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  const normalize = (entry: unknown): unknown => {
    if (entry === null || typeof entry !== "object") return entry;
    if (seen.has(entry as object)) throw new TypeError("Circular data cannot be serialized.");
    seen.add(entry as object);
    if (Array.isArray(entry)) return entry.map(normalize);
    return Object.fromEntries(Object.entries(entry as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => [key, normalize(nested)]));
  };
  return JSON.stringify(normalize(value), null, 2);
}

export function validateMathDocument(value: unknown): MathDiagnostic[] {
  if (!value || typeof value !== "object") return [{ code: "CORRUPTED_DOCUMENT", severity: "ERROR", message: "The file does not contain a mathematical document object." }];
  const document = value as Partial<UniversalMathDocument>; const diagnostics: MathDiagnostic[] = [];
  if (typeof document.schemaVersion !== "number") diagnostics.push({ code: "MISSING_SCHEMA_VERSION", severity: "ERROR", message: "Document schema version is missing." });
  else if (document.schemaVersion > MATH_DOCUMENT_SCHEMA_VERSION) diagnostics.push({ code: "UNSUPPORTED_SCHEMA_VERSION", severity: "ERROR", message: `Schema version ${document.schemaVersion} is newer than this app supports.` });
  if (!document.documentId) diagnostics.push({ code: "MISSING_DOCUMENT_ID", severity: "ERROR", message: "Document ID is missing." });
  if (!Array.isArray(document.mathematicalNodes)) diagnostics.push({ code: "MISSING_MATHEMATICAL_NODES", severity: "ERROR", message: "Mathematical definitions are missing or damaged." });
  else { const ids = new Set<string>(); for (const node of document.mathematicalNodes) { if (!node.id || !node.source) diagnostics.push({ code: "CORRUPTED_MATHEMATICAL_NODE", severity: "ERROR", message: "A mathematical definition has no stable ID or source." }); if (ids.has(node.id)) diagnostics.push({ code: "DUPLICATE_NODE_ID", severity: "ERROR", message: `Duplicate mathematical node ID '${node.id}'.` }); ids.add(node.id); } }
  return diagnostics;
}

export function loadMathDocument(input: string): DocumentLoadResult {
  let parsed: unknown;
  try { parsed = JSON.parse(input); } catch (error) { return { status: "QUARANTINED", diagnostics: [{ code: "CORRUPTED_DOCUMENT", severity: "ERROR", message: `The file is not valid JSON: ${error instanceof Error ? error.message : "unknown parse error"}.` }], quarantine: input }; }
  const candidate = parsed as Partial<UniversalMathDocument>;
  if (candidate.schemaVersion === 0) {
    const migrated = migrateDocumentV1(migrateDocumentV0(candidate)); const diagnostics = validateMathDocument(migrated);
    return diagnostics.some((entry) => entry.severity === "ERROR") ? { status: "QUARANTINED", diagnostics, quarantine: parsed } : { status: "MIGRATED", document: migrated, diagnostics: [{ code: "DOCUMENT_MIGRATED", severity: "INFO", message: "Document migrated from schema version 0 to version 2." }] };
  }
  if (candidate.schemaVersion === 1) { const migrated = migrateDocumentV1(candidate as UniversalMathDocument); const diagnostics = validateMathDocument(migrated); return diagnostics.some((entry) => entry.severity === "ERROR") ? { status: "QUARANTINED", diagnostics, quarantine: parsed } : { status: "MIGRATED", document: migrated, diagnostics: [{ code: "DOCUMENT_MIGRATED", severity: "INFO", message: "Document migrated from schema version 1 to version 2 with Phase 2 defaults." }] }; }
  const diagnostics = validateMathDocument(parsed);
  return diagnostics.some((entry) => entry.severity === "ERROR") ? { status: "QUARANTINED", diagnostics, quarantine: parsed } : { status: "VALID", document: parsed as UniversalMathDocument, diagnostics };
}

function migrateDocumentV1(document: UniversalMathDocument): UniversalMathDocument { return { ...document, schemaVersion: 2, modifiedAt: new Date().toISOString(), phase2: document.phase2 ?? { objectRegistryVersion: 1, objects: [], sliders: [], selections: [], graphView: { qualityProfile: "BALANCED", xMin: -5, xMax: 5, yMin: -10, yMax: 10 }, geometryView: {} }, extensions: { ...document.extensions, migratedFrom: document.extensions?.migratedFrom ?? 1 } }; }

function migrateDocumentV0(legacy: Partial<UniversalMathDocument> & { nodes?: { id: string; expression: string }[] }): UniversalMathDocument {
  const timestamp = new Date().toISOString();
  return { documentId: legacy.documentId ?? crypto.randomUUID(), schemaVersion: 1, applicationVersion: legacy.applicationVersion ?? "legacy", createdAt: legacy.createdAt ?? timestamp, modifiedAt: timestamp, mathematicalNodes: legacy.mathematicalNodes ?? legacy.nodes?.map((node) => ({ id: node.id, source: node.expression, revision: 1 })) ?? [], dependencies: legacy.dependencies ?? [], assumptions: legacy.assumptions ?? [], styles: legacy.styles ?? {}, moduleViews: legacy.moduleViews ?? [], provenance: legacy.provenance ?? [], warnings: legacy.warnings ?? [], curriculumReferences: legacy.curriculumReferences ?? [], capabilityReferences: legacy.capabilityReferences ?? [], accessibilityDescriptions: legacy.accessibilityDescriptions ?? {}, extensions: { ...legacy.extensions, migratedFrom: 0 } };
}

export function graphFromDocument(document: UniversalMathDocument): { graph?: MathDependencyGraph; diagnostics: MathDiagnostic[] } {
  const graph = new MathDependencyGraph(); graph.beginTransaction();
  for (const node of document.mathematicalNodes) if (!graph.define(node.source, node.id)) { graph.rollbackTransaction(); return { diagnostics: [{ code: "DOCUMENT_DEFINITION_REJECTED", severity: "ERROR", message: `Definition '${node.source}' could not be restored; no definitions were discarded.`, nodeId: node.id }, ...graph.getSnapshot().diagnostics] }; }
  graph.setAssumptions(document.assumptions); graph.commitTransaction();
  return { graph, diagnostics: graph.getSnapshot().diagnostics };
}

export function serializeSelection(document: UniversalMathDocument, nodeIds: string[]) { const selected = new Set(nodeIds); return stableStringify({ mimeType: "application/vnd.math-universe.selection+json", schemaVersion: 2, nodes: document.mathematicalNodes.filter((node) => selected.has(node.id)), dependencies: document.dependencies.filter((entry) => selected.has(entry.nodeId)) }); }
