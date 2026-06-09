import { CircleDot, Cone, MousePointer2, RotateCcw, Sigma, Triangle, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { FormulaBlock, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";

type ConicMode = "parabola" | "ellipse" | "hyperbola";
type Point = { x: number; y: number };

const modes: Array<{ id: ConicMode; label: string; icon: typeof Triangle }> = [
  { id: "parabola", label: "Parabola", icon: Cone },
  { id: "ellipse", label: "Ellipse", icon: CircleDot },
  { id: "hyperbola", label: "Hyperbola", icon: Sigma },
];

const conicCopy: Record<ConicMode, {
  question: string;
  answer: string;
  formula: string;
  chips: string[];
  steps: Array<{ title: string; explanation: string; formula?: string; result?: string }>;
}> = {
  parabola: {
    question: "Tangents from P(1, 2) to y^2 = 4x touch at A and B. Find the area of triangle PAB.",
    answer: "Area = 0 square units. P lies on the parabola, so the two tangent contact points coincide.",
    formula: "\\text{Area}(\\triangle PAB)=0",
    chips: ["tangent", "degenerate", "area", "touch point"],
    steps: [
      {
        title: "Use the tangent form",
        explanation: "For y^2 = 4ax with a = 1, the point with parameter t is (t^2, 2t), and the tangent is ty = x + t^2.",
        formula: "ty=x+t^2",
      },
      {
        title: "Pass the tangent through P(1,2)",
        explanation: "Substitute x = 1 and y = 2 in the tangent equation.",
        formula: "2t=1+t^2 \\Rightarrow t^2-2t+1=0",
      },
      {
        title: "Detect the repeated tangent",
        explanation: "The parameter equation has a repeated root, so A and B are the same point.",
        formula: "(t-1)^2=0 \\Rightarrow t=1,\\quad A=B=(1,2)",
      },
      {
        title: "Compute the triangle area",
        explanation: "A, B, and P do not form a real triangle because all contact data collapses to the same point.",
        result: "Area = 0 square units",
      },
    ],
  },
  ellipse: {
    question: "An ellipse has eccentricity 1/2 and a focus at (1,0). The corresponding directrix is x = 4. Find the standard equation.",
    answer: "x^2 / 4 + y^2 / 3 = 1",
    formula: "\\frac{x^2}{4}+\\frac{y^2}{3}=1",
    chips: ["focus", "directrix", "eccentricity", "standard form"],
    steps: [
      {
        title: "Read the horizontal ellipse data",
        explanation: "For a standard ellipse centered at the origin, focus = (ae, 0) and corresponding directrix = x = a/e.",
        formula: "ae=1,\\quad \\frac{a}{e}=4",
      },
      {
        title: "Find the semi-major axis",
        explanation: "Since e = 1/2 and ae = 1, a must be 2. The directrix check gives 2/(1/2) = 4.",
        formula: "a=\\frac{1}{e}=2",
      },
      {
        title: "Find the semi-minor axis",
        explanation: "For an ellipse, b^2 = a^2(1 - e^2).",
        formula: "b^2=4\\left(1-\\frac14\\right)=3",
      },
      {
        title: "Write standard form",
        explanation: "Use x^2/a^2 + y^2/b^2 = 1.",
        result: "x^2/4 + y^2/3 = 1",
      },
    ],
  },
  hyperbola: {
    question: "If 2x + y = k is tangent to x^2/a^2 - y^2/b^2 = 1, find the relation between a, b, and k.",
    answer: "k^2 = 4a^2 - b^2",
    formula: "k^2=4a^2-b^2",
    chips: ["tangent condition", "slope", "intercept", "relation"],
    steps: [
      {
        title: "Put the line in slope-intercept form",
        explanation: "The given line is y = -2x + k, so its slope is m = -2 and intercept is c = k.",
        formula: "2x+y=k \\Rightarrow y=-2x+k",
      },
      {
        title: "Use the hyperbola tangent condition",
        explanation: "For x^2/a^2 - y^2/b^2 = 1, a line y = mx + c is tangent when c^2 = a^2m^2 - b^2.",
        formula: "c^2=a^2m^2-b^2",
      },
      {
        title: "Substitute m and c",
        explanation: "Put m = -2 and c = k.",
        formula: "k^2=a^2(-2)^2-b^2",
      },
      {
        title: "Simplify",
        explanation: "The required relation is direct.",
        result: "k^2 = 4a^2 - b^2",
      },
    ],
  },
};

export default function MathLabConicSolver() {
  const [active, setActive] = useState<ConicMode>("parabola");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const dragStart = useRef<Point | null>(null);
  const current = conicCopy[active];

  const notes = useMemo(() => (
    <>
      <SectionCard title="Recognition Rules" compact>
        <div className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p><span className="font-bold text-slate-900 dark:text-white">Parabola tangent:</span> for y^2 = 4ax, use ty = x + at^2.</p>
          <p><span className="font-bold text-slate-900 dark:text-white">Ellipse focus-directrix:</span> use focus (ae,0), directrix x = a/e, and b^2 = a^2(1-e^2).</p>
          <p><span className="font-bold text-slate-900 dark:text-white">Hyperbola tangent:</span> y = mx + c touches x^2/a^2 - y^2/b^2 = 1 when c^2 = a^2m^2 - b^2.</p>
        </div>
      </SectionCard>
      <SectionCard title="Use Cases" compact>
        <div className="flex flex-wrap gap-2">
          {current.chips.map((chip) => <span key={chip} className="mini-chip">{chip}</span>)}
        </div>
      </SectionCard>
    </>
  ), [current.chips]);

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function beginDrag(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
  }

  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    if (!dragStart.current) return;
    setPan({ x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y });
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStart.current = null;
  }

  function wheelZoom(event: WheelEvent<SVGSVGElement>) {
    event.preventDefault();
    setZoom((value) => clamp(value + (event.deltaY > 0 ? -0.08 : 0.08), 0.7, 1.7));
  }

  return (
    <MathLabLayout
      title="Conic Solver and Visualizer"
      subtitle="Solve and visualize parabola tangent, ellipse focus-directrix, and hyperbola tangent-condition problems."
      notes={notes}
    >
      <div className="grid gap-3 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="desktop-sidebar-panel space-y-3">
          <SectionCard title="Question Type" compact>
            <div className="grid gap-2">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActive(mode.id)}
                    className={`tool-button justify-start ${active === mode.id ? "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-100" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Given Question" compact>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{current.question}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current.chips.map((chip) => <span key={chip} className="mini-chip">{chip}</span>)}
            </div>
          </SectionCard>

          <ResultCard
            title="Answer"
            result={<p className="font-black">{current.answer}</p>}
            verification={<FormulaBlock title="Final form" formula={current.formula} />}
            relatedTools={[
              { label: "Graphing Calculator", route: "/math-lab/graphing-calculator" },
              { label: "Geometry Lab", route: "/math-lab/geometry" },
            ]}
          />
        </aside>

        <section className="min-w-0 space-y-3">
          <SectionCard title="Interactive Diagram" description="Drag inside the diagram to pan. Use the controls or mouse wheel to zoom." compact tone="spotlight">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="mini-chip"><MousePointer2 className="h-3.5 w-3.5" />drag pan</span>
              <button className="tool-button" type="button" onClick={() => setZoom((value) => clamp(value + 0.12, 0.7, 1.7))} aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="tool-button" type="button" onClick={() => setZoom((value) => clamp(value - 0.12, 0.7, 1.7))} aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="tool-button" type="button" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />Reset
              </button>
              <span className="mini-chip">zoom {Math.round(zoom * 100)}%</span>
            </div>
            <ConicDiagram
              mode={active}
              zoom={zoom}
              pan={pan}
              onPointerDown={beginDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onWheel={wheelZoom}
            />
          </SectionCard>

          <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <StepPanel steps={current.steps} />
            <SectionCard title="Label Key" compact>
              <LabelKey mode={active} />
            </SectionCard>
          </div>
        </section>
      </div>
    </MathLabLayout>
  );
}

function ConicDiagram({
  mode,
  zoom,
  pan,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
}: {
  mode: ConicMode;
  zoom: number;
  pan: Point;
  onPointerDown: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: PointerEvent<SVGSVGElement>) => void;
  onWheel: (event: WheelEvent<SVGSVGElement>) => void;
}) {
  const points = useMemo(() => {
    if (mode === "parabola") return buildParabolaPoints();
    if (mode === "ellipse") return buildEllipsePoints();
    return buildHyperbolaPoints();
  }, [mode]);

  return (
    <svg
      viewBox="0 0 760 420"
      role="img"
      aria-label={`${mode} conic visualization`}
      className="h-[360px] w-full cursor-grab rounded-xl border border-white/10 bg-slate-950 select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <defs>
        <pattern id="conic-grid" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
        </pattern>
        <filter id="conic-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="760" height="420" fill="url(#conic-grid)" />
      <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
        <Axis />
        {mode === "parabola" && <ParabolaScene points={points} />}
        {mode === "ellipse" && <EllipseScene points={points} />}
        {mode === "hyperbola" && <HyperbolaScene points={points} />}
      </g>
    </svg>
  );
}

function Axis() {
  return (
    <g>
      <line x1="60" y1="210" x2="720" y2="210" stroke="rgba(203,213,225,0.55)" strokeWidth="2" />
      <line x1="380" y1="40" x2="380" y2="370" stroke="rgba(203,213,225,0.55)" strokeWidth="2" />
      <text x="704" y="198" fill="#e2e8f0" fontSize="13" fontWeight="800">x</text>
      <text x="392" y="56" fill="#e2e8f0" fontSize="13" fontWeight="800">y</text>
      {[-4, -2, 2, 4].map((tick) => (
        <g key={`x-${tick}`}>
          <line x1={sx(tick)} y1="204" x2={sx(tick)} y2="216" stroke="rgba(203,213,225,0.4)" />
          <text x={sx(tick) - 5} y="232" fill="#94a3b8" fontSize="11">{tick}</text>
        </g>
      ))}
      {[-3, -1, 1, 3].map((tick) => (
        <g key={`y-${tick}`}>
          <line x1="374" y1={sy(tick)} x2="386" y2={sy(tick)} stroke="rgba(203,213,225,0.4)" />
          <text x="394" y={sy(tick) + 4} fill="#94a3b8" fontSize="11">{tick}</text>
        </g>
      ))}
    </g>
  );
}

function ParabolaScene({ points }: { points: string }) {
  const p = toScreen({ x: 1, y: 2 });
  return (
    <g>
      <path d={points} fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#conic-glow)" />
      <line x1={sx(-1.2)} y1={sy(-0.2)} x2={sx(4)} y2={sy(5)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 7" />
      <circle cx={p.x} cy={p.y} r="8" fill="#f8fafc" stroke="#22d3ee" strokeWidth="3" />
      <Label x={p.x + 10} y={p.y - 12} text="P = A = B (1,2)" />
      <Label x={sx(2.6)} y={sy(3.7)} text="single tangent y = x + 1" color="#fde68a" />
      <Label x={sx(2.6)} y={sy(-2.6)} text="y^2 = 4x" color="#67e8f9" />
      <path d={`M ${p.x} ${p.y} L ${p.x + 26} ${p.y + 18} L ${p.x + 8} ${p.y + 34} Z`} fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeDasharray="4 4" />
      <Label x={p.x + 38} y={p.y + 34} text="triangle collapses" />
    </g>
  );
}

function EllipseScene({ points }: { points: string }) {
  const focus = toScreen({ x: 1, y: 0 });
  return (
    <g>
      <path d={points} fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="4" filter="url(#conic-glow)" />
      <line x1={sx(4)} y1={sy(-3.2)} x2={sx(4)} y2={sy(3.2)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 7" />
      <circle cx={focus.x} cy={focus.y} r="7" fill="#f8fafc" stroke="#f59e0b" strokeWidth="3" />
      <circle cx={sx(-1)} cy={sy(0)} r="5" fill="#f59e0b" />
      <line x1={sx(-2)} y1={sy(0)} x2={sx(2)} y2={sy(0)} stroke="#a78bfa" strokeWidth="3" />
      <line x1={sx(0)} y1={sy(-Math.sqrt(3))} x2={sx(0)} y2={sy(Math.sqrt(3))} stroke="#a78bfa" strokeWidth="3" />
      <Label x={focus.x + 10} y={focus.y - 12} text="focus (1,0)" />
      <Label x={sx(4) + 8} y={sy(-2.8)} text="directrix x = 4" color="#fde68a" />
      <Label x={sx(-1.3)} y={sy(0.45)} text="a = 2" color="#ddd6fe" />
      <Label x={sx(0.15)} y={sy(1.25)} text="b = sqrt(3)" color="#ddd6fe" />
      <Label x={sx(-2.7)} y={sy(-2.3)} text="x^2/4 + y^2/3 = 1" color="#67e8f9" />
    </g>
  );
}

function HyperbolaScene({ points }: { points: string }) {
  const left = toScreen({ x: -4, y: 4 - Math.sqrt(15) });
  const right = toScreen({ x: 4, y: -8 + Math.sqrt(15) });
  return (
    <g>
      <path d={points} fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#conic-glow)" />
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 7" />
      <path d={`M ${sx(-4)} ${sy(-2)} L ${sx(4)} ${sy(2)} M ${sx(-4)} ${sy(2)} L ${sx(4)} ${sy(-2)}`} stroke="rgba(167,139,250,0.65)" strokeWidth="2" strokeDasharray="5 6" />
      <Label x={sx(0.6)} y={sy(Math.sqrt(15) - 1.2)} text="2x + y = k" color="#fde68a" />
      <Label x={sx(-3.5)} y={sy(2.7)} text="sample tangent with k = sqrt(15)" color="#fde68a" />
      <Label x={sx(1.8)} y={sy(-2.3)} text="x^2/a^2 - y^2/b^2 = 1" color="#67e8f9" />
      <Label x={sx(-3.7)} y={sy(-2.8)} text="relation: k^2 = 4a^2 - b^2" />
    </g>
  );
}

function Label({ x, y, text, color = "#e2e8f0" }: { x: number; y: number; text: string; color?: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize="13" fontWeight="800" paintOrder="stroke" stroke="#020617" strokeWidth="4">
      {text}
    </text>
  );
}

function LabelKey({ mode }: { mode: ConicMode }) {
  const rows = {
    parabola: [
      ["P", "External point from the question. Here it is also the touch point."],
      ["A, B", "Repeated tangent contact points, so A = B = P."],
      ["tangent", "The only tangent through P is y = x + 1."],
      ["area", "The triangle is degenerate, so area is 0."],
    ],
    ellipse: [
      ["e", "Eccentricity = 1/2."],
      ["focus", "Given as (1,0), equal to (ae,0)."],
      ["directrix", "Given as x = 4, equal to x = a/e."],
      ["a, b", "a = 2 and b^2 = 3."],
    ],
    hyperbola: [
      ["m", "Slope of 2x + y = k is -2."],
      ["c", "Intercept is k."],
      ["condition", "c^2 = a^2m^2 - b^2."],
      ["relation", "k^2 = 4a^2 - b^2."],
    ],
  } satisfies Record<ConicMode, string[][]>;

  return (
    <div className="space-y-2">
      {rows[mode].map(([label, detail]) => (
        <div key={label} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{label}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function buildParabolaPoints() {
  const pts: Point[] = [];
  for (let y = -3.4; y <= 3.4; y += 0.08) pts.push({ x: (y * y) / 4, y });
  return toPath(pts);
}

function buildEllipsePoints() {
  const pts: Point[] = [];
  const b = Math.sqrt(3);
  for (let t = 0; t <= Math.PI * 2 + 0.02; t += 0.04) pts.push({ x: 2 * Math.cos(t), y: b * Math.sin(t) });
  return toPath(pts, true);
}

function buildHyperbolaPoints() {
  const right: Point[] = [];
  const left: Point[] = [];
  for (let x = 2; x <= 4.5; x += 0.05) right.push({ x, y: Math.sqrt((x * x) / 4 - 1) });
  for (let x = 4.5; x >= 2; x -= 0.05) right.push({ x, y: -Math.sqrt((x * x) / 4 - 1) });
  for (let x = -2; x >= -4.5; x -= 0.05) left.push({ x, y: Math.sqrt((x * x) / 4 - 1) });
  for (let x = -4.5; x <= -2; x += 0.05) left.push({ x, y: -Math.sqrt((x * x) / 4 - 1) });
  return `${toPath(right, true)} ${toPath(left, true)}`;
}

function toPath(points: Point[], close = false) {
  return points.map((point, index) => {
    const screen = toScreen(point);
    return `${index === 0 ? "M" : "L"} ${screen.x.toFixed(2)} ${screen.y.toFixed(2)}`;
  }).join(" ") + (close ? " Z" : "");
}

function toScreen(point: Point): Point {
  return { x: sx(point.x), y: sy(point.y) };
}

function sx(x: number) {
  return 380 + x * 70;
}

function sy(y: number) {
  return 210 - y * 70;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
