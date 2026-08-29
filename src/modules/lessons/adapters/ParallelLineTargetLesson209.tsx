import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Eye,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  Waypoints,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ParallelLineTargetLesson209.css";

type Point = { x: number; y: number };
const initialP = { x: 0, y: -2.5 };

export default function ParallelLineTargetLesson209({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [slope, setSlope] = useState(0.5),
    [intercept, setIntercept] = useState(1),
    [p, setP] = useState<Point>(initialP);
  const [showAngle, setShowAngle] = useState(true),
    [showSlope, setShowSlope] = useState(true),
    [snap, setSnap] = useState(false),
    [zoom, setZoom] = useState(1);
  const [stage, setStage] = useState(0),
    [practice, setPractice] = useState(false),
    [checks, setChecks] = useState([false, false, false]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const surfaceRef = useRef<HTMLElement>(null);
  const parallelIntercept = p.y - slope * p.x;
  const angle = ((Math.atan(slope) * 180) / Math.PI + 180) % 180;
  const reset = () => {
    setSlope(0.5);
    setIntercept(1);
    setP(initialP);
    setShowAngle(true);
    setShowSlope(true);
    setSnap(false);
    setZoom(1);
    setPractice(false);
    setChecks([false, false, false]);
    setFeedback("idle");
    onInteraction();
  };
  useEffect(() => {
    setSlope(0.5);
    setIntercept(1);
    setP(initialP);
    setShowAngle(true);
    setShowSlope(true);
    setSnap(false);
    setZoom(1);
    setPractice(false);
    setChecks([false, false, false]);
    setFeedback("idle");
  }, [resetToken]);
  const updatePoint = (next: Point) => {
    const round = (v: number) => (snap ? Math.round(v) : Math.round(v * 2) / 2);
    setP({ x: clamp(round(next.x)), y: clamp(round(next.y)) });
    setFeedback("idle");
    onInteraction();
  };
  const startPractice = () => {
    setSlope(-3);
    setIntercept(2);
    setP({ x: -1, y: 3 });
    setPractice(true);
    setChecks([false, false, false]);
    setFeedback("idle");
    document
      .getElementById("parallel-plane")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    onInteraction();
  };
  const check = () => {
    const actual = Math.abs(p.y - parallelIntercept - slope * p.x) < 0.001;
    setFeedback(
      practice && actual && checks.every(Boolean) ? "correct" : "incorrect",
    );
    onInteraction();
  };
  return (
    <section
      ref={surfaceRef}
      className="parallel209-page space-y-3"
      data-testid="dynamic-geometry-mockup-0266"
      data-dedicated-lesson="209"
      data-object-model="parallel-line"
      data-direct-interaction="true"
      data-slope={slope.toFixed(4)}
      data-intercept={intercept.toFixed(4)}
      data-parallel-intercept={parallelIntercept.toFixed(4)}
      data-point={`${p.x}:${p.y}`}
      data-angle={angle.toFixed(4)}
      data-angle-visible={String(showAngle)}
      data-slope-visible={String(showSlope)}
      data-snap={String(snap)}
      data-zoom={zoom.toFixed(1)}
      data-stage={String(stage)}
      data-practice={feedback}
      data-practice-active={String(practice)}
      data-checks={checks.map(Number).join(":")}
      aria-label="Parallel line dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-cyan-50 px-2 py-1 text-[8px] font-black text-cyan-700">
              COORDINATE GEOMETRY
            </span>
            <h1 className="mt-2 text-3xl font-black">Parallel Line</h1>
            <p className="text-[11px] text-slate-600">
              Construct equal-direction lines through a point.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 text-[8px]">
            <Meta title="Level" value="Intermediate" />
            <Meta title="Time" value="6-10 min" />
            <Meta title="Focus" value="Slope, Direction" />
          </div>
        </div>
      </header>
      <nav className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {[
          ["Observe", "See equality", Eye],
          ["Manipulate", "Drag and edit", Wrench],
          ["Pattern", "Compare slopes", Waypoints],
          ["Rule", "Prove parallel", Scale],
          ["Try", "Practice", CircleDot],
        ].map(([title, sub, StageIcon], i) => (
          <button
            type="button"
            key={String(title)}
            onClick={() => {
              setStage(i);
              document
                .getElementById(
                  i === 4
                    ? "parallel-practice"
                    : i >= 2
                      ? "parallel-rule"
                      : "parallel-plane",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              onInteraction();
            }}
            className={`flex h-[45px] items-center justify-center gap-2 text-[8px] font-bold [&_svg]:h-3.5 [&_svg]:w-3.5 ${stage === i ? "border-b-2 border-blue-500 text-blue-700" : "text-slate-600"}`}
          >
            <StageIcon />
            <span className="text-left">
              <strong className="text-[9px]">{title}</strong>
              <small className="block">{sub}</small>
            </span>
          </button>
        ))}
      </nav>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-black">Construct and observe</h2>
            <p className="mt-1 text-[9px] text-slate-600">
              Drag point P to choose a location. Adjust the slope of line ℓ.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[8px] font-bold">
            <Toggle
              label="Show angle"
              checked={showAngle}
              onChange={setShowAngle}
            />
            <Toggle
              label="Show slope"
              checked={showSlope}
              onChange={setShowSlope}
            />
            <Toggle label="Snap to grid" checked={snap} onChange={setSnap} />
            <button
              type="button"
              className="target-geometry-action"
              onClick={reset}
            >
              <RotateCcw />
              Reset
            </button>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_205px]">
          <ParallelPlane
            id="parallel-plane"
            slope={slope}
            intercept={intercept}
            p={p}
            showAngle={showAngle}
            showSlope={showSlope}
            zoom={zoom}
            onPoint={updatePoint}
            onZoom={(d) => {
              setZoom((v) => Math.max(0.75, Math.min(1.4, v + d)));
              onInteraction();
            }}
            onFullscreen={() => {
              void surfaceRef.current?.requestFullscreen?.();
              onInteraction();
            }}
          />
          <aside className="space-y-2">
            <Panel title="Edit line ℓ (given)">
              <Range
                label="Slope m"
                value={slope}
                min={-3}
                max={3}
                step={0.25}
                onChange={(v) => {
                  setSlope(v);
                  setFeedback("idle");
                  onInteraction();
                }}
              />
              <Range
                label="y-intercept c"
                value={intercept}
                min={-6}
                max={6}
                step={0.5}
                onChange={(v) => {
                  setIntercept(v);
                  onInteraction();
                }}
              />
            </Panel>
            <Panel title="Edit point P">
              <Stepper
                label="x"
                value={p.x}
                onChange={(x) => updatePoint({ ...p, x })}
              />
              <Stepper
                label="y"
                value={p.y}
                onChange={(y) => updatePoint({ ...p, y })}
              />
              <p className="mt-2 text-center text-slate-500">
                Drag P on the graph
              </p>
            </Panel>
          </aside>
        </div>
        <section className="mt-3 rounded-lg border border-slate-200 p-3">
          <h2 className="font-black">Observe the result</h2>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <Result title="Slopes">
              <p className="font-serif text-sm text-blue-600">
                mℓ = {fraction(slope)}
              </p>
              <p className="font-serif text-sm text-violet-600">
                mₘ = {fraction(slope)}
              </p>
              <Good text="Equal" />
            </Result>
            <Result title="Angle of inclination">
              <p className="font-serif text-sm text-blue-600">
                θℓ = {angle.toFixed(2)}°
              </p>
              <p className="font-serif text-sm text-violet-600">
                θₘ = {angle.toFixed(2)}°
              </p>
              <Good text="Equal" />
            </Result>
            <Result title="Conclusion">
              <Good text="Lines ℓ and m are parallel" />
            </Result>
            <Result title="Parallel lines test">
              <p>
                Two non-vertical lines are parallel iff their slopes are equal.
              </p>
              <p className="mt-2 rounded bg-emerald-50 p-2 font-serif text-sm">
                mℓ = mₘ
              </p>
            </Result>
          </div>
        </section>
      </section>
      <div
        id="parallel-rule"
        className="grid min-h-[250px] gap-3 md:grid-cols-[1.5fr_1fr]"
      >
        <Panel title="Worked example (steps)">
          <div className="grid grid-cols-[1fr_180px] gap-3">
            <div>
              <p>
                Through P(2, -1), construct a line parallel to ℓ: y = 2x - 3.
              </p>
              <ol className="mt-3 space-y-2">
                {[
                  "Slope of ℓ: m = 2.",
                  "Parallel line has the same slope m = 2.",
                  "Use y - y₁ = m(x - x₁).",
                  "Substitute P: y + 1 = 2(x - 2), so y = 2x - 5.",
                ].map((x, i) => (
                  <li key={x}>
                    <b className="mr-2 text-blue-600">{i + 1}</b>
                    {x}
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded bg-emerald-50 p-2 font-black text-emerald-700">
                Required line: y = 2x - 5
              </p>
            </div>
            <MiniParallel />
          </div>
        </Panel>
        <Panel title="Key rule">
          <p>Two non-vertical lines</p>
          <p className="mt-2 font-serif">
            ℓ: y = m₁x + c₁
            <br />
            m: y = m₂x + c₂
          </p>
          <p className="my-3 rounded border border-slate-200 p-3 text-center font-serif text-base font-black">
            ℓ ∥ m ⇔ m₁ = m₂
          </p>
          <p>
            <b>Special cases:</b>
            <br />
            Horizontal lines are parallel.
            <br />
            Vertical lines are parallel.
          </p>
        </Panel>
      </div>
      <section
        id="parallel-practice"
        className="rounded-lg border border-violet-100 bg-violet-50/30 p-3"
      >
        <h2 className="text-sm font-black text-violet-700">
          Your turn · Practice
        </h2>
        <p className="text-[9px]">
          Construct a line through P parallel to the given ℓ.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[135px_125px_1fr_150px]">
          <Panel title="Given line ℓ">
            <p className="font-serif text-sm text-blue-600">y = -3x + 2</p>
            <p>m = -3</p>
          </Panel>
          <Panel title="Point P">
            <p className="font-serif text-sm">(-1, 3)</p>
            <button
              type="button"
              onClick={startPractice}
              className="mt-3 rounded bg-blue-600 px-3 py-2 font-black text-white"
            >
              Start practice
            </button>
          </Panel>
          <Panel title="Your construction">
            <p>Drag P on the graph and observe.</p>
            <MiniPractice slope={slope} p={p} />
          </Panel>
          <Panel title="What to check">
            {["Slopes are equal", "Angles are equal", "Lines are parallel"].map(
              (text, i) => (
                <label key={text} className="mt-2 flex gap-2">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={(e) => {
                      setChecks((c) =>
                        c.map((v, j) => (j === i ? e.target.checked : v)),
                      );
                      setFeedback("idle");
                      onInteraction();
                    }}
                  />
                  {text}
                </label>
              ),
            )}
            <button
              type="button"
              onClick={check}
              className="mt-3 w-full rounded bg-violet-600 py-2 font-black text-white"
            >
              Check my answer
            </button>
            {feedback !== "idle" ? (
              <p
                role="status"
                className={`mt-2 rounded p-2 font-black ${feedback === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
              >
                {feedback === "correct"
                  ? "Correct parallel construction."
                  : "Start the target and verify all three invariants."}
              </p>
            ) : null}
          </Panel>
        </div>
      </section>
      <nav className="grid grid-cols-2 gap-2 text-[9px] font-bold">
        <a
          href="/lessons/geometry/208-perpendicular-line"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Perpendicular Line
        </a>
        <a
          href="/lessons/geometry/210-perpendicular-bisector"
          className="flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3"
        >
          Perpendicular Bisector
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">Live Verification. Check Construction.</span>
    </section>
  );
}

function ParallelPlane({
  id,
  slope,
  intercept,
  p,
  showAngle,
  showSlope,
  zoom,
  onPoint,
  onZoom,
  onFullscreen,
}: {
  id: string;
  slope: number;
  intercept: number;
  p: Point;
  showAngle: boolean;
  showSlope: boolean;
  zoom: number;
  onPoint: (p: Point) => void;
  onZoom: (d: number) => void;
  onFullscreen: () => void;
}) {
  const drag = useRef(false),
    w = 560,
    h = 420,
    cx = w / 2,
    cy = h / 2,
    u = 30 * zoom,
    sx = (x: number) => cx + x * u,
    sy = (y: number) => cy - y * u,
    pi = p.y - slope * p.x,
    from = (e: ReactMouseEvent<SVGSVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      return {
        x: (((e.clientX - r.left) / r.width) * w - cx) / u,
        y: (cy - ((e.clientY - r.top) / r.height) * h) / u,
      };
    };
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-lg border border-slate-200"
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full bg-white"
        role="img"
        aria-label="Parallel lines coordinate plane with draggable point P"
        onMouseMove={(e) => {
          if (drag.current) onPoint(from(e));
        }}
        onMouseUp={() => (drag.current = false)}
      >
        {Array.from({ length: 17 }, (_, i) => i - 8).map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1="0" x2={sx(v)} y2={h} stroke="#dbeafe" />
            <line x1="0" y1={sy(v)} x2={w} y2={sy(v)} stroke="#dbeafe" />
          </g>
        ))}
        <line x1="0" y1={cy} x2={w} y2={cy} stroke="#64748b" />
        <line x1={cx} y1="0" x2={cx} y2={h} stroke="#64748b" />
        <line
          x1={sx(-10)}
          y1={sy(slope * -10 + intercept)}
          x2={sx(10)}
          y2={sy(slope * 10 + intercept)}
          stroke="#1685e5"
          strokeWidth="2.5"
        />
        <line
          x1={sx(-10)}
          y1={sy(slope * -10 + pi)}
          x2={sx(10)}
          y2={sy(slope * 10 + pi)}
          stroke="#7c3aed"
          strokeWidth="2.5"
        />
        <circle
          data-testid="parallel-point-p"
          cx={sx(p.x)}
          cy={sy(p.y)}
          r="7"
          fill="#0ea5a5"
          onMouseDown={() => (drag.current = true)}
          className="cursor-grab"
        />
        <text
          x={sx(p.x) + 8}
          y={sy(p.y) - 10}
          fill="#0f9f9f"
          fontWeight="800"
          fontSize="12"
          pointerEvents="none"
        >
          P
        </text>
        {showAngle ? (
          <text x={sx(p.x) + 15} y={sy(p.y) + 25} fill="#7c3aed" fontSize="11">
            {(((Math.atan(slope) * 180) / Math.PI + 180) % 180).toFixed(2)}°
          </text>
        ) : null}
        {showSlope ? (
          <g>
            <rect
              x="8"
              y="10"
              width="135"
              height="105"
              rx="7"
              fill="white"
              stroke="#cbd5e1"
            />
            <text x="18" y="32" fontSize="10" fontWeight="800">
              Line ℓ (given)
            </text>
            <text x="18" y="52" fontSize="10">
              y = {slope}x + {intercept}
            </text>
            <text x="18" y="77" fontSize="10" fontWeight="800">
              Line m (through P)
            </text>
            <text x="18" y="97" fontSize="10">
              y = {slope}x + {pi.toFixed(2)}
            </text>
          </g>
        ) : null}
      </svg>
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <Icon label="Zoom in" onClick={() => onZoom(0.1)}>
          <Plus />
        </Icon>
        <Icon label="Zoom out" onClick={() => onZoom(-0.1)}>
          <Minus />
        </Icon>
        <Icon label="Fullscreen" onClick={onFullscreen}>
          <Maximize2 />
        </Icon>
      </div>
    </div>
  );
}
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="rounded border border-slate-200 bg-white px-2 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-1"
      />
      {label}
    </label>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-2 block font-bold">
      {label}
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
      />
      <input
        aria-label={`${label} exact value`}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded border px-2 py-1 text-center"
      />
    </label>
  );
}
function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-[12px_24px_1fr_24px] items-center gap-1">
      <b>{label}</b>
      <button
        type="button"
        aria-label={`Decrease point ${label}`}
        onClick={() => onChange(value - 0.5)}
        className="rounded border p-1"
      >
        −
      </button>
      <input
        aria-label={`Point P ${label}`}
        type="number"
        value={value}
        step=".5"
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border p-1 text-center"
      />
      <button
        type="button"
        aria-label={`Increase point ${label}`}
        onClick={() => onChange(value + 0.5)}
        className="rounded border p-1"
      >
        +
      </button>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[9px]">
      <h3 className="font-black text-blue-950">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
function Result({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 text-center text-[9px]">
      <h3>{title}</h3>
      <div className="mt-2">{children}</div>
    </article>
  );
}
function Good({ text }: { text: string }) {
  return (
    <p className="mt-2 font-black text-emerald-700">
      <CheckCircle2 className="mr-1 inline h-3 w-3" />
      {text}
    </p>
  );
}
function Meta({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{title}</span>
      <strong className="block">{value}</strong>
    </div>
  );
}
function Icon({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded border bg-white [&_svg]:h-4 [&_svg]:w-4"
    >
      {children}
    </button>
  );
}
function MiniParallel() {
  return (
    <svg viewBox="0 0 180 120" className="w-full">
      <line x1="10" y1="85" x2="170" y2="20" stroke="#1685e5" strokeWidth="2" />
      <line
        x1="10"
        y1="110"
        x2="170"
        y2="45"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <circle cx="95" cy="76" r="4" fill="#0ea5a5" />
    </svg>
  );
}
function MiniPractice({ slope, p }: { slope: number; p: Point }) {
  return (
    <svg viewBox="0 0 220 80" className="mt-2 h-16 w-full">
      <line x1="10" y1="40" x2="210" y2={40 + slope * 15} stroke="#1685e5" />
      <line x1="10" y1="65" x2="210" y2={65 + slope * 15} stroke="#7c3aed" />
      <circle cx={110 + p.x * 8} cy={40 - p.y * 5} r="4" fill="#0ea5a5" />
    </svg>
  );
}
function fraction(v: number) {
  if (Math.abs(v - Math.round(v)) < 0.001) return String(Math.round(v));
  const sign = v < 0 ? "-" : "",
    a = Math.abs(v);
  for (let d = 2; d <= 8; d++) {
    const n = Math.round(a * d);
    if (Math.abs(n / d - a) < 0.01) return `${sign}${n}/${d}`;
  }
  return v.toFixed(2);
}
function clamp(v: number) {
  return Math.max(-6, Math.min(6, Number(v.toFixed(1))));
}
