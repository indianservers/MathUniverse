import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ConcyclicityTestTargetLesson256.css";

type Point = { x: number; y: number };
type Key = "a" | "b" | "c" | "d";
const initial = {
  a: { x: -5, y: 1 },
  b: { x: 1, y: 5 },
  c: { x: 5, y: -1 },
  d: { x: -1, y: -5 },
};

export default function ConcyclicityTestTargetLesson256({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(initial),
    [tab, setTab] = useState("Interaction + Visualization"),
    [practiceScale, setPracticeScale] = useState(1),
    [feedback, setFeedback] = useState(
      "Correct. The fourth point lies on the circle through the first three.",
    ),
    [objectView, setObjectView] = useState("primary-control");
  const model = useMemo(() => circleModel(points), [points]);
  const update = (key: Key, p: Point) => {
    setPoints((current) => ({
      ...current,
      [key]: { x: clamp(round(p.x), -10, 10), y: clamp(round(p.y), -10, 10) },
    }));
    onInteraction();
  };
  const reset = (notify = true) => {
    setPoints(initial);
    setTab("Interaction + Visualization");
    setPracticeScale(1);
    setFeedback(
      "Correct. The fourth point lies on the circle through the first three.",
    );
    setObjectView("primary-control");
    if (notify) onInteraction();
  };
  useEffect(() => {
    setPoints(initial);
    setTab("Interaction + Visualization");
    setPracticeScale(1);
    setFeedback(
      "Correct. The fourth point lies on the circle through the first three.",
    );
    setObjectView("primary-control");
  }, [resetToken]);
  const practiceModel = useMemo(
    () => practiceCircleModel(practiceScale),
    [practiceScale],
  );
  const check = () => {
    setFeedback(
      practiceModel.concyclic
        ? "Correct. The fourth point lies on the circle through the first three."
        : "Not yet. Move D until its radial residual and four-point determinant are zero.",
    );
    onInteraction();
  };
  return (
    <section
      className="target-concyclic-page"
      data-testid="dynamic-geometry-mockup-0313"
      data-dedicated-lesson="256"
      data-object-model="four-point-circumcircle-determinant-angle-residual"
      data-center-x={model.circle?.center.x.toFixed(4) ?? "undefined"}
      data-center-y={model.circle?.center.y.toFixed(4) ?? "undefined"}
      data-radius={model.circle?.radius.toFixed(4) ?? "undefined"}
      data-radial-residual={
        Number.isFinite(model.radialResidual)
          ? model.radialResidual.toFixed(6)
          : "undefined"
      }
      data-determinant={model.determinant.toFixed(6)}
      data-opposite-sum-ac={model.sumAC.toFixed(4)}
      data-opposite-sum-bd={model.sumBD.toFixed(4)}
      data-concyclic={model.concyclic}
      data-circle-valid={model.valid}
      data-points-distinct={model.distinct}
      data-object-view={objectView}
    >
      <header className="target-concyclic-header">
        <span>Geometry</span>
        <span>Transformations and Loci</span>
        <h1>Concyclicity Test</h1>
        <p>Check shared-circle conditions.</p>
        <section>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Investigation Lab</b>
          <b>▣ Transformation / Locus Tools</b>
          <b>◷ 6-10 min</b>
        </section>
        <footer>
          <button type="button" onClick={() => { setTab("Explain"); onInteraction(); }}>⚑ English (English)⌄</button>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `Four-point determinant ${model.determinant.toFixed(4)}: ${model.concyclic ? "concyclic" : "not concyclic"}`,
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button type="button" onClick={() => { setObjectView("geometry object"); onInteraction(); }}>⚙ Torkspace</button>
          <button type="button" onClick={() => { setObjectView("measurement"); onInteraction(); }}>↗ Workspace</button>
        </footer>
      </header>
      <section className="target-concyclic-steps">
        <b>HOW TO WORK</b>
        <div>
          {[
            [
              "1",
              Eye,
              "Observe",
              "Four points determine whether a common circle exists.",
            ],
            [
              "2",
              Hand,
              "Manipulate",
              "Drag any point or use sliders. Watch angles, determinant and circle update instantly.",
            ],
            [
              "3",
              Lightbulb,
              "Notice",
              "Concyclic ⇔ opposite angles supplementary ⇔ determinant zero.",
            ],
            [
              "4",
              Target,
              "Understand",
              "A quadrilateral is concyclic iff any equivalent condition holds.",
            ],
          ].map(([number, Icon, title, text]) => (
            <article key={String(title)}>
              <Icon />
              <span>
                <b>
                  {String(number)}. {String(title)}
                </b>
                <p>{String(text)}</p>
              </span>
            </article>
          ))}
        </div>
      </section>
      <nav className="target-concyclic-tabs">
        {[
          [Eye, "Interaction + Visualization"],
          [Lightbulb, "Explain"],
          [Target, "Examples"],
          [Target, "Formulas"],
          [TriangleAlert, "Common Misconception"],
          [Check, "Practice"],
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
      <section className="target-concyclic-work">
        <div>
          <article className="target-concyclic-canvas">
            <b>INTERACTION · VISUALIZATION</b>
            <h3>Drag the four points or use sliders.</h3>
            <ConcyclicGraph points={points} model={model} onPoint={update} />
            <footer>
              <span>Drag points</span>
              {(["a", "b", "c", "d"] as const).map((key, index) => (
                <span key={key}>
                  <i
                    style={{
                      background: ["#2563eb", "#8b5cf6", "#16a34a", "#f97316"][
                        index
                      ],
                    }}
                  />
                  {key.toUpperCase()}
                </span>
              ))}
            </footer>
          </article>
          <aside className="target-concyclic-controls">
            <h3>Point coordinates</h3>
            {(["a", "b", "c", "d"] as const).map((key, index) => (
              <div key={key}>
                <b>
                  {key.toUpperCase()} (x{index + 1}, y{index + 1})
                </b>
                <input
                  aria-label={`${key.toUpperCase()} x coordinate`}
                  type="number"
                  step=".25"
                  value={points[key].x}
                  onChange={(e) =>
                    update(key, { ...points[key], x: Number(e.target.value) })
                  }
                />
                <input
                  aria-label={`${key.toUpperCase()} y coordinate`}
                  type="number"
                  step=".25"
                  value={points[key].y}
                  onChange={(e) =>
                    update(key, { ...points[key], y: Number(e.target.value) })
                  }
                />
                <input
                  aria-label={`${key.toUpperCase()} horizontal position`}
                  type="range"
                  min="-10"
                  max="10"
                  step=".25"
                  value={points[key].x}
                  onChange={(e) =>
                    update(key, { ...points[key], x: Number(e.target.value) })
                  }
                />
              </div>
            ))}
            <section>
              <h3>Concyclicity checks</h3>
              <p>
                <span>Opposite-angles check</span>
                <b>∠A + ∠C = {model.sumAC.toFixed(2)}°</b>
                {near(model.sumAC, 180) && <Check />}
              </p>
              <p>
                <span>Another pair</span>
                <b>∠B + ∠D = {model.sumBD.toFixed(2)}°</b>
                {near(model.sumBD, 180) && <Check />}
              </p>
              <p>
                <span>Determinant check</span>
                <b>Δ = {fmt(model.determinant)}</b>
                {Math.abs(model.determinant) < 1e-5 && <Check />}
              </p>
              <p>
                <span>Radial residual</span>
                <b>
                  {Number.isFinite(model.radialResidual)
                    ? model.radialResidual.toFixed(6)
                    : "undefined"}
                </b>
                {Math.abs(model.radialResidual) < 1e-5 && <Check />}
              </p>
            </section>
            <footer className={model.concyclic ? "good" : "bad"}>
              {model.concyclic ? <Check /> : <TriangleAlert />}
              <span>
                <b>Result: {model.concyclic ? "Concyclic" : "Not concyclic"}</b>
                <p>
                  {model.concyclic
                    ? "The four distinct points lie on a common circle."
                    : !model.valid
                      ? "The first three points do not define a circle."
                      : "The fourth point misses the fitted circle."}
                </p>
              </span>
            </footer>
          </aside>
        </div>
      </section>
      <section className="target-concyclic-learning">
        <article>
          <h2>THE RULE</h2>
          <p>
            Four distinct points A, B, C, D are concyclic iff any equivalent
            condition holds:
          </p>
          <ul>
            <li>∠A + ∠C = 180°</li>
            <li>∠B + ∠D = 180°</li>
            <li>Four-point determinant Δ = 0</li>
            <li>All radial distances from O are equal.</li>
          </ul>
          <strong>det[x²+y², x, y, 1] = 0</strong>
        </article>
        <article>
          <h2>WORKED EXAMPLE (Correct)</h2>
          <p>A(-5,1), B(1,5), C(5,-1), D(-1,-5)</p>
          <p>Angles:</p>
          <b>∠A + ∠C = 90° + 90° = 180°</b>
          <b>∠B + ∠D = 90° + 90° = 180°</b>
          <p>Determinant: Δ = 0</p>
          <footer>Hence, the four points are concyclic.</footer>
        </article>
        <article>
          <h2>
            <TriangleAlert />
            COMMON MISCONCEPTION
          </h2>
          <p>
            Checking only one rounded angle sum is necessary but can be
            numerically misleading.
          </p>
          <p>
            Confirm with the determinant or the radial residual of the fourth
            point.
          </p>
          <b>Tip: use a small tolerance for numerical stability.</b>
        </article>
      </section>
      <section className="target-concyclic-practice">
        <h2>PRACTICE CHALLENGE (Try it here)</h2>
        <p>Move point D radially to make the quadrilateral concyclic.</p>
        <div>
          <article>
            <b>Target: Concyclic</b>
            <p>Make Δ = 0 and both opposite-angle pairs supplementary.</p>
            <label>
              Radial scale D
              <input
                aria-label="Practice D radial scale"
                type="range"
                min=".6"
                max="1.5"
                step=".01"
                value={practiceScale}
                onChange={(e) => {
                  setPracticeScale(Number(e.target.value));
                  onInteraction();
                }}
              />
              <strong>{practiceScale.toFixed(2)}</strong>
            </label>
            <button type="button" onClick={check}>
              Check practice
            </button>
          </article>
          <PracticeGraph model={practiceModel} />
          <aside>
            <h3>Live checks</h3>
            <p>Opposite sum: {practiceModel.sumAC.toFixed(2)}°</p>
            <p>Determinant: {practiceModel.determinant.toFixed(4)}</p>
            <p>Residual: {practiceModel.radialResidual.toFixed(4)}</p>
            <p
              role="status"
              className={
                feedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {feedback}
            </p>
          </aside>
        </div>
      </section>
      <nav className="target-concyclic-nav">
        <a href="/lessons/geometry/255-concurrency-test">
          <ArrowLeft />
          <span>
            <b>Previous</b>Concurrency Test
          </span>
        </a>
        <a href="/lessons/trigonometry/257-angle-measurement">
          <span>
            <b>Next</b>Angle Measurement
          </span>
          <ArrowRight />
        </a>
      </nav>
      <section
        className="target-concyclic-tags"
        aria-label="Concyclicity object view"
      >
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
            <i />
            {name}
          </button>
        ))}
      </section>
    </section>
  );
}

function ConcyclicGraph({
  points,
  model,
  onPoint,
}: {
  points: Record<Key, Point>;
  model: ReturnType<typeof circleModel>;
  onPoint: (key: Key, p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Key | null>(null),
    origin = { x: 320, y: 250 },
    scale = 38,
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
  const p = { a: s(points.a), b: s(points.b), c: s(points.c), d: s(points.d) },
    center = model.circle ? s(model.circle.center) : null;
  return (
    <svg
      ref={ref}
      className="target-concyclic-graph"
      viewBox="0 0 640 500"
      role="img"
      aria-label="Four draggable points with fitted circumcircle and exact concyclicity checks"
      onPointerMove={(e) => {
        if (!drag.current) return;
        const q = world(e);
        if (q) onPoint(drag.current, q);
      }}
      onPointerUp={() => (drag.current = null)}
    >
      <Grid />
      <line x1="0" x2="640" y1={origin.y} y2={origin.y} stroke="#334155" />
      <line x1={origin.x} x2={origin.x} y1="0" y2="500" stroke="#334155" />
      {model.circle && center && (
        <circle
          data-testid="concyclicity-fitted-circle"
          cx={center.x}
          cy={center.y}
          r={model.circle.radius * scale}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
        />
      )}
      <polygon
        points={`${p.a.x},${p.a.y} ${p.b.x},${p.b.y} ${p.c.x},${p.c.y} ${p.d.x},${p.d.y}`}
        fill="none"
        stroke="#cbd5e1"
        strokeDasharray="5 4"
      />
      {(["a", "b", "c", "d"] as const).map((key, index) => (
        <g key={key}>
          <circle
            data-testid={`concyclicity-point-${key}`}
            data-x={points[key].x.toFixed(3)}
            data-y={points[key].y.toFixed(3)}
            cx={p[key].x}
            cy={p[key].y}
            r="9"
            fill={["#2563eb", "#8b5cf6", "#16a34a", "#f97316"][index]}
            onPointerDown={(e) => {
              drag.current = key;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
          />
          <text
            x={p[key].x + 10}
            y={p[key].y - 10}
            fontSize="13"
            fontWeight="900"
            fill={["#1d4ed8", "#7c3aed", "#15803d", "#ea580c"][index]}
          >
            {key.toUpperCase()} {point(points[key])}
          </text>
        </g>
      ))}
    </svg>
  );
}
function Grid() {
  return (
    <g stroke="#e8eef5">
      {Array.from({ length: 27 }, (_, i) => (
        <line key={`v${i}`} x1={i * 25} x2={i * 25} y1="0" y2="500" />
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <line key={`h${i}`} x1="0" x2="640" y1={i * 25} y2={i * 25} />
      ))}
    </g>
  );
}
function PracticeGraph({
  model,
}: {
  model: ReturnType<typeof practiceCircleModel>;
}) {
  return (
    <svg viewBox="0 0 180 120">
      <circle cx="90" cy="60" r="48" fill="none" stroke="#60a5fa" />
      {Object.entries(model.points).map(([key, p], i) => {
        const q = { x: 90 + p.x * 14, y: 60 - p.y * 14 };
        return (
          <g key={key}>
            <circle
              cx={q.x}
              cy={q.y}
              r="5"
              fill={["#2563eb", "#8b5cf6", "#16a34a", "#f97316"][i]}
            />
            <text x={q.x + 6} y={q.y - 5} fontSize="8">
              {key.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
function circleModel(points: Record<Key, Point>) {
  const { a, b, c, d } = points,
    circle = fitCircle(a, b, c),
    distinct = minDistance([a, b, c, d]) > 1e-7,
    valid = Boolean(circle) && distinct,
    radialResidual = circle
      ? distance(d, circle.center) - circle.radius
      : Infinity,
    determinant = det4(
      [a, b, c, d].map((p) => [p.x * p.x + p.y * p.y, p.x, p.y, 1]),
    ),
    angleA = angle(d, a, b),
    angleB = angle(a, b, c),
    angleC = angle(b, c, d),
    angleD = angle(c, d, a),
    sumAC = angleA + angleC,
    sumBD = angleB + angleD,
    concyclic =
      valid &&
      Math.abs(radialResidual) < 1e-5 &&
      Math.abs(determinant) < 1e-5 &&
      near(sumAC, 180) &&
      near(sumBD, 180);
  return {
    points,
    circle,
    distinct,
    valid,
    radialResidual,
    determinant,
    angleA,
    angleB,
    angleC,
    angleD,
    sumAC,
    sumBD,
    concyclic,
  };
}
function fitCircle(a: Point, b: Point, c: Point) {
  const aa = a.x * a.x + a.y * a.y,
    bb = b.x * b.x + b.y * b.y,
    cc = c.x * c.x + c.y * c.y,
    d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null;
  const center = {
    x: (aa * (b.y - c.y) + bb * (c.y - a.y) + cc * (a.y - b.y)) / d,
    y: (aa * (c.x - b.x) + bb * (a.x - c.x) + cc * (b.x - a.x)) / d,
  };
  return { center, radius: distance(center, a) };
}
function det4(m: number[][]) {
  let total = 0;
  for (let col = 0; col < 4; col++) {
    const minor = m.slice(1).map((row) => row.filter((_, i) => i !== col));
    total += (col % 2 ? -1 : 1) * m[0][col] * det3(minor);
  }
  return total;
}
function det3(m: number[][]) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}
function angle(a: Point, b: Point, c: Point) {
  const u = { x: a.x - b.x, y: a.y - b.y },
    v = { x: c.x - b.x, y: c.y - b.y },
    den = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  if (den < 1e-9) return 0;
  return (
    (Math.acos(clamp((u.x * v.x + u.y * v.y) / den, -1, 1)) * 180) / Math.PI
  );
}
function practiceCircleModel(scale: number) {
  const r = 3,
    at = (deg: number, s = 1) => ({
      x: r * s * Math.cos((deg * Math.PI) / 180),
      y: r * s * Math.sin((deg * Math.PI) / 180),
    }),
    points = { a: at(160), b: at(70), c: at(-20), d: at(-110, scale) };
  return circleModel(points);
}
function minDistance(points: Point[]) {
  let min = Infinity;
  for (let i = 0; i < points.length; i++)
    for (let j = i + 1; j < points.length; j++)
      min = Math.min(min, distance(points[i], points[j]));
  return min;
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function near(a: number, b: number) {
  return Math.abs(a - b) < 0.01;
}
function point(p: Point) {
  return `(${fmt(p.x)}, ${fmt(p.y)})`;
}
function fmt(n: number) {
  return Number(n.toFixed(3)).toString();
}
function round(n: number) {
  return Math.round(n * 20) / 20;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}
