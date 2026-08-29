import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ScalarMultiplicationTargetLesson188.css";

type Point = { x: number; y: number };
const INITIAL = { x: 3, y: 2 };
const PRACTICE_VECTOR = { x: 2, y: -1 };
const PRACTICE_SCALAR = 2.5;
const clamp = (value: number) => Math.max(-6, Math.min(6, Math.round(value)));
const scale = (point: Point, scalar: number) => ({
  x: point.x * scalar,
  y: point.y * scalar,
});
const magnitude = (point: Point) => Math.hypot(point.x, point.y);
const angle = (point: Point) => {
  const value = (Math.atan2(point.y, point.x) * 180) / Math.PI;
  return value < 0 ? value + 360 : value;
};
const number = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "");

function VectorPlane({
  vector,
  scalar,
  grid,
  expanded,
  onVector,
  onGrid,
  onExpand,
}: {
  vector: Point;
  scalar: number;
  grid: boolean;
  expanded: boolean;
  onVector: (point: Point) => void;
  onGrid: () => void;
  onExpand: () => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const result = scale(vector, scalar);
  const unit = Math.min(
    43,
    250 /
      Math.max(
        6,
        Math.abs(result.x),
        Math.abs(result.y),
        Math.abs(vector.x),
        Math.abs(vector.y),
      ),
  );
  const sx = (x: number) => 315 + x * unit;
  const sy = (y: number) => 255 - y * unit;
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: clamp((((event.clientX - rect.left) / rect.width) * 630 - 315) / unit),
      y: clamp((255 - ((event.clientY - rect.top) / rect.height) * 510) / unit),
    };
  };
  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    const moves: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    onVector({
      x: clamp(vector.x + move.x),
      y: clamp(vector.y + move.y),
    });
  };
  return (
    <article className="sm188-plane">
      <h2>Vector plane</h2>
      <label>
        <input
          aria-label="Show scalar grid"
          type="checkbox"
          checked={grid}
          onChange={onGrid}
        />
        Grid
      </label>
      <button aria-label="Expand vector plane" onClick={onExpand}>
        <Expand />
      </button>
      <svg
        ref={ref}
        className="sm188-graph"
        viewBox="0 0 630 510"
        preserveAspectRatio="none"
        aria-label="Scalar multiplication vector plane"
        onPointerMove={(event) =>
          dragging.current && onVector(fromPointer(event))
        }
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
        }}
      >
        <defs>
          <pattern
            id="sm188Grid"
            width="43"
            height="43"
            patternUnits="userSpaceOnUse"
          >
            <path d="M43 0H0V43" fill="none" stroke="#dce7ef" />
          </pattern>
          {[
            ["u", "#0796b5"],
            ["v", "#f28b00"],
          ].map(([id, color]) => (
            <marker
              key={id}
              id={`sm188-${id}`}
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
        <rect
          width="630"
          height="510"
          fill={grid ? "url(#sm188Grid)" : "#fff"}
        />
        <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
        <line x1={sx(0)} x2={sx(0)} y1="0" y2="510" className="axis" />
        {[-6, -4, -2, 2, 4, 6].map((value) => (
          <g key={value}>
            <text x={sx(value) - 7} y={sy(0) + 20}>
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
          x2={sx(result.x)}
          y2={sy(result.y)}
          className="result-guide"
        />
        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(vector.x)}
          y2={sy(vector.y)}
          className="source"
          markerEnd="url(#sm188-u)"
        />
        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(result.x)}
          y2={sy(result.y)}
          className="result"
          markerEnd="url(#sm188-v)"
        />
        <circle cx={sx(0)} cy={sy(0)} r="6" className="origin" />
        <circle
          data-testid="scalar-source-tip"
          role="slider"
          aria-label="Source vector tip"
          tabIndex={0}
          cx={sx(vector.x)}
          cy={sy(vector.y)}
          r="10"
          className="source-tip"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onKeyDown={onKeyDown}
        />
        <text
          x={sx(vector.x) + 12}
          y={sy(vector.y) - 12}
          className="source-label"
        >
          u ({vector.x}, {vector.y})
        </text>
        <text
          x={sx(result.x) + 10}
          y={sy(result.y) - 10}
          className="result-label"
        >
          v = k u ({number(result.x)}, {number(result.y)})
        </text>
        <text x={sx(0) + 10} y={sy(0) + 22}>
          (0, 0)
        </text>
      </svg>
      <footer>
        <span className="source-key">
          u = ({vector.x}, {vector.y})
        </span>
        <span className="result-key">v = k u</span>
        <span className="guide-key">resultant</span>
      </footer>
      {expanded && <output>Expanded vector plane active</output>}
    </article>
  );
}

function SignCase({ scalar }: { scalar: number }) {
  const cases = [
    { key: "positive", title: "k > 0", text: "Same direction" },
    { key: "zero", title: "k = 0", text: "Zero vector" },
    { key: "negative", title: "k < 0", text: "Opposite direction" },
  ];
  const active = scalar > 0 ? "positive" : scalar < 0 ? "negative" : "zero";
  return (
    <section className="sm188-signs">
      <h2>Sign cases</h2>
      <div>
        {cases.map((item) => (
          <article
            key={item.key}
            className={active === item.key ? "active" : ""}
          >
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <svg viewBox="0 0 100 35" aria-hidden="true">
              {item.key === "zero" ? (
                <circle cx="50" cy="17" r="5" />
              ) : (
                <>
                  <line x1="50" y1="17" x2="15" y2="17" className="u" />
                  <line
                    x1="50"
                    y1="17"
                    x2={item.key === "positive" ? 88 : 82}
                    y2="17"
                    className="v"
                  />
                </>
              )}
            </svg>
            <b>v = k u</b>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ScalarMultiplicationTargetLesson188({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vector, setVector] = useState(INITIAL),
    [scalar, setScalar] = useState(-3),
    [grid, setGrid] = useState(true),
    [expanded, setExpanded] = useState(false),
    [stage, setStage] = useState(1),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false),
    [answers, setAnswers] = useState({ x: "", y: "" }),
    [hint, setHint] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = scale(vector, scalar),
    practice = scale(PRACTICE_VECTOR, PRACTICE_SCALAR),
    correct =
      Number(answers.x) === practice.x && Number(answers.y) === practice.y;
  const interact = () => onInteraction();
  const reset = () => {
    setVector(INITIAL);
    setScalar(-3);
    setGrid(true);
    setExpanded(false);
    setStage(1);
    setLanguage("English (English)");
    setShared(false);
    setAnswers({ x: "", y: "" });
    setHint(false);
    setFeedback("");
    interact();
  };
  useEffect(() => {
    setVector(INITIAL);
    setScalar(-3);
    setGrid(true);
    setExpanded(false);
    setStage(1);
    setLanguage("English (English)");
    setShared(false);
    setAnswers({ x: "", y: "" });
    setHint(false);
    setFeedback("");
  }, [resetToken]);
  const updateVector = (point: Point) => {
    setVector(point);
    interact();
  };
  const updateScalar = (value: number) => {
    setScalar(Math.max(-5, Math.min(5, value)));
    interact();
  };
  return (
    <main
      className={`sm188-page${expanded ? " expanded" : ""}`}
      data-testid="vector-mockup-0245"
      data-dedicated-lesson="188"
      data-object-model="source-vector-scalar-derived-vector-sign-cases-worked-example-practice"
      data-vector={`${vector.x}:${vector.y}`}
      data-scalar={scalar.toFixed(3)}
      data-result={`${number(result.x)}:${number(result.y)}`}
      data-grid={grid}
      data-expanded={expanded}
      data-stage={stage}
      data-language={language}
      data-shared={shared}
      data-answers={`${answers.x}:${answers.y}`}
      data-hint={hint}
      data-correct={correct}
      data-feedback={feedback}
    >
      <header className="sm188-header">
        <div>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Scalar Multiplication</h1>
          <p>Scale and reverse vectors.</p>
          <section>
            <b>
              ▥ <small>Level</small>Intermediate-Advanced
            </b>
            <b>
              ◷ <small>Time</small>6-10 min
            </b>
            <b>
              ⌕ <small>Tools</small>Vector tools
            </b>
          </section>
        </div>
        <nav>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                interact();
              }}
            >
              <option>English (English)</option>
              <option>हिन्दी (Hindi)</option>
            </select>
          </label>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `v=${scalar}(${vector.x},${vector.y})=(${number(result.x)},${number(result.y)})`,
              );
              setShared(true);
              interact();
            }}
          >
            <Share2 /> Share
          </button>
          <output>{shared ? "Copied" : ""}</output>
        </nav>
      </header>
      <nav className="sm188-stages">
        {[
          ["Observe", "Watch the effect"],
          ["Manipulate", "Change scalar"],
          ["Notice the pattern", "See what happens"],
          ["Understand the rule", "Formula & signs"],
          ["Try independently", "Practice task"],
        ].map(([title, subtitle], index) => (
          <button
            key={title}
            className={stage === index ? "active" : ""}
            onClick={() => {
              setStage(index);
              document
                .getElementById(index === 4 ? "sm188-practice" : "sm188-model")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              interact();
            }}
          >
            <i>{index + 1}</i>
            <b>{title}</b>
            <small>{subtitle}</small>
          </button>
        ))}
      </nav>
      <section className="sm188-work" id="sm188-model">
        <VectorPlane
          vector={vector}
          scalar={scalar}
          grid={grid}
          expanded={expanded}
          onVector={updateVector}
          onGrid={() => {
            setGrid((value) => !value);
            interact();
          }}
          onExpand={() => {
            setExpanded((value) => !value);
            interact();
          }}
        />
        <aside>
          <section className="sm188-scalar">
            <h2>
              Scalar k <small>ⓘ</small>
            </h2>
            <output>{scalar.toFixed(3)}</output>
            <div>
              <span>-5</span>
              <span>5</span>
            </div>
            <input
              aria-label="Scalar k"
              type="range"
              min="-5"
              max="5"
              step="0.25"
              value={scalar}
              onChange={(event) => updateScalar(+event.target.value)}
            />
            <nav>
              {[-5, -2, -1, 0, 1, 2, 5].map((value) => (
                <button key={value} onClick={() => updateScalar(value)}>
                  {value}
                </button>
              ))}
            </nav>
          </section>
          <section className="sm188-components">
            <h2>Vector components</h2>
            <article>
              <b>
                ● u <small>(original)</small>
              </b>
              <label>
                x
                <input
                  aria-label="Source x value"
                  type="number"
                  value={vector.x}
                  onChange={(event) =>
                    updateVector({ ...vector, x: clamp(+event.target.value) })
                  }
                />
              </label>
              <label>
                y
                <input
                  aria-label="Source y value"
                  type="number"
                  value={vector.y}
                  onChange={(event) =>
                    updateVector({ ...vector, y: clamp(+event.target.value) })
                  }
                />
              </label>
              <output>
                |u| = {magnitude(vector).toFixed(2)}
                <br />
                ∠u = {angle(vector).toFixed(2)}°
              </output>
            </article>
            <article>
              <b>
                ● v = k u <small>(result)</small>
              </b>
              <label>
                x
                <input
                  aria-label="Result x value"
                  readOnly
                  value={number(result.x)}
                />
              </label>
              <label>
                y
                <input
                  aria-label="Result y value"
                  readOnly
                  value={number(result.y)}
                />
              </label>
              <output>
                |v| = {magnitude(result).toFixed(2)}
                <br />
                ∠v = {angle(result).toFixed(2)}°
              </output>
            </article>
          </section>
          <SignCase scalar={scalar} />
        </aside>
      </section>
      <p className="sm188-instruction">
        Drag on the plane to change u. Use the slider or preset buttons to
        change scalar k.
      </p>
      <section className="sm188-learn">
        <article>
          <h2>Worked example</h2>
          <p>
            Let{" "}
            <b>
              u = ({vector.x}, {vector.y})
            </b>{" "}
            and <b>k = {number(scalar)}</b>.
          </p>
          <ol>
            <li>
              Multiply each component by k.
              <output>
                v = k u = {number(scalar)}({vector.x}, {vector.y}) = (
                {number(result.x)}, {number(result.y)})
              </output>
            </li>
            <li>
              Magnitude scales by |k|.
              <output>
                |v| = |k| |u| = {Math.abs(scalar).toFixed(2)} ×{" "}
                {magnitude(vector).toFixed(2)} = {magnitude(result).toFixed(2)}
              </output>
            </li>
            <li>
              Direction{" "}
              {scalar < 0
                ? "reverses"
                : scalar === 0
                  ? "collapses to zero"
                  : "stays the same"}
              .
            </li>
          </ol>
        </article>
        <article>
          <h2>Rule & insight</h2>
          <p>
            Scalar multiplication multiplies every component of a vector by a
            scalar k.
          </p>
          <output>v = k u = (k uₓ, k uᵧ)</output>
          <section>
            <div>
              <b>|k|</b> scales the length: |v| = |k| |u|
            </div>
            <div>
              <b>Sign of k decides direction:</b>
              <br />k &gt; 0 same direction
              <br />k = 0 zero vector
              <br />k &lt; 0 opposite direction
            </div>
            <ul>
              <li>Multiply components by k.</li>
              <li>Length multiplies by |k|.</li>
              <li>Negative: reverse direction.</li>
            </ul>
          </section>
        </article>
      </section>
      <section className="sm188-practice" id="sm188-practice">
        <div>
          <h2>Your turn</h2>
          <p>
            Let u = (2, -1). Use the controls to set k = 2.5. What is v = k u?
          </p>
          <b>Enter the vector components.</b>
        </div>
        <label>
          v x
          <input
            aria-label="Practice result x"
            value={answers.x}
            onChange={(event) => {
              setAnswers({ ...answers, x: event.target.value });
              setFeedback("");
              interact();
            }}
            placeholder="Enter value"
          />
        </label>
        <label>
          v y
          <input
            aria-label="Practice result y"
            value={answers.y}
            onChange={(event) => {
              setAnswers({ ...answers, y: event.target.value });
              setFeedback("");
              interact();
            }}
            placeholder="Enter value"
          />
        </label>
        <button
          onClick={() => {
            setFeedback(
              correct
                ? "Correct: v = (5, -2.5)."
                : "Not yet. Multiply both components by 2.5.",
            );
            interact();
          }}
        >
          Check answer
        </button>
        <button
          className="hint"
          onClick={() => {
            setHint((value) => !value);
            interact();
          }}
        >
          <Lightbulb />
          Show hint
        </button>
        {hint && <output>2.5 × 2 = 5 and 2.5 × (-1) = -2.5.</output>}
        <strong>{feedback}</strong>
      </section>
      <nav className="sm188-nav">
        <a href="/lessons/geometry/187-vector-subtraction">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Vector Subtraction</b>
          </span>
        </a>
        <section>
          <small>Lesson progress</small>
          <div>
            {[1, 2, 3, 4, 5].map((item) => (
              <i key={item} className={item <= stage + 1 ? "active" : ""}>
                {item}
              </i>
            ))}
          </div>
        </section>
        <a href="/lessons/geometry/189-magnitude-and-unit-vectors">
          <span>
            <small>Next</small>
            <b>Magnitude and Unit Vectors</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
