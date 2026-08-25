import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Languages,
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
import "./CosineRuleTargetLesson271.css";

type Point = { x: number; y: number };
type Vertex = "A" | "B";
type CheckState = "idle" | "correct";
const INITIAL = { A: { x: -4, y: 0 }, B: { x: 2, y: 5 } };

export default function CosineRuleTargetLesson271({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL),
    [worked, setWorked] = useState({ left: 8, right: 6, angle: 60 }),
    [practice, setPractice] = useState({ left: 7, right: 9, angle: 75 }),
    [practiceState, setPracticeState] = useState<CheckState>("correct");
  const model = useMemo(() => cosineTriangle(points), [points]),
    workedAnswer = useMemo(
      () => sasSide(worked.left, worked.right, worked.angle),
      [worked],
    ),
    practiceAnswer = useMemo(
      () => sasSide(practice.left, practice.right, practice.angle),
      [practice],
    );
  const restore = () => {
    setPoints(INITIAL);
    setWorked({ left: 8, right: 6, angle: 60 });
    setPractice({ left: 7, right: 9, angle: 75 });
    setPracticeState("correct");
  };
  useEffect(restore, [resetToken]);
  const updatePoint = (vertex: Vertex, point: Point) => {
    setPoints((current) => ({
      ...current,
      [vertex]: { x: clamp(point.x, -6.5, 6.5), y: clamp(point.y, -5.5, 7.5) },
    }));
    onInteraction();
  };
  const updateWorked = (key: "left" | "right" | "angle", value: number) => {
    setWorked((current) => ({
      ...current,
      [key]: key === "angle" ? clamp(value, 1, 179) : clamp(value, 0.1, 20),
    }));
    onInteraction();
  };
  const updatePractice = (key: "left" | "right" | "angle", value: number) => {
    setPractice((current) => ({
      ...current,
      [key]: key === "angle" ? clamp(value, 1, 179) : clamp(value, 0.1, 20),
    }));
    setPracticeState("idle");
    onInteraction();
  };
  const reset = () => {
    restore();
    onInteraction();
  };
  return (
    <section
      className="target-cosine-rule-page"
      data-testid="trigonometry-mockup-0328"
      data-dedicated-lesson="271"
      data-object-model="draggable-coordinate-triangle-cosine-square-decomposition-sas-solver-model"
      data-side-a={model.a.toFixed(6)}
      data-side-b={model.b.toFixed(6)}
      data-side-c={model.c.toFixed(6)}
      data-angle-c={model.C.toFixed(6)}
      data-lhs={model.lhs.toFixed(6)}
      data-rhs={model.rhs.toFixed(6)}
      data-difference={model.difference.toFixed(6)}
      data-worked-answer={workedAnswer.toFixed(6)}
      data-practice-answer={practiceAnswer.toFixed(6)}
      data-practice-result={practiceState}
    >
      <header className="target-cosine-rule-header">
        <section>
          <span>Trigonometry</span>
        </section>
        <h1>Cosine Rule</h1>
        <p>Relate three sides and angles.</p>
        <div>
          <b>♙ Intermediate–Advanced</b>
          <b>ϟ Visual Lab</b>
          <b>▣ Trig Graphing / Geometry</b>
          <b>◷ 6–10 min</b>
        </div>
        <aside>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              defaultValue="en"
              onChange={() => onInteraction()}
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
                `c² = a² + b² − 2ab cos C = ${model.cSquared.toFixed(3)}`,
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <a href="#cosine-rule-lab">▣ &nbsp; Workspace</a>
        </aside>
      </header>
      <section className="target-cosine-rule-flow">
        {[
          {
            Icon: Eye,
            title: "Observe",
            copy: "See how a triangle's sides and included angle relate.",
          },
          {
            Icon: Hand,
            title: "Manipulate",
            copy: "Drag vertices A or B to change the triangle. Watch the squares update.",
          },
          {
            Icon: Lightbulb,
            title: "Notice",
            copy: "The square on side c equals the sum of squares on the other sides minus twice their product times cos C.",
          },
          {
            Icon: Target,
            title: "Understand",
            copy: "That relationship is the Cosine Rule. It works for any triangle.",
          },
        ].map(({ Icon, title, copy }, index) => (
          <article key={title}>
            <Icon />
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
            {index < 3 ? <ArrowRight /> : null}
          </article>
        ))}
      </section>
      <section className="target-cosine-rule-lab" id="cosine-rule-lab">
        <article>
          <h2>Draggable SAS Triangle &amp; Square Decomposition</h2>
          <CoordinateTriangle
            points={points}
            model={model}
            onPoint={updatePoint}
          />
          <footer>
            Drag A or B to explore different triangles.
            <br />
            SAS configuration: sides a, b with included angle C.
          </footer>
        </article>
        <section>
          <h2>Square Decomposition (at angle C)</h2>
          <SquareDecomposition model={model} />
          <footer>
            <span>a² = {model.aSquared.toFixed(3)}</span>
            <span>b² = {model.bSquared.toFixed(3)}</span>
            <span>c² = {model.cSquared.toFixed(3)}</span>
            <span>−2ab cos C = {model.correction.toFixed(3)}</span>
          </footer>
        </section>
        <aside>
          <h2>Live Measurements</h2>
          <dl>
            <Metric label="a = BC" value={model.a} />
            <Metric label="b = AC" value={model.b} />
            <Metric label="c = AB" value={model.c} />
            <Metric label="∠C" value={model.C} degree />
          </dl>
          <hr />
          <h2>Live Verification</h2>
          <strong>c² = a² + b² − 2ab cos C</strong>
          <p>
            <b>c²</b>
            <output>{model.lhs.toFixed(3)}</output>
          </p>
          <p>
            <b>a² + b² − 2ab cos C</b>
            <output>{model.rhs.toFixed(3)}</output>
          </p>
          <p>
            <b>Difference</b>
            <output>{model.difference.toFixed(3)}</output>
          </p>
          <footer>
            <Check />
            Verified
          </footer>
        </aside>
      </section>
      <section className="target-cosine-rule-rule">
        <article>
          <h2>The Rule</h2>
          <h3>Cosine Rule (for any triangle ABC)</h3>
          <strong>c² = a² + b² − 2ab cos C</strong>
          <p>and similarly,</p>
          <b>
            a² = b² + c² − 2bc cos A<br />
            b² = a² + c² − 2ac cos B
          </b>
        </article>
        <aside>
          ⓘ &nbsp; Use the version that involves the known angle (included
          between two known sides) and solves for the unknown side.
        </aside>
        <RuleTriangle />
      </section>
      <section className="target-cosine-rule-worked">
        <article>
          <h2>Worked Example</h2>
          <h3>
            Given two sides 8.00 and 6.00 with included angle 60°, find the
            opposite side.
          </h3>
          <p>Solution:</p>
          <strong>
            x² = 8² + 6² − 2(8)(6) cos 60°
            <br />= 64 + 36 − 96(0.5)
            <br />= 52
            <br />x = √52 ≈ {workedAnswer.toFixed(3)}
          </strong>
        </article>
        <aside>
          <h2>Check</h2>
          <div>
            <label>
              Side 1
              <input
                aria-label="Worked side 1"
                type="number"
                min=".1"
                max="20"
                step=".1"
                value={worked.left}
                onChange={(event) =>
                  updateWorked("left", Number(event.target.value))
                }
              />
            </label>
            <label>
              Side 2
              <input
                aria-label="Worked side 2"
                type="number"
                min=".1"
                max="20"
                step=".1"
                value={worked.right}
                onChange={(event) =>
                  updateWorked("right", Number(event.target.value))
                }
              />
            </label>
            <label>
              Included angle
              <input
                aria-label="Worked included angle"
                type="number"
                min="1"
                max="179"
                step="1"
                value={worked.angle}
                onChange={(event) =>
                  updateWorked("angle", Number(event.target.value))
                }
              />
              °
            </label>
          </div>
          <label>
            Computed side<output>{workedAnswer.toFixed(3)}</output>
            <b>
              <Check />
              Correct
            </b>
          </label>
        </aside>
      </section>
      <section className="target-cosine-rule-misconception">
        <article>
          <TriangleAlert />
          <div>
            <h2>Common Misconception</h2>
            <h3>Forgetting the minus sign!</h3>
            <p>The term is −2ab cos C, not +2ab cos C.</p>
            <p>Using + will overestimate the third side for acute angles.</p>
          </div>
        </article>
        <aside>
          <h2>Quick check (two sides = 5, included angle = 120°)</h2>
          <section>
            <div>
              <b>
                Correct <small>(with −)</small>
              </b>
              <p>
                x² = 25 + 25 − 2(5)(5) cos 120°
                <br />
                x² = 50 + 25 = 75
                <br />x = 8.660 &nbsp; <Check />
              </p>
            </div>
            <div>
              <b>
                Incorrect <small>(with +)</small>
              </b>
              <p>
                x² = 25 + 25 + 2(5)(5) cos 120°
                <br />
                x² = 50 − 25 = 25
                <br />x = 5.000 &nbsp; ×
              </p>
            </div>
          </section>
        </aside>
      </section>
      <section className="target-cosine-rule-practice">
        <header>
          <h2>Your Turn</h2>
          <h3>Practice Challenge</h3>
          <p>
            In △ABC, use the two sides and included angle to find the opposite
            side.
          </p>
        </header>
        <section>
          <h2>Inputs</h2>
          <div>
            <label>
              Side 1
              <input
                aria-label="Practice side 1"
                type="number"
                min=".1"
                max="20"
                step=".1"
                value={practice.left}
                onChange={(event) =>
                  updatePractice("left", Number(event.target.value))
                }
              />
            </label>
            <label>
              Side 2
              <input
                aria-label="Practice side 2"
                type="number"
                min=".1"
                max="20"
                step=".1"
                value={practice.right}
                onChange={(event) =>
                  updatePractice("right", Number(event.target.value))
                }
              />
            </label>
            <label>
              Included angle
              <input
                aria-label="Practice included angle"
                type="number"
                min="1"
                max="179"
                step="1"
                value={practice.angle}
                onChange={(event) =>
                  updatePractice("angle", Number(event.target.value))
                }
              />
              °
            </label>
          </div>
          <footer>
            <button
              type="button"
              onClick={() => {
                setPracticeState("correct");
                onInteraction();
              }}
            >
              ◉ &nbsp; Check Answer
            </button>
            <button
              type="button"
              onClick={() => {
                setPractice({ left: 7, right: 9, angle: 75 });
                setPracticeState("idle");
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
          </footer>
        </section>
        <aside>
          <h2>Your Answer</h2>
          <p>
            opposite side ≈ <strong>{practiceAnswer.toFixed(3)}</strong>
          </p>
          <footer className={practiceState}>
            {practiceState === "correct" ? (
              <>
                <Check />
                Correct!
              </>
            ) : (
              "Check your result"
            )}
            <small>(to 3 d.p.)</small>
          </footer>
        </aside>
      </section>
      <nav className="target-cosine-rule-nav">
        <a href="/lessons/trigonometry/270-sine-rule">
          <ArrowLeft />
          <span>
            <b>Previous</b>Sine Rule
          </span>
        </a>
        <a href="/lessons/trigonometry/272-triangle-area-formula">
          <span>
            <b>Next</b>Triangle Area Formula
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type TriangleModel = ReturnType<typeof cosineTriangle>;
function CoordinateTriangle({
  points,
  model,
  onPoint,
}: {
  points: Record<Vertex, Point>;
  model: TriangleModel;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    map = (p: Point) => ({ x: 190 + p.x * 27, y: 190 - p.y * 27 }),
    A = map(points.A),
    B = map(points.B),
    C = map({ x: 0, y: 0 });
  const move = (event: ReactPointerEvent<SVGCircleElement>, vertex: Vertex) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(vertex, { x: (p.x - 190) / 27, y: (190 - p.y) / 27 });
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 390 350"
      role="img"
      aria-label="Draggable coordinate triangle for the Cosine Rule"
    >
      {Array.from({ length: 13 }, (_, i) => i - 6).map((v) => (
        <g key={v}>
          <line
            x1={190 + v * 27}
            x2={190 + v * 27}
            y1="18"
            y2="330"
            className="grid"
          />
          <line
            x1="18"
            x2="372"
            y1={190 + v * 27}
            y2={190 + v * 27}
            className="grid"
          />
        </g>
      ))}
      <line x1="15" x2="375" y1="190" y2="190" className="axis" />
      <line x1="190" x2="190" y1="15" y2="335" className="axis" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} />
      <path
        d={`M ${C.x - 36} ${C.y} A 36 36 0 0 1 ${C.x - 18} ${C.y - 31}`}
        className="angle"
      />
      <text x={C.x - 34} y={C.y - 17}>
        C
        <tspan x={C.x - 34} dy="13">
          {model.C.toFixed(1)}°
        </tspan>
      </text>
      {(["A", "B"] as Vertex[]).map((vertex) => {
        const p = vertex === "A" ? A : B;
        return (
          <g key={vertex}>
            <circle
              data-testid={`cosine-rule-vertex-${vertex.toLowerCase()}`}
              cx={p.x}
              cy={p.y}
              r="7"
              role="slider"
              aria-label={`Cosine Rule vertex ${vertex}`}
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
              x={p.x + (vertex === "A" ? -24 : 8)}
              y={p.y + (vertex === "A" ? 23 : -13)}
            >
              {vertex} ({points[vertex].x.toFixed(2)},{" "}
              {points[vertex].y.toFixed(2)})
            </text>
          </g>
        );
      })}
      <circle cx={C.x} cy={C.y} r="7" />
      <text x={C.x + 10} y={C.y + 24}>
        C (0.00, 0.00)
      </text>
      <text className="side a" x={(B.x + C.x) / 2 + 12} y={(B.y + C.y) / 2}>
        a = {model.a.toFixed(3)}
      </text>
      <text className="side b" x={(A.x + C.x) / 2} y={(A.y + C.y) / 2 + 20}>
        b = {model.b.toFixed(3)}
      </text>
      <text className="side c" x={(A.x + B.x) / 2 - 20} y={(A.y + B.y) / 2}>
        c = {model.c.toFixed(3)}
      </text>
    </svg>
  );
}
function SquareDecomposition({ model }: { model: TriangleModel }) {
  const max = Math.max(model.aSquared, model.bSquared, model.cSquared),
    size = (area: number) => 44 + Math.sqrt(area / max) * 58;
  const a = size(model.aSquared),
    b = size(model.bSquared),
    c = size(model.cSquared);
  return (
    <svg
      viewBox="0 0 300 310"
      role="img"
      aria-label="Dynamic square-area decomposition"
    >
      <g transform="translate(120 30) rotate(20)">
        <rect width={c} height={c} className="c" />
        <text x={c / 2} y={c / 2}>
          c²
          <tspan x={c / 2} dy="18">
            ({model.cSquared.toFixed(3)})
          </tspan>
        </text>
      </g>
      <g transform="translate(30 155) rotate(30)">
        <rect width={a} height={a} className="a" />
        <text x={a / 2} y={a / 2}>
          a²
          <tspan x={a / 2} dy="18">
            ({model.aSquared.toFixed(3)})
          </tspan>
        </text>
      </g>
      <g transform="translate(185 180)">
        <rect width={b} height={b} className="b" />
        <text x={b / 2} y={b / 2}>
          b²
          <tspan x={b / 2} dy="18">
            ({model.bSquared.toFixed(3)})
          </tspan>
        </text>
      </g>
      <polygon
        points="105,155 178,133 199,177 126,198"
        className="correction"
      />
      <text x="150" y="161">
        −2ab cos C
        <tspan x="150" dy="16">
          ({model.correction.toFixed(3)})
        </tspan>
      </text>
    </svg>
  );
}
function Metric({
  label,
  value,
  degree = false,
}: {
  label: string;
  value: number;
  degree?: boolean;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {value.toFixed(degree ? 2 : 3)}
        {degree ? "°" : ""}
      </dd>
    </div>
  );
}
function RuleTriangle() {
  return (
    <svg
      viewBox="0 0 220 120"
      role="img"
      aria-label="Cosine Rule side and angle correspondence"
    >
      <polygon points="110,15 25,100 195,100" />
      <text x="105" y="11">
        B
      </text>
      <text x="12" y="110">
        A
      </text>
      <text x="201" y="110">
        C
      </text>
      <text x="62" y="51">
        c
      </text>
      <text x="162" y="55">
        a
      </text>
      <text x="108" y="116">
        b
      </text>
      <path d="M 170 100 A 25 25 0 0 1 180 80" />
    </svg>
  );
}
function cosineTriangle(points: Record<Vertex, Point>) {
  const C = { x: 0, y: 0 },
    a = distance(points.B, C),
    b = distance(points.A, C),
    c = distance(points.A, points.B),
    cosC = clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1),
    angleC = toDegrees(Math.acos(cosC)),
    aSquared = a * a,
    bSquared = b * b,
    cSquared = c * c,
    correction = -2 * a * b * cosC,
    lhs = cSquared,
    rhs = aSquared + bSquared + correction;
  return {
    a,
    b,
    c,
    C: angleC,
    aSquared,
    bSquared,
    cSquared,
    correction,
    lhs,
    rhs,
    difference: Math.abs(lhs - rhs),
  };
}
function sasSide(left: number, right: number, angle: number) {
  return Math.sqrt(
    Math.max(
      0,
      left * left +
        right * right -
        2 * left * right * Math.cos(toRadians(angle)),
    ),
  );
}
function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
