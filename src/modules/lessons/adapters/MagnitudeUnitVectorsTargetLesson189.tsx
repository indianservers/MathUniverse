import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./MagnitudeUnitVectorsTargetLesson189.css";

type Point = { x: number; y: number };
const INITIAL = { x: 3, y: 2 };
const PRACTICE = { x: -2, y: 5 };
const clamp = (value: number) => Math.max(-5, Math.min(5, Math.round(value)));
const mag = (point: Point) => Math.hypot(point.x, point.y);
const direction = (point: Point) =>
  (Math.atan2(point.y, point.x) * 180) / Math.PI;
const unit = (point: Point) => {
  const length = mag(point);
  return length ? { x: point.x / length, y: point.y / length } : { x: 0, y: 0 };
};

function VectorGraph({
  vector,
  dragEnabled,
  onVector,
}: {
  vector: Point;
  dragEnabled: boolean;
  onVector: (point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const sx = (x: number) => 315 + x * 50;
  const sy = (y: number) => 220 - y * 50;
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: clamp((((event.clientX - rect.left) / rect.width) * 630 - 315) / 50),
      y: clamp((220 - ((event.clientY - rect.top) / rect.height) * 440) / 50),
    };
  };
  const key = (event: KeyboardEvent<SVGCircleElement>) => {
    const moves: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    const move = moves[event.key];
    if (!move || !dragEnabled) return;
    event.preventDefault();
    onVector({ x: clamp(vector.x + move.x), y: clamp(vector.y + move.y) });
  };
  return (
    <svg
      ref={ref}
      className="muv189-graph"
      viewBox="0 0 630 440"
      preserveAspectRatio="none"
      aria-label="Magnitude vector plane"
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
          id="muv189Grid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path d="M50 0H0V50" fill="none" stroke="#dce7ef" />
        </pattern>
        <marker
          id="muv189Arrow"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 0L9 4.5L0 9Z" fill="#078cae" />
        </marker>
      </defs>
      <rect width="630" height="440" fill="url(#muv189Grid)" />
      <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="440" className="axis" />
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((value) => (
        <g key={value}>
          <text x={sx(value) - 5} y={sy(0) + 19}>
            {value}
          </text>
          <text x={sx(0) - 20} y={sy(value) + 4}>
            {value}
          </text>
        </g>
      ))}
      <polygon
        points={`${sx(0)},${sy(0)} ${sx(vector.x)},${sy(0)} ${sx(vector.x)},${sy(vector.y)}`}
        className="triangle"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(0)}
        className="x-component"
      />
      <line
        x1={sx(vector.x)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(vector.y)}
        className="y-component"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(vector.y)}
        className="vector"
        markerEnd="url(#muv189Arrow)"
      />
      <circle
        data-testid="magnitude-vector-tip"
        role="slider"
        aria-label="Magnitude vector tip"
        tabIndex={0}
        cx={sx(vector.x)}
        cy={sy(vector.y)}
        r="10"
        className="tip"
        onPointerDown={(event) => {
          if (!dragEnabled) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key}
      />
      <text
        x={sx(vector.x) + 12}
        y={sy(vector.y) - 12}
        className="vector-label"
      >
        v ({vector.x}, {vector.y})
      </text>
      <text x={sx(vector.x) / 2 + sx(0) / 2} y={sy(0) + 24} className="x-label">
        {vector.x}
      </text>
      <text
        x={sx(vector.x) + 13}
        y={(sy(0) + sy(vector.y)) / 2}
        className="y-label"
      >
        {vector.y}
      </text>
      <text x={sx(0) + 58} y={sy(0) - 18} className="angle-label">
        {direction(vector).toFixed(1)}°
      </text>
    </svg>
  );
}

function Triangle({ vector }: { vector: Point }) {
  return (
    <svg
      className="muv189-triangle"
      viewBox="0 0 250 120"
      aria-label="Pythagorean component triangle"
    >
      <polygon points="20,100 220,100 220,20" />
      <circle cx="20" cy="100" r="4" />
      <circle cx="220" cy="100" r="4" />
      <circle cx="220" cy="20" r="4" />
      <text x="4" y="116">
        O(0,0)
      </text>
      <text x="184" y="116">
        P({vector.x},0)
      </text>
      <text x="178" y="16">
        Q({vector.x},{vector.y})
      </text>
      <text x="90" y="116" className="x">
        a = {vector.x}
      </text>
      <text x="225" y="65" className="y">
        b = {vector.y}
      </text>
      <text x="95" y="54" className="v">
        |v|
      </text>
    </svg>
  );
}

function MagnitudeGauge({ value }: { value: number }) {
  const dash = Math.min(1, value / Math.sqrt(50)) * 188;
  return (
    <svg
      className="muv189-gauge"
      viewBox="0 0 190 125"
      aria-label="Magnitude gauge"
    >
      <path d="M25 105A70 70 0 0 1 165 105" className="track" />
      <path
        d="M25 105A70 70 0 0 1 165 105"
        className="value"
        strokeDasharray={`${dash} 220`}
      />
      <text x="95" y="70">
        |v|
      </text>
      <text x="95" y="101" className="number">
        {value.toFixed(2)}
      </text>
      <text x="17" y="121">
        0
      </text>
      <text x="153" y="121">
        7.07
      </text>
    </svg>
  );
}

function UnitCircle({ vector }: { vector: Point }) {
  const normalized = unit(vector),
    sx = (x: number) => 85 + x * 52,
    sy = (y: number) => 68 - y * 52;
  return (
    <svg
      className="muv189-unit-circle"
      viewBox="0 0 170 140"
      aria-label="Normalized vector on unit circle"
    >
      <circle cx="85" cy="68" r="52" />
      <line x1="20" x2="150" y1="68" y2="68" />
      <line x1="85" x2="85" y1="5" y2="130" />
      <line
        x1="85"
        y1="68"
        x2={sx(normalized.x)}
        y2={sy(normalized.y)}
        className="unit-vector"
      />
      <circle
        cx={sx(normalized.x)}
        cy={sy(normalized.y)}
        r="5"
        className="unit-tip"
      />
      <text x={sx(normalized.x) + 5} y={sy(normalized.y) - 5}>
        1
      </text>
      <text x="95" y="85">
        {normalized.x.toFixed(3)}
      </text>
      <text x="88" y="47">
        {normalized.y.toFixed(3)}
      </text>
    </svg>
  );
}

export default function MagnitudeUnitVectorsTargetLesson189({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vector, setVector] = useState(INITIAL),
    [dragEnabled, setDragEnabled] = useState(true),
    [tab, setTab] = useState(0),
    [shared, setShared] = useState(false),
    [hint, setHint] = useState(false),
    [answers, setAnswers] = useState({ m: "", x: "", y: "" }),
    [feedback, setFeedback] = useState("");
  const length = mag(vector),
    normalized = unit(vector),
    practiceLength = mag(PRACTICE),
    practiceUnit = unit(PRACTICE),
    correct =
      Math.abs(Number(answers.m) - practiceLength) < 0.01 &&
      Math.abs(Number(answers.x) - practiceUnit.x) < 0.01 &&
      Math.abs(Number(answers.y) - practiceUnit.y) < 0.01;
  const interact = () => onInteraction(),
    update = (point: Point) => {
      setVector(point);
      interact();
    },
    reset = () => {
      setVector(INITIAL);
      setDragEnabled(true);
      setTab(0);
      setShared(false);
      setHint(false);
      setAnswers({ m: "", x: "", y: "" });
      setFeedback("");
      interact();
    };
  useEffect(() => {
    setVector(INITIAL);
    setDragEnabled(true);
    setTab(0);
    setShared(false);
    setHint(false);
    setAnswers({ m: "", x: "", y: "" });
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className="muv189-page"
      data-testid="vector-mockup-0246"
      data-dedicated-lesson="189"
      data-object-model="vector-components-pythagorean-magnitude-normalization-unit-circle-practice"
      data-vector={`${vector.x}:${vector.y}`}
      data-magnitude={length.toFixed(3)}
      data-unit={`${normalized.x.toFixed(3)}:${normalized.y.toFixed(3)}`}
      data-drag={dragEnabled}
      data-tab={tab}
      data-shared={shared}
      data-answers={`${answers.m}:${answers.x}:${answers.y}`}
      data-hint={hint}
      data-correct={correct}
      data-feedback={feedback}
    >
      <header className="muv189-header">
        <section>
          <div>
            <span>GEOMETRY</span>
            <span>VECTORS</span>
            <h1>Magnitude and Unit Vectors</h1>
            <p>Normalise vectors.</p>
          </div>
          <aside>
            <b>▥ Level &nbsp; Intermediate-Advanced</b>
            <b>◷ Time &nbsp; 6-10 min</b>
            <b>⌁ Tools &nbsp; Interactive</b>
          </aside>
        </section>
        <nav>
          {[
            ["Observe", "▣"],
            ["Manipulate", "⌘"],
            ["Pattern", "⌗"],
            ["Rule", "④"],
            ["Try", "◈"],
          ].map(([name, icon], index) => (
            <button
              key={name}
              className={tab === index ? "active" : ""}
              onClick={() => {
                setTab(index);
                document
                  .getElementById(
                    index === 4 ? "muv189-practice" : "muv189-model",
                  )
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                interact();
              }}
            >
              <i>{icon}</i>
              {name}
            </button>
          ))}
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `unit=<${normalized.x.toFixed(3)},${normalized.y.toFixed(3)}>`,
                );
                setShared(true);
                interact();
              }}
            >
              <Share2 />
              Share
            </button>
            <output>{shared ? "Copied" : ""}</output>
          </div>
        </nav>
      </header>
      <section className="muv189-main" id="muv189-model">
        <article className="muv189-model">
          <h2>Drag the vector or change its components</h2>
          <section>
            <VectorGraph
              vector={vector}
              dragEnabled={dragEnabled}
              onVector={update}
            />
            <aside>
              <article className="muv189-controls">
                <h3>Vector components</h3>
                {(["x", "y"] as const).map((axis, index) => (
                  <label key={axis}>
                    {index === 0 ? "a = x" : "b = y"}
                    <span>-5</span>
                    <input
                      aria-label={`Vector ${axis} component`}
                      type="range"
                      min="-5"
                      max="5"
                      value={vector[axis]}
                      onChange={(event) =>
                        update({ ...vector, [axis]: +event.target.value })
                      }
                    />
                    <span>5</span>
                    <input
                      aria-label={`Vector ${axis} value`}
                      type="number"
                      min="-5"
                      max="5"
                      value={vector[axis]}
                      onChange={(event) =>
                        update({
                          ...vector,
                          [axis]: clamp(+event.target.value),
                        })
                      }
                    />
                  </label>
                ))}
                <footer>
                  Or drag the tip of v{" "}
                  <input
                    aria-label="Enable vector dragging"
                    type="checkbox"
                    checked={dragEnabled}
                    onChange={() => {
                      setDragEnabled((value) => !value);
                      interact();
                    }}
                  />
                </footer>
              </article>
              <article className="muv189-pythagorean">
                <h3>Pythagorean triangle</h3>
                <p>Right triangle OPQ</p>
                <Triangle vector={vector} />
              </article>
            </aside>
          </section>
          <footer>
            <span>Vector v</span>
            <span>x-component (a)</span>
            <span>y-component (b)</span>
          </footer>
        </article>
        <aside className="muv189-observe">
          <h2>
            <Eye />
            What do you observe?
          </h2>
          <section>
            <div>
              <h3>Magnitude</h3>
              <MagnitudeGauge value={length} />
            </div>
            <article>
              <p>|v| = √(a² + b²)</p>
              <p>
                = √({vector.x}² + {vector.y}²)
              </p>
              <p>= {length.toFixed(2)}</p>
              <b>Angle with +x axis</b>
              <output>θ = {direction(vector).toFixed(1)}°</output>
            </article>
          </section>
          <article>
            <div>
              <h3>Unit vector û = v / |v|</h3>
              <output>
                〈ûₓ, ûᵧ〉 = 〈a/|v|, b/|v|〉
                <br />
                <b>
                  = ({normalized.x.toFixed(3)}, {normalized.y.toFixed(3)})
                </b>
              </output>
            </div>
            <div>
              <UnitCircle vector={vector} />
              <b>|û| = {mag(normalized).toFixed(2)}</b>
            </div>
          </article>
        </aside>
      </section>
      <section className="muv189-lower">
        <article>
          <h2>Worked example</h2>
          <p>Find the magnitude and unit vector of v = (-4, 3).</p>
          <output>|v| = √((-4)² + 3²) = √25 = 5</output>
          <output>û = v/|v| = 〈-4, 3〉/5 = 〈-0.8, 0.6〉</output>
        </article>
        <article>
          <h2>Key rule</h2>
          <p>For any vector v = 〈a,b〉,</p>
          <p>
            • <b>Magnitude:</b> |v| = √(a²+b²)
          </p>
          <p>
            • <b>Unit vector:</b> û = v/|v|, for v ≠ 0
          </p>
          <footer>
            A unit vector has magnitude 1 and the same direction as v.
          </footer>
        </article>
        <article id="muv189-practice">
          <h2>Try it yourself</h2>
          <p>Given v = 〈-2,5〉, find its magnitude and unit vector.</p>
          <p>Your answers</p>
          <section>
            <label>
              |v| ={" "}
              <input
                aria-label="Practice magnitude"
                value={answers.m}
                onChange={(event) => {
                  setAnswers({ ...answers, m: event.target.value });
                  setFeedback("");
                  interact();
                }}
                placeholder="Enter value"
              />
            </label>
            <label>
              û = 〈
              <input
                aria-label="Practice unit x"
                value={answers.x}
                onChange={(event) => {
                  setAnswers({ ...answers, x: event.target.value });
                  setFeedback("");
                  interact();
                }}
                placeholder="Enter"
              />
              ,{" "}
              <input
                aria-label="Practice unit y"
                value={answers.y}
                onChange={(event) => {
                  setAnswers({ ...answers, y: event.target.value });
                  setFeedback("");
                  interact();
                }}
                placeholder="Enter"
              />
              〉
            </label>
          </section>
          <div>
            <button
              onClick={() => {
                setFeedback(
                  correct
                    ? "Correct: |v|=√29 and û≈(-0.371,0.928)."
                    : "Not yet. Divide each component by √29.",
                );
                interact();
              }}
            >
              Check answer
            </button>
            <button
              onClick={() => {
                setHint((value) => !value);
                interact();
              }}
            >
              <Lightbulb />
              Hint
            </button>
          </div>
          {hint && <output>√((-2)²+5²)=√29≈5.385.</output>}
          <strong>{feedback}</strong>
        </article>
      </section>
      <nav className="muv189-nav">
        <a href="/lessons/geometry/188-scalar-multiplication">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Scalar Multiplication</b>
          </span>
        </a>
        <a href="/lessons/geometry/190-dot-product">
          <span>
            <small>Next</small>
            <b>Dot Product</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
