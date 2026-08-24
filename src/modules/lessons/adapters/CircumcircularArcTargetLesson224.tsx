import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleDot,
  Expand,
  Globe2,
  Lightbulb,
  Link2,
  MousePointer2,
  Play,
  RotateCcw,
  Share2,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type PointName = "A" | "B" | "C";
type Tool = "select" | "point" | "segment" | "circle";
type Drag = { index: number } | null;
type PointTuple = [Point | null, Point | null, Point | null];

const initialPoints: PointTuple = [
  { x: 0, y: 5 },
  { x: -4, y: -1 },
  { x: 4, y: -1 },
];
const names: PointName[] = ["A", "B", "C"];

export default function CircumcircularArcTargetLesson224({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<PointTuple>(clonePoints(initialPoints));
  const [selected, setSelected] = useState(0);
  const [tool, setTool] = useState<Tool>("select");
  const [drag, setDrag] = useState<Drag>(null);
  const [showCenter, setShowCenter] = useState(true);
  const [showRadii, setShowRadii] = useState(true);
  const [showCentral, setShowCentral] = useState(true);
  const [showInscribed, setShowInscribed] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showSegments, setShowSegments] = useState(true);
  const [showCircle, setShowCircle] = useState(true);
  const [replayStage, setReplayStage] = useState(5);
  const [replaying, setReplaying] = useState(false);
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const challenges = [120, 80, 140, 100];
  const targetArc = challenges[challengeIndex];
  const [practiceArc, setPracticeArc] = useState("120.00");
  const [practiceAngle, setPracticeAngle] = useState("60.00");
  const [practiceFeedback, setPracticeFeedback] = useState<
    "idle" | "correct" | "incorrect"
  >("correct");

  const model = useMemo(() => circumModel(points), [points]);

  const reset = () => {
    setPoints(clonePoints(initialPoints));
    setSelected(0);
    setTool("select");
    setShowCenter(true);
    setShowRadii(true);
    setShowCentral(true);
    setShowInscribed(true);
    setShowGrid(false);
    setShowSegments(true);
    setShowCircle(true);
    setReplayStage(5);
    setReplaying(false);
    onInteraction();
  };

  useEffect(() => {
    setPoints(clonePoints(initialPoints));
    setSelected(0);
    setTool("select");
    setShowCenter(true);
    setShowRadii(true);
    setShowCentral(true);
    setShowInscribed(true);
    setShowGrid(false);
    setShowSegments(true);
    setShowCircle(true);
    setReplayStage(5);
    setReplaying(false);
  }, [resetToken]);

  useEffect(() => {
    if (!replaying) return;
    if (replayStage >= 5) {
      setReplaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setReplayStage((stage) => stage + 1);
      onInteraction();
    }, 420);
    return () => window.clearTimeout(timer);
  }, [onInteraction, replayStage, replaying]);

  const updatePoint = (index: number, point: Point) => {
    setPoints((current) => {
      const next = [...current] as PointTuple;
      next[index] = { x: clamp(point.x, -10, 10), y: clamp(point.y, -10, 10) };
      return next;
    });
    setSelected(index);
    setReplayStage(5);
    onInteraction();
  };

  const deleteSelected = () => {
    setPoints((current) => {
      const next = [...current] as PointTuple;
      next[selected] = null;
      return next;
    });
    setTool("point");
    onInteraction();
  };

  const replay = () => {
    setReplayStage(0);
    setReplaying(true);
    onInteraction();
  };

  const newChallenge = () => {
    const nextIndex = (challengeIndex + 1) % challenges.length;
    setChallengeIndex(nextIndex);
    setPracticeArc(challenges[nextIndex].toFixed(2));
    setPracticeAngle((challenges[nextIndex] / 2).toFixed(2));
    setPracticeFeedback("correct");
    onInteraction();
  };

  const checkPractice = () => {
    const arc = Number(practiceArc);
    const angle = Number(practiceAngle);
    setPracticeFeedback(
      Math.abs(arc - targetArc) <= 0.05 && Math.abs(angle - targetArc / 2) <= 0.05
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  const share = async () => {
    const text = model
      ? `Circumcircular arc: O(${format(model.center.x)}, ${format(model.center.y)}), r=${model.radius.toFixed(2)}, central=${model.centralAngle.toFixed(2)}°, inscribed=${model.inscribedAngle.toFixed(2)}°`
      : "Circumcircular arc requires three non-collinear points.";
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Keep the visible confirmation available without clipboard permission.
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
    onInteraction();
  };

  return (
    <section
      className="text-slate-900"
      style={{ marginTop: -12 }}
      data-testid="dynamic-geometry-mockup-0281"
      data-dedicated-lesson="224"
      data-object-model="three-point-circumcircle-arc"
      data-direct-interaction="true"
      aria-label="Circumcircular Arc dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>

      <header className="h-[151px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid h-full grid-cols-[minmax(340px,1.5fr)_repeat(3,minmax(100px,.6fr))] items-center gap-3">
          <div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-[7px] font-black uppercase text-slate-600">
              Dynamic Geometry Constructions
            </span>
            <h1 className="mt-2 text-[27px] font-black leading-8 text-[#10275f]">
              Circumcircular Arc
            </h1>
            <p className="mt-1 text-[10px] text-slate-600">
              Construct three-point arcs and explore their properties.
            </p>
            <div className="mt-3 flex gap-2">
              <label className="target-circ-header-action">
                <Globe2 />
                <select
                  aria-label="Circumcircular arc language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    onInteraction();
                  }}
                >
                  <option>English (English)</option>
                  <option>Hindi (हिन्दी)</option>
                </select>
              </label>
              <button type="button" className="target-circ-header-action" onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button type="button" className="target-circ-header-action" onClick={() => void share()}>
                <Share2 /> {shared ? "Copied" : "Share"}
              </button>
              <a className="target-circ-header-action" href="/workspace/geometry">
                <Expand /> Workspace
              </a>
            </div>
          </div>
          <HeaderFact icon={<CircleDot />} label="Level" value="Foundation–Advanced" />
          <HeaderFact icon={<RotateCcw />} label="Time" value="6–10 min" />
          <HeaderFact icon={<Wrench />} label="Tools" value="Construction Studio" />
        </div>
      </header>

      <nav className="mt-1 grid h-[59px] grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white px-2 shadow-sm">
        {[
          ["Observe", "See it in action", "circ-main"],
          ["Manipulate", "Move the points", "circ-main"],
          ["Notice", "Find the pattern", "circ-measures"],
          ["Understand", "The rule", "circ-why"],
          ["Try", "Practice", "circ-practice"],
        ].map(([label, sub, target], index) => (
          <button
            type="button"
            key={label}
            className={`relative flex items-center justify-center gap-2 text-left text-[8px] ${index === 0 ? "font-black text-blue-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600" : "text-slate-700"}`}
            onClick={() => {
              document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
              onInteraction();
            }}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-[9px] font-black">{index + 1}</span>
            <span><b className="block">{label}</b><small className="block text-[7px] font-normal">{sub}</small></span>
          </button>
        ))}
      </nav>

      <section id="circ-main" className="mt-[18px] grid h-[777px] grid-cols-[minmax(0,1fr)_233px] gap-[11px]">
        <div className="h-[777px] overflow-hidden rounded-xl border border-slate-200 bg-white p-[10px] shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[12px] font-black">Three points define a circumcircular arc.</h2>
              <p className="mt-1 text-[8px] text-slate-600">Drag the points A, B, or C. Observe the arc measure and angle relationships.</p>
            </div>
            <button type="button" aria-label="Fullscreen circumcircular arc" className="target-circ-icon" onClick={() => void document.documentElement.requestFullscreen?.()}><Expand /></button>
          </div>
          <div className="mt-3 grid h-10 grid-cols-4 items-center rounded-lg border border-slate-200 px-2 text-[8px]">
            <Toggle label="Show center O" checked={showCenter} onChange={setShowCenter} />
            <Toggle label="Show radii" checked={showRadii} onChange={setShowRadii} />
            <Toggle label="Show central ∠AOC" checked={showCentral} onChange={setShowCentral} />
            <Toggle label="Show inscribed ∠ABC" checked={showInscribed} onChange={setShowInscribed} />
          </div>
          <div className="relative mt-1 h-[505px] overflow-hidden rounded-lg border border-slate-100">
            <CircumCanvas
              points={points}
              model={model}
              drag={drag}
              tool={tool}
              selected={selected}
              showGrid={showGrid}
              showCenter={showCenter && replayStage >= 3}
              showRadii={showRadii && replayStage >= 3}
              showCentral={showCentral && replayStage >= 4}
              showInscribed={showInscribed && replayStage >= 4}
              showSegments={showSegments && replayStage >= 1}
              showCircle={showCircle && replayStage >= 3}
              showArc={replayStage >= 4}
              onDrag={setDrag}
              onPoint={updatePoint}
              onSelect={setSelected}
              onRestore={(point) => {
                const missing = points.findIndex((value) => value === null);
                updatePoint(missing >= 0 ? missing : selected, point);
                setTool("select");
              }}
            />
            <div className="absolute bottom-3 left-3 flex overflow-hidden rounded-md border bg-white shadow-sm">
              <ToolButton active={tool === "select"} label="Select and drag points" icon={<MousePointer2 />} onClick={() => setTool("select")} />
              <ToolButton active={tool === "point"} label="Place missing point" icon={<CircleDot />} onClick={() => setTool("point")} />
              <ToolButton active={showSegments} label="Toggle triangle segments" icon={<Link2 />} onClick={() => setShowSegments((value) => !value)} />
              <ToolButton active={showCircle} label="Toggle circumcircle" icon={<Circle />} onClick={() => setShowCircle((value) => !value)} />
              <button type="button" className="target-circ-tool" aria-label={`Remove point ${names[selected]}`} onClick={deleteSelected}><Trash2 /></button>
            </div>
            <label className="absolute bottom-3 right-3 flex h-8 items-center gap-2 rounded-md border bg-white px-3 text-[8px]">Grid <input type="checkbox" aria-label="Circumcircle grid" checked={showGrid} onChange={(event) => { setShowGrid(event.target.checked); onInteraction(); }} /></label>
          </div>
          <div id="circ-measures" className="mt-2 grid grid-cols-5 gap-2">
            <Metric label="Center" value={model ? `O (${format(model.center.x)}, ${format(model.center.y)})` : "Undefined"} tone="text-purple-700" />
            <Metric label="Radius" value={model ? model.radius.toFixed(2) : "—"} />
            <Metric label="Arc ⌢ABC" value={model ? `${model.arcThroughA.toFixed(2)}°` : "—"} tone="text-blue-700" />
            <Metric label="Central ∠AOC" value={model ? `${model.centralAngle.toFixed(2)}°` : "—"} tone="text-green-700" />
            <Metric label="Inscribed ∠ABC" value={model ? `${model.inscribedAngle.toFixed(2)}°` : "—"} tone="text-orange-600" />
          </div>
        </div>

        <aside className="h-[777px] overflow-hidden rounded-xl border border-slate-200 bg-white p-[10px] shadow-sm">
          <h2 className="text-[11px] font-black">Point Controls</h2>
          <p className="mt-1 text-[8px] text-slate-500">Drag sliders or enter coordinates.</p>
          <div className="mt-2 space-y-2">
            {points.map((point, index) => (
              <PointControls
                key={names[index]}
                name={names[index]}
                point={point}
                selected={selected === index}
                onSelect={() => setSelected(index)}
                onChange={(next) => updatePoint(index, next)}
              />
            ))}
          </div>
          <section className="mt-2 rounded-lg border border-slate-200 p-3 text-[8px]">
            <h3 className="font-black">Measurements</h3>
            {model ? <>
              <Measure label="Radius (OA = OB = OC)" value={model.radius.toFixed(2)} />
              <Measure label="Arc ⌢ABC (through A)" value={`${model.arcThroughA.toFixed(2)}°`} />
              <Measure label="Complementary arc" value={`${(360 - model.arcThroughA).toFixed(2)}°`} />
              <Measure label="Central ∠AOC" value={`${model.centralAngle.toFixed(2)}°`} tone="text-green-700" />
              <Measure label="Inscribed ∠ABC" value={`${model.inscribedAngle.toFixed(2)}°`} tone="text-orange-600" />
            </> : <p className="mt-3 rounded-md bg-rose-50 p-2 text-rose-700">Three non-collinear points are required.</p>}
          </section>
          <section className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[8px]">
            <h3 className="flex items-center gap-2 font-black text-amber-800"><Lightbulb className="h-4 w-4" /> Observation</h3>
            <p className="mt-2">The central angle is twice the inscribed angle intercepting the same arc.</p>
            <p className="mt-2 text-center font-serif text-[12px] italic">∠AOC = 2∠ABC</p>
          </section>
        </aside>
      </section>

      <section className="mt-3 grid h-[257px] grid-cols-[.85fr_1.1fr_1.3fr] gap-2">
        <article className="target-circ-card">
          <h2>Construction Steps</h2>
          {[
            "Place three non-collinear points A, B, C.",
            "Construct perpendicular bisectors of AB and AC.",
            "Their intersection is the circumcenter O.",
            "Draw the circle through A, B, C.",
            "Trace arc ABC from B to C through A.",
          ].map((step, index) => <p key={step} className="target-circ-step"><b>{index + 1}</b>{step}</p>)}
          <button type="button" className="target-circ-replay" onClick={replay}><Play />{replaying ? `Step ${replayStage} of 5` : "Replay Steps"}</button>
        </article>
        <article id="circ-why" className="target-circ-card">
          <h2>Why it works</h2>
          <p>All points on the circle are equidistant from the center O. The central angle ∠AOC subtends arc AC. The inscribed angle ∠ABC subtends the same arc, so:</p>
          <div className="target-circ-formula">m∠AOC = 2m∠ABC</div>
          <p className="mt-5">Therefore,</p>
          <p className="mt-3 text-center font-serif text-[11px] italic">m⌢AC = m∠AOC = 2m∠ABC</p>
        </article>
        <article id="circ-practice" className="target-circ-card">
          <h2>Try it</h2>
          <p>Make arc AC measure {targetArc}°. What is ∠ABC?</p>
          <p className="mt-3"><CheckCircle2 className="mr-2 inline h-4 w-4 text-green-600" />Adjust the points to get arc AC ≈ {targetArc}°.</p>
          <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={practiceFeedback === "correct"} onChange={() => setPracticeFeedback("idle")} /> Record the inscribed angle.</label>
          <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={practiceFeedback === "correct"} onChange={() => setPracticeFeedback("idle")} /> What do you notice?</label>
          <PracticeField label={`Arc AC (target ${targetArc}°)`} aria="Practice arc measure" value={practiceArc} onChange={(value) => { setPracticeArc(value); setPracticeFeedback("idle"); }} />
          <PracticeField label="Inscribed ∠ABC" aria="Practice inscribed angle" value={practiceAngle} onChange={(value) => { setPracticeAngle(value); setPracticeFeedback("idle"); }} />
          <button type="button" className="target-circ-check" onClick={checkPractice}>Check relationship</button>
          <p role="status" className={`mt-2 rounded-md px-2 py-1 font-black ${practiceFeedback === "correct" ? "bg-green-50 text-green-700" : practiceFeedback === "incorrect" ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-500"}`}>{practiceFeedback === "correct" ? `Well done! Arc ≈ ${targetArc}° and ∠ABC ≈ ${targetArc / 2}°.` : practiceFeedback === "incorrect" ? "Use the inscribed-angle theorem: divide the arc by 2." : "Enter both measurements, then check."}</p>
          <button type="button" className="target-circ-new" onClick={newChallenge}><RotateCcw /> New Challenge</button>
        </article>
      </section>

      <nav className="mt-[11px] grid h-12 grid-cols-2 gap-3" aria-label="Adjacent lessons">
        <a className="target-circ-nav" href="/lessons/geometry/223-circular-arc"><ArrowLeft /><span><b>Previous</b>Circular Arc</span></a>
        <a className="target-circ-nav justify-end text-right" href="/lessons/geometry/225-circular-sector"><span><b>Next</b>Circular Sector</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function HeaderFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex h-12 items-start gap-2 rounded-md border border-slate-200 p-2 text-[8px]"><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span><span><b className="block text-slate-500">{label}</b><strong className="mt-1 block text-slate-800">{value}</strong></span></div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2"><input type="checkbox" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className={`relative h-4 w-8 rounded-full ${checked ? "bg-blue-600" : "bg-slate-300"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${checked ? "translate-x-[17px]" : "translate-x-0.5"}`} /></span>{label}</label>;
}

function CircumCanvas({ points, model, drag, tool, selected, showGrid, showCenter, showRadii, showCentral, showInscribed, showSegments, showCircle, showArc, onDrag, onPoint, onSelect, onRestore }: {
  points: PointTuple;
  model: ReturnType<typeof circumModel>;
  drag: Drag;
  tool: Tool;
  selected: number;
  showGrid: boolean;
  showCenter: boolean;
  showRadii: boolean;
  showCentral: boolean;
  showInscribed: boolean;
  showSegments: boolean;
  showCircle: boolean;
  showArc: boolean;
  onDrag: (drag: Drag) => void;
  onPoint: (index: number, point: Point) => void;
  onSelect: (index: number) => void;
  onRestore: (point: Point) => void;
}) {
  const scale = 38;
  const origin = { x: 250, y: 245 };
  const screen = (point: Point) => ({ x: origin.x + point.x * scale, y: origin.y - point.y * scale });
  const domain = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const local = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    return { x: (local.x - origin.x) / scale, y: (origin.y - local.y) / scale };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    onPoint(drag.index, domain(event.currentTarget, event.clientX, event.clientY));
  };
  const startDrag = (event: ReactPointerEvent<SVGCircleElement>, index: number) => {
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    onSelect(index);
    if (tool === "select") onDrag({ index });
  };
  const complete = points.every((point): point is Point => point !== null);
  const screenPoints = points.map((point) => point ? screen(point) : null);
  const center = model ? screen(model.center) : null;
  return <svg
    role="img"
    aria-label="Interactive circumcircular arc through draggable points A B and C"
    className="h-full w-full touch-none"
    viewBox="0 0 500 500"
    onPointerMove={move}
    onPointerUp={() => onDrag(null)}
    onPointerCancel={() => onDrag(null)}
    onClick={(event) => { if (tool === "point") onRestore(domain(event.currentTarget, event.clientX, event.clientY)); }}
  >
    <defs><pattern id="circ-grid" width={scale} height={scale} patternUnits="userSpaceOnUse"><path d={`M ${scale} 0 H 0 V ${scale}`} fill="none" stroke="#e2eaf5" /></pattern></defs>
    <rect width="500" height="500" fill={showGrid ? "url(#circ-grid)" : "white"} />
    {model && center && showCircle && <circle data-testid="circumarc-circle" data-radius={model.radius.toFixed(6)} cx={center.x} cy={center.y} r={model.radius * scale} fill="none" stroke="#aeb8c7" strokeWidth="1.5" />}
    {complete && showSegments && <><line x1={screenPoints[0]!.x} y1={screenPoints[0]!.y} x2={screenPoints[1]!.x} y2={screenPoints[1]!.y} stroke="#18335e" /><line x1={screenPoints[0]!.x} y1={screenPoints[0]!.y} x2={screenPoints[2]!.x} y2={screenPoints[2]!.y} stroke="#18335e" /><line x1={screenPoints[1]!.x} y1={screenPoints[1]!.y} x2={screenPoints[2]!.x} y2={screenPoints[2]!.y} stroke="#cbd5e1" /></>}
    {model && center && showRadii && <><line x1={center.x} y1={center.y} x2={screenPoints[0]!.x} y2={screenPoints[0]!.y} stroke="#a855f7" strokeDasharray="5 4" /><line x1={center.x} y1={center.y} x2={screenPoints[2]!.x} y2={screenPoints[2]!.y} stroke="#a855f7" strokeDasharray="5 4" /></>}
    {model && center && showArc && <path data-testid="circumarc-through-a" data-arc-measure={model.arcThroughA.toFixed(6)} d={arcThroughAPath(screenPoints as [Point, Point, Point], model.radius * scale, model)} fill="none" stroke="#14b8d4" strokeWidth="4" />}
    {model && center && showCentral && <text x={center.x + 15} y={center.y - 78} fill="#16a34a" fontSize="12" fontWeight="700">∠AOC<tspan x={center.x + 15} dy="17">{model.centralAngle.toFixed(2)}°</tspan></text>}
    {model && showInscribed && <><text x={screenPoints[1]!.x + 45} y={screenPoints[1]!.y - 12} fill="#f97316" fontSize="11" fontWeight="700">{model.inscribedAngle.toFixed(2)}°</text><text x={screenPoints[2]!.x - 74} y={screenPoints[2]!.y - 12} fill="#f97316" fontSize="11" fontWeight="700">{model.inscribedAngle.toFixed(2)}°</text></>}
    {model && center && showCenter && <><circle data-testid="circumarc-center" cx={center.x} cy={center.y} r="6" fill="#9333ea" /><text x={center.x - 34} y={center.y + 33} fill="#9333ea" fontSize="11">O ({format(model.center.x)}, {format(model.center.y)})</text></>}
    {points.map((point, index) => point && <g key={names[index]}><circle data-testid={`circumarc-point-${names[index].toLowerCase()}`} cx={screenPoints[index]!.x} cy={screenPoints[index]!.y} r={selected === index ? 8 : 7} fill="#1677c8" stroke={selected === index ? "#0f172a" : "white"} strokeWidth="2" onPointerDown={(event) => startDrag(event, index)} /><text x={screenPoints[index]!.x + (index === 1 ? -48 : 10)} y={screenPoints[index]!.y + (index === 0 ? -12 : 24)} fill="#334155" fontSize="11">{names[index]} ({format(point.x)}, {format(point.y)})</text></g>)}
    {!model && <text x="250" y="245" textAnchor="middle" fill="#be123c" fontSize="13">Place three non-collinear points.</text>}
  </svg>;
}

function ToolButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return <button type="button" aria-label={label} aria-pressed={active} className={`target-circ-tool ${active ? "is-active" : ""}`} onClick={onClick}>{icon}</button>;
}

function PointControls({ name, point, selected, onSelect, onChange }: { name: PointName; point: Point | null; selected: boolean; onSelect: () => void; onChange: (point: Point) => void }) {
  const value = point ?? { x: 0, y: 0 };
  return <section className={`rounded-lg border p-3 text-[8px] ${selected ? "border-blue-300 bg-blue-50/30" : "border-slate-200"}`} onClick={onSelect}>
    <h3 className="flex items-center gap-2 font-black"><span className="h-3 w-3 rounded-full bg-[#1677c8]" />Point {name}{!point && <span className="ml-auto text-rose-600">missing</span>}</h3>
    <div className="mt-2 grid grid-cols-2 gap-2"><label className="flex items-center gap-1">x<input type="number" aria-label={`Point ${name} x`} disabled={!point} className="min-w-0 flex-1 rounded-md border px-2 py-1" value={value.x.toFixed(2)} onChange={(event) => onChange({ ...value, x: Number(event.target.value) })} /></label><label className="flex items-center gap-1">y<input type="number" aria-label={`Point ${name} y`} disabled={!point} className="min-w-0 flex-1 rounded-md border px-2 py-1" value={value.y.toFixed(2)} onChange={(event) => onChange({ ...value, y: Number(event.target.value) })} /></label></div>
    <label className="mt-2 grid grid-cols-[12px_1fr] items-center gap-2">x<input type="range" aria-label={`Point ${name} x slider`} disabled={!point} min="-10" max="10" step="0.1" value={value.x} onChange={(event) => onChange({ ...value, x: Number(event.target.value) })} /></label>
    <label className="mt-1 grid grid-cols-[12px_1fr] items-center gap-2">y<input type="range" aria-label={`Point ${name} y slider`} disabled={!point} min="-10" max="10" step="0.1" value={value.y} onChange={(event) => onChange({ ...value, y: Number(event.target.value) })} /></label>
  </section>;
}

function Metric({ label, value, tone = "text-slate-900" }: { label: string; value: string; tone?: string }) { return <div className="rounded-md border border-slate-200 p-2 text-center text-[7px]"><span>{label}</span><b className={`mt-2 block text-[9px] ${tone}`}>{value}</b></div>; }
function Measure({ label, value, tone = "" }: { label: string; value: string; tone?: string }) { return <p className="mt-2 flex justify-between gap-2"><span>{label}</span><b className={tone}>{value}</b></p>; }
function PracticeField({ label, aria, value, onChange }: { label: string; aria: string; value: string; onChange: (value: string) => void }) { return <label className="mt-2 grid grid-cols-[1fr_120px] items-center gap-2"><span>{label}</span><input aria-label={aria} inputMode="decimal" className="rounded-md border px-2 py-1" value={value} onChange={(event) => onChange(event.target.value)} /></label>; }

function circumModel(points: PointTuple) {
  if (points.some((point) => point === null)) return null;
  const [a, b, c] = points as [Point, Point, Point];
  const determinant = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(determinant) < 1e-7) return null;
  const a2 = a.x * a.x + a.y * a.y;
  const b2 = b.x * b.x + b.y * b.y;
  const c2 = c.x * c.x + c.y * c.y;
  const center = {
    x: (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / determinant,
    y: (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / determinant,
  };
  const radius = distance(center, a);
  const angleA = angleOf(center, a);
  const angleB = angleOf(center, b);
  const angleC = angleOf(center, c);
  const ccwBC = normalize360(angleC - angleB);
  const ccwBA = normalize360(angleA - angleB);
  const arcThroughAClockwise = ccwBA > ccwBC;
  const arcThroughA = arcThroughAClockwise ? 360 - ccwBC : ccwBC;
  const centralAngle = smallerAngle(angleA, angleC);
  const inscribedAngle = angleAt(a, b, c);
  return { center, radius, angleA, angleB, angleC, arcThroughAClockwise, arcThroughA, centralAngle, inscribedAngle };
}

function arcThroughAPath(points: [Point, Point, Point], radius: number, model: NonNullable<ReturnType<typeof circumModel>>) {
  const b = points[1], c = points[2];
  return `M ${b.x} ${b.y} A ${radius} ${radius} 0 ${model.arcThroughA > 180 ? 1 : 0} ${model.arcThroughAClockwise ? 1 : 0} ${c.x} ${c.y}`;
}
function angleAt(a: Point, vertex: Point, c: Point) { const u = { x: a.x - vertex.x, y: a.y - vertex.y }, v = { x: c.x - vertex.x, y: c.y - vertex.y }; return radToDeg(Math.acos(clamp((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)), -1, 1))); }
function angleOf(center: Point, point: Point) { return radToDeg(Math.atan2(point.y - center.y, point.x - center.x)); }
function smallerAngle(a: number, b: number) { const delta = normalize360(b - a); return Math.min(delta, 360 - delta); }
function normalize360(value: number) { return ((value % 360) + 360) % 360; }
function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function radToDeg(value: number) { return value * 180 / Math.PI; }
function clonePoints(points: PointTuple): PointTuple { return points.map((point) => point ? { ...point } : null) as PointTuple; }
function format(value: number) { return Number(value.toFixed(2)).toString(); }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
