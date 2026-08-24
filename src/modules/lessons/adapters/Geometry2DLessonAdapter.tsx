import { BookOpen, CheckCircle2, ChevronDown, Circle, Compass, Eye, Grid3X3, Hand, HelpCircle, MousePointer2, Move, PenTool, Play, RotateCcw, Ruler, Trash2, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, { reusableEngineParamsFor, type ReusableLessonEngineParams } from "../components/ReusableLessonEngine";
import { geometry2DVisualPresetForLesson } from "../presets/geometry2DVisualPresets";
import type { LessonAdapterProps } from "../types";

type GeometryTool = "point" | "line" | "segment" | "ray" | "polyline" | "perpendicular" | "parallel" | "bisector" | "tangent" | "fit" | "triangle" | "polygon" | "circle" | "arc" | "sector" | "conic" | "measure" | "angle" | "relation" | "steps";

type GeometrySpec = {
  mockupId: string;
  title: string;
  subtitle: string;
  tool: GeometryTool;
  activeTool: string;
  result: string;
  propertyTitle: string;
  steps: string[];
  controls: [string, string][];
  checks: string[];
  insight: string;
  rule: string;
  practice: string;
};

export default function Geometry2DLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id >= 198 && lesson.id <= 235) {
    return <DynamicGeometryMockupLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  const params = geometryParamsForLesson(lesson.id, lesson.title);
  return (
    <AdapterFrame title={`${lesson.title} - reusable 2D geometry engine`} value={params.isTransform ? "Transforming construction" : "Measured construction"} footer={`Focused geometry workspace with ${params.tools?.join(", ") ?? "point, segment, measure"} tools only.`}>
      <ReusableLessonEngine engine="geometry-2d" params={params} resetToken={resetToken} onInteraction={onInteraction} />
    </AdapterFrame>
  );
}

function DynamicGeometryMockupLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = dynamicGeometrySpecFor(lesson.id);
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const [snap, setSnap] = useState(true);
  const [activeTab, setActiveTab] = useState("Construction");

  useEffect(() => {
    setX(2);
    setY(1);
    setSnap(true);
    setActiveTab("Construction");
  }, [lesson.id, resetToken]);

  const updatePoint = (axis: "x" | "y", value: number) => {
    if (axis === "x") setX(value);
    else setY(value);
    onInteraction();
  };

  return (
    <section className="space-y-4" data-testid={`dynamic-geometry-mockup-${spec.mockupId}`}>
      <header className="overflow-hidden rounded-2xl border border-[#dbe6fb] bg-white/95 shadow-[0_18px_46px_rgba(15,23,42,.075)]">
        <div className="grid gap-4 p-5 lg:grid-cols-[116px_minmax(0,1fr)_auto]">
          <div className="hidden h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-lg lg:grid">
            {geometryHeaderIcon(spec.tool)}
          </div>
          <div>
            <p className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#087b98]">{lesson.id === 198 ? "Dynamic Geometry Constructions" : lesson.topic}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#081238]">{spec.title}</h1>
            <p className="mt-2 text-base font-semibold text-[#53627f]">{spec.subtitle}</p>
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <HeaderMetric label="Time" value="6-10 min" />
            <HeaderMetric label="Level" value={lesson.id === 198 ? "Beginner" : "Middle School"} />
            <HeaderMetric label="Skills" value={skillLabel(spec.tool)} />
          </div>
        </div>
        <div className="grid border-t border-[#dbe6fb] sm:grid-cols-5">
          {["Observe", "Construct", "Pattern", "Rule", "Practice"].map((tab, index) => (
            <button key={tab} type="button" className={index === 0 ? "min-h-14 border-b-2 border-cyan-600 bg-cyan-50/70 text-sm font-black text-[#087b98]" : "min-h-14 text-sm font-black text-[#53627f] hover:bg-cyan-50"} onClick={() => { setActiveTab(tab); onInteraction(); }}>
              {index + 1} &nbsp; {tab}
            </button>
          ))}
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[#dbe6fb] bg-white/95 p-2 shadow-sm" aria-label="Dynamic geometry lesson tabs">
        {["Construction", "Explain", "Examples", "Formulas", "Know more"].map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-[#087c9e] px-5 text-sm font-black text-white shadow-lg shadow-cyan-600/20" : "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-black text-[#53627f] hover:bg-cyan-50"} onClick={() => { setActiveTab(tab); onInteraction(); }}>
            {tabIcon(tab)}{tab}
          </button>
        ))}
      </nav>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <main className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#081238]">Construction Workspace <HelpCircle className="ml-1 inline h-4 w-4 text-[#53627f]" /></h2>
            <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#dbe6fb] bg-white px-3 text-xs font-black text-[#152348]" onClick={() => { setSnap((value) => !value); onInteraction(); }}><Grid3X3 className="h-4 w-4" />{snap ? "Snap to grid" : "Free drag"}</button>
          </div>
          <div className="grid gap-3 lg:grid-cols-[76px_minmax(0,1fr)]">
            <ToolRail active={spec.activeTool} />
            <GeometryCanvas spec={spec} x={x} y={y} snap={snap} />
          </div>
          <UndoHistory spec={spec} />
        </main>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#081238]">{spec.propertyTitle}</h2>
              <ChevronDown className="h-4 w-4 text-[#53627f]" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm font-black text-[#152348]"><span className="h-3 w-3 rounded-full bg-blue-600" />P <span className="font-semibold text-[#53627f]">{spec.activeTool}</span></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <NumericControl label="x" value={x} onChange={(value) => updatePoint("x", value)} />
              <NumericControl label="y" value={y} onChange={(value) => updatePoint("y", value)} />
            </div>
            <label className="mt-4 block text-xs font-black text-[#152348]">Label<input className="mt-2 h-11 w-full rounded-xl border border-[#dbe6fb] px-3 font-semibold outline-none focus:border-cyan-400" value="P" readOnly /></label>
            <div className="mt-4 grid grid-cols-[1fr_1fr] gap-3">
              <select className="h-11 rounded-xl border border-[#dbe6fb] bg-white px-3 text-sm font-bold"><option>Blue</option></select>
              <select className="h-11 rounded-xl border border-[#dbe6fb] bg-white px-3 text-sm font-bold"><option>Solid</option></select>
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 shadow-sm">
            <p className="text-sm font-black text-[#087b98]"><Eye className="mr-2 inline h-4 w-4" />Observe</p>
            <p className="mt-3 font-serif text-lg text-[#081238]">{spec.result}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#53627f]">{spec.insight}</p>
          </section>

          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
            <p className="text-sm font-black text-[#081238]">Tools & Tips</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-5 text-[#53627f]">
              {spec.checks.map((check) => <li key={check}>• {check}</li>)}
            </ul>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
        <h2 className="text-lg font-black text-[#087b98]">Construction steps (Compass-style)</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {spec.steps.map((step, index) => <StepCard key={step} index={index + 1} text={step} tool={spec.tool} />)}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)_minmax(280px,.8fr)]">
        <InfoCard title="Insight" body={spec.insight} formula={spec.result} />
        <InfoCard title={`Rule (${spec.title})`} body={spec.rule} formula={ruleFormula(spec.tool)} />
        <PracticeCard spec={spec} />
      </div>

      <footer className="grid gap-4 rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr]">
        <button type="button" className="min-h-16 rounded-xl border border-violet-200 bg-white px-4 text-left font-black text-[#081238]">← Previous<br /><span className="text-xs font-semibold text-[#53627f]">Dynamic Geometry</span></button>
        <div className="grid place-items-center text-center text-sm font-black text-[#53627f]"><span>Lesson progress</span><span className="mt-2 h-2 w-full max-w-64 rounded-full bg-slate-100"><span className="block h-2 w-1/3 rounded-full bg-cyan-600" /></span></div>
        <button type="button" className="min-h-16 rounded-xl border border-violet-200 bg-violet-50 px-4 text-right font-black text-[#081238]">Next →<br /><span className="text-xs font-semibold text-[#53627f]">{nextDynamicTitle(lesson.id)}</span></button>
      </footer>
    </section>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[#dbe6fb] bg-white px-4 py-3 shadow-sm"><p className="text-[10px] font-black uppercase text-[#53627f]">{label}</p><p className="mt-1 text-sm font-black text-[#152348]">{value}</p></div>;
}

function ToolRail({ active }: { active: string }) {
  const tools: Array<[string, ReactNode]> = [["Point", <MousePointer2 className="h-4 w-4" />], ["Select", <Move className="h-4 w-4" />], ["Pan", <Hand className="h-4 w-4" />], ["Zoom", <ZoomIn className="h-4 w-4" />], ["Delete", <Trash2 className="h-4 w-4" />]];
  return <div className="grid content-start overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm">{tools.map(([label, icon]) => <button key={label} type="button" className={label === active ? "grid min-h-16 place-items-center gap-1 bg-cyan-50 text-xs font-black text-[#087b98] ring-1 ring-cyan-300" : "grid min-h-16 place-items-center gap-1 text-xs font-black text-[#53627f] hover:bg-cyan-50"}>{icon}{label}</button>)}</div>;
}

function GeometryCanvas({ spec, x, y, snap }: { spec: GeometrySpec; x: number; y: number; snap: boolean }) {
  const px = 430 + x * 38;
  const py = 300 - y * 38;
  return (
    <svg viewBox="0 0 760 520" className="w-full rounded-xl border border-[#dbe6fb] bg-white" role="img" aria-label={`${spec.title} construction canvas`}>
      <defs>
        <pattern id={`geometry-grid-${spec.mockupId}`} width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#e6eefb" /></pattern>
      </defs>
      <rect width="760" height="520" fill={`url(#geometry-grid-${spec.mockupId})`} />
      <line x1="72" y1="300" x2="720" y2="300" stroke="#111827" strokeWidth="2" />
      <line x1="430" y1="62" x2="430" y2="485" stroke="#111827" strokeWidth="2" />
      <text x="714" y="286" fontSize="15" fontWeight="900">x</text><text x="444" y="76" fontSize="15" fontWeight="900">y</text>
      {renderGeometryShape(spec.tool, px, py)}
      <circle cx={px} cy={py} r="10" fill="#0ea5c9" /><text x={px + 18} y={py - 12} fill="#0795bd" fontSize="22" fontWeight="900">P</text>
      <foreignObject x="255" y="430" width="250" height="58"><div className="flex h-full items-center gap-3 rounded-xl border border-[#dbe6fb] bg-white/95 px-4 text-sm font-black text-[#152348] shadow"><span className="h-3 w-3 rounded-full bg-blue-600" />P <span className="rounded-lg border px-3 py-1">x {x.toFixed(2)}</span><span className="rounded-lg border px-3 py-1">y {y.toFixed(2)}</span></div></foreignObject>
      <foreignObject x="652" y="82" width="82" height="70"><button className="h-full w-full rounded-xl border border-[#dbe6fb] bg-white/95 text-xs font-black text-[#53627f]">{snap ? "Snap\nto grid" : "Free\ndrag"}</button></foreignObject>
      <g transform="translate(682 348)"><rect width="46" height="116" rx="14" fill="white" stroke="#dbe6fb" /><text x="23" y="32" textAnchor="middle" fontSize="24">+</text><text x="23" y="70" textAnchor="middle" fontSize="24">−</text><path d="M15 92h16v16H15z" fill="none" stroke="#53627f" /></g>
    </svg>
  );
}

function renderGeometryShape(tool: GeometryTool, px: number, py: number) {
  if (tool === "point") return null;
  if (tool === "line" || tool === "parallel" || tool === "perpendicular" || tool === "fit" || tool === "relation") return <><line x1="80" y1="360" x2="720" y2="220" stroke="#7c3aed" strokeWidth="4" />{tool === "perpendicular" ? <><line x1={px} y1="70" x2={px} y2="470" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="8 7" /><path d={`M${px} 300 h30 v-30`} fill="none" stroke="#7c3aed" strokeWidth="3" /><text x={px - 38} y="290" fontSize="16" fill="#1e3a8a">90°</text></> : null}{tool === "parallel" ? <line x1="80" y1="300" x2="720" y2="160" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="8 7" /> : null}</>;
  if (tool === "segment" || tool === "ray" || tool === "polyline") return <><polyline points="170,365 330,205 510,285 640,160" fill="none" stroke="#7c3aed" strokeWidth="4" /><circle cx="170" cy="365" r="8" fill="#2563eb" /><circle cx="330" cy="205" r="8" fill="#2563eb" /><circle cx="510" cy="285" r="8" fill="#2563eb" />{tool === "ray" ? <line x1="330" y1="205" x2="705" y2="86" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8 7" /> : null}</>;
  if (tool === "bisector") return <><line x1="160" y1="330" x2="620" y2="330" stroke="#7c3aed" strokeWidth="4" /><line x1="390" y1="80" x2="390" y2="480" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="8 7" /><path d="M250 292 C320 250 460 250 530 292" fill="none" stroke="#f59e0b" strokeWidth="3" /></>;
  if (tool === "tangent" || tool === "circle" || tool === "arc" || tool === "sector") return <><circle cx="410" cy="260" r="128" fill={tool === "sector" ? "#cffafe" : "none"} stroke="#0ea5c9" strokeWidth="4" /><line x1="410" y1="260" x2="538" y2="260" stroke="#7c3aed" strokeWidth="3" />{tool === "tangent" ? <line x1="538" y1="88" x2="538" y2="432" stroke="#7c3aed" strokeWidth="4" /> : null}{tool === "arc" ? <path d="M282 260 A128 128 0 0 1 504 162" fill="none" stroke="#f97316" strokeWidth="7" /> : null}{tool === "sector" ? <line x1="410" y1="260" x2="500" y2="168" stroke="#7c3aed" strokeWidth="3" /> : null}</>;
  if (tool === "triangle" || tool === "polygon") return <><polygon points={tool === "triangle" ? "250,360 560,350 410,126" : "210,320 300,160 470,150 600,300 425,400"} fill="#dffafe" stroke="#0ea5c9" strokeWidth="4" /><path d="M250 360 L410 126 L560 350" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="8 7" /></>;
  if (tool === "conic") return <><ellipse cx="410" cy="260" rx="190" ry="106" fill="none" stroke="#0ea5c9" strokeWidth="4" /><path d="M255 420 C380 70 485 70 620 420" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8 7" />{[[250,260],[330,165],[430,154],[528,202],[570,310]].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="7" fill="#f97316" />)}</>;
  if (tool === "measure" || tool === "angle") return <><line x1="220" y1="360" x2="610" y2="190" stroke="#7c3aed" strokeWidth="4" /><path d="M220 360 A82 82 0 0 1 296 326" fill="none" stroke="#f97316" strokeWidth="5" /><text x="365" y="250" fontSize="22" fontWeight="900" fill="#0f766e">{tool === "angle" ? "48°" : "5.00 u"}</text></>;
  return <><path d="M160 390 C260 160 392 410 520 164 S660 320 690 180" fill="none" stroke="#0ea5c9" strokeWidth="4" /><g stroke="#7c3aed" strokeWidth="2" opacity=".45">{Array.from({ length: 8 }, (_, i) => <line key={i} x1={140 + i * 70} y1="110" x2={210 + i * 70} y2="430" />)}</g></>;
}

function UndoHistory({ spec }: { spec: GeometrySpec }) {
  return <div className="mt-4 rounded-xl border border-[#dbe6fb] bg-[#f8fbff] p-3"><p className="text-sm font-black text-[#152348]"><RotateCcw className="mr-2 inline h-4 w-4" />Undo history</p><div className="mt-3 flex items-center gap-3 overflow-x-auto text-xs font-bold text-[#53627f]">{["Start", `Add ${spec.activeTool}`, "Move P", "Check relation", "Save construction"].map((item, index) => <div key={item} className="flex shrink-0 items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#dbe6fb] bg-white">{index ? "●" : "○"}</span><span>{item}</span>{index < 4 ? <span className="text-xl text-[#087b98]">→</span> : null}</div>)}</div></div>;
}

function NumericControl({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="grid grid-cols-[32px_1fr] items-center overflow-hidden rounded-xl border border-[#dbe6fb] bg-[#f8fbff] text-sm font-black text-[#53627f]"><span className="grid h-11 place-items-center border-r border-[#dbe6fb]">{label}</span><input aria-label={`${label} coordinate`} type="number" className="h-11 min-w-0 bg-white px-3 text-center font-mono font-black text-[#081238] outline-none" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function StepCard({ index, text, tool }: { index: number; text: string; tool: GeometryTool }) {
  return <article className="rounded-xl bg-[#f8fbff] p-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-600 text-xs font-black text-white">{index}</span><p className="mt-3 min-h-12 text-sm font-semibold leading-5 text-[#53627f]">{text}</p><svg viewBox="0 0 180 90" className="mt-3 w-full rounded-lg bg-white"><line x1="20" y1="68" x2="160" y2="28" stroke="#7c3aed" strokeWidth="3" />{tool === "circle" || tool === "arc" || tool === "sector" ? <circle cx="90" cy="45" r="30" fill="none" stroke="#0ea5c9" strokeWidth="3" /> : <circle cx="90" cy="45" r="6" fill="#0ea5c9" />}</svg></article>;
}

function InfoCard({ title, body, formula }: { title: string; body: string; formula: string }) {
  return <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm"><h2 className="text-lg font-black text-[#087b98]">{title}</h2><p className="mt-3 text-sm font-semibold leading-6 text-[#53627f]">{body}</p><div className="mt-4 rounded-xl border border-[#dbe6fb] bg-[#f8fbff] p-4 text-center font-serif text-xl font-black text-[#081238]">{formula}</div></section>;
}

function PracticeCard({ spec }: { spec: GeometrySpec }) {
  return <section className="rounded-2xl border border-violet-300 bg-white/95 p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-black text-violet-800">Try It: Your Turn</h2><button className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">Practice</button></div><p className="mt-3 text-sm font-semibold leading-6 text-[#53627f]">{spec.practice}</p><div className="mt-4 space-y-3">{spec.checks.slice(0, 3).map((check) => <label key={check} className="flex gap-2 text-sm font-semibold text-[#53627f]"><input type="checkbox" defaultChecked />{check}</label>)}</div><button type="button" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 font-black text-white"><CheckCircle2 className="h-4 w-4" />Check Answer</button></section>;
}

function tabIcon(tab: string) {
  if (tab === "Construction") return <Compass className="h-4 w-4" />;
  if (tab === "Explain") return <BookOpen className="h-4 w-4" />;
  if (tab === "Examples") return <PenTool className="h-4 w-4" />;
  if (tab === "Formulas") return <Ruler className="h-4 w-4" />;
  return <Eye className="h-4 w-4" />;
}

function geometryHeaderIcon(tool: GeometryTool) {
  if (tool === "circle" || tool === "arc" || tool === "sector" || tool === "conic") return <Circle className="h-16 w-16" />;
  if (tool === "measure" || tool === "angle") return <Ruler className="h-16 w-16" />;
  return <Compass className="h-16 w-16" />;
}

function skillLabel(tool: GeometryTool) {
  if (tool === "perpendicular") return "Slope, Perpendicularity";
  if (tool === "parallel") return "Direction, Parallel";
  if (tool === "circle" || tool === "arc" || tool === "sector") return "Circle, Radius";
  if (tool === "measure" || tool === "angle") return "Measure, Verify";
  return "Geometry Basics";
}

function ruleFormula(tool: GeometryTool) {
  if (tool === "perpendicular") return "m1 x m2 = -1";
  if (tool === "parallel") return "m1 = m2";
  if (tool === "circle") return "CP = r";
  if (tool === "angle") return "angle AOB";
  if (tool === "measure") return "AB = distance(A,B)";
  if (tool === "conic") return "Ax^2+Bxy+Cy^2+Dx+Ey+F=0";
  return "constraint stays true while dragging";
}

function nextDynamicTitle(lessonId: number) {
  return dynamicGeometrySpecFor(Math.min(235, lessonId + 1)).title;
}

function dynamicGeometrySpecFor(lessonId: number): GeometrySpec {
  const item = dynamicGeometryItems.find((entry) => entry.id === lessonId) ?? dynamicGeometryItems[0];
  return {
    mockupId: item.mockup,
    title: item.title,
    subtitle: item.subtitle,
    tool: item.tool,
    activeTool: item.activeTool,
    result: item.result,
    propertyTitle: item.propertyTitle,
    steps: [`Choose the ${item.activeTool} tool.`, item.step, "Drag the defining points and keep the relation true.", "Verify the construction result."],
    controls: [["x", "2.00"], ["y", "1.00"]],
    checks: item.checks,
    insight: item.insight,
    rule: item.rule,
    practice: item.practice,
  };
}

const dynamicGeometryItems: Array<{ id: number; mockup: string; title: string; subtitle: string; tool: GeometryTool; activeTool: string; result: string; propertyTitle: string; step: string; checks: string[]; insight: string; rule: string; practice: string }> = [
  g(198, "0255", "Free Point", "Create independent points anywhere in the plane.", "point", "Point", "P = (2.00, 1.00)", "Point Properties", "Click on the plane to place P.", ["Use Point tool to add a free point.", "Drag to move the point anywhere.", "Toggle Snap to grid for precision."], "A free point is independent: both coordinates can change freely.", "A free point is defined by an ordered pair of real numbers.", "Add a free point Q and place it at (4, -2)."),
  g(199, "0256", "Point on Object", "Constrain a point to stay on a parent object.", "point", "Point", "P stays on its object", "Attached Point", "Place P on the line or circle.", ["Point remains attached.", "Parent object controls motion.", "Coordinates update while constrained."], "A point on object moves, but only along its parent.", "The parent object supplies the constraint.", "Attach Q to the circle and drag it around the circumference."),
  g(200, "0257", "Intersection Point", "Create an exact point where two objects meet.", "line", "Point", "I = object A ∩ object B", "Intersection Properties", "Select two objects that cross.", ["Uses exact crossing.", "Shared by both objects.", "Updates when parents move."], "Intersection points are dependent on both parent objects.", "A valid intersection satisfies both object equations.", "Construct the intersection of a line and circle."),
  g(201, "0258", "Midpoint or Centre", "Mark the exact halfway point or centre.", "bisector", "Point", "M is equidistant from A and B", "Midpoint Properties", "Select a segment or circle.", ["Equal distances from endpoints.", "Updates with endpoints.", "Works as a centre marker."], "A midpoint is fixed by equal distance from both endpoints.", "M=((x1+x2)/2,(y1+y2)/2).", "Find the midpoint of AB after dragging A."),
  g(202, "0259", "Attach / Detach Point", "Switch a point between constrained and free motion.", "point", "Select", "P constraint toggled", "Constraint Properties", "Choose attach or detach.", ["Attach follows parent.", "Detach moves freely.", "Dependency list updates."], "Attaching adds a constraint; detaching releases it.", "Constraint state controls allowed motion.", "Detach P from the circle and move it off the circumference."),
  g(203, "0260", "Line Through Two Points", "Construct a straight line through two points.", "line", "Line", "Line AB", "Line Properties", "Select A, then B.", ["Two distinct points define a line.", "Line extends both ways.", "Dragging endpoints rotates line."], "A line through two points is unique when the points are distinct.", "A and B determine exactly one line.", "Create line AB through two free points."),
  g(204, "0261", "Segment", "Draw a finite segment between two endpoints.", "segment", "Segment", "Segment AB", "Segment Properties", "Select the first and second endpoint.", ["Has two endpoints.", "Length is measurable.", "Does not extend forever."], "A segment is the finite part of a line between endpoints.", "AB has fixed endpoints A and B.", "Draw segment AB and measure its length."),
  g(205, "0262", "Segment with Given Length", "Construct a segment with a specified length.", "segment", "Segment", "AB = 5.00", "Length Properties", "Set length, then choose start and direction.", ["Length remains fixed.", "Endpoint lies on guide circle.", "Measurement verifies value."], "A fixed-length segment preserves distance while direction can change.", "AB = chosen length.", "Construct a segment of length 5 units."),
  g(206, "0263", "Ray", "Create a ray with a start point and direction.", "ray", "Ray", "Ray AB", "Ray Properties", "Select start A and direction point B.", ["Starts at A.", "Passes through B.", "Extends in one direction."], "A ray begins at one endpoint and continues forever in one direction.", "Ray AB starts at A and goes through B.", "Create ray AB and drag B to change direction."),
  g(207, "0264", "Polyline", "Join multiple points with straight pieces.", "polyline", "Polyline", "A-B-C-D path", "Polyline Properties", "Click vertices in order.", ["Straight pieces connect vertices.", "Vertex order matters.", "Path can remain open."], "A polyline is a path made of consecutive line segments.", "A-B-C uses segments AB and BC.", "Create a four-vertex polyline."),
  g(208, "0265", "Perpendicular Line", "Construct a right-angle line through a given point.", "perpendicular", "Perpendicular", "Right angle = 90°", "Controls", "Through P, draw a line perpendicular to the given line.", ["Passes through P.", "Perpendicular to given line.", "Right angle = 90°."], "For non-vertical lines, perpendicular slopes multiply to -1.", "A perpendicular line meets the given line at 90 degrees.", "Construct a perpendicular to the given line through point P."),
  g(209, "0266", "Parallel Line", "Construct a line through a point matching a given direction.", "parallel", "Line", "No intersection", "Controls", "Through P, draw a line parallel to the given line.", ["Passes through P.", "Matches direction.", "No crossing."], "Parallel lines keep the same direction and never meet.", "Parallel lines have equal slopes.", "Construct a parallel line through P."),
  g(210, "0267", "Perpendicular Bisector", "Bisect a segment at a right angle.", "bisector", "Bisector", "PA = PB", "Bisector Properties", "Use equal arcs from the endpoints.", ["Cuts segment in half.", "Meets at 90°.", "All points are equidistant."], "The perpendicular bisector collects all points equally far from A and B.", "Any point on the bisector has PA = PB.", "Construct the perpendicular bisector of AB."),
  g(211, "0268", "Angle Bisector", "Split an angle into two equal angles.", "bisector", "Bisector", "∠AOC = ∠COB", "Angle Properties", "Create equal arc marks on both arms.", ["Shares the vertex.", "Two angles are equal.", "Stays inside the angle."], "An angle bisector is the equal-turn line from the vertex.", "The bisector creates two equal angles.", "Bisect angle AOB."),
  g(212, "0269", "Tangent", "Construct a line touching a circle at one point.", "tangent", "Line", "Radius ⟂ tangent", "Tangent Properties", "Draw tangent at the touch point.", ["Touches once.", "Radius is perpendicular.", "Does not cut the circle."], "At the point of tangency, the radius meets the tangent at 90 degrees.", "Tangent line is perpendicular to the radius.", "Construct a tangent at point P on the circle."),
  g(213, "0270", "Best-Fit Line", "Model a point cloud with a trend line.", "fit", "Line", "Residuals balanced", "Fit Properties", "Adjust the line to minimise residuals.", ["Shows trend.", "Residuals compare errors.", "Need not pass every point."], "A best-fit line models the overall trend rather than every data point.", "Best fit balances positive and negative residuals.", "Place a trend line through the data."),
  g(214, "0271", "Triangle Constructor", "Build a triangle from valid vertices.", "triangle", "Polygon", "A + B + C = 180°", "Triangle Properties", "Place three non-collinear points.", ["Three vertices.", "Three sides.", "Angle sum is 180°."], "A triangle needs three non-collinear vertices.", "Triangle angle sum equals 180 degrees.", "Construct triangle ABC."),
  g(215, "0272", "Regular Polygon", "Create a polygon with equal sides and angles.", "polygon", "Polygon", "Equal sides and angles", "Polygon Properties", "Choose centre, vertex, and side count.", ["All sides equal.", "All angles equal.", "Exterior angle = 360°/n."], "Regular polygons preserve equal side lengths and equal angles.", "Exterior angle is 360 degrees divided by n.", "Construct a regular hexagon."),
  g(216, "0273", "Rigid Polygon", "Move a polygon without changing its shape.", "polygon", "Select", "Shape preserved", "Rigid Properties", "Drag the polygon as one object.", ["Lengths stay fixed.", "Angles stay fixed.", "Moves as a whole."], "A rigid polygon preserves internal distances and angles.", "Rigid motion keeps shape congruent.", "Drag a rigid triangle without changing side lengths."),
  g(217, "0274", "General Polygon", "Create a polygon from ordered vertices.", "polygon", "Polygon", "Ordered boundary", "Polygon Properties", "Click vertices around the boundary.", ["Vertex order matters.", "Boundary closes.", "Area can be measured."], "A polygon boundary follows the selected vertex order.", "A polygon is a closed chain of segments.", "Create a pentagon with five ordered vertices."),
  g(218, "0275", "Circle: Centre and Point", "Create a circle using its centre and one point.", "circle", "Circle", "Radius = CP", "Circle Properties", "Select centre C, then point P.", ["C is centre.", "P lies on circle.", "CP controls radius."], "The radius is the distance from centre to point on the circle.", "All circle points are r from C.", "Construct a circle with centre C through P."),
  g(219, "0276", "Circle: Centre and Radius", "Create a circle with fixed radius.", "circle", "Circle", "r = 4.00", "Radius Properties", "Set radius and choose centre.", ["Radius fixed.", "Centre can move.", "All points stay r away."], "A centre-radius circle keeps the same radius while the centre moves.", "Circle equation depends on centre and radius.", "Construct a circle of radius 4."),
  g(220, "0277", "Circle Through Three Points", "Construct the unique circle through three non-collinear points.", "circle", "Circle", "Circumcircle ABC", "Circumcircle Properties", "Select three non-collinear points.", ["Three points define circle.", "Fails if collinear.", "Centre from bisectors."], "Three non-collinear points determine one circumcircle.", "The centre is intersection of perpendicular bisectors.", "Construct the circle through A, B, and C."),
  g(221, "0278", "Compass", "Copy a distance exactly with a compass radius.", "circle", "Compass", "Copied radius AB", "Compass Properties", "Copy distance AB from a new centre.", ["Preserves length.", "Creates guide circle.", "Useful for constructions."], "A compass copies distance without measuring numerically.", "Copied radius remains equal to source segment.", "Copy AB as a radius from point C."),
  g(222, "0279", "Semicircle", "Draw half a circle over a diameter.", "arc", "Circle", "Arc = 180°", "Arc Properties", "Select diameter endpoints.", ["Uses a diameter.", "Half circle only.", "Arc measure 180°."], "A semicircle is exactly half of the circle over a diameter.", "Central angle is 180 degrees.", "Construct a semicircle with diameter AB."),
  g(223, "0280", "Circular Arc", "Draw a selected portion of a circle.", "arc", "Arc", "Arc AB", "Arc Properties", "Choose centre, start, and end.", ["Follows the circle.", "Has start and end.", "Differs from chord."], "An arc is curved and belongs to the circle.", "Arc length depends on radius and central angle.", "Construct the minor arc from A to B."),
  g(224, "0281", "Circumcircular Arc", "Create an arc through three points.", "arc", "Arc", "Arc through A, B, C", "Arc Properties", "Select three points on the supporting circle.", ["Uses circumcircle.", "Passes through three points.", "Curved through middle point."], "A circumcircular arc belongs to the circle determined by three points.", "Three points determine the supporting circle.", "Construct an arc through A, B, and C."),
  g(225, "0282", "Circular Sector", "Construct a sector bounded by two radii and an arc.", "sector", "Sector", "Sector area", "Sector Properties", "Choose centre and two boundary points.", ["Two radii.", "One arc.", "Central angle controls area."], "A sector is the slice made by two radii and the connecting arc.", "Area = theta/360 x pi r^2.", "Construct a 60 degree sector."),
  g(226, "0283", "Conic Through Five Points", "Fit a conic through five point constraints.", "conic", "Conic", "Five constraints", "Conic Properties", "Select five well-spaced points.", ["Needs five points.", "Avoid duplicate constraints.", "Updates as points move."], "A general conic is determined by five independent point constraints.", "Five points fix the conic coefficients up to scale.", "Construct a conic through five points."),
  g(227, "0284", "Ellipse", "Explore the conic with constant sum of focal distances.", "conic", "Conic", "PF1 + PF2 constant", "Ellipse Properties", "Adjust foci and boundary point.", ["Two foci.", "Constant distance sum.", "Closed curve."], "An ellipse keeps the sum of distances to two foci constant.", "PF1 + PF2 = constant.", "Create an ellipse and verify the focal sum."),
  g(228, "0285", "Hyperbola", "Explore the conic with constant distance difference.", "conic", "Conic", "|PF1 - PF2| constant", "Hyperbola Properties", "Adjust foci and branch point.", ["Two branches.", "Constant difference.", "Asymptote guides."], "A hyperbola keeps the difference of focal distances constant.", "|PF1 - PF2| = constant.", "Create a hyperbola and compare focal distances."),
  g(229, "0286", "Parabola", "Construct points equidistant from focus and directrix.", "conic", "Conic", "PF = distance to directrix", "Parabola Properties", "Move focus and directrix.", ["One focus.", "One directrix.", "Equal distances."], "A parabola is the locus of points equidistant from focus and directrix.", "PF = d(P, directrix).", "Construct a parabola from focus and directrix."),
  g(230, "0287", "Distance / Length", "Measure an exact segment length.", "measure", "Measure", "AB = 5.00", "Measurement Properties", "Select two points or a segment.", ["Exact measurement.", "Updates on drag.", "Uses units."], "Distance is the exact length between two points.", "AB = sqrt((dx)^2 + (dy)^2).", "Measure the length of AB."),
  g(231, "0288", "Area", "Measure surface inside a boundary.", "measure", "Measure", "Area = 12 square units", "Area Properties", "Select a closed polygon.", ["Needs closed boundary.", "Square units.", "Different from perimeter."], "Area measures covered surface inside a closed boundary.", "Rectangle area = base x height.", "Measure the area of a polygon."),
  g(232, "0289", "Angle", "Measure the turn between two rays.", "angle", "Angle", "∠AOB = 48°", "Angle Properties", "Select three points with vertex in the middle.", ["Uses a vertex.", "Measures opening.", "Not side length."], "Angle size is the amount of turn between rays.", "Angle AOB has vertex O.", "Measure angle AOB."),
  g(233, "0290", "Fixed Angle", "Construct a ray at a chosen angle.", "angle", "Angle", "Fixed angle = 45°", "Fixed Angle Properties", "Set angle size and choose base ray.", ["Angle stays fixed.", "Ray can move.", "Constraint persists."], "A fixed angle preserves the turn while the construction moves.", "The chosen angle remains constant.", "Create a 45 degree ray from A."),
  g(234, "0291", "Relation Checker", "Test exact geometric relationships.", "relation", "Select", "Relation verified", "Relation Properties", "Select objects and run checks.", ["Checks exact relation.", "Reports pass/fail.", "Avoids visual guessing."], "A relation checker verifies properties such as parallel, perpendicular, equal, and incident.", "Relations must remain true under dragging.", "Check whether two lines are perpendicular."),
  g(235, "0292", "Construction Steps", "Inspect the dependency order of a construction.", "steps", "Protocol", "Step order valid", "Protocol Properties", "Review each object dependency.", ["Shows dependencies.", "Supports undo.", "Explains construction order."], "Construction steps reveal which objects depend on earlier choices.", "A valid construction follows dependency order.", "Reorder the steps and verify dependencies."),
];

function g(id: number, mockup: string, title: string, subtitle: string, tool: GeometryTool, activeTool: string, result: string, propertyTitle: string, step: string, checks: string[], insight: string, rule: string, practice: string) {
  return { id, mockup, title, subtitle, tool, activeTool, result, propertyTitle, step, checks, insight, rule, practice };
}

function geometryParamsForLesson(lessonId: number, title: string): ReusableLessonEngineParams {
  const params = reusableEngineParamsFor("geometry-2d", title);
  return geometry2DVisualPresetForLesson(lessonId, params);
}
