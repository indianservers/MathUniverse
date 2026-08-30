import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ContinuityAtPointTargetLesson281.css";
import "./ContinuityAtPointTargetLesson281Fit.css";

const curve = (x: number) => 2 * x * x;
export default function ContinuityAtPointTargetLesson281({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(0),
    [pointValue, setPointValue] = useState(-1),
    [dragging, setDragging] = useState(false),
    [choice, setChoice] = useState("0"),
    [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("correct"),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0);
  const limit = curve(a),
    continuous = Math.abs(pointValue - limit) < 1e-8;
  const reset = () => {
    setA(0);
    setPointValue(-1);
    setDragging(false);
    setChoice("0");
    setFeedback("correct");
    setTab("Interaction + visualization");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  return (
    <section
      className="cap281-page"
      data-testid="calculus-mockup-0360"
      data-dedicated-lesson="281"
      data-object-model="parabola-removable-hole-editable-point-five-condition-continuity-drag-practice"
      data-a={a}
      data-limit={limit}
      data-point-value={pointValue}
      data-continuous={continuous}
      data-feedback={feedback}
      data-actions={actions}
    >
      <span className="sr-only">Continuity at a point</span>
      <header className="cap281-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Continuity at a Point</h1>
        <p>Compare limit and actual value.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>⚡ Calculus Lab</i>
          <i>▣ Derivative / Limit / CAS</i>
          <i>◷ 6–10 min</i>
        </div>
        <div className="actions">
          <button data-lesson-control="language">⚒ English (English)⌄</button>
          <button data-lesson-control="reset" onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            data-lesson-control="share"
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `a=${a}, limit=${limit}, f(a)=${pointValue}, continuous=${continuous}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">↗ Workspace</a>
        </div>
      </header>
      <nav className="cap281-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            data-lesson-control={`tab-${name}`}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cap281-flow">
        <b>HOW TO EXPLORE</b>
        {[
          [Eye, "1. Observe", "Look at the graph near the marked point."],
          [
            Hand,
            "2. Manipulate",
            "Drag the blue hole (limit) and the orange point (value).",
          ],
          [
            Lightbulb,
            "3. Notice",
            "Watch left limit, right limit, and f(a) update instantly.",
          ],
          [
            Check,
            "4. Understand",
            "Make f(a) equal to the limit and see continuity achieved.",
          ],
        ].map(([Icon, title, copy]) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="cap281-lab">
        <header>
          <div>
            <b>WORK DIRECTLY ON THE MODEL</b>
            <h2>Continuity at a Point - graph + CAS</h2>
          </div>
          <span className={continuous ? "yes" : "no"}>
            Continuous? {continuous ? "✓ Yes" : "✕ No"}
          </span>
        </header>
        <div className="cap281-model">
          <div className="cap281-graph">
            <ContinuityGraph
              a={a}
              pointValue={pointValue}
              dragging={dragging}
              setDragging={setDragging}
              setPointValue={(value) => act(() => setPointValue(value))}
            />
            <div className="legend">
              <span>○ Limit (hole)</span>
              <span>● Function value</span>
            </div>
          </div>
          <aside className="checks">
            <h3>CHECK CONTINUITY AT x = {a}</h3>
            <CheckRow
              n="1"
              title="Left-hand limit"
              value={`lim x→${a}⁻ f(x) = ${limit}`}
              ok
            />
            <CheckRow
              n="2"
              title="Right-hand limit"
              value={`lim x→${a}⁺ f(x) = ${limit}`}
              ok
            />
            <CheckRow
              n="3"
              title="Limit exists"
              value={`Yes, since ${limit} = ${limit}`}
              ok
            />
            <CheckRow
              n="4"
              title="Function value"
              value={`f(${a}) = ${pointValue}`}
              ok={continuous}
            />
            <CheckRow
              n="5"
              title="Continuity"
              value={
                continuous
                  ? `Continuous because limit = f(${a})`
                  : `Not continuous because limit ≠ f(${a})`
              }
              ok={continuous}
            />
          </aside>
        </div>
        <div className="cap281-controls">
          <article>
            <h3>Drag to manipulate</h3>
            <p>○ Limit (hole)</p>
            <p>● Function value</p>
          </article>
          <article>
            <h3>Adjust sliders</h3>
            <label>
              a (x-value)
              <input
                aria-label="Continuity point a"
                data-lesson-control="a-slider"
                type="range"
                min="-1"
                max="1"
                step=".1"
                value={a}
                onChange={(event) =>
                  act(() => setA(Number(event.target.value)))
                }
              />
              <output>{a.toFixed(1)}</output>
            </label>
            <label>
              f(a) value
              <input
                aria-label="Function value at a"
                data-lesson-control="value-slider"
                type="range"
                min="-3"
                max="3"
                step=".1"
                value={pointValue}
                onChange={(event) =>
                  act(() => setPointValue(Number(event.target.value)))
                }
              />
              <output>{pointValue.toFixed(1)}</output>
            </label>
          </article>
          <article>
            <h3>Domain</h3>
            <p>(−∞,∞)</p>
            <h3>Range</h3>
            <p>
              [0,∞), except value at x={a} is {pointValue}
            </p>
          </article>
        </div>
      </section>
      <section className="cap281-concept">
        <div>
          <h3>THE CONCEPT</h3>
          <p>
            A function f is continuous at a if and only if these three
            conditions hold.
          </p>
          <ol>
            <li>lim x→a⁻ f(x) exists</li>
            <li>lim x→a⁺ f(x) exists and are equal</li>
            <li>lim x→a f(x) = f(a)</li>
          </ol>
        </div>
        <aside>
          <h3>Continuity rule (equivalent form)</h3>
          <p>f is continuous at a if</p>
          <output>lim x→a f(x) = lim x→a⁺ f(x) = f(a)</output>
        </aside>
      </section>
      <section className="cap281-learning">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>
            <b>Example:</b> For f(x)=2x², check continuity at x=3.
          </p>
          <p>1. lim x→3⁻ 2x² = 18</p>
          <p>2. lim x→3⁺ 2x² = 18</p>
          <p>3. f(3)=18</p>
          <output>✓ Since 18=18=18, it is continuous at x=3.</output>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> COMMON MISCONCEPTION
          </h3>
          <p>
            <b>
              “Left and right limits are equal, so the function is continuous.”
            </b>
          </p>
          <p>
            You must also check that f(a) equals the common limit. A hole or a
            different filled value breaks continuity.
          </p>
          <MiniDiscontinuity />
        </article>
        <article className="practice">
          <h3>QUICK PRACTICE</h3>
          <p>
            <b>Challenge:</b> Make f continuous at x=0.
          </p>
          <p>Move the orange point to the correct f(0).</p>
          <MiniPractice choice={Number(choice)} />
          {["-1", "0", "1", "2"].map((value, index) => (
            <label key={value} className={choice === value ? "selected" : ""}>
              <input
                type="radio"
                name="continuity-answer"
                value={value}
                checked={choice === value}
                onChange={() => {
                  setChoice(value);
                  setFeedback("");
                }}
              />
              {String.fromCharCode(65 + index)} {value}
            </label>
          ))}
          <button
            data-lesson-control="practice-check"
            onClick={() =>
              act(() => setFeedback(choice === "0" ? "correct" : "incorrect"))
            }
          >
            Check
          </button>
          <button
            data-lesson-control="practice-reset"
            onClick={() =>
              act(() => {
                setChoice("-1");
                setFeedback("");
              })
            }
          >
            Reset
          </button>
          <output className={feedback}>
            {feedback === "correct"
              ? "Correct! Set f(0)=0 so the limit equals f(0)."
              : feedback === "incorrect"
                ? "The limit of 2x² at zero is 0."
                : ""}
          </output>
        </article>
      </section>
      <nav className="cap281-nav">
        <a href="/lessons/calculus/280-limits-at-infinity">
          <ArrowLeft />
          <span>
            <small>Previous</small>Limits at Infinity
          </span>
        </a>
        <a href="/lessons/calculus/282-types-of-discontinuity">
          <span>
            <small>Next</small>Types of Discontinuity
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function CheckRow({
  n,
  title,
  value,
  ok,
}: {
  n: string;
  title: string;
  value: string;
  ok: boolean;
}) {
  return (
    <article className={ok ? "ok" : "bad"}>
      <b>{n}</b>
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
      <strong>{ok ? "✓" : "✕"}</strong>
    </article>
  );
}
function ContinuityGraph({
  a,
  pointValue,
  dragging,
  setDragging,
  setPointValue,
}: {
  a: number;
  pointValue: number;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  setPointValue: (value: number) => void;
}) {
  const w = 500,
    h = 350,
    sx = (x: number) => w / 2 + x * 55,
    sy = (y: number) => h / 2 - y * 43,
    path = Array.from({ length: 161 }, (_, i) => {
      const x = -2 + i * 0.025;
      return `${i ? "L" : "M"}${sx(x)} ${sy(curve(x))}`;
    }).join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Parabola with draggable function value and removable hole"
      onPointerMove={(event) => {
        if (!dragging) return;
        const bounds = event.currentTarget.getBoundingClientRect(),
          y = 4 - ((event.clientY - bounds.top) / bounds.height) * 8;
        setPointValue(Math.max(-3, Math.min(3, Number(y.toFixed(1)))));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`v${i}`}
          className="grid"
          x1={i * 50}
          y1="0"
          x2={i * 50}
          y2={h}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          className="grid"
          x1="0"
          y1={i * 44}
          x2={w}
          y2={i * 44}
        />
      ))}
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      {Array.from({ length: 9 }, (_, index) => index - 4).map((value) => (
        <g key={`xt${value}`}>
          <line
            className="tick"
            x1={sx(value)}
            y1={sy(0) - 4}
            x2={sx(value)}
            y2={sy(0) + 4}
          />
          {value !== 0 && (
            <text className="tick-label" x={sx(value)} y={sy(0) + 18}>
              {value}
            </text>
          )}
        </g>
      ))}
      {Array.from({ length: 9 }, (_, index) => index - 4).map((value) => (
        <g key={`yt${value}`}>
          <line
            className="tick"
            x1={sx(0) - 4}
            y1={sy(value)}
            x2={sx(0) + 4}
            y2={sy(value)}
          />
          {value !== 0 && (
            <text className="tick-label y" x={sx(0) - 12} y={sy(value) + 4}>
              {value}
            </text>
          )}
        </g>
      ))}
      <path d={path} fill="none" stroke="#05a8cf" strokeWidth="4" />
      <g className="equation-chip">
        <rect x="396" y="14" width="94" height="34" rx="7" />
        <text x="410" y="36">
          f'(x) = 2x²
        </text>
      </g>
      <circle
        cx={sx(a)}
        cy={sy(curve(a))}
        r="8"
        fill="white"
        stroke="#1769ff"
        strokeWidth="3"
      />
      <circle
        data-lesson-control="drag-function-value"
        cx={sx(a)}
        cy={sy(pointValue)}
        r={dragging ? 10 : 8}
        fill="#f57c00"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
      />
      <text x={w - 15} y={sy(0) - 8}>
        x
      </text>
      <text x={sx(0) + 8} y="14">
        y
      </text>
      <text x={sx(a) + 20} y={sy(curve(a)) - 10} fill="#1769ff">
        ({a}, {curve(a)})
      </text>
      <text x={sx(a) + 20} y={sy(pointValue) + 22} fill="#f57c00">
        ({a}, {pointValue})
      </text>
    </svg>
  );
}
function MiniDiscontinuity() {
  return (
    <svg viewBox="0 0 180 80">
      <line x1="0" y1="55" x2="180" y2="55" stroke="#64748b" />
      <circle
        cx="90"
        cy="55"
        r="5"
        fill="white"
        stroke="#1769ff"
        strokeWidth="2"
      />
      <circle cx="90" cy="20" r="5" fill="#f57c00" />
    </svg>
  );
}
function MiniPractice({ choice }: { choice: number }) {
  return (
    <svg viewBox="0 0 180 100">
      <line x1="0" y1="70" x2="180" y2="70" stroke="#64748b" />
      <path
        d="M20 10 Q90 130 160 10"
        fill="none"
        stroke="#05a8cf"
        strokeWidth="3"
      />
      <circle
        cx="90"
        cy="70"
        r="5"
        fill="white"
        stroke="#1769ff"
        strokeWidth="2"
      />
      <circle cx="90" cy={70 - choice * 20} r="5" fill="#f57c00" />
    </svg>
  );
}
