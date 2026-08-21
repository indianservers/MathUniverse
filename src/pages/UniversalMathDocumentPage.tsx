import { AlertTriangle, Box, Download, Network, Pause, Play, Redo2, Save, Undo2, Upload, Volume2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { adaptFunctionTable, adaptGeometryPoint, adaptGraph2d, adaptGraph3d } from "../math-foundation/adapters";
import { MathDependencyGraph, type GraphSnapshot } from "../math-foundation/dependencyGraph";
import { createMathDocument, graphFromDocument, loadMathDocument, stableStringify, type UniversalMathDocument } from "../math-foundation/document";
import { capabilityRegistry } from "../truth-layer/registry";
import type { GraphQualityProfile } from "../math-foundation/adaptiveGraph";
import { BrowserAudioTrace, createAudioTraceFrames, semanticGraphNarration } from "../math-foundation/audioTrace";

function defaultGraph() {
  try { const saved = localStorage.getItem("math-universe-universal-document"); if (saved) { const loaded = loadMathDocument(saved); if (loaded.document) { const restored = graphFromDocument(loaded.document); if (restored.graph) return restored.graph; } } } catch { /* Local storage can be unavailable in private or restricted contexts. */ }
  const graph = new MathDependencyGraph(); graph.beginTransaction(); graph.define("a=2", "definition-a"); graph.define("b=a+3", "definition-b"); graph.define("f(x)=x^2+b", "definition-f"); graph.define("P=(a,f(a))", "definition-point-p"); graph.commitTransaction(); return graph;
}

export default function UniversalMathDocumentPage() {
  const graphRef = useRef<MathDependencyGraph>();
  if (!graphRef.current) graphRef.current = defaultGraph();
  const [snapshot, setSnapshot] = useState<GraphSnapshot>(() => graphRef.current!.getSnapshot());
  const [input, setInput] = useState("a=4"); const [message, setMessage] = useState("Ready. The document is stored locally until you export it."); const [documentIdentity, setDocumentIdentity] = useState<Pick<UniversalMathDocument, "documentId" | "createdAt" | "extensions" | "phase2">>();
  const [quality, setQuality] = useState<GraphQualityProfile>("BALANCED"); const [sliderValue, setSliderValue] = useState(2); const [playing, setPlaying] = useState(false); const audioTrace = useRef(new BrowserAudioTrace());
  const fileInput = useRef<HTMLInputElement>(null); const graph = graphRef.current;
  const functionRecord = snapshot.records.find((record) => record.ast.parameters.length === 1); const pointRecord = snapshot.records.find((record) => record.ast.expression.type === "VECTOR"); const scalarRecord = snapshot.records.find((record) => record.symbol === "a" && !record.ast.parameters.length);
  const liveResult = graph.evaluateExpression("f(a)"); const plot = functionRecord ? adaptGraph2d(graph, functionRecord.id, -5, 5, 81, quality) : undefined; const table = functionRecord ? adaptFunctionTable(graph, functionRecord.id) : undefined; const point = pointRecord ? adaptGeometryPoint(graph, pointRecord.id) : undefined; const unsupported3d = functionRecord ? adaptGraph3d(graph, functionRecord.id) : undefined;
  const diagnostics = [...snapshot.diagnostics, ...snapshot.records.flatMap((record) => record.result.diagnostics), ...liveResult.diagnostics];

  useEffect(() => { if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setSliderValue((current) => { const next = current >= 5 ? -5 : Number((current + 0.25).toFixed(2)); graph.define(`a=${next}`, scalarRecord?.id); setSnapshot(graph.getSnapshot()); return next; }), 100); return () => window.clearInterval(timer); }, [graph, playing, scalarRecord?.id]);
  useEffect(() => () => audioTrace.current.stop(), []);

  function refresh() { setSnapshot(graph.getSnapshot()); }
  function submit(event: FormEvent) { event.preventDefault(); const record = graph.define(input.trim()); refresh(); setMessage(record ? `${record.symbol} updated. Dependent objects were recalculated.` : "Definition rejected. Review the diagnostics panel."); }
  function undo() { if (graph.undo()) { refresh(); setMessage("Undid one document action."); } }
  function redo() { if (graph.redo()) { refresh(); setMessage("Redid one document action."); } }
  function saveLocal() { const document = createMathDocument(graph.getSnapshot(), documentIdentity); localStorage.setItem("math-universe-universal-document", stableStringify(document)); setDocumentIdentity(document); setMessage("Saved locally in this browser."); }
  function exportFile() { const document = createMathDocument(graph.getSnapshot(), documentIdentity); setDocumentIdentity(document); const url = URL.createObjectURL(new Blob([stableStringify(document)], { type: "application/vnd.math-universe+json" })); const anchor = window.document.createElement("a"); anchor.href = url; anchor.download = `${document.documentId}.math-universe.json`; anchor.click(); URL.revokeObjectURL(url); setMessage("Exported a versioned Math Universe document."); }
  async function openFile(file?: File) { if (!file) return; const loaded = loadMathDocument(await file.text()); if (!loaded.document) { setMessage(loaded.diagnostics.map((entry) => entry.message).join(" ")); return; } const restored = graphFromDocument(loaded.document); if (!restored.graph) { setMessage(restored.diagnostics.map((entry) => entry.message).join(" ")); return; } graphRef.current = restored.graph; setSnapshot(restored.graph.getSnapshot()); setDocumentIdentity(loaded.document); setMessage(loaded.status === "MIGRATED" ? "Opened and migrated the document to schema version 2." : "Opened document with stable IDs and definitions intact."); }

  return (
    <div className="space-y-4">
      <TopicHeader title="Universal Math Document" subtitle="One typed definition graph drives exact results, a 2D plot, a value table, and supported geometry—without conflicting copies." difficulty="Advanced" estimatedMinutes={12} />
      <p className="sr-only" aria-live="polite">{message}</p>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <div className="space-y-3">
          <SectionCard title="Expression and definition editor" description="Enter a symbol or one-variable function definition. Reusing a symbol updates its stable document node." compact visualizationTools={false}>
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
              <label className="min-w-0 flex-1 text-sm font-bold" htmlFor="universal-expression">Definition<span className="mt-1 block text-xs font-normal text-slate-500">Examples: a=4, b=a+3, f(x)=x^2+b, P=(a,f(a))</span></label>
              <input id="universal-expression" className="min-w-0 flex-[2] rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/15 dark:bg-slate-950 dark:text-white" value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" />
              <button className="action-primary" type="submit">Apply definition</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="action-secondary" type="button" onClick={undo} disabled={!graph.canUndo()}><Undo2 className="h-4 w-4" />Undo</button>
              <button className="action-secondary" type="button" onClick={redo} disabled={!graph.canRedo()}><Redo2 className="h-4 w-4" />Redo</button>
              <button className="action-secondary" type="button" onClick={saveLocal}><Save className="h-4 w-4" />Save</button>
              <button className="action-secondary" type="button" onClick={exportFile}><Download className="h-4 w-4" />Export</button>
              <button className="action-secondary" type="button" onClick={() => fileInput.current?.click()}><Upload className="h-4 w-4" />Open</button>
              <input ref={fileInput} className="sr-only" type="file" accept=".json,.math-universe.json,application/json" aria-label="Open Math Universe document" onChange={(event) => void openFile(event.target.files?.[0])} />
            </div>
            <p className="mt-3 rounded-xl bg-cyan-50 p-2 text-xs font-semibold text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100">{message}</p>
          </SectionCard>

          <SectionCard title="Linked 2D graph" description={plot?.data?.description ?? plot?.diagnostics[0]?.message ?? "Add a one-variable function to plot it."} compact allowFullscreen>
            {plot?.data ? <FunctionPlot segments={plot.data.segments} /> : <Unsupported text="No supported function is available for 2D plotting." />}
          </SectionCard>

          {plot?.data ? <SectionCard title="Graph controls and point analysis" description="Viewport-aware adaptive sampling, dependency-linked parameter animation, structured features, and synchronized nonvisual access." compact visualizationTools={false}>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-3 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                <label className="block text-sm font-bold" htmlFor="graph-quality">Quality profile</label>
                <select id="graph-quality" className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-white/15 dark:bg-slate-950" value={quality} onChange={(event) => setQuality(event.target.value as GraphQualityProfile)}><option value="PERFORMANCE">Performance</option><option value="BALANCED">Balanced</option><option value="HIGH_ACCURACY">High accuracy</option></select>
                <label className="block text-sm font-bold" htmlFor="parameter-a">Parameter a: {sliderValue}</label>
                <input id="parameter-a" className="w-full accent-cyan-500" type="range" min={-5} max={5} step={0.25} value={sliderValue} onChange={(event) => { const next = Number(event.target.value); setSliderValue(next); graph.define(`a=${next}`, scalarRecord?.id); refresh(); }} />
                <div className="flex flex-wrap gap-2"><button className="action-secondary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Play"}</button><button className="action-secondary" type="button" onClick={() => { const data = plot.data; if (!data) return; const frames = createAudioTraceFrames(data.points, { xMin: -5, xMax: 5, yMin: -10, yMax: 10 }, data.analysis.points); const frame = frames[Math.floor(frames.length / 2)]; if (frame) void audioTrace.current.start(frame); }}><Volume2 className="h-4 w-4" />Hear midpoint</button><button className="action-secondary" type="button" onClick={() => audioTrace.current.stop()}>Stop audio</button></div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Method: {plot.data.evidence.method.toLowerCase().replaceAll("_", " ")}; tolerance {plot.data.evidence.tolerancePixels} px; {plot.data.evidence.evaluations} evaluations; {plot.data.evidence.convergence.toLowerCase()}.</p>
              </div>
              <div className="rounded-xl bg-violet-50 p-3 dark:bg-violet-300/10"><h3 className="text-sm font-black">Detected points of interest</h3>{plot.data.analysis.points.length ? <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-sm">{plot.data.analysis.points.map((feature) => <li key={feature.id}><strong>{feature.kind.toLowerCase().replaceAll("_", " ")}</strong> {feature.approximate}; {feature.verification.toLowerCase().replaceAll("_", " ")}, residual {feature.residual ?? "n/a"}</li>)}</ul> : <p className="mt-2 text-sm">No feature was detected in this viewport.</p>}</div>
            </div>
            <p className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50" aria-live="polite"><strong>Nonvisual graph description:</strong> {semanticGraphNarration({ curveCount: plot.data.segments.length, viewport: { xMin: -5, xMax: 5, yMin: -10, yMax: 10 }, analysis: plot.data.analysis })}</p>
          </SectionCard> : null}

          <div className="grid gap-3 lg:grid-cols-2">
            <SectionCard title="Exact and approximate result" description="The same dependency environment evaluates f(a)." compact visualizationTools={false}>
              <dl className="grid gap-2 sm:grid-cols-2"><ResultTerm label="Exact f(a)" value={liveResult.exactForm ?? liveResult.status} /><ResultTerm label="Approximate f(a)" value={liveResult.approximateForm ?? "Exact value needs no approximation"} /></dl>
            </SectionCard>
            <SectionCard title="Linked geometry" description="Point P consumes a and f(a) from the graph." compact visualizationTools={false}>
              {point?.data ? <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-300/10"><p className="text-2xl font-black">{point.data.label} = ({point.data.x}, {point.data.y})</p><p className="mt-1 text-xs">Accessible description: point {point.data.label}, x coordinate {point.data.x}, y coordinate {point.data.y}.</p></div> : <Unsupported text={point?.diagnostics[0]?.message ?? "Define P=(a,f(a)) to link a point."} />}
            </SectionCard>
          </div>

          <SectionCard title="Linked value table" description="Rows are generated from the live function node; values are not stored separately." compact visualizationTools={false}>
            {table?.data ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 dark:border-white/10"><th className="p-2">{table.data.columns[0]}</th><th className="p-2">Exact {table.data.columns[1]}</th><th className="p-2">Approximate</th></tr></thead><tbody>{table.data.rows.map((row) => <tr className="border-b border-slate-100 dark:border-white/5" key={row.input}><td className="p-2 font-mono">{row.input}</td><td className="p-2 font-mono">{row.exact}</td><td className="p-2 font-mono">{row.approximate ?? "—"}</td></tr>)}</tbody></table></div> : <Unsupported text={table?.diagnostics[0]?.message ?? "No supported function is available."} />}
          </SectionCard>
        </div>

        <div className="space-y-3">
          <SectionCard title="Mathematical objects" description={`${snapshot.records.length} stable document nodes, revision ${snapshot.revision}.`} compact visualizationTools={false}>
            <ul className="grid gap-2">{snapshot.records.map((record) => <li key={record.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><div className="flex items-center justify-between gap-2"><code className="font-bold">{record.source}</code><span className={`mini-chip ${record.status === "ERROR" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>{record.status}</span></div><p className="mt-1 text-xs text-slate-500">ID: {record.id}</p><p className="mt-1 font-mono text-sm">{record.result.exactForm ?? record.result.status}</p></li>)}</ul>
          </SectionCard>
          <SectionCard title="Dependency inspector" description="Arrows show source symbols consumed by each definition." compact visualizationTools={false}>
            <ul className="grid gap-2 text-sm">{snapshot.records.map((record) => <li key={record.id} className="flex items-center gap-2 rounded-xl bg-slate-100 p-2 dark:bg-white/5"><Network className="h-4 w-4 text-cyan-600" /><strong>{record.symbol}</strong><span aria-hidden="true">←</span><span>{record.dependencies.length ? record.dependencies.join(", ") : "independent"}</span></li>)}</ul>
          </SectionCard>
          <SectionCard title="Assumptions and domain" description="Phase 1 stores typed assumptions and validates them during evaluation." compact visualizationTools={false}>
            <p className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/5">No extra assumptions. Exact integers are inferred for a and b; f accepts a real or complex scalar supported by its operations.</p>
          </SectionCard>
          <SectionCard title="Diagnostics" description="Unsupported or invalid mathematics is reported explicitly." compact visualizationTools={false}>
            {diagnostics.length ? <ul className="grid gap-2" aria-live="assertive">{diagnostics.map((diagnostic, index) => <li key={`${diagnostic.code}-${index}`} className="rounded-xl bg-red-50 p-3 text-sm text-red-900 dark:bg-red-300/10 dark:text-red-100"><strong>{diagnostic.code}</strong>: {diagnostic.message}</li>)}</ul> : <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 dark:bg-emerald-300/10 dark:text-emerald-100">No mathematical errors.</p>}
          </SectionCard>
          <SectionCard title="Capability support" description="Statuses come from the machine-readable capability registry." compact visualizationTools={false}>
            <ul className="grid gap-2">{capabilityRegistry.filter((capability) => capability.consumingRoutes.includes("/math-document")).map((capability) => <li className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-2 dark:border-white/10" key={capability.id}><span><strong className="block text-sm">{capability.name}</strong><span className="text-xs text-slate-500">{capability.knownLimitations[0]}</span></span><span className="mini-chip">{capability.status}</span></li>)}</ul>
            {unsupported3d ? <div className="mt-3"><Unsupported text={unsupported3d.diagnostics[0].message} icon="3d" /></div> : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function FunctionPlot({ segments }: { segments: Array<{ points: { x: number; y: number }[] }> }) {
  const paths = useMemo(() => { const finite = segments.flatMap((segment) => segment.points).filter((point) => Number.isFinite(point.y)); const maxY = Math.max(5, ...finite.map((point) => Math.min(100, Math.abs(point.y)))); return segments.map((segment) => segment.points.map((point, index) => `${index ? "L" : "M"} ${20 + (point.x + 5) * 46} ${160 - Math.max(-maxY, Math.min(maxY, point.y)) / maxY * 130}`).join(" ")); }, [segments]);
  return <svg className="h-80 w-full rounded-xl bg-slate-950" viewBox="0 0 500 320" role="img" aria-label="Two-dimensional adaptive plot of the live function. Discontinuities are separated. A value table and structured description follow."><path d="M 250 15 V 305 M 15 160 H 485" stroke="#64748b" strokeWidth="1" />{paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#22d3ee" strokeLinecap="round" strokeWidth="3" />)}</svg>;
}
function Unsupported({ text, icon }: { text: string; icon?: "3d" }) { return <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">{icon ? <Box className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}<p><strong>Unsupported:</strong> {text}</p></div>; }
function ResultTerm({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-violet-50 p-3 dark:bg-violet-300/10"><dt className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">{label}</dt><dd className="mt-1 font-mono text-xl font-black">{value}</dd></div>; }
