import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, { reusableEngineParamsFor } from "../components/ReusableLessonEngine";
import FunctionMockupLesson from "./graph/FunctionMockupLesson";
import FunctionConceptTargetLesson129 from "./FunctionConceptTargetLesson129";
import DomainRangeTargetLesson130 from "./DomainRangeTargetLesson130";
import FunctionNotationTargetLesson131 from "./FunctionNotationTargetLesson131";
import VerticalLineTestTargetLesson132 from "./VerticalLineTestTargetLesson132";
import LinearFunctionsTargetLesson133 from "./LinearFunctionsTargetLesson133";
import QuadraticFunctionsTargetLesson134 from "./QuadraticFunctionsTargetLesson134";
import CubicFunctionsTargetLesson135 from "./CubicFunctionsTargetLesson135";
import HigherDegreePolynomialsTargetLesson136 from "./HigherDegreePolynomialsTargetLesson136";
import ReciprocalFunctionsTargetLesson137 from "./ReciprocalFunctionsTargetLesson137";
import RationalFunctionsTargetLesson138 from "./RationalFunctionsTargetLesson138";
import SquareRootFunctionsTargetLesson139 from "./SquareRootFunctionsTargetLesson139";
import CubeRootFunctionsTargetLesson140 from "./CubeRootFunctionsTargetLesson140";
import AbsoluteValueFunctionsTargetLesson141 from "./AbsoluteValueFunctionsTargetLesson141";
import ExponentialFunctionsTargetLesson142 from "./ExponentialFunctionsTargetLesson142";
import LogarithmicFunctionsTargetLesson143 from "./LogarithmicFunctionsTargetLesson143";
import TrigonometricFunctionsTargetLesson144 from "./TrigonometricFunctionsTargetLesson144";
import HyperbolicFunctionsTargetLesson145 from "./HyperbolicFunctionsTargetLesson145";
import FloorFunctionTargetLesson146 from "./FloorFunctionTargetLesson146";
import CeilingFunctionTargetLesson147 from "./CeilingFunctionTargetLesson147";
import SignFunctionTargetLesson148 from "./SignFunctionTargetLesson148";
import PiecewiseFunctionsTargetLesson149 from "./PiecewiseFunctionsTargetLesson149";
import CompositeFunctionsTargetLesson150 from "./CompositeFunctionsTargetLesson150";
import InverseFunctionsTargetLesson151 from "./InverseFunctionsTargetLesson151";
import EvenOddFunctionsTargetLesson152 from "./EvenOddFunctionsTargetLesson152";
import IncreasingDecreasingTargetLesson153 from "./IncreasingDecreasingTargetLesson153";
import PeriodicFunctionsTargetLesson154 from "./PeriodicFunctionsTargetLesson154";
import { graphVisualPresetForLesson } from "../presets/graphVisualPresets";
import type { LessonAdapterProps } from "../types";
import { Eye, Grid3X3, Minus, Move, Plus, RotateCcw, Share2, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type GraphSpec = {
  title: string;
  purpose: string;
  value: string;
  equation: string;
  focus: string;
  left: string[];
  right: string[];
  warning: string;
  testSnippet: string;
  visual: "cartesian" | "functions" | "equation" | "inequality" | "parametric" | "polar" | "points" | "data" | "table" | "trace";
};

type TwoDTool = "coordinate" | "functions" | "equation" | "region" | "parametric" | "polar" | "points" | "data" | "table" | "trace" | "zoom" | "axis" | "grid" | "views" | "special" | "inspector" | "parameters" | "export";

type TwoDGraphSpec = GraphSpec & {
  mockupId: string;
  tool: TwoDTool;
  status: string;
  leftTitle: string;
  leftSteps: string[];
  rightTitle: string;
  controls: [string, string, string][];
  outputs: [string, string, string][];
  table: [string, string, string][];
  note: string;
};

export default function GraphLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 129) {
    return <FunctionConceptTargetLesson129 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 130) {
    return <DomainRangeTargetLesson130 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 131) {
    return <FunctionNotationTargetLesson131 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 132) {
    return <VerticalLineTestTargetLesson132 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 133) {
    return <LinearFunctionsTargetLesson133 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 134) {
    return <QuadraticFunctionsTargetLesson134 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 135) {
    return <CubicFunctionsTargetLesson135 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 136) {
    return <HigherDegreePolynomialsTargetLesson136 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 137) {
    return <ReciprocalFunctionsTargetLesson137 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 138) {
    return <RationalFunctionsTargetLesson138 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 139) {
    return <SquareRootFunctionsTargetLesson139 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 140) {
    return <CubeRootFunctionsTargetLesson140 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 141) {
    return <AbsoluteValueFunctionsTargetLesson141 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 142) {
    return <ExponentialFunctionsTargetLesson142 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 143) {
    return <LogarithmicFunctionsTargetLesson143 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 144) {
    return <TrigonometricFunctionsTargetLesson144 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 145) {
    return <HyperbolicFunctionsTargetLesson145 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 146) {
    return <FloorFunctionTargetLesson146 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 147) {
    return <CeilingFunctionTargetLesson147 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 148) {
    return <SignFunctionTargetLesson148 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 149) {
    return <PiecewiseFunctionsTargetLesson149 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 150) {
    return <CompositeFunctionsTargetLesson150 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 151) {
    return <InverseFunctionsTargetLesson151 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 152) {
    return <EvenOddFunctionsTargetLesson152 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 153) {
    return <IncreasingDecreasingTargetLesson153 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 154) {
    return <PeriodicFunctionsTargetLesson154 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  if (usesFunctionMockupWorkspace(lesson.id)) {
    return <FunctionMockupLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  if ((lesson.id >= 39 && lesson.id <= 56) || (lesson.id >= 129 && lesson.id <= 166)) {
    return <RedesignedGraphingLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  const params = graphVisualPresetForLesson(lesson.id) ?? reusableEngineParamsFor("graph-2d", lesson.title);
  return (
    <AdapterFrame title={`${lesson.title} - reusable 2D graph engine`} value={params.expression} footer="This lesson uses the shared graph engine in focused axis mode: no full workspace menus, only topic parameters and the graph area.">
      <ReusableLessonEngine engine="graph-2d" params={params} resetToken={resetToken} onInteraction={onInteraction} />
    </AdapterFrame>
  );
}

function usesFunctionMockupWorkspace(lessonId: number) {
  return lessonId >= 143 && lessonId <= 152 || lessonId === 153 || lessonId === 154 || (lessonId >= 156 && lessonId <= 162) || lessonId === 164;
}

function RedesignedGraphingLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [probe, setProbe] = useState(50);
  const [showHelper, setShowHelper] = useState(true);
  useEffect(() => { setProbe(50); setShowHelper(true); }, [lesson.id, resetToken]);

  if (lesson.id >= 39 && lesson.id <= 56) {
    return <TwoDGraphingMockupLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  const spec = graphSpecFor(lesson.id);

  return (
    <AdapterFrame title={`${lesson.title} graphing studio`} value={spec.value} footer={`${spec.title}: ${spec.warning}`}>
      <section className="grid gap-4 xl:grid-cols-[235px_minmax(0,1fr)_260px]" aria-label={`${spec.title} redesigned graphing calculator lesson`}>
        <aside className="space-y-3 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">2D graphing calculator</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{spec.title}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{spec.purpose}</p>
          </div>
          {spec.left.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-black text-slate-800 ring-1 ring-cyan-100 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10">{item}</p>)}
        </aside>

        <main className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">Graph workspace</p>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">{spec.equation}</h3>
              <p className="mt-1 text-sm font-black text-slate-600 dark:text-slate-300">{spec.focus}</p>
            </div>
            <span data-direct-interaction="true" className="rounded-2xl bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 ring-1 ring-cyan-100">Drag graph</span>
          </div>
          <div className="mt-4">{renderGraphVisual(spec, probe, showHelper)}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="rounded-2xl bg-slate-50 p-3 text-xs font-black uppercase text-slate-500 ring-1 ring-slate-200">Trace x-value probe<input aria-label={`${spec.title} x value probe`} type="range" min="0" max="100" value={probe} onChange={(event) => { setProbe(Number(event.target.value)); onInteraction(); }} className="mt-2 w-full accent-violet-600" /></label>
            <button type="button" className="action-secondary justify-center" onClick={() => { setShowHelper((value) => !value); onInteraction(); }}>{showHelper ? "Hide guides" : "Show guides"}</button>
            <button type="button" className="action-secondary justify-center" onClick={() => { setProbe(50); setShowHelper(true); onInteraction(); }}>Reset view</button>
          </div>
        </main>

        <aside className="space-y-3">
          {spec.right.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-950 ring-1 ring-emerald-100">{item}</p>)}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.warning}</div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 text-sm font-black leading-6 text-violet-950">{spec.testSnippet}</div>
        </aside>
      </section>
    </AdapterFrame>
  );
}

function TwoDGraphingMockupLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = twoDGraphSpecFor(lesson.id);
  const [primary, setPrimary] = useState(2);
  const [secondary, setSecondary] = useState(3);
  const [trace, setTrace] = useState(1.5);
  const [showGuides, setShowGuides] = useState(true);

  useEffect(() => {
    setPrimary(2);
    setSecondary(3);
    setTrace(1.5);
    setShowGuides(true);
  }, [lesson.id, resetToken]);

  const updateNumber = (field: "primary" | "secondary" | "trace", next: number) => {
    if (field === "primary") setPrimary(next);
    if (field === "secondary") setSecondary(next);
    if (field === "trace") setTrace(next);
    onInteraction();
  };

  const resetView = () => {
    setPrimary(2);
    setSecondary(3);
    setTrace(1.5);
    setShowGuides(true);
    onInteraction();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dbe6fb] bg-[#f8fbff] p-3 shadow-[0_18px_46px_rgba(15,23,42,.075)]" data-testid={`2d-graphing-mockup-${spec.mockupId}`}>
      <div className="grid gap-3 xl:grid-cols-[170px_minmax(0,1fr)_285px]">
        <aside className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-3 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#087b98]">{spec.leftTitle}</p>
          <h3 className="mt-1 text-xl font-black leading-tight text-[#081238]">{spec.value}</h3>
          <div className="mt-4 space-y-3">
            {spec.leftSteps.map((step, index) => (
              <div key={step} className="grid grid-cols-[24px_1fr] gap-2 text-sm font-black text-[#152348]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs text-white">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">{spec.note}</div>
        </aside>

        <main className="min-w-0 rounded-2xl border border-[#dbe6fb] bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-[#152348]">{spec.equation}</h3>
              <p className="mt-1 text-xs font-bold text-[#53627f]">{spec.focus}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <GraphAction icon={<RotateCcw className="h-4 w-4" />} label="Reset view" onClick={resetView} />
              <GraphAction icon={<ZoomIn className="h-4 w-4" />} label={spec.tool === "zoom" ? "Zoom fit" : "Fit"} onClick={() => updateNumber("trace", 1.5)} />
              <GraphAction icon={<Share2 className="h-4 w-4" />} label="Share" onClick={onInteraction} />
              <IconButton label="Move graph" onClick={onInteraction}><Move className="h-4 w-4" /></IconButton>
              <IconButton label="Toggle guides" onClick={() => { setShowGuides((value) => !value); onInteraction(); }}><Grid3X3 className="h-4 w-4" /></IconButton>
              <IconButton label="Inspector" onClick={onInteraction}><Eye className="h-4 w-4" /></IconButton>
            </div>
          </div>
          <div className="mt-3">
            <TwoDGraphCanvas spec={spec} primary={primary} secondary={secondary} trace={trace} showGuides={showGuides} />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {spec.outputs.map(([label, value, tone]) => <OutputCard key={label} label={label} value={value} tone={tone} />)}
          </div>
        </main>

        <aside className="space-y-3">
          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-3 shadow-sm">
            <p className="text-sm font-black text-[#081238]">{spec.rightTitle}</p>
            <div className="mt-3 space-y-3">
              {spec.controls.map(([label, value, tone], index) => (
                <GraphControl key={label} label={label} value={index === 0 ? primary : index === 1 ? secondary : trace} valueLabel={value} tone={tone} onChange={(next) => updateNumber(index === 0 ? "primary" : index === 1 ? "secondary" : "trace", next)} />
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-3 shadow-sm">
            <p className="text-sm font-black text-[#081238]">{spec.testSnippet}</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#dbe6fb]">
              <table className="w-full border-collapse text-left text-xs">
                <tbody>
                  {spec.table.map(([label, value, detail], index) => (
                    <tr key={`${label}-${value}-${index}`} className="border-b border-[#e6eefb] last:border-0">
                      <th className="w-20 bg-[#f8fbff] px-2 py-2 font-black text-[#53627f]">{label}</th>
                      <td className="px-2 py-2 font-black text-[#081238]">{value}</td>
                      <td className="px-2 py-2 font-semibold text-[#53627f]">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
        <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-3 shadow-sm">
          <p className="mb-2 text-sm font-black text-[#081238]">Sample values</p>
          <MiniValuesTable spec={spec} trace={trace} />
        </section>
        <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 text-sm font-bold leading-6 text-[#53627f] shadow-sm">
          <strong className="block text-[#081238]">{spec.warning}</strong>
          {spec.right.join(" · ")}
        </section>
      </div>
    </section>
  );
}

function GraphAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#dbe6fb] bg-white px-4 text-sm font-black text-[#152348] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50" onClick={onClick}>{icon}{label}</button>;
}

function IconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-xl border border-[#dbe6fb] bg-[#f8fbff] text-[#152348] transition hover:border-cyan-300 hover:bg-cyan-50" onClick={onClick}>{children}</button>;
}

function OutputCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  const color = tone === "violet" ? "border-violet-200 bg-violet-50 text-violet-900" : tone === "orange" ? "border-orange-200 bg-orange-50 text-orange-900" : "border-cyan-200 bg-cyan-50 text-cyan-950";
  return <div className={`rounded-xl border p-3 ${color}`}><p className="text-[10px] font-black uppercase">{label}</p><p className="mt-1 font-mono text-lg font-black">{value}</p></div>;
}

function GraphControl({ label, value, valueLabel, tone, onChange }: { label: string; value: number; valueLabel: string; tone: string; onChange: (value: number) => void }) {
  const accent = tone === "violet" ? "accent-violet-600" : tone === "orange" ? "accent-orange-500" : "accent-cyan-600";
  const buttonTone = tone === "violet" ? "text-violet-700" : tone === "orange" ? "text-orange-700" : "text-cyan-700";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black text-[#53627f]"><span>{label}</span><span>{valueLabel}</span></div>
      <input aria-label={label} type="range" min="-5" max="5" step="0.5" value={value} onChange={(event) => onChange(Number(event.target.value))} className={`w-full ${accent}`} />
      <div className="mt-2 grid grid-cols-[32px_1fr_32px] gap-2">
        <button type="button" className={`grid h-8 place-items-center rounded-lg border border-[#dbe6fb] bg-white ${buttonTone}`} onClick={() => onChange(Math.max(-5, value - 0.5))}><Minus className="h-4 w-4" /></button>
        <output className="grid h-8 place-items-center rounded-lg border border-[#dbe6fb] bg-[#f8fbff] font-mono text-sm font-black text-[#081238]">{value.toFixed(value % 1 ? 1 : 0)}</output>
        <button type="button" className={`grid h-8 place-items-center rounded-lg border border-[#dbe6fb] bg-white ${buttonTone}`} onClick={() => onChange(Math.min(5, value + 0.5))}><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function TwoDGraphCanvas({ spec, primary, secondary, trace, showGuides }: { spec: TwoDGraphSpec; primary: number; secondary: number; trace: number; showGuides: boolean }) {
  const x = 420 + trace * 48;
  const y = canvasY(spec.tool, trace, primary, secondary);
  return (
    <svg viewBox="0 0 720 520" className="block w-full rounded-2xl border border-[#dbe6fb] bg-white" role="img" aria-label={`${spec.title} graph workspace`}>
      <defs>
        <pattern id={`twod-grid-${spec.mockupId}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#e6eefb" strokeWidth="1" /></pattern>
        <marker id={`arrow-${spec.mockupId}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" /></marker>
      </defs>
      <rect width="720" height="520" fill={`url(#twod-grid-${spec.mockupId})`} />
      {showGuides ? <g opacity=".58">{Array.from({ length: 11 }, (_, index) => <text key={`x-${index}`} x={104 + index * 56} y="300" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1f2937">{index - 5}</text>)}{Array.from({ length: 9 }, (_, index) => <text key={`y-${index}`} x="354" y={84 + index * 48} textAnchor="end" fontSize="13" fontWeight="800" fill="#1f2937">{4 - index}</text>)}</g> : null}
      <line x1="74" y1="292" x2="680" y2="292" stroke="#2563eb" strokeWidth="3" markerEnd={`url(#arrow-${spec.mockupId})`} />
      <line x1="360" y1="478" x2="360" y2="42" stroke="#2563eb" strokeWidth="3" markerEnd={`url(#arrow-${spec.mockupId})`} />
      <text x="665" y="278" fontSize="16" fontWeight="900" fill="#081238">x</text>
      <text x="374" y="56" fontSize="16" fontWeight="900" fill="#081238">y</text>
      {renderTwoDGraphShape(spec.tool)}
      {showGuides ? <g><line x1={x} y1="64" x2={x} y2="454" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 8" /><circle cx={x} cy={y} r="10" fill="#14a8bd" /><text x={Math.min(600, x + 14)} y={y - 16} fontSize="18" fontWeight="900" fill="#0898b7">{spec.value}</text></g> : null}
    </svg>
  );
}

function renderTwoDGraphShape(tool: TwoDTool) {
  if (tool === "coordinate") return <><path d="M360 292 H470 V182" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 7" /><circle cx="470" cy="182" r="10" fill="#14a8bd" /><text x="486" y="176" fontSize="20" fontWeight="900" fill="#0898b7">P(2, 3)</text><text x="430" y="330" fontSize="15" fontWeight="900" fill="#7c3aed">x first</text><text x="490" y="238" fontSize="15" fontWeight="900" fill="#7c3aed">y second</text></>;
  if (tool === "functions") return <><path d="M110 80 C190 430 290 430 360 348 S500 24 612 82" fill="none" stroke="#0898b7" strokeWidth="5" /><line x1="95" y1="344" x2="650" y2="176" stroke="#7c3aed" strokeWidth="4" /><path d="M95 292 C170 220 246 410 330 318 S480 164 650 330" fill="none" stroke="#f97316" strokeWidth="4" /><text x="535" y="136" fontSize="18" fontWeight="900" fill="#0898b7">f(x)</text><text x="536" y="204" fontSize="18" fontWeight="900" fill="#7c3aed">g(x)</text></>;
  if (tool === "equation") return <><ellipse cx="360" cy="250" rx="180" ry="100" fill="none" stroke="#0898b7" strokeWidth="5" /><line x1="120" y1="430" x2="610" y2="76" stroke="#7c3aed" strokeWidth="4" /><circle cx="470" cy="190" r="9" fill="#f97316" /><text x="492" y="186" fontSize="17" fontWeight="900" fill="#081238">solution point</text></>;
  if (tool === "region") return <><polygon points="95,292 650,292 650,130 95,250" fill="#bae6fd" opacity=".85" /><polygon points="95,108 650,278 650,60 95,60" fill="#ddd6fe" opacity=".82" /><polygon points="320,206 650,130 650,278" fill="#5eead4" opacity=".8" /><line x1="95" y1="250" x2="650" y2="130" stroke="#0898b7" strokeWidth="4" /><line x1="95" y1="108" x2="650" y2="278" stroke="#7c3aed" strokeWidth="4" strokeDasharray="10 8" /></>;
  if (tool === "parametric") return <><ellipse cx="360" cy="260" rx="205" ry="116" fill="none" stroke="#0898b7" strokeWidth="5" /><path d="M120 260 C205 72 330 450 440 112 S600 386 638 260" fill="none" stroke="#f97316" strokeWidth="4" opacity=".65" /><circle cx="520" cy="170" r="10" fill="#7c3aed" /></>;
  if (tool === "polar") return <><circle cx="360" cy="260" r="54" fill="none" stroke="#dbe6fb" strokeWidth="3" /><circle cx="360" cy="260" r="106" fill="none" stroke="#dbe6fb" strokeWidth="3" /><circle cx="360" cy="260" r="158" fill="none" stroke="#dbe6fb" strokeWidth="3" /><path d="M360 260 C328 92 232 108 270 242 C145 250 180 366 336 318 C380 470 472 398 414 276 C570 238 512 114 388 222 Z" fill="none" stroke="#0898b7" strokeWidth="5" /><line x1="360" y1="260" x2="532" y2="102" stroke="#f97316" strokeWidth="4" /></>;
  if (tool === "points") return <><polyline points="230,244 286,168 416,202 540,102 594,292" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />{[[230,244,"A"],[286,168,"B"],[416,202,"C"],[540,102,"D"],[594,292,"E"]].map(([cx, cy, label]) => <g key={label}><circle cx={cx} cy={cy} r="10" fill={label === "C" ? "#f97316" : "#14a8bd"} /><text x={Number(cx) + 13} y={Number(cy) - 11} fontSize="16" fontWeight="900" fill="#081238">{label}</text></g>)}</>;
  if (tool === "data") return <><line x1="120" y1="420" x2="628" y2="110" stroke="#7c3aed" strokeWidth="4" />{[[128,392],[176,360],[224,338],[272,298],[320,278],[368,236],[416,216],[464,176],[512,148],[560,126],[400,386]].map(([cx, cy], index) => <g key={`${cx}-${cy}`}><line x1={cx} y1={cy} x2={cx} y2={440 - Number(cx) * .5} stroke="#cbd5e1" /><circle cx={cx} cy={cy} r="8" fill={index === 10 ? "#f97316" : "#14a8bd"} /></g>)}</>;
  if (tool === "table") return <><path d="M120 90 C210 330 282 416 360 424 S512 330 604 90" fill="none" stroke="#0898b7" strokeWidth="5" /><circle cx="520" cy="218" r="11" fill="#f97316" /><text x="538" y="214" fontSize="17" fontWeight="900" fill="#081238">row to point</text></>;
  if (tool === "trace" || tool === "zoom" || tool === "inspector") return <><path d="M96 372 C188 320 248 120 338 182 S492 390 650 108" fill="none" stroke="#0898b7" strokeWidth="5" /><line x1="340" y1="180" x2="560" y2="92" stroke="#f97316" strokeWidth="4" /><circle cx="340" cy="180" r="10" fill="#7c3aed" /></>;
  if (tool === "axis") return <><path d="M120 410 C220 372 320 316 400 220 S528 76 628 64" fill="none" stroke="#0898b7" strokeWidth="5" /><rect x="88" y="70" width="150" height="96" rx="16" fill="#f8fbff" stroke="#dbe6fb" /><text x="106" y="106" fontSize="16" fontWeight="900" fill="#081238">x: [-4, 4]</text><text x="106" y="134" fontSize="16" fontWeight="900" fill="#081238">y: [0, 18]</text></>;
  if (tool === "grid") return <><path d="M120 90 C210 330 282 416 360 424 S512 330 604 90" fill="none" stroke="#0898b7" strokeWidth="5" /><g stroke="#7c3aed" strokeWidth="2" opacity=".4">{Array.from({ length: 8 }, (_, index) => <line key={index} x1={112 + index * 70} x2={112 + index * 70} y1="58" y2="458" />)}</g></>;
  if (tool === "views") return <><g>{[[92,72],[386,72],[92,272],[386,272]].map(([x, y], index) => <rect key={`${x}-${y}`} x={x} y={y} width="250" height="160" rx="16" fill={index === 0 ? "#eefcff" : "#f8fbff"} stroke="#dbe6fb" />)}</g><path d="M116 188 C180 116 256 116 320 188" fill="none" stroke="#0898b7" strokeWidth="4" /><path d="M410 364 C480 300 558 304 612 364" fill="none" stroke="#7c3aed" strokeWidth="4" /></>;
  if (tool === "special") return <><path d="M120 90 C210 330 282 416 360 424 S512 330 604 90" fill="none" stroke="#0898b7" strokeWidth="5" />{[[250,292,"root"],[470,292,"root"],[360,424,"vertex"],[410,246,"meet"]].map(([cx, cy, label], index) => <g key={`${label}-${index}`}><circle cx={cx} cy={cy} r="10" fill="#f97316" /><text x={Number(cx) + 14} y={Number(cy) - 8} fontSize="15" fontWeight="900" fill="#081238">{label}</text></g>)}</>;
  if (tool === "parameters") return <><path d="M96 292 C190 180 258 180 360 292 S535 400 650 292" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 6" /><path d="M96 344 C190 86 258 86 360 344 S535 498 650 344" fill="none" stroke="#0898b7" strokeWidth="5" /><text x="116" y="106" fontSize="18" fontWeight="900" fill="#7c3aed">a, b, c sliders</text></>;
  return <><rect x="150" y="96" width="420" height="286" rx="18" fill="#f8fbff" stroke="#dbe6fb" /><path d="M188 320 C270 194 348 194 430 320 S530 390 540 190" fill="none" stroke="#0898b7" strokeWidth="5" /><text x="190" y="138" fontSize="18" fontWeight="900" fill="#081238">Export preview</text><text x="190" y="366" fontSize="15" fontWeight="900" fill="#53627f">PNG · SVG · PDF</text></>;
}

function canvasY(tool: TwoDTool, trace: number, primary: number, secondary: number) {
  if (tool === "coordinate") return 292 - secondary * 36;
  if (tool === "points") return 202;
  if (tool === "data") return 300 - trace * 45;
  if (tool === "parametric" || tool === "polar") return 260;
  if (tool === "table" || tool === "grid" || tool === "special") return 292 - (primary * primary - 2 * primary - 3) * 16;
  return 255 - Math.sin(trace) * 58 - trace * 18;
}

function MiniValuesTable({ spec, trace }: { spec: TwoDGraphSpec; trace: number }) {
  const values = [-3, -2, -1, 0, 1, 1.5, 2, 3];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-center text-xs">
        <thead><tr className="bg-[#f8fbff] text-[#53627f]"><th className="border border-[#dbe6fb] px-2 py-2 text-left">x</th>{values.map((value) => <th key={value} className={Math.abs(value - trace) < 0.05 ? "border-2 border-blue-500 px-2 py-2 text-blue-700" : "border border-[#dbe6fb] px-2 py-2"}>{value}</th>)}</tr></thead>
        <tbody>
          <tr><th className="border border-[#dbe6fb] px-2 py-2 text-left font-black text-[#0898b7]">{spec.title}</th>{values.map((value) => <td key={value} className={Math.abs(value - trace) < 0.05 ? "border-2 border-blue-500 px-2 py-2 font-black text-blue-700" : "border border-[#dbe6fb] px-2 py-2 font-semibold text-[#152348]"}>{formatGraphValue(spec.tool, value)}</td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}

function formatGraphValue(tool: TwoDTool, x: number) {
  if (tool === "functions") return (x * x - 2).toFixed(3);
  if (tool === "table" || tool === "grid" || tool === "special") return (x * x - 2 * x - 3).toFixed(3);
  if (tool === "polar") return (4 * Math.sin(3 * x)).toFixed(3);
  if (tool === "data") return (2.8 + x * 1.2).toFixed(3);
  if (tool === "equation") return Math.abs((x * x) / 9 - 1).toFixed(3);
  return (Math.sin(x) + 0.3 * x).toFixed(3);
}

function twoDGraphSpecFor(lessonId: number): TwoDGraphSpec {
  const specs: Record<number, TwoDGraphSpec> = {
    39: twoD("0131", "Cartesian Graphing", "coordinate", "Plot relationships on coordinate axes.", "P(2, 3)", "Plot the point. Read x first, then y.", "x first and y second", "Ordered pair", ["Read the ordered pair", "Move on the coordinate plane", "Plot the point"], "Your point", [["x first (horizontal)", "2", "cyan"], ["y second (vertical)", "3", "violet"], ["Trace x", "1.5", "cyan"]], [["x", "2", "cyan"], ["y", "3", "violet"], ["P", "(2, 3)", "cyan"]], [["P", "(2, 3)", "selected"], ["A", "(-3, 1)", "sample"], ["B", "(0, -2)", "sample"], ["C", "(4, -1)", "sample"]], "Always read the x-coordinate before the y-coordinate.", "Read the x-coordinate before the y-coordinate.", "Read in order"),
    40: twoD("0132", "Function Plotter", "functions", "Compare multiple functions.", "Trace x = 1.5", "f(x)=x^2-2, g(x)=0.8x+1, h(x)=sin(x)", "Outputs update together", "Intersections", ["f & g: (0.618, -1.618)", "f & h: (-1.404, -1.030)", "g & h: (-1.978, -0.582)"], "Functions", [["f(x)", "x^2 - 2", "cyan"], ["g(x)", "0.8x + 1", "violet"], ["Trace x", "1.5", "orange"]], [["f(1.5)", "0.250", "cyan"], ["g(1.5)", "2.200", "violet"], ["h(1.5)", "0.997", "orange"]], [["f", "x^2 - 2", "visible"], ["g", "0.8x + 1", "visible"], ["h", "sin(x)", "visible"]], "Move the trace to see function values update together.", "Do not compare curves without checking the same x input.", "Outputs at trace"),
    41: twoD("0133", "Equation Grapher", "equation", "Visualise explicit and implicit equations.", "Solution set", "x^2/9 + y^2/4 = 1", "Every point on the curve makes the equation true", "Check points", ["Substitute x and y", "True points stay on curve", "False points miss the graph"], "Equation tools", [["Test x", "2", "cyan"], ["Test y", "1", "violet"], ["Trace x", "1.5", "orange"]], [["Status", "satisfies", "cyan"], ["Curve", "ellipse", "violet"], ["Mode", "implicit", "orange"]], [["Point", "(2,1)", "true"], ["Point", "(4,1)", "false"], ["Rule", "all solutions", "set"]], "An equation graph is a set of all points that satisfy the rule.", "Implicit equations are solution sets, not always y as a function of x.", "Substitution check"),
    42: twoD("0134", "Inequality Grapher", "region", "Understand feasible regions.", "Overlap", "y <= 0.8x + 1 and y > -0.5x + 2", "Overlap = solution region", "Region test", ["Check a sample point", "Solid line means included", "Dashed line means excluded"], "Inequality tools", [["Boundary A", "solid", "cyan"], ["Boundary B", "dashed", "violet"], ["Trace x", "1.5", "orange"]], [["A(1,2)", "true", "cyan"], ["Included", "solid", "violet"], ["Overlap", "solution", "orange"]], [["Line 1", "included", "solid"], ["Line 2", "not included", "dashed"], ["Region", "overlap", "answer"]], "The overlap is the set of points satisfying both inequalities.", "Solid boundaries are included; dashed boundaries are not.", "True/false badges"),
    43: twoD("0135", "Parametric Curves", "parametric", "Explore time- or parameter-driven paths.", "t = 1.2pi", "x = 3cos(t), y = 2sin(t)", "t controls motion, not an axis", "Motion path", ["Follow the parameter", "Mark direction", "Read x(t) and y(t)"], "Parameter controls", [["a radius", "3", "cyan"], ["b radius", "2", "violet"], ["t", "1.2pi", "orange"]], [["x(t)", "-2.43", "cyan"], ["y(t)", "-1.18", "violet"], ["speed", "live", "orange"]], [["t", "0", "(3,0)"], ["t", "pi/2", "(0,2)"], ["t", "pi", "(-3,0)"]], "The parameter moves a point along the path.", "The parameter controls motion along the path; it is not a graph axis.", "t table"),
    44: twoD("0136", "Polar Graphs", "polar", "Explore radius-angle relationships.", "theta = 40 deg", "r = 4sin(3theta)", "Angle first, radius next", "Polar reading", ["Turn by theta", "Measure radius r", "Convert to x,y when needed"], "Polar controls", [["radius scale", "4", "cyan"], ["petals", "3", "violet"], ["theta", "40 deg", "orange"]], [["r", "2.57", "cyan"], ["petals", "3", "violet"], ["pole", "center", "orange"]], [["theta", "0", "r=0"], ["theta", "30", "r=4"], ["theta", "60", "r=0"]], "Polar points are read by angle and distance.", "A polar point needs angle and radius, in that order.", "Cartesian check"),
    45: twoD("0137", "Point Plotter", "points", "Build coordinate fluency.", "C(1, 2)", "A(-2, 1), B(-1, 3), C(1, 2)", "Plot exact ordered pairs before connecting anything", "Point list", ["Select a point", "Snap to grid", "Verify ordered pair"], "Point controls", [["x", "1", "cyan"], ["y", "2", "violet"], ["Trace x", "1.5", "orange"]], [["Selected", "C", "cyan"], ["Pair", "(1,2)", "violet"], ["Snap", "on", "orange"]], [["A", "(-2,1)", "plotted"], ["B", "(-1,3)", "plotted"], ["C", "(1,2)", "selected"]], "A plotted point should land on the exact grid address.", "Points are evidence before a trend line.", "Sample ordered pairs"),
    46: twoD("0138", "Data Plotter", "data", "Connect datasets to graphs.", "r = 0.86", "Study hours vs Quiz score", "Best-fit line", "Data story", ["Plot each row", "Inspect outliers", "Compare to fit line"], "Data controls", [["hours", "2", "cyan"], ["score", "3", "violet"], ["Trace x", "1.5", "orange"]], [["trend", "positive", "cyan"], ["r", "0.86", "violet"], ["outlier", "flagged", "orange"]], [["Study", "2h", "68"], ["Study", "4h", "78"], ["Study", "6h", "90"]], "Trend, spread, and outliers must all be visible.", "Do not force a curve before inspecting the data.", "Residuals"),
    47: twoD("0139", "Table of Values", "table", "Link numerical and graphical representations.", "x = 3", "f(x)=x^2-2x-3", "Row becomes point", "Table link", ["Choose row", "Compute output", "Plot row as a point"], "Table controls", [["x", "3", "cyan"], ["output", "0", "violet"], ["Trace x", "1.5", "orange"]], [["x", "3", "cyan"], ["f(x)", "0", "violet"], ["point", "(3,0)", "orange"]], [["-1", "0", "root"], ["1", "-4", "vertex"], ["3", "0", "root"]], "Each table row is a coordinate pair on the graph.", "Every table row should correspond to a plotted graph point.", "Second differences"),
    48: twoD("0140", "Trace Mode", "trace", "Observe paths and change.", "x = 1.8", "f(x)=sin(x)+0.3x", "Trace point", "Trace readout", ["Move along curve", "Read x and y", "Estimate slope"], "Trace controls", [["trace x", "1.8", "cyan"], ["slope", "1.2", "violet"], ["step", "0.1", "orange"]], [["x", "1.8", "cyan"], ["y", "1.51", "violet"], ["slope", "0.07", "orange"]], [["near x", "1.7", "1.50"], ["trace", "1.8", "1.51"], ["near x", "1.9", "1.52"]], "Trace mode reports coordinates along the graph.", "Trace mode reads coordinates along the graph; report both x and y.", "Nearby values"),
    49: twoD("0141", "Zoom and Pan", "zoom", "Inspect graphs at different scales.", "x:[-2, 2], y:[-1, 1]", "f(x)=0.25x^3-x", "Same equation, different view", "Viewport", ["Zoom in", "Pan canvas", "Reset view"], "Viewport controls", [["x-span", "4", "cyan"], ["y-span", "2", "violet"], ["Trace x", "1.5", "orange"]], [["window", "zoomed", "cyan"], ["equation", "same", "violet"], ["center", "(0,0)", "orange"]], [["Wide", "[-6,6]", "overview"], ["Zoom", "[-2,2]", "active"], ["Pan", "drag", "view only"]], "Zoom changes the window, not the equation.", "Zoom and pan change the view, not the equation.", "Mini overview map"),
    50: twoD("0142", "Axis Controls", "axis", "Configure graph presentation.", "x:[-4,4], y:[0,18]", "y=2^x", "Axis limits and scale", "Axis setup", ["Set x-limits", "Set y-limits", "Check scale"], "Axis controls", [["x max", "4", "cyan"], ["y max", "18", "violet"], ["Trace x", "1.5", "orange"]], [["x range", "8", "cyan"], ["y range", "18", "violet"], ["scale", "linear", "orange"]], [["x min", "-4", "left"], ["x max", "4", "right"], ["tick", "1", "step"]], "Good axis limits reveal important graph behavior.", "Bad axis limits can hide important behavior, so check limits and scale together.", "Tick step"),
    51: twoD("0143", "Grid Controls", "grid", "Use appropriate construction guides.", "f(1.5)=1.125", "y=0.5x^2", "Major and minor guide-line spacing", "Grid setup", ["Set major spacing", "Add subdivisions", "Snap or estimate"], "Grid controls", [["major", "1", "cyan"], ["minor", "0.5", "violet"], ["Trace x", "1.5", "orange"]], [["spacing", "major", "cyan"], ["snap", "on", "violet"], ["opacity", "70%", "orange"]], [["Sparse", "1", "read"], ["Dense", "0.25", "estimate"], ["Snap", "on", "construct"]], "Gridlines guide reading without changing values.", "Gridlines guide reading; guide-line spacing does not redefine values.", "Estimate points"),
    52: twoD("0144", "Multiple Graphics Views", "views", "Compare representations side by side.", "x = 2.0", "f(x)=sin(x)+0.25x", "Algebra, graph, table, and detail stay synchronized", "Linked panes", ["Open algebra view", "Sync graph and table", "Inspect same object"], "View controls", [["pane", "2x2", "cyan"], ["sync", "on", "violet"], ["Trace x", "2.0", "orange"]], [["layout", "2x2", "cyan"], ["object", "same", "violet"], ["cursor", "synced", "orange"]], [["Graph", "active", "same"], ["Table", "active", "same"], ["Detail", "active", "same"]], "Each pane shows the same object at a different scale.", "Each pane shows the same object at different scales, not a separate graph.", "Sync cursor"),
    53: twoD("0145", "Special Points", "special", "Find important graph features.", "(-1,0), (3,0), (1,-4)", "f(x)=x^2-2x-3; g(x)=x-1", "Roots, vertex, intercepts, and intersections", "Point finder", ["Find roots", "Find vertex", "Find intersections"], "Feature controls", [["root", "-1", "cyan"], ["vertex", "-4", "violet"], ["Trace x", "1.5", "orange"]], [["roots", "-1, 3", "cyan"], ["vertex", "(1,-4)", "violet"], ["meet", "(2,1)", "orange"]], [["Root", "(-1,0)", "zero"], ["Root", "(3,0)", "zero"], ["Vertex", "(1,-4)", "min"]], "Special points satisfy extra graph conditions.", "Special points satisfy extra conditions beyond merely lying on the curve.", "Feature list"),
    54: twoD("0146", "Graph Inspector", "inspector", "Read local graph properties.", "Slope at x = 1.2", "f(x)=x^3-3x", "Selected curve facts", "Inspector", ["Select curve", "Move probe", "Read properties"], "Inspector controls", [["probe x", "1.2", "cyan"], ["window", "local", "violet"], ["Trace x", "1.5", "orange"]], [["slope", "1.32", "cyan"], ["domain", "all real", "violet"], ["concavity", "up", "orange"]], [["Domain", "all real", "global"], ["Range", "all real", "global"], ["Rate", "local", "probe"]], "The inspector reports facts for the selected graph and probe.", "The inspector reports selected graph facts for the current curve and probe.", "Selected curve facts"),
    55: twoD("0147", "Dynamic Parameters", "parameters", "Study function families.", "a=2, b=1.5, c=0.5", "y=a sin(bx)+c", "Sliders change amplitude, period, and midline", "Parameter family", ["Move one slider", "Watch the ghost curve", "Name the effect"], "Parameter controls", [["a", "2", "cyan"], ["b", "1.5", "violet"], ["c", "0.5", "orange"]], [["amplitude", "2", "cyan"], ["period", "4.19", "violet"], ["midline", "0.5", "orange"]], [["a", "height", "amplitude"], ["b", "width", "period"], ["c", "up/down", "midline"]], "A parameter slider changes the whole graph family.", "A parameter slider should explain how it can change a whole graph family.", "Animate sweep"),
    56: twoD("0148", "Export Graph", "export", "Reuse or share mathematical work.", "PNG / SVG / PDF", "f(x)=1/(1+e^{-x})", "Export preview with title, legend, labels, and scale", "Export setup", ["Preview output", "Include labels", "Choose format"], "Export controls", [["scale", "2x", "cyan"], ["labels", "on", "violet"], ["Trace x", "1.5", "orange"]], [["format", "PNG", "cyan"], ["labels", "included", "violet"], ["scale", "2x", "orange"]], [["PNG", "image", "ready"], ["SVG", "vector", "ready"], ["PDF", "print", "ready"]], "The exported graph should match the current visual state.", "A useful exported graph includes axes, labels, and scale, and the exported state should match the current visual state.", "Export preview"),
  };
  return specs[lessonId] ?? specs[39];
}

function twoD(mockupId: string, title: string, tool: TwoDTool, purpose: string, value: string, equation: string, focus: string, leftTitle: string, leftSteps: string[], rightTitle: string, controls: [string, string, string][], outputs: [string, string, string][], table: [string, string, string][], note: string, warning: string, testSnippet: string): TwoDGraphSpec {
  return { mockupId, title, tool, purpose, value, equation, focus, leftTitle, leftSteps, rightTitle, controls, outputs, table, note, warning, testSnippet, status: focus, left: leftSteps, right: outputs.map(([label, val]) => `${label}: ${val}`), visual: tool === "region" ? "inequality" : tool === "coordinate" || tool === "grid" ? "cartesian" : tool === "special" ? "equation" : tool === "points" ? "points" : tool === "data" ? "data" : tool === "table" || tool === "views" ? "table" : tool === "polar" ? "polar" : tool === "parametric" ? "parametric" : "trace" };
}

function graphSpecFor(lessonId: number): GraphSpec {
  const specs: Record<number, GraphSpec> = {
    39: graphSpec("Cartesian Graphing", "Plot relationships on coordinate axes.", "P(2, 3)", "P(2, 3)", "x first and y second", ["Move horizontally", "Then move vertically", "Quadrant I"], ["Ordered pair confirmed", "x first", "y second"], "Read the x-coordinate before the y-coordinate.", "x first and y second", "cartesian"),
    40: graphSpec("Function Plotter", "Compare multiple functions.", "Trace x = 1.5", "f(x)=x^2-2, g(x)=0.8x+1, h(x)=sin(x)", "Outputs update together", ["f(x)=x^2-2", "g(x)=0.8x+1", "h(x)=sin(x)"], ["Intersections", "Trace x = 1.5", "each x input makes one y output"], "Do not compare curves without checking the same x input.", "each x input makes one y output", "functions"),
    41: graphSpec("Equation Grapher", "Visualise explicit and implicit equations.", "Solution set", "x^2/9 + y^2/4 = 1", "Every point on the curve makes the equation true", ["Test point (2, 1)", "satisfies", "does not satisfy"], ["Solution set", "all solution points", "Substitution check"], "Implicit equations are solution sets, not always y as a function of x.", "all solution points", "equation"),
    42: graphSpec("Inequality Grapher", "Understand feasible regions.", "Overlap", "y <= 0.8x + 1 and y > -0.5x + 2", "Overlap = solution region", ["Test point A(1, 2)", "Boundary included", "Boundary not included"], ["True/false badges", "shades all points", "Solution region"], "Solid boundaries are included; dashed boundaries are not.", "shades all points", "inequality"),
    43: graphSpec("Parametric Curves", "Explore time- or parameter-driven paths.", "t = 1.2pi", "x = 3cos(t), y = 2sin(t)", "t controls motion, not an axis", ["particle position", "direction of motion", "x radius a", "y radius b"], ["t table", "speed", "use a third variable"], "The parameter controls motion along the path; it is not a graph axis.", "use a third variable", "parametric"),
    44: graphSpec("Polar Graphs", "Explore radius-angle relationships.", "theta = 40 deg", "r = 4sin(3theta)", "Angle first, radius next", ["theta = 40 deg", "r = 2.57", "Pole"], ["Cartesian check", "petal count", "angle and radius"], "A polar point needs angle and radius, in that order.", "angle and radius", "polar"),
    45: graphSpec("Point Plotter", "Build coordinate fluency.", "C(1, 2)", "A(-2, 1), B(-1, 3), C(1, 2)", "Plot exact ordered pairs before connecting anything", ["A(-2, 1)", "B(-1, 3)", "C(1, 2)", "Snap to grid"], ["x first", "y second", "exact ordered pairs"], "Points are evidence before a trend line.", "exact ordered pairs", "points"),
    46: graphSpec("Data Plotter", "Connect datasets to graphs.", "r = 0.86", "Study hours vs Quiz score", "Best-fit line", ["Study hours", "Quiz score", "Residuals", "Outlier check"], ["r = 0.86", "trend, spread, and outliers", "Best-fit line"], "Do not force a curve before inspecting the data.", "trend, spread, and outliers", "data"),
    47: graphSpec("Table of Values", "Link numerical and graphical representations.", "x = 3", "f(x)=x^2-2x-3", "Row becomes point", ["x = 3", "f(x) = 0", "First differences"], ["Second differences constant", "pairs each input with its output", "Row becomes point"], "Every table row should correspond to a plotted graph point.", "pairs each input with its output", "table"),
    48: graphSpec("Trace Mode", "Observe paths and change.", "x = 1.8", "f(x)=sin(x)+0.3x", "Trace point", ["x = 1.8", "y = 1.51", "Slope estimate"], ["Move steadily and report both x and y", "reads coordinates along the graph", "Nearby values"], "Trace mode reads coordinates along the graph; report both x and y.", "reads coordinates along the graph", "trace"),
    49: graphSpec("Zoom and Pan", "Inspect graphs at different scales.", "x:[-2, 2], y:[-1, 1]", "f(x)=0.25x^3-x", "Same equation, different view", ["Viewport", "Zoomed region", "Pan arrows", "Mini overview map"], ["Zoom in/out", "Reset view", "Same equation, different view"], "Zoom and pan change the view, not the equation.", "change the view, not the equation", "trace"),
    50: graphSpec("Axis Controls", "Configure graph presentation.", "x:[-4,4], y:[0,18]", "y=2^x", "Axis limits and scale", ["x min", "x max", "y min", "y max"], ["Tick step", "Linear scale", "Log scale"], "Bad axis limits can hide important behavior, so check limits and scale together.", "limits and scale", "functions"),
    51: graphSpec("Grid Controls", "Use appropriate construction guides.", "f(1.5)=1.125", "y=0.5x^2", "Major and minor guide-line spacing", ["Major spacing", "Minor subdivisions", "Snap to grid", "Grid opacity"], ["Sparse grid", "Dense grid", "Estimate points"], "Gridlines guide reading; guide-line spacing does not redefine values.", "guide-line spacing", "cartesian"),
    52: graphSpec("Multiple Graphics Views", "Compare representations side by side.", "x = 2.0", "f(x)=sin(x)+0.25x", "Algebra, graph, table, and detail stay synchronized", ["Algebra view", "Graph view", "Table view", "Detail view"], ["Sync cursor", "2x2 layout", "same object at different scales"], "Each pane shows the same object at different scales, not a separate graph.", "same object at different scales", "table"),
    53: graphSpec("Special Points", "Find important graph features.", "(-1,0), (3,0), (1,-4)", "f(x)=x^2-2x-3; g(x)=x-1", "Roots, vertex, intercepts, and intersections", ["Roots", "y-intercept", "Vertex", "Intersections"], ["(-1, 0)", "(3, 0)", "(1, -4)"], "Special points satisfy extra conditions beyond merely lying on the curve.", "satisfy extra conditions", "equation"),
    54: graphSpec("Graph Inspector", "Read local graph properties.", "Slope at x = 1.2", "f(x)=x^3-3x", "Selected curve facts", ["Domain", "Range", "Intercepts", "Extrema"], ["Increasing", "Decreasing", "Average rate", "Concavity cue"], "The inspector reports selected graph facts for the current curve and probe.", "reports selected graph facts", "trace"),
    55: graphSpec("Dynamic Parameters", "Study function families.", "a=2, b=1.5, c=0.5", "y=a sin(bx)+c", "Sliders change amplitude, period, and midline", ["Amplitude", "Period", "Midline", "Ghost curves"], ["a slider", "b slider", "c slider", "Animate sweep"], "A parameter slider should explain how it can change a whole graph family.", "change a whole graph family", "functions"),
    56: graphSpec("Export Graph", "Reuse or share mathematical work.", "PNG / SVG / PDF", "f(x)=1/(1+e^{-x})", "Export preview with title, legend, labels, and scale", ["Export preview", "Include labels", "Scale 2x", "Copy link"], ["PNG", "SVG", "PDF", "Classroom embed"], "A useful exported graph includes axes, labels, and scale, and the exported state should match the current visual state.", "axes, labels, and scale", "functions"),
    129: graphSpec("Function Concept", "Map each input to exactly one output.", "f(2)=3.5", "f(x)=1.25x+1", "Each input has exactly one output", ["Input x", "Output f(x)", "Mapping arrow", "Machine rule"], ["Input-output table", "Vertical slice check", "single output"], "A function means each input has exactly one output.", "each input has exactly one output", "functions"),
    130: graphSpec("Domain and Range", "Find allowed inputs and produced outputs.", "Domain x >= -2", "f(x)=sqrt(x+2)", "Square-root inputs start at the endpoint", ["Domain starts", "Range rises", "Endpoint (-2,0)", "Allowed input strip"], ["Domain interval", "Range interval", "restriction check"], "For this square-root model, square-root inputs start where the radicand is nonnegative.", "square-root inputs start", "trace"),
    131: graphSpec("Function Notation", "Use notation to name a rule and input.", "f(2)=5", "f(x)=x^2+1", "f(2) means use input 2", ["Function card", "Input token 2", "Substitution slot", "Output value"], ["Evaluate f(2)", "Table row", "Graph point"], "Function notation is not multiplication; f(2) means use input 2.", "f(2) means use input 2", "table"),
    132: graphSpec("Vertical-Line Test", "Check whether a graph is a function.", "x = 1 hits twice", "circle compared with parabola", "Vertical-line test", ["Move vertical line", "One hit passes", "two hits fail", "Circle fails"], ["Function?", "Relation?", "Pass/fail card"], "If one x-value hits more than one y-value, the relation fails the Vertical-line test.", "Vertical-line test", "equation"),
    133: graphSpec("Linear Functions", "Recognise constant rate of change.", "m = 1.5", "y=1.5x+1", "Equal x-steps make equal y-changes", ["Slope triangle", "Intercept", "Equal steps", "Rate card"], ["Delta x = 2", "Delta y = 3", "Constant slope"], "Linear functions have constant rate: equal x-steps make equal y-changes.", "equal x-steps make equal y-changes", "functions"),
    134: graphSpec("Quadratic Functions", "Read vertex, symmetry, and turning point.", "Vertex (1,-2)", "y=0.75(x-1)^2-2", "Quadratic turns at a vertex", ["Axis of symmetry", "Mirror points", "Opening scale", "Vertex"], ["Minimum", "Table symmetry", "Parent y=x^2"], "A quadratic turns at a vertex and has mirror symmetry around its axis.", "turns at a vertex", "cartesian"),
    135: graphSpec("Cubic Functions", "Read inflection and opposite-end behavior.", "Inflection at (0,0)", "y=0.25x^3-x", "Origin symmetry", ["Left end down", "Right end up", "Inflection point", "S-curve"], ["End behavior", "Turning cue", "Odd symmetry"], "A basic cubic has origin symmetry when shifts are zero and bends through an inflection point.", "origin symmetry", "trace"),
    136: graphSpec("Higher-Degree Polynomials", "Connect degree, roots, turns, and end behavior.", "Four possible roots", "y=0.08(x+2)(x-1)(x-3)(x-4)", "Degree limits roots", ["Root chips", "turning points", "End behavior", "Multiplicity"], ["Sign table", "Root count", "Turn count"], "Polynomial degree limits roots and controls how many turns can appear.", "degree limits roots", "data"),
    137: graphSpec("Reciprocal Functions", "Track excluded inputs and asymptotes.", "x = 1 excluded", "y=3/(x-1)", "x=0 is excluded in the parent graph", ["Vertical asymptote", "Horizontal asymptote", "Two branches", "Excluded input"], ["Domain restriction", "Branch behavior", "Asymptote check"], "For reciprocal functions, x=0 is excluded in the parent graph and shifted exclusions create asymptotes.", "x=0 is excluded", "trace"),
    138: graphSpec("Rational Functions", "Find restrictions before interpreting branches.", "Denominator zero x=1", "y=(x+2)/(x-1)", "Denominator zeros are excluded", ["Numerator", "Denominator", "Restriction", "Asymptotes"], ["Slant behavior", "Branch table", "Hole/asymptote check"], "For rational functions, denominator zeros are excluded and shape depends on numerator behavior.", "denominator zeros are excluded", "trace"),
    143: graphSpec("Logarithmic Functions", "Read domain, asymptote, and inverse reflection.", "x > 1", "y = 2log_2(x - 1) + 1", "Inputs must be positive", ["Vertical asymptote x = 1", "Domain shading", "Inverse exponential", "Value table"], ["Transformation sliders", "Diagnostics", "Domain challenge"], "For logarithmic graphs, inputs must be positive before taking the log.", "inputs must be positive", "trace"),
    144: graphSpec("Trigonometric Functions", "Link unit-circle angles to sine and cosine graphs.", "theta = pi/3", "y=2sin(x)+0.5", "Repeats with a period", ["Unit circle", "Radians", "Amplitude", "Midline"], ["Period measurement", "Identity check", "Angle trace"], "Every trigonometric graph repeats with a period because angle inputs cycle around the unit circle.", "repeats with a period", "polar"),
    145: graphSpec("Hyperbolic Functions", "Compare sinh, cosh, and tanh with exponential definitions.", "t = 1.2", "sinh(t), cosh(t), tanh(t)", "Not periodic like cosine", ["Exponential decomposition", "Unit hyperbola", "Selected t value", "Identity validation"], ["sinh", "cosh", "tanh", "Circular comparison"], "Hyperbolic functions grow like exponentials and are not periodic like cosine.", "not periodic like cosine", "functions"),
    146: graphSpec("Floor Function", "Round down to the greatest integer.", "floor(2.73)=2", "y=floor(x)", "Outputs step down to integers", ["Highlighted interval [2,3)", "Closed left endpoint", "Open right endpoint", "Discontinuity"], ["Input shift", "Output shift", "Interval table"], "Floor outputs step down to integers: the greatest integer less than or equal to the input.", "outputs step down to integers", "table"),
    147: graphSpec("Ceiling Function", "Understand upward rounding.", "ceil(2.3)=3", "y=ceil(x)", "Outputs step up to integers", ["2 < x <= 3", "Open left, closed right", "Integer landing zones", "Jump after each integer"], ["ceil(-1.2)=-1", "ceil(0)=0", "Evaluation table"], "Ceiling outputs step up to integers: the least integer greater than or equal to the input.", "outputs step up to integers", "table"),
    148: graphSpec("Sign Function", "Classify positive, zero, and negative inputs.", "sgn(-2.4)=-1", "y=sgn(x)", "Outputs are -1, 0, or 1", ["x < 0 -> -1", "x = 0 -> 0", "x > 0 -> 1", "Only the sign matters"], ["Magnitude ignored", "Threshold shift", "Live sign classifier"], "The sign function outputs are -1, 0, or 1 depending on whether the input is negative, zero, or positive.", "outputs are -1, 0, or 1", "table"),
    149: graphSpec("Piecewise Functions", "Model multiple rules on different domain regions.", "x = 1.4 active rule", "f(x)=-x-1, x^2, or 3", "Choose only the rule whose condition is true", ["x < 0", "0 <= x < 2", "x >= 2", "Boundary decides"], ["Active rule", "Switch points", "Branch visibility"], "For piecewise functions, choose only the rule whose condition is true.", "choose only the rule", "equation"),
    150: graphSpec("Composite Functions", "Follow chained mappings.", "f(g(2)) = 9", "g(x)=x+1, f(u)=u^2", "Inner output becomes the outer input", ["x -> g(x) -> f(g(x))", "g(2) = 3", "f(g(2)) = 9", "Evaluate inside first"], ["Order matters", "f(g(x))=(x+1)^2", "Composition order toggle"], "In composition, the inner output becomes the outer input.", "inner output becomes the outer input", "functions"),
    151: graphSpec("Inverse Functions", "Understand reversal of mappings.", "f^-1(5)=2", "f(x)=2x+1; f^-1(x)=(x-1)/2", "Inputs and outputs reverse", ["Reflect across y = x", "Swap input and output", "(2,5)<->(5,2)", "One-to-one"], ["Composition returns the start", "Horizontal-line test", "Domain restriction"], "Inverse functions make inputs and outputs reverse, reflecting across y=x when both are functions.", "inputs and outputs reverse", "functions"),
    152: graphSpec("Even and Odd Functions", "Recognise symmetry by testing x and -x.", "f(2) and f(-2)", "x^2, x^3, or x^2+x", "f(-x)=f(x)", ["Even: f(-x)=f(x)", "Odd: f(-x)=-f(x)", "Mirror over y-axis", "Rotate around origin"], ["Test x and -x", "Verdict: even", "Symmetry overlay"], "Even functions satisfy f(-x)=f(x), while odd functions rotate through the origin.", "f(-x)=f(x)", "functions"),
    153: graphSpec("Increasing and Decreasing", "Identify monotonic intervals.", "f'(x): + | 0 | - | 0 | +", "cubic with local max and min", "Read increasing or decreasing from left to right", ["Increasing", "Decreasing", "Local maximum", "Local minimum"], ["f'(x) > 0", "f'(x) < 0", "Interval notation"], "Read increasing or decreasing from left to right, not from the y-axis alone.", "read increasing or decreasing", "trace"),
    154: graphSpec("Periodic Functions", "Understand repeating behaviour.", "Period T = pi", "f(x)=1.5sin(2x)+0.5", "Repeats after a fixed period", ["f(x + T) = f(x)", "Matching points", "Cycle repeats", "Amplitude"], ["Midline", "Period finder", "Repeated cycle shading"], "A periodic function repeats after a fixed period or horizontal interval.", "repeats after a fixed period", "functions"),
    155: graphSpec("Recursive Functions", "Generate iterative values.", "a0=1", "a(n+1)=1.4a(n)+0.5", "Depends on an earlier value", ["Previous term", "Next term", "Seed value", "Step table"], ["Growth factor", "Add-on", "Cobweb mini panel"], "A recursive rule depends on an earlier value to build the next value.", "depends on an earlier value", "data"),
    156: graphSpec("Vertical Translation", "Understand f(x)+k.", "k = 2", "g(x)=f(x)+2", "Outside addition moves every output", ["Move up 2", "Same x-values", "Every y-value +2", "Vertex: (0,0) -> (0,2)"], ["Vertical shift k", "Parent visibility", "Sample x"], "An outside addition moves every output up or down by the same amount.", "outside addition moves", "cartesian"),
    157: graphSpec("Horizontal Translation", "Understand f(x-h).", "h = 2", "g(x)=f(x-2)", "Inside subtraction moves the graph horizontally", ["Move right 2", "Same y-levels", "Input changes first", "Vertex: (0,0) -> (2,0)"], ["Horizontal shift h", "Parent visibility", "Input remapping"], "An inside subtraction moves the graph horizontally by changing the input before the function acts.", "inside subtraction moves", "cartesian"),
    158: graphSpec("Vertical Stretch and Compression", "Understand af(x).", "a = 1.8", "g(x)=1.8f(x)", "Outside multiplication changes height", ["x fixed", "Every y-value x1.8", "Stretch away from x-axis", "Compression when 0<a<1"], ["Vertical scale a", "Compression/stretch toggle", "Point table"], "Outside multiplication changes height by scaling every y-value.", "outside multiplication changes height", "cartesian"),
    159: graphSpec("Horizontal Stretch and Compression", "Understand f(bx).", "b = 0.7", "g(x)=f(0.7x)", "Inside multiplication changes width", ["Horizontal distances scale inversely", "Width x 1/0.7", "Same y-levels", "Input changes first"], ["Inside scale b", "Stretch/compression toggle", "Sample y-level"], "Inside multiplication changes width before outputs are computed.", "inside multiplication changes width", "cartesian"),
    160: graphSpec("Reflection in x-Axis", "Understand -f(x).", "(2,4)->(2,-4)", "g(x)=-f(x)", "Changes y to -y", ["Mirror across x-axis", "x unchanged", "y -> -y", "Up becomes down"], ["Reflection scale", "Vertical shift", "Point-pair table"], "Reflection in the x-axis changes y to -y for every point.", "changes y to -y", "cartesian"),
    161: graphSpec("Reflection in y-Axis", "Understand f(-x).", "(-2,-8)<->(2,-8)", "g(x)=f(-x)", "Changes x to -x", ["Mirror across y-axis", "x -> -x", "y unchanged", "Left and right swap"], ["Input sign flips first", "Pre-shift", "Point-pair table"], "Reflection in the y-axis changes x to -x for every point.", "changes x to -x", "cartesian"),
    162: graphSpec("Combined Transformations", "Track inside and outside changes.", "vertex (2,-1)", "y=a(x-h)^2+k", "Inside changes affect x before outside changes affect y", ["Parent y=x^2", "Intermediate curve", "Final transformed curve", "Tracked sample point"], ["a, h, k controls", "Transformation chips", "Vertex feedback"], "For combined transformations, inside changes affect x before outside changes affect y.", "inside changes affect x", "cartesian"),
    163: graphSpec("Transformation Order", "Compare two transformation pipelines.", "same steps, different order", "shift, scale, then reflect", "Later transformations act on the graph already produced", ["Pipeline A", "Pipeline B", "Before/after graph", "Non-commutativity"], ["Order chips", "Reset", "Challenge"], "Order matters because later transformations act on the graph already produced.", "later transformations act", "cartesian"),
    164: graphSpec("Parameter Explorer", "Change one parameter and name its effect.", "a=2, h=1, k=-1", "y=a(x-h)^2+k", "Sliders change the graph family", ["Parent vs transformed", "Vertex readout", "Parameter effect cards", "Live equation"], ["a slider", "h slider", "k slider", "Effect summary"], "For parameterised functions, sliders change the graph family one cause at a time.", "sliders change the graph family", "cartesian"),
    165: graphSpec("Parent Function Library", "Identify base shapes before transformations.", "parent y=x^2", "select a parent function", "Simplest rule shows the base shape", ["Linear", "Quadratic", "Absolute value", "Square root"], ["Domain/range cards", "Key points", "Family comparison"], "A parent function is the simplest rule showing the base shape before transformations.", "simplest rule shows", "functions"),
    166: graphSpec("Graph Matching", "Match transformed equations to graphs.", "score 3/4", "candidate transformed graphs", "Shape plus more than one point", ["Equation cards", "Graph targets", "Structural hints", "Check match"], ["Score panel", "Reset", "Try next"], "Graph matching uses shape plus more than one point to identify the rule.", "shape plus more than one point", "functions"),
  };
  return specs[lessonId] ?? specs[39];
}

function graphSpec(title: string, purpose: string, value: string, equation: string, focus: string, left: string[], right: string[], warning: string, testSnippet: string, visual: GraphSpec["visual"]): GraphSpec {
  return { title, purpose, value, equation, focus, left, right, warning, testSnippet, visual };
}

function renderGraphVisual(spec: GraphSpec, probe: number, showHelper: boolean) {
  const x = 70 + probe * 4;
  return (
    <svg viewBox="0 0 560 360" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.title} graph visual`}>
      <defs>
        <pattern id={`graph-grid-${spec.visual}`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#e2e8f0" /></pattern>
      </defs>
      <rect width="560" height="360" fill={`url(#graph-grid-${spec.visual})`} />
      <line x1="46" y1="285" x2="520" y2="285" stroke="#334155" strokeWidth="2" />
      <line x1="280" y1="35" x2="280" y2="325" stroke="#334155" strokeWidth="2" />
      {graphShape(spec.visual)}
      {showHelper ? <><line x1={x} y1="52" x2={x} y2="305" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" /><circle cx={x} cy={pointY(spec.visual, probe)} r="13" fill="#7c3aed" /><text x={Math.min(430, x + 14)} y={pointY(spec.visual, probe) - 10} fontWeight="900">{spec.value}</text></> : null}
      <text x="54" y="42" fill="#0f172a" fontWeight="900">{spec.focus}</text>
    </svg>
  );
}

function graphShape(visual: GraphSpec["visual"]) {
  if (visual === "functions") return <><polyline points="65,270 120,236 175,190 230,128 285,80 340,128 395,190 450,236 505,270" fill="none" stroke="#14b8a6" strokeWidth="4" /><line x1="65" y1="255" x2="505" y2="120" stroke="#7c3aed" strokeWidth="4" /><path d="M65 210 C145 110 230 290 305 180 S430 90 505 205" fill="none" stroke="#f97316" strokeWidth="4" /></>;
  if (visual === "equation") return <><ellipse cx="250" cy="185" rx="150" ry="82" fill="none" stroke="#14b8a6" strokeWidth="5" /><circle cx="280" cy="185" r="110" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" /><line x1="88" y1="282" x2="495" y2="75" stroke="#7c3aed" strokeWidth="4" /></>;
  if (visual === "inequality") return <><polygon points="70,285 505,285 505,118 70,255" fill="#bae6fd" opacity=".75" /><polygon points="70,100 505,250 505,70 70,70" fill="#ddd6fe" opacity=".75" /><polygon points="246,188 505,118 505,250" fill="#5eead4" opacity=".8" /><line x1="70" y1="255" x2="505" y2="118" stroke="#0ea5e9" strokeWidth="4" /><line x1="70" y1="100" x2="505" y2="250" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 6" /></>;
  if (visual === "parametric") return <><ellipse cx="280" cy="180" rx="170" ry="95" fill="none" stroke="#14b8a6" strokeWidth="5" /><path d="M92 180 C170 55 270 310 360 88 S480 258 500 178" fill="none" stroke="#fb923c" strokeWidth="3" opacity=".55" /></>;
  if (visual === "polar") return <><circle cx="280" cy="180" r="40" fill="none" stroke="#cbd5e1" /><circle cx="280" cy="180" r="80" fill="none" stroke="#cbd5e1" /><circle cx="280" cy="180" r="120" fill="none" stroke="#cbd5e1" /><path d="M280 180 C250 70 190 80 220 170 C130 185 150 255 260 215 C285 320 355 275 320 195 C430 170 390 95 305 155 Z" fill="none" stroke="#14b8a6" strokeWidth="5" /><line x1="280" y1="180" x2="410" y2="70" stroke="#f59e0b" strokeWidth="4" /></>;
  if (visual === "points") return <><polyline points="185,220 230,160 330,185 430,90 475,285" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />{[[185,220,"A(-2, 1)"],[230,160,"B(-1, 3)"],[330,185,"C(1, 2)"],[430,90,"D(3, 5)"],[475,285,"E(4, 0)"]].map(([cx, cy, label]) => <g key={label}><circle cx={cx} cy={cy} r="10" fill={label === "C(1, 2)" ? "#f59e0b" : "#14b8a6"} /><text x={Number(cx) + 8} y={Number(cy) - 8} fontWeight="900">{label}</text></g>)}</>;
  if (visual === "data") return <><line x1="85" y1="280" x2="500" y2="82" stroke="#7c3aed" strokeWidth="4" />{[[90,260],[130,230],[170,214],[205,190],[245,176],[285,150],[325,137],[365,110],[405,96],[445,78],[305,250]].map(([cx, cy], index) => <g key={`${cx}-${cy}`}><line x1={cx} y1={cy} x2={cx} y2={290 - Number(cx) * .42} stroke="#94a3b8" /><circle cx={cx} cy={cy} r="8" fill={index === 10 ? "#f59e0b" : "#14b8a6"} /></g>)}</>;
  if (visual === "table" || visual === "cartesian") return <><polyline points="100,80 145,155 190,215 235,260 280,285 325,260 370,215 415,155 460,80" fill="none" stroke="#14b8a6" strokeWidth="5" /><circle cx="370" cy="215" r="12" fill="#f59e0b" /><text x="384" y="210" fontWeight="900">x = 3, f(x) = 0</text></>;
  return <><path d="M65 252 C145 210 190 122 260 152 S355 260 505 92" fill="none" stroke="#14b8a6" strokeWidth="5" /><line x1="260" y1="150" x2="440" y2="70" stroke="#f59e0b" strokeWidth="4" /></>;
}

function pointY(visual: GraphSpec["visual"], probe: number) {
  if (visual === "points") return 185;
  if (visual === "data") return 280 - probe * 1.7;
  if (visual === "parametric" || visual === "polar") return 180;
  return 250 - Math.sin(probe / 18) * 58 - probe * .7;
}
