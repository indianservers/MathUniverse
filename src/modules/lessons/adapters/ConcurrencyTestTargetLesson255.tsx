import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  HelpCircle,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  Target,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ConcurrencyTestTargetLesson255.css";

type Point = { x: number; y: number };
type Drag = "a" | "b" | "c" | "d" | "e" | "f";
const initialVertices = {
    a: { x: -1, y: 5 },
    b: { x: -5, y: -3 },
    c: { x: 6, y: -3 },
  },
  initialFractions = { f: 5 / 9, d: 6 / 11, e: 2 / 5 };

export default function ConcurrencyTestTargetLesson255({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState(initialVertices),
    [fractions, setFractions] = useState(initialFractions),
    [tab, setTab] = useState("Interaction + visualization"),
    [zoom, setZoom] = useState(1),
    [objectView, setObjectView] = useState("primary-control"),
    [practice, setPractice] = useState({ f: 0.5, d: 0.5, e: 0.5 }),
    [feedback, setFeedback] = useState("Great! Correct: your cevians are concurrent.");
  const model = useMemo(
    () => cevaModel(vertices, fractions),
    [vertices, fractions],
  );
  const updateVertex = (key: "a" | "b" | "c", p: Point) => {
    setVertices((current) => ({
      ...current,
      [key]: { x: clamp(round(p.x), -7, 7), y: clamp(round(p.y), -4, 6) },
    }));
    onInteraction();
  };
  const updateSide = (key: "d" | "e" | "f", p: Point) => {
    const [start, end] =
      key === "f"
        ? [vertices.a, vertices.b]
        : key === "d"
          ? [vertices.b, vertices.c]
          : [vertices.c, vertices.a];
    setFractions((current) => ({
      ...current,
      [key]: clamp(projectFraction(p, start, end), 0.05, 0.95),
    }));
    onInteraction();
  };
  const setRatio = (key: "d" | "e" | "f", value: number) => {
    const r = clamp(value, 0.05, 20);
    setFractions((current) => ({ ...current, [key]: r / (1 + r) }));
    onInteraction();
  };
  const reset = (notify = true) => {
    setVertices(initialVertices);
    setFractions(initialFractions);
    setTab("Interaction + visualization");
    setZoom(1);
    setObjectView("primary-control");
    setPractice({ f: 0.5, d: 0.5, e: 0.5 });
    setFeedback("Great! Correct: your cevians are concurrent.");
    if (notify) onInteraction();
  };
  useEffect(() => {
    setVertices(initialVertices);
    setFractions(initialFractions);
    setTab("Interaction + visualization");
    setZoom(1);
    setObjectView("primary-control");
    setPractice({ f: 0.5, d: 0.5, e: 0.5 });
    setFeedback("Great! Correct: your cevians are concurrent.");
  }, [resetToken]);
  const practiceProduct =
    ratio(practice.f) * ratio(practice.d) * ratio(practice.e);
  const check = () => {
    const correct = Math.abs(practiceProduct - 1) < 0.01;
    setFeedback(
      correct
        ? "Great! Correct: your cevians are concurrent."
        : "Not yet. Adjust a side point until the three Ceva ratios multiply to 1.",
    );
    onInteraction();
  };
  return (
    <section
      className="target-concurrency-page"
      data-testid="dynamic-geometry-mockup-0312"
      data-dedicated-lesson="255"
      data-object-model="triangle-cevians-exact-ceva-concurrency"
      data-ceva-product={model.product.toFixed(6)}
      data-concurrency-residual={model.residual.toFixed(6)}
      data-concurrent={model.concurrent}
      data-triangle-valid={model.valid}
      data-ratio-af-fb={model.ratios.f.toFixed(6)}
      data-ratio-bd-dc={model.ratios.d.toFixed(6)}
      data-ratio-ce-ea={model.ratios.e.toFixed(6)}
      data-object-view={objectView}
    >
      <header className="target-concurrency-header">
        <span>Geometry</span>
        <span>Transformations and Loci</span>
        <h1>Concurrency Test</h1>
        <p>Check common line intersections.</p>
        <section>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Investigation Lab</b>
          <b>▣ Transformation / Locus Tools</b>
          <b>◷ 6-10 min</b>
        </section>
        <footer>
          <button type="button">⚑ English (English)⌄</button>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `Ceva product ${model.product.toFixed(4)}: ${model.concurrent ? "concurrent" : "not concurrent"}`,
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button type="button">↗ Workspace</button>
        </footer>
      </header>
      <section className="target-concurrency-steps">
        {[
          [
            "1",
            Eye,
            "Observe",
            "Three cevians from vertices meet at a single point.",
          ],
          [
            "2",
            Hand,
            "Manipulate",
            "Drag the points on each side to move the cevians.",
          ],
          [
            "3",
            Lightbulb,
            "Notice",
            "When concurrent, the Ceva product equals 1.",
          ],
          [
            "4",
            Target,
            "Understand",
            "Ceva’s Theorem gives a necessary and sufficient test.",
          ],
        ].map(([number, Icon, title, text], index) => (
          <article key={String(title)}>
            <i>{String(number)}</i>
            <Icon />
            <span>
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </span>
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="target-concurrency-work">
        <header>
          <nav>
            {[
              [Eye, "Interaction + visualization"],
              [Lightbulb, "Explain"],
              [Target, "Examples"],
              [Target, "Formulas"],
              [Lightbulb, "Know more"],
            ].map(([Icon, name]) => (
              <button
                type="button"
                key={String(name)}
                className={tab === name ? "is-active" : ""}
                onClick={() => {
                  setTab(String(name));
                  onInteraction();
                }}
              >
                <Icon />
                {String(name)}
              </button>
            ))}
          </nav>
          <aside>
            <span className={model.concurrent ? "good" : "bad"}>
              {model.concurrent
                ? "All three cevians are concurrent"
                : "Cevians are not concurrent"}
            </span>
            <b>{model.concurrent ? "0" : "1"} conflicts</b>
            <button aria-label="Fullscreen concurrency lab">
              <Maximize2 />
            </button>
          </aside>
        </header>
        <h2>Work directly on the model</h2>
        <div>
          <article className="target-concurrency-canvas">
            <h3>Triangle with cevians</h3>
            <p>Drag vertices or side points to test concurrency.</p>
            <nav>
              <button
                aria-label="Zoom out concurrency graph"
                onClick={() => {
                  setZoom((value) => Math.max(0.8, value - 0.1));
                  onInteraction();
                }}
              >
                <ZoomOut />
              </button>
              <button
                aria-label="Zoom in concurrency graph"
                onClick={() => {
                  setZoom((value) => Math.min(1.3, value + 0.1));
                  onInteraction();
                }}
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Reset concurrency construction"
                onClick={() => reset()}
              >
                <RotateCcw />
              </button>
            </nav>
            <ConcurrencyGraph
              model={model}
              zoom={zoom}
              onDrag={(key, p) =>
                key === "a" || key === "b" || key === "c"
                  ? updateVertex(key, p)
                  : updateSide(key, p)
              }
            />
            <section>
              <span>
                <i />
                AF (A to side BC)
              </span>
              <span>
                <i />
                BE (B to side CA)
              </span>
              <span>
                <i />
                CF (C to side AB)
              </span>
            </section>
            <footer>
              <h4>Ceva Product (live)</h4>
              <b>(AF/FB) × (BD/DC) × (CE/EA) =</b>
              <strong>{model.product.toFixed(3)}</strong>
              <span className={model.concurrent ? "good" : "bad"}>
                {model.concurrent ? <Check /> : <TriangleAlert />}
                {model.concurrent ? "Concurrent" : "Not concurrent"}
              </span>
            </footer>
            <p>
              <Lightbulb />
              Tip: Drag F, D, or E along the sides. Watch the product and
              intersection residual change.
            </p>
          </article>
          <aside className="target-concurrency-controls">
            <h3>Segment ratios</h3>
            <p>Interior directed ratios for Ceva’s theorem.</p>
            <RatioControl
              title="On AB (point F)"
              numerator="AF"
              denominator="FB"
              value={model.ratios.f}
              lengths={[
                distance(vertices.a, model.f),
                distance(model.f, vertices.b),
              ]}
              onChange={(value) => setRatio("f", value)}
            />
            <RatioControl
              title="On BC (point D)"
              numerator="BD"
              denominator="DC"
              value={model.ratios.d}
              lengths={[
                distance(vertices.b, model.d),
                distance(model.d, vertices.c),
              ]}
              onChange={(value) => setRatio("d", value)}
            />
            <RatioControl
              title="On CA (point E)"
              numerator="CE"
              denominator="EA"
              value={model.ratios.e}
              lengths={[
                distance(vertices.c, model.e),
                distance(model.e, vertices.a),
              ]}
              onChange={(value) => setRatio("e", value)}
            />
            <footer className={model.concurrent ? "good" : "bad"}>
              <h4>Ceva product</h4>
              <b>{model.product.toFixed(3)}</b>
              <span>{model.concurrent ? "Concurrent" : "Not concurrent"}</span>
            </footer>
          </aside>
        </div>
      </section>
      <section className="target-concurrency-learning">
        <article>
          <h2>Ceva’s Theorem</h2>
          <p>
            For D on BC, E on CA, and F on AB, cevians AD, BE, CF are concurrent
            if and only if
          </p>
          <strong>AF/FB × BD/DC × CE/EA = 1</strong>
          <p>For exterior points, use directed ratios consistently.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Given ratios:</p>
          <b>AF/FB = 2/3, &nbsp; BD/DC = 3/4, &nbsp; CE/EA = 2</b>
          <p>Compute:</p>
          <strong>(2/3) × (3/4) × 2 = 1</strong>
          <footer>
            <Check />
            Product equals 1 ⇒ Concurrent
          </footer>
        </article>
        <article>
          <h2>
            <TriangleAlert />
            Common misconception
          </h2>
          <b>Using absolute lengths for exterior side points.</b>
          <p>
            Signed ratios keep the theorem valid when a point lies on an
            extension. Keep numerator and denominator order consistent.
          </p>
          <MisconceptionMini />
        </article>
      </section>
      <section className="target-concurrency-practice">
        <h2>Your turn: quick practice</h2>
        <p>
          Adjust the three side ratios so the cevians are concurrent. Then
          verify the product equals 1.
        </p>
        <div>
          <PracticeMini fractions={practice} />
          <section>
            {(["f", "d", "e"] as const).map((key) => (
              <label key={key}>
                <span>
                  {key === "f" ? "AF/FB" : key === "d" ? "BD/DC" : "CE/EA"}
                </span>
                <input
                  aria-label={`Practice Ceva ${key.toUpperCase()} ratio`}
                  type="range"
                  min=".2"
                  max="4"
                  step=".05"
                  value={ratio(practice[key])}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPractice((current) => ({
                      ...current,
                      [key]: value / (1 + value),
                    }));
                    onInteraction();
                  }}
                />
                <b>{ratio(practice[key]).toFixed(2)}</b>
              </label>
            ))}
          </section>
          <aside>
            <b>Target: Product = 1</b>
            <p>Current product</p>
            <strong>{practiceProduct.toFixed(3)}</strong>
          </aside>
        </div>
        <footer>
          <button type="button" onClick={check}>
            <Check />
            Check my answer
          </button>
          <p
            role="status"
            className={feedback.startsWith("Great") ? "correct" : "incorrect"}
          >
            {feedback}
          </p>
        </footer>
      </section>
      <section className="target-concurrency-tags" aria-label="Concurrency object view">
        {["primary-control", "geometry object", "measurement"].map((name) => (
          <button
            type="button"
            key={name}
            className={objectView === name ? "is-active" : ""}
            onClick={() => {
              setObjectView(name);
              onInteraction();
            }}
          >
            <i /> {name}
          </button>
        ))}
      </section>
      <nav className="target-concurrency-nav">
        <a href="/lessons/geometry/254-collinearity-test">
          <ArrowLeft />
          <span>
            <b>Previous</b>Collinearity Test
          </span>
        </a>
        <a href="/lessons/geometry/256-concyclicity-test">
          <span>
            <b>Next</b>Concyclicity Test
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function ConcurrencyGraph({
  model,
  zoom,
  onDrag,
}: {
  model: ReturnType<typeof cevaModel>;
  zoom: number;
  onDrag: (key: Drag, p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Drag | null>(null),
    origin = { x: 320, y: 275 },
    scale = 36 * zoom,
    s = (p: Point) => ({
      x: origin.x + p.x * scale,
      y: origin.y - p.y * scale,
    }),
    world = (e: ReactPointerEvent<SVGSVGElement>) => {
      const matrix = ref.current?.getScreenCTM();
      if (!matrix) return null;
      const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        matrix.inverse(),
      );
      return { x: (q.x - origin.x) / scale, y: (origin.y - q.y) / scale };
    };
  const pts = {
      a: s(model.a),
      b: s(model.b),
      c: s(model.c),
      d: s(model.d),
      e: s(model.e),
      f: s(model.f),
    },
    intersection = model.intersection ? s(model.intersection) : null;
  return (
    <svg
      ref={ref}
      className="target-concurrency-graph"
      viewBox="0 0 640 500"
      role="img"
      aria-label="Draggable triangle side points with exact Ceva concurrency test"
      onPointerMove={(e) => {
        if (!drag.current) return;
        const p = world(e);
        if (p) onDrag(drag.current, p);
      }}
      onPointerUp={() => (drag.current = null)}
    >
      <Grid />
      <polygon
        points={`${pts.a.x},${pts.a.y} ${pts.b.x},${pts.b.y} ${pts.c.x},${pts.c.y}`}
        fill="none"
        stroke="#111827"
        strokeWidth="2"
      />
      <line
        x1={pts.a.x}
        y1={pts.a.y}
        x2={pts.d.x}
        y2={pts.d.y}
        stroke="#14b8a6"
        strokeWidth="2"
      />
      <line
        x1={pts.b.x}
        y1={pts.b.y}
        x2={pts.e.x}
        y2={pts.e.y}
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <line
        x1={pts.c.x}
        y1={pts.c.y}
        x2={pts.f.x}
        y2={pts.f.y}
        stroke="#8b5cf6"
        strokeWidth="2"
      />
      {(["a", "b", "c", "d", "e", "f"] as const).map((key) => (
        <g key={key}>
          <circle
            data-testid={`concurrency-point-${key}`}
            data-x={model[key].x.toFixed(3)}
            data-y={model[key].y.toFixed(3)}
            cx={pts[key].x}
            cy={pts[key].y}
            r={key <= "c" ? 8 : 9}
            fill={
              key <= "c"
                ? "#111827"
                : key === "d"
                  ? "#14b8a6"
                  : key === "e"
                    ? "#3b82f6"
                    : "#8b5cf6"
            }
            onPointerDown={(e) => {
              drag.current = key;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
          />
          <text x={pts[key].x + 9} y={pts[key].y - 9} fontWeight="900">
            {key.toUpperCase()}
          </text>
        </g>
      ))}
      {intersection && (
        <g>
          <circle
            data-testid="concurrency-common-point"
            data-x={model.intersection?.x.toFixed(4)}
            data-y={model.intersection?.y.toFixed(4)}
            cx={intersection.x}
            cy={intersection.y}
            r="8"
            fill={model.concurrent ? "#06a7ca" : "#ef4444"}
          />
          <text x={intersection.x + 9} y={intersection.y - 9} fontWeight="900">
            P
          </text>
        </g>
      )}
    </svg>
  );
}
function Grid() {
  return (
    <g stroke="#edf2f7">
      {Array.from({ length: 27 }, (_, i) => (
        <line key={`v${i}`} x1={i * 25} x2={i * 25} y1="0" y2="500" />
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <line key={`h${i}`} x1="0" x2="640" y1={i * 25} y2={i * 25} />
      ))}
    </g>
  );
}
function RatioControl({
  title,
  numerator,
  denominator,
  value,
  lengths,
  onChange,
}: {
  title: string;
  numerator: string;
  denominator: string;
  value: number;
  lengths: [number, number];
  onChange: (v: number) => void;
}) {
  return (
    <section>
      <h4>
        {title}
        <HelpCircle />
      </h4>
      <label>
        <b>
          {numerator}/{denominator}
        </b>
        <input
          aria-label={`${numerator} over ${denominator}`}
          type="range"
          min=".1"
          max="5"
          step=".01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          aria-label={`${numerator} over ${denominator} exact value`}
          type="number"
          min=".05"
          max="20"
          step=".01"
          value={Number(value.toFixed(3))}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
      <p>
        {numerator} = {lengths[0].toFixed(3)} &nbsp;&nbsp; {denominator} ={" "}
        {lengths[1].toFixed(3)}
      </p>
    </section>
  );
}
function MisconceptionMini() {
  return (
    <svg viewBox="0 0 190 90">
      <polygon points="20,75 80,10 170,75" fill="none" stroke="#334155" />
      <line x1="20" y1="75" x2="118" y2="40" stroke="#ef4444" />
      <line x1="80" y1="10" x2="96" y2="75" stroke="#8b5cf6" />
      <line
        x1="170"
        y1="75"
        x2="54"
        y2="38"
        stroke="#06a7ca"
        strokeDasharray="4 3"
      />
    </svg>
  );
}
function PracticeMini({
  fractions,
}: {
  fractions: { f: number; d: number; e: number };
}) {
  return (
    <svg viewBox="0 0 180 100">
      <polygon points="90,8 15,90 168,90" fill="none" stroke="#334155" />
      <line
        x1="90"
        y1="8"
        x2={15 + (168 - 15) * fractions.d}
        y2="90"
        stroke="#14b8a6"
      />
      <line
        x1="15"
        y1="90"
        x2={168 + (90 - 168) * fractions.e}
        y2={90 + (8 - 90) * fractions.e}
        stroke="#3b82f6"
      />
      <line
        x1="168"
        y1="90"
        x2={90 + (15 - 90) * fractions.f}
        y2={8 + (90 - 8) * fractions.f}
        stroke="#8b5cf6"
      />
    </svg>
  );
}
function cevaModel(
  vertices: { a: Point; b: Point; c: Point },
  fractions: { f: number; d: number; e: number },
) {
  const { a, b, c } = vertices,
    f = lerp(a, b, fractions.f),
    d = lerp(b, c, fractions.d),
    e = lerp(c, a, fractions.e),
    ratios = {
      f: ratio(fractions.f),
      d: ratio(fractions.d),
      e: ratio(fractions.e),
    },
    product = ratios.f * ratios.d * ratios.e,
    l1 = line(a, d),
    l2 = line(b, e),
    l3 = line(c, f),
    p12 = intersect(l1, l2),
    p23 = intersect(l2, l3),
    p31 = intersect(l3, l1),
    intersection = p12,
    residual =
      p12 && p23 && p31
        ? Math.max(distance(p12, p23), distance(p23, p31), distance(p31, p12))
        : Infinity,
    valid = Math.abs(cross(sub(b, a), sub(c, a))) > 0.0001,
    concurrent =
      valid &&
      Number.isFinite(residual) &&
      residual < 0.003 &&
      Math.abs(product - 1) < 0.003;
  return {
    a,
    b,
    c,
    d,
    e,
    f,
    ratios,
    product,
    l1,
    l2,
    l3,
    p12,
    p23,
    p31,
    intersection,
    residual,
    valid,
    concurrent,
  };
}
function line(p: Point, q: Point) {
  return { a: p.y - q.y, b: q.x - p.x, c: p.x * q.y - q.x * p.y };
}
function intersect(
  l: { a: number; b: number; c: number },
  m: { a: number; b: number; c: number },
) {
  const det = l.a * m.b - m.a * l.b;
  if (Math.abs(det) < 1e-9) return null;
  return { x: (l.b * m.c - m.b * l.c) / det, y: (l.c * m.a - m.c * l.a) / det };
}
function projectFraction(p: Point, a: Point, b: Point) {
  const v = sub(b, a),
    den = v.x * v.x + v.y * v.y;
  return den < 1e-9 ? 0.5 : ((p.x - a.x) * v.x + (p.y - a.y) * v.y) / den;
}
function lerp(a: Point, b: Point, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
function ratio(f: number) {
  return f / (1 - f);
}
function sub(a: Point, b: Point) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function cross(a: Point, b: Point) {
  return a.x * b.y - a.y * b.x;
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function round(n: number) {
  return Math.round(n * 20) / 20;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}
