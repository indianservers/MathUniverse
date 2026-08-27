import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Check,
  ChevronDown,
  Languages,
  RefreshCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./CeilingFunctionTargetLesson147.css";

const round = (value: number, step: number) => Math.round(value / step) * step;
const clamp = (value: number, min: number, max: number, step: number) =>
  Math.max(min, Math.min(max, round(value, step)));
const tidy = (value: number, digits = 2) =>
  Number.isInteger(value)
    ? String(value)
    : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");

type GraphProps = {
  x: number;
  a: number;
  b: number;
  snap: boolean;
  onX: (value: number) => void;
};

function CeilingGraph({ x, a, b, snap, onX }: GraphProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (value: number) => 330 + value * 73;
  const py = (value: number) => 270 - value * 58;
  const output = Math.ceil(x + a) + b;
  const base = output - b;
  const left = base - 1 - a,
    right = base - a;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const value = (((event.clientX - box.left) / box.width) * 690 - 330) / 73;
    onX(clamp(value, -4.2, 4.2, snap ? 0.1 : 0.01));
  };
  return (
    <svg
      ref={svg}
      className="ceil147-graph"
      viewBox="0 0 690 470"
      role="img"
      aria-label="Ceiling function graph with draggable input probe"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="ceil147-grid"
          width="73"
          height="58"
          patternUnits="userSpaceOnUse"
        >
          <path d="M73 0H0V58" fill="none" stroke="#d8e0ea" />
        </pattern>
        <marker
          id="ceil147-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#51627b" />
        </marker>
      </defs>
      <rect width="690" height="470" fill="#fff" />
      <rect x="0" y="20" width="690" height="405" fill="url(#ceil147-grid)" />
      <rect
        x={px(left)}
        y="20"
        width={px(right) - px(left)}
        height="405"
        className="selected-band"
      />
      <line
        x1="5"
        x2="682"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#ceil147-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="425"
        y2="17"
        className="axis"
        markerEnd="url(#ceil147-arrow)"
      />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((v) => (
        <text key={`x${v}`} x={px(v) - 7} y={py(0) + 20}>
          {v}
        </text>
      ))}
      {[-2, -1, 1, 2, 3, 4].map((v) => (
        <text key={`y${v}`} x={px(0) - 22} y={py(v) + 5}>
          {v}
        </text>
      ))}
      {Array.from({ length: 8 }, (_, i) => i - 3).map((integer) => {
        const x1 = integer - 1 - a,
          x2 = integer - a,
          y = integer + b,
          active = integer === base;
        return (
          <g key={integer} className={active ? "active-step" : "step"}>
            <line x1={px(x1)} x2={px(x2)} y1={py(y)} y2={py(y)} />
            <circle
              className="open"
              cx={px(x1)}
              cy={py(y)}
              r={active ? 8 : 6}
            />
            <circle
              className="closed"
              cx={px(x2)}
              cy={py(y)}
              r={active ? 8 : 6}
            />
          </g>
        );
      })}
      <text
        x={Math.max(15, Math.min(565, px(left) + 5))}
        y="18"
        className="interval-label"
      >
        {tidy(left)} &lt; x ≤ {tidy(right)}
      </text>
      <line x1={px(x)} x2={px(x)} y1="22" y2="432" className="probe-line" />
      <line
        x1={px(x)}
        x2={px(x)}
        y1={py(0)}
        y2={py(output)}
        className="jump-arrow"
        markerEnd="url(#ceil147-orange-arrow)"
      />
      <defs>
        <marker
          id="ceil147-orange-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#f59e0b" />
        </marker>
      </defs>
      <rect
        x={Math.min(565, px(x) + 42)}
        y={py(output) + 32}
        width="98"
        height="40"
        rx="7"
        className="result-tag"
      />
      <text
        x={Math.min(575, px(x) + 52)}
        y={py(output) + 58}
        className="result-text"
      >
        ⌈{tidy(x + a)}⌉ = {output}
      </text>
      <path
        d={`M${px(x) - 8} 440L${px(x)} 425L${px(x) + 8} 440Z`}
        className="probe-star"
      />
      <rect
        x={px(x) - 36}
        y="442"
        width="72"
        height="28"
        rx="6"
        className="x-tag"
      />
      <text x={px(x)} y="461" textAnchor="middle" className="x-text">
        x = {tidy(x)}
      </text>
      <circle
        data-testid="ceiling-input-handle"
        cx={px(x)}
        cy={py(output)}
        r="13"
        className="probe-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag ceiling input probe"
        aria-valuemin={-4.2}
        aria-valuemax={4.2}
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          const step = snap ? 0.1 : 0.01;
          if (event.key === "ArrowRight") onX(clamp(x + step, -4.2, 4.2, step));
          if (event.key === "ArrowLeft") onX(clamp(x - step, -4.2, 4.2, step));
        }}
      />
    </svg>
  );
}

const examples = [-2.7, -1.2, 0, 0.6, 1.9, 2.3, 3, 3.7];

export default function CeilingFunctionTargetLesson147({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2.3),
    [a, setA] = useState(0),
    [b, setB] = useState(0),
    [snap, setSnap] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(true),
    [tableOpen, setTableOpen] = useState(true),
    [language, setLanguage] = useState("English (English)"),
    [notice, setNotice] = useState("");
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const reset = () => {
    setX(2.3);
    setA(0);
    setB(0);
    setSnap(true);
    setControlsOpen(true);
    setTableOpen(true);
    setLanguage("English (English)");
    setNotice("");
  };
  useEffect(reset, [resetToken]);
  const output = Math.ceil(x + a) + b,
    base = output - b,
    left = base - 1 - a,
    right = base - a;
  const rows = examples.map((value) => {
    const result = Math.ceil(value + a) + b,
      n = result - b;
    return { value, result, left: n - 1 - a, right: n - a };
  });
  return (
    <section
      className="ceil147-page"
      data-testid="graph-mockup-0204"
      data-dedicated-lesson="147"
      data-object-model="editable-ceiling-input-horizontal-and-vertical-shifts-snap-mode-pointer-keyboard-draggable-probe-clickable-generated-evaluation-table-upward-staircase-open-left-closed-right-endpoints-negative-input-correctness-floor-comparison-jump-model"
      data-x={x}
      data-input-shift={a}
      data-output-shift={b}
      data-result={output}
      data-interval={`${left},${right}`}
      data-snap={snap}
    >
      <header className="ceil147-header">
        <nav>
          ← Home › Lessons › Graphs And Functions ›<b>147 Ceiling Function</b>
        </nav>
        <div>
          <section>
            <h1>Ceiling Function</h1>
            <p>Understand upward rounding.</p>
          </section>
          <strong>least integer &gt;= x</strong>
          <aside>
            <b>ceil(2.3) = 3</b>
            <b>ceil(−1.2) = −1</b>
            <b>ceil(0) = 0</b>
          </aside>
        </div>
        <footer>
          <button
            onClick={() => {
              setLanguage((v) =>
                v.startsWith("English")
                  ? "हिन्दी (Hindi)"
                  : "English (English)",
              );
              onInteraction();
            }}
          >
            <Languages /> {language}
            <ChevronDown />
          </button>
          <button onClick={reset}>
            <RefreshCcw /> Reset
          </button>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              setNotice("Lesson link copied");
              onInteraction();
            }}
          >
            <Share2 /> Share
          </button>
        </footer>
      </header>
      <div className="ceil147-workspace">
        <main>
          <article className="ceil147-plot">
            <h2>Graph of y = ⌈x⌉ (Ceiling Function)</h2>
            <CeilingGraph x={x} a={a} b={b} snap={snap} onX={update(setX)} />
            <footer>
              <span>
                <i className="endpoint" /> Open left, closed right
              </span>
              <span>
                <i className="jump" /> Jump after each integer
              </span>
            </footer>
          </article>
          <p className="ceil147-rule">
            ⓘ For any real number x, ⌈x⌉ is the smallest integer greater than or
            equal to x.
          </p>
        </main>
        <aside className="ceil147-rail">
          <section className="ceil147-controls">
            <h2>
              Controls{" "}
              <button
                aria-label="Toggle controls"
                onClick={() => setControlsOpen((v) => !v)}
              >
                ⌃
              </button>
            </h2>
            {controlsOpen && (
              <div>
                <label>
                  Input shift (a)
                  <input
                    aria-label="Ceiling input shift"
                    type="range"
                    min="-5"
                    max="5"
                    step=".25"
                    value={a}
                    onChange={(e) => update(setA)(Number(e.target.value))}
                  />
                  <output>{tidy(a)}</output>
                </label>
                <label>
                  Output shift (b)
                  <input
                    aria-label="Ceiling output shift"
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={b}
                    onChange={(e) => update(setB)(Number(e.target.value))}
                  />
                  <output>{tidy(b)}</output>
                </label>
                <label className="snap">
                  Snap to integers{" "}
                  <button
                    role="switch"
                    aria-checked={snap}
                    aria-label="Snap ceiling input to tenths"
                    className={snap ? "on" : ""}
                    onClick={() => {
                      setSnap((v) => !v);
                      onInteraction();
                    }}
                  >
                    <i />
                  </button>
                  <small>Snap x to tenths for easy exploration.</small>
                </label>
              </div>
            )}
          </section>
          <section className="ceil147-table">
            <h2>
              Evaluation Table{" "}
              <button
                aria-label="Toggle evaluation table"
                onClick={() => setTableOpen((v) => !v)}
              >
                ⌃
              </button>
            </h2>
            {tableOpen && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>x</th>
                      <th>⌈x⌉</th>
                      <th>Interval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.value}
                        className={
                          Math.abs(row.value - x) < 0.001 ? "selected" : ""
                        }
                        onClick={() => update(setX)(row.value)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") update(setX)(row.value);
                        }}
                      >
                        <td>{row.value}</td>
                        <td>{row.result}</td>
                        <td>
                          {tidy(row.left)} &lt; x ≤ {tidy(row.right)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Click on any x value above to move the cursor to that
                  position.
                </p>
              </>
            )}
          </section>
        </aside>
      </div>
      <div className="ceil147-comparison">
        <article>
          <h2>↑ Ceiling Function (y = ⌈x⌉)</h2>
          <p>
            <Check /> Returns the least integer greater than or equal to x.
          </p>
          <p>
            <Check /> Graph is a step function.
          </p>
          <p>
            <Check /> Intervals are (n, n + 1] for each integer n.
          </p>
          <p>
            <Check /> Open circle on the left, filled circle on the right.
          </p>
        </article>
        <article>
          <h2>↓ Floor Function (y = ⌊x⌋)</h2>
          <p>
            <Check /> Returns the greatest integer less than or equal to x.
          </p>
          <p>
            <Check /> Graph is a step function.
          </p>
          <p>
            <Check /> Intervals are [n, n + 1) for each integer n.
          </p>
          <p>
            <Check /> Filled circle on the left, open circle on the right.
          </p>
        </article>
        <article className="difference">
          <h2>⚖ Key Difference</h2>
          <p>
            <b>Ceiling jumps up</b> after each integer.
          </p>
          <p>
            <b>Floor stays constant</b> until the next integer.
          </p>
          <div>
            {[-2, -1, 0, 1, 2].map((v) => (
              <span key={v}>
                <i>↑</i>
                {v}
              </span>
            ))}
          </div>
        </article>
      </div>
      {notice && (
        <button className="ceil147-notice" onClick={() => setNotice("")}>
          {notice}
        </button>
      )}
    </section>
  );
}
