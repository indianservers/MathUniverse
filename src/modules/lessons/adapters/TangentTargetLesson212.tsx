import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Crosshair,
  Languages,
  Lightbulb,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
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
const initialCenter = { x: 300, y: 315 };
const initialContact = { x: 300, y: 155 };
const radius = 160;

export default function TangentTargetLesson212({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [contact, setContact] = useState<Point>(initialContact);
  const [snap, setSnap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showSecant, setShowSecant] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<"center" | "contact" | null>(null);
  const [language, setLanguage] = useState("English (English)");
  const [shareStatus, setShareStatus] = useState("");
  const [positionIndex, setPositionIndex] = useState(0);
  const surfaceRef = useRef<HTMLElement>(null);
  const model = useMemo(
    () => deriveTangent(center, contact, radius),
    [center, contact],
  );

  const reset = () => {
    setCenter(initialCenter);
    setContact(initialContact);
    setSnap(true);
    setShowGrid(true);
    setShowSecant(false);
    setZoom(1);
    setPositionIndex(0);
    setShareStatus("");
    onInteraction();
  };
  useEffect(() => {
    setCenter(initialCenter);
    setContact(initialContact);
    setSnap(true);
    setShowGrid(true);
    setShowSecant(false);
    setZoom(1);
    setPositionIndex(0);
  }, [resetToken]);

  const pointerPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const visibleWidth = 600 / zoom;
    const visibleHeight = 580 / zoom;
    return {
      x:
        300 -
        visibleWidth / 2 +
        ((event.clientX - rect.left) / rect.width) * visibleWidth,
      y:
        290 -
        visibleHeight / 2 +
        ((event.clientY - rect.top) / rect.height) * visibleHeight,
    };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const raw = pointerPoint(event);
    if (dragging === "center") {
      const next = { x: clamp(raw.x, 190, 410), y: clamp(raw.y, 220, 390) };
      const delta = { x: next.x - center.x, y: next.y - center.y };
      setCenter(next);
      setContact((point) => ({ x: point.x + delta.x, y: point.y + delta.y }));
    } else {
      const next = snap ? projectToCircle(raw, center, radius) : raw;
      setContact({ x: clamp(next.x, 30, 570), y: clamp(next.y, 35, 545) });
    }
    onInteraction();
  };
  const startDrag = (
    event: ReactPointerEvent<SVGCircleElement>,
    point: "center" | "contact",
  ) => {
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    setDragging(point);
  };
  const newPosition = () => {
    const angles = [-90, -30, 25, 82, 145, 205];
    const next = positionIndex + 1;
    setPositionIndex(next);
    setSnap(true);
    setContact(polar(center, radius, angles[next % angles.length]));
    onInteraction();
  };
  const share = async () => {
    const message = `Circle O(${formatCoord(center.x)},${formatCoord(center.y)}), T(${formatCoord(contact.x)},${formatCoord(contact.y)}), OT=${model.ot.toFixed(2)}, distance(O,l)=${model.lineDistance.toFixed(2)}, power=${model.power.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(message);
      setShareStatus("Tangent measurements copied");
    } catch {
      setShareStatus(message);
    }
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
      data-testid="dynamic-geometry-mockup-0269"
      data-dedicated-lesson="212"
      data-object-model="circle-tangent"
      data-direct-interaction="true"
      aria-label="Tangent dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex gap-2 text-[8px] font-black uppercase">
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-cyan-700">
                Geometry
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                Dynamic Geometry Construction
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black">Tangent</h1>
            <p className="mt-1 text-[11px] text-slate-600">
              Construct touching lines.
            </p>
          </div>
          <div className="flex gap-6 pt-6 text-[9px] font-bold text-slate-700">
            <span>▦ &nbsp; Grade 9-12</span>
            <span>◷ &nbsp; 6-10 min</span>
            <span>▥ &nbsp; Exploration</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex min-h-9 min-w-44 items-center gap-2 rounded-md border px-3 text-[9px] font-bold">
            <Languages className="h-4 w-4" />
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                onInteraction();
              }}
              className="min-w-0 flex-1 bg-transparent text-[9px]"
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
          </label>
          <button
            type="button"
            className="target-geometry-action min-h-9 justify-center px-4"
            onClick={reset}
          >
            <RotateCcw /> Reset
          </button>
          <button
            type="button"
            className="target-geometry-action min-h-9 justify-center px-4"
            onClick={share}
          >
            <Share2 /> Share
          </button>
          <button
            type="button"
            className="target-geometry-action ml-auto min-h-9 justify-center px-4"
            onClick={fullscreen}
          >
            <Maximize2 /> Workspace
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

      <nav className="grid min-h-11 grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white text-[10px] font-black">
        {["Observe", "Manipulate", "Notice", "Understand", "Try"].map(
          (stage, index) => (
            <button
              key={stage}
              type="button"
              className={`border-r last:border-0 ${index === 0 ? "bg-blue-600 text-white" : "text-slate-700"}`}
              onClick={() => {
                document
                  .getElementById(`tangent-${stage.toLowerCase()}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                onInteraction();
              }}
            >
              {stage}
            </button>
          ),
        )}
      </nav>

      <div
        className="grid gap-3 lg:grid-cols-[1.25fr_0.82fr]"
        id="tangent-observe"
      >
        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="text-sm font-black">Tangent – drag the blue point</h2>
          <div
            className={`relative mt-2 overflow-hidden rounded-md border ${showGrid ? "bg-[linear-gradient(#eef2f7_1px,transparent_1px),linear-gradient(90deg,#eef2f7_1px,transparent_1px)] bg-[size:28px_28px]" : "bg-white"}`}
          >
            <svg
              viewBox={`${300 - 300 / zoom} ${290 - 290 / zoom} ${600 / zoom} ${580 / zoom}`}
              className="block aspect-[1.03/1] w-full touch-none"
              role="img"
              aria-label="Interactive tangent circle with draggable center O and contact point T"
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerCancel={() => setDragging(null)}
            >
              <circle
                cx={center.x}
                cy={center.y}
                r={radius}
                fill="#eff6ff88"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
              <line
                x1={center.x}
                y1={center.y}
                x2={contact.x}
                y2={contact.y}
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1={model.lineA.x}
                y1={model.lineA.y}
                x2={model.lineB.x}
                y2={model.lineB.y}
                stroke="#7c3aed"
                strokeWidth="3"
              />
              {showSecant ? (
                <SecantLine center={center} contact={contact} />
              ) : null}
              <path
                d={rightAnglePath(contact, model.unit, model.normal, 24)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              <circle
                data-testid="tangent-center-o"
                cx={center.x}
                cy={center.y}
                r="10"
                fill="transparent"
                className="cursor-grab"
                onPointerDown={(event) => startDrag(event, "center")}
              />
              <circle
                cx={center.x}
                cy={center.y}
                r="6"
                fill="#0f172a"
                pointerEvents="none"
              />
              <circle
                data-testid="tangent-point-t"
                cx={contact.x}
                cy={contact.y}
                r="12"
                fill="transparent"
                className="cursor-grab"
                onPointerDown={(event) => startDrag(event, "contact")}
              />
              <circle
                cx={contact.x}
                cy={contact.y}
                r="9"
                fill="#1687d9"
                stroke="#075985"
                strokeWidth="1.5"
                pointerEvents="none"
              />
              <text
                x={center.x - 28}
                y={center.y + 9}
                fontSize="20"
                fontWeight="800"
              >
                O
              </text>
              <text
                x={contact.x - 8}
                y={contact.y - 25}
                fill="#0369a1"
                fontSize="20"
                fontWeight="900"
              >
                T
              </text>
              <text
                x={contact.x + 20}
                y={contact.y - 58}
                fill="#2563eb"
                fontSize="13"
              >
                Drag point T along the circle
              </text>
              <text
                x={model.lineB.x - 90}
                y={model.lineB.y - 12}
                fill="#111827"
                fontSize="15"
              >
                <tspan fill="#7c3aed" fontStyle="italic">
                  ℓ
                </tspan>{" "}
                (tangent)
              </text>
            </svg>
            <div className="absolute bottom-3 left-3 rounded-md border bg-white/95 p-3 text-[9px] shadow-sm">
              <Legend color="#7c3aed" label="ℓ : tangent line" line />
              <Legend
                color="#2563eb"
                label="OT : radius (perpendicular)"
                dashed
              />
              <Legend color="#2563eb" label="Circle (center O)" circle />
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <ToolButton
                label="Reset view"
                onClick={() => {
                  setZoom(1);
                  onInteraction();
                }}
              >
                <Crosshair />
              </ToolButton>
              <ToolButton
                label="Zoom in"
                onClick={() => {
                  setZoom((value) => clamp(value + 0.15, 0.75, 1.45));
                  onInteraction();
                }}
              >
                <Plus />
              </ToolButton>
              <ToolButton
                label="Zoom out"
                onClick={() => {
                  setZoom((value) => clamp(value - 0.15, 0.75, 1.45));
                  onInteraction();
                }}
              >
                <Minus />
              </ToolButton>
              <ToolButton label="Enter tangent fullscreen" onClick={fullscreen}>
                <Maximize2 />
              </ToolButton>
            </div>
          </div>
        </article>

        <aside className="grid content-start gap-3" id="tangent-notice">
          <section
            role="status"
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <h2 className="flex items-center gap-2 text-[10px] font-black">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Observation
            </h2>
            <p className="mt-3 text-[10px] leading-5 text-slate-700">
              The tangent is perpendicular to the radius at the point of
              contact.
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-[10px] font-black">Measures</h2>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 text-[9px]">
              <dt>Center O</dt>
              <dd>
                ({toUnit(center.x - 300)}, {toUnit(315 - center.y)})
              </dd>
              <dt>Point T</dt>
              <dd>
                ({toUnit(contact.x - 300)}, {toUnit(315 - contact.y)})
              </dd>
              <dt>
                Radius <i>r = OT</i>
              </dt>
              <dd>{model.otUnits.toFixed(2)}</dd>
              <dt>
                Distance from O to <i>ℓ</i>
              </dt>
              <dd className="font-black text-emerald-600">
                {model.lineDistanceUnits.toFixed(2)}
              </dd>
              <dt>Angle ∠OTℓ</dt>
              <dd className="font-black text-emerald-600">90.00°</dd>
              <dt>
                Power (point O to <i>ℓ</i>)
              </dt>
              <dd
                className={`font-black ${Math.abs(model.powerUnits) < 0.01 ? "text-amber-600" : "text-blue-600"}`}
              >
                {model.powerUnits.toFixed(2)}
              </dd>
            </dl>
            <p className="mt-3 text-[8px] text-slate-500">
              Power = distance × distance − r²
            </p>
          </section>
          <section
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            id="tangent-manipulate"
          >
            <h2 className="text-[10px] font-black">Try a secant</h2>
            <p className="mt-2 text-[9px] leading-4 text-slate-600">
              Turn off snap, drag T off the circle, then show a secant.
            </p>
            <Toggle
              label="Show secant line"
              checked={showSecant}
              onChange={setShowSecant}
              onInteraction={onInteraction}
            />
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <h2 className="text-[10px] font-black">Quick controls</h2>
            <Toggle
              label="Snap to circle"
              checked={snap}
              onChange={(value) => {
                setSnap(value);
                if (value) setContact(projectToCircle(contact, center, radius));
              }}
              onInteraction={onInteraction}
            />
            <Toggle
              label="Show grid"
              checked={showGrid}
              onChange={setShowGrid}
              onInteraction={onInteraction}
            />
          </section>
        </aside>
      </div>

      <div
        className="grid gap-3 lg:grid-cols-[1fr_1.08fr]"
        id="tangent-understand"
      >
        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="text-sm font-black">Construction</h2>
          <ol className="mt-3 space-y-2 text-[9px]">
            {[
              "Draw a circle with center O.",
              "Place point T on the circle.",
              "Draw line ℓ through T perpendicular to OT.",
            ].map((step, index) => (
              <li key={step} className="flex gap-2">
                <b className="grid h-5 w-5 place-items-center rounded-full bg-slate-100">
                  {index + 1}
                </b>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-[9px] font-bold text-blue-700">
            ℓ is the tangent at T. It touches the circle at exactly one point.
          </p>
        </section>
        <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 shadow-sm">
          <h2 className="flex items-center justify-between text-sm font-black text-violet-700">
            Key Insight <Lightbulb className="h-5 w-5" />
          </h2>
          <p className="mt-3 text-[10px] font-black leading-5 text-violet-700">
            A tangent line to a circle is perpendicular to the radius at the
            point of contact.
          </p>
          <div className="mt-3 rounded-md border bg-white p-3 text-[9px] leading-4">
            <b>Power of a point</b>
            <p>For the center O and tangent ℓ,</p>
            <p className="my-1 text-center font-serif text-base italic">
              PO² − d²
            </p>
            <p>
              Here, d = distance from O to ℓ. For a tangent through T, d = r, so
              PO² = r².
            </p>
          </div>
        </section>
      </div>

      <section
        className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        id="tangent-try"
      >
        <h2 className="text-sm font-black">Try It Yourself</h2>
        <p className="mt-1 text-[9px] text-slate-600">
          Complete the task below using the interactive model.
        </p>
        <div className="mt-2 grid items-center gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="text-[9px] leading-4">
            <b>Task 1.</b>
            <p>
              Move T to any position on the circle.
              <br />
              Verify that the tangent ℓ is always perpendicular to OT.
            </p>
            <ul className="mt-2 space-y-1">
              {[
                "Is ∠OTℓ = 90°?",
                "Is distance from O to ℓ always equal to the radius?",
                "What is the power of point O to ℓ?",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-600 text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center gap-4">
            <PracticeTangent
              angle={[-90, -30, 25, 82, 145, 205][positionIndex % 6]}
            />
            <button
              type="button"
              className="target-geometry-action"
              onClick={newPosition}
            >
              <RotateCcw /> New Position
            </button>
          </div>
        </div>
      </section>

      <nav className="grid min-h-12 grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white text-[9px] font-black">
        <a
          href="/lessons/geometry/211-angle-bisector"
          className="flex items-center gap-2 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block text-slate-500">Previous</small>Angle
            Bisector
          </span>
        </a>
        <a
          href="/lessons/geometry/213-best-fit-line"
          className="flex items-center justify-end gap-2 border-l px-4 text-right"
        >
          <span>
            <small className="block text-slate-500">Next</small>Best-Fit Line
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Live Verification. Check Construction. Contact angle and Radius are
        calculated from the draggable circle model.
      </span>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  onInteraction,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onInteraction: () => void;
}) {
  return (
    <label className="mt-2 flex items-center justify-between border-t pt-1 text-[9px]">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
          onInteraction();
        }}
        className="h-5 w-9 accent-blue-600"
      />
    </label>
  );
}
function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="target-geometry-tool bg-white/95"
    >
      {children}
    </button>
  );
}
function Legend({
  color,
  label,
  line,
  dashed,
  circle,
}: {
  color: string;
  label: string;
  line?: boolean;
  dashed?: boolean;
  circle?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      {circle ? (
        <i
          className="h-5 w-5 rounded-full border-2"
          style={{ borderColor: color }}
        />
      ) : (
        <i
          className={`block w-7 border-t-2 ${dashed ? "border-dotted" : ""}`}
          style={{ borderColor: color }}
        />
      )}
      {line || dashed || circle ? <span>{label}</span> : null}
    </div>
  );
}
function SecantLine({ center, contact }: { center: Point; contact: Point }) {
  const angle = (12 * Math.PI) / 180,
    direction = { x: Math.cos(angle), y: Math.sin(angle) };
  return (
    <line
      x1={contact.x - direction.x * 400}
      y1={contact.y - direction.y * 400}
      x2={contact.x + direction.x * 400}
      y2={contact.y + direction.y * 400}
      stroke="#f59e0b"
      strokeWidth="2.5"
      strokeDasharray="8 5"
      aria-label={`Secant through T relative to center ${center.x},${center.y}`}
    />
  );
}
function PracticeTangent({ angle }: { angle: number }) {
  const o = { x: 85, y: 82 },
    t = polar(o, 52, angle),
    radial = unit(o, t),
    normal = { x: -radial.y, y: radial.x };
  return (
    <svg
      viewBox="0 0 180 145"
      className="h-28 w-36"
      role="img"
      aria-label={`Practice tangent position ${angle} degrees`}
    >
      <circle
        cx={o.x}
        cy={o.y}
        r="52"
        fill="#eff6ff"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <line
        x1={o.x}
        y1={o.y}
        x2={t.x}
        y2={t.y}
        stroke="#2563eb"
        strokeDasharray="4 3"
      />
      <line
        x1={t.x - normal.x * 70}
        y1={t.y - normal.y * 70}
        x2={t.x + normal.x * 70}
        y2={t.y + normal.y * 70}
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <circle cx={o.x} cy={o.y} r="4" />
      <circle cx={t.x} cy={t.y} r="6" fill="#1687d9" />
      <text x={o.x - 17} y={o.y + 13} fontSize="12">
        O
      </text>
      <text x={t.x - 3} y={t.y - 10} fontSize="12">
        T
      </text>
      <text
        x={t.x - normal.x * 62}
        y={t.y - normal.y * 62 - 5}
        fill="#7c3aed"
        fontStyle="italic"
      >
        ℓ
      </text>
    </svg>
  );
}

function deriveTangent(center: Point, contact: Point, circleRadius: number) {
  const radial = unit(center, contact),
    normal = { x: -radial.y, y: radial.x };
  const ot = Math.hypot(contact.x - center.x, contact.y - center.y);
  const lineDistance = ot;
  return {
    unit: radial,
    normal,
    ot,
    otUnits: ot / 32,
    lineDistance,
    lineDistanceUnits: lineDistance / 32,
    power: lineDistance * lineDistance - circleRadius * circleRadius,
    powerUnits:
      (lineDistance * lineDistance - circleRadius * circleRadius) / (32 * 32),
    lineA: { x: contact.x - normal.x * 420, y: contact.y - normal.y * 420 },
    lineB: { x: contact.x + normal.x * 420, y: contact.y + normal.y * 420 },
  };
}
function rightAnglePath(t: Point, radial: Point, normal: Point, size: number) {
  const a = { x: t.x + radial.x * size, y: t.y + radial.y * size },
    b = { x: a.x + normal.x * size, y: a.y + normal.y * size },
    c = { x: t.x + normal.x * size, y: t.y + normal.y * size };
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`;
}
function projectToCircle(point: Point, center: Point, r: number) {
  const direction = unit(center, point);
  return { x: center.x + direction.x * r, y: center.y + direction.y * r };
}
function unit(a: Point, b: Point) {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
}
function polar(center: Point, r: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: center.x + Math.cos(angle) * r,
    y: center.y + Math.sin(angle) * r,
  };
}
function toUnit(value: number) {
  return (value / 32).toFixed(2);
}
function formatCoord(value: number) {
  return (value / 32).toFixed(2);
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
