import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  GraduationCap,
  Languages,
  Move3D,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./CubicFunctionsTargetLesson135.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const signed = (value: number) =>
  value < 0 ? `− ${clean(Math.abs(value))}` : `+ ${clean(value)}`;
const inside = (value: number) =>
  value < 0 ? `+ ${clean(Math.abs(value))}` : `− ${clean(value)}`;
const coefficient = (value: number) =>
  value === 1 ? "" : value === -1 ? "−" : clean(value);
const expression = (a: number, h: number, k: number) => {
  const core = h === 0 ? "x³" : `(x ${inside(h)})³`;
  return `${coefficient(a)}${core}${k === 0 ? "" : ` ${signed(k)}`}`;
};
const formula = (a: number, h: number, k: number, name = "f") =>
  `${name}(x) = ${expression(a, h, k)}`;

function CubicGraph({
  a,
  h,
  k,
  onCenter,
  onScale,
}: {
  a: number;
  h: number;
  k: number;
  onCenter: (h: number, k: number) => void;
  onScale: (a: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"center" | "scale" | null>(null);
  const px = (x: number) => 224 + x * 66;
  const py = (y: number) => 252 - y * 15;
  const shapeX = h + 1;
  const shapeY = k + a;
  const evaluate = (x: number) => a * (x - h) ** 3 + k;
  const path = Array.from({ length: 193 }, (_, index) => {
    const x = -3.2 + index / 30;
    return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
  }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 448 - 224) / 66;
    const y = (252 - ((event.clientY - box.top) / box.height) * 500) / 15;
    if (drag === "center") {
      onCenter(
        Math.max(-4, Math.min(4, Math.round(x))),
        Math.max(-5, Math.min(5, Math.round(y))),
      );
      return;
    }
    const next = Math.max(-3, Math.min(3, Math.round((y - k) * 4) / 4));
    onScale(next === 0 ? (a < 0 ? -0.25 : 0.25) : next);
  };
  const points = [-2, -1, 0, 1, 2].map((offset) => [
    h + offset,
    evaluate(h + offset),
  ]);
  const positive = a > 0;
  return (
    <svg
      ref={svg}
      className="cubic135-graph"
      viewBox="0 0 448 500"
      role="img"
      aria-label="Interactive cubic graph with draggable inflection and bend points"
      onPointerMove={move}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="cubic135-grid"
          width="43"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M43 0H0V25"
            fill="none"
            stroke="#dde6ec"
            strokeDasharray="3 3"
          />
        </pattern>
        <clipPath id="cubic135-clip">
          <rect x="8" y="8" width="432" height="484" />
        </clipPath>
        <marker
          id="cubic135-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#079bb4" />
        </marker>
      </defs>
      <rect x="8" y="8" width="432" height="484" fill="url(#cubic135-grid)" />
      <line x1="8" x2="440" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="492" y2="8" className="axis" />
      {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 19}>
          {x}
        </text>
      ))}
      {[-15, -10, -5, 5, 10, 15].map((y) => (
        <text key={`y${y}`} x={px(0) - 13} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <text x="432" y={py(0) - 10} className="xy">
        x
      </text>
      <text x={px(0) + 10} y="20" className="xy">
        y
      </text>
      <path d={path} className="curve" clipPath="url(#cubic135-clip)" />
      <line
        x1={positive ? 92 : 356}
        x2={positive ? 82 : 366}
        y1="414"
        y2="470"
        className="end-arrow"
        markerEnd="url(#cubic135-arrow)"
      />
      <line
        x1={positive ? 356 : 92}
        x2={positive ? 366 : 82}
        y1="90"
        y2="34"
        className="end-arrow"
        markerEnd="url(#cubic135-arrow)"
      />
      <g className="end-label">
        <rect x="12" y="390" width="102" height="58" rx="7" />
        <text x="63" y="412">
          As x → −∞,
        </text>
        <text x="63" y="433">
          f(x) → {positive ? "−∞" : "∞"}
        </text>
      </g>
      <g className="end-label">
        <rect x="334" y="72" width="102" height="58" rx="7" />
        <text x="385" y="94">
          As x → ∞,
        </text>
        <text x="385" y="115">
          f(x) → {positive ? "∞" : "−∞"}
        </text>
      </g>
      {points.map(
        ([x, y], index) =>
          Math.abs(y) <= 9.5 && (
            <g className="point" key={`${x}-${index}`}>
              <circle cx={px(x)} cy={py(y)} r={index === 2 ? 7 : 5} />
              <text x={px(x) + (index < 2 ? -23 : 24)} y={py(y) - 10}>
                ({clean(x)}, {clean(y)})
              </text>
            </g>
          ),
      )}
      <circle
        data-testid="cubic-inflection-handle"
        cx={px(h)}
        cy={py(k)}
        r="14"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag cubic inflection point"
        aria-valuetext={`inflection ${clean(h)}, ${clean(k)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("center");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onCenter(Math.max(-4, h - 1), k);
          if (event.key === "ArrowRight") onCenter(Math.min(4, h + 1), k);
          if (event.key === "ArrowUp") onCenter(h, Math.min(5, k + 1));
          if (event.key === "ArrowDown") onCenter(h, Math.max(-5, k - 1));
        }}
      />
      <circle
        data-testid="cubic-bend-handle"
        cx={px(shapeX)}
        cy={py(shapeY)}
        r="14"
        className="handle bend"
        role="slider"
        tabIndex={0}
        aria-label="Drag cubic bend point"
        aria-valuemin={-3}
        aria-valuemax={3}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onScale(Math.min(3, a + 0.25) || 0.25);
          if (event.key === "ArrowDown")
            onScale(Math.max(-3, a - 0.25) || -0.25);
        }}
      />
    </svg>
  );
}

function HeroCubic() {
  return (
    <svg viewBox="0 0 250 150" role="img" aria-label="Cubic function preview">
      <rect width="250" height="150" rx="8" fill="#09294b" />
      <g stroke="#315272" strokeWidth="1">
        {[25, 50, 75, 100, 125, 150, 175, 200, 225].map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2="150" />
        ))}
        {[25, 50, 75, 100, 125].map((y) => (
          <line key={y} x1="0" x2="250" y1={y} y2={y} />
        ))}
      </g>
      <line x1="10" x2="240" y1="75" y2="75" stroke="#dbeafe" />
      <line x1="125" x2="125" y1="8" y2="142" stroke="#dbeafe" />
      <path
        d="M28 133 C76 133 89 117 105 91 C119 68 131 82 145 57 C161 29 176 18 223 18"
        fill="none"
        stroke="#24c5dc"
        strokeWidth="5"
      />
      <circle cx="125" cy="75" r="5" fill="#fff" />
    </svg>
  );
}

export default function CubicFunctionsTargetLesson135({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const evaluate = (x: number) => a * (x - h) ** 3 + k;
  const sampleXs = [-2, -1, 0, 1, 2].map((offset) => h + offset);
  const samples = sampleXs.map((x) => [x, evaluate(x)]);
  const direction = a > 0 ? "down-left,up-right" : "up-left,down-right";
  const symmetry = h === 0 && k === 0 ? "origin" : `${clean(h)},${clean(k)}`;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
    setA(value === 0 ? 0.25 : value);
    act();
  };
  const changeCenter = (nextH: number, nextK: number) => {
    setH(nextH);
    setK(nextK);
    act();
  };
  const reset = () => {
    setA(1);
    setH(0);
    setK(0);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setActions(0);
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`cubic135-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0192"
      data-dedicated-lesson="135"
      data-object-model="editable-cubic-inflection-form-signed-bend-pointer-keyboard-draggable-inflection-and-shape-points-generated-s-curve-opposite-end-behavior-point-symmetry-linked-value-table-reasoning-practice-model"
      data-a={a}
      data-h={h}
      data-k={k}
      data-inflection={`${h},${k}`}
      data-formula={formula(a, h, k)}
      data-direction={direction}
      data-symmetry={symmetry}
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="cubic135-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>135 Cubic Functions</b>
      </nav>
      <header className="cubic135-intro">
        <div className="cubic135-intro-copy">
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Cubic Functions</h1>
          <p>Explore turning points and end behaviour.</p>
          <nav>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Graph Explorer</b>
            <b>▣ Graphing Calculator</b>
            <b>◷ 6-10 min</b>
          </nav>
          <div>
            <label>
              <Languages />
              <select
                aria-label="Cubic functions language"
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
          </div>
        </div>
        <HeroCubic />
      </header>
      <nav className="cubic135-tabs">
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
              if (name === "Examples") {
                setA(-1);
                setH(1);
                setK(2);
              }
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cubic135-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>
              Cubic Shape Explorer — <i>f(x) = {expression(a, h, k)}</i>
            </h2>
          </div>
          <nav>
            <b className={actions ? "updated" : ""}>
              {actions ? "Updated" : "● Ready"}
            </b>
            <button
              aria-label="Expand cubic shape explorer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="cubic135-layout">
          <main>
            <div className="cubic135-formula">
              <strong>
                Rule: <i>f(x)</i> = {expression(a, h, k)}
              </strong>
              <span>
                Inflection point: ({clean(h)}, {clean(k)})
              </span>
            </div>
            <CubicGraph
              a={a}
              h={h}
              k={k}
              onCenter={changeCenter}
              onScale={changeA}
            />
            <div className="cubic135-symmetry">
              <Move3D />
              <div>
                <b>
                  {h === 0 && k === 0 ? "Origin symmetry" : "Point symmetry"}
                </b>
                <span>
                  {h === 0 && k === 0
                    ? "f(−x) = −f(x)"
                    : `180° rotation about (${clean(h)}, ${clean(k)})`}
                </span>
              </div>
            </div>
          </main>
          <aside>
            <section className="cubic135-controls">
              <h3>
                <SlidersHorizontal />
                Shape controls
              </h3>
              <label>
                Bend strength (a)
                <input
                  aria-label="Cubic bend strength"
                  type="range"
                  min="-3"
                  max="3"
                  step=".25"
                  value={a}
                  onChange={(event) => changeA(Number(event.target.value))}
                />
                <output>{clean(a)}</output>
                <small>
                  <span>-3</span>
                  <span>3</span>
                </small>
              </label>
              <label>
                Center shift (h)
                <input
                  aria-label="Cubic center shift"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={h}
                  onChange={(event) => {
                    setH(Number(event.target.value));
                    act();
                  }}
                />
                <output>{clean(h)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
              <label>
                Vertical shift (k)
                <input
                  aria-label="Cubic vertical shift"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={k}
                  onChange={(event) => {
                    setK(Number(event.target.value));
                    act();
                  }}
                />
                <output>{clean(k)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
            </section>
            <section className="cubic135-values">
              <h3>
                <Target />
                Key values for <i>f(x) = {expression(a, h, k)}</i>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x)</th>
                    <th>(x, f(x))</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map(([x, y]) => (
                    <tr key={x}>
                      <td>{clean(x)}</td>
                      <td>{clean(y)}</td>
                      <td>
                        ({clean(x)}, {clean(y)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Inflection:{" "}
                <b>
                  ({clean(h)}, {clean(k)})
                </b>
              </p>
            </section>
          </aside>
        </div>
        <div className="cubic135-lower">
          <section className="cubic135-reason">
            <h3>
              <Target />
              Reasoning guide
            </h3>
            {[
              [
                Target,
                "Trace opposite ends",
                a > 0
                  ? "As x → −∞, f(x) → −∞. As x → ∞, f(x) → ∞."
                  : "As x → −∞, f(x) → ∞. As x → ∞, f(x) → −∞.",
              ],
              [
                Target,
                "Locate inflection point",
                `At x = ${clean(h)}, the curve changes concavity. Inflection point is (${clean(h)}, ${clean(k)}).`,
              ],
              [
                Move3D,
                "Check origin symmetry",
                h === 0 && k === 0
                  ? "For every point (x, y), the point (−x, −y) is also on the graph."
                  : `The graph rotates onto itself about (${clean(h)}, ${clean(k)}).`,
              ],
              [
                Move3D,
                "Compare with quadratics",
                "Quadratics open up or down and rise on both ends. Cubics rise on one end and fall on the other.",
              ],
            ].map(([Icon, title, text]) => (
              <article key={String(title)}>
                <Icon />
                <div>
                  <b>{String(title)}</b>
                  <p>{String(text)}</p>
                </div>
              </article>
            ))}
          </section>
          <aside>
            <section className="cubic135-warning">
              <TriangleAlert />
              <div>
                <h3>Common pitfall</h3>
                <strong>QUADRATIC_ENDS</strong>
                <p>
                  A cubic does not have both ends pointing the same way.{" "}
                  <b>Its ends move in opposite directions.</b>
                </p>
              </div>
            </section>
            <section className="cubic135-practice">
              <GraduationCap />
              <div>
                <h3>Practice check</h3>
                <p>For g(x) = −(x − 1)³ + 2:</p>
                <article>
                  <p>
                    <Check />
                    Inflection: (1, 2)
                  </p>
                  <p>
                    <Check />
                    Left end: Up
                  </p>
                  <p>
                    <Check />
                    Right end: Down
                  </p>
                </article>
              </div>
            </section>
          </aside>
        </div>
      </section>
      <nav className="cubic135-adjacent">
        <a href="/lessons/graphs-and-functions/134-quadratic-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Quadratic Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/136-higher-degree-polynomials">
          <span>
            <small>NEXT</small>Higher-Degree Polynomials
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="cubic135-footer">
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
