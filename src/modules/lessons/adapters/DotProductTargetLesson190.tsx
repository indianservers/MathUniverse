import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Lightbulb,
  Lock,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DotProductTargetLesson190.css";

type Point = { x: number; y: number };
type Drag = "u" | "v";
const INITIAL_U = { x: 3, y: 2 },
  INITIAL_V = { x: -1, y: 3 },
  PRACTICE_U = { x: 2, y: -1 },
  PRACTICE_V = { x: 1, y: 2 };
const clamp = (n: number) => Math.max(-5, Math.min(5, n)),
  dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y,
  mag = (p: Point) => Math.hypot(p.x, p.y),
  scale = (p: Point, k: number) => ({ x: p.x * k, y: p.y * k });
const angle = (a: Point, b: Point) =>
  (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (mag(a) * mag(b) || 1)))) *
    180) /
  Math.PI;
const projection = (source: Point, onto: Point) =>
  scale(onto, dot(source, onto) / (dot(onto, onto) || 1));

function DotGraph({
  u,
  v,
  snap,
  lockAxes,
  onPoint,
}: {
  u: Point;
  v: Point;
  snap: boolean;
  lockAxes: boolean;
  onPoint: (key: Drag, p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Drag | null>(null),
    unit = 46,
    sx = (x: number) => 315 + x * unit,
    sy = (y: number) => 265 - y * unit,
    foot = projection(v, u),
    toPoint = (event: PointerEvent<SVGSVGElement>) => {
      const r = ref.current!.getBoundingClientRect(),
        step = snap ? 1 : 0.5;
      let p = {
        x: clamp(
          Math.round(
            (((event.clientX - r.left) / r.width) * 630 - 315) / unit / step,
          ) * step,
        ),
        y: clamp(
          Math.round(
            (265 - ((event.clientY - r.top) / r.height) * 530) / unit / step,
          ) * step,
        ),
      };
      if (lockAxes)
        p =
          Math.abs(p.x) >= Math.abs(p.y) ? { x: p.x, y: 0 } : { x: 0, y: p.y };
      return p;
    },
    key = (which: Drag) => (event: KeyboardEvent<SVGCircleElement>) => {
      const moves: Record<string, Point> = {
          ArrowLeft: { x: -1, y: 0 },
          ArrowRight: { x: 1, y: 0 },
          ArrowUp: { x: 0, y: 1 },
          ArrowDown: { x: 0, y: -1 },
        },
        move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      const p = which === "u" ? u : v;
      onPoint(which, { x: clamp(p.x + move.x), y: clamp(p.y + move.y) });
    };
  return (
    <svg
      ref={ref}
      className="dp190-graph"
      viewBox="0 0 630 530"
      preserveAspectRatio="none"
      aria-label="Dot product vector plane"
      onPointerMove={(event) =>
        drag.current && onPoint(drag.current, toPoint(event))
      }
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern
          id="dp190Grid"
          width={unit}
          height={unit}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#dce7ef" />
        </pattern>
        {[
          ["u", "#078fac"],
          ["v", "#7c3aed"],
        ].map(([id, color]) => (
          <marker
            key={id}
            id={`dp190-${id}`}
            markerWidth="9"
            markerHeight="9"
            refX="8"
            refY="4.5"
            orient="auto"
          >
            <path d="M0 0L9 4.5L0 9Z" fill={color} />
          </marker>
        ))}
      </defs>
      <rect width="630" height="530" fill="url(#dp190Grid)" />
      <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="530" className="axis" />
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((value) => (
        <g key={value}>
          <text x={sx(value) - 6} y={sy(0) + 20}>
            {value}
          </text>
          <text x={sx(0) - 23} y={sy(value) + 4}>
            {value}
          </text>
        </g>
      ))}
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(u.x)}
        y2={sy(u.y)}
        className="u"
        markerEnd="url(#dp190-u)"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(v.x)}
        y2={sy(v.y)}
        className="v"
        markerEnd="url(#dp190-v)"
      />
      <line
        x1={sx(v.x)}
        y1={sy(v.y)}
        x2={sx(foot.x)}
        y2={sy(foot.y)}
        className="projection"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(foot.x)}
        y2={sy(foot.y)}
        className="projection-on-u"
      />
      <circle
        data-testid="dot-u-tip"
        role="slider"
        aria-label="Vector u tip"
        tabIndex={0}
        cx={sx(u.x)}
        cy={sy(u.y)}
        r="10"
        className="u-tip"
        onPointerDown={(event) => {
          drag.current = "u";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("u")}
      />
      <circle
        data-testid="dot-v-tip"
        role="slider"
        aria-label="Vector v tip"
        tabIndex={0}
        cx={sx(v.x)}
        cy={sy(v.y)}
        r="10"
        className="v-tip"
        onPointerDown={(event) => {
          drag.current = "v";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("v")}
      />
      <text x={sx(u.x) + 14} y={sy(u.y) - 10} className="u-label">
        u = ({u.x}, {u.y})
      </text>
      <text x={sx(v.x) - 108} y={sy(v.y) - 10} className="v-label">
        v = ({v.x}, {v.y})
      </text>
      <text
        x={sx(foot.x) + 10}
        y={sy(foot.y) - 15}
        className="projection-label"
      >
        projᵤ v
      </text>
      <text x={sx(0) + 35} y={sy(0) - 18} className="angle-label">
        θ = {angle(u, v).toFixed(2)}°
      </text>
    </svg>
  );
}

function VectorControl({
  name,
  value,
  color,
  onValue,
}: {
  name: "u" | "v";
  value: Point;
  color: string;
  onValue: (p: Point) => void;
}) {
  return (
    <article
      className="dp190-vector-control"
      style={{ "--tone": color } as CSSProperties}
    >
      <h3>● Vector {name}</h3>
      {(["x", "y"] as const).map((axis) => (
        <label key={axis}>
          {name}
          <sub>{axis}</sub>
          <span>-5</span>
          <input
            aria-label={`${name} ${axis} component`}
            type="range"
            min="-5"
            max="5"
            step=".5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: +event.target.value })
            }
          />
          <span>5</span>
          <input
            aria-label={`${name} ${axis} value`}
            type="number"
            min="-5"
            max="5"
            step=".5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: clamp(+event.target.value) })
            }
          />
        </label>
      ))}
      <footer>
        {name} = ({value.x}, {value.y}){" "}
        <span>
          |{name}| = {mag(value).toFixed(2)}
        </span>
      </footer>
    </article>
  );
}

function PracticeGraph() {
  return (
    <svg viewBox="0 0 190 120" aria-label="Dot product practice vectors">
      <line x1="95" x2="95" y1="5" y2="115" />
      <line x1="20" x2="180" y1="75" y2="75" />
      <line x1="95" y1="75" x2="145" y2="100" className="u" />
      <line x1="95" y1="75" x2="120" y2="25" className="v" />
      <text x="149" y="103">
        u
      </text>
      <text x="124" y="24">
        v
      </text>
    </svg>
  );
}

export default function DotProductTargetLesson190({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [u, setU] = useState(INITIAL_U),
    [v, setV] = useState(INITIAL_V),
    [snap, setSnap] = useState(true),
    [lockAxes, setLockAxes] = useState(false),
    [tab, setTab] = useState(0),
    [bookmarked, setBookmarked] = useState(false),
    [shared, setShared] = useState(false),
    [language, setLanguage] = useState("English (EN)"),
    [answer, setAnswer] = useState(""),
    [hint, setHint] = useState(false),
    [feedback, setFeedback] = useState("");
  const value = dot(u, v),
    theta = angle(u, v),
    cosine = value / (mag(u) * mag(v) || 1),
    foot = projection(v, u),
    scalarProjection = value / (mag(u) || 1),
    practiceAnswer = dot(PRACTICE_U, PRACTICE_V),
    correct = answer.trim() !== "" && Number(answer) === practiceAnswer,
    interact = () => onInteraction(),
    reset = () => {
      setU(INITIAL_U);
      setV(INITIAL_V);
      setSnap(true);
      setLockAxes(false);
      setTab(0);
      setBookmarked(false);
      setShared(false);
      setLanguage("English (EN)");
      setAnswer("");
      setHint(false);
      setFeedback("");
      interact();
    };
  useEffect(() => {
    setU(INITIAL_U);
    setV(INITIAL_V);
    setSnap(true);
    setLockAxes(false);
    setTab(0);
    setBookmarked(false);
    setShared(false);
    setLanguage("English (EN)");
    setAnswer("");
    setHint(false);
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className="dp190-page"
      data-testid="vector-mockup-0247"
      data-dedicated-lesson="190"
      data-object-model="two-vector-dot-angle-cosine-projection-component-proof-practice"
      data-u={`${u.x}:${u.y}`}
      data-v={`${v.x}:${v.y}`}
      data-dot={value.toFixed(3)}
      data-angle={theta.toFixed(3)}
      data-cosine={cosine.toFixed(3)}
      data-projection={`${foot.x.toFixed(3)}:${foot.y.toFixed(3)}`}
      data-scalar-projection={scalarProjection.toFixed(3)}
      data-snap={snap}
      data-lock-axes={lockAxes}
      data-tab={tab}
      data-bookmarked={bookmarked}
      data-shared={shared}
      data-language={language}
      data-answer={answer}
      data-hint={hint}
      data-correct={correct}
      data-feedback={feedback}
    >
      <header className="dp190-header">
        <section>
          <div>
            <span>VECTORS</span>
            <span>GEOMETRY</span>
            <h1>
              Dot Product{" "}
              <button
                aria-label="Bookmark lesson"
                className={bookmarked ? "active" : ""}
                onClick={() => {
                  setBookmarked((x) => !x);
                  interact();
                }}
              >
                <Bookmark />
              </button>
            </h1>
            <p>Measure how much one vector goes in the direction of another.</p>
            <aside>
              <b>♙ Level: Intermediate-Advanced</b>
              <b>⌁ Applied Lab</b>
              <b>☷ Vector Tools</b>
              <b>◷ 6-10 min</b>
            </aside>
          </div>
          <nav>
            <div>
              <button
                onClick={() => {
                  setBookmarked((x) => !x);
                  interact();
                }}
              >
                <Bookmark />
                Bookmark
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`u·v=${value.toFixed(2)}`);
                  setShared(true);
                  interact();
                }}
              >
                <Share2 />
                Share
              </button>
            </div>
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                interact();
              }}
            >
              <option>English (EN)</option>
              <option>हिन्दी (HI)</option>
            </select>
            <output>{shared ? "Copied" : ""}</output>
          </nav>
        </section>
        <nav>
          {["Explore", "Components", "Formula", "Examples", "Practice"].map(
            (name, index) => (
              <button
                key={name}
                className={tab === index ? "active" : ""}
                onClick={() => {
                  setTab(index);
                  document
                    .getElementById(
                      index === 4 ? "dp190-practice" : "dp190-model",
                    )
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  interact();
                }}
              >
                {name}
              </button>
            ),
          )}
        </nav>
      </header>
      <section className="dp190-main" id="dp190-model">
        <article className="dp190-work">
          <header>
            <h2>Manipulate the vectors</h2>
            <nav>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
              <button
                className={snap ? "active" : ""}
                onClick={() => {
                  setSnap((x) => !x);
                  interact();
                }}
              >
                ▦ Snap
              </button>
              <button
                className={lockAxes ? "active" : ""}
                onClick={() => {
                  setLockAxes((x) => !x);
                  interact();
                }}
              >
                <Lock />
                Lock axes
              </button>
            </nav>
          </header>
          <DotGraph
            u={u}
            v={v}
            snap={snap}
            lockAxes={lockAxes}
            onPoint={(key, p) => {
              (key === "u" ? setU : setV)(p);
              interact();
            }}
          />
          <p>
            ☝ Drag vector tips to rotate. Turn off Snap for half-unit
            positions; Lock axes constrains movement to one axis.
          </p>
          <section>
            <VectorControl
              name="u"
              value={u}
              color="#078fac"
              onValue={(p) => {
                setU(p);
                interact();
              }}
            />
            <VectorControl
              name="v"
              value={v}
              color="#7c3aed"
              onValue={(p) => {
                setV(p);
                interact();
              }}
            />
          </section>
          <footer>
            <b>Projection of v onto u</b>
            <span>projᵤ v</span>
            <input
              aria-label="Scalar projection readout"
              type="range"
              min="-5"
              max="5"
              step=".01"
              readOnly
              value={Math.max(-5, Math.min(5, scalarProjection))}
            />
            <output>{scalarProjection.toFixed(2)}</output>
            <span>
              Foot on u<br />({foot.x.toFixed(2)}, {foot.y.toFixed(2)})
            </span>
          </footer>
        </article>
        <aside className="dp190-observe">
          <h2>Observe</h2>
          <article>
            <h3>Dot product</h3>
            <output>u · v = {value.toFixed(2)}</output>
            <h3>Angle</h3>
            <b>θ = {theta.toFixed(2)}°</b>
            <p>cos θ = {cosine.toFixed(2)}</p>
            <h3>Projection</h3>
            <output>projᵤ v = {scalarProjection.toFixed(2)}</output>
            <h3>Check (component form)</h3>
            <p>
              uₓvₓ + uᵧvᵧ
              <br />= ({u.x})({v.x}) + ({u.y})({v.y}) = {value}
            </p>
            <section
              className={
                value > 0 ? "positive" : value < 0 ? "negative" : "zero"
              }
            >
              <b>u · v {value > 0 ? ">" : value < 0 ? "<" : "="} 0</b>
              <span>
                The angle is{" "}
                {theta < 90 ? "acute" : theta > 90 ? "obtuse" : "right"}.
              </span>
            </section>
            <section>
              <b>Orthogonality</b>
              <span>u · v = 0 only when θ = 90°.</span>
            </section>
          </article>
          <article>
            <h3>See the relationship</h3>
            <output>
              u · v = |u| |v| cos θ<br />= {mag(u).toFixed(2)} ×{" "}
              {mag(v).toFixed(2)} × {cosine.toFixed(2)}
              <br />= {value.toFixed(2)} ✓
            </output>
          </article>
          <article>
            <h3>Construction</h3>
            <p>❶ Project v onto the direction of u.</p>
            <p>❷ The scalar projection is projᵤ v.</p>
            <p>❸ Multiply by |u| to get u · v.</p>
          </article>
        </aside>
      </section>
      <section className="dp190-lower">
        <article>
          <h2>Understand the rule</h2>
          <p>The dot product of vectors u and v is</p>
          <output>u · v = uₓvₓ + uᵧvᵧ = |u||v|cos θ</output>
          <p>It measures how much u and v point in the same direction.</p>
          <ul>
            <li>Positive when acute.</li>
            <li>Zero when perpendicular.</li>
            <li>Negative when obtuse.</li>
          </ul>
        </article>
        <article id="dp190-practice">
          <header>
            <h2>Try it yourself</h2>
            <div>
              <button
                onClick={() => {
                  setHint((x) => !x);
                  interact();
                }}
              >
                Hint <Lightbulb />
              </button>
              <button
                onClick={() => {
                  setFeedback(
                    correct
                      ? "Correct: the vectors are perpendicular, so u·v=0."
                      : "Not yet. Multiply matching components and add.",
                  );
                  interact();
                }}
              >
                Check
              </button>
            </div>
          </header>
          <section>
            <div>
              <p>Set u = (2,-1) and v = (1,2). What is u · v?</p>
              <p>u = 〈2,-1〉 &nbsp; v = 〈1,2〉</p>
              <label>
                u · v ={" "}
                <input
                  aria-label="Practice dot product"
                  type="number"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setFeedback("");
                    interact();
                  }}
                />
              </label>
              <small>Submit to check your answer.</small>
              {hint && <output>2×1 + (-1)×2 = 2-2.</output>}
              <strong>{feedback}</strong>
            </div>
            <PracticeGraph />
          </section>
        </article>
      </section>
      <nav className="dp190-nav">
        <a href="/lessons/geometry/189-magnitude-and-unit-vectors">
          <ArrowLeft />
          Previous &nbsp; Magnitude and Unit Vectors
        </a>
        <a href="/lessons/geometry/191-cross-product">
          Cross Product &nbsp; Next
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
