import type { MathDependencyGraph } from "./dependencyGraph";
import type { MathDiagnostic, MathResult } from "./types";
import { toFraction } from "./values";
import { adaptiveSampleExplicit, type AdaptiveSegment, type GraphQualityProfile, type SamplingEvidence } from "./adaptiveGraph";
import { analyzeFunction2d, type FunctionAnalysis } from "./analysis2d";

export type AdapterResult<T> = { status: "SUPPORTED" | "UNSUPPORTED" | "ERROR"; nodeId: string; data?: T; diagnostics: MathDiagnostic[]; provenance: { sourceNodeId: string; adapter: string } };
export type PlotData = { label: string; points: { x: number; y: number }[]; segments: AdaptiveSegment[]; description: string; evidence: SamplingEvidence; analysis: FunctionAnalysis };
export type TableData = { columns: string[]; rows: { input: number; exact: string; approximate?: string }[] };
export type GeometryData = { kind: "POINT"; x: number; y: number; label: string };

const unsupported = <T>(nodeId: string, adapter: string, reason: string): AdapterResult<T> => ({ status: "UNSUPPORTED", nodeId, diagnostics: [{ code: "UNSUPPORTED_ADAPTER_INPUT", severity: "WARNING", message: reason, nodeId }], provenance: { sourceNodeId: nodeId, adapter } });

export function adaptResult(graph: MathDependencyGraph, nodeId: string): AdapterResult<MathResult> {
  const record = graph.getRecord(nodeId); if (!record) return unsupported(nodeId, "CAS/result", "The source definition does not exist.");
  return { status: record.result.status === "ERROR" ? "ERROR" : "SUPPORTED", nodeId, data: record.result, diagnostics: record.result.diagnostics, provenance: { sourceNodeId: nodeId, adapter: "CAS/result" } };
}

export function adaptFunctionTable(graph: MathDependencyGraph, nodeId: string, inputs: number[] = [-3, -2, -1, 0, 1, 2, 3]): AdapterResult<TableData> {
  const record = graph.getRecord(nodeId); if (!record?.ast.parameters.length || record.ast.parameters.length !== 1) return unsupported(nodeId, "table", "Value tables currently support one-variable function definitions.");
  const rows = inputs.map((input) => { const result = graph.evaluateExpression(`${record.symbol}(${input})`); return { input, exact: result.exactForm ?? result.status, approximate: result.approximateForm }; });
  return { status: rows.some((row) => row.exact === "ERROR") ? "ERROR" : "SUPPORTED", nodeId, data: { columns: [record.ast.parameters[0], record.symbol], rows }, diagnostics: [], provenance: { sourceNodeId: nodeId, adapter: "table" } };
}

export function adaptGraph2d(graph: MathDependencyGraph, nodeId: string, min = -5, max = 5, _samples = 81, profile: GraphQualityProfile = "BALANCED"): AdapterResult<PlotData> {
  const record = graph.getRecord(nodeId); if (!record?.ast.parameters.length || record.ast.parameters.length !== 1) return unsupported(nodeId, "graph-2d", "2D plotting currently supports explicit one-variable function definitions.");
  const viewport = { xMin: min, xMax: max, yMin: -10, yMax: 10, pixelWidth: 920, pixelHeight: 520 };
  const sampled = adaptiveSampleExplicit((x) => { const result = graph.evaluateExpression(`${record.symbol}(${x})`); const fraction = result.value ? toFraction(result.value) : undefined; return fraction ? Number(fraction.numerator) / Number(fraction.denominator) : Number.NaN; }, viewport, profile);
  const points = sampled.segments.flatMap((segment) => segment.points);
  if (!points.length) return { ...unsupported(nodeId, "graph-2d", "The function did not produce finite real values over this interval."), status: "ERROR" };
  const expression = numericFunctionBody(graph, record.source, record.ast.parameters[0]); const analysis = analyzeFunction2d(nodeId, expression, { min, max });
  return { status: "SUPPORTED", nodeId, data: { label: record.symbol, points, segments: sampled.segments, description: `Adaptive plot of ${record.source} from ${min} to ${max}: ${sampled.evidence.evaluations} evaluations in ${sampled.segments.length} segment(s).`, evidence: sampled.evidence, analysis }, diagnostics: [...sampled.diagnostics, ...analysis.diagnostics], provenance: { sourceNodeId: nodeId, adapter: "graph-2d/adaptive-analysis" } };
}

function numericFunctionBody(graph: MathDependencyGraph, source: string, parameter: string) {
  let body = source.slice(source.indexOf("=") + 1);
  for (const record of graph.getSnapshot().records) {
    if (record.symbol === parameter || record.ast.parameters.length || !record.result.value) continue;
    const fraction = toFraction(record.result.value); if (!fraction) continue;
    const value = Number(fraction.numerator) / Number(fraction.denominator);
    body = body.replace(new RegExp(`\\b${record.symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), `(${value})`);
  }
  return body;
}

export function adaptGeometryPoint(graph: MathDependencyGraph, nodeId: string): AdapterResult<GeometryData> {
  const record = graph.getRecord(nodeId); if (!record || record.ast.expression.type !== "VECTOR" || record.ast.expression.items.length !== 2) return unsupported(nodeId, "geometry", "Geometry currently accepts a two-coordinate vector definition such as P=(a,f(a)).");
  const result = record.result.value; if (result?.kind !== "VECTOR") return unsupported(nodeId, "geometry", "The point coordinates are not available as a real vector.");
  const x = toFraction(result.values[0]); const y = toFraction(result.values[1]); if (!x || !y) return unsupported(nodeId, "geometry", "Point coordinates must be finite real values.");
  return { status: "SUPPORTED", nodeId, data: { kind: "POINT", x: Number(x.numerator) / Number(x.denominator), y: Number(y.numerator) / Number(y.denominator), label: record.symbol }, diagnostics: [], provenance: { sourceNodeId: nodeId, adapter: "geometry" } };
}

export function adaptGraph3d(_graph: MathDependencyGraph, nodeId: string): AdapterResult<never> { return unsupported(nodeId, "graph-3d", "Universal 3D conversion is intentionally not supported in Phase 1; no surface has been fabricated."); }
