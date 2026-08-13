import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpen, Check, ChevronDown, ChevronRight, CircleHelp, Download, Expand,
  Grid3X3, Menu, Moon, Pause, Play, RotateCcw, Search, Settings, Sparkles,
  Star, StepBack, StepForward, X, XCircle,
} from "lucide-react";
import CalculusSidebar from "../components/calculus/CalculusSidebar";
import { compileFunctionExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";
import "./LimitsContinuityVisualizer.css";

type PresetKind = "input" | "jump" | "removable" | "step";
type SamplePoint = { x: number; y: number; defined: boolean };
type Analysis = ReturnType<typeof analyzeLimit>;
type Tab = "explanation" | "table" | "steps";

const presets = [
  { title: "sin(x)/x", expression: "sin(x)/x", kind: "input" as const },
  { title: "|x|", expression: "abs(x)", kind: "input" as const },
  { title: "1/(x−1)", expression: "1/(x-1)", kind: "input" as const },
  { title: "x²", expression: "x^2", kind: "input" as const },
];

export default function LimitsContinuityVisualizer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expression, setExpression] = useState("sin(x)/x");
  const [draft, setDraft] = useState("sin(x)/x");
  const [kind, setKind] = useState<PresetKind>("input");
  const [a, setA] = useState(() => numberParam(searchParams.get("v_limit_point_a"), 0));
  const [approach, setApproach] = useState(() => numberParam(searchParams.get("v_approach_distance"), 1.2));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activePane, setActivePane] = useState<"2d" | "3d">("2d");
  const [gridVisible, setGridVisible] = useState(true);
  const [trace, setTrace] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("explanation");
  const [learningOpen, setLearningOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pointDefined, setPointDefined] = useState(false);

  const compiled = useMemo(() => {
    try {
      if (kind !== "input") return { fn: specialFunction(kind), error: "" };
      return { fn: compileFunctionExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid function" };
    }
  }, [expression, kind]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("v_limit_point_a", tidyNumber(a));
    next.set("v_approach_distance", tidyNumber(approach));
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [a, approach, searchParams, setSearchParams]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setApproach((value) => value <= 0.055 ? 3 : Math.max(0.05, value - 0.025 * speed));
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  useEffect(() => setPointDefined(false), [expression, kind, a]);

  const fn = compiled.fn;
  const analysis = useMemo(() => fn ? analyzeLimit(fn, a, kind, expression, pointDefined) : null, [fn, a, kind, expression, pointDefined]);
  const leftPoint = fn ? pointAt(fn, a - approach) : null;
  const rightPoint = fn ? pointAt(fn, a + approach) : null;
  const atPoint = fn ? pointAt(fn, a) : null;

  const applyPreset = (preset: typeof presets[number]) => {
    setDraft(preset.expression);
    setExpression(preset.expression);
    setKind(preset.kind);
  };

  const reset = () => {
    setA(0);
    setApproach(1.2);
    setPlaying(false);
    setPointDefined(false);
  };

  return (
    <div className="limits-app">
      <CalculusSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="limits-page">
        <LabHeader onMenu={() => setMobileNavOpen(true)} />
        <div className="limits-content">
          <section className="limits-titlebar" aria-labelledby="limits-page-title">
            <div>
              <nav aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight /><Link to="/calculus">Math</Link><ChevronRight /><span>Limits</span></nav>
              <h1 id="limits-page-title">Limits &amp; Continuity</h1>
              <p>Explore limits from the left and right, test continuity, and identify discontinuities.</p>
            </div>
            <div className="limits-badges"><span>Calculus Foundations</span><span>18 min</span></div>
          </section>

          <div className="limits-workspace">
            <ControlsCard
              draft={draft} error={compiled.error} a={a} approach={approach} playing={playing} speed={speed}
              onDraft={(value) => { setDraft(value); setKind("input"); }}
              onPlot={() => { setExpression(draft); setKind("input"); }}
              onPreset={applyPreset} onA={setA} onApproach={setApproach} onPlaying={setPlaying}
              onSpeed={setSpeed} onReset={reset}
            />

            <ExplorerCard
              fn={fn} expression={expression} a={a} approach={approach} leftPoint={leftPoint} rightPoint={rightPoint}
              atPoint={pointDefined && analysis?.limitExists ? { x: a, y: analysis.limit, defined: true } : atPoint}
              forceHole={!pointDefined && analysis?.classification === "Removable discontinuity"}
              activePane={activePane} onPane={setActivePane} gridVisible={gridVisible} onGrid={() => setGridVisible((value) => !value)}
              trace={trace} onTrace={() => setTrace((value) => !value)} onReset={reset}
              playing={playing} onPlaying={setPlaying} speed={speed} onSpeed={setSpeed} onApproach={setApproach}
              analysis={analysis}
            />

            <AnalysisCard analysis={analysis} a={a} fn={fn} activeTab={activeTab} onTab={setActiveTab} onMakeContinuous={() => setPointDefined(true)} />
          </div>

          <LearningDrawer open={learningOpen} onToggle={() => setLearningOpen((value) => !value)} />
        </div>
      </div>
    </div>
  );
}

function LabHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="limits-header">
      <button className="limits-mobile-menu" onClick={onMenu} aria-label="Open Calculus navigation"><Menu /></button>
      <div className="limits-search"><Search /><span>Search...</span><kbd>Ctrl+K</kbd></div>
      <div className="limits-utilities" aria-label="Application utilities">
        <button title="Learning streak">🔥 <b>0</b></button>
        <button title="Experience points"><Star /> <b>0 XP</b></button>
        <button className="teacher" title="Teacher mode"><Sparkles /> <b>Teacher mode</b></button>
        <button title="Settings"><Settings /></button>
        <button title="Theme"><Moon /></button>
      </div>
    </header>
  );
}

type ControlsProps = {
  draft: string; error: string; a: number; approach: number; playing: boolean; speed: number;
  onDraft: (value: string) => void; onPlot: () => void; onPreset: (preset: typeof presets[number]) => void;
  onA: (value: number) => void; onApproach: (value: number) => void; onPlaying: (value: boolean) => void;
  onSpeed: (value: number) => void; onReset: () => void;
};

function ControlsCard(props: ControlsProps) {
  const left = props.a - props.approach;
  const right = props.a + props.approach;
  return (
    <section className="limits-card controls-card" aria-labelledby="controls-title">
      <div className="card-heading"><h2 id="controls-title">Function &amp; Parameters</h2><CircleHelp /></div>
      <label className="field-label" htmlFor="limit-expression">f(x)</label>
      <div className="expression-input"><input id="limit-expression" value={props.draft} onChange={(event) => props.onDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && props.onPlot()} /><button onClick={() => props.onDraft("")} aria-label="Clear expression"><X /></button></div>
      <button className="plot-button" onClick={props.onPlot}>Plot</button>
      {props.error && <p className="limits-error">{props.error}</p>}
      <div className="control-section">
        <span className="field-label">Examples</span>
        <div className="example-grid">{presets.map((preset) => <button key={preset.title} onClick={() => props.onPreset(preset)}>{preset.title}</button>)}</div>
      </div>
      <RangeRow label="Limit point a" value={props.a} min={-5} max={5} step={0.05} onChange={props.onA} />
      <RangeRow label="Approach distance (δ)" value={props.approach} min={0.05} max={3} step={0.05} onChange={props.onApproach} />
      <div className="control-section approach-control">
        <span className="field-label">Approach from</span>
        <div className="approach-labels"><span><i className="orange-dot" />Left x</span><span>Right x<i className="violet-dot" /></span></div>
        <div className="approach-values"><output>{left.toFixed(4)}</output><div className="dual-track"><i /><b /></div><output>{right.toFixed(4)}</output></div>
      </div>
      <div className="control-section animation-controls">
        <span className="field-label">Animation</span>
        <div><button onClick={props.onReset} aria-label="Reset animation"><RotateCcw /></button><button className="primary" onClick={() => props.onPlaying(!props.playing)} aria-label={props.playing ? "Pause" : "Play"}>{props.playing ? <Pause /> : <Play />}</button><button onClick={() => props.onApproach(Math.max(.05, props.approach - .1))} aria-label="Next step"><StepForward /></button><select aria-label="Playback speed" value={props.speed} onChange={(event) => props.onSpeed(Number(event.target.value))}><option value={0.5}>0.5×</option><option value={1}>1.0×</option><option value={2}>2.0×</option></select></div>
      </div>
    </section>
  );
}

function RangeRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <div className="control-section range-row"><label><span className="field-label">{label}</span><div><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><input aria-label={`${label} numeric value`} type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div></label></div>;
}

type ExplorerProps = {
  fn: ((x: number) => number) | null; expression: string; a: number; approach: number; leftPoint: SamplePoint | null; rightPoint: SamplePoint | null; atPoint: SamplePoint | null;
  forceHole: boolean; activePane: "2d" | "3d"; onPane: (pane: "2d" | "3d") => void; gridVisible: boolean; onGrid: () => void;
  trace: boolean; onTrace: () => void; onReset: () => void; playing: boolean; onPlaying: (value: boolean) => void; speed: number;
  onSpeed: (value: number) => void; onApproach: (value: number) => void; analysis: Analysis | null;
};

function ExplorerCard(props: ExplorerProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphResetVersion, setGraphResetVersion] = useState(0);
  const fullscreen = async () => document.fullscreenElement ? document.exitFullscreen() : graphRef.current?.requestFullscreen();
  const exportGraph = async () => {
    if (!svgRef.current) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas"); canvas.width = 1400; canvas.height = 820;
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a"); link.download = "limits-continuity.png"; link.href = canvas.toDataURL("image/png"); link.click();
    };
    image.src = url;
  };
  return (
    <section className="limits-card explorer-card" aria-labelledby="explorer-title">
      <div className="explorer-top">
        <div><h2 id="explorer-title">Limit Explorer</h2><div className="legend"><span><i className="cyan-line" />f(x) = {prettyExpression(props.expression)}</span><span><i className="orange-dot" />Left approach</span><span><i className="violet-dot" />Right approach</span></div></div>
        <div className="graph-toolbar">
          <div className="pane-toggle"><button className={props.activePane === "2d" ? "active" : ""} onClick={() => props.onPane("2d")}>2D</button><button className={props.activePane === "3d" ? "active" : ""} onClick={() => props.onPane("3d")}>3D</button></div>
          <button className={props.trace ? "active" : ""} onClick={props.onTrace}>⌁ <span>Trace</span></button>
          <button className={props.gridVisible ? "active" : ""} onClick={props.onGrid}><Grid3X3 /><span>Grid</span></button>
          <button onClick={() => { setGraphResetVersion((value) => value + 1); props.onReset(); }}><RotateCcw /><span>Reset</span></button>
          <button onClick={() => void fullscreen()} aria-label="Fullscreen graph" title="Fullscreen"><Expand /></button>
          <button onClick={() => void exportGraph()} aria-label="Export graph as PNG" title="Export PNG"><Download /></button>
        </div>
      </div>
      <div className="graph-stage" ref={graphRef}>
        {props.activePane === "2d" ? <LimitGraph key={graphResetVersion} ref={svgRef} {...props} /> : <LimitDepthPane a={props.a} analysis={props.analysis} />}
      </div>
      <div className="approach-timeline">
        <div className="timeline-row"><strong>Approach a = {tidyNumber(props.a)}</strong><div className="timeline-track"><i style={{ width: `${50 - props.approach / 6 * 100}%` }} /><b style={{ width: `${50 - props.approach / 6 * 100}%` }} /><span /></div></div>
        <div className="timeline-actions"><button className="primary" onClick={() => props.onPlaying(!props.playing)} aria-label={props.playing ? "Pause approach" : "Play approach"}>{props.playing ? <Pause /> : <Play />}</button><button onClick={() => props.onApproach(Math.min(3, props.approach + .1))} aria-label="Previous step"><StepBack /></button><button onClick={() => props.onApproach(Math.max(.05, props.approach - .1))} aria-label="Next step"><StepForward /></button><span>Distance δ: <b>{tidyNumber(props.approach)}</b></span><label>Speed: <select value={props.speed} onChange={(event) => props.onSpeed(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1.0×</option><option value={2}>2.0×</option></select></label></div>
      </div>
    </section>
  );
}

const LimitGraph = forwardRef<SVGSVGElement, ExplorerProps>(function LimitGraph({ fn, a, leftPoint, rightPoint, atPoint, forceHole, gridVisible, trace }, ref) {
  const width = 900, height = 545, pad = 58, yMin = -1.5, yMax = 1.5;
  const [tracePoint, setTracePoint] = useState<SamplePoint | null>(null);
  const [view, setView] = useState({ center: 0, span: 7 * Math.PI });
  const dragStart = useRef<{ clientX: number; center: number } | null>(null);
  const xMin = view.center - view.span / 2, xMax = view.center + view.span / 2;
  const sx = useCallback((x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2), [xMin, xMax]);
  const sy = useCallback((y: number) => height - pad + 2 - ((y - yMin) / (yMax - yMin)) * (height - pad * 2), [yMin]);
  const samples = useMemo(() => fn ? sample(fn, xMin, xMax, 900) : [], [fn, xMin, xMax]);
  const onMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (dragStart.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const delta = (event.clientX - dragStart.current.clientX) / rect.width * view.span;
      setView((current) => ({ ...current, center: dragStart.current!.center - delta }));
      return;
    }
    if (!trace || !fn) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = xMin + ((event.clientX - rect.left) / rect.width) * (xMax - xMin);
    setTracePoint(pointAt(fn, x));
  };
  const holeY = useMemo(() => fn ? estimateSide(fn, a, 1) : NaN, [fn, a]);
  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Cartesian graph showing left and right approaches to the limit. Use the mouse wheel to zoom and drag to pan." onWheel={(event) => { event.preventDefault(); setView((current) => ({ ...current, span: Math.max(2*Math.PI, Math.min(12*Math.PI, current.span * (event.deltaY > 0 ? 1.12 : .88))) })); }} onPointerDown={(event) => { dragStart.current = { clientX: event.clientX, center: view.center }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={(event) => { dragStart.current = null; event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerMove={onMove} onPointerLeave={() => { dragStart.current = null; setTracePoint(null); }}>
      <defs><linearGradient id="limits-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#061b33"/><stop offset="1" stopColor="#08233c"/></linearGradient><marker id="left-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#f97316" strokeWidth="1.7"/></marker><marker id="right-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#8b5cf6" strokeWidth="1.7"/></marker></defs>
      <rect width={width} height={height} rx="14" fill="url(#limits-bg)" />
      {gridVisible && <GraphGrid width={width} height={height} pad={pad} sx={sx} sy={sy} />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="axis"/><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height-pad} className="axis"/>
      <path d={pointsToPath(samples, sx, sy, yMin, yMax)} fill="none" stroke="#08c7ed" strokeWidth="3.5" />
      <line x1={sx(a)} x2={sx(a)} y1={pad} y2={height-pad} stroke="#fb7185" strokeWidth="2" strokeDasharray="7 6"/><text x={sx(a)+9} y={pad+24} className="a-label">a = {tidyNumber(a)}</text>
      {leftPoint?.defined && <><path d={`M${sx(leftPoint.x)-66},${sy(leftPoint.y)+52} L${sx(leftPoint.x)-10},${sy(leftPoint.y)+8}`} className="left-trail"/><GraphPoint x={sx(leftPoint.x)} y={sy(leftPoint.y)} color="#f97316" /></>}
      {rightPoint?.defined && <><path d={`M${sx(rightPoint.x)+66},${sy(rightPoint.y)+52} L${sx(rightPoint.x)+10},${sy(rightPoint.y)+8}`} className="right-trail"/><GraphPoint x={sx(rightPoint.x)} y={sy(rightPoint.y)} color="#8b5cf6" /></>}
      {forceHole && Number.isFinite(holeY) ? <circle cx={sx(a)} cy={sy(holeY)} r="8" fill="#08233c" stroke="#f8fafc" strokeWidth="3"/> : atPoint?.defined && <GraphPoint x={sx(a)} y={sy(atPoint.y)} color="#f8fafc" />}
      {tracePoint?.defined && <g><line x1={sx(tracePoint.x)} x2={sx(tracePoint.x)} y1={pad} y2={height-pad} stroke="#f8fafc" strokeDasharray="4 4" opacity=".6"/><GraphPoint x={sx(tracePoint.x)} y={sy(tracePoint.y)} color="#22d3ee"/><text x={sx(tracePoint.x)+12} y={sy(tracePoint.y)-14} className="trace-label">({tracePoint.x.toFixed(2)}, {tracePoint.y.toFixed(3)})</text></g>}
    </svg>
  );
});

function GraphGrid({ width, height, pad, sx, sy }: { width: number; height: number; pad: number; sx: (x: number) => number; sy: (y: number) => number }) {
  const xTicks = [-3, -2, -1, 0, 1, 2, 3];
  const yTicks = [-1.5, -1, -.5, 0, .5, 1, 1.5];
  return <g>{xTicks.map((n) => <g key={`x${n}`}><line x1={sx(n*Math.PI)} x2={sx(n*Math.PI)} y1={pad} y2={height-pad} className="gridline"/>{n !== 0 && <text x={sx(n*Math.PI)} y={height-22} textAnchor="middle" className="tick">{n === 1 ? "π" : n === -1 ? "−π" : `${n}π`}</text>}</g>)}{yTicks.map((n) => <g key={`y${n}`}><line x1={pad} x2={width-pad} y1={sy(n)} y2={sy(n)} className="gridline"/>{n !== 0 && <text x={pad-14} y={sy(n)+5} textAnchor="end" className="tick">{n}</text>}</g>)}</g>;
}

function LimitDepthPane({ a, analysis }: { a: number; analysis: Analysis | null }) {
  const y = Number.isFinite(analysis?.limit) ? 260 - analysis!.limit * 70 : 300;
  return <svg viewBox="0 0 900 545" role="img" aria-label="Three dimensional limit approach pane"><defs><linearGradient id="depth-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#082f49"/><stop offset="1" stopColor="#070d22"/></linearGradient></defs><rect width="900" height="545" rx="14" fill="url(#depth-bg)"/><polygon points="160,410 690,410 770,345 240,345" fill="#0891b2" opacity=".14" stroke="#67e8f9"/><line x1="455" x2="455" y1="96" y2="425" stroke="#fb7185" strokeWidth="3" strokeDasharray="9 7"/><path d={`M150 370 C245 ${y} 340 ${y} 440 ${y}`} fill="none" stroke="#f97316" strokeWidth="7"/><path d={`M760 370 C665 ${y} 570 ${y} 470 ${y}`} fill="none" stroke="#8b5cf6" strokeWidth="7"/><circle cx="455" cy={y} r="11" fill="#08233c" stroke="white" strokeWidth="4"/><text x="72" y="72" fill="white" fontSize="25" fontWeight="800">3D approach model</text><text x="72" y="104" fill="#bae6fd" fontSize="15">Left and right paths converge toward x = {tidyNumber(a)}.</text><text x="190" y="462" fill="#fb923c" fontWeight="800">Left-hand path</text><text x="585" y="462" fill="#c4b5fd" fontWeight="800">Right-hand path</text></svg>;
}

function AnalysisCard({ analysis, a, fn, activeTab, onTab, onMakeContinuous }: { analysis: Analysis | null; a: number; fn: ((x: number) => number) | null; activeTab: Tab; onTab: (tab: Tab) => void; onMakeContinuous: () => void }) {
  const status = analysis?.classification ?? "Unable to analyse";
  const makeable = analysis?.classification === "Removable discontinuity" && analysis.limitExists;
  return <section className="limits-card analysis-card" aria-labelledby="analysis-title"><h2 id="analysis-title">Live Analysis</h2>
    <div className={`analysis-status ${analysis?.limitExists ? "success" : "warning"}`}><span>{analysis?.limitExists ? <Check /> : <XCircle />}</span><div><strong>{status}</strong><small>{analysis?.limitExists ? "Limit exists" : "Two-sided limit does not exist"}</small></div></div>
    <div className="metric-grid"><AnalysisMetric color="orange" label="Left limit" value={formatValue(analysis?.left)} /><AnalysisMetric color="violet" label="Right limit" value={formatValue(analysis?.right)} /><AnalysisMetric color="cyan" label="Two-sided limit" value={analysis?.limitExists ? formatValue(analysis.limit) : "DNE"} /><AnalysisMetric color="red" label={`f(${tidyNumber(a)})`} value={analysis?.defined ? formatValue(analysis.value) : "Undefined"} /></div>
    <div className="continuity-test"><h3>Continuity Test at x = {tidyNumber(a)}</h3><CheckRow passed={Boolean(analysis?.defined)} index={1}>f(a) exists</CheckRow><CheckRow passed={Boolean(analysis?.limitExists)} index={2}>lim x→a f(x) exists</CheckRow><CheckRow passed={Boolean(analysis?.continuous)} index={3}>lim x→a f(x) = f(a)</CheckRow></div>
    <p className="analysis-conclusion">{conclusion(analysis, a)}</p>
    {makeable && <div className="make-continuous"><Sparkles /><div><strong>Make continuous</strong><p>Define f({tidyNumber(a)}) = {formatValue(analysis.limit)} to remove the hole.</p><button onClick={onMakeContinuous}>Set f({tidyNumber(a)}) = {formatValue(analysis.limit)}</button></div></div>}
    <div className="analysis-tabs" role="tablist">{(["explanation", "table", "steps"] as Tab[]).map((tab) => <button role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} key={tab} onClick={() => onTab(tab)}>{tab[0].toUpperCase()+tab.slice(1)}</button>)}</div>
    <div className="tab-content" role="tabpanel">{activeTab === "explanation" && <p>{explanation(analysis, a)}</p>}{activeTab === "table" && <ApproachTable fn={fn} a={a} />}{activeTab === "steps" && <ol><li>Evaluate values just left of {tidyNumber(a)}.</li><li>Evaluate values just right of {tidyNumber(a)}.</li><li>Compare both limits, then compare with f({tidyNumber(a)}).</li></ol>}</div>
  </section>;
}

function AnalysisMetric({ color, label, value }: { color: string; label: string; value: string }) { return <div className="analysis-metric"><span><i className={`${color}-dot`} />{label}</span><strong className={color === "red" ? "red" : ""}>{value}</strong></div>; }
function CheckRow({ passed, index, children }: { passed: boolean; index: number; children: ReactNode }) { return <div className={passed ? "passed" : "failed"}>{passed ? <Check /> : <X />}<span>{index}. {children}</span><b>{passed ? "Passed" : "Failed"}</b></div>; }

function ApproachTable({ fn, a }: { fn: ((x: number) => number) | null; a: number }) {
  const rows = [.1, .01, .001];
  return <table><thead><tr><th>x from left</th><th>f(x)</th><th>x from right</th><th>f(x)</th></tr></thead><tbody>{rows.map((d) => <tr key={d}><td>{(a-d).toFixed(3)}</td><td>{fn ? formatValue(safeValue(fn,a-d)) : "—"}</td><td>{(a+d).toFixed(3)}</td><td>{fn ? formatValue(safeValue(fn,a+d)) : "—"}</td></tr>)}</tbody></table>;
}

function LearningDrawer({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return <section className={`learning-drawer ${open ? "open" : ""}`}><button onClick={onToggle} aria-expanded={open}><BookOpen /><span>Concept</span><i>•</i><span>Continuity Test</span><i>•</i><span>Common Discontinuities</span><ChevronDown /></button>{open && <div><article><h3>Concept</h3><p>A limit describes the value approached near a point, whether or not the function is defined there.</p></article><article><h3>Continuity Test</h3><p>f(a) must exist, the two-sided limit must exist, and both values must be equal.</p></article><article><h3>Common Discontinuities</h3><p>Removable holes, jumps, infinite asymptotes, and oscillation each create a distinct limiting pattern.</p></article></div>}</section>;
}

function GraphPoint({ x, y, color }: { x: number; y: number; color: string }) { return <circle cx={x} cy={y} r="7" fill={color} stroke="#071426" strokeWidth="3" />; }
function numberParam(value: string | null, fallback: number) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function tidyNumber(value: number) { return Number(value.toFixed(2)).toString(); }
function prettyExpression(value: string) { return value.replace("abs(x)", "|x|").replace("^2", "²"); }

function specialFunction(kind: PresetKind) {
  if (kind === "jump") return (x: number) => x < 0 ? -1 : 2;
  if (kind === "removable") return (x: number) => Math.abs(x) < 1e-9 ? NaN : (x*x-1)/(x-1);
  if (kind === "step") return (x: number) => x < 0 ? -1 : 1;
  throw new Error("No special function");
}

function analyzeLimit(fn: (x: number) => number, a: number, kind: PresetKind, expression: string, pointDefined: boolean) {
  const left = estimateSide(fn, a, -1), right = estimateSide(fn, a, 1);
  const rawValue = safeValue(fn, a);
  const close = Number.isFinite(left) && Number.isFinite(right) && Math.abs(left-right) < .02;
  const limit = close ? (left+right)/2 : NaN;
  const value = pointDefined && close ? limit : rawValue;
  const defined = Number.isFinite(value);
  const continuous = defined && close && Math.abs(value-limit) < .02;
  const lower = expression.replace(/\s/g, "").toLowerCase();
  let classification = "Limit does not exist";
  if (continuous) classification = "Continuous";
  else if (close) classification = "Removable discontinuity";
  else if ((!Number.isFinite(left) || !Number.isFinite(right) || Math.abs(left) > 20 || Math.abs(right) > 20) && (lower.includes("1/x") || lower.includes("/(x-") || lower.includes("/(x+"))) classification = "Infinite discontinuity";
  else if (kind === "jump" || kind === "step" || lower.includes("floor")) classification = "Jump discontinuity";
  else if (Number.isFinite(left) && !Number.isFinite(right)) classification = "Left limit only";
  else if (!Number.isFinite(left) && Number.isFinite(right)) classification = "Right limit only";
  else if (lower.includes("sin(1/x") || lower.includes("cos(1/x")) classification = "Oscillatory discontinuity";
  return { left, right, limit, value, defined, limitExists: close, continuous, classification };
}

function estimateSide(fn: (x: number) => number, a: number, direction: -1 | 1) {
  const values = [.01, .005, .002].map((d) => safeValue(fn, a + direction*d)).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum+value,0)/values.length : NaN;
}
function sample(fn: (x: number) => number, min: number, max: number, count = 520) { return Array.from({length: count}, (_,i) => pointAt(fn,min+i/(count-1)*(max-min))); }
function pointAt(fn: (x: number) => number, x: number): SamplePoint { const y=safeValue(fn,x); return {x,y,defined:Number.isFinite(y)&&Math.abs(y)<1e5}; }
function safeValue(fn: (x: number) => number, x: number) { try { const y=fn(x); return Number.isFinite(y)?y:NaN; } catch { return NaN; } }
function pointsToPath(points: SamplePoint[], sx: (x:number)=>number, sy:(y:number)=>number, yMin:number, yMax:number) { let open=false; return points.map((p)=>{if(!p.defined||p.y<yMin-.5||p.y>yMax+.5){open=false;return "";}const command=open?"L":"M";open=true;return `${command}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`;}).join(" "); }
function formatValue(value?: number) { return value === undefined || !Number.isFinite(value) ? "Undefined" : roundTo(value,4).toString(); }
function conclusion(analysis: Analysis | null, a: number) { if (!analysis) return "Enter a valid function to begin analysis."; if (analysis.continuous) return `The function is continuous at x = ${tidyNumber(a)}.`; if (analysis.limitExists) return `The limit exists, but the function is not continuous at x = ${tidyNumber(a)}.`; return `The two-sided limit does not exist at x = ${tidyNumber(a)}.`; }
function explanation(analysis: Analysis | null, a: number) { if (!analysis) return "Plot a valid expression to see its limit analysis."; if (analysis.continuous) return `Both one-sided limits agree with f(${tidyNumber(a)}), so all three continuity conditions pass.`; if (analysis.limitExists) return `The left and right limits agree at ${formatValue(analysis.limit)}, but f(${tidyNumber(a)}) is missing or has a different value.`; return `The left and right behaviors do not approach the same finite value, so a two-sided limit cannot be assigned.`; }
