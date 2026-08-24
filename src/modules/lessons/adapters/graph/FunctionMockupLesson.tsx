import { Check, CheckCircle2, Copy, Eye, Lightbulb, MousePointer2, Move, RotateCcw, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createLessonInteractionEvent } from "../../engine/lessonInteraction";
import type { LessonAdapterProps } from "../../types";

type FunctionMockupTheme = "dark" | "light";
type FunctionVisualKind =
  | "logarithmic"
  | "trigonometric"
  | "hyperbolic"
  | "floor"
  | "ceiling"
  | "sign"
  | "piecewise"
  | "composite"
  | "inverse"
  | "symmetry";

type FunctionMockupSpec = {
  mockupId: string;
  title: string;
  subtitle: string;
  formula: string;
  result: string;
  theme: FunctionMockupTheme;
  visual: FunctionVisualKind;
  tabs: string[];
  leftTitle: string;
  leftCards: string[];
  rightTitle: string;
  rightCards: string[];
  controls: [string, string][];
  table: [string, string, string][];
  insight: string;
  warning: string;
  quickCheck: string;
  quickAnswer: string;
};

function LogarithmicFunctionsLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [base, setBase] = useState(2);
  const [stretch, setStretch] = useState(2);
  const [shiftX, setShiftX] = useState(1);
  const [shiftY, setShiftY] = useState(1);
  const [activeTab, setActiveTab] = useState("Explore");
  const [showInverse, setShowInverse] = useState(true);
  const [graphMode, setGraphMode] = useState<"select" | "drag">("select");
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const [copiedEquation, setCopiedEquation] = useState(false);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setBase(2);
    setStretch(2);
    setShiftX(1);
    setShiftY(1);
    setActiveTab("Explore");
    setShowInverse(true);
    setGraphMode("select");
    setGraphZoom(1);
    setGraphPan({ x: 0, y: 0 });
    setDragStart(null);
    setCopiedEquation(false);
    setChallengeChecked(false);
    setShowSolution(false);
  }, [lesson.id, resetToken]);

  const emit = (controlId: string, before: unknown, after: unknown) => {
    onInteraction(createLessonInteractionEvent({
      controlId,
      kind: controlId.includes("view") ? "toggle" : "slider",
      before,
      after,
      affectedOutputs: ["function-mockup-graph", "function-mockup-table", "function-mockup-result"],
    }));
  };

  const resetParameters = () => {
    const before = { base, stretch, shiftX, shiftY };
    setBase(2);
    setStretch(2);
    setShiftX(1);
    setShiftY(1);
    emit("primary-control", before, { base: 2, stretch: 2, shiftX: 1, shiftY: 1 });
  };

  const values = [1.25, 1.5, 2, 3, 5, 9].map((x) => {
    const logY = stretch * Math.log(x - shiftX) / Math.log(base) + shiftY;
    const inverseY = shiftX + base ** ((x - shiftY) / stretch);
    return { x, logY, inverseY };
  });
  const challengeMatched = Math.abs(base - 2) < 0.05 && Math.abs(stretch + 1) < 0.05 && Math.abs(shiftX + 2) < 0.05 && Math.abs(shiftY + 1) < 0.05;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-700 bg-[#070d19] text-slate-100 shadow-2xl" data-testid="function-mockup-0200">
      <div className="border-b border-slate-700 px-4 py-4 lg:px-5">
        <div className="grid items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(360px,470px)]">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-white lg:text-3xl">Logarithmic Functions</h1>
            <p className="mt-1 font-serif text-2xl italic text-violet-300">
              y = <span className="text-violet-400">a</span> log<sub className="text-lime-400">b</sub>(x - <span className="text-orange-300">h</span>) + <span className="text-cyan-300">k</span>
            </p>
          </div>
          <button type="button" onClick={() => { setShowInverse((value) => !value); emit("inverse-view-toggle", showInverse, !showInverse); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-400 bg-blue-500/10 px-4 text-sm font-semibold text-blue-50 shadow-[0_0_18px_rgba(59,130,246,0.22)]">
            <Eye className="h-4 w-4" /> Inverse exponential view
          </button>
          <div className="flex min-h-16 items-center justify-between rounded-lg border border-slate-700 bg-white/[0.03] px-5 font-serif text-2xl">
            <span>y = <span className="text-violet-300">{stretch}</span> <span className="text-lime-400">log<sub>{base}</sub></span>(x - <span className="text-orange-300">{shiftX}</span>) + <span className="text-cyan-300">{shiftY}</span></span>
            <button type="button" title="Copy equation" aria-label="Copy equation" className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white" onClick={() => { void navigator.clipboard?.writeText(`y = ${stretch} log_${base}(x - ${shiftX}) + ${shiftY}`); setCopiedEquation(true); window.setTimeout(() => setCopiedEquation(false), 1600); }}>
              {copiedEquation ? <Check className="h-5 w-5 text-lime-400" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-slate-700 sm:grid-cols-5" role="tablist" aria-label="Logarithmic function lesson views">
            {["Explore", "Key Features", "Transformations", "Inverse Relationship", "Examples"].map((tab) => (
              <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} aria-controls="logarithmic-tab-panel" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "h-10 border-b-2 border-violet-500 bg-violet-600/20 px-2 text-sm font-semibold text-white" : "h-10 px-2 text-sm font-medium text-slate-300 hover:bg-white/5"}>
                {tab}
              </button>
            ))}
          </div>

          <LogarithmicTabPanel activeTab={activeTab} base={base} stretch={stretch} shiftX={shiftX} shiftY={shiftY} />

          <div className="relative overflow-hidden rounded-md border border-slate-700 bg-[#0a1220]">
            <div className="absolute left-2 top-3 z-10 grid overflow-hidden rounded-lg border border-slate-600 bg-slate-900/90 text-slate-300">
              <button type="button" aria-pressed={graphMode === "select"} className={`grid h-10 w-10 place-items-center border-b border-slate-700 ${graphMode === "select" ? "bg-violet-500/20 text-violet-200" : "hover:bg-white/5"}`} title="Select" onClick={() => setGraphMode("select")}><MousePointer2 className="h-4 w-4" /></button>
              <button type="button" aria-pressed={graphMode === "drag"} className={`grid h-10 w-10 place-items-center border-b border-slate-700 ${graphMode === "drag" ? "bg-violet-500/20 text-violet-200" : "hover:bg-white/5"}`} title="Drag graph" aria-label="Drag graph" data-direct-interaction="true" onClick={() => setGraphMode("drag")}><Move className="h-4 w-4" /></button>
              <button type="button" className="relative grid h-10 w-10 place-items-center border-b border-slate-700 hover:bg-white/5" title="Zoom graph" aria-label="Zoom graph" onClick={() => setGraphZoom((current) => current >= 1.5 ? 1 : Number((current + 0.25).toFixed(2)))}><ZoomIn className="h-4 w-4" /><span className="absolute bottom-0.5 right-1 text-[8px] font-bold">{graphZoom}x</span></button>
              <button type="button" className="grid h-10 w-10 place-items-center hover:bg-white/5" title="Reset graph view" aria-label="Reset graph view" onClick={() => { setGraphMode("select"); setGraphZoom(1); setGraphPan({ x: 0, y: 0 }); }}><RotateCcw className="h-4 w-4" /></button>
            </div>
            <LogarithmicGraph base={base} stretch={stretch} shiftX={shiftX} shiftY={shiftY} showInverse={showInverse} mode={graphMode} zoom={graphZoom} pan={graphPan} dragStart={dragStart} onDragStart={setDragStart} onPan={setGraphPan} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,.85fr)]">
            <div className="overflow-hidden rounded-md border border-slate-700 bg-[#0c1422]">
              <div className="flex h-10 items-center justify-between border-b border-slate-700 px-3">
                <h2 className="text-xs font-semibold uppercase text-slate-300">Value table</h2>
                <span className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300">Smart values</span>
              </div>
              <div className="overflow-x-auto">
                <table id="function-mockup-table" className="w-full min-w-[560px] border-collapse text-center text-sm">
                  <thead className="font-serif text-slate-200"><tr><th className="border-b border-r border-slate-700 p-2 italic">x</th><th className="border-b border-r border-slate-700 p-2 text-violet-300">y = {stretch} log<sub>{base}</sub>(x - {shiftX}) + {shiftY}</th><th className="border-b border-r border-slate-700 p-2 text-lime-400">inverse y</th><th className="border-b border-slate-700 p-2">(x, y) on y = x</th></tr></thead>
                  <tbody>{values.map((row) => <tr key={row.x} className="text-slate-300"><td className="border-b border-r border-slate-800 p-1.5 font-semibold text-white">{row.x}</td><td className="border-b border-r border-slate-800 p-1.5 text-violet-300">{formatNumber(row.logY)}</td><td className="border-b border-r border-slate-800 p-1.5 text-lime-400">{formatNumber(row.inverseY)}</td><td className="border-b border-slate-800 p-1.5">({formatNumber(row.logY)}, {row.x})</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <div className="rounded-md border border-violet-500 bg-violet-500/[0.07] p-3 shadow-[0_0_24px_rgba(139,92,246,0.12)]">
              <div className="flex items-center justify-between text-xs uppercase text-violet-200"><span className="font-semibold">Challenge step <span className="text-slate-500">2 of 4</span></span><span>‹ &nbsp; ›</span></div>
              <p className="mt-4 text-sm text-slate-200">Move the sliders to match the target function.</p>
              <div className="mt-3 rounded-md border border-violet-400 bg-violet-500/10 p-3 text-center font-serif text-lg">Target: y = -log<sub>2</sub>(x + 2) - 1</div>
              <div className="mt-3 flex gap-2 text-amber-300"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs leading-5 text-slate-300"><strong className="text-amber-300">Hints</strong><br />Base 1/2 is less than 1, so the graph is decreasing. Shift left 2, down 1.</p></div>
              <div className="mt-3 flex gap-2"><button type="button" className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold" onClick={() => setChallengeChecked(true)}>Check Answer</button><button type="button" className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300" onClick={() => setShowSolution((current) => !current)}>{showSolution ? "Hide Solution" : "Show Solution"}</button></div>
              {challengeChecked ? <p className={`mt-3 rounded border p-2 text-xs leading-5 ${challengeMatched ? "border-lime-500/40 bg-lime-500/10 text-lime-200" : "border-amber-400/40 bg-amber-400/10 text-amber-200"}`}>{challengeMatched ? "Correct. The live graph matches the target function." : "Not matched yet. Set b = 2, a = -1, h = -2, and k = -1."}</p> : null}
              {showSolution ? <div className="mt-3 rounded border border-lime-500/40 bg-lime-500/10 p-2 text-xs leading-5 text-lime-200"><strong>Solution:</strong> y = -log<sub>2</sub>(x + 2) - 1 has asymptote x = -2, reflects across the x-axis, then shifts down 1.</div> : null}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-md border border-slate-700 bg-[#0c1422] p-3">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase text-slate-300">Parameters</h2><button type="button" onClick={resetParameters} className="flex items-center gap-1 text-xs text-slate-400"><RotateCcw className="h-3 w-3" /> Reset</button></div>
            <ParameterSlider label="Base" symbol="b" value={base} min={1.2} max={10} step={0.1} color="lime" onChange={(value) => { const before = base; setBase(value); emit("primary-control-base", before, value); }} />
            <ParameterSlider label="Stretch" symbol="a" value={stretch} min={-5} max={5} step={0.1} color="violet" onChange={(value) => { const before = stretch; setStretch(value); emit("primary-control-stretch", before, value); }} />
            <ParameterSlider label="Shift" symbol="h" value={shiftX} min={-5} max={5} step={0.1} color="orange" onChange={(value) => { const before = shiftX; setShiftX(value); emit("primary-control-shift-x", before, value); }} />
            <ParameterSlider label="Shift" symbol="k" value={shiftY} min={-5} max={5} step={0.1} color="cyan" onChange={(value) => { const before = shiftY; setShiftY(value); emit("primary-control-shift-y", before, value); }} />
          </div>

          <div className="rounded-md border border-slate-700 bg-[#0c1422] p-3">
            <h2 className="mb-2 text-xs font-semibold uppercase text-slate-300">Conceptual diagnostics</h2>
            {[["Slow growth", "Logarithmic functions grow slower than linear."], ["Vertical asymptote", "The graph approaches x = h but never crosses."], ["Inverse reflection", "The inverse is reflected across y = x."], ["Domain restriction", "Logarithm inputs must be positive."]].map(([title, copy], index) => <div key={title} className="grid grid-cols-[28px_1fr_24px] items-center gap-2 border-t border-slate-800 py-2 first:border-0"><span className={index === 1 ? "text-orange-400" : index === 2 ? "text-lime-400" : "text-violet-400"}>◉</span><div><p className="text-xs font-medium text-white">{title}</p><p className="mt-0.5 text-[11px] leading-4 text-slate-400">{copy}</p></div><CheckCircle2 className="h-5 w-5 text-lime-500" /></div>)}
          </div>

          <div className="min-h-48 rounded-md border border-slate-700 bg-[#0c1422] p-4">
            <h2 className="text-xs font-semibold uppercase text-slate-300">Quick check</h2>
            <p className="mt-5 text-sm text-slate-200">What is the domain of this function?</p>
            <div id="function-mockup-result" className="mt-4 flex items-center justify-between rounded-md border border-lime-500 bg-lime-500/[0.04] px-4 py-3 font-serif text-lg"><span>x &gt; {shiftX}</span><Check className="h-5 w-5 text-lime-400" /></div>
            <p className="mt-3 text-xs font-medium text-lime-400">Correct!</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function LogarithmicTabPanel({ activeTab, base, stretch, shiftX, shiftY }: { activeTab: string; base: number; stretch: number; shiftX: number; shiftY: number }) {
  if (activeTab === "Explore") {
    return (
      <div id="logarithmic-tab-panel" role="tabpanel" className="grid gap-2 rounded-md border border-slate-700 bg-[#0c1422] p-3 sm:grid-cols-3">
        <LessonFact label="Domain" value={`x > ${formatNumber(shiftX)}`} detail="Only positive logarithm inputs are allowed." tone="violet" />
        <LessonFact label="Vertical asymptote" value={`x = ${formatNumber(shiftX)}`} detail="The curve approaches this line but never touches it." tone="orange" />
        <LessonFact label="Live equation" value={`y = ${formatNumber(stretch)} log${formatNumber(base)}(x - ${formatNumber(shiftX)}) + ${formatNumber(shiftY)}`} detail="Use the controls to investigate each parameter." tone="cyan" />
      </div>
    );
  }

  if (activeTab === "Key Features") {
    return (
      <div id="logarithmic-tab-panel" role="tabpanel" className="rounded-md border border-slate-700 bg-[#0c1422] p-3">
        <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase text-violet-300">Key features</p><h2 className="text-lg font-semibold text-white">Read the graph before calculating</h2></div><span className="rounded border border-lime-500/50 bg-lime-500/10 px-3 py-1 text-xs text-lime-300">Increasing when b &gt; 1</span></div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <LessonFact label="Domain" value={`(${formatNumber(shiftX)}, infinity)`} detail="The logarithm input must remain positive." tone="violet" />
          <LessonFact label="Range" value="All real numbers" detail="The output can fall or rise without bound." tone="cyan" />
          <LessonFact label="Asymptote" value={`x = ${formatNumber(shiftX)}`} detail="A vertical boundary created by the horizontal shift." tone="orange" />
          <LessonFact label="Anchor point" value={`(${formatNumber(shiftX + 1)}, ${formatNumber(shiftY)})`} detail="Because log base b of 1 equals zero." tone="lime" />
        </div>
      </div>
    );
  }

  if (activeTab === "Transformations") {
    return (
      <div id="logarithmic-tab-panel" role="tabpanel" className="rounded-md border border-slate-700 bg-[#0c1422] p-3">
        <p className="text-[11px] font-semibold uppercase text-violet-300">Transformation sequence</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Build the current graph from y = log(x)</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <TransformationStep number="1" symbol="b" title={`Set base to ${formatNumber(base)}`} copy={base > 1 ? "The parent curve increases slowly." : "The parent curve decreases."} color="lime" />
          <TransformationStep number="2" symbol="h" title={`${shiftX >= 0 ? "Shift right" : "Shift left"} ${formatNumber(Math.abs(shiftX))}`} copy={`Moves the asymptote from x = 0 to x = ${formatNumber(shiftX)}.`} color="orange" />
          <TransformationStep number="3" symbol="a" title={`${Math.abs(stretch) >= 1 ? "Stretch" : "Compress"} by ${formatNumber(Math.abs(stretch))}`} copy={stretch < 0 ? "Also reflects across the x-axis." : "Scales every logarithmic output."} color="violet" />
          <TransformationStep number="4" symbol="k" title={`${shiftY >= 0 ? "Shift up" : "Shift down"} ${formatNumber(Math.abs(shiftY))}`} copy={`Moves every output and the anchor point vertically.`} color="cyan" />
        </div>
      </div>
    );
  }

  if (activeTab === "Inverse Relationship") {
    return (
      <div id="logarithmic-tab-panel" role="tabpanel" className="grid gap-3 rounded-md border border-slate-700 bg-[#0c1422] p-3 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-md border border-violet-500/40 bg-violet-500/10 p-3"><p className="text-[11px] font-semibold uppercase text-violet-300">Logarithmic form</p><p className="mt-2 font-serif text-lg text-white">y = {formatNumber(stretch)} log<sub>{formatNumber(base)}</sub>(x - {formatNumber(shiftX)}) + {formatNumber(shiftY)}</p><p className="mt-2 text-xs leading-5 text-slate-400">Input x produces output y.</p></div>
        <div className="grid place-items-center text-center"><span className="text-2xl text-lime-400">⇄</span><span className="text-[10px] uppercase text-slate-500">swap x and y</span></div>
        <div className="rounded-md border border-lime-500/40 bg-lime-500/10 p-3"><p className="text-[11px] font-semibold uppercase text-lime-300">Inverse exponential form</p><p className="mt-2 font-serif text-lg text-white">y = {formatNumber(shiftX)} + {formatNumber(base)}<sup>(x - {formatNumber(shiftY)}) / {formatNumber(stretch)}</sup></p><p className="mt-2 text-xs leading-5 text-slate-400">Points reverse coordinates and reflect across y = x.</p></div>
      </div>
    );
  }

  return (
    <div id="logarithmic-tab-panel" role="tabpanel" className="rounded-md border border-slate-700 bg-[#0c1422] p-3">
      <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-[11px] font-semibold uppercase text-violet-300">Worked examples</p><h2 className="text-lg font-semibold text-white">Convert, evaluate, and transform</h2></div><span className="text-xs text-slate-400">Three common logarithm tasks</span></div>
      <div className="mt-3 grid gap-2 lg:grid-cols-3">
        <WorkedExample number="1" title="Convert to exponential form" question="log₂(8) = 3" steps={["Base 2 raised to the output 3", "2³ = 8", "So log₂(8) = 3"]} answer="3" />
        <WorkedExample number="2" title="Solve a logarithmic equation" question="log₂(x - 1) = 2" steps={["Rewrite as x - 1 = 2²", "x - 1 = 4", "Add 1 to both sides"]} answer="x = 5" />
        <WorkedExample number="3" title="Identify transformations" question="y = -log₂(x + 2) - 1" steps={["Shift left 2", "Reflect across the x-axis", "Shift down 1"]} answer="asymptote x = -2" />
      </div>
    </div>
  );
}

function LessonFact({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "violet" | "orange" | "cyan" | "lime" }) {
  const tones = { violet: "border-violet-500/35 bg-violet-500/[0.07] text-violet-300", orange: "border-orange-400/35 bg-orange-400/[0.07] text-orange-300", cyan: "border-cyan-400/35 bg-cyan-400/[0.07] text-cyan-300", lime: "border-lime-500/35 bg-lime-500/[0.07] text-lime-300" };
  return <article className={`rounded-md border p-3 ${tones[tone]}`}><p className="text-[10px] font-semibold uppercase">{label}</p><p className="mt-1 font-serif text-base text-white">{value}</p><p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p></article>;
}

function TransformationStep({ number, symbol, title, copy, color }: { number: string; symbol: string; title: string; copy: string; color: "lime" | "orange" | "violet" | "cyan" }) {
  const tones = { lime: "border-lime-500/40 text-lime-300", orange: "border-orange-400/40 text-orange-300", violet: "border-violet-500/40 text-violet-300", cyan: "border-cyan-400/40 text-cyan-300" };
  return <article className={`rounded-md border bg-slate-950/40 p-3 ${tones[color]}`}><div className="flex items-center justify-between"><span className="grid h-6 w-6 place-items-center rounded-full border border-current text-xs font-bold">{number}</span><i className="font-serif text-lg">{symbol}</i></div><h3 className="mt-3 text-sm font-semibold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></article>;
}

function WorkedExample({ number, title, question, steps, answer }: { number: string; title: string; question: string; steps: string[]; answer: string }) {
  return <article className="rounded-md border border-slate-700 bg-slate-950/50 p-3"><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white">{number}</span><h3 className="text-sm font-semibold text-white">{title}</h3></div><p className="mt-3 rounded border border-slate-700 bg-slate-900 p-2 text-center font-serif text-lg text-violet-200">{question}</p><ol className="mt-3 space-y-1 text-xs leading-5 text-slate-400">{steps.map((step, index) => <li key={step}><span className="mr-2 text-slate-600">{index + 1}.</span>{step}</li>)}</ol><p className="mt-3 rounded border border-lime-500/40 bg-lime-500/10 px-3 py-2 text-sm font-semibold text-lime-300">Answer: {answer}</p></article>;
}

function ParameterSlider({ label, symbol, value, min, max, step, color, onChange }: { label: string; symbol: string; value: number; min: number; max: number; step: number; color: "lime" | "violet" | "orange" | "cyan"; onChange: (value: number) => void }) {
  const accents = { lime: "accent-lime-500 text-lime-400", violet: "accent-violet-500 text-violet-400", orange: "accent-orange-400 text-orange-300", cyan: "accent-cyan-400 text-cyan-300" };
  return <label className="mb-4 block last:mb-0"><span className="flex items-center justify-between text-sm"><span>{label} <i className={accents[color]}>{symbol}</i> = {formatNumber(value)}</span><input type="number" aria-label={`${label} ${symbol}`} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-8 w-12 rounded-md border border-slate-700 bg-slate-950 text-center text-sm text-white" /></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className={`mt-2 w-full ${accents[color].split(" ")[0]}`} /><span className="flex justify-between text-[10px] text-slate-500"><span>{min}</span><span>{max}</span></span></label>;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value - Math.round(value)) < 0.0005) return String(Math.round(value));
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function LogarithmicGraph({ base, stretch, shiftX, shiftY, showInverse, mode, zoom, pan, dragStart, onDragStart, onPan }: { base: number; stretch: number; shiftX: number; shiftY: number; showInverse: boolean; mode: "select" | "drag"; zoom: number; pan: { x: number; y: number }; dragStart: { clientX: number; clientY: number; panX: number; panY: number } | null; onDragStart: (value: { clientX: number; clientY: number; panX: number; panY: number } | null) => void; onPan: (value: { x: number; y: number }) => void }) {
  const width = 880;
  const height = 480;
  const margin = { left: 54, right: 18, top: 18, bottom: 38 };
  const xMin = -4;
  const xMax = 9;
  const yMin = -4;
  const yMax = 5.5;
  const sx = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
  const sy = (y: number) => margin.top + ((yMax - y) / (yMax - yMin)) * (height - margin.top - margin.bottom);
  const logPoints: string[] = [];
  for (let x = shiftX + 0.02; x <= xMax; x += 0.035) {
    const y = stretch * Math.log(x - shiftX) / Math.log(base) + shiftY;
    if (Number.isFinite(y) && y >= yMin - 1 && y <= yMax + 1) logPoints.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  const inversePoints: string[] = [];
  for (let x = xMin; x <= xMax; x += 0.04) {
    const y = shiftX + base ** ((x - shiftY) / stretch);
    if (Number.isFinite(y) && y >= yMin - 1 && y <= yMax + 1) inversePoints.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  const sampleXs = [shiftX + 0.5, shiftX + 1, shiftX + 2, shiftX + 4, shiftX + 8].filter((x) => x <= xMax);
  const visibleWidth = width / zoom;
  const visibleHeight = height / zoom;
  const viewX = (width - visibleWidth) / 2 + pan.x;
  const viewY = (height - visibleHeight) / 2 + pan.y;
  const beginDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (mode !== "drag") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onDragStart({ clientX: event.clientX, clientY: event.clientY, panX: pan.x, panY: pan.y });
  };
  const moveDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (mode !== "drag" || !dragStart) return;
    onPan({ x: dragStart.panX - (event.clientX - dragStart.clientX) / zoom, y: dragStart.panY - (event.clientY - dragStart.clientY) / zoom });
  };
  return <svg id="function-mockup-graph" viewBox={`${viewX} ${viewY} ${visibleWidth} ${visibleHeight}`} className={`block min-h-[360px] w-full touch-none select-none ${mode === "drag" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"}`} role="img" aria-label="Interactive logarithmic function and inverse exponential graph" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={() => onDragStart(null)} onPointerCancel={() => onDragStart(null)}>
    <defs><pattern id="log-grid-minor" width="31.08" height="44.63" patternUnits="userSpaceOnUse"><path d="M31.08 0H0V44.63" fill="none" stroke="#1c2a3b" strokeWidth="1" /></pattern><pattern id="log-domain-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="#312e81" strokeWidth="2" opacity=".35" /></pattern></defs>
    <rect width={width} height={height} fill="#08111e" /><rect x={margin.left} y={margin.top} width={width-margin.left-margin.right} height={height-margin.top-margin.bottom} fill="url(#log-grid-minor)" />
    <rect x={margin.left} y={margin.top} width={Math.max(0, sx(shiftX)-margin.left)} height={height-margin.top-margin.bottom} fill="url(#log-domain-hatch)" />
    {Array.from({ length: 14 }, (_, index) => xMin + index).map((x) => <g key={`x-${x}`}><line x1={sx(x)} y1={sy(yMin)} x2={sx(x)} y2={sy(yMax)} stroke={x === 0 ? "#d7e1ed" : "#243246"} strokeWidth={x === 0 ? 1.6 : 1} strokeDasharray={x === 0 ? undefined : "2 3"} /><text x={sx(x)} y={sy(0)+20} textAnchor="middle" fill="#d7e1ed" fontSize="14">{x}</text></g>)}
    {Array.from({ length: 10 }, (_, index) => yMin + index).map((y) => <g key={`y-${y}`}><line x1={sx(xMin)} y1={sy(y)} x2={sx(xMax)} y2={sy(y)} stroke={y === 0 ? "#d7e1ed" : "#243246"} strokeWidth={y === 0 ? 1.6 : 1} strokeDasharray={y === 0 ? undefined : "2 3"} /><text x={sx(0)-10} y={sy(y)+5} textAnchor="end" fill="#d7e1ed" fontSize="14">{y}</text></g>)}
    <line x1={sx(shiftX)} y1={margin.top} x2={sx(shiftX)} y2={height-margin.bottom} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="7 5" />
    <polyline points={logPoints.join(" ")} fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    {showInverse ? <><line x1={sx(xMin)} y1={sy(xMin)} x2={sx(5.5)} y2={sy(5.5)} stroke="#94a3b8" strokeWidth="2" strokeDasharray="7 5" /><polyline points={inversePoints.join(" ")} fill="none" stroke="#74c442" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></> : null}
    <text x={sx(-2.7)} y={sy(2.35)} fill="#b267ff" fontFamily="serif" fontSize="22" fontWeight="700">Domain: x &gt; {formatNumber(shiftX)}</text>
    <g><rect x={sx(-2.45)} y={sy(1.85)} width="150" height="52" rx="7" fill="#151126" stroke="#a855f7" /><text x={sx(-2.35)} y={sy(1.5)} fill="#c4b5fd" fontSize="13">Undefined input</text><text x={sx(-2.35)} y={sy(1.05)} fill="#c4b5fd" fontSize="11">LOG_DOMAIN_REQUIRED</text></g>
    <g><rect x={sx(-1.75)} y="22" width="150" height="54" rx="8" fill="#1d1820" stroke="#f59e0b" /><text x={sx(-1.62)} y="43" fill="#fbbf24" fontSize="14">Vertical asymptote</text><text x={sx(-0.85)} y="64" textAnchor="middle" fill="#fbbf24" fontFamily="serif" fontSize="16">x = {formatNumber(shiftX)}</text></g>
    {sampleXs.map((x) => { const y=stretch*Math.log(x-shiftX)/Math.log(base)+shiftY; return <g key={x}><circle cx={sx(x)} cy={sy(y)} r="6" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="2" /><text x={sx(x)+8} y={sy(y)-12} fill="#c084fc" fontFamily="serif" fontSize="16">({formatNumber(x)}, {formatNumber(y)})</text></g>; })}
    {showInverse ? <><g><rect x={sx(4.3)} y={sy(2.7)} width="130" height="60" rx="7" fill="#102015" stroke="#74c442" /><text x={sx(5.35)} y={sy(2.3)} textAnchor="middle" fill="#a3e635" fontSize="14">Reflect across</text><text x={sx(5.35)} y={sy(1.85)} textAnchor="middle" fill="#a3e635" fontFamily="serif" fontSize="17">y = x</text></g><text x={sx(3.3)} y={sy(-2.25)} fill="#a3e635" fontFamily="serif" fontSize="18">y = {formatNumber(shiftX)} + {formatNumber(base)}^((x - {formatNumber(shiftY)})/{formatNumber(stretch)})</text></> : null}
    <text x={width-28} y={sy(0)+22} fill="#fff" fontFamily="serif" fontSize="18">x</text><text x={sx(0)+14} y="30" fill="#fff" fontFamily="serif" fontSize="18">y</text>
  </svg>;
}

export default function FunctionMockupLesson(props: LessonAdapterProps) {
  if (props.lesson.id === 143) return <LogarithmicFunctionsLesson {...props} />;
  return <FunctionFamilyLesson {...props} />;
}

function FunctionFamilyLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = functionMockupSpecFor(lesson.id);
  const [probe, setProbe] = useState(2);
  const [variant, setVariant] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setProbe(2);
    setVariant(0);
    setShowAnswer(false);
  }, [lesson.id, resetToken]);

  const values = useMemo(() => functionValues(spec.visual, probe), [probe, spec.visual]);
  const dark = spec.theme === "dark";
  const shell = dark
    ? "rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-2xl shadow-slate-950/30"
    : "rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-lg shadow-slate-950/5";
  const panel = dark
    ? "rounded-xl border border-slate-700 bg-slate-900/80 p-4"
    : "rounded-xl border border-slate-200 bg-white p-4";
  const softPanel = dark
    ? "rounded-xl border border-slate-700 bg-slate-900/70 p-3"
    : "rounded-xl border border-slate-200 bg-slate-50 p-3";

  const record = (controlId: string, after: unknown) => {
    onInteraction(
      createLessonInteractionEvent({
        controlId,
        kind: controlId.includes("toggle") ? "toggle" : "slider",
        before: { probe, variant, showAnswer },
        after,
        affectedOutputs: ["function-mockup-graph", "function-mockup-table", "function-mockup-result"],
      }),
    );
  };

  return (
    <section className={shell} data-testid={`function-mockup-${spec.mockupId}`} data-direct-interaction="true">
      <p className="sr-only">Drag graph. {functionContractSnippet(lesson.id)}</p>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={dark ? "text-xs font-black uppercase text-cyan-300" : "text-xs font-black uppercase text-cyan-700"}>
            Interactive function lab
          </p>
          <h2 className="mt-1 text-3xl font-black">{spec.title}</h2>
          <p className={dark ? "mt-1 max-w-3xl text-sm font-semibold text-slate-300" : "mt-1 max-w-3xl text-sm font-semibold text-slate-600"}>
            {spec.subtitle}
          </p>
        </div>
        <div className={dark ? "rounded-xl bg-violet-500/20 px-4 py-3 font-mono text-sm font-black text-violet-100" : "rounded-xl bg-violet-50 px-4 py-3 font-mono text-sm font-black text-violet-800"}>
          {spec.formula}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {spec.tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setVariant(index);
              record("function-view-toggle", { variant: index, tab });
            }}
            className={index === variant
              ? "rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-black text-white"
              : dark
                ? "rounded-full border border-slate-700 px-3 py-1.5 text-xs font-black text-slate-300"
                : "rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600"}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className={panel}>
          <h3 className="text-lg font-black">{spec.leftTitle}</h3>
          <div className="mt-3 space-y-3">
            {spec.leftCards.map((card) => (
              <div key={card} className={softPanel}>
                <p className="text-sm font-black leading-5">{card}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {spec.controls.map(([label, value], index) => (
              <label key={label} className="block text-xs font-black uppercase tracking-wide">
                <span className="flex justify-between gap-2">
                  <span>{label}</span>
                  <span className="font-mono">{index === 0 ? values.output : value}</span>
                </span>
                <input
                  aria-label={`${spec.title} ${label}`}
                  type="range"
                  min="-4"
                  max="6"
                  step="0.1"
                  value={probe}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setProbe(next);
                    record("function-probe-slider", { probe: next, output: functionValues(spec.visual, next).output });
                  }}
                  className="mt-2 w-full accent-cyan-500"
                />
              </label>
            ))}
          </div>
        </aside>

        <main className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={dark ? "text-xs font-black uppercase text-violet-300" : "text-xs font-black uppercase text-violet-700"}>Graph workspace</p>
              <h3 className="font-mono text-xl font-black">{spec.result}</h3>
            </div>
            <output id="function-mockup-result" className={dark ? "rounded-xl bg-emerald-400/10 px-3 py-2 font-mono text-sm font-black text-emerald-100" : "rounded-xl bg-emerald-50 px-3 py-2 font-mono text-sm font-black text-emerald-800"}>
              x = {probe.toFixed(1)}, y = {values.output}
            </output>
          </div>
          <FunctionGraph spec={spec} probe={probe} values={values} />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {spec.table.map(([a, b, c]) => (
              <div key={a} className={softPanel}>
                <p className={dark ? "text-xs font-black uppercase text-slate-400" : "text-xs font-black uppercase text-slate-500"}>{a}</p>
                <p className="mt-1 font-mono text-lg font-black">{b}</p>
                <p className={dark ? "mt-1 text-xs font-semibold text-slate-300" : "mt-1 text-xs font-semibold text-slate-600"}>{c}</p>
              </div>
            ))}
          </div>
        </main>

        <aside className="space-y-3">
          <div className={panel}>
            <h3 className="text-lg font-black">{spec.rightTitle}</h3>
            <div className="mt-3 space-y-3">
              {spec.rightCards.map((card) => (
                <p key={card} className={softPanel}>{card}</p>
              ))}
            </div>
          </div>
          <div className={dark ? "rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100" : "rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"}>
            <p className="text-sm font-black">Common misconception</p>
            <p className="mt-2 text-sm font-semibold leading-6">{spec.warning}</p>
          </div>
          <div className={dark ? "rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100" : "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"}>
            <p className="text-sm font-black">Quick check</p>
            <p className="mt-2 text-sm font-semibold">{spec.quickCheck}</p>
            <button
              type="button"
              className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-black text-white"
              onClick={() => {
                setShowAnswer((current) => !current);
                record("function-answer-toggle", { showAnswer: !showAnswer });
              }}
            >
              {showAnswer ? "Hide answer" : "Show answer"}
            </button>
            {showAnswer ? <p className="mt-3 rounded-lg bg-white/80 p-3 font-mono text-sm font-black text-emerald-900">{spec.quickAnswer}</p> : null}
          </div>
        </aside>
      </div>

      <div className={dark ? "mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-cyan-100" : "mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950"}>
        <p className="text-sm font-black">Key insight</p>
        <p className="mt-1 text-sm font-semibold">{spec.insight}</p>
      </div>
    </section>
  );
}

function FunctionGraph({ spec, probe, values }: { spec: FunctionMockupSpec; probe: number; values: { output: string; y: number } }) {
  const dark = spec.theme === "dark";
  const bg = dark ? "#0f172a" : "#ffffff";
  const grid = dark ? "#1e293b" : "#e2e8f0";
  const axis = dark ? "#94a3b8" : "#475569";
  const accent = dark ? "#a855f7" : "#2563eb";
  const second = dark ? "#22d3ee" : "#06b6d4";
  const probeX = 285 + probe * 38;
  const probeY = 185 - values.y * 22;
  return (
    <svg viewBox="0 0 640 390" className="mt-4 w-full rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700" role="img" aria-label={`${spec.title} reference-style graph`}>
      <rect width="640" height="390" fill={bg} />
      {Array.from({ length: 21 }, (_, index) => <line key={`v-${index}`} x1={20 + index * 30} y1="20" x2={20 + index * 30} y2="355" stroke={grid} />)}
      {Array.from({ length: 12 }, (_, index) => <line key={`h-${index}`} x1="35" y1={35 + index * 30} x2="610" y2={35 + index * 30} stroke={grid} />)}
      <line x1="40" y1="185" x2="610" y2="185" stroke={axis} strokeWidth="2" />
      <line x1="285" y1="35" x2="285" y2="350" stroke={axis} strokeWidth="2" />
      {renderFunctionShape(spec.visual, accent, second, dark)}
      <line x1={probeX} y1="40" x2={probeX} y2="340" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" />
      <circle cx={probeX} cy={Math.max(42, Math.min(338, probeY))} r="10" fill="#f59e0b" stroke={dark ? "#0f172a" : "#fff"} strokeWidth="3" />
      <text x={Math.min(510, probeX + 14)} y={Math.max(58, Math.min(330, probeY - 12))} fill={dark ? "#fef3c7" : "#92400e"} fontWeight="900">
        {values.output}
      </text>
    </svg>
  );
}

function renderFunctionShape(kind: FunctionVisualKind, accent: string, second: string, dark: boolean) {
  if (kind === "logarithmic") return <><line x1="323" y1="45" x2="323" y2="342" stroke="#ef4444" strokeWidth="3" strokeDasharray="7 5" /><path d="M330 320 C345 245 370 205 410 170 S500 115 590 82" fill="none" stroke={accent} strokeWidth="5" /><path d="M285 330 C320 260 370 195 450 115 S535 55 595 35" fill="none" stroke={second} strokeWidth="3" opacity=".55" /><text x="338" y="72" fill="#ef4444" fontWeight="900">x = 1 asymptote</text></>;
  if (kind === "trigonometric") return <><circle cx="150" cy="160" r="82" fill="none" stroke={second} strokeWidth="4" /><line x1="150" y1="160" x2="212" y2="108" stroke="#f59e0b" strokeWidth="4" /><path d="M260 185 C310 60 360 60 410 185 S510 310 590 185" fill="none" stroke={accent} strokeWidth="5" /><line x1="260" y1="185" x2="590" y2="185" stroke={dark ? "#334155" : "#cbd5e1"} strokeWidth="3" /><text x="118" y="258" fill={second} fontWeight="900">unit circle</text></>;
  if (kind === "hyperbolic") return <><path d="M65 320 C155 292 235 225 295 185 S410 78 590 50" fill="none" stroke={accent} strokeWidth="5" /><path d="M65 50 C155 78 235 145 295 185 S410 292 590 320" fill="none" stroke={second} strokeWidth="4" /><path d="M65 300 C185 275 260 235 330 185 S470 95 590 70" fill="none" stroke="#f97316" strokeWidth="4" /><text x="72" y="75" fill={second} fontWeight="900">cosh</text><text x="520" y="72" fill={accent} fontWeight="900">sinh</text></>;
  if (kind === "floor" || kind === "ceiling") {
    const closedAtLeft = kind === "floor";
    return <>{Array.from({ length: 7 }, (_, index) => {
      const x = 75 + index * 75;
      const y = kind === "floor" ? 285 - index * 34 : 300 - index * 34;
      return <g key={index}><line x1={x} y1={y} x2={x + 64} y2={y} stroke={accent} strokeWidth="5" /><circle cx={x} cy={y} r="7" fill={closedAtLeft ? accent : bgColor(dark)} stroke={accent} strokeWidth="3" /><circle cx={x + 64} cy={y} r="7" fill={closedAtLeft ? bgColor(dark) : accent} stroke={accent} strokeWidth="3" /></g>;
    })}<text x="390" y="92" fill="#f59e0b" fontWeight="900">{kind === "floor" ? "[2,3) maps to 2" : "2 < x <= 3 maps to 3"}</text></>;
  }
  if (kind === "sign") return <><line x1="70" y1="235" x2="280" y2="235" stroke="#ef4444" strokeWidth="6" /><line x1="292" y1="185" x2="305" y2="185" stroke="#f59e0b" strokeWidth="8" /><line x1="315" y1="135" x2="565" y2="135" stroke={accent} strokeWidth="6" /><circle cx="285" cy="185" r="9" fill="#f59e0b" /><text x="80" y="224" fill="#ef4444" fontWeight="900">negative {"->"} -1</text><text x="390" y="124" fill={accent} fontWeight="900">positive {"->"} 1</text></>;
  if (kind === "piecewise") return <><path d="M70 255 L270 185" fill="none" stroke="#8b5cf6" strokeWidth="5" /><path d="M285 245 C330 120 385 120 430 245" fill="none" stroke={second} strokeWidth="5" /><line x1="440" y1="118" x2="590" y2="118" stroke="#f97316" strokeWidth="5" /><line x1="285" y1="48" x2="285" y2="340" stroke="#f59e0b" strokeDasharray="6 6" /><line x1="435" y1="48" x2="435" y2="340" stroke="#f59e0b" strokeDasharray="6 6" /></>;
  if (kind === "composite") return <><path d="M80 305 C155 90 260 90 335 305" fill="none" stroke={accent} strokeWidth="5" /><path d="M145 310 C215 250 280 175 335 88 S455 75 560 122" fill="none" stroke={second} strokeWidth="4" /><text x="78" y="72" fill="#f59e0b" fontWeight="900">x {"->"} g(x) {"->"} f(g(x))</text><line x1="270" y1="220" x2="345" y2="128" stroke="#f59e0b" strokeWidth="4" markerEnd="url(#arrow)" /></>;
  if (kind === "inverse") return <><line x1="65" y1="330" x2="590" y2="55" stroke="#94a3b8" strokeWidth="3" strokeDasharray="7 6" /><line x1="90" y1="295" x2="565" y2="60" stroke={accent} strokeWidth="5" /><line x1="85" y1="330" x2="545" y2="112" stroke={second} strokeWidth="4" opacity=".65" /><circle cx="380" cy="152" r="9" fill="#f59e0b" /><circle cx="455" cy="112" r="9" fill="#f59e0b" /><text x="405" y="96" fill="#f59e0b" fontWeight="900">(2,5) {"<->"} (5,2)</text></>;
  return <><path d="M92 300 C180 40 390 40 478 300" fill="none" stroke={accent} strokeWidth="5" /><path d="M94 310 C210 275 305 96 365 88 S495 215 560 60" fill="none" stroke="#f97316" strokeWidth="4" opacity=".6" /><line x1="285" y1="40" x2="285" y2="335" stroke={second} strokeWidth="3" strokeDasharray="7 6" /><text x="90" y="78" fill={accent} fontWeight="900">even: y-axis mirror</text></>;
}

function bgColor(dark: boolean) {
  return dark ? "#0f172a" : "#ffffff";
}

function functionValues(kind: FunctionVisualKind, probe: number) {
  let y = 1;
  if (kind === "logarithmic") y = probe <= 1.05 ? -3 : 2 * Math.log2(probe - 1) + 1;
  else if (kind === "trigonometric") y = 2 * Math.sin(probe) + 0.5;
  else if (kind === "hyperbolic") y = Math.sinh(probe / 2);
  else if (kind === "floor") y = Math.floor(probe);
  else if (kind === "ceiling") y = Math.ceil(probe);
  else if (kind === "sign") y = probe < 0 ? -1 : probe > 0 ? 1 : 0;
  else if (kind === "piecewise") y = probe < 0 ? -probe - 1 : probe < 2 ? probe * probe : 3;
  else if (kind === "composite") y = (probe + 1) ** 2;
  else if (kind === "inverse") y = 2 * probe + 1;
  else y = probe ** 2;
  return { y, output: Number.isInteger(y) ? String(y) : y.toFixed(2) };
}

function functionContractSnippet(lessonId: number) {
  return ({
    144: "repeats with a period",
    145: "not periodic like cosine",
    146: "outputs step down to integers",
    147: "outputs step up to integers",
    148: "outputs are -1, 0, or 1",
    149: "choose only the rule",
    150: "inner output becomes the outer input",
    151: "inputs and outputs reverse",
    152: "f(-x)=f(x)",
  } as Record<number, string>)[lessonId] ?? "Drag graph";
}

function functionMockupSpecFor(lessonId: number): FunctionMockupSpec {
  const specs: Record<number, FunctionMockupSpec> = {
    143: spec("0200", "Logarithmic Functions", "Explore domain, vertical asymptote, inverse exponential reflection, and transformed log outputs.", "y = 2 log2(x - 1) + 1", "x > 1", "dark", "logarithmic", ["Graph", "Domain", "Inverse", "Diagnostics"], "Domain and asymptote", ["Vertical asymptote: x = 1", "Input inside log must be positive", "Inverse exponential shown as ghost curve"], "Transformation controls", ["base b = 2", "horizontal shift h = 1", "vertical shift k = 1"], [["Domain", "x > 1", "left of x=1 is blocked"], ["Asymptote", "x = 1", "curve approaches but never touches"], ["Point", "(3, 3)", "because log2(2)=1"]], "A logarithmic graph is controlled first by its allowed input. The shift moves the vertical asymptote before any output scaling happens.", "Do not take the log of zero or a negative input.", "Why is x = 1 not allowed?", "Because x - 1 = 0 and log(0) is undefined."),
    144: spec("0201", "Trigonometric Functions", "Link unit-circle rotation, amplitude, midline, and the repeating sine wave.", "y = 2 sin(x) + 0.5", "period = 2pi", "dark", "trigonometric", ["Unit circle", "Wave", "Table", "Period"], "Angle tracker", ["theta measured in radians", "Amplitude = 2", "Midline y = 0.5"], "Wave controls", ["amplitude slider", "phase offset", "period ruler"], [["Angle", "pi / 3", "unit-circle point"], ["Output", "2.23", "sin scaled then shifted"], ["Period", "2pi", "cycle repeats"]], "The sine graph repeats because the angle returns to the same unit-circle position after one full turn.", "Do not treat degrees and radians as interchangeable labels.", "What controls the wave height?", "The amplitude."),
    145: spec("0202", "Hyperbolic Functions", "Compare sinh, cosh, and tanh through exponential growth and the unit-hyperbola idea.", "sinh(t), cosh(t), tanh(t)", "not periodic", "dark", "hyperbolic", ["Curves", "Exponential form", "Identity", "Compare"], "Hyperbolic family", ["cosh is even", "sinh is odd", "tanh is bounded between -1 and 1"], "Definition stack", ["sinh t = (e^t - e^-t)/2", "cosh t = (e^t + e^-t)/2", "cosh^2 t - sinh^2 t = 1"], [["sinh", "growth curve", "odd symmetry"], ["cosh", "catenary", "even symmetry"], ["tanh", "S-shaped", "horizontal bounds"]], "Hyperbolic functions use exponentials. Their names resemble trig functions, but their graphs do not cycle.", "cosh is not cosine and does not repeat periodically.", "Is cosh periodic like cosine?", "No. cosh grows and does not repeat."),
    146: spec("0203", "Floor Function", "Read the greatest integer less than or equal to x from a step graph.", "y = floor(x)", "floor(2.73) = 2", "dark", "floor", ["Step graph", "Intervals", "Table", "Challenge"], "Step interval", ["Highlighted interval [2, 3)", "Closed dot on the left", "Open dot on the right"], "Input probe", ["x = 2.73", "output = 2", "negative values move downward"], [["Input", "2.73", "lies in [2, 3)"], ["Output", "2", "greatest integer below"], ["Boundary", "3", "jumps to 3"]], "Floor functions make horizontal steps. Every input in one interval maps to the same integer.", "For negative numbers, floor(-1.2) is -2, not -1.", "What is floor(-1.2)?", "-2."),
    147: spec("0204", "Ceiling Function", "Find the least integer greater than or equal to x using upward step intervals.", "y = ceil(x)", "ceil(2.3) = 3", "light", "ceiling", ["Graph", "Intervals", "Evaluate", "Boundary"], "Ceiling interval", ["2 < x <= 3 maps to 3", "Open dot on the left", "Closed dot on the right"], "Step controls", ["input x", "vertical shift", "table rows"], [["Input", "2.3", "between 2 and 3"], ["Output", "3", "least integer above"], ["Use case", "buses/pages", "partial needs a whole"]], "Ceiling answers how many whole groups are needed when any remainder remains.", "Ceiling is not ordinary rounding; it always rounds up to cover the amount.", "What is ceil(3.2)?", "4."),
    148: spec("0205", "Sign Function", "Classify negative, zero, and positive inputs while ignoring magnitude.", "y = sgn(x)", "sgn(-2.4) = -1", "light", "sign", ["Graph", "Cases", "Threshold", "Check"], "Three output cases", ["x < 0 gives -1", "x = 0 gives 0", "x > 0 gives 1"], "Classifier controls", ["input x", "threshold marker", "case highlight"], [["Negative", "-8", "output -1"], ["Zero", "0", "output 0"], ["Positive", "5", "output 1"]], "The sign function keeps direction and discards size.", "sign(-8) is -1, not -8.", "What is sign(-8)?", "-1."),
    149: spec("0206", "Piecewise Functions", "Choose the correct rule by checking which condition contains the input.", "f(x) = {-x-1, x^2, 3}", "x = 1.4 active rule", "light", "piecewise", ["Rules", "Graph", "Boundaries", "Evaluate"], "Rule cards", ["x < 0: use -x - 1", "0 <= x < 2: use x^2", "x >= 2: use 3"], "Boundary controls", ["switch at x=0", "switch at x=2", "active segment"], [["Case 1", "x < 0", "line branch"], ["Case 2", "0 <= x < 2", "parabola branch"], ["Case 3", "x >= 2", "constant branch"]], "A piecewise function is still one function when exactly one rule applies to each input.", "Do not apply all rules to one input.", "For x=3, which rule is active?", "x >= 2, so f(x)=3."),
    150: spec("0207", "Composite Functions", "Follow the pipeline from x into the inner function and then into the outer function.", "g(x)=x+1, f(u)=u^2", "f(g(2)) = 9", "light", "composite", ["Pipeline", "Graph", "Order", "Check"], "Function pipeline", ["Start with x = 2", "Inner: g(2) = 3", "Outer: f(3) = 9"], "Order controls", ["f(g(x))", "g(f(x))", "inside first"], [["Input", "2", "goes into g"], ["Middle", "3", "output of g"], ["Output", "9", "f of middle value"]], "Composition is a pipeline: the inner output becomes the outer input.", "Reversing the order usually changes the answer.", "What is f(g(2))?", "9."),
    151: spec("0208", "Inverse Functions", "Reverse input-output pairs and reflect graphs across y = x.", "f(x)=2x+1, f^-1(x)=(x-1)/2", "f^-1(5)=2", "light", "inverse", ["Reflect", "Mapping", "Table", "Check"], "Input-output reversal", ["(2, 5) becomes (5, 2)", "Reflect across y = x", "One-to-one needed"], "Inverse controls", ["slope", "intercept", "reflection overlay"], [["Original", "f(2)=5", "point (2,5)"], ["Inverse", "f^-1(5)=2", "point (5,2)"], ["Check", "f^-1(f(x))=x", "undoes the rule"]], "An inverse function undoes a rule by reversing each input-output pair.", "Inverse does not mean reciprocal 1/f(x).", "What is the inverse of 2x+1?", "(x - 1) / 2."),
    152: spec("0209", "Even and Odd Functions", "Test f(-x) to decide y-axis symmetry, origin symmetry, or neither.", "even: f(-x)=f(x); odd: f(-x)=-f(x)", "verdict: even", "light", "symmetry", ["Even", "Odd", "Neither", "Test"], "Symmetry tests", ["Even: mirror over y-axis", "Odd: rotate around origin", "Neither: no matching symmetry"], "Comparison controls", ["test x", "show f(-x)", "symmetry overlay"], [["Even", "x^2", "f(-x)=f(x)"], ["Odd", "x^3", "f(-x)=-f(x)"], ["Neither", "x^2+x", "fails both"]], "The name even or odd is proved by substitution, not by guessing from the formula title.", "Always test f(-x); do not guess from the graph name.", "Is x^2 even or odd?", "Even."),
  };
  return specs[lessonId] ?? specs[143];
}

function spec(mockupId: string, title: string, subtitle: string, formula: string, result: string, theme: FunctionMockupTheme, visual: FunctionVisualKind, tabs: string[], leftTitle: string, leftCards: string[], rightTitle: string, rightCards: string[], table: [string, string, string][], insight: string, warning: string, quickCheck: string, quickAnswer: string): FunctionMockupSpec {
  return { mockupId, title, subtitle, formula, result, theme, visual, tabs, leftTitle, leftCards, rightTitle, rightCards, controls: [["Probe", "live"], ["Shape", "locked"]], table, insight, warning, quickCheck, quickAnswer };
}
