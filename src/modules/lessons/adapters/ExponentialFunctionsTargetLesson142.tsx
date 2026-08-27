import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ChevronDown,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./ExponentialFunctionsTargetLesson142.css";

type Mode = "growth" | "decay";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

const formula = (
  a: number,
  b: number,
  k: number,
  mode: Mode,
  name = mode === "growth" ? "f" : "g",
) => {
  const base = mode === "growth" ? clean(b) : `(1/${clean(b)})`;
  const shift =
    k === 0 ? "" : k < 0 ? ` − ${clean(Math.abs(k))}` : ` + ${clean(k)}`;
  return `${name}(x) = ${clean(a)}·${base}^x${shift}`;
};

function ExpFormula({
  a,
  b,
  k,
  mode,
  name,
}: {
  a: number;
  b: number;
  k: number;
  mode: Mode;
  name?: string;
}) {
  const shift =
    k === 0 ? "" : k < 0 ? ` − ${clean(Math.abs(k))}` : ` + ${clean(k)}`;
  return (
    <span className="exp142-formula">
      <i>{name ?? (mode === "growth" ? "f" : "g")}(x)</i> = {clean(a)} ·{" "}
      {mode === "growth" ? (
        <b>{clean(b)}</b>
      ) : (
        <span className="exp142-frac">
          <b>1</b>
          <b>{clean(b)}</b>
        </span>
      )}
      <sup>x</sup>
      {shift}
    </span>
  );
}

function ExponentialGraph({
  a,
  b,
  k,
  onA,
  onB,
  onK,
}: {
  a: number;
  b: number;
  k: number;
  onA: (value: number) => void;
  onB: (value: number) => void;
  onK: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"initial" | "base" | "asymptote" | null>(
    null,
  );
  const px = (x: number) => 330 + x * 106;
  const py = (y: number) => 310 - y * 44;
  const growth = (x: number) => k + a * b ** x;
  const decay = (x: number) => k + a * (1 / b) ** x;
  const path = (evaluate: (x: number) => number) =>
    Array.from({ length: 151 }, (_, index) => {
      const x = -2.8 + index * (5 / 150);
      return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
    }).join(" ");
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const y = (310 - ((event.clientY - box.top) / box.height) * 380) / 44;
    if (drag === "initial")
      onA(Math.max(0.25, Math.min(4, Math.round((y - k) * 4) / 4)));
    if (drag === "base")
      onB(Math.max(1.1, Math.min(4, Math.round(((y - k) / a) * 10) / 10)));
    if (drag === "asymptote")
      onK(Math.max(-3, Math.min(3, Math.round(y * 4) / 4)));
  };
  const xs = [-2, -1, 0, 1, 2];
  return (
    <svg
      ref={svg}
      className="exp142-graph"
      viewBox="0 0 660 380"
      role="img"
      aria-label="Growth and decay graph with draggable initial value, base point, and asymptote"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="exp142-grid"
          width="53"
          height="47"
          patternUnits="userSpaceOnUse"
        >
          <path d="M53 0H0V47" fill="none" stroke="#e4eaef" />
        </pattern>
        <clipPath id="exp142-clip">
          <rect width="660" height="380" />
        </clipPath>
        <marker
          id="exp142-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#56677b" />
        </marker>
      </defs>
      <rect width="660" height="380" fill="url(#exp142-grid)" />
      <line
        x1="8"
        x2="652"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#exp142-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="370"
        y2="8"
        className="axis"
        markerEnd="url(#exp142-axis-arrow)"
      />
      {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 21}>
          {x}
        </text>
      ))}
      {[2, 4, 6].map((y) => (
        <g key={`y${y}`}>
          <line
            x1={px(0) - 5}
            x2={px(0) + 5}
            y1={py(y)}
            y2={py(y)}
            className="tick"
          />
          <text x={px(0) - 19} y={py(y) + 4}>
            {y}
          </text>
        </g>
      ))}
      <text x="642" y={py(0) + 24} className="xy">
        x
      </text>
      <text x={px(0) + 14} y="18" className="xy">
        y
      </text>
      <line x1="8" x2="652" y1={py(k)} y2={py(k)} className="asymptote" />
      <path d={path(growth)} className="growth" clipPath="url(#exp142-clip)" />
      <path d={path(decay)} className="decay" clipPath="url(#exp142-clip)" />
      {xs.map((x) => (
        <g key={`g${x}`} className="growth-point">
          <circle cx={px(x)} cy={py(growth(x))} r="5" />
          <text x={px(x) + (x === 0 ? 14 : 0)} y={py(growth(x)) - 13}>
            {clean(growth(x))}
          </text>
        </g>
      ))}
      {xs.map((x) => (
        <g key={`d${x}`} className="decay-point">
          <circle cx={px(x)} cy={py(decay(x))} r="5" />
          <text
            x={px(x) + (x === 0 ? -15 : 0)}
            y={py(decay(x)) + (x === 0 ? 25 : -13)}
          >
            {clean(decay(x))}
          </text>
        </g>
      ))}
      <circle
        data-testid="exponential-initial-handle"
        cx={px(0)}
        cy={py(a + k)}
        r="17"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag exponential initial value"
        aria-valuemin={0.25}
        aria-valuemax={4}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("initial");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(4, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(0.25, a - 0.25));
        }}
      />
      <circle
        data-testid="exponential-base-handle"
        cx={px(1)}
        cy={py(growth(1))}
        r="16"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag exponential base point"
        aria-valuemin={1.1}
        aria-valuemax={4}
        aria-valuenow={b}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("base");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp")
            onB(Math.min(4, Math.round((b + 0.1) * 10) / 10));
          if (event.key === "ArrowDown")
            onB(Math.max(1.1, Math.round((b - 0.1) * 10) / 10));
        }}
      />
      <circle
        data-testid="exponential-asymptote-handle"
        cx="24"
        cy={py(k)}
        r="15"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag exponential asymptote"
        aria-valuemin={-3}
        aria-valuemax={3}
        aria-valuenow={k}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("asymptote");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onK(Math.min(3, k + 0.25));
          if (event.key === "ArrowDown") onK(Math.max(-3, k - 0.25));
        }}
      />
    </svg>
  );
}

export default function ExponentialFunctionsTargetLesson142({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1.5),
    [b, setB] = useState(2),
    [k, setK] = useState(0),
    [mode, setMode] = useState<Mode>("growth"),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [actions, setActions] = useState(0),
    [shared, setShared] = useState(false),
    [workspace, setWorkspace] = useState(false);
  const growth = (x: number) => k + a * b ** x,
    decay = (x: number) => k + a * (1 / b) ** x,
    xs = [-2, -1, 0, 1, 2],
    growthSamples = xs.map((x) => [x, growth(x)] as const),
    decaySamples = xs.map((x) => [x, decay(x)] as const),
    activeSamples = mode === "growth" ? growthSamples : decaySamples,
    ratio = mode === "growth" ? b : 1 / b;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
      setA(value);
      act();
    },
    changeB = (value: number) => {
      setB(value);
      act();
    },
    changeK = (value: number) => {
      setK(value);
      act();
    };
  const reset = () => {
    setA(1.5);
    setB(2);
    setK(0);
    setMode("growth");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setActions(0);
    setShared(false);
    setWorkspace(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const loadExample = () => {
    setA(1);
    setB(3);
    setK(1);
    setMode("growth");
    setTab("Examples");
    act();
  };
  return (
    <div
      className="exp142-page"
      data-testid="graph-mockup-0199"
      data-dedicated-lesson="142"
      data-object-model="editable-exponential-initial-base-asymptote-growth-decay-mode-pointer-keyboard-draggable-initial-base-point-and-horizontal-asymptote-generated-dual-curves-samples-ratio-table-repeated-multiplication-concepts-example-model"
      data-a={a}
      data-b={b}
      data-k={k}
      data-mode={mode}
      data-formula={formula(a, b, k, mode)}
      data-growth-formula={formula(a, b, k, "growth")}
      data-decay-formula={formula(a, b, k, "decay")}
      data-asymptote={`y=${k}`}
      data-ratio={ratio}
      data-growth-samples={growthSamples
        .map(([x, y]) => `${x},${clean(y)}`)
        .join(";")}
      data-decay-samples={decaySamples
        .map(([x, y]) => `${x},${clean(y)}`)
        .join(";")}
      data-active-samples={activeSamples
        .map(([x, y]) => `${x},${clean(y)}`)
        .join(";")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="exp142-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>142 Exponential Functions</b>
      </nav>
      <header className="exp142-intro">
        <div>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Exponential Functions</h1>
          <p>Model growth and decay.</p>
          <nav>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Graph Explorer</b>
            <b>▣ Graphing Calculator</b>
            <b>◷ 6-10 min</b>
          </nav>
        </div>
        <section>
          <div>
            <label>
              <Languages />
              <select
                aria-label="Exponential functions language"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  act();
                }}
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
              <ChevronDown />
            </label>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                setShared(true);
                act();
              }}
            >
              <Share2 />
              {shared ? "Link ready" : "Share"}
            </button>
          </div>
          <button
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ {workspace ? "Close workspace" : "Workspace"}
          </button>
        </section>
      </header>
      <nav className="exp142-tabs">
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
            onClick={() => {
              setTab(name);
              if (name === "Examples") loadExample();
              else act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="exp142-lab">
        <div className="exp142-main">
          <header>
            <strong>
              <ExpFormula a={a} b={b} k={k} mode="growth" />
            </strong>
            <div>
              <h2>Equal x-steps multiply outputs</h2>
              <p>
                Each step right multiplies the output above the asymptote by a
                constant ratio.
              </p>
            </div>
          </header>
          <div className="exp142-legend">
            <span>
              <i></i>
              <ExpFormula a={a} b={b} k={k} mode="growth" /> <b>(growth)</b>
            </span>
            <span>
              <i></i>
              <ExpFormula a={a} b={b} k={k} mode="decay" /> <b>(decay)</b>
            </span>
          </div>
          <ExponentialGraph
            a={a}
            b={b}
            k={k}
            onA={changeA}
            onB={changeB}
            onK={changeK}
          />
          <section className="exp142-output-table">
            <table>
              <tbody>
                <tr>
                  <th>x</th>
                  {xs.map((x) => (
                    <td key={x}>
                      <span>{x}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>
                    <ExpFormula a={a} b={b} k={k} mode={mode} />
                  </th>
                  {activeSamples.map(([x, y]) => (
                    <td key={x}>{clean(y)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div>
              {xs.slice(1).map((x) => (
                <span key={x}>
                  ⌒
                  <b>
                    {mode === "growth" ? `×${clean(b)}` : `×${clean(1 / b)}`}
                  </b>
                </span>
              ))}
            </div>
          </section>
        </div>
        <aside>
          <section className="exp142-controls">
            <nav>
              <button
                className={mode === "growth" ? "growth active" : "growth"}
                onClick={() => {
                  setMode("growth");
                  act();
                }}
              >
                Growth
              </button>
              <button
                className={mode === "decay" ? "decay active" : "decay"}
                onClick={() => {
                  setMode("decay");
                  act();
                }}
              >
                Decay
              </button>
            </nav>
            <p>
              Function form:{" "}
              <i>
                y = a · b<sup>x</sup> + k
              </i>
            </p>
            <label>
              Base <i>b &gt; 0, b ≠ 1</i> ⓘ
              <input
                aria-label="Exponential base"
                type="range"
                min="1.1"
                max="4"
                step=".1"
                value={b}
                onChange={(e) => changeB(Number(e.target.value))}
              />
              <output>{clean(b)}</output>
            </label>
            <label>
              Initial value <i>a</i> ⓘ
              <input
                aria-label="Exponential initial value"
                type="range"
                min=".25"
                max="4"
                step=".25"
                value={a}
                onChange={(e) => changeA(Number(e.target.value))}
              />
              <output>{clean(a)}</output>
            </label>
            <label>
              Asymptote <i>k</i> ⓘ
              <input
                aria-label="Exponential asymptote"
                type="range"
                min="-3"
                max="3"
                step=".25"
                value={k}
                onChange={(e) => changeK(Number(e.target.value))}
              />
              <output>{clean(k)}</output>
            </label>
            <article>
              <h3>Check the ratio (equal x-steps)</h3>
              <table>
                <thead>
                  <tr>
                    <th>From x</th>
                    <th>To x</th>
                    <th>Output ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {xs.slice(0, -1).map((x, index) => {
                    const current = activeSamples[index][1] - k,
                      next = activeSamples[index + 1][1] - k;
                    return (
                      <tr key={x}>
                        <td>
                          {x} → {x + 1}
                        </td>
                        <td>
                          {clean(next)} / {clean(current)}
                        </td>
                        <td>× {clean(next / current)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </article>
            <footer>
              <Lightbulb />
              Compare ratios, not differences
            </footer>
          </section>
        </aside>
        <section className="exp142-concepts">
          <article>
            <i>⟳</i>
            <div>
              <h3>Repeated multiplication</h3>
              <p>
                Exponential functions multiply by the same factor for equal
                x-steps.
              </p>
              <strong>
                output<sub>n+1</sub> = output<sub>n</sub> × {clean(ratio)}
              </strong>
            </div>
          </article>
          <article>
            <i>↔</i>
            <div>
              <h3>Horizontal asymptote</h3>
              <p>The graph approaches the line y = k but never crosses it.</p>
              <strong>
                Here, k = {clean(k)} ⇒ y = {clean(k)}
              </strong>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
