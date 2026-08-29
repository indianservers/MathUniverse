import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./PerpendicularBisectorTargetLesson210.css";

type Point = { x: number; y: number };
type Visibility = {
  arcs: boolean;
  bisector: boolean;
  right: boolean;
  equal: boolean;
  labels: boolean;
};
const initialA = { x: -4, y: 0 },
  initialB = { x: 4, y: 0 },
  initialVisibility = {
    arcs: true,
    bisector: true,
    right: true,
    equal: true,
    labels: true,
  };

export default function PerpendicularBisectorTargetLesson210({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>(initialA),
    [b, setB] = useState<Point>(initialB),
    [mode, setMode] = useState<"auto" | "custom">("auto"),
    [customRadius, setCustomRadius] = useState(6);
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility),
    [language, setLanguage] = useState("English (English)"),
    [stage, setStage] = useState(0),
    [shareStatus, setShareStatus] = useState(""),
    [practiceC, setPracticeC] = useState<Point>({ x: 0, y: 3 }),
    [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
      "idle",
    ),
    [hint, setHint] = useState(false);
  const surfaceRef = useRef<HTMLElement>(null);
  const geometry = useMemo(
    () => derive(a, b, mode === "auto" ? distance(a, b) * 0.75 : customRadius),
    [a, b, mode, customRadius],
  );
  const reset = () => {
    setA(initialA);
    setB(initialB);
    setMode("auto");
    setCustomRadius(6);
    setVisibility(initialVisibility);
    setPracticeC({ x: 0, y: 3 });
    setFeedback("idle");
    setHint(false);
    onInteraction();
  };
  useEffect(() => {
    setA(initialA);
    setB(initialB);
    setMode("auto");
    setCustomRadius(6);
    setVisibility(initialVisibility);
    setPracticeC({ x: 0, y: 3 });
    setFeedback("idle");
    setHint(false);
  }, [resetToken]);
  const update = (name: "a" | "b", p: Point) => {
    const next = { x: clamp(p.x), y: clamp(p.y) };
    if (name === "a") setA(next);
    else setB(next);
    setFeedback("idle");
    onInteraction();
  };
  const toggle = (key: keyof Visibility, value: boolean) => {
    setVisibility((v) => ({ ...v, [key]: value }));
    onInteraction();
  };
  const share = async () => {
    const text = `Perpendicular bisector of A(${a.x},${a.y}) B(${b.x},${b.y}); midpoint M(${geometry.mid.x.toFixed(2)},${geometry.mid.y.toFixed(2)})`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Construction copied");
    } catch {
      setShareStatus(text);
    }
    onInteraction();
  };
  const checkPractice = () => {
    const vx = b.x - a.x,
      vy = b.y - a.y,
      wx = practiceC.x - geometry.mid.x,
      wy = practiceC.y - geometry.mid.y;
    const onBisector = Math.abs(vx * wx + vy * wy) < 0.15;
    setFeedback(onBisector ? "correct" : "incorrect");
    onInteraction();
  };
  return (
    <section
      ref={surfaceRef}
      className="bisector210-page space-y-3"
      data-testid="dynamic-geometry-mockup-0267"
      data-dedicated-lesson="210"
      data-object-model="perpendicular-bisector"
      data-direct-interaction="true"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-midpoint={`${geometry.mid.x}:${geometry.mid.y}`}
      data-radius={geometry.radius.toFixed(4)}
      data-mode={mode}
      data-visibility={Object.values(visibility).map(Number).join(":")}
      data-stage={String(stage)}
      data-practice-point={`${practiceC.x}:${practiceC.y}`}
      data-practice={feedback}
      aria-label="Perpendicular bisector dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-black text-blue-700">
          DYNAMIC GEOMETRY CONSTRUCTION
        </span>
        <h1 className="mt-3 text-3xl font-black">Perpendicular Bisector</h1>
        <p className="mt-1 text-[11px] text-slate-600">
          Construct and explore the perpendicular bisector of a segment.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[8px] font-black">
          <span className="target-geometry-chip">Foundational-Advanced</span>
          <span className="target-geometry-chip">Construction Studio</span>
          <span className="target-geometry-chip">Geometry Tools</span>
          <span className="target-geometry-chip">6-10 min</span>
        </div>
        <div className="mt-3 flex gap-2">
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              onInteraction();
            }}
            className="rounded-md border px-3 py-2 text-[9px] font-bold"
          >
            <option>English (English)</option>
            <option>Hindi (हिन्दी)</option>
          </select>
          <button
            type="button"
            className="target-geometry-action"
            onClick={reset}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            className="target-geometry-action"
            onClick={share}
          >
            <Share2 />
            Share
          </button>
        </div>
        {shareStatus ? (
          <p
            role="status"
            className="mt-1 text-[8px] font-bold text-emerald-700"
          >
            {shareStatus}
          </p>
        ) : null}
      </header>
      <nav className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {[
          ["Observe", "See the construction"],
          ["Manipulate", "Drag & explore"],
          ["Notice", "Find the pattern"],
          ["Understand", "Learn the rule"],
          ["Try", "Practice it"],
        ].map(([title, sub], i) => (
          <button
            type="button"
            key={title}
            onClick={() => {
              setStage(i);
              document
                .getElementById(
                  i === 4
                    ? "bisector-practice"
                    : i >= 2
                      ? "bisector-insight"
                      : "bisector-plane",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              onInteraction();
            }}
            className={`h-[58px] text-[8px] font-bold ${stage === i ? "border-t-2 border-blue-500 bg-blue-50 text-blue-700" : "text-slate-600"}`}
          >
            <span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full bg-slate-100">
              {i + 1}
            </span>
            <strong className="text-[9px]">{title}</strong>
            <small className="block">{sub}</small>
          </button>
        ))}
      </nav>
      <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[9px] font-black text-blue-700">
                OBSERVE THE CONSTRUCTION
              </h2>
              <p className="mt-1 text-[9px]">
                <b>Drag A or B</b> to change the segment. The perpendicular
                bisector updates in real time.
              </p>
            </div>
            <Toggle
              label="Show arcs"
              checked={visibility.arcs}
              onChange={(v) => toggle("arcs", v)}
            />
          </div>
          <BisectorPlane
            id="bisector-plane"
            a={a}
            b={b}
            geometry={geometry}
            visibility={visibility}
            onPoint={update}
            onFullscreen={() => {
              void surfaceRef.current?.requestFullscreen?.();
              onInteraction();
            }}
          />
          <div className="mt-10 grid grid-cols-[1fr_auto] rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[9px]">
            <div>
              <strong className="text-emerald-700">OBSERVATION</strong>
              <p className="mt-2">
                Every point on the perpendicular bisector is equidistant from A
                and B.
              </p>
            </div>
            <div className="border-l border-emerald-200 pl-4 font-black text-emerald-800">
              <p>
                AP = BP ={" "}
                {geometry.p ? distance(a, geometry.p).toFixed(2) : "—"}
              </p>
              <p className="mt-2">
                AQ = BQ ={" "}
                {geometry.q ? distance(a, geometry.q).toFixed(2) : "—"}
              </p>
            </div>
          </div>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-3 text-[9px]">
          <h2 className="font-black text-blue-700">OBJECT CONTROLS</h2>
          <h3 className="mt-4 font-black">Segment AB</h3>
          <p className="text-slate-500">Drag endpoints</p>
          <CoordinatePair name="A" point={a} onChange={(p) => update("a", p)} />
          <CoordinatePair name="B" point={b} onChange={(p) => update("b", p)} />
          <h3 className="mt-4 font-black">Arcs</h3>
          <div className="mt-2 grid grid-cols-2 rounded-md border p-1">
            <button
              type="button"
              onClick={() => {
                setMode("auto");
                onInteraction();
              }}
              className={`rounded py-1 font-black ${mode === "auto" ? "bg-blue-600 text-white" : ""}`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("custom");
                onInteraction();
              }}
              className={`rounded py-1 font-black ${mode === "custom" ? "bg-blue-600 text-white" : ""}`}
            >
              Custom
            </button>
          </div>
          <label className="mt-2 grid grid-cols-[auto_1fr] items-center gap-2 font-black">
            r ={" "}
            <input
              aria-label="Arc radius"
              type="number"
              min={0.5}
              max={12}
              step={0.25}
              value={Number(geometry.radius.toFixed(2))}
              disabled={mode === "auto"}
              onChange={(e) => {
                setCustomRadius(Number(e.target.value));
                onInteraction();
              }}
              className="rounded border p-2 disabled:bg-slate-50"
            />
          </label>
          <h3 className="mt-4 font-black">Construction visibility</h3>
          {(
            [
              ["arcs", "Show arcs"],
              ["bisector", "Show perpendicular bisector"],
              ["right", "Show right angle"],
              ["equal", "Show equal marks"],
              ["labels", "Show labels"],
            ] as [keyof Visibility, string][]
          ).map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              checked={visibility[key]}
              onChange={(v) => toggle(key, v)}
            />
          ))}
        </aside>
      </section>
      <div
        id="bisector-insight"
        className="grid min-h-[330px] gap-3 md:grid-cols-3"
      >
        <Panel title="HOW IT'S CONSTRUCTED">
          <ol className="space-y-3">
            {[
              "Draw segment AB.",
              "With A as center, draw arcs above and below the segment.",
              "With B as center and the same radius, draw intersecting arcs.",
              "Draw the line through intersection points P and Q.",
              "This line is the perpendicular bisector of AB.",
            ].map((x, i) => (
              <li key={x} className="flex gap-2">
                <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-600 text-white">
                  {i + 1}
                </b>
                {x}
              </li>
            ))}
          </ol>
          <MiniConstruction />
        </Panel>
        <Panel title="INSIGHT">
          <h3 className="font-black">Definition</h3>
          <p>
            The perpendicular bisector of a segment is perpendicular to the
            segment and passes through its midpoint.
          </p>
          <h3 className="mt-3 font-black">Properties</h3>
          {[
            "It is perpendicular to the segment.",
            "It passes through the midpoint.",
            "Any point on it is equidistant from the endpoints.",
            "It is the locus of points equidistant from A and B.",
          ].map((x) => (
            <p key={x} className="mt-2 text-emerald-700">
              ✓ <span className="text-slate-700">{x}</span>
            </p>
          ))}
          <p className="mt-4 rounded border border-violet-200 bg-violet-50 p-3 text-center font-serif text-base font-black">
            XA = XB
          </p>
        </Panel>
        <Panel title="YOUR TURN – PRACTICE">
          <p>
            Drag point C so that C lies on the perpendicular bisector of AB.
          </p>
          <PracticePlane
            a={a}
            b={b}
            mid={geometry.mid}
            c={practiceC}
            onC={(c) => {
              setPracticeC(c);
              setFeedback("idle");
              onInteraction();
            }}
          />
          <p className="mt-2 text-slate-500">Check when you're ready.</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={checkPractice}
              className="rounded bg-blue-600 px-4 py-2 font-black text-white"
            >
              Check
            </button>
            <button
              type="button"
              onClick={() => {
                setHint((v) => !v);
                onInteraction();
              }}
              className="rounded border px-4 py-2 font-black"
            >
              Hint
            </button>
          </div>
          {hint ? (
            <p className="mt-2 rounded bg-blue-50 p-2">
              C must form equal distances CA and CB.
            </p>
          ) : null}
          {feedback !== "idle" ? (
            <p
              role="status"
              className={`mt-2 rounded p-2 font-black ${feedback === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
            >
              {feedback === "correct"
                ? "Correct: C lies on the perpendicular bisector."
                : "Move C until CA and CB are equal."}
            </p>
          ) : null}
        </Panel>
      </div>
      <nav className="grid min-h-14 grid-cols-3 gap-2 text-[9px] font-bold">
        <a
          href="/lessons/geometry/209-parallel-line"
          className="flex items-center gap-2 rounded-lg border bg-white p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Parallel Line
        </a>
        <span className="grid place-items-center rounded-lg border bg-white">
          Lesson progress 1 of 5
        </span>
        <a
          href="/lessons/geometry/211-angle-bisector"
          className="flex items-center justify-end gap-2 rounded-lg border bg-white p-3"
        >
          Angle Bisector
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">Live Verification. Check Construction.</span>
    </section>
  );
}

type Geometry = {
  mid: Point;
  radius: number;
  p: Point | null;
  q: Point | null;
  normal: Point;
  length: number;
};
function derive(a: Point, b: Point, r: number): Geometry {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    d = Math.hypot(dx, dy) || 0.001,
    mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    normal = { x: -dy / d, y: dx / d },
    h = Math.sqrt(Math.max(0, r * r - (d * d) / 4));
  return {
    mid,
    radius: r,
    p: r >= d / 2 ? { x: mid.x + normal.x * h, y: mid.y + normal.y * h } : null,
    q: r >= d / 2 ? { x: mid.x - normal.x * h, y: mid.y - normal.y * h } : null,
    normal,
    length: d,
  };
}
function BisectorPlane({
  id,
  a,
  b,
  geometry: g,
  visibility,
  onPoint,
  onFullscreen,
}: {
  id: string;
  a: Point;
  b: Point;
  geometry: Geometry;
  visibility: Visibility;
  onPoint: (n: "a" | "b", p: Point) => void;
  onFullscreen: () => void;
}) {
  const drag = useRef<"a" | "b" | null>(null),
    w = 560,
    h = 420,
    cx = w / 2,
    cy = h / 2,
    u = 38,
    sx = (x: number) => cx + x * u,
    sy = (y: number) => cy - y * u,
    from = (e: ReactMouseEvent<SVGSVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      return {
        x: (((e.clientX - r.left) / r.width) * w - cx) / u,
        y: (cy - ((e.clientY - r.top) / r.height) * h) / u,
      };
    };
  return (
    <div id={id} className="relative mt-2 overflow-hidden rounded-lg border">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full bg-white"
        role="img"
        aria-label="Perpendicular bisector construction with draggable endpoints A and B"
        onMouseMove={(e) => {
          if (drag.current) onPoint(drag.current, from(e));
        }}
        onMouseUp={() => (drag.current = null)}
      >
        {Array.from({ length: 15 }, (_, i) => i - 7).map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1="0" x2={sx(v)} y2={h} stroke="#eff6ff" />
            <line x1="0" y1={sy(v)} x2={w} y2={sy(v)} stroke="#eff6ff" />
          </g>
        ))}
        {visibility.arcs ? (
          <>
            <circle
              cx={sx(a.x)}
              cy={sy(a.y)}
              r={g.radius * u}
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="3 3"
            />
            <circle
              cx={sx(b.x)}
              cy={sy(b.y)}
              r={g.radius * u}
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="3 3"
            />
          </>
        ) : null}
        <line
          x1={sx(a.x)}
          y1={sy(a.y)}
          x2={sx(b.x)}
          y2={sy(b.y)}
          stroke="#2563eb"
          strokeWidth="3"
        />
        {visibility.bisector ? (
          <line
            x1={sx(g.mid.x - g.normal.x * 8)}
            y1={sy(g.mid.y - g.normal.y * 8)}
            x2={sx(g.mid.x + g.normal.x * 8)}
            y2={sy(g.mid.y + g.normal.y * 8)}
            stroke="#7c3aed"
            strokeWidth="2.5"
          />
        ) : null}
        {g.p ? (
          <circle cx={sx(g.p.x)} cy={sy(g.p.y)} r="5" fill="#7c3aed" />
        ) : null}
        {g.q ? (
          <circle cx={sx(g.q.x)} cy={sy(g.q.y)} r="5" fill="#7c3aed" />
        ) : null}
        <circle cx={sx(g.mid.x)} cy={sy(g.mid.y)} r="6" fill="#a21caf" />
        {visibility.right ? (
          <path
            d={`M${sx(g.mid.x)},${sy(g.mid.y)} l14,0 l0,-14`}
            fill="none"
            stroke="#475569"
            pointerEvents="none"
          />
        ) : null}
        {visibility.equal ? (
          <>
            <path
              d={`M${sx((a.x + g.mid.x) / 2) - 3},${sy((a.y + g.mid.y) / 2) - 8}v16m6-16v16`}
              stroke="#475569"
            />
            <path
              d={`M${sx((b.x + g.mid.x) / 2) - 3},${sy((b.y + g.mid.y) / 2) - 8}v16m6-16v16`}
              stroke="#475569"
            />
          </>
        ) : null}
        {[
          [a, "A", "a"],
          [b, "B", "b"],
        ].map(([pt, label, name]) => (
          <g key={String(label)}>
            <circle
              data-testid={`bisector-point-${name}`}
              cx={sx((pt as Point).x)}
              cy={sy((pt as Point).y)}
              r="7"
              fill="#2563eb"
              onMouseDown={() => (drag.current = name as "a" | "b")}
              className="cursor-grab"
            />
            {visibility.labels ? (
              <text
                x={sx((pt as Point).x) - 12}
                y={sy((pt as Point).y) - 12}
                fontWeight="800"
                pointerEvents="none"
              >
                {String(label)}
              </text>
            ) : null}
          </g>
        ))}
        {visibility.labels ? (
          <>
            <text x={sx(g.mid.x) + 8} y={sy(g.mid.y) - 12} fontWeight="800">
              M
            </text>
            {g.p ? (
              <text x={sx(g.p.x) + 8} y={sy(g.p.y) - 8}>
                P
              </text>
            ) : null}
            {g.q ? (
              <text x={sx(g.q.x) + 8} y={sy(g.q.y) - 8}>
                Q
              </text>
            ) : null}
          </>
        ) : null}
      </svg>
      <button
        type="button"
        aria-label="Fullscreen"
        onClick={onFullscreen}
        className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded border bg-white"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
function PracticePlane({
  a,
  b,
  mid,
  c,
  onC,
}: {
  a: Point;
  b: Point;
  mid: Point;
  c: Point;
  onC: (p: Point) => void;
}) {
  const drag = useRef(false),
    w = 220,
    h = 160,
    s = 20,
    sx = (x: number) => w / 2 + x * s,
    sy = (y: number) => h / 2 - y * s;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-2 w-full rounded border"
      role="img"
      aria-label="Practice point C draggable onto perpendicular bisector"
      onMouseMove={(e) => {
        if (!drag.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        onC({
          x: (((e.clientX - r.left) / r.width) * w - w / 2) / s,
          y: (h / 2 - ((e.clientY - r.top) / r.height) * h) / s,
        });
      }}
      onMouseUp={() => (drag.current = false)}
    >
      <line
        x1={sx(a.x)}
        y1={sy(a.y)}
        x2={sx(b.x)}
        y2={sy(b.y)}
        stroke="#2563eb"
      />
      <line x1={sx(mid.x)} y1="5" x2={sx(mid.x)} y2={h - 5} stroke="#7c3aed" />
      <circle
        data-testid="bisector-practice-c"
        cx={sx(c.x)}
        cy={sy(c.y)}
        r="6"
        fill="#a21caf"
        onMouseDown={() => (drag.current = true)}
      />
      <circle cx={sx(a.x)} cy={sy(a.y)} r="5" fill="#2563eb" />
      <circle cx={sx(b.x)} cy={sy(b.y)} r="5" fill="#2563eb" />
      <text x={sx(c.x) + 7} y={sy(c.y) - 7}>
        C
      </text>
    </svg>
  );
}
function CoordinatePair({
  name,
  point,
  onChange,
}: {
  name: string;
  point: Point;
  onChange: (p: Point) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-[16px_1fr_1fr] gap-1">
      <b>{name}</b>
      <input
        aria-label={`${name} x coordinate`}
        type="number"
        value={point.x}
        step=".5"
        onChange={(e) => onChange({ ...point, x: Number(e.target.value) })}
        className="min-w-0 rounded border p-1 text-center"
      />
      <input
        aria-label={`${name} y coordinate`}
        type="number"
        value={point.y}
        step=".5"
        onChange={(e) => onChange({ ...point, y: Number(e.target.value) })}
        className="min-w-0 rounded border p-1 text-center"
      />
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
    <label className="mt-2 flex items-center gap-2 text-[8px] font-bold">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[9px]">
      <h2 className="font-black text-blue-700">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
function MiniConstruction() {
  return (
    <svg viewBox="0 0 240 75" className="mt-3 h-16 w-full">
      <line x1="10" y1="55" x2="230" y2="55" stroke="#2563eb" />
      <circle cx="65" cy="55" r="3" fill="#2563eb" />
      <circle cx="175" cy="55" r="3" fill="#2563eb" />
      <path
        d="M65 55Q120 -10 175 55M65 55Q120 120 175 55"
        fill="none"
        stroke="#94a3b8"
        strokeDasharray="3 3"
      />
      <line x1="120" y1="5" x2="120" y2="72" stroke="#7c3aed" />
    </svg>
  );
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function clamp(v: number) {
  return Math.max(-7, Math.min(7, Number(v.toFixed(1))));
}
