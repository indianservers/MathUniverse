import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VectorSubtractionTargetLesson187.css";

type Point = { x: number; y: number };
type Drag = "a" | "b";
const INITIAL_A = { x: 3, y: 2 },
  INITIAL_B = { x: -1, y: 3 },
  PRACTICE_A = { x: 1, y: 4 },
  PRACTICE_B = { x: 3, y: 1 };
const clamp = (n: number) => Math.max(-10, Math.min(10, Math.round(n))),
  sub = (a: Point, b: Point) => ({ x: a.x - b.x, y: a.y - b.y }),
  neg = (p: Point) => ({ x: -p.x, y: -p.y }),
  mag = (p: Point) => Math.hypot(p.x, p.y),
  deg = (p: Point) => (Math.atan2(p.y, p.x) * 180) / Math.PI;

function SubtractionGraph({
  a,
  b,
  construction,
  zoom,
  onPoint,
}: {
  a: Point;
  b: Point;
  construction: boolean;
  zoom: number;
  onPoint: (key: Drag, p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Drag | null>(null),
    unit = 37 * zoom,
    sx = (x: number) => 315 + x * unit,
    sy = (y: number) => 285 - y * unit,
    result = sub(a, b),
    minusB = neg(b),
    world = (event: PointerEvent<SVGSVGElement>) => {
      const r = ref.current!.getBoundingClientRect();
      return {
        x: clamp((((event.clientX - r.left) / r.width) * 630 - 315) / unit),
        y: clamp((285 - ((event.clientY - r.top) / r.height) * 570) / unit),
      };
    };
  const key = (which: Drag) => (event: KeyboardEvent<SVGCircleElement>) => {
    const d: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: 1 },
        ArrowDown: { x: 0, y: -1 },
      },
      m = d[event.key];
    if (!m) return;
    event.preventDefault();
    const p = which === "a" ? a : b;
    onPoint(which, { x: clamp(p.x + m.x), y: clamp(p.y + m.y) });
  };
  return (
    <svg
      ref={ref}
      className="vs187-graph"
      viewBox="0 0 630 570"
      preserveAspectRatio="none"
      aria-label="Vector subtraction construction"
      onPointerMove={(event) => {
        if (drag.current) onPoint(drag.current, world(event));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern
          id="vs187Grid"
          width={unit}
          height={unit}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#dee7ed" />
        </pattern>
        {[
          ["a", "#0798ae"],
          ["b", "#7c28d8"],
          ["neg", "#f08b00"],
          ["result", "#159447"],
        ].map(([id, color]) => (
          <marker
            key={id}
            id={`vs187-${id}`}
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
      <rect width="630" height="570" fill="url(#vs187Grid)" />
      <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="570" className="axis" />
      {Array.from({ length: 7 }, (_, i) => (i - 3) * 2).map((v) => (
        <g key={v}>
          {v !== 0 && (
            <>
              <text x={sx(v) - 7} y={sy(0) + 20}>
                {v}
              </text>
              <text x={sx(0) - 23} y={sy(v) + 4}>
                {v}
              </text>
            </>
          )}
        </g>
      ))}
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(a.x)}
        y2={sy(a.y)}
        className="a"
        markerEnd="url(#vs187-a)"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(b.x)}
        y2={sy(b.y)}
        className="b"
        markerEnd="url(#vs187-b)"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(minusB.x)}
        y2={sy(minusB.y)}
        className="neg"
        markerEnd="url(#vs187-neg)"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(result.x)}
        y2={sy(result.y)}
        className="result"
        markerEnd="url(#vs187-result)"
      />
      {construction && (
        <>
          <line
            x1={sx(a.x)}
            y1={sy(a.y)}
            x2={sx(result.x)}
            y2={sy(result.y)}
            className="copy"
          />
          <line
            x1={sx(minusB.x)}
            y1={sy(minusB.y)}
            x2={sx(result.x)}
            y2={sy(result.y)}
            className="copy"
          />
        </>
      )}
      <circle
        data-testid="subtraction-a-tip"
        role="slider"
        aria-label="Vector a tip"
        tabIndex={0}
        cx={sx(a.x)}
        cy={sy(a.y)}
        r="9"
        className="a-tip"
        onPointerDown={(event) => {
          drag.current = "a";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("a")}
      />
      <circle
        data-testid="subtraction-b-tip"
        role="slider"
        aria-label="Vector b tip"
        tabIndex={0}
        cx={sx(b.x)}
        cy={sy(b.y)}
        r="9"
        className="b-tip"
        onPointerDown={(event) => {
          drag.current = "b";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("b")}
      />
      <text x={sx(a.x) - 35} y={sy(a.y) + 25} className="a-label">
        a
      </text>
      <text x={sx(b.x) + 12} y={sy(b.y) + 8} className="b-label">
        b
      </text>
      <text x={sx(minusB.x) + 10} y={sy(minusB.y) - 8} className="neg-label">
        -b
      </text>
      <text x={sx(result.x) - 5} y={sy(result.y) - 12} className="result-label">
        a - b
      </text>
      <g className="vs187-legend">
        <rect x="12" y="12" width="128" height="175" rx="8" />
        <text x="27" y="39">
          Drag the tips
        </text>
        <text x="27" y="57">
          of vectors a
        </text>
        <text x="27" y="75">
          and b
        </text>
        {[
          ["a", "#0798ae", 104],
          ["b", "#7c28d8", 127],
          ["-b", "#f08b00", 150],
          ["a-b", "#159447", 173],
        ].map(([name, color, y]) => (
          <g key={name}>
            <circle cx="28" cy={Number(y) - 4} r="5" fill={String(color)} />
            <text x="45" y={Number(y)}>
              {name}
            </text>
          </g>
        ))}
      </g>
      <g className="vs187-result-tag">
        <rect
          x={sx(result.x) - 50}
          y={sy(result.y) - 44}
          width="100"
          height="31"
          rx="6"
        />
        <text x={sx(result.x) - 38} y={sy(result.y) - 24}>
          Result: a - b
        </text>
      </g>
    </svg>
  );
}

function VectorControls({
  name,
  value,
  color,
  onValue,
}: {
  name: "a" | "b";
  value: Point;
  color: string;
  onValue: (p: Point) => void;
}) {
  return (
    <article
      className="vs187-control"
      style={{ "--tone": color } as CSSProperties}
    >
      <h2>
        {name} = ( {value.x}, {value.y} )
      </h2>
      {(["x", "y"] as const).map((axis) => (
        <label key={axis}>
          {name}
          <sub>{axis}</sub>
          <span>-10</span>
          <input
            aria-label={`${name} ${axis} component`}
            type="range"
            min="-10"
            max="10"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: +event.target.value })
            }
          />
          <span>10</span>
          <input
            aria-label={`${name} ${axis} value`}
            type="number"
            min="-10"
            max="10"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: clamp(+event.target.value) })
            }
          />
        </label>
      ))}
    </article>
  );
}

function DisplacementView({ a, b }: { a: Point; b: Point }) {
  const r = sub(a, b),
    sx = (x: number) => 105 + x * 18,
    sy = (y: number) => 80 - y * 18;
  return (
    <svg
      viewBox="0 0 220 125"
      aria-label="Displacement view of vector subtraction"
    >
      <line x1={sx(0)} y1={sy(0)} x2={sx(a.x)} y2={sy(a.y)} className="a" />
      <line
        x1={sx(a.x)}
        y1={sy(a.y)}
        x2={sx(r.x)}
        y2={sy(r.y)}
        className="neg"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(r.x)}
        y2={sy(r.y)}
        className="result"
      />
      <circle cx={sx(0)} cy={sy(0)} r="5" />
      <circle cx={sx(r.x)} cy={sy(r.y)} r="5" />
      <text x={sx(0) - 12} y={sy(0) + 17}>
        O
      </text>
      <text x={sx(a.x) - 3} y={sy(a.y) - 8} className="a-label">
        a
      </text>
      <text x={sx(r.x) + 5} y={sy(r.y) - 4} className="neg-label">
        -b
      </text>
      <text x={sx(r.x) - 34} y={sy(r.y) + 17} className="result-label">
        a-b
      </text>
    </svg>
  );
}

export default function VectorSubtractionTargetLesson187({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(INITIAL_A),
    [b, setB] = useState(INITIAL_B),
    [construction, setConstruction] = useState(true),
    [zoom, setZoom] = useState(1),
    [fullscreen, setFullscreen] = useState(false),
    [tab, setTab] = useState(0),
    [bookmarked, setBookmarked] = useState(false),
    [shared, setShared] = useState(false),
    [answers, setAnswers] = useState({ x: "", y: "" }),
    [choice, setChoice] = useState("opposite"),
    [hint, setHint] = useState(true),
    [revealed, setRevealed] = useState(false),
    [feedback, setFeedback] = useState("");
  const minusB = neg(b),
    result = sub(a, b),
    angleDifference = Math.abs(deg(a) - deg(b)),
    between = Math.min(angleDifference, 360 - angleDifference),
    expected = sub(PRACTICE_A, PRACTICE_B),
    correct =
      Number(answers.x) === expected.x &&
      Number(answers.y) === expected.y &&
      choice === "opposite";
  const interact = () => onInteraction(),
    reset = () => {
      setA(INITIAL_A);
      setB(INITIAL_B);
      setConstruction(true);
      setZoom(1);
      setFullscreen(false);
      setTab(0);
      setBookmarked(false);
      setShared(false);
      setAnswers({ x: "", y: "" });
      setChoice("opposite");
      setHint(true);
      setRevealed(false);
      setFeedback("");
      interact();
    };
  useEffect(() => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setConstruction(true);
    setZoom(1);
    setFullscreen(false);
    setTab(0);
    setBookmarked(false);
    setShared(false);
    setAnswers({ x: "", y: "" });
    setChoice("opposite");
    setHint(true);
    setRevealed(false);
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className={`vs187-page${fullscreen ? " expanded" : ""}`}
      data-testid="vector-mockup-0244"
      data-dedicated-lesson="187"
      data-object-model="ordered-component-subtraction-opposite-vector-displacement-construction-practice"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-negative-b={`${minusB.x}:${minusB.y}`}
      data-result={`${result.x}:${result.y}`}
      data-construction={construction}
      data-zoom={zoom.toFixed(2)}
      data-fullscreen={fullscreen}
      data-tab={tab}
      data-bookmarked={bookmarked}
      data-shared={shared}
      data-answers={`${answers.x}:${answers.y}`}
      data-choice={choice}
      data-hint={hint}
      data-revealed={revealed}
      data-correct={correct}
      data-feedback={feedback}
    >
      <header className="vs187-header">
        <div>
          <span>VECTORS</span>
          <span>INTERMEDIATE-ADVANCED</span>
          <h1>
            Vector Subtraction{" "}
            <button
              aria-label="Bookmark lesson"
              className={bookmarked ? "active" : ""}
              onClick={() => {
                setBookmarked((value) => !value);
                interact();
              }}
            >
              <Bookmark />
            </button>
          </h1>
          <h2>Subtract one vector from another: a - b = a + (-b)</h2>
        </div>
        <aside>
          <section>
            <b>◷ 10-12 min</b>
            <b>ϟ Applied Lab</b>
          </section>
          <nav>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`a-b=<${result.x},${result.y}>`);
                setShared(true);
                interact();
              }}
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/geometry">↗ Workspace</a>
          </nav>
          <output>{shared ? "Copied" : ""}</output>
        </aside>
      </header>
      <nav className="vs187-tabs">
        {[
          "Observe",
          "Manipulate",
          "Notice the pattern",
          "Understand the rule",
          "Try independently",
        ].map((name, index) => (
          <button
            key={name}
            className={tab === index ? "active" : ""}
            onClick={() => {
              setTab(index);
              document
                .getElementById(
                  index === 4
                    ? "vs187-practice"
                    : index === 3
                      ? "vs187-rule"
                      : "vs187-model",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              interact();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="vs187-work" id="vs187-model">
        <article>
          <h2>Build and compare: a - b = a + (-b)</h2>
          <SubtractionGraph
            a={a}
            b={b}
            construction={construction}
            zoom={zoom}
            onPoint={(key, p) => {
              (key === "a" ? setA : setB)(p);
              interact();
            }}
          />
          <footer>
            <label>
              ⊕ Show construction (parallelogram){" "}
              <input
                aria-label="Show construction"
                type="checkbox"
                checked={construction}
                onChange={() => {
                  setConstruction((value) => !value);
                  interact();
                }}
              />
            </label>
            <nav>
              <button
                aria-label="Zoom out"
                onClick={() => {
                  setZoom((value) => Math.max(0.75, value - 0.25));
                  interact();
                }}
              >
                <ZoomOut />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => {
                  setZoom((value) => Math.min(1.5, value + 0.25));
                  interact();
                }}
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Expand subtraction graph"
                className={fullscreen ? "active" : ""}
                onClick={() => {
                  setFullscreen((value) => !value);
                  interact();
                }}
              >
                <Maximize2 />
              </button>
            </nav>
          </footer>
        </article>
        <section>
          <h2>Vectors</h2>
          <VectorControls
            name="a"
            value={a}
            color="#0798ae"
            onValue={(p) => {
              setA(p);
              interact();
            }}
          />
          <VectorControls
            name="b"
            value={b}
            color="#7c28d8"
            onValue={(p) => {
              setB(p);
              interact();
            }}
          />
          <article className="vs187-derived">
            <h2>Derived vectors</h2>
            <p>
              <i>-b</i> = ( {minusB.x}, {minusB.y} )
            </p>
            <p>
              <i>a-b</i> = ( {result.x}, {result.y} )
            </p>
          </article>
        </section>
        <aside>
          <article className="vs187-observation">
            <h2>Observation ✓</h2>
            <output>a - b = a + (-b)</output>
            <p>Component-wise:</p>
            <p>
              ({a.x},{a.y}) - ({b.x},{b.y}) = ({a.x}-({b.x}), {a.y}-{b.y})
            </p>
            <b>
              = ({result.x}, {result.y})
            </b>
          </article>
          <section className="vs187-metrics">
            <b>
              |a|<span>{mag(a).toFixed(2)}</span>
            </b>
            <b>
              |b|<span>{mag(b).toFixed(2)}</span>
            </b>
            <b>
              |a-b|<span>{mag(result).toFixed(2)}</span>
            </b>
          </section>
          <article className="vs187-angle">
            <h3>Angle between a and b</h3>
            <b>{between.toFixed(1)}°</b>
          </article>
          <article className="vs187-displacement">
            <h2>Displacement view</h2>
            <p>
              Starting at the origin, go along a, then along -b to reach the
              same point as a-b.
            </p>
            <DisplacementView a={a} b={b} />
          </article>
        </aside>
      </section>
      <section className="vs187-learn">
        <article>
          <h2>
            How it works <small>(construction steps)</small>
          </h2>
          <ol>
            <li>Draw vectors a and b from the origin.</li>
            <li>Reverse b to get -b (same length, opposite direction).</li>
            <li>Place -b with its tail at the head of a.</li>
            <li>The vector from the origin to the final point is a-b.</li>
          </ol>
        </article>
        <article id="vs187-rule">
          <h2>Key idea</h2>
          <p>Vector subtraction is adding the opposite.</p>
          <output>a - b = a + (-b)</output>
          <p>Subtract components in order:</p>
          <b>(aₓ,aᵧ) - (bₓ,bᵧ) = (aₓ-bₓ, aᵧ-bᵧ)</b>
        </article>
      </section>
      <section className="vs187-practice" id="vs187-practice">
        <h2>Try independently</h2>
        <div>
          <article>
            <h3>Your turn</h3>
            <p>Compute a-b by two methods.</p>
            <section>
              <b>Method 1: Components</b>
              <p>Subtract components.</p>
            </section>
            <section>
              <b>Method 2: Construction</b>
              <p>Use a+(-b) on the graph.</p>
            </section>
          </article>
          <article>
            <p>1. Set the vectors to the given values.</p>
            <p>● a = (1,4) &nbsp; ● b = (3,1)</p>
            <p>2. Find a-b.</p>
            <label>
              a-b = (
              <input
                aria-label="Practice subtraction x"
                type="number"
                value={answers.x}
                onChange={(event) => {
                  setAnswers({ ...answers, x: event.target.value });
                  setFeedback("");
                  interact();
                }}
              />
              ,{" "}
              <input
                aria-label="Practice subtraction y"
                type="number"
                value={answers.y}
                onChange={(event) => {
                  setAnswers({ ...answers, y: event.target.value });
                  setFeedback("");
                  interact();
                }}
              />
              )
            </label>
            <footer>
              <button
                onClick={() => {
                  setFeedback(
                    correct
                      ? "Correct: (-2,3)."
                      : "Not yet. Subtract b from a in order.",
                  );
                  interact();
                }}
              >
                Check
              </button>
              <button
                onClick={() => {
                  setAnswers({ x: String(expected.x), y: String(expected.y) });
                  setRevealed(true);
                  setFeedback("Answer revealed.");
                  interact();
                }}
              >
                Show answer
              </button>
            </footer>
          </article>
          <article>
            <p>3. Which statement is true?</p>
            {[
              ["direct", "a-b=a-b"],
              ["length", "|a-b|=|a|-|b|"],
              ["opposite", "a-b=a+(-b)"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="subtraction-rule"
                  value={value}
                  checked={choice === value}
                  onChange={() => {
                    setChoice(value);
                    setFeedback("");
                    interact();
                  }}
                />
                {label}
              </label>
            ))}
            <div className="vs187-hint">
              <button
                onClick={() => {
                  setHint((value) => !value);
                  interact();
                }}
              >
                <Lightbulb /> Hint
              </button>
              {hint && (
                <p>
                  Compare components and use the opposite vector construction.
                </p>
              )}
            </div>
          </article>
        </div>
        <output>{feedback}</output>
      </section>
      <nav className="vs187-nav">
        <a href="/lessons/geometry/186-vector-addition">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Vector Addition</b>
          </span>
        </a>
        <a href="/lessons/geometry/188-scalar-multiplication">
          <span>
            <small>Next</small>
            <b>Scalar Multiplication</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
