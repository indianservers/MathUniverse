import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Expand,
  Languages,
  MoveHorizontal,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./HigherDegreePolynomialsTargetLesson136.css";

const clean = (value: number, places = 2) =>
  Math.abs(value) < 0.0005
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
const factor = (root: number) =>
  root < 0 ? `(x + ${clean(Math.abs(root))})` : `(x − ${clean(root)})`;
const unique = (values: number[]) =>
  values.filter(
    (value, index) => index === 0 || Math.abs(value - values[index - 1]) > 0.04,
  );

function numericalZeros(fn: (x: number) => number, min = -5, max = 7) {
  const found: { x: number; error: number }[] = [];
  let previousX = min,
    previousY = fn(min);
  for (let x = min + 0.02; x <= max; x += 0.02) {
    const y = fn(x);
    if (Math.abs(y) < 0.002) found.push({ x, error: Math.abs(y) });
    if (previousY * y < 0) {
      let left = previousX,
        right = x;
      for (let iteration = 0; iteration < 32; iteration += 1) {
        const middle = (left + right) / 2;
        if (fn(left) * fn(middle) <= 0) right = middle;
        else left = middle;
      }
      const root = (left + right) / 2;
      found.push({ x: root, error: Math.abs(fn(root)) });
    }
    previousX = x;
    previousY = y;
  }
  const clusters: { x: number; error: number }[][] = [];
  found
    .sort((a, b) => a.x - b.x)
    .forEach((candidate) => {
      const cluster = clusters.at(-1);
      if (!cluster || candidate.x - cluster.at(-1)!.x > 0.08)
        clusters.push([candidate]);
      else cluster.push(candidate);
    });
  return clusters.map((cluster) => {
    const best = cluster.reduce((winner, candidate) =>
      candidate.error < winner.error ? candidate : winner,
    );
    return Math.round(best.x * 100) / 100;
  });
}

function multiplicities(roots: number[]) {
  return unique([...roots].sort((a, b) => a - b)).map((root) => ({
    root,
    count: roots.filter((value) => Math.abs(value - root) < 0.04).length,
  }));
}

function PolynomialGraph({
  roots,
  shift,
  evaluate,
  onMovingRoot,
}: {
  roots: number[];
  shift: number;
  evaluate: (x: number) => number;
  onMovingRoot: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (x: number) => 193 + x * 38.5;
  const py = (y: number) => 238 - y * 70;
  const path = Array.from({ length: 269 }, (_, index) => {
    const x = -4.5 + index * (10.7 / 268);
    return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
  }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const x = (((event.clientX - box.left) / box.width) * 430 - 193) / 38.5;
    onMovingRoot(Math.max(2, Math.min(6, Math.round(x * 4) / 4)));
  };
  const intercepts = numericalZeros(evaluate);
  return (
    <svg
      ref={svg}
      className="poly136-graph"
      viewBox="0 0 430 480"
      role="img"
      aria-label="Higher-degree polynomial graph with draggable moving root"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="poly136-grid"
          width="38.5"
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <path d="M38.5 0H0V35" fill="none" stroke="#dce5ec" />
        </pattern>
        <clipPath id="poly136-clip">
          <rect x="8" y="8" width="414" height="464" />
        </clipPath>
      </defs>
      <rect x="8" y="8" width="414" height="464" fill="url(#poly136-grid)" />
      <line x1="8" x2="422" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="472" y2="8" className="axis" />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 18}>
          {x}
        </text>
      ))}
      {[-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5].map((y) => (
        <text key={`y${y}`} x={px(0) - 12} y={py(y) + 4}>
          {clean(y, 1)}
        </text>
      ))}
      <path d={path} className="curve" clipPath="url(#poly136-clip)" />
      {intercepts.map((root) => (
        <g className="root" key={root}>
          <circle cx={px(root)} cy={py(0)} r="5" />
          <text x={px(root) + (root < 0 ? -16 : 16)} y={py(0) - 13}>
            ({clean(root)}, 0)
          </text>
        </g>
      ))}
      <circle
        data-testid="moving-polynomial-root"
        cx={px(roots.at(-1) ?? 4)}
        cy={py(shift)}
        r="14"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag moving polynomial root"
        aria-valuemin={2}
        aria-valuemax={6}
        aria-valuenow={roots.at(-1) ?? 4}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          const current = roots.at(-1) ?? 4;
          if (event.key === "ArrowLeft")
            onMovingRoot(Math.max(2, current - 0.25));
          if (event.key === "ArrowRight")
            onMovingRoot(Math.min(6, current + 0.25));
        }}
      />
    </svg>
  );
}

function HeroPolynomial() {
  return (
    <div className="poly136-hero-visual">
      <WandSparkles />
      <b>Degree 4 → up to 4 real roots</b>
      <b>Up to 3 turning points</b>
      <b>Even degree with positive leading coefficient → both ends rise.</b>
      <svg viewBox="0 0 220 75" aria-hidden="true">
        <path d="M0 48 C42 22 72 63 110 64 C160 65 183 50 215 5" />
      </svg>
    </div>
  );
}

export default function HigherDegreePolynomialsTargetLesson136({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [movingRoot, setMovingRoot] = useState(4);
  const [shift, setShift] = useState(0);
  const [practice, setPractice] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const roots = useMemo(
    () => (practice ? [-2, 1, 1] : [-2, 1, 3, movingRoot]),
    [practice, movingRoot],
  );
  const scale = practice ? 0.2 : 0.08;
  const evaluate = (x: number) =>
    roots.reduce((value, root) => value * (x - root), scale) + shift;
  const intercepts = numericalZeros(evaluate);
  const groups = multiplicities(roots);
  const derivative = (x: number) =>
    scale *
    roots.reduce(
      (sum, _root, omitted) =>
        sum +
        roots.reduce(
          (product, root, index) =>
            index === omitted ? product : product * (x - root),
          1,
        ),
      0,
    );
  const turns = numericalZeros(derivative);
  const intervals = [-Infinity, ...intercepts, Infinity]
    .map((bound, index, values) => {
      if (index === values.length - 1) return null;
      const next = values[index + 1];
      const probe = !Number.isFinite(bound)
        ? next - 1
        : !Number.isFinite(next)
          ? bound + 1
          : (bound + next) / 2;
      return {
        left: bound,
        right: next,
        sign: evaluate(probe) >= 0 ? "+" : "−",
      };
    })
    .filter(Boolean) as { left: number; right: number; sign: string }[];
  const degree = roots.length;
  const behavior = degree % 2 === 0 ? "both-rise" : "left-down,right-up";
  const formula = `${clean(scale)}${roots.map(factor).join("")}${shift ? ` ${shift < 0 ? "−" : "+"} ${clean(Math.abs(shift))}` : ""}`;
  const samples = [-2, 0, 2].map((x) => [x, evaluate(x)]);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeRoot = (value: number) => {
    setMovingRoot(value);
    setPractice(false);
    act();
  };
  const reset = () => {
    setMovingRoot(4);
    setShift(0);
    setPractice(false);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setActions(0);
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const intervalText = (left: number, right: number) =>
    `(${Number.isFinite(left) ? clean(left) : "−∞"}, ${Number.isFinite(right) ? clean(right) : "∞"})`;
  return (
    <div
      className={`poly136-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0193"
      data-dedicated-lesson="136"
      data-object-model="editable-factored-higher-degree-polynomial-moving-root-and-vertical-shift-pointer-keyboard-draggable-root-generated-curve-numerical-intercepts-turning-points-multiplicity-sign-intervals-samples-end-behavior-practice-model"
      data-moving-root={movingRoot}
      data-shift={shift}
      data-degree={degree}
      data-formula={formula}
      data-roots={intercepts.join(",")}
      data-factor-roots={roots.join(",")}
      data-multiplicities={groups
        .map((group) => `${group.root}:${group.count}`)
        .join(",")}
      data-turns={turns.join(",")}
      data-behavior={behavior}
      data-signs={intervals.map((interval) => interval.sign).join(",")}
      data-samples={samples.map(([x, y]) => `${x},${clean(y)}`).join(";")}
      data-practice={practice}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="poly136-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>136 Higher Degree Polynomials</b>
      </nav>
      <header className="poly136-intro">
        <div>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Higher-Degree Polynomials</h1>
          <p>Study roots and multiplicities.</p>
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
                aria-label="Higher-degree polynomials language"
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
        <HeroPolynomial />
      </header>
      <nav className="poly136-tabs">
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
                setMovingRoot(5);
                setShift(0);
                setPractice(false);
              }
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="poly136-lab">
        <header>
          <div>
            <small>ROOT AND TURNING POINT EXPLORER</small>
            <p>Explore how roots and turning points shape the graph.</p>
          </div>
          <nav>
            <b className={actions ? "updated" : ""}>
              {actions ? "Updated" : "Awaiting interaction"}
            </b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand root and turning point explorer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="poly136-workspace">
          <main>
            <section className="poly136-equation">
              <strong>
                <i>f(x)</i> = {formula}
              </strong>
              <p>
                {shift === 0
                  ? "Roots (x-intercepts)"
                  : "Factor anchors (graph vertically shifted)"}
              </p>
              <div>
                {groups.map(({ root, count }, index) => (
                  <button
                    key={`${root}-${index}`}
                    className={root === movingRoot && !practice ? "moving" : ""}
                    onClick={() => changeRoot(root)}
                  >
                    <b>{clean(root)}</b>
                    {count > 1 ? (
                      <small>multiplicity {count}</small>
                    ) : root === movingRoot && !practice ? (
                      <small>moving root</small>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
            <PolynomialGraph
              roots={roots}
              shift={shift}
              evaluate={evaluate}
              onMovingRoot={changeRoot}
            />
            <section className="poly136-sign">
              <h3>SIGN OF f(x) BETWEEN ROOTS</h3>
              <div className="labels">
                {intervals.map((interval) => (
                  <span key={`${interval.left}-${interval.right}`}>
                    {intervalText(interval.left, interval.right)}
                  </span>
                ))}
              </div>
              <div className="signs">
                {intervals.map((interval) => (
                  <b
                    className={interval.sign === "+" ? "positive" : "negative"}
                    key={`${interval.left}-${interval.right}`}
                  >
                    {interval.sign}
                  </b>
                ))}
              </div>
            </section>
            <section className="poly136-samples">
              <h3>SAMPLE VALUES</h3>
              <table>
                <tbody>
                  <tr>
                    <th>x</th>
                    {samples.map(([x]) => (
                      <td key={x}>{clean(x)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>f(x)</th>
                    {samples.map(([x, y]) => (
                      <td key={x}>
                        <b>{clean(y)}</b>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <small>Values are calculated from the live polynomial.</small>
            </section>
          </main>
          <aside>
            <section className="poly136-controls">
              <h3>CONTROLS</h3>
              <label>
                Moving root (x = {clean(movingRoot)})
                <input
                  aria-label="Higher-degree moving root"
                  type="range"
                  min="2"
                  max="6"
                  step=".25"
                  value={movingRoot}
                  onChange={(event) => changeRoot(Number(event.target.value))}
                />
                <output>{clean(movingRoot)}</output>
                <small>
                  <span>2</span>
                  <span>6</span>
                </small>
              </label>
              <label>
                Vertical shift
                <input
                  aria-label="Higher-degree vertical shift"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={shift}
                  onChange={(event) => {
                    setShift(Number(event.target.value));
                    act();
                  }}
                />
                <output>{clean(shift)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
            </section>
            <section className="poly136-reason">
              <h3>REASONING SNAPSHOTS</h3>
              <article>
                <CheckCircle2 />
                <div>
                  <b>Factor reveals roots</b>
                  <p>Set each factor to zero to find its anchor.</p>
                </div>
              </article>
              <article>
                <strong>{degree}</strong>
                <div>
                  <b>Degree limits roots</b>
                  <p>
                    A degree-{degree} polynomial has up to {degree} real roots.
                  </p>
                </div>
              </article>
              <article>
                <MoveHorizontal />
                <div>
                  <b>Turning points shape the curve</b>
                  <p>
                    {turns.length} visible turning points; at most {degree - 1}{" "}
                    are possible.
                  </p>
                </div>
              </article>
              <article>
                <span>↥↥</span>
                <div>
                  <b>End behavior</b>
                  <p>
                    {degree % 2 === 0
                      ? "Even degree with positive leading coefficient → both ends rise."
                      : "Odd degree with positive leading coefficient → opposite ends."}
                  </p>
                </div>
              </article>
            </section>
            <section className="poly136-warning">
              <TriangleAlert />
              <div>
                <b>MISSED_MULTIPLICITY</b>
                <p>
                  If a root has even multiplicity, the graph touches the x-axis
                  instead of crossing it.
                </p>
              </div>
            </section>
            <section className="poly136-practice">
              <h3>TRY IT YOURSELF</h3>
              <p>
                Consider <i>g(x) = (x − 1)²(x + 2)</i>.
              </p>
              <p>
                • Root x = 1 has even multiplicity (2) → the graph touches the
                x-axis.
              </p>
              <p>
                • Root x = −2 has odd multiplicity (1) → the graph crosses the
                x-axis.
              </p>
              <button
                onClick={() => {
                  setPractice(true);
                  setShift(0);
                  setTab("Examples");
                  act();
                }}
              >
                Open Practice <ArrowRight />
              </button>
            </section>
          </aside>
        </div>
        <footer>
          <WandSparkles />
          <div>
            <b>What’s happening?</b>
            <p>
              The graph uses the live factors and shift. Sign intervals are
              recomputed from its actual x-intercepts, while turning points are
              found from the derivative.
            </p>
          </div>
        </footer>
      </section>
      <nav className="poly136-adjacent">
        <a href="/lessons/graphs-and-functions/135-cubic-functions">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Cubic Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/137-reciprocal-functions">
          <span>
            <small>NEXT</small>Reciprocal Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="poly136-footer">
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
