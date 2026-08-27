import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Expand,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./CubeRootFunctionsTargetLesson140.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const inside = (b: number) =>
  b < 0 ? `x + ${clean(Math.abs(b))}` : b === 0 ? "x" : `x − ${clean(b)}`;

const expression = (a: number, b: number, k: number, name = "f") => {
  const scale = a === 1 ? "" : a === -1 ? "−" : clean(a);
  const shift =
    k === 0 ? "" : k < 0 ? ` − ${clean(Math.abs(k))}` : ` + ${clean(k)}`;
  return `${name}(x) = ${scale}∛(${inside(b)})${shift}`;
};

function CubeFormula({
  a,
  b,
  k,
  name = "f",
}: {
  a: number;
  b: number;
  k: number;
  name?: string;
}) {
  const shift =
    k === 0 ? "" : k < 0 ? ` − ${clean(Math.abs(k))}` : ` + ${clean(k)}`;
  return (
    <span className="cube140-formula">
      <i>{name}(x)</i> = {a === 1 ? "" : a === -1 ? "−" : clean(a)} · ∛
      <b>{inside(b)}</b>
      {shift}
    </span>
  );
}

function CubeRootGraph({
  a,
  b,
  k,
  onA,
  onCenter,
}: {
  a: number;
  b: number;
  k: number;
  onA: (value: number) => void;
  onCenter: (b: number, k: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"center" | "scale" | null>(null);
  const px = (x: number) => 240 + x * 23;
  const py = (y: number) => 270 - y * 23;
  const evaluate = (x: number) => k + a * Math.cbrt(x - b);
  const path = Array.from({ length: 241 }, (_, index) => {
    const x = -10 + index / 12;
    return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
  }).join(" ");
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 480 - 240) / 23;
    const y = (270 - ((event.clientY - box.top) / box.height) * 500) / 23;
    if (drag === "center")
      onCenter(
        Math.max(-5, Math.min(5, Math.round(x * 4) / 4)),
        Math.max(-4, Math.min(4, Math.round(y * 4) / 4)),
      );
    else onA(Math.max(-4, Math.min(4, Math.round((y - k) * 4) / 4)));
  };
  const sampleOffsets = [-8, -1, 0, 1, 2, 8];
  return (
    <svg
      ref={svg}
      className="cube140-graph"
      viewBox="0 0 480 500"
      role="img"
      aria-label="Cube-root graph with draggable center and scale point"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="cube140-grid"
          width="23"
          height="23"
          patternUnits="userSpaceOnUse"
        >
          <path d="M23 0H0V23" fill="none" stroke="#e2e9ee" />
        </pattern>
        <clipPath id="cube140-clip">
          <rect width="480" height="500" />
        </clipPath>
      </defs>
      <rect width="480" height="500" fill="url(#cube140-grid)" />
      <line x1="8" x2="472" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="492" y2="8" className="axis" />
      {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 19}>
          {x}
        </text>
      ))}
      {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((y) => (
        <text key={`y${y}`} x={px(0) - 13} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <path d={path} className="curve" clipPath="url(#cube140-clip)" />
      {sampleOffsets.map((offset) => {
        const x = b + offset,
          y = evaluate(x);
        return (
          <g key={offset} className={offset === 0 ? "center" : "sample"}>
            <circle cx={px(x)} cy={py(y)} r={offset === 0 ? 7 : 5} />
            <text
              x={px(x) + (offset < 0 ? -12 : 13)}
              y={py(y) + (offset === -8 ? 25 : offset === 2 ? -29 : -12)}
              className={offset < 0 ? "left" : ""}
            >
              ({clean(x)}, {clean(y)})
            </text>
          </g>
        );
      })}
      <circle
        data-testid="cube-root-center-handle"
        cx={px(b)}
        cy={py(k)}
        r="17"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag cube-root center"
        aria-valuetext={`${clean(b)}, ${clean(k)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("center");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onCenter(Math.max(-5, b - 0.25), k);
          if (event.key === "ArrowRight") onCenter(Math.min(5, b + 0.25), k);
          if (event.key === "ArrowUp") onCenter(b, Math.min(4, k + 0.25));
          if (event.key === "ArrowDown") onCenter(b, Math.max(-4, k - 0.25));
        }}
      />
      <circle
        data-testid="cube-root-scale-handle"
        cx={px(b + 1)}
        cy={py(k + a)}
        r="16"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag cube-root scale point"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(4, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(-4, a - 0.25));
        }}
      />
    </svg>
  );
}

export default function CubeRootFunctionsTargetLesson140({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0);
  const [k, setK] = useState(0);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practice, setPractice] = useState(false);
  const evaluate = (x: number) => k + a * Math.cbrt(x - b);
  const sampleXs = [-8, -1, 0, 1, 2, 8].map((offset) => b + offset);
  const samples = sampleXs.map((x) => [x, evaluate(x)] as const);
  const domain = "all-real";
  const range = a === 0 ? `y=${clean(k)}` : "all-real";
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
    setA(value);
    act();
  };
  const changeB = (value: number) => {
    setB(value);
    act();
  };
  const changeCenter = (nextB: number, nextK: number) => {
    setB(nextB);
    setK(nextK);
    act();
  };
  const reset = () => {
    setA(2);
    setB(0);
    setK(0);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setActions(0);
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    setPractice(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const loadPractice = () => {
    setA(1);
    setB(3);
    setK(1);
    setPractice(true);
    setTab("Examples");
    act();
  };
  return (
    <div
      className={`cube140-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0197"
      data-dedicated-lesson="140"
      data-object-model="editable-shifted-cube-root-scale-center-and-vertical-shift-pointer-keyboard-draggable-center-and-scale-point-generated-all-real-s-curve-symmetric-samples-table-inverse-reasoning-warning-practice-model"
      data-a={a}
      data-b={b}
      data-k={k}
      data-formula={expression(a, b, k)}
      data-center={`${b},${k}`}
      data-domain={domain}
      data-range={range}
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-practice={practice}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="cube140-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>140 Cube Root Functions</b>
      </nav>
      <header className="cube140-intro">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>FUNCTIONS</b>
        </small>
        <h1>Cube-Root Functions</h1>
        <p>Explore inverse cubic behaviour.</p>
        <nav>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section>
          <label>
            <Languages />
            <select
              aria-label="Cube-root functions language"
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
            <RotateCcw /> Reset
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
          <i></i>
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
      <nav className="cube140-tabs">
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
              if (name === "Examples") loadPractice();
              else act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cube140-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore the cube-root center</h2>
            <strong>
              Function: <CubeFormula a={a} b={b} k={k} />
            </strong>
            <p>
              Adjust the vertical scale and center shift to see how the
              cube-root graph changes.
            </p>
          </div>
          <nav>
            <b>● Live interaction</b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand cube-root center explorer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="cube140-layout">
          <main>
            <section className="cube140-graph-panel">
              <header>
                <i></i>
                <CubeFormula a={a} b={b} k={k} />
              </header>
              <CubeRootGraph
                a={a}
                b={b}
                k={k}
                onA={changeA}
                onCenter={changeCenter}
              />
            </section>
            <section className="cube140-domain">
              <b>✓ Negative inputs are allowed.</b>
              <span>Cube-root functions are defined for all real numbers.</span>
            </section>
          </main>
          <aside>
            <section className="cube140-controls">
              <h3>☷ Graph Controls</h3>
              <label>
                Vertical scale (a)
                <input
                  aria-label="Cube-root vertical scale"
                  type="range"
                  min="-4"
                  max="4"
                  step=".25"
                  value={a}
                  onChange={(e) => changeA(Number(e.target.value))}
                />
                <input
                  aria-label="Cube-root vertical scale value"
                  type="number"
                  min="-4"
                  max="4"
                  step=".25"
                  value={a}
                  onChange={(e) =>
                    changeA(Math.max(-4, Math.min(4, Number(e.target.value))))
                  }
                />
              </label>
              <label>
                Center shift (b)
                <input
                  aria-label="Cube-root center shift"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={b}
                  onChange={(e) => changeB(Number(e.target.value))}
                />
                <input
                  aria-label="Cube-root center shift value"
                  type="number"
                  min="-5"
                  max="5"
                  step=".25"
                  value={b}
                  onChange={(e) =>
                    changeB(Math.max(-5, Math.min(5, Number(e.target.value))))
                  }
                />
              </label>
            </section>
            <section className="cube140-values">
              <h3>▦ Key Values Table</h3>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>
                      <CubeFormula a={a} b={b} k={k} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map(([x, y]) => (
                    <tr key={x}>
                      <td>{clean(x)}</td>
                      <td>{clean(y)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Values rounded to 2 decimal places.</p>
            </section>
          </aside>
        </div>
        <section className="cube140-understand">
          <h3>Understand the cube-root graph</h3>
          <div>
            {[
              [
                "∞",
                "All real x-values are allowed",
                "The cube-root function is defined for every real number (…, −2, −1, 0, 1, 2, …).",
              ],
              [
                "◎",
                "Center point anchors the graph",
                `Every cube-root function has a center at (${clean(b)}, ${clean(k)}). Here, the center is (${clean(b)}, ${clean(k)}).`,
              ],
              [
                "⌁",
                "Shape flattens near center",
                "The graph is steep far from the center and flattens as it passes through the center point.",
              ],
              [
                "◇",
                "Inverse of cubic",
                `Cube-root functions are inverses of cubic functions. ${expression(a, b, k)} reverses its matching cubic.`,
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <i>{icon}</i>
                <b>{title}</b>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="cube140-bottom">
          <article className="cube140-warning">
            <TriangleAlert />
            <div>
              <b>CONFUSED_WITH_SQUARE_ROOT</b>
              <p>
                Unlike square-root functions, cube-root functions allow negative
                inputs and do not start at an endpoint. The graph extends
                infinitely in both directions.
              </p>
            </div>
          </article>
          <article
            className="cube140-practice"
            role="button"
            tabIndex={0}
            aria-label="Practice shifted cube-root example"
            onClick={loadPractice}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") loadPractice();
            }}
          >
            <h3>♧ Try This: Practice</h3>
            <p>
              For <CubeFormula a={1} b={3} k={1} name="g" />:
            </p>
            <ul>
              <li>Center: (3, 1)</li>
              <li>Domain: all real numbers</li>
              <li>Range: all real numbers</li>
            </ul>
            <button
              onClick={(e) => {
                e.stopPropagation();
                loadPractice();
              }}
            >
              Open in Graphing Calculator ↗
            </button>
          </article>
        </section>
      </section>
      <nav className="cube140-adjacent">
        <a href="/lessons/graphs-and-functions/139-square-root-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Square-Root Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/141-absolute-value-functions">
          <span>
            <small>NEXT</small>Absolute-Value Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="cube140-footer">
        <b>
          <Sparkles /> Math Universe
        </b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com · info@IndianServers.com</small>
      </footer>
    </div>
  );
}
