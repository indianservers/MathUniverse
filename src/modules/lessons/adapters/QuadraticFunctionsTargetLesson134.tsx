import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  GraduationCap,
  Languages,
  Lightbulb,
  RotateCcw,
  Scale,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./QuadraticFunctionsTargetLesson134.css";
import "./QuadraticFunctionsTargetLesson134Tuning.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const inside = (h: number) =>
  h < 0 ? `+ ${clean(Math.abs(h))}` : `− ${clean(h)}`;
const outside = (k: number) =>
  k < 0 ? `− ${clean(Math.abs(k))}` : `+ ${clean(k)}`;
const formula = (a: number, h: number, k: number, name = "f") =>
  `${name}(x) = ${a === 1 ? "" : clean(a)}(x ${inside(h)})² ${outside(k)}`;

function QuadraticGraph({
  a,
  h,
  k,
  onVertex,
  onScale,
}: {
  a: number;
  h: number;
  k: number;
  onVertex: (h: number, k: number) => void;
  onScale: (a: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"vertex" | "scale" | null>(null);
  const px = (x: number) => 170 + x * 42,
    py = (y: number) => 290 - y * 48;
  const shapeX = h + 1,
    shapeY = a + k;
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 430 - 170) / 42,
      y = (290 - ((event.clientY - box.top) / box.height) * 470) / 48;
    if (drag === "vertex")
      onVertex(
        Math.max(-3, Math.min(4, Math.round(x))),
        Math.max(-5, Math.min(5, Math.round(y))),
      );
    else
      onScale(Math.max(0.1, Math.min(3, Math.round((y - k) * 20) / 20)));
  };
  const path = Array.from({ length: 151 }, (_, index) => {
    const x = -3 + index * (7 / 150),
      y = a * (x - h) ** 2 + k;
    return `${index ? "L" : "M"}${px(x)},${py(y)}`;
  }).join(" ");
  const mirrorX = h - 1,
    mirrorY = shapeY;
  return (
    <svg
      ref={svg}
      className="quad134-graph"
      viewBox="0 0 430 470"
      role="img"
      aria-label="Quadratic vertex and symmetry graph"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="quad134-grid"
          width="42"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M42 0H0V48"
            fill="none"
            stroke="#dce6ec"
            strokeDasharray="3 3"
          />
        </pattern>
        <clipPath id="quad134-clip">
          <rect x="10" y="10" width="410" height="450" />
        </clipPath>
      </defs>
      <rect x="10" y="10" width="410" height="450" fill="url(#quad134-grid)" />
      <line x1="10" x2="420" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="460" y2="10" className="axis" />
      {[-3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 22}>
          {x}
        </text>
      ))}
      {[-2, -1, 1, 2, 3, 4, 5].map((y) => (
        <text key={`y${y}`} x={px(0) - 14} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <text x="415" y={py(0) - 9} className="xy">
        x
      </text>
      <text x={px(0) - 13} y="22" className="xy">
        y
      </text>
      <line x1={px(h)} x2={px(h)} y1="10" y2="460" className="symmetry" />
      <text x={px(h)} y="24" className="symmetry-label">
        x = {clean(h)}
      </text>
      <path d={path} className="curve" clipPath="url(#quad134-clip)" />
      {[
        [-2, a * (-2 - h) ** 2 + k],
        [mirrorX, mirrorY],
        [h, k],
        [shapeX, shapeY],
      ].map(([x, y], index) => (
        <g key={`${x}-${index}`} className="point">
          <circle cx={px(x)} cy={py(y)} r={index === 2 ? 8 : 7} />
          <text
            x={px(x) + (index === 0 ? -24 : index === 2 ? 0 : 23)}
            y={py(y) + (index === 2 ? 28 : index === 0 ? -16 : 24)}
          >
            ({clean(x)}, {clean(y)})
          </text>
        </g>
      ))}
      <circle
        cx={px(h)}
        cy={py(k)}
        r="14"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag quadratic vertex"
        aria-valuetext={`vertex ${clean(h)}, ${clean(k)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("vertex");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onVertex(Math.max(-3, h - 1), k);
          if (event.key === "ArrowRight") onVertex(Math.min(4, h + 1), k);
          if (event.key === "ArrowUp") onVertex(h, Math.min(5, k + 1));
          if (event.key === "ArrowDown") onVertex(h, Math.max(-5, k - 1));
        }}
      />
      <circle
        cx={px(shapeX)}
        cy={py(shapeY)}
        r="14"
        className="handle scale"
        role="slider"
        tabIndex={0}
        aria-label="Drag quadratic opening point"
        aria-valuemin={0.1}
        aria-valuemax={3}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onScale(Math.min(3, a + 0.25));
          if (event.key === "ArrowDown") onScale(Math.max(0.1, a - 0.25));
        }}
      />
    </svg>
  );
}

export default function QuadraticFunctionsTargetLesson134({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(0.75),
    [h, setH] = useState(1),
    [k, setK] = useState(-2),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [actions, setActions] = useState(0),
    [shared, setShared] = useState(false),
    [workspace, setWorkspace] = useState(false),
    [fullscreen, setFullscreen] = useState(false);
  const evaluate = (x: number) => a * (x - h) ** 2 + k,
    sampleXs = [-2, 0, 1, 2],
    samples = sampleXs.map((x) => [x, evaluate(x)]),
    direction = a > 0 ? "Upward" : "Downward";
  const act = () => {
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
    },
    changeK = (value: number) => {
      setK(value);
      act();
    };
  const changeVertex = (nextH: number, nextK: number) => {
    setH(nextH);
    setK(nextK);
    act();
  };
  const reset = () => {
    setA(0.75);
    setH(1);
    setK(-2);
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
      className={`quad134-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0191"
      data-dedicated-lesson="134"
      data-object-model="editable-quadratic-vertex-form-linked-parameters-pointer-keyboard-draggable-vertex-and-opening-point-generated-parabola-symmetry-axis-mirror-points-value-table-reasoning-practice-model"
      data-a={a}
      data-h={h}
      data-k={k}
      data-vertex={`${h},${k}`}
      data-formula={formula(a, h, k)}
      data-direction={direction}
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="quad134-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>134 Quadratic Functions</b>
      </nav>
      <header className="quad134-intro">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>FUNCTIONS</b>
        </small>
        <h1>Quadratic Functions</h1>
        <p>Analyse parabolas.</p>
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
              aria-label="Quadratic functions language"
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
      </header>
      <nav className="quad134-tabs">
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
                setA(2);
                setH(-1);
                setK(3);
              }
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="quad134-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Vertex and Symmetry Explorer</h2>
          </div>
          <nav>
            <b className={actions ? "updated" : ""}>
              {actions ? "Updated" : "Awaiting interaction"}
            </b>
            <button
              aria-label="Expand vertex and symmetry explorer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="quad134-layout">
          <main>
            <div className="quad134-formula">
              <strong>
                <i>f(x)</i> = {clean(a)}(x {inside(h)})² {outside(k)}
              </strong>
              <span>Rule: {formula(a, h, k)}</span>
            </div>
            <QuadraticGraph
              a={a}
              h={h}
              k={k}
              onVertex={changeVertex}
              onScale={changeA}
            />
          </main>
          <aside>
            <section className="quad134-controls">
              <h3>
                <SlidersHorizontal />
                Explore parameters
              </h3>
              <label>
                Opening scale (a)
                <input
                  aria-label="Quadratic opening scale"
                  type="range"
                  min=".1"
                  max="3"
                  step=".05"
                  value={a}
                  onChange={(event) => changeA(Number(event.target.value))}
                />
                <output>{clean(a)}</output>
                <small>
                  <span>0.1</span>
                  <span>3</span>
                </small>
              </label>
              <label>
                Vertex x-coordinate (h)
                <input
                  aria-label="Quadratic vertex x"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={h}
                  onChange={(event) => changeH(Number(event.target.value))}
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
                  aria-label="Quadratic vertical shift"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={k}
                  onChange={(event) => changeK(Number(event.target.value))}
                />
                <output>{clean(k)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
            </section>
            <section className="quad134-values">
              <h3>
                <SlidersHorizontal />
                Key values
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x)</th>
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
            </section>
          </aside>
        </div>
        <div className="quad134-lower">
          <section className="quad134-reason">
            <h3>
              <Target />
              Reasoning checkpoints
            </h3>
            {[
              [
                Target,
                "Locate vertex",
                `${a > 0 ? "The lowest" : "The highest"} point is the vertex at (h, k) = (${clean(h)}, ${clean(k)}).`,
              ],
              [
                SlidersHorizontal,
                "Draw symmetry axis",
                `Axis of symmetry is the vertical line x = ${clean(h)}.`,
              ],
              [
                Scale,
                "Compare mirrored points",
                `Points equidistant from x = ${clean(h)} have equal y-values.`,
              ],
              [
                TrendingUp,
                "Read opening direction",
                `Since a = ${clean(a)} ${a > 0 ? ">" : "<"} 0, the parabola opens ${direction.toLowerCase()}.`,
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
            <section className="quad134-warning">
              <TriangleAlert />
              <div>
                <h3>Important</h3>
                <strong>IGNORE_VERTEX</strong>
                <p>
                  Do not describe increasing or decreasing{" "}
                  <b>before finding the vertex.</b>
                  <br />
                  First, locate the vertex and axis of symmetry.
                </p>
              </div>
            </section>
            <section className="quad134-practice">
              <GraduationCap />
              <div>
                <h3>Try it yourself</h3>
                <p>Find the vertex, axis of symmetry and opening direction.</p>
                <article>
                  <strong>g(x) = 2(x + 1)² + 3</strong>
                  <p>
                    <Check />
                    Vertex: (−1, 3)
                  </p>
                  <p>
                    <Check />
                    Axis: x = −1
                  </p>
                  <p>
                    <Check />
                    Opens: Upward
                  </p>
                </article>
              </div>
            </section>
          </aside>
        </div>
        <footer>
          <Lightbulb />
          Tip: Use the sliders to explore how changing a, h, or k affects the
          parabola’s shape and position.
        </footer>
      </section>
      <nav className="quad134-adjacent">
        <a href="/lessons/graphs-and-functions/133-linear-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Linear Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/135-cubic-functions">
          <span>
            <small>NEXT</small>Cubic Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="quad134-footer">
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
