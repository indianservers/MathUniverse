import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crosshair,
  Grid3X3,
  Lightbulb,
  Maximize2,
  MousePointer2,
  RotateCw,
  Trophy,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Visibility = {
  vertices: boolean;
  circle: boolean;
  symmetry: boolean;
  labels: boolean;
  radii: boolean;
  grid: boolean;
};
type Tool = "select" | "center";
const initialCenter = { x: 0, y: 0 };
const initialVisibility: Visibility = {
  vertices: true,
  circle: true,
  symmetry: true,
  labels: true,
  radii: true,
  grid: true,
};
const letters = "ABCDEFGHIJKL";

export default function RegularPolygonTargetLesson215({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [n, setN] = useState(6);
  const [radius, setRadius] = useState(6);
  const [rotation, setRotation] = useState(90);
  const [center, setCenter] = useState<Point>(initialCenter);
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
  const [tool, setTool] = useState<Tool>("select");
  const [dragging, setDragging] = useState<"center" | "vertex" | null>(null);
  const [answers, setAnswers] = useState({ side: "", perimeter: "", area: "" });
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [hint, setHint] = useState(false);
  const surfaceRef = useRef<HTMLElement>(null);
  const model = useMemo(
    () => regularPolygonModel(n, radius, rotation, center),
    [n, radius, rotation, center],
  );
  const practice = useMemo(
    () => regularPolygonModel(8, 5, 90, { x: 0, y: 0 }),
    [],
  );

  const reset = () => {
    setN(6);
    setRadius(6);
    setRotation(90);
    setCenter(initialCenter);
    setVisibility(initialVisibility);
    setTool("select");
    setAnswers({ side: "", perimeter: "", area: "" });
    setFeedback("idle");
    setHint(false);
    onInteraction();
  };
  useEffect(() => {
    setN(6);
    setRadius(6);
    setRotation(90);
    setCenter(initialCenter);
    setVisibility(initialVisibility);
    setTool("select");
    setAnswers({ side: "", perimeter: "", area: "" });
    setFeedback("idle");
    setHint(false);
  }, [resetToken]);

  const pointerToDomain = (event: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(-8 + ((event.clientX - rect.left) / rect.width) * 16, -7.5, 7.5),
      y: clamp(7 - ((event.clientY - rect.top) / rect.height) * 14, -6.5, 6.5),
    };
  };
  const movePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const point = pointerToDomain(event);
    if (dragging === "center") setCenter(point);
    else {
      const distance = Math.hypot(point.x - center.x, point.y - center.y);
      setRadius(clamp(distance, 2, 10));
      setRotation(
        normalizeDegrees(
          (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI,
        ),
      );
    }
    setFeedback("idle");
    onInteraction();
  };
  const beginDrag = (
    event: ReactPointerEvent<SVGCircleElement>,
    kind: "center" | "vertex",
  ) => {
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    setDragging(kind);
  };
  const placeCenter = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool !== "center" || dragging) return;
    setCenter(pointerToDomain(event));
    setTool("select");
    onInteraction();
  };
  const toggle = (key: keyof Visibility, checked: boolean) => {
    setVisibility((value) => ({ ...value, [key]: checked }));
    onInteraction();
  };
  const checkPractice = () => {
    const close = (raw: string, value: number) =>
      Math.abs(Number(raw) - value) < 0.03;
    const correct =
      close(answers.side, practice.side) &&
      close(answers.perimeter, practice.perimeter) &&
      close(answers.area, practice.area);
    setFeedback(correct ? "correct" : "incorrect");
    onInteraction();
  };
  const fullscreen = () => {
    void surfaceRef.current?.requestFullscreen?.();
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="space-y-3"
      style={{ marginTop: -7 }}
      data-testid="dynamic-geometry-mockup-0272"
      data-dedicated-lesson="215"
      data-object-model="regular-polygon"
      data-direct-interaction="true"
      aria-label="Regular Polygon dedicated interactive geometry model"
    >
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-[8px] font-black uppercase text-cyan-700">
              Dynamic Geometry Constructions
            </span>
            <h1 className="mt-3 text-3xl font-black">Regular Polygon</h1>
            <p className="mt-2 text-[11px] text-slate-600">
              Construct equal-sided polygons and explore their properties.
            </p>
          </div>
          <div className="grid min-w-[375px] grid-cols-3 rounded-xl border p-3 text-[9px]">
            <Metadata icon="▦" label="Level" value="Middle School+" />
            <Metadata icon="✧" label="Focus" value="Geometry" />
            <Metadata icon="◷" label="Time" value="6–10 min" />
          </div>
        </div>
        <nav className="mt-3 grid max-w-[600px] grid-cols-5 overflow-hidden rounded-lg border text-[9px] font-black">
          {["Explore", "Construct", "Patterns", "Rule", "Try It"].map(
            (label, index) => (
              <button
                type="button"
                key={label}
                className={`py-[10px] ${index === 0 ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`}
                onClick={() => {
                  document
                    .getElementById(`polygon-${index}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  onInteraction();
                }}
              >
                {label}
              </button>
            ),
          )}
        </nav>
      </header>

      <section
        id="polygon-0"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:h-[517px]"
        style={{ marginTop: 1 }}
      >
        <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
          <div className="relative overflow-hidden rounded-lg border border-slate-200">
            <PolygonCanvas
              model={model}
              visibility={visibility}
              tool={tool}
              onMove={movePointer}
              onUp={() => setDragging(null)}
              onPointDown={beginDrag}
              onPlaneClick={placeCenter}
            />
            <div className="absolute left-2 top-2 grid gap-2">
              <Tool
                active={tool === "select"}
                label="Select and drag polygon"
                onClick={() => {
                  setTool("select");
                  onInteraction();
                }}
              >
                <MousePointer2 />
              </Tool>
              <Tool
                active={visibility.radii}
                label={visibility.radii ? "Hide radii" : "Show radii"}
                onClick={() => toggle("radii", !visibility.radii)}
              >
                <span className="h-4 border-l-2 border-slate-500 rotate-[-20deg]" />
              </Tool>
              <Tool
                active={tool === "center"}
                label="Place polygon centre"
                onClick={() => {
                  setTool("center");
                  onInteraction();
                }}
              >
                <Crosshair />
              </Tool>
              <Tool
                active={visibility.grid}
                label={
                  visibility.grid ? "Hide polygon grid" : "Show polygon grid"
                }
                onClick={() => toggle("grid", !visibility.grid)}
              >
                <Grid3X3 />
              </Tool>
              <Tool
                label="Rotate polygon 15 degrees"
                onClick={() => {
                  setRotation((value) => normalizeDegrees(value + 15));
                  onInteraction();
                }}
              >
                <RotateCw />
              </Tool>
            </div>
            <button
              type="button"
              aria-label="Enter polygon fullscreen"
              className="target-geometry-tool absolute right-2 top-2"
              onClick={fullscreen}
            >
              <Maximize2 />
            </button>
            <div className="absolute inset-x-2 bottom-2 grid grid-cols-4 rounded-md border bg-white/95 p-2 text-[8px] font-bold">
              <VisibilityToggle
                label="Show vertices"
                checked={visibility.vertices}
                onChange={(checked) => toggle("vertices", checked)}
              />
              <VisibilityToggle
                label="Show circumcircle"
                checked={visibility.circle}
                onChange={(checked) => toggle("circle", checked)}
              />
              <VisibilityToggle
                label="Show symmetry axes"
                checked={visibility.symmetry}
                onChange={(checked) => toggle("symmetry", checked)}
              />
              <VisibilityToggle
                label="Labels"
                checked={visibility.labels}
                onChange={(checked) => toggle("labels", checked)}
              />
            </div>
          </div>
          <aside className="grid content-start gap-3">
            <PolygonRange
              number={1}
              label="Sides (n)"
              value={n}
              min={3}
              max={12}
              step={1}
              onChange={(value) => {
                setN(value);
                setFeedback("idle");
                onInteraction();
              }}
            />
            <PolygonRange
              number={2}
              label="Radius (r)"
              value={radius}
              min={2}
              max={10}
              step={0.05}
              digits={2}
              onChange={(value) => {
                setRadius(value);
                setFeedback("idle");
                onInteraction();
              }}
            />
            <section className="rounded-lg border border-slate-200 p-4">
              <h2 className="text-[10px] font-black">Measurements</h2>
              <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-3 text-[9px]">
                <dt>Central angle (θ)</dt>
                <dd className="font-black text-violet-600">
                  {model.centralAngle.toFixed(0)}°
                </dd>
                <dt>Side length (s)</dt>
                <dd className="font-black text-violet-600">
                  {model.side.toFixed(2)}
                </dd>
                <dt>Perimeter (P)</dt>
                <dd className="font-black text-violet-600">
                  {model.perimeter.toFixed(2)}
                </dd>
                <dt>Area (A)</dt>
                <dd className="font-black text-violet-600">
                  {model.area.toFixed(2)}
                </dd>
              </dl>
            </section>
            <section className="rounded-lg border border-slate-200 p-4">
              <h2 className="text-[10px] font-black">Symmetry</h2>
              <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-3 text-[9px]">
                <dt>Lines of symmetry</dt>
                <dd className="font-black text-blue-700">{n}</dd>
                <dt>Rotational symmetry</dt>
                <dd className="font-black text-blue-700">Order {n}</dd>
              </dl>
            </section>
          </aside>
        </div>
      </section>

      <section
        id="polygon-2"
        className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:h-[128px] lg:grid-cols-5"
        style={{ marginTop: 11 }}
      >
        {[
          {
            title: "Observe",
            text: "A regular polygon has equal sides and equal central angles.",
          },
          {
            title: "Manipulate",
            text: "Change n or r to see how angles, sides, perimeter and area respond.",
          },
          {
            title: "Notice the pattern",
            text: "θ decreases as n increases. Perimeter and area grow with n and r.",
          },
          {
            title: "Understand the rule",
            text: "θ = 360°/n; P = n·s; A = ½nr²sin(360°/n).",
          },
          {
            title: "Try independently",
            text: "Solve the challenge below using what you discovered.",
          },
        ].map((item, index) => (
          <article
            key={item.title}
            className="min-h-[112px] border-r p-3 last:border-0"
          >
            <h2 className="text-[10px] font-black text-slate-800">
              <span className="mr-2 text-blue-600">{index + 1}</span>
              {item.title}
            </h2>
            <p className="mt-3 text-[9px] leading-4 text-slate-600">
              {item.text}
            </p>
          </article>
        ))}
      </section>

      <div
        className="grid gap-3 lg:h-[357px] lg:grid-cols-[1.25fr_1fr_1.45fr]"
        id="polygon-1"
        style={{ marginTop: 11 }}
      >
        <ConstructionSteps />
        <FormulaPanel />
        <PracticePanel
          answers={answers}
          setAnswers={setAnswers}
          feedback={feedback}
          hint={hint}
          onCheck={checkPractice}
          onHint={() => {
            setHint((value) => !value);
            onInteraction();
          }}
        />
      </div>

      <nav
        className="grid min-h-[68px] grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white text-[9px] font-black"
        style={{ marginTop: 11 }}
      >
        <a
          href="/lessons/geometry/214-triangle-constructor"
          className="flex items-center gap-2 px-5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block text-slate-500">Previous</small>Triangle
            Constructor
          </span>
        </a>
        <a
          href="/lessons/geometry/216-rigid-polygon"
          className="flex items-center justify-end gap-2 border-l px-5 text-right"
        >
          <span>
            <small className="block text-slate-500">Next</small>Rigid Polygon
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Live Verification. Check Construction. Sides n and Radius are generated
        through a dedicated regular-polygon vertex model.
      </span>
    </section>
  );
}

function Metadata({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 border-r px-3 last:border-0">
      <b className="text-xl text-blue-600">{icon}</b>
      <span>
        <small className="block text-slate-500">{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
function Tool({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={`target-geometry-tool ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );
}
function VisibilityToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-center gap-2">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-blue-600"
      />
      {label}
    </label>
  );
}
function PolygonRange({
  number,
  label,
  value,
  min,
  max,
  step,
  digits = 0,
  onChange,
}: {
  number: number;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-lg border border-slate-200 p-4">
      <span className="flex items-center gap-2 text-[11px] font-black">
        <i className="grid h-5 w-5 place-items-center rounded-full border border-blue-400 text-[9px] not-italic text-blue-700">
          {number}
        </i>
        {label}
      </span>
      <span className="mt-4 flex items-center gap-3">
        <span className="min-w-0 flex-1">
          <input
            type="range"
            aria-label={label}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full accent-blue-600"
          />
          <i className="flex justify-between text-[8px] not-italic text-slate-500">
            <b>{min}</b>
            <b>{max}</b>
          </i>
        </span>
        <output className="min-w-12 rounded-md border px-3 py-2 text-center text-[11px] font-black">
          {value.toFixed(digits)}
        </output>
      </span>
    </label>
  );
}

function PolygonCanvas({
  model,
  visibility,
  tool,
  onMove,
  onUp,
  onPointDown,
  onPlaneClick,
}: {
  model: ReturnType<typeof regularPolygonModel>;
  visibility: Visibility;
  tool: Tool;
  onMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onUp: () => void;
  onPointDown: (
    event: ReactPointerEvent<SVGCircleElement>,
    kind: "center" | "vertex",
  ) => void;
  onPlaneClick: (event: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 310 + x * 36,
    sy = (y: number) => 250 - y * 36;
  const points = model.vertices.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ");
  return (
    <svg
      viewBox="0 0 620 500"
      className={`block aspect-[1.24/1] w-full touch-none ${visibility.grid ? "bg-[linear-gradient(#dbeafe_1px,transparent_1px),linear-gradient(90deg,#dbeafe_1px,transparent_1px)] bg-[size:36px_36px]" : "bg-white"}`}
      role="img"
      aria-label="Interactive regular polygon coordinate plane with draggable centre and vertices"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClick={onPlaneClick}
    >
      <line x1="25" y1={sy(0)} x2="595" y2={sy(0)} stroke="#64748b" />
      <line x1={sx(0)} y1="20" x2={sx(0)} y2="480" stroke="#64748b" />
      {visibility.circle ? (
        <circle
          cx={sx(model.center.x)}
          cy={sy(model.center.y)}
          r={model.radius * 36}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      ) : null}
      {visibility.symmetry
        ? Array.from({ length: model.n }, (_, i) => {
            const angle =
                ((model.rotation + (i * 180) / model.n) * Math.PI) / 180,
              dx = Math.cos(angle) * model.radius * 36,
              dy = -Math.sin(angle) * model.radius * 36;
            return (
              <line
                key={i}
                x1={sx(model.center.x) - dx}
                y1={sy(model.center.y) - dy}
                x2={sx(model.center.x) + dx}
                y2={sy(model.center.y) + dy}
                stroke="#93c5fd"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })
        : null}
      {visibility.radii
        ? model.vertices.map((p, i) => (
            <line
              key={i}
              x1={sx(model.center.x)}
              y1={sy(model.center.y)}
              x2={sx(p.x)}
              y2={sy(p.y)}
              stroke="#bfdbfe"
              strokeWidth="1"
            />
          ))
        : null}
      <polygon
        points={points}
        fill="#dbeafe88"
        stroke="#2563eb"
        strokeWidth="2.5"
      />
      <circle
        data-testid="regular-polygon-center"
        cx={sx(model.center.x)}
        cy={sy(model.center.y)}
        r="11"
        fill="transparent"
        className={tool === "select" ? "cursor-grab" : "cursor-crosshair"}
        onPointerDown={(event) => {
          event.stopPropagation();
          onPointDown(event, "center");
        }}
      />
      <circle
        cx={sx(model.center.x)}
        cy={sy(model.center.y)}
        r="5"
        fill="#111827"
        pointerEvents="none"
      />
      <text x={sx(model.center.x) + 9} y={sy(model.center.y) - 7} fontSize="12">
        O ({model.center.x.toFixed(1)}, {model.center.y.toFixed(1)})
      </text>
      {model.vertices.map((p, i) => (
        <g key={i}>
          {visibility.vertices ? (
            <>
              <circle
                data-testid={`regular-polygon-vertex-${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r="12"
                fill="transparent"
                className="cursor-grab"
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onPointDown(event, "vertex");
                }}
              />
              <circle
                cx={sx(p.x)}
                cy={sy(p.y)}
                r="6"
                fill="#2563eb"
                pointerEvents="none"
              />
            </>
          ) : null}
          {visibility.labels ? (
            <text
              x={sx(p.x) + (p.x >= model.center.x ? 10 : -62)}
              y={sy(p.y) + (p.y >= model.center.y ? -8 : 18)}
              fontSize="11"
              fontWeight="800"
            >
              {letters[i]} ({p.x.toFixed(2)}, {p.y.toFixed(2)})
            </text>
          ) : null}
        </g>
      ))}
      <path
        d={arcPath(
          { x: sx(model.center.x), y: sy(model.center.y) },
          42,
          -model.rotation,
          -(model.rotation + model.centralAngle),
        )}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <text
        x={sx(model.center.x) + 12}
        y={sy(model.center.y) + 52}
        fill="#7c3aed"
        fontSize="12"
        fontWeight="800"
      >
        θ = {model.centralAngle.toFixed(0)}°
      </text>
      <text
        x={sx(model.center.x) + model.radius * 18}
        y={sy(model.center.y) - 10}
        fontSize="11"
      >
        r = {model.radius.toFixed(2)}
      </text>
    </svg>
  );
}

function ConstructionSteps() {
  return (
    <section className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-[11px] font-black text-blue-800">
        Construction Steps
      </h2>
      <ol className="mt-4 space-y-3 text-[9px] leading-4">
        {[
          "Choose the number of sides n (3 ≤ n ≤ 12).",
          "Set the radius r (distance from center to any vertex).",
          "Place point O at the origin (0, 0).",
          "Mark the first vertex A at angle 90° (on +y axis).",
          "Generate remaining vertices by rotating A about O in steps of 360°/n.",
        ].map((step, index) => (
          <li key={step} className="flex gap-2">
            <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
              {index + 1}
            </b>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-md bg-blue-50 p-3">
        <h3 className="flex items-center gap-2 text-[9px] font-black">
          <Lightbulb className="h-4 w-4" />
          Tip
        </h3>
        <p className="mt-2 text-[8px] leading-4">
          All vertices lie on a circle of radius r and are equally spaced. Each
          interior angle is α = 180° − 360°/n.
        </p>
      </div>
    </section>
  );
}
function FormulaPanel() {
  return (
    <section
      id="polygon-3"
      className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-[11px] font-black text-blue-800">Key Formulas</h2>
      <div className="mt-4 space-y-4 text-[9px]">
        <Formula label="Central angle:" formula="θ = 360° / n" />
        <Formula label="Side length:" formula="s = 2r sin(180° / n)" />
        <Formula label="Perimeter:" formula="P = ns" />
        <Formula label="Area:" formula="A = ½nr² sin(360° / n)" />
      </div>
      <p className="mt-8 text-[8px] text-slate-500">
        Where: n = sides, r = radius.
      </p>
    </section>
  );
}
function Formula({ label, formula }: { label: string; formula: string }) {
  return (
    <div>
      <b>{label}</b>
      <p className="mt-2 text-center font-serif text-sm italic">{formula}</p>
    </div>
  );
}
function PracticePanel({
  answers,
  setAnswers,
  feedback,
  hint,
  onCheck,
  onHint,
}: {
  answers: { side: string; perimeter: string; area: string };
  setAnswers: React.Dispatch<
    React.SetStateAction<{ side: string; perimeter: string; area: string }>
  >;
  feedback: "idle" | "correct" | "incorrect";
  hint: boolean;
  onCheck: () => void;
  onHint: () => void;
}) {
  return (
    <section
      id="polygon-4"
      className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-[11px] font-black text-blue-800">
        Try It: Find the Unknown
      </h2>
      <p className="mt-4 text-[9px] leading-4">
        A regular polygon has 8 sides and a radius of 5 units.
        <br />
        Find the side length, perimeter and area.
      </p>
      <div className="mt-5 space-y-2">
        {(
          [
            ["Side length (s)", "side", "units"],
            ["Perimeter (P)", "perimeter", "units"],
            ["Area (A)", "area", "square units"],
          ] as const
        ).map(([label, key, unit]) => (
          <label
            key={key}
            className="grid grid-cols-[75px_minmax(0,1fr)_64px] items-center gap-2 text-[8px]"
          >
            <span>{label} =</span>
            <input
              type="number"
              step="0.01"
              aria-label={`Polygon practice ${key}`}
              value={answers[key]}
              onChange={(event) => {
                setAnswers((value) => ({
                  ...value,
                  [key]: event.target.value,
                }));
              }}
              className="h-8 w-full min-w-0 rounded-md border px-2 py-1"
            />
            <span>{unit}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          className="rounded-md bg-blue-600 px-5 py-2 text-[9px] font-black text-white"
          onClick={onCheck}
        >
          Check Answer
        </button>
        <button
          type="button"
          className="rounded-md border border-violet-400 px-5 py-2 text-[9px] font-black text-violet-700"
          onClick={onHint}
        >
          Hint
        </button>
      </div>
      {hint ? (
        <p className="mt-3 text-[8px] text-violet-700">
          Use n = 8 and r = 5 in the formulas. Round each result to two
          decimals.
        </p>
      ) : null}
      {feedback !== "idle" ? (
        <p
          role="status"
          className={`mt-3 text-[9px] font-black ${feedback === "correct" ? "text-emerald-700" : "text-amber-700"}`}
        >
          {feedback === "correct"
            ? "Correct: octagon measurements verified."
            : "Check all three values and round to two decimals."}
        </p>
      ) : null}
      <div className="mt-3 rounded-md border border-amber-100 bg-amber-50 p-3">
        <h3 className="flex items-center gap-2 text-[9px] font-black">
          <Trophy className="h-4 w-4 text-amber-600" />
          Challenge
        </h3>
        <p className="mt-2 text-[8px] leading-4">
          What happens to the area when n → ∞ (with fixed r)? What shape does
          the polygon approach?
        </p>
      </div>
    </section>
  );
}

function regularPolygonModel(
  n: number,
  radius: number,
  rotation: number,
  center: Point,
) {
  const vertices = Array.from({ length: n }, (_, i) => {
    const angle = ((rotation - (i * 360) / n) * Math.PI) / 180;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });
  const centralAngle = 360 / n,
    side = 2 * radius * Math.sin(Math.PI / n),
    perimeter = n * side,
    area = 0.5 * n * radius * radius * Math.sin((2 * Math.PI) / n);
  return {
    n,
    radius,
    rotation,
    center,
    vertices,
    centralAngle,
    side,
    perimeter,
    area,
    apothem: radius * Math.cos(Math.PI / n),
    interiorAngle: 180 - centralAngle,
  };
}
function arcPath(center: Point, radius: number, start: number, end: number) {
  const polar = (degrees: number) => ({
      x: center.x + radius * Math.cos((degrees * Math.PI) / 180),
      y: center.y + radius * Math.sin((degrees * Math.PI) / 180),
    }),
    a = polar(start),
    b = polar(end);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 0 ${end > start ? 1 : 0} ${b.x} ${b.y}`;
}
function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
