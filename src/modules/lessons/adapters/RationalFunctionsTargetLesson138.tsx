import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Expand,
  Info,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./RationalFunctionsTargetLesson138.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const binomial = (root: number) =>
  root < 0 ? `x + ${clean(Math.abs(root))}` : `x − ${clean(root)}`;
const numerator = (a: number, root: number) =>
  `${a === 1 ? "" : a === -1 ? "−" : clean(a)}(${binomial(root)})`;
const formula = (a: number, root: number, h: number, name = "f") =>
  `${name}(x) = ${numerator(a, root)}/(${binomial(h)})`;
function Fraction({ a, root, h }: { a: number; root: number; h: number }) {
  return (
    <span className="rational138-frac">
      <b>{numerator(a, root)}</b>
      <b>{binomial(h)}</b>
    </span>
  );
}

function HeroRational() {
  return (
    <svg
      className="rational138-hero"
      viewBox="0 0 300 200"
      role="img"
      aria-label="Rational function asymptote preview"
    >
      <defs>
        <pattern
          id="rational138-hero-grid"
          width="32"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M32 0H0V28" fill="none" stroke="#fff" opacity=".2" />
        </pattern>
      </defs>
      <rect width="300" height="200" fill="url(#rational138-hero-grid)" />
      <line x1="112" x2="112" y1="8" y2="192" />
      <line x1="8" x2="292" y1="104" y2="104" />
      <line x1="148" x2="148" y1="8" y2="192" className="dash" />
      <line x1="8" x2="292" y1="77" y2="77" className="dash" />
      <path d="M8 84 C65 85 98 91 127 122 C139 140 143 171 145 196 M151 4 C153 37 160 58 177 67 C202 79 242 76 292 76" />
    </svg>
  );
}

function RationalGraph({
  a,
  root,
  h,
  onH,
  onA,
}: {
  a: number;
  root: number;
  h: number;
  onH: (value: number) => void;
  onA: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    [drag, setDrag] = useState<"restriction" | "scale" | null>(null),
    hole = Math.abs(root - h) < 0.001 || Math.abs(a) < 0.001;
  const px = (x: number) => 160 + x * 27,
    py = (y: number) => 260 - y * 42,
    evaluate = (x: number) => (a * (x - root)) / (x - h),
    limit = a;
  const path = (from: number, to: number, steps = 180) =>
    Array.from({ length: steps }, (_, index) => {
      const x = from + (to - from) * (index / (steps - 1)),
        y = hole ? a : evaluate(x);
      return `${index ? "L" : "M"}${px(x)},${py(y)}`;
    }).join(" ");
  const sampleXs = [-2, 0, 2],
    samples = sampleXs
      .filter((x) => Math.abs(x - h) > 0.001)
      .map((x) => [x, evaluate(x)]),
    handleX = Math.max(-5, Math.min(7, h + 1)),
    handleY = hole ? a : evaluate(handleX);
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 350 - 160) / 27,
      y = (260 - ((event.clientY - box.top) / box.height) * 540) / 42;
    if (drag === "restriction") onH(Math.max(-6, Math.min(8, Math.round(x))));
    else {
      const ratio = hole ? 1 : (handleX - root) / (handleX - h);
      onA(Math.max(-5, Math.min(5, Math.round((y / ratio) * 4) / 4)));
    }
  };
  return (
    <svg
      ref={svg}
      className="rational138-graph"
      viewBox="0 0 350 540"
      role="img"
      aria-label="Rational function graph with draggable restriction and scale point"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="rational138-grid"
          width="27"
          height="42"
          patternUnits="userSpaceOnUse"
        >
          <path d="M27 0H0V42" fill="none" stroke="#dce5ec" />
        </pattern>
        <clipPath id="rational138-clip">
          <rect x="5" y="5" width="340" height="530" />
        </clipPath>
        <marker
          id="rational138-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#079db6" />
        </marker>
      </defs>
      <rect
        x="5"
        y="5"
        width="340"
        height="530"
        fill="url(#rational138-grid)"
      />
      <line x1="5" x2="345" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="535" y2="5" className="axis" />
      {[-6, -4, -2, 0, 2, 4, 6].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 19}>
          {x}
        </text>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((y) => (
        <text key={`y${y}`} x={px(0) - 12} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <line
        x1="5"
        x2="345"
        y1={py(limit)}
        y2={py(limit)}
        className="long-run"
      />
      {!hole && (
        <line x1={px(h)} x2={px(h)} y1="5" y2="535" className="vertical" />
      )}
      {hole ? (
        <path
          d={path(-6, 8)}
          className="curve"
          clipPath="url(#rational138-clip)"
        />
      ) : (
        <>
          <path
            d={path(-6, h - 0.08)}
            className="curve"
            clipPath="url(#rational138-clip)"
          />
          <path
            d={path(h + 0.08, 8)}
            className="curve"
            clipPath="url(#rational138-clip)"
          />
        </>
      )}
      {samples.map(([x, y]) => (
        <g className="point" key={x}>
          <circle cx={px(x)} cy={py(y)} r="5" />
          <text x={px(x) + (x < 0 ? -20 : 20)} y={py(y) - 12}>
            ({clean(x)}, {clean(y)})
          </text>
        </g>
      ))}
      {hole && <circle cx={px(h)} cy={py(a)} r="7" className="hole" />}
      <circle
        data-testid="rational-restriction-handle"
        cx={px(h)}
        cy={py(0)}
        r="14"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag rational restricted input"
        aria-valuemin={-6}
        aria-valuemax={8}
        aria-valuenow={h}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("restriction");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onH(Math.max(-6, h - 1));
          if (event.key === "ArrowRight") onH(Math.min(8, h + 1));
        }}
      />
      <circle
        data-testid="rational-scale-handle"
        cx={px(handleX)}
        cy={py(handleY)}
        r="14"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag rational numerator scale point"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(5, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(-5, a - 0.25));
        }}
      />
    </svg>
  );
}

export default function RationalFunctionsTargetLesson138({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1),
    [h, setH] = useState(1),
    [root, setRoot] = useState(-2),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [actions, setActions] = useState(0),
    [shared, setShared] = useState(false),
    [workspace, setWorkspace] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [practice, setPractice] = useState(false);
  const hole = Math.abs(root - h) < 0.001 || Math.abs(a) < 0.001,
    evaluate = (x: number) => (hole ? a : (a * (x - root)) / (x - h)),
    sampleXs = [-2, 0, 2],
    samples = sampleXs.map((x) =>
      Math.abs(x - h) < 0.001 ? [x, null] : [x, evaluate(x)],
    ),
    act = () => {
      setActions((value) => value + 1);
      onInteraction();
    },
    changeA = (value: number) => {
      setA(value);
      act();
    },
    changeH = (value: number) => {
      setH(value);
      act();
    };
  const reset = () => {
    setA(1);
    setH(1);
    setRoot(-2);
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
    setRoot(3);
    setH(-2);
    setPractice(true);
    setTab("Examples");
    act();
  };
  return (
    <div
      className={`rational138-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0195"
      data-dedicated-lesson="138"
      data-object-model="editable-equal-degree-rational-numerator-scale-and-restricted-input-pointer-keyboard-draggable-restriction-and-scale-point-generated-branches-vertical-or-removable-hole-long-run-value-samples-reasoning-warning-practice-model"
      data-a={a}
      data-h={h}
      data-root={root}
      data-formula={formula(a, root, h)}
      data-feature={hole ? "hole" : "vertical-asymptote"}
      data-restriction={`x!=${h}`}
      data-vertical-asymptote={hole ? "none" : `x=${h}`}
      data-hole={hole ? `${h},${a}` : "none"}
      data-long-run={`y=${a}`}
      data-samples={samples
        .map(([x, y]) => `${x},${y === null ? "undefined" : clean(Number(y))}`)
        .join(";")}
      data-practice={practice}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="rational138-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>138 Rational Functions</b>
      </nav>
      <header className="rational138-intro">
        <div>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Rational Functions</h1>
          <p>Analyse holes and asymptotes.</p>
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
                aria-label="Rational functions language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
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
            <button
              onClick={() => {
                setWorkspace((value) => !value);
                act();
              }}
            >
              ↗ {workspace ? "Close workspace" : "Workspace"}
            </button>
          </section>
        </div>
        <HeroRational />
      </header>
      <nav className="rational138-tabs">
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
      <section className="rational138-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Rational function analyzer</h2>
            <p>Explore the function, asymptotes, and key values.</p>
          </div>
          <nav>
            <b className={actions ? "updated" : ""}>
              {actions ? "Updated" : "Awaiting interaction"}
            </b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand rational function analyzer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="rational138-layout">
          <main>
            <section className="rational138-graph-panel">
              <header>
                <small>Function</small>
                <strong>
                  <i>f(x)</i> = <Fraction a={a} root={root} h={h} />
                </strong>
                <nav>
                  <span>
                    <i></i>f(x)
                  </span>
                  <span>
                    <i></i>
                    {hole
                      ? `Hole: (${clean(h)}, ${clean(a)})`
                      : `Vertical asymptote: x = ${clean(h)}`}
                  </span>
                  <span>
                    <i></i>Long-run value: y = {clean(a)}
                  </span>
                </nav>
              </header>
              <RationalGraph
                a={a}
                root={root}
                h={h}
                onH={changeH}
                onA={changeA}
              />
              <footer>
                <article>
                  <small>
                    Restricted input
                    <br />
                    (denominator zero)
                  </small>
                  <b>x = {clean(h)}</b>
                </article>
                <article>
                  <small>
                    {hole ? "Removable discontinuity" : "Vertical asymptote"}
                  </small>
                  <b>
                    {hole ? `(${clean(h)}, ${clean(a)})` : `x = ${clean(h)}`}
                  </b>
                </article>
                <article>
                  <small>
                    Long-run value
                    <br />
                    (equal degrees)
                  </small>
                  <b>y = {clean(a)}</b>
                </article>
              </footer>
            </section>
            <section className="rational138-values">
              <h3>Key values</h3>
              <table>
                <tbody>
                  <tr>
                    <th>x</th>
                    {samples.map(([x]) => (
                      <td key={x}>{clean(Number(x))}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>
                      f(x) = <Fraction a={a} root={root} h={h} />
                    </th>
                    {samples.map(([x, y]) => (
                      <td key={x}>
                        {y === null ? "undefined" : clean(Number(y))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="rational138-insight">
              <Info />
              <p>
                Because the numerator and denominator have the same degree, the
                long-run value is the ratio of leading coefficients: {clean(a)}
                /1 = {clean(a)}, so y = {clean(a)}.
              </p>
            </section>
          </main>
          <aside>
            <section className="rational138-controls">
              <h3>Function controls</h3>
              <label>
                Numerator scale (leading coefficient)
                <input
                  aria-label="Rational numerator scale"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={a}
                  onChange={(event) => changeA(Number(event.target.value))}
                />
                <output>{clean(a)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
              <label>
                Restricted input (denominator zero)
                <input
                  aria-label="Rational restricted input"
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={h}
                  onChange={(event) => changeH(Number(event.target.value))}
                />
                <output>{clean(h)}</output>
                <small>
                  <span>-10</span>
                  <span>10</span>
                </small>
              </label>
              <article>
                <strong>
                  <i>f(x)</i> = <Fraction a={a} root={root} h={h} />
                </strong>
                <p>
                  Restricted input (denominator zero): <b>x = {clean(h)}</b>
                </p>
                <p>
                  {hole ? "Removable hole" : "Vertical asymptote"}:{" "}
                  <b>
                    {hole ? `(${clean(h)}, ${clean(a)})` : `x = ${clean(h)}`}
                  </b>
                </p>
                <p>
                  Long-run value (equal degrees): <b>y = {clean(a)}</b>
                </p>
              </article>
            </section>
            <section className="rational138-reason">
              <h3>Quick reasoning</h3>
              {[
                [
                  "Find denominator zero",
                  `Solve ${binomial(h)} = 0 to find excluded input.`,
                ],
                [
                  "Exclude restricted input",
                  `Do not substitute x = ${clean(h)} (division by zero).`,
                ],
                [
                  "Compare degrees for end behavior",
                  `Degrees are equal → horizontal line y = ${clean(a)}.`,
                ],
                [
                  "Sketch branches",
                  hole
                    ? "Cancel the common factor conceptually, then mark the hole."
                    : "Use VA as boundary and long-run value to guide both sides.",
                ],
              ].map(([title, text], index) => (
                <article key={title}>
                  <span>{index + 1}</span>
                  <div>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </section>
            <section className="rational138-warning">
              <TriangleAlert />
              <div>
                <b>{hole ? "COMMON_FACTOR_HOLE" : "DENOMINATOR_ZERO"}</b>
                <p>
                  {hole
                    ? `The common factor creates a removable hole at (${clean(h)}, ${clean(a)}).`
                    : `Never substitute x = ${clean(h)}. Division by zero is undefined.`}
                </p>
              </div>
            </section>
            <section
              className="rational138-practice"
              role="button"
              tabIndex={0}
              onClick={loadPractice}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") loadPractice();
              }}
            >
              <h3>Practice</h3>
              <p>Try another example.</p>
              <strong>
                <i>h(x)</i> = <Fraction a={1} root={3} h={-2} />
              </strong>
              <p>Vertical asymptote: x = −2</p>
              <p>Long-run value: y = 1</p>
            </section>
          </aside>
        </div>
      </section>
      <nav className="rational138-adjacent">
        <a href="/lessons/graphs-and-functions/137-reciprocal-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Reciprocal Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/139-square-root-functions">
          <span>
            <small>NEXT</small>Square-Root Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="rational138-footer">
        <b>
          <Sparkles />
          Math Universe
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
