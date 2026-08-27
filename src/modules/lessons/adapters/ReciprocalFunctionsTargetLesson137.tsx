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
  Minus,
  MousePointer2,
  Move,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./ReciprocalFunctionsTargetLesson137.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const denominator = (h: number) =>
  h < 0 ? `x + ${clean(Math.abs(h))}` : `x − ${clean(h)}`;
const formula = (a: number, h: number, name = "f") =>
  `${name}(x) = ${clean(a)}/(${denominator(h)})`;

function Fraction({ a, h }: { a: number; h: number }) {
  return (
    <span className="recip137-frac">
      <b>{clean(a)}</b>
      <b>{denominator(h)}</b>
    </span>
  );
}

type Tool = "pointer" | "pan";

function ReciprocalGraph({
  a,
  h,
  center,
  span,
  tool,
  onH,
  onA,
  onCenter,
}: {
  a: number;
  h: number;
  center: number;
  span: number;
  tool: Tool;
  onH: (value: number) => void;
  onA: (value: number) => void;
  onCenter: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"asymptote" | "scale" | "pan" | null>(null);
  const minX = center - span,
    maxX = center + span,
    minY = -7,
    maxY = 7;
  const px = (x: number) => 210 + (x - center) * (420 / (span * 2)),
    py = (y: number) => 255 - y * (490 / (maxY - minY));
  const evaluate = (x: number) => a / (x - h);
  const branch = (from: number, to: number, steps = 150) =>
    Array.from({ length: steps }, (_, index) => {
      const x = from + (to - from) * (index / (steps - 1)),
        y = evaluate(x);
      return `${index ? "L" : "M"}${px(x)},${py(y)}`;
    }).join(" ");
  const samples = [h - 3, h - 1, h + 1, h + 3];
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const graphX =
      center +
      (((event.clientX - box.left) / box.width) * 420 - 210) *
        ((span * 2) / 420);
    const graphY =
      (255 - ((event.clientY - box.top) / box.height) * 510) * (14 / 490);
    if (drag === "asymptote")
      onH(Math.max(-4, Math.min(4, Math.round(graphX))));
    if (drag === "scale") {
      const next = Math.max(1, Math.min(5, Math.round(graphY * 4) / 4));
      onA(next);
    }
    if (drag === "pan")
      onCenter(
        Math.max(
          -4,
          Math.min(
            4,
            Math.round(
              (center - (event.movementX / box.width) * (span * 2)) * 4,
            ) / 4,
          ),
        ),
      );
  };
  const startPan = (event: PointerEvent<SVGSVGElement>) => {
    if (tool !== "pan") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag("pan");
  };
  return (
    <svg
      ref={svg}
      className={`recip137-graph ${tool}`}
      viewBox="0 0 420 510"
      role="img"
      aria-label="Reciprocal function graph with draggable asymptote and scale point"
      onPointerDown={startPan}
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="recip137-grid"
          width={420 / (span * 2)}
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${420 / (span * 2)} 0H0V35`}
            fill="none"
            stroke="#dde6ec"
          />
        </pattern>
        <clipPath id="recip137-clip">
          <rect x="5" y="5" width="410" height="500" />
        </clipPath>
      </defs>
      <rect x="5" y="5" width="410" height="500" fill="url(#recip137-grid)" />
      <line x1="5" x2="415" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="505" y2="5" className="axis" />
      {Array.from(
        { length: Math.floor(maxX) - Math.ceil(minX) + 1 },
        (_, i) => Math.ceil(minX) + i,
      ).map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 18}>
          {x}
        </text>
      ))}
      {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((y) => (
        <text key={`y${y}`} x={px(0) - 12} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <line
        x1={px(h)}
        x2={px(h)}
        y1="5"
        y2="505"
        className="vertical-asymptote"
      />
      <line
        x1="5"
        x2="415"
        y1={py(0)}
        y2={py(0)}
        className="horizontal-asymptote"
      />
      <path
        d={branch(minX, Math.max(minX, h - 0.08))}
        className="curve"
        clipPath="url(#recip137-clip)"
      />
      <path
        d={branch(Math.min(maxX, h + 0.08), maxX)}
        className="curve"
        clipPath="url(#recip137-clip)"
      />
      {samples
        .filter((x) => x >= minX && x <= maxX)
        .map((x, index) => (
          <g className="point" key={x}>
            <circle cx={px(x)} cy={py(evaluate(x))} r="5" />
            <text
              x={px(x) + (index < 2 ? -22 : 22)}
              y={py(evaluate(x)) + (index === 1 ? 26 : -12)}
            >
              ({clean(x)}, {clean(evaluate(x))})
            </text>
          </g>
        ))}
      <g className="excluded">
        <circle cx={px(h)} cy={py(0)} r="8" />
        <line x1={px(h) - 6} x2={px(h) + 6} y1={py(0) - 6} y2={py(0) + 6} />
      </g>
      <circle
        data-testid="reciprocal-asymptote-handle"
        cx={px(h)}
        cy={py(0)}
        r="15"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag excluded reciprocal input"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={h}
        onPointerDown={(event) => {
          if (tool !== "pointer") return;
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("asymptote");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onH(Math.max(-4, h - 1));
          if (event.key === "ArrowRight") onH(Math.min(4, h + 1));
        }}
      />
      <circle
        data-testid="reciprocal-scale-handle"
        cx={px(h + 1)}
        cy={py(a)}
        r="15"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag reciprocal scale point"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={a}
        onPointerDown={(event) => {
          if (tool !== "pointer") return;
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(5, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(1, a - 0.25));
        }}
      />
    </svg>
  );
}

export default function ReciprocalFunctionsTargetLesson137({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(3),
    [h, setH] = useState(1),
    [center, setCenter] = useState(0),
    [span, setSpan] = useState(7),
    [tool, setTool] = useState<Tool>("pointer"),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [actions, setActions] = useState(0),
    [shared, setShared] = useState(false),
    [workspace, setWorkspace] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [practice, setPractice] = useState(false);
  const evaluate = (x: number) => a / (x - h),
    sampleXs = [h - 3, h - 1, h + 1, h + 3],
    samples = sampleXs.map((x) => [x, evaluate(x)]);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
      setA(value);
      act();
    },
    changeH = (value: number) => {
      setH(value);
      act();
    },
    changeCenter = (value: number) => {
      setCenter(value);
      act();
    };
  const reset = () => {
    setA(3);
    setH(1);
    setCenter(0);
    setSpan(7);
    setTool("pointer");
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
  return (
    <div
      className={`recip137-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0194"
      data-dedicated-lesson="137"
      data-object-model="editable-reciprocal-scale-and-excluded-input-pointer-keyboard-draggable-asymptote-and-scale-point-generated-two-branch-graph-working-pan-zoom-linked-samples-domain-range-reasoning-warning-practice-model"
      data-a={a}
      data-h={h}
      data-formula={formula(a, h)}
      data-vertical-asymptote={`x=${h}`}
      data-horizontal-asymptote="y=0"
      data-domain={`x!=${h}`}
      data-range="y!=0"
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-center={center}
      data-span={span}
      data-tool={tool}
      data-practice={practice}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="recip137-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>137 Reciprocal Functions</b>
      </nav>
      <header className="recip137-intro">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
        </small>
        <h1>Reciprocal Functions</h1>
        <p>Understand asymptotes.</p>
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
              aria-label="Reciprocal functions language"
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
      </header>
      <nav className="recip137-tabs">
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
                setH(-3);
                setPractice(true);
              }
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <div className="recip137-body">
        <div className="recip137-left">
          <section className="recip137-lab">
            <header>
              <div>
                <small>INTERACTION + VISUALIZATION</small>
                <h2>
                  Asymptote explorer for{" "}
                  <i>
                    f(x) = <Fraction a={a} h={h} />
                  </i>
                </h2>
              </div>
              <b>● Interactive mode</b>
              <button
                aria-label="Expand asymptote explorer"
                onClick={() => {
                  setFullscreen((value) => !value);
                  act();
                }}
              >
                <Expand />
              </button>
            </header>
            <p>
              Explore how the graph of{" "}
              <i>
                f(x) = <Fraction a={a} h={h} />
              </i>{" "}
              has vertical and horizontal asymptotes.
            </p>
            <div className="recip137-graph-card">
              <nav>
                <button
                  className={tool === "pointer" ? "active" : ""}
                  aria-label="Select graph objects"
                  onClick={() => {
                    setTool("pointer");
                    act();
                  }}
                >
                  <MousePointer2 />
                </button>
                <button
                  className={tool === "pan" ? "active" : ""}
                  aria-label="Pan reciprocal graph"
                  onClick={() => {
                    setTool("pan");
                    act();
                  }}
                >
                  <Move />
                </button>
                <button
                  aria-label="Zoom in reciprocal graph"
                  onClick={() => {
                    setSpan((value) => Math.max(4, value - 1));
                    act();
                  }}
                >
                  <ZoomIn />
                </button>
                <button
                  aria-label="Zoom out reciprocal graph"
                  onClick={() => {
                    setSpan((value) => Math.min(9, value + 1));
                    act();
                  }}
                >
                  <ZoomOut />
                </button>
              </nav>
              <ReciprocalGraph
                a={a}
                h={h}
                center={center}
                span={span}
                tool={tool}
                onH={changeH}
                onA={changeA}
                onCenter={changeCenter}
              />
              <section className="recip137-legend">
                <p>
                  <i></i>
                  <b>Rule</b>
                  <strong>
                    f(x) = <Fraction a={a} h={h} />
                  </strong>
                </p>
                <p>
                  <i></i>
                  <b>Vertical asymptote</b>
                  <strong>x = {clean(h)}</strong>
                </p>
                <p>
                  <i></i>
                  <b>Horizontal asymptote</b>
                  <strong>y = 0</strong>
                </p>
              </section>
              <footer>
                <Lightbulb />
                The graph approaches the asymptotes but never crosses the
                vertical asymptote x = {clean(h)}.
              </footer>
            </div>
          </section>
          <nav className="recip137-adjacent">
            <a href="/lessons/graphs-and-functions/136-higher-degree-polynomials">
              <ArrowLeft />
              <span>
                <small>PREVIOUS</small>Higher-Degree Polynomials
              </span>
            </a>
            <a href="/lessons/graphs-and-functions/138-rational-functions">
              <span>
                <small>NEXT</small>Rational Functions
              </span>
              <ArrowRight />
            </a>
          </nav>
        </div>
        <aside className="recip137-rail">
          <section className="recip137-controls">
            <header>
              <h3>Graph controls</h3>
              <button
                aria-label="Expand graph controls"
                onClick={() => {
                  setFullscreen((value) => !value);
                  act();
                }}
              >
                <Expand />
              </button>
            </header>
            <label>
              Scale <small>?</small>
              <input
                aria-label="Reciprocal scale"
                type="range"
                min="1"
                max="5"
                step=".25"
                value={a}
                onChange={(event) => changeA(Number(event.target.value))}
              />
              <output>{clean(a)}</output>
              <span>
                <i>1</i>
                <i>5</i>
              </span>
            </label>
            <label>
              Excluded x <small>?</small>
              <div>
                <output>{clean(h)}</output>
                <button
                  aria-label="Decrease excluded reciprocal input"
                  onClick={() => changeH(Math.max(-4, h - 1))}
                >
                  <Minus />
                </button>
                <button
                  aria-label="Increase excluded reciprocal input"
                  onClick={() => changeH(Math.min(4, h + 1))}
                >
                  <Plus />
                </button>
              </div>
              <p>This value is excluded from the function.</p>
            </label>
          </section>
          <section className="recip137-values">
            <h3>Key values</h3>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>
                    f(x) = <Fraction a={a} h={h} />
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
            <p>Sample points on both branches.</p>
          </section>
          <section className="recip137-reason">
            <h3>Reason it out</h3>
            {[
              [
                "Find excluded denominator value",
                `Set ${denominator(h)} = 0 ⇒ x = ${clean(h)}`,
              ],
              [
                "Draw vertical asymptote",
                `Draw dashed line at x = ${clean(h)}`,
              ],
              ["Draw horizontal asymptote", "As x → ±∞, f(x) → 0 ⇒ y = 0"],
              [
                "Sketch two branches",
                "Plot points and draw smooth curves approaching asymptotes",
              ],
            ].map(([title, text], index) => (
              <article key={title}>
                <Check />
                <div>
                  <b>
                    {index + 1}. {title}
                  </b>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </section>
          <section className="recip137-warning">
            <TriangleAlert />
            <div>
              <b>CROSS_ASYMPTOTE</b>
              <p>
                The graph approaches an asymptote but{" "}
                <strong>does not cross</strong> the vertical asymptote x ={" "}
                {clean(h)}.
              </p>
              <svg viewBox="0 0 120 52" aria-hidden="true">
                <line x1="60" x2="60" y1="2" y2="50" />
                <line x1="5" x2="115" y1="30" y2="30" />
                <path d="M10 8 C32 22 42 13 55 28 M65 4 C68 26 76 31 112 44" />
                <circle cx="60" cy="30" r="12" />
              </svg>
            </div>
          </section>
          <section className="recip137-practice">
            <GraduationCap />
            <div>
              <h3>Practice</h3>
              <p>Try this similar function:</p>
              <strong>
                g(x) = <Fraction a={2} h={-3} />
              </strong>
              <p>Vertical asymptote: x = −3</p>
              <p>Horizontal asymptote: y = 0</p>
              <button
                onClick={() => {
                  setA(2);
                  setH(-3);
                  setPractice(true);
                  setTab("Examples");
                  act();
                }}
              >
                Open practice
              </button>
            </div>
          </section>
        </aside>
      </div>
      <footer className="recip137-footer">
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
