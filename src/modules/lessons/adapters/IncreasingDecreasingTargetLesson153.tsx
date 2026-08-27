import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Check, Info, RotateCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./IncreasingDecreasingTargetLesson153.css";

type Motion = "increasing" | "decreasing" | "stationary";
const clamp = (value: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 2) =>
  Math.abs(value) < 0.000001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const integralBase = (x: number) => x ** 3 / 3 - x ** 2 / 2 - 2 * x;
const modelAt = (x: number, strength: number, shift: number) => {
  const scale = strength / 8,
    value = scale * (integralBase(x) - integralBase(2)) - 0.55 + shift,
    derivative = scale * (x + 1) * (x - 2),
    motion: Motion =
      Math.abs(derivative) < 0.00001
        ? "stationary"
        : derivative > 0
          ? "increasing"
          : "decreasing";
  return { value, derivative, motion };
};

function MonotonicGraph({
  strength,
  shift,
  x,
  onX,
}: {
  strength: number;
  shift: number;
  x: number;
  onX: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (value: number) => 325 + value * 64,
    py = (value: number) => 238 - value * 62,
    point = modelAt(x, strength, shift),
    maximum = modelAt(-1, strength, shift),
    minimum = modelAt(2, strength, shift);
  const path = Array.from({ length: 241 }, (_, index) => {
    const input = -4.6 + index * 0.04;
    return `${index ? "L" : "M"}${px(input)},${py(modelAt(input, strength, shift).value)}`;
  }).join(" ");
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const next = (((event.clientX - box.left) / box.width) * 650 - 325) / 64;
    onX(clamp(next, -5, 5));
  };
  return (
    <svg
      ref={svg}
      className="mono153-graph"
      viewBox="0 0 650 410"
      role="img"
      aria-label="Cubic graph split into increasing and decreasing intervals"
      onPointerMove={updateFromPointer}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="mono153-grid"
          width="64"
          height="62"
          patternUnits="userSpaceOnUse"
        >
          <path d="M64 0H0V62" fill="none" stroke="#dfe7ef" />
        </pattern>
        <clipPath id="mono153-clip">
          <rect width="650" height="410" />
        </clipPath>
        <marker
          id="mono153-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#263650" />
        </marker>
        <marker
          id="mono153-cyan-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#049caf" />
        </marker>
        <marker
          id="mono153-pink-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#ed2d6f" />
        </marker>
      </defs>
      <rect width="650" height="410" fill="#fff" />
      <rect x="0" width={px(-1)} height="410" fill="#eafafb" />
      <rect x={px(-1)} width={px(2) - px(-1)} height="410" fill="#fff0f4" />
      <rect x={px(2)} width={650 - px(2)} height="410" fill="#eafafb" />
      <rect width="650" height="410" fill="url(#mono153-grid)" />
      <g className="mono153-ticks">
        {[-4, -3, -2, -1, 1, 2, 3, 4, 5].map((tick) => (
          <text
            key={`x${tick}`}
            x={px(tick)}
            y={py(0) + 22}
            textAnchor="middle"
          >
            {tick}
          </text>
        ))}
        {[-2, -1, 1, 2, 3].map((tick) => (
          <text
            key={`y${tick}`}
            x={px(0) - 12}
            y={py(tick) + 4}
            textAnchor="end"
          >
            {tick}
          </text>
        ))}
      </g>
      <line
        x1="0"
        x2="646"
        y1={py(0)}
        y2={py(0)}
        className="mono153-axis"
        markerEnd="url(#mono153-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="410"
        y2="5"
        className="mono153-axis"
        markerEnd="url(#mono153-axis-arrow)"
      />
      <text x="635" y={py(0) - 10} className="mono153-axis-name">
        x
      </text>
      <text x={px(0) + 10} y="16" className="mono153-axis-name">
        y
      </text>
      <g clipPath="url(#mono153-clip)">
        <path d={path} className="mono153-curve" />
        <line
          x1={px(-1)}
          x2={px(-1)}
          y1={py(0)}
          y2={py(maximum.value)}
          className="mono153-turn-guide"
        />
        <line
          x1={px(2)}
          x2={px(2)}
          y1={py(0)}
          y2={py(minimum.value)}
          className="mono153-turn-guide"
        />
        <line
          x1={px(x)}
          x2={px(x)}
          y1={py(0)}
          y2={py(point.value)}
          className="mono153-probe-guide"
        />
      </g>
      <text x={px(-2.7)} y="58" className="mono153-positive">
        f′(x) &gt; 0
      </text>
      <text x={px(0.6)} y="58" className="mono153-negative">
        f′(x) &lt; 0
      </text>
      <text x={px(3.55)} y="58" className="mono153-positive">
        f′(x) &gt; 0
      </text>
      <line
        x1={px(-3)}
        y1={py(modelAt(-3, strength, shift).value)}
        x2={px(-2)}
        y2={py(modelAt(-2, strength, shift).value)}
        className="mono153-rise-arrow"
        markerEnd="url(#mono153-cyan-arrow)"
      />
      <line
        x1={px(0.25)}
        y1={py(modelAt(0.25, strength, shift).value)}
        x2={px(1.25)}
        y2={py(modelAt(1.25, strength, shift).value)}
        className="mono153-fall-arrow"
        markerEnd="url(#mono153-pink-arrow)"
      />
      <line
        x1={px(3.2)}
        y1={py(modelAt(3.2, strength, shift).value)}
        x2={px(4.1)}
        y2={py(modelAt(4.1, strength, shift).value)}
        className="mono153-rise-arrow"
        markerEnd="url(#mono153-cyan-arrow)"
      />
      <circle
        cx={px(-1)}
        cy={py(maximum.value)}
        r="6"
        className="mono153-extreme"
      />
      <circle
        cx={px(2)}
        cy={py(minimum.value)}
        r="6"
        className="mono153-extreme"
      />
      <g className="mono153-callout">
        <rect
          x={px(-1) - 126}
          y={py(maximum.value) - 58}
          width="110"
          height="49"
          rx="8"
        />
        <text x={px(-1) - 71} y={py(maximum.value) - 37} textAnchor="middle">
          Local maximum
        </text>
        <text x={px(-1) - 71} y={py(maximum.value) - 20} textAnchor="middle">
          x = -1
        </text>
        <rect
          x={px(2) - 116}
          y={py(minimum.value) + 10}
          width="108"
          height="49"
          rx="8"
        />
        <text x={px(2) - 62} y={py(minimum.value) + 31} textAnchor="middle">
          Local minimum
        </text>
        <text x={px(2) - 62} y={py(minimum.value) + 48} textAnchor="middle">
          x = 2
        </text>
      </g>
      <circle
        cx={px(x)}
        cy={py(point.value)}
        r="9"
        className={`mono153-probe ${point.motion}`}
        role="slider"
        tabIndex={0}
        aria-label="Drag monotonicity x cursor"
        aria-valuemin="-5"
        aria-valuemax="5"
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          onX(clamp(x + (event.key === "ArrowRight" ? 0.1 : -0.1), -5, 5));
        }}
      />
    </svg>
  );
}

export default function IncreasingDecreasingTargetLesson153({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [strength, setStrength] = useState(3),
    [shift, setShift] = useState(0),
    [x, setX] = useState(-0.5);
  const act = () => onInteraction(),
    reset = () => {
      setStrength(3);
      setShift(0);
      setX(-0.5);
      act();
    };
  useEffect(() => {
    setStrength(3);
    setShift(0);
    setX(-0.5);
  }, [resetToken]);
  const point = modelAt(x, strength, shift),
    maximum = modelAt(-1, strength, shift),
    minimum = modelAt(2, strength, shift);
  const updateX = (value: number) => {
    setX(clamp(value, -5, 5));
    act();
  };
  const status =
    point.motion === "increasing"
      ? {
          title: "Increasing",
          detail: `At x = ${tidy(x)}, f′(x) > 0.`,
          color: "positive",
        }
      : point.motion === "decreasing"
        ? {
            title: "Decreasing",
            detail: `At x = ${tidy(x)}, f′(x) < 0.`,
            color: "negative",
          }
        : {
            title: "Turning point",
            detail: `At x = ${tidy(x)}, f′(x) = 0.`,
            color: "stationary",
          };
  return (
    <div
      className="mono153-page"
      data-testid="graph-mockup-0210"
      data-dedicated-lesson="153"
      data-object-model="editable-cubic-turning-strength-vertical-shift-pointer-keyboard-draggable-x-cursor-generated-extrema-monotonic-regions-derivative-sign-strip-interval-summary-live-slope-classification"
      data-strength={strength}
      data-shift={shift}
      data-x={x}
      data-value={point.value}
      data-derivative={point.derivative}
      data-motion={point.motion}
      data-maximum={maximum.value}
      data-minimum={minimum.value}
    >
      <main className="mono153-surface">
        <header className="mono153-header">
          <h1>Increasing and Decreasing</h1>
          <p>Identify monotonic intervals.</p>
        </header>
        <section className="mono153-top">
          <section className="mono153-explorer">
            <header>
              <div>
                <h2>Graph exploration</h2>
                <p>
                  Drag the x cursor or adjust controls to explore where the
                  function is increasing or decreasing.
                </p>
              </div>
              <button type="button" onClick={reset}>
                <RotateCcw size={15} /> Reset view
              </button>
            </header>
            <MonotonicGraph
              strength={strength}
              shift={shift}
              x={x}
              onX={updateX}
            />
            <div className="mono153-sign-strip">
              <b>f′(x):</b>
              <span>+</span>
              <i>
                0<small>x = -1</small>
              </i>
              <span className="down">−</span>
              <i>
                0<small>x = 2</small>
              </i>
              <span>+</span>
            </div>
            <section className="mono153-intervals">
              <h2>Monotonic intervals</h2>
              <p>Intervals where the function is increasing or decreasing.</p>
              <div>
                <button type="button" onClick={() => updateX(-2)}>
                  <b>Increasing</b>(−∞, −1)
                </button>
                <button type="button" onClick={() => updateX(0.5)}>
                  <b>Decreasing</b>(−1, 2)
                </button>
                <button type="button" onClick={() => updateX(3)}>
                  <b>Increasing</b>(2, ∞)
                </button>
              </div>
            </section>
          </section>
          <aside className="mono153-controls">
            <h2>Function (cubic)</h2>
            <p className="mono153-formula">
              f′(x) = {tidy(strength)}/8 (x + 1)(x − 2)
            </p>
            <label>
              Turning strength <Info size={13} />
              <div>
                <input
                  aria-label="Cubic turning strength"
                  type="range"
                  min="0"
                  max="5"
                  step=".25"
                  value={strength}
                  onChange={(event) => {
                    setStrength(Number(event.target.value));
                    act();
                  }}
                />
                <output>{tidy(strength)}</output>
              </div>
              <small>
                0 <span>5</span>
              </small>
            </label>
            <label>
              Vertical shift <Info size={13} />
              <div>
                <input
                  aria-label="Cubic vertical shift"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={shift}
                  onChange={(event) => {
                    setShift(Number(event.target.value));
                    act();
                  }}
                />
                <output>{tidy(shift)}</output>
              </div>
              <small>
                -5 <span>5</span>
              </small>
            </label>
            <label>
              x cursor <Info size={13} />
              <div>
                <input
                  aria-label="Monotonicity x cursor"
                  type="range"
                  min="-5"
                  max="5"
                  step=".1"
                  value={x}
                  onChange={(event) => updateX(Number(event.target.value))}
                />
                <output>{tidy(x)}</output>
              </div>
              <small>
                -5 <span>5</span>
              </small>
            </label>
            <div className="mono153-values">
              <span>
                <small>f(x)</small>
                {tidy(point.value)}
              </span>
              <span>
                <small>f′(x)</small>
                {tidy(point.derivative)}
              </span>
              <span>
                <small>Slope</small>
                {point.motion === "stationary"
                  ? "Zero"
                  : point.derivative > 0
                    ? "Positive"
                    : "Negative"}
              </span>
            </div>
            <div className={`mono153-status ${status.color}`}>
              <i>
                <Check size={25} />
              </i>
              <span>
                <b>{status.title}</b>
                <small>
                  {status.detail}
                  <br />
                  The function is {point.motion}.
                </small>
              </span>
            </div>
          </aside>
        </section>
        <section className="mono153-bottom">
          <article>
            <h2>Read from left to right</h2>
            <p className="up">
              ↗ <b>Increasing</b>
              <span>f′(x) &gt; 0</span>
            </p>
            <p className="down">
              ↘ <b>Decreasing</b>
              <span>f′(x) &lt; 0</span>
            </p>
            <p className="turn">
              ● <b>Local maximum / Local minimum</b>
              <span>f′(x) = 0 (turning points)</span>
            </p>
          </article>
          <article>
            <h2>Derivative sign summary</h2>
            <div className="mono153-mini-strip">
              <span>+</span>
              <i>
                0<small>x = −1</small>
              </i>
              <span>−</span>
              <i>
                0<small>x = 2</small>
              </i>
              <span>+</span>
            </div>
            <p>f′(x) &gt; 0 on (−∞, −1) and (2, ∞)</p>
            <p>f′(x) &lt; 0 on (−1, 2)</p>
          </article>
        </section>
      </main>
    </div>
  );
}
