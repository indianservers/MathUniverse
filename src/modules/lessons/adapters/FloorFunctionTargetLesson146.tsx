import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  HelpCircle,
  RotateCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./FloorFunctionTargetLesson146.css";

const clamp = (value: number, min: number, max: number, step: number) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const format = (value: number, digits = 2) =>
  Number.isInteger(value)
    ? String(value)
    : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");

function FloorGraph({
  x,
  inputShift,
  outputShift,
  onX,
}: {
  x: number;
  inputShift: number;
  outputShift: number;
  onX: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (value: number) => 390 + value * 59;
  const py = (value: number) => 190 - value * 39;
  const steps = Array.from({ length: 10 }, (_, i) => i - 4);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    onX(
      clamp(
        (((event.clientX - box.left) / box.width) * 780 - 390) / 59,
        -5,
        5.999,
        0.01,
      ),
    );
  };
  const n = Math.floor(x + inputShift);
  const left = n - inputShift;
  const right = left + 1;
  return (
    <svg
      ref={svg}
      className="floor146-graph"
      viewBox="0 0 780 380"
      role="img"
      aria-label="Floor function staircase with draggable input probe"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="floor146-grid"
          width="59"
          height="39"
          patternUnits="userSpaceOnUse"
        >
          <path d="M59 0H0V39" fill="none" stroke="#243449" />
        </pattern>
        <marker
          id="floor146-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#aeb9c8" />
        </marker>
      </defs>
      <rect width="780" height="380" fill="#091522" />
      <rect width="780" height="380" fill="url(#floor146-grid)" />
      <line
        x1="12"
        x2="770"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#floor146-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="366"
        y2="10"
        className="axis"
        markerEnd="url(#floor146-arrow)"
      />
      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((v) => (
        <text key={`x${v}`} x={px(v) - 5} y={py(0) + 22}>
          {v}
        </text>
      ))}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => (
        <text key={`y${v}`} x={px(0) - 24} y={py(v) + 4}>
          {v}
        </text>
      ))}
      {steps.map((integer) => {
        const x1 = integer - inputShift,
          x2 = x1 + 1,
          y = integer + outputShift;
        const active = integer === n;
        return (
          <g key={integer} className={active ? "active-step" : "step"}>
            <line x1={px(x1)} x2={px(x2)} y1={py(y)} y2={py(y)} />
            <circle
              cx={px(x1)}
              cy={py(y)}
              r={active ? 7 : 5}
              className="closed"
            />
            <circle
              cx={px(x2)}
              cy={py(y)}
              r={active ? 7 : 5}
              className="open"
            />
          </g>
        );
      })}
      <line x1={px(x)} x2={px(x)} y1="14" y2="365" className="probe" />
      <text
        x={Math.min(655, Math.max(20, px(left) + 9))}
        y={Math.max(25, py(n + outputShift) - 38)}
        className="interval-label"
      >
        Interval [{format(left)}, {format(right)})
      </text>
      <circle
        data-testid="floor-input-handle"
        cx={px(x)}
        cy={py(n + outputShift)}
        r="12"
        className="probe-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag floor input probe"
        aria-valuemin={-5}
        aria-valuemax={5.99}
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onX(clamp(x + 0.01, -5, 5.99, 0.01));
          if (event.key === "ArrowLeft") onX(clamp(x - 0.01, -5, 5.99, 0.01));
        }}
      />
    </svg>
  );
}

export default function FloorFunctionTargetLesson146({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2.73),
    [inputShift, setInputShift] = useState(0),
    [outputShift, setOutputShift] = useState(0);
  const [fullscreen, setFullscreen] = useState(false),
    [challengeSeed, setChallengeSeed] = useState(0);
  const [activeTab, setActiveTab] = useState("LAB"),
    [checked, setChecked] = useState([true, true, true, true]),
    [notice, setNotice] = useState("");
  const setValue = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const reset = () => {
    setX(2.73);
    setInputShift(0);
    setOutputShift(0);
    setChallengeSeed(0);
    setActiveTab("LAB");
    setChecked([true, true, true, true]);
    setNotice("");
  };
  useEffect(reset, [resetToken]);
  const result = Math.floor(x + inputShift) + outputShift;
  const n = Math.floor(x + inputShift),
    left = n - inputShift,
    right = left + 1;
  const rows = [-2, -1, 0, 1, 2, 3].map((integer) => ({
    integer,
    left: integer - inputShift,
    right: integer + 1 - inputShift,
    sample: integer + 0.63 - inputShift,
    output: integer + outputShift,
  }));
  const questions = [-0.8, 4, 5.999, -3.001].map((value) => ({
    value,
    answer: Math.floor(value + inputShift) + outputShift,
  }));
  return (
    <section
      className={`floor146-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0203"
      data-dedicated-lesson="146"
      data-object-model="editable-floor-input-horizontal-and-vertical-shifts-pointer-keyboard-draggable-probe-generated-staircase-number-line-interval-table-closed-left-open-right-endpoints-negative-input-correctness-real-challenge-discontinuity-diagnostics"
      data-x={x}
      data-input-shift={inputShift}
      data-output-shift={outputShift}
      data-result={result}
      data-interval={`${left},${right}`}
      data-active-tab={activeTab}
    >
      <header className="floor146-header">
        <nav>
          <small>
            Functions › Piecewise Functions › Step Functions ›
            <b>Floor Function</b>
          </small>
          <div>
            <button
              aria-label="Share floor function lesson"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                setNotice("Lesson link copied");
                onInteraction();
              }}
            >
              <Share2 /> Share
            </button>
            <button
              onClick={() => setFullscreen((v) => !v)}
              aria-label="Toggle fullscreen"
            >
              <Expand />
            </button>
          </div>
        </nav>
        <div className="floor146-title">
          <div className="floor146-icon">⌟</div>
          <div>
            <h1>Floor Function</h1>
            <p>Greatest integer ≤ x</p>
          </div>
          <strong>y = ⌊x⌋</strong>
          <p>
            The floor function returns the{" "}
            <em>greatest integer less than or equal to x</em>.
          </p>
        </div>
        <div className="floor146-tabs">
          {[
            "LAB",
            "DEFINITION",
            "EXAMPLES",
            "PROPERTIES",
            "PROOFS",
            "CHALLENGES",
          ].map((tab) => (
            <button
              className={activeTab === tab ? "active" : ""}
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setNotice(`${tab.toLowerCase()} view selected`);
                onInteraction();
              }}
            >
              {tab}
            </button>
          ))}
          <button onClick={reset}>
            <RotateCcw /> Reset Lab
          </button>
          <button
            onClick={() => {
              setNotice(
                "Drag the yellow probe or use arrow keys; every step is [left, right).",
              );
              onInteraction();
            }}
          >
            <HelpCircle /> Help
          </button>
        </div>
      </header>
      <div className="floor146-layout">
        <main>
          <article className="floor146-plot">
            <FloorGraph
              x={x}
              inputShift={inputShift}
              outputShift={outputShift}
              onX={setValue(setX)}
            />
          </article>
          <article className="floor146-number">
            <h2>NUMBER LINE VIEW</h2>
            <div className="floor146-line">
              <i />
              <span
                className="floor146-line-probe"
                style={{ left: `${8 + ((x + 5) / 10) * 84}%` }}
              />
              {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((v) => (
                <b key={v} style={{ left: `${8 + ((v + 5) / 10) * 84}%` }}>
                  {v}
                </b>
              ))}
            </div>
            <strong>x = {format(x)}</strong>
          </article>
          <div className="floor146-bottom">
            <article className="floor146-table">
              <h2>INTERVAL TABLE</h2>
              <table>
                <thead>
                  <tr>
                    <th>Interval</th>
                    <th>x (example)</th>
                    <th>floor(x)</th>
                    <th>Graph</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      className={row.integer === n ? "selected" : ""}
                      key={row.integer}
                    >
                      <td>
                        [{format(row.left)}, {format(row.right)})
                      </td>
                      <td>{format(row.sample)}</td>
                      <td>{row.output}</td>
                      <td>
                        <span>●━━○</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="floor146-challenge">
              <h2>★ QUICK CHALLENGE</h2>
              <p>Find the floor(x) values.</p>
              {questions.map((q, i) => (
                <div key={`${challengeSeed}-${q.value}`}>
                  <span>
                    {i + 1}) x = {q.value}
                  </span>
                  <output>{q.answer}</output>
                  <button
                    onClick={() => {
                      setChecked((values) =>
                        values.map((value, index) =>
                          index === i ? true : value,
                        ),
                      );
                      onInteraction();
                    }}
                  >
                    Check
                  </button>
                  {checked[i] && <Check />}
                </div>
              ))}
              <button
                className="new"
                onClick={() => {
                  setChallengeSeed((v) => v + 1);
                  setX(questions[challengeSeed % 4].value);
                  setChecked([false, false, false, false]);
                  onInteraction();
                }}
              >
                ↻ New Challenge
              </button>
            </article>
            <article className="floor146-takeaways">
              <h2>KEY TAKEAWAYS</h2>
              <ul>
                <li>The floor function returns the greatest integer ≤ x.</li>
                <li>Each step is constant on [n, n + 1).</li>
                <li>Closed on the left, open on the right.</li>
                <li>There is a jump discontinuity at every integer.</li>
                <li>Domain: ℝ; Range: ℤ</li>
              </ul>
            </article>
          </div>
        </main>
        <aside className="floor146-rail">
          <section>
            <h2>INPUT / OUTPUT</h2>
            <div className="floor146-input">
              <button
                onClick={() => setValue(setX)(clamp(x - 0.01, -5, 5.99, 0.01))}
              >
                <ChevronLeft />
              </button>
              <strong>x = {format(x)}</strong>
              <button
                onClick={() => setValue(setX)(clamp(x + 0.01, -5, 5.99, 0.01))}
              >
                <ChevronRight />
              </button>
            </div>
            <input
              aria-label="Floor input x"
              type="range"
              min="-5"
              max="5.99"
              step=".01"
              value={x}
              onChange={(e) => setValue(setX)(Number(e.target.value))}
            />
            <output>
              ⌊{format(x + inputShift)}⌋ + {outputShift} = <b>{result}</b>
            </output>
          </section>
          <section>
            <h2>TRANSFORMATIONS</h2>
            <label>
              Input shift = {format(inputShift)}
              <input
                aria-label="Input shift"
                type="range"
                min="-5"
                max="5"
                step=".25"
                value={inputShift}
                onChange={(e) =>
                  setValue(setInputShift)(Number(e.target.value))
                }
              />
            </label>
            <label>
              Output shift = {format(outputShift)}
              <input
                aria-label="Output shift"
                type="range"
                min="-5"
                max="5"
                step="1"
                value={outputShift}
                onChange={(e) =>
                  setValue(setOutputShift)(Number(e.target.value))
                }
              />
            </label>
            <button
              onClick={() => {
                setInputShift(0);
                setOutputShift(0);
                onInteraction();
              }}
            >
              <RotateCcw /> Reset Transforms
            </button>
          </section>
          <section className="floor146-endpoints">
            <h2>ENDPOINT CONVENTION</h2>
            <p>
              <i className="closed" /> Closed left endpoint [ included
            </p>
            <p>
              <i className="open" /> Open right endpoint ) excluded
            </p>
            <footer>
              STEP_ENDPOINTS_REQUIRED <Check />
            </footer>
          </section>
          <section className="floor146-diagnostic">
            <h2>DISCONTINUITY DIAGNOSTICS</h2>
            <strong>▣ Jump discontinuity</strong>
            <p>At every integer n, the function jumps from n − 1 to n.</p>
            <p>
              Selected interval: [{format(left)}, {format(right)})
            </p>
            <p>Left limit: {n - 1 + outputShift}</p>
            <p>Right limit: {n + outputShift}</p>
          </section>
        </aside>
        {notice && (
          <button className="floor146-notice" onClick={() => setNotice("")}>
            {notice}
          </button>
        )}
      </div>
    </section>
  );
}
