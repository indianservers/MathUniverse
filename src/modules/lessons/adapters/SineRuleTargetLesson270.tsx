import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Hand,
  Languages,
  Lightbulb,
  Move,
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
import "./SineRuleTargetLesson270.css";

type Point = { x: number; y: number };
type Vertex = "A" | "B" | "C";
type PracticeResult = "idle" | "correct" | "incorrect";
type SsaCase = "none" | "one" | "two";

const SCALE = 330 / 7.84;
const INITIAL_POINTS: Record<Vertex, Point> = {
  A: { x: 212.45, y: 34.65 },
  B: { x: 55, y: 231 },
  C: { x: 385, y: 231 },
};

export default function SineRuleTargetLesson270({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [ssaB, setSsaB] = useState(8);
  const [ssaC, setSsaC] = useState(6);
  const [ssaAngle, setSsaAngle] = useState(30);
  const [practice, setPractice] = useState({ B: "", C: "", c: "" });
  const [practiceResult, setPracticeResult] = useState<PracticeResult>("idle");
  const [hintOpen, setHintOpen] = useState(false);
  const model = useMemo(() => triangleModel(points), [points]);
  const ssa = useMemo(
    () => ssaModel(ssaB, ssaC, ssaAngle),
    [ssaB, ssaC, ssaAngle],
  );
  const expectedPractice = useMemo(() => solveSasPractice(), []);

  const restore = () => {
    setPoints(INITIAL_POINTS);
    setSsaB(8);
    setSsaC(6);
    setSsaAngle(30);
    setPractice({ B: "", C: "", c: "" });
    setPracticeResult("idle");
    setHintOpen(false);
  };
  useEffect(restore, [resetToken]);
  const updatePoint = (vertex: Vertex, point: Point) => {
    setPoints((current) => ({
      ...current,
      [vertex]: { x: clamp(point.x, 18, 422), y: clamp(point.y, 20, 258) },
    }));
    onInteraction();
  };
  const reset = () => {
    restore();
    onInteraction();
  };
  const updateSsa = (key: "b" | "c" | "angle", value: number) => {
    if (key === "b") setSsaB(clamp(value, 0.5, 15));
    if (key === "c") setSsaC(clamp(value, 0.1, 15));
    if (key === "angle") setSsaAngle(clamp(value, 5, 85));
    onInteraction();
  };
  const grade = () => {
    const values = {
      B: Number(practice.B),
      C: Number(practice.C),
      c: Number(practice.c),
    };
    const correct =
      Number.isFinite(values.B) &&
      Math.abs(values.B - expectedPractice.B) <= 0.2 &&
      Math.abs(values.C - expectedPractice.C) <= 0.2 &&
      Math.abs(values.c - expectedPractice.c) <= 0.2;
    setPracticeResult(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      className="target-sine-rule-page"
      data-testid="trigonometry-mockup-0327"
      data-dedicated-lesson="270"
      data-object-model="draggable-triangle-opposite-side-angle-sine-ratio-ssa-ambiguity-model"
      data-side-a={model.a.toFixed(6)}
      data-side-b={model.b.toFixed(6)}
      data-side-c={model.c.toFixed(6)}
      data-angle-a={model.A.toFixed(6)}
      data-angle-b={model.B.toFixed(6)}
      data-angle-c={model.C.toFixed(6)}
      data-ratio-a={model.ratioA.toFixed(6)}
      data-ratio-b={model.ratioB.toFixed(6)}
      data-ratio-c={model.ratioC.toFixed(6)}
      data-ssa-case={ssa.kind}
      data-ssa-count={ssa.solutions.length}
      data-practice-result={practiceResult}
    >
      <header className="target-sine-rule-header">
        <section>
          <span>Trigonometry</span>
          <span>Trigonometry</span>
        </section>
        <h1>Sine Rule</h1>
        <p>Solve oblique triangles.</p>
        <div>
          <b>♙ Intermediate–Advanced</b>
          <b>ϟ Visual Lab</b>
          <b>▣ Trig Graphing / Geometry</b>
          <b>◷ 6–10 min</b>
        </div>
        <footer>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              defaultValue="en"
              onChange={onInteraction}
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </label>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `a/sin A = b/sin B = c/sin C = ${model.common.toFixed(3)}`,
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <a href="#sine-rule-model">▣ &nbsp; Workspace</a>
        </footer>
      </header>

      <section className="target-sine-rule-flow">
        {[
          [Eye, "Observe", "See how the triangle changes the ratios."],
          [Hand, "Manipulate", "Drag vertices or change a value to explore."],
          [Lightbulb, "Notice", "Look for patterns in the sine ratios."],
          [Target, "Understand", "Apply the Sine Rule with confidence."],
        ].map(([Icon, title, copy], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
            {index < 3 ? <ArrowRight /> : null}
          </article>
        ))}
      </section>

      <section className="target-sine-rule-model" id="sine-rule-model">
        <header>
          <h2>Explore the model</h2>
          <p>Drag the triangle to explore the Sine Rule.</p>
        </header>
        <div>
          <article>
            <button
              type="button"
              onClick={() => {
                setPoints(INITIAL_POINTS);
                onInteraction();
              }}
            >
              <Move />
              Drag vertices
            </button>
            <TriangleCanvas
              points={points}
              model={model}
              onPoint={updatePoint}
            />
          </article>
          <section>
            <h2>Live measurements</h2>
            <dl>
              <Measure label="a = BC" value={model.a.toFixed(2)} />
              <Measure label="b = AC" value={model.b.toFixed(2)} />
              <Measure label="c = AB" value={model.c.toFixed(2)} />
              <Measure label="A" value={`${model.A.toFixed(1)}°`} />
              <Measure label="B" value={`${model.B.toFixed(1)}°`} />
              <Measure label="C" value={`${model.C.toFixed(1)}°`} />
            </dl>
          </section>
          <aside>
            <h2>Sine ratios</h2>
            <dl>
              <Ratio label="a / sin A" value={model.ratioA} />
              <Ratio label="b / sin B" value={model.ratioB} />
              <Ratio label="c / sin C" value={model.ratioC} />
            </dl>
            <footer>
              <b>Common value (k)</b>
              <strong>≈ {model.common.toFixed(3)}</strong>
              <p>
                <CheckCircle2 />
                Ratios match!
              </p>
            </footer>
          </aside>
        </div>
        <footer>
          ● &nbsp; Angles sum to 180° and the sine ratios are equal (within
          rounding).
        </footer>
      </section>

      <section className="target-sine-rule-concepts">
        <aside>
          <article>
            <h2>The Sine Rule</h2>
            <p>In any triangle ABC:</p>
            <strong>
              <Fraction top="a" bottom="sin A" /> ={" "}
              <Fraction top="b" bottom="sin B" /> ={" "}
              <Fraction top="c" bottom="sin C" /> = 2R
            </strong>
            <p>where R is the circumradius.</p>
          </article>
          <article>
            <h2>
              <TriangleAlert />
              Common Misconception
            </h2>
            <h3>SSA is ambiguous.</h3>
            <p>
              When you know two sides and a non-included angle, there can be 0,
              1 or 2 possible triangles. Always check all possibilities.
            </p>
          </article>
        </aside>
        <section>
          <header>
            <h2>SSA Ambiguous Case Explorer</h2>
            <div>
              <label>
                Given: &nbsp; b ={" "}
                <input
                  aria-label="SSA side b"
                  type="number"
                  min=".5"
                  max="15"
                  step=".1"
                  value={ssaB}
                  onChange={(event) =>
                    updateSsa("b", Number(event.target.value))
                  }
                />
              </label>
              <label>
                c ={" "}
                <input
                  aria-label="SSA side c"
                  type="number"
                  min=".1"
                  max="15"
                  step=".1"
                  value={ssaC}
                  onChange={(event) =>
                    updateSsa("c", Number(event.target.value))
                  }
                />
              </label>
              <label>
                Angle A ={" "}
                <input
                  aria-label="SSA angle A"
                  type="number"
                  min="5"
                  max="85"
                  step="1"
                  value={ssaAngle}
                  onChange={(event) =>
                    updateSsa("angle", Number(event.target.value))
                  }
                />
                °
              </label>
            </div>
          </header>
          <div className="target-sine-rule-cases">
            <SsaCard kind="none" active={ssa.kind === "none"} model={ssa} />
            <SsaCard kind="one" active={ssa.kind === "one"} model={ssa} />
            <SsaCard kind="two" active={ssa.kind === "two"} model={ssa} />
          </div>
          <footer>
            <label>
              Adjust c{" "}
              <input
                aria-label="SSA side c slider"
                type="range"
                min=".1"
                max="12"
                step=".1"
                value={ssaC}
                onChange={(event) => updateSsa("c", Number(event.target.value))}
              />
              <output>{ssaC.toFixed(1)}</output>
            </label>
            <p>
              Move c to see 0, 1 or 2 possible triangles. Current:{" "}
              <b>
                {ssa.solutions.length} solution
                {ssa.solutions.length === 1 ? "" : "s"}
              </b>
              .
            </p>
          </footer>
        </section>
      </section>

      <section className="target-sine-rule-worked">
        <article>
          <h2>Worked Example (One Solution)</h2>
          <p>Solve triangle ABC where a = 10, b = 7, A = 45°.</p>
          <ol>
            <li>
              Use the Sine Rule to find B:
              <strong>
                sin B = b sin A / a = 7 sin 45° / 10 = 0.49497
                <br />B = 29.7° &nbsp; or &nbsp; 180° − 29.7° = 150.3°
              </strong>
            </li>
            <li>Take the acute angle for a valid triangle: B ≈ 29.7°</li>
            <li>Find C: C = 180° − 45° − 29.7° = 105.3°</li>
            <li>
              Find c: c = a sin C / sin A = 10 sin 105.3° / sin 45° = 13.64
            </li>
          </ol>
          <footer>Answer: B ≈ 29.7°, C ≈ 105.3°, c ≈ 13.64</footer>
        </article>
        <aside>
          <b>
            <Check />
            Verified
          </b>
          <WorkedTriangle />
        </aside>
      </section>

      <section className="target-sine-rule-practice">
        <header>
          <h2>Try It Yourself</h2>
          <p>
            Given: a = 12, b = 8, A = 40°. Find B, C and c. (Round to 1 decimal
            place)
          </p>
        </header>
        <div>
          <label>
            B ={" "}
            <input
              aria-label="Practice angle B"
              value={practice.B}
              onChange={(event) => {
                setPractice((v) => ({ ...v, B: event.target.value }));
                setPracticeResult("idle");
                onInteraction();
              }}
            />
            °
          </label>
          <label>
            C ={" "}
            <input
              aria-label="Practice angle C"
              value={practice.C}
              onChange={(event) => {
                setPractice((v) => ({ ...v, C: event.target.value }));
                setPracticeResult("idle");
                onInteraction();
              }}
            />
            °
          </label>
          <label>
            c ={" "}
            <input
              aria-label="Practice side c"
              value={practice.c}
              onChange={(event) => {
                setPractice((v) => ({ ...v, c: event.target.value }));
                setPracticeResult("idle");
                onInteraction();
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setHintOpen((v) => !v);
              onInteraction();
            }}
          >
            Hint: Use the Sine Rule
          </button>
          <button type="button" onClick={grade}>
            Check Answer
          </button>
        </div>
        <footer>
          <b>Feedback</b>
          {practiceResult === "idle"
            ? "Your answer and explanation will appear here."
            : practiceResult === "correct"
              ? "Correct. All three values satisfy the triangle and Sine Rule."
              : "Check the opposite pairs and keep the valid angle in the triangle."}
        </footer>
        <aside>
          ⌕ &nbsp; Your working space
          {hintOpen ? (
            <p>
              First calculate B = sin⁻¹(8 sin 40° / 12), then C = 180° − A − B.
            </p>
          ) : null}
        </aside>
      </section>

      <nav className="target-sine-rule-nav">
        <a href="/lessons/trigonometry/269-trig-equations">
          <ArrowLeft />
          <span>
            <b>Previous</b>Trig Equations
          </span>
        </a>
        <a href="/lessons/trigonometry/271-cosine-rule">
          <span>
            <b>Next</b>Cosine Rule
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type TriangleModel = ReturnType<typeof triangleModel>;
type SsaModel = ReturnType<typeof ssaModel>;
function TriangleCanvas({
  points,
  model,
  onPoint,
}: {
  points: Record<Vertex, Point>;
  model: TriangleModel;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const move = (event: ReactPointerEvent<SVGCircleElement>, vertex: Vertex) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(vertex, p);
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 440 270"
      role="img"
      aria-label="Draggable Sine Rule triangle"
    >
      <polygon
        points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`}
      />
      <AngleArc
        point={points.A}
        from={points.B}
        to={points.C}
        color="#11abc6"
      />
      <AngleArc
        point={points.B}
        from={points.C}
        to={points.A}
        color="#45cbb5"
      />
      <AngleArc
        point={points.C}
        from={points.A}
        to={points.B}
        color="#9b66ee"
      />
      {(["A", "B", "C"] as Vertex[]).map((vertex) => (
        <g key={vertex}>
          <circle
            data-testid={`sine-rule-vertex-${vertex.toLowerCase()}`}
            cx={points[vertex].x}
            cy={points[vertex].y}
            r="8"
            role="slider"
            aria-label={`Triangle vertex ${vertex}`}
            tabIndex={0}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              move(event, vertex);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) move(event, vertex);
            }}
          />
          <text
            x={
              points[vertex].x +
              (vertex === "B" ? -18 : vertex === "C" ? 10 : -5)
            }
            y={points[vertex].y + (vertex === "A" ? -12 : 20)}
          >
            {vertex}
          </text>
        </g>
      ))}
      <text
        className="side a"
        x={(points.B.x + points.C.x) / 2}
        y={(points.B.y + points.C.y) / 2 + 25}
      >
        a
      </text>
      <text
        className="side b"
        x={(points.A.x + points.C.x) / 2 + 12}
        y={(points.A.y + points.C.y) / 2}
      >
        b
      </text>
      <text
        className="side c"
        x={(points.A.x + points.B.x) / 2 - 20}
        y={(points.A.y + points.B.y) / 2}
      >
        c
      </text>
      <text className="angle" x={points.A.x - 12} y={points.A.y + 46}>
        A
        <tspan x={points.A.x - 16} dy="18">
          {model.A.toFixed(1)}°
        </tspan>
      </text>
      <text className="angle" x={points.B.x + 28} y={points.B.y - 38}>
        B
        <tspan x={points.B.x + 20} dy="18">
          {model.B.toFixed(1)}°
        </tspan>
      </text>
      <text className="angle" x={points.C.x - 70} y={points.C.y - 38}>
        C
        <tspan x={points.C.x - 78} dy="18">
          {model.C.toFixed(1)}°
        </tspan>
      </text>
    </svg>
  );
}
function AngleArc({
  point,
  from,
  to,
  color,
}: {
  point: Point;
  from: Point;
  to: Point;
  color: string;
}) {
  const a = Math.atan2(from.y - point.y, from.x - point.x),
    b = Math.atan2(to.y - point.y, to.x - point.x),
    r = 35,
    start = { x: point.x + r * Math.cos(a), y: point.y + r * Math.sin(a) },
    end = { x: point.x + r * Math.cos(b), y: point.y + r * Math.sin(b) },
    delta = (((b - a) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI),
    sweep = delta > Math.PI ? 0 : 1;
  return (
    <path
      d={`M ${point.x} ${point.y} L ${start.x} ${start.y} A ${r} ${r} 0 0 ${sweep} ${end.x} ${end.y} Z`}
      fill={color}
      opacity=".45"
    />
  );
}
function Measure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
function Ratio({ label, value }: { label: string; value: number }) {
  const [top, bottom] = label.split(" / ");
  return (
    <div>
      <dt>
        <Fraction top={top} bottom={bottom} />
      </dt>
      <dd>{value.toFixed(3)}</dd>
    </div>
  );
}
function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="target-sine-rule-fraction">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}
function SsaCard({
  kind,
  active,
  model,
}: {
  kind: SsaCase;
  active: boolean;
  model: SsaModel;
}) {
  const labels = {
      none: "No Triangle",
      one: "One Triangle",
      two: "Two Triangles",
    },
    copies = {
      none: "The opposite side is below the altitude.",
      one: "The measurements determine one triangle.",
      two: "Two valid angles satisfy the data.",
    };
  return (
    <article className={`${kind} ${active ? "active" : ""}`}>
      <h3>{labels[kind]}</h3>
      <p>
        {kind === "none"
          ? `c < h = ${model.altitude.toFixed(2)}`
          : kind === "one"
            ? `c = h or c ≥ b`
            : `h < c < b`}
      </p>
      <strong>
        {active
          ? `${model.solutions.length} solution${model.solutions.length === 1 ? "" : "s"}.`
          : copies[kind]}
      </strong>
      <SsaSketch kind={kind} />
    </article>
  );
}
function SsaSketch({ kind }: { kind: SsaCase }) {
  if (kind === "none") {
    return (
      <svg viewBox="0 0 150 85" aria-hidden="true">
        <line x1="15" x2="135" y1="70" y2="70" />
        <line x1="15" x2="70" y1="70" y2="24" />
        <line className="dashed" x1="70" x2="70" y1="24" y2="70" />
        <circle cx="15" cy="70" r="4" />
        <circle cx="70" cy="70" r="4" />
        <circle cx="135" cy="70" r="4" />
        <circle cx="70" cy="24" r="4" />
      </svg>
    );
  }
  if (kind === "one") {
    return (
      <svg viewBox="0 0 150 85" aria-hidden="true">
        <line x1="15" x2="135" y1="70" y2="70" />
        <line x1="15" x2="78" y1="70" y2="18" />
        <line x1="78" x2="135" y1="18" y2="70" />
        <circle cx="15" cy="70" r="4" />
        <circle cx="78" cy="18" r="4" />
        <circle cx="135" cy="70" r="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 150 85" aria-hidden="true">
      <line x1="7" x2="143" y1="70" y2="70" />
      <line x1="7" x2="43" y1="70" y2="22" />
      <line x1="43" x2="75" y1="22" y2="70" />
      <line x1="75" x2="109" y1="70" y2="22" />
      <line x1="109" x2="143" y1="22" y2="70" />
      {[7, 43, 75, 109, 143].map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy={index === 1 || index === 3 ? 22 : 70}
          r="4"
        />
      ))}
    </svg>
  );
}
function WorkedTriangle() {
  return (
    <svg
      viewBox="0 0 390 190"
      role="img"
      aria-label="Solved Sine Rule triangle"
    >
      <polygon points="190,25 30,165 360,165" />
      <circle cx="190" cy="25" r="5" />
      <circle cx="30" cy="165" r="5" />
      <circle cx="360" cy="165" r="5" />
      <text x="185" y="18">
        A
      </text>
      <text x="12" y="181">
        B
      </text>
      <text x="367" y="181">
        C
      </text>
      <text x="180" y="62">
        45°
      </text>
      <text x="75" y="154">
        29.7°
      </text>
      <text x="286" y="154">
        105.3°
      </text>
      <text x="172" y="185">
        a = 10
      </text>
      <text className="cyan" x="62" y="90">
        c = 13.64
      </text>
      <text className="violet" x="298" y="95">
        b = 7
      </text>
    </svg>
  );
}
function triangleModel(points: Record<Vertex, Point>) {
  const a = distance(points.B, points.C) / SCALE,
    b = distance(points.A, points.C) / SCALE,
    c = distance(points.A, points.B) / SCALE,
    A = angleFromSides(a, b, c),
    B = angleFromSides(b, c, a),
    C = 180 - A - B,
    ratioA = a / Math.sin(toRadians(A)),
    ratioB = b / Math.sin(toRadians(B)),
    ratioC = c / Math.sin(toRadians(C));
  return {
    a,
    b,
    c,
    A,
    B,
    C,
    ratioA,
    ratioB,
    ratioC,
    common: (ratioA + ratioB + ratioC) / 3,
  };
}
function ssaModel(b: number, c: number, A: number) {
  const altitude = b * Math.sin(toRadians(A));
  const ratio = (b * Math.sin(toRadians(A))) / c;
  const solutions: number[] = [];
  if (Math.abs(ratio - 1) <= 1e-8) {
    if (A + 90 < 180 - 1e-8) solutions.push(90);
  } else if (ratio < 1) {
    const B1 = toDegrees(Math.asin(clamp(ratio, -1, 1))),
      B2 = 180 - B1;
    for (const B of [B1, B2])
      if (A + B < 180 - 1e-8 && !solutions.some((v) => Math.abs(v - B) < 1e-7))
        solutions.push(B);
  }
  const kind: SsaCase =
    solutions.length === 0 ? "none" : solutions.length === 1 ? "one" : "two";
  return { altitude, solutions, kind };
}
function solveSasPractice() {
  const A = 40,
    a = 12,
    b = 8,
    B = toDegrees(Math.asin((b * Math.sin(toRadians(A))) / a)),
    C = 180 - A - B,
    c = (a * Math.sin(toRadians(C))) / Math.sin(toRadians(A));
  return { B, C, c };
}
function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function angleFromSides(opposite: number, left: number, right: number) {
  return toDegrees(
    Math.acos(
      clamp(
        (left * left + right * right - opposite * opposite) /
          (2 * left * right),
        -1,
        1,
      ),
    ),
  );
}
function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
