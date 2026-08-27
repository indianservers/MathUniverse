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
import "./SquareRootFunctionsTargetLesson139.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const radicand = (h: number) =>
  h < 0 ? `x + ${clean(Math.abs(h))}` : h === 0 ? "x" : `x − ${clean(h)}`;

const expression = (a: number, h: number, name = "f") =>
  `${name}(x) = ${a === 1 ? "" : a === -1 ? "−" : clean(a)}√(${radicand(h)})`;

function RootFormula({
  a,
  h,
  name = "f",
}: {
  a: number;
  h: number;
  name?: string;
}) {
  return (
    <span className="root139-formula">
      <i>{name}(x)</i> = {a === 1 ? "" : a === -1 ? "−" : clean(a)}√
      <b>{radicand(h)}</b>
    </span>
  );
}

function SquareRootGraph({
  a,
  h,
  onA,
  onH,
}: {
  a: number;
  h: number;
  onA: (value: number) => void;
  onH: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"endpoint" | "scale" | null>(null);
  const px = (x: number) => 96 + x * 46;
  const py = (y: number) => 278 - y * 59;
  const evaluate = (x: number) => a * Math.sqrt(Math.max(0, x - h));
  const path = Array.from({ length: 121 }, (_, index) => {
    const x = h + ((6.5 - h) * index) / 120;
    return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
  }).join(" ");
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 430 - 96) / 46;
    const y = (258 - ((event.clientY - box.top) / box.height) * 455) / 55;
    if (drag === "endpoint")
      onH(Math.max(-3, Math.min(5, Math.round(x * 4) / 4)));
    else onA(Math.max(-3, Math.min(3, Math.round((y / 2) * 4) / 4)));
  };
  const domainEnd = Math.max(9, px(h));
  return (
    <svg
      ref={svg}
      className="root139-graph"
      viewBox="0 0 430 455"
      role="img"
      aria-label="Square-root graph with draggable endpoint and scale point"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="root139-grid"
          width="46"
          height="55"
          patternUnits="userSpaceOnUse"
        >
          <path d="M46 0H0V55" fill="none" stroke="#e4eaef" />
        </pattern>
        <marker
          id="root139-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#079db6" />
        </marker>
      </defs>
      <rect width="430" height="455" fill="url(#root139-grid)" />
      <line x1="8" x2="422" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="445" y2="8" className="axis" />
      {[-1, 1, 2, 3, 4, 5, 6].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 20}>
          {x}
        </text>
      ))}
      {[-2, -1, 1, 2, 3, 4].map((y) => (
        <text key={`y${y}`} x={px(0) - 12} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <line
        x1="8"
        x2={domainEnd}
        y1={py(0) + 34}
        y2={py(0) + 34}
        className="forbidden"
        markerEnd="url(#root139-arrow)"
      />
      <rect
        x="9"
        y={py(0) - 52}
        width="76"
        height="81"
        rx="6"
        className="not-allowed"
      />
      <text x="20" y={py(0) - 29} className="math-label">
        x &lt; {clean(h)}
      </text>
      <text x="20" y={py(0) - 8} className="math-label">
        x − {clean(h)} &lt; 0
      </text>
      <text x="20" y={py(0) + 14} className="warning-label">
        Not allowed ⓘ
      </text>
      <path d={path} className="curve" />
      {[0, 1, 4].map((offset) => {
        const x = h + offset,
          y = evaluate(x);
        return (
          <g key={offset} className={offset === 0 ? "endpoint" : "sample"}>
            <circle cx={px(x)} cy={py(y)} r={offset === 0 ? 7 : 5} />
            <text x={px(x) + 13} y={py(y) - 12}>
              ({clean(x)}, {clean(y)})
            </text>
          </g>
        );
      })}
      <circle
        data-testid="square-root-endpoint-handle"
        cx={px(h)}
        cy={py(0)}
        r="16"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag square-root endpoint"
        aria-valuemin={-3}
        aria-valuemax={5}
        aria-valuenow={h}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("endpoint");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onH(Math.max(-3, h - 0.25));
          if (event.key === "ArrowRight") onH(Math.min(5, h + 0.25));
        }}
      />
      <circle
        data-testid="square-root-scale-handle"
        cx={px(h + 4)}
        cy={py(2 * a)}
        r="16"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag square-root scale point"
        aria-valuemin={-3}
        aria-valuemax={3}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(3, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(-3, a - 0.25));
        }}
      />
      <rect
        x={px(h) + 67}
        y={py(0) + 36}
        width="100"
        height="34"
        rx="7"
        className="domain-tag"
      />
      <text x={px(h) + 117} y={py(0) + 58} className="domain-text">
        Domain: x ≥ {clean(h)}
      </text>
    </svg>
  );
}

export default function SquareRootFunctionsTargetLesson139({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1.5);
  const [h, setH] = useState(1);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practice, setPractice] = useState(false);
  const evaluate = (x: number) => (x < h ? null : a * Math.sqrt(x - h));
  const sampleXs = [h, h + 1, h + 4];
  const samples = sampleXs.map((x) => [x, evaluate(x)] as const);
  const range = a >= 0 ? `y>=0` : `y<=0`;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
    setA(value);
    act();
  };
  const changeH = (value: number) => {
    setH(value);
    act();
  };
  const reset = () => {
    setA(1.5);
    setH(1);
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
    setA(2);
    setH(-3);
    setPractice(true);
    setTab("Examples");
    act();
  };
  return (
    <div
      className={`root139-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0196"
      data-dedicated-lesson="139"
      data-object-model="editable-square-root-vertical-scale-and-domain-start-pointer-keyboard-draggable-endpoint-and-scale-point-generated-restricted-domain-curve-samples-table-range-reasoning-warning-practice-model"
      data-a={a}
      data-h={h}
      data-formula={expression(a, h)}
      data-endpoint={`${h},0`}
      data-domain={`x>=${h}`}
      data-range={range}
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(Number(y))}`)
        .join(";")}
      data-practice={practice}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="root139-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>139 Square Root Functions</b>
      </nav>
      <header className="root139-intro">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>FUNCTIONS</b>
        </small>
        <h1>Square-Root Functions</h1>
        <p>Understand restricted domains.</p>
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
              aria-label="Square-root functions language"
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
      <nav className="root139-tabs">
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
      <section className="root139-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Square-Root Endpoint Explorer</h2>
          </div>
          <nav>
            <b>Interactive</b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand square-root endpoint explorer"
              onClick={() => {
                setFullscreen((v) => !v);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <section className="root139-explorer">
          <p>Explore the function and its restricted domain.</p>
          <strong>
            <RootFormula a={a} h={h} />
          </strong>
          <div className="root139-workspace">
            <main>
              <button className="root139-autoscale">⌖ Auto scale</button>
              <SquareRootGraph a={a} h={h} onA={changeA} onH={changeH} />
              <footer>
                <span>
                  <i></i>Endpoint ({clean(h)}, 0)
                </span>
                <span>
                  <i></i>Sample point
                </span>
                <span>
                  <i></i>Domain (allowed x)
                </span>
                <span>
                  <i></i>Not allowed (x &lt; {clean(h)})
                </span>
              </footer>
            </main>
            <aside>
              <section className="root139-controls">
                <h3>Explore the function</h3>
                <p>
                  Adjust parameters to see how the square-root graph begins.
                </p>
                <label>
                  Vertical scale (a) ⓘ
                  <input
                    aria-label="Square-root vertical scale"
                    type="range"
                    min="-3"
                    max="3"
                    step=".25"
                    value={a}
                    onChange={(e) => changeA(Number(e.target.value))}
                  />
                  <output>{clean(a)}</output>
                  <small>
                    <span>-3</span>
                    <span>3</span>
                  </small>
                </label>
                <label>
                  Domain start (h) ⓘ
                  <input
                    aria-label="Square-root domain start"
                    type="range"
                    min="-3"
                    max="5"
                    step=".25"
                    value={h}
                    onChange={(e) => changeH(Number(e.target.value))}
                  />
                  <output>{clean(h)}</output>
                  <small>
                    <span>-3</span>
                    <span>5</span>
                  </small>
                </label>
                <strong>
                  <RootFormula a={a} h={h} />
                </strong>
              </section>
              <section className="root139-values">
                <h3>Key values</h3>
                <table>
                  <thead>
                    <tr>
                      <th>x</th>
                      <th>
                        <RootFormula a={a} h={h} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map(([x, y]) => (
                      <tr key={x}>
                        <td>{clean(x)}</td>
                        <td>{clean(Number(y))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>Values update with parameters.</p>
              </section>
            </aside>
          </div>
        </section>
        <section className="root139-why">
          <h3>Why the graph starts here</h3>
          <div>
            {[
              [
                "⚖",
                "Set radicand nonnegative",
                `Square roots of real numbers require x − ${clean(h)} ≥ 0.`,
                `x ≥ ${clean(h)}`,
              ],
              [
                "⚑",
                "Locate endpoint",
                `At the boundary, x = ${clean(h)}, f(${clean(h)}) = 0.`,
                `Endpoint: (${clean(h)}, 0)`,
              ],
              [
                "↱",
                "Read domain",
                "All inputs to the right are allowed.",
                `Domain: x ≥ ${clean(h)}`,
              ],
              [
                "⌁",
                `Sketch ${a < 0 ? "decreasing" : "increasing"} root curve`,
                `The square-root function is ${a < 0 ? "decreasing and concave up" : "increasing and concave down"}.`,
                expression(a, h),
              ],
            ].map(([icon, title, text, result], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <i>{icon}</i>
                <b>{title}</b>
                <p>{text}</p>
                <strong>{result}</strong>
              </article>
            ))}
          </div>
        </section>
        <section className="root139-bottom">
          <article className="root139-warning">
            <TriangleAlert />
            <div>
              <h3>Important: Negative radicand</h3>
              <b>NEGATIVE_RADICAND</b>
              <p>
                For x &lt; {clean(h)}, the expression {radicand(h)} is negative,
                so √({radicand(h)}) is not real. Therefore, those inputs are not
                in the domain.
              </p>
              <strong>
                Real square roots need: x − {clean(h)} ≥ 0 ⇒ x ≥ {clean(h)}
              </strong>
            </div>
          </article>
          <article
            className="root139-practice"
            role="button"
            tabIndex={0}
            aria-label="Practice Try another example"
            onClick={loadPractice}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") loadPractice();
            }}
          >
            <h3>ⓘ Try another example</h3>
            <p>What happens if the radicand is x + 3?</p>
            <RootFormula a={2} h={-3} name="g" />
            <p>Starts at x = −3; g(−3) = 0</p>
            <strong>Domain: x ≥ −3</strong>
          </article>
        </section>
      </section>
      <nav className="root139-adjacent">
        <a href="/lessons/graphs-and-functions/138-rational-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Rational Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/140-cube-root-functions">
          <span>
            <small>NEXT</small>Cube-Root Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="root139-footer">
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
