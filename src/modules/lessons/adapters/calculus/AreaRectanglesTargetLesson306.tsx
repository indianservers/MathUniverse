import {
  BookOpen,
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./AreaRectanglesTargetLesson306.css";

type SampleType = "left" | "midpoint" | "right";
const fn = (x: number) => x ** 3 / 4 - x + 1;
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
function sumRectangles(a: number, b: number, n: number, type: SampleType) {
  const dx = (b - a) / n;
  let signed = 0,
    positive = 0,
    negative = 0;
  const rows = Array.from({ length: n }, (_, i) => {
    const x0 = a + i * dx,
      x1 = x0 + dx,
      sample = type === "left" ? x0 : type === "right" ? x1 : (x0 + x1) / 2,
      height = fn(sample),
      area = height * dx;
    signed += area;
    if (area >= 0) positive += area;
    else negative += area;
    return { x0, x1, sample, height, area };
  });
  return { dx, signed, positive, negative, rows };
}

export default function AreaRectanglesTargetLesson306({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(-1),
    [b, setB] = useState(6),
    [n, setN] = useState(12),
    [type, setType] = useState<SampleType>("right"),
    [showRectangles, setShowRectangles] = useState(true),
    [showCurve, setShowCurve] = useState(true),
    [showAxes, setShowAxes] = useState(true),
    [showGrid, setShowGrid] = useState(true),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState("6.555718"),
    [result, setResult] = useState<"" | "correct" | "incorrect">("correct"),
    [actions, setActions] = useState(0);
  const sums = useMemo(() => sumRectangles(a, b, n, type), [a, b, n, type]);
  const reset = () => {
    setA(-1);
    setB(6);
    setN(12);
    setType("right");
    setShowRectangles(true);
    setShowCurve(true);
    setShowAxes(true);
    setShowGrid(true);
    setTab("Interact");
    setAnswer("6.555718");
    setResult("correct");
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const updateA = (value: number) => act(() => setA(Math.min(value, b - 0.25))),
    updateB = (value: number) => act(() => setB(Math.max(value, a + 0.25))),
    check = () =>
      act(() =>
        setResult(
          Math.abs(Number(answer) - 6.555718315972224) < 1e-5
            ? "correct"
            : "incorrect",
        ),
      );
  return (
    <section
      className="area306-page"
      data-testid="calculus-mockup-0385"
      data-dedicated-lesson="306"
      data-object-model="cubic-partition-dual-endpoint-drag-left-midpoint-right-rectangles-signed-positive-negative-sums-layer-toggles-practice"
      data-a={clean(a)}
      data-b={clean(b)}
      data-n={n}
      data-type={type}
      data-dx={clean(sums.dx)}
      data-signed={clean(sums.signed)}
      data-positive={clean(sums.positive)}
      data-negative={clean(sums.negative)}
      data-rectangles={showRectangles}
      data-curve={showCurve}
      data-axes={showAxes}
      data-grid={showGrid}
      data-result={result}
      data-actions={actions}
    >
      <header className="area306-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Area by Rectangles</h1>
        <p>Develop integral intuition.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◴ 6-10 min</i>
        </div>
        <div className="actions">
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `Rectangle sum=${clean(sums.signed)}`,
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
      <nav className="area306-tabs">
        {["Interact", "Explain", "Examples", "Formulas", "Know more"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="area306-lab">
        <header>
          <small>INTERACT → VISUALIZE</small>
          <h2>Work directly on the model</h2>
          <b>{actions ? "Model updated" : "Awaiting interaction"}</b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <main>
          <section className="graph-panel">
            <header>
              <h3>Area by Rectangles - graph + CAS</h3>
              <output>∫f dx = x⁴/16-x²/2+x+C</output>
            </header>
            <RectangleGraph
              a={a}
              b={b}
              rows={sums.rows}
              type={type}
              layers={{
                rectangles: showRectangles,
                curve: showCurve,
                axes: showAxes,
                grid: showGrid,
              }}
              onA={updateA}
              onB={updateB}
            />
            <div className="legend">
              <span>□ Left rectangles</span>
              <span>□ Midpoint rectangles</span>
              <span>□ Right rectangles</span>
            </div>
            <div className="feedback">
              <CheckCircle2 /> Great! You have a valid partition. Adjust the
              controls to see how the approximation changes.
            </div>
            <section className="totals">
              <span>
                Signed area<b>{sums.signed.toFixed(3)}</b>
                <small>units²</small>
              </span>
              <span>
                Positive area<b>{sums.positive.toFixed(3)}</b>
                <small>units²</small>
              </span>
              <span>
                Negative area<b>{sums.negative.toFixed(3)}</b>
                <small>units²</small>
              </span>
            </section>
            <p>
              Rectangles approximate signed area; thinner widths improve the
              estimate.
            </p>
          </section>
          <aside className="controls">
            <h3>CONTROLS</h3>
            <label>
              Function<output>f(x)=¼x³-x+1</output>
            </label>
            <label>
              Interval [a,b]
              <div className="dual">
                <input
                  aria-label="Rectangle interval a"
                  type="range"
                  min="-6"
                  max="6"
                  step=".25"
                  value={a}
                  onChange={(e) => updateA(Number(e.target.value))}
                />
                <input
                  aria-label="Rectangle interval b"
                  type="range"
                  min="-6"
                  max="6"
                  step=".25"
                  value={b}
                  onChange={(e) => updateB(Number(e.target.value))}
                />
              </div>
              <small>
                {a} ≤ x ≤ {b}
              </small>
            </label>
            <label>
              Number of rectangles (n)
              <input
                aria-label="Rectangle count"
                type="range"
                min="2"
                max="120"
                step="1"
                value={n}
                onChange={(e) => act(() => setN(Number(e.target.value)))}
              />
              <output>{n}</output>
              <button
                onClick={() => act(() => setN((v) => Math.max(2, v - 1)))}
              >
                −
              </button>
              <button
                onClick={() => act(() => setN((v) => Math.min(120, v + 1)))}
              >
                +
              </button>
            </label>
            <h3>Rectangle type</h3>
            <div className="types">
              {(["left", "midpoint", "right"] as const).map((value) => (
                <button
                  key={value}
                  className={type === value ? "active" : ""}
                  onClick={() => act(() => setType(value))}
                >
                  {value}
                </button>
              ))}
            </div>
            <h3>Show</h3>
            <div className="layers">
              {(
                [
                  ["Rectangles", showRectangles, setShowRectangles],
                  ["Curve", showCurve, setShowCurve],
                  ["Axes", showAxes, setShowAxes],
                  ["Grid", showGrid, setShowGrid],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => act(() => setter((v) => !v))}
                  />
                  {label}
                </label>
              ))}
            </div>
            <section>
              <h3>Approximation (Signed)</h3>
              <strong>
                S{n}={sums.signed.toFixed(6)}
              </strong>
              <p>
                Step size (Δx)<b>{sums.dx.toFixed(6)}</b>
              </p>
              <p>
                Positive area<b>{sums.positive.toFixed(6)}</b>
              </p>
              <p>
                Negative area<b>{sums.negative.toFixed(6)}</b>
              </p>
              <p>
                Net signed area<b>{sums.signed.toFixed(6)}</b>
              </p>
            </section>
          </aside>
        </main>
        <footer>
          <button>Primary: Control</button>
          <button>Function</button>
          <button>Calculus object</button>
        </footer>
      </section>
      <section className="area306-flow">
        {[
          {
            Icon: Eye,
            title: "Observe",
            text: "The curve may lie below and above the x-axis. Rectangles estimate signed area.",
          },
          {
            Icon: Hand,
            title: "Manipulate",
            text: "Change a, b, n and rectangle type. As n increases, the approximation converges.",
          },
          {
            Icon: Lightbulb,
            title: "Notice",
            text: "Left, midpoint and right rectangles give different approximations.",
          },
          {
            Icon: BookOpen,
            title: "Understand",
            text: "The limit of the signed sum of rectangle areas is the definite integral.",
          },
        ].map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
            <MiniRectangles variant={title} />
          </article>
        ))}
      </section>
      <section className="area306-info">
        <article>
          <h3>Rule (Riemann Sum)</h3>
          <p>For f on [a,b] with partition and Δx=(b-a)/n:</p>
          <strong>Sₙ=Σf(xᵢ*)Δx</strong>
          <p>∫f(x)dx=lim Sₙ if the limit exists.</p>
        </article>
        <article>
          <h3>✓ Worked Example</h3>
          <p>For f(x)=¼x³-x+1 on [-1,6] with n=12 right rectangles:</p>
          <p>Δx=7/12</p>
          <p>S₁₂=Σf(xᵢ)Δx</p>
          <output>
            S₁₂={sumRectangles(-1, 6, 12, "right").signed.toFixed(6)} units²
          </output>
        </article>
        <article>
          <h3>⚠ Common Misconception</h3>
          <p>Mistake: “Area by rectangles always adds positive areas.”</p>
          <p>
            If the curve is below the x-axis, rectangles are negative. Signed
            area subtracts them automatically.
          </p>
          <MiniRectangles variant="warning" />
        </article>
        <article>
          <h3>Try it! (Practice)</h3>
          <p>Use midpoint rectangles with n=24 on [-2,3] for f(x)=¼x³-x+1.</p>
          <label>
            Your signed area (approx):
            <input
              aria-label="Rectangle practice answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button onClick={check}>Check Answer</button>
          <output className={result}>
            {result === "correct"
              ? "✓ Correct! Great job."
              : result === "incorrect"
                ? "Recalculate the midpoint samples."
                : "Enter your approximation."}
          </output>
        </article>
      </section>
    </section>
  );
}

function RectangleGraph({
  a,
  b,
  rows,
  type,
  layers,
  onA,
  onB,
}: {
  a: number;
  b: number;
  rows: ReturnType<typeof sumRectangles>["rows"];
  type: SampleType;
  layers: { rectangles: boolean; curve: boolean; axes: boolean; grid: boolean };
  onA: (x: number) => void;
  onB: (x: number) => void;
}) {
  const w = 550,
    h = 360,
    sx = (x: number) => 100 + (x + 2) * 55,
    sy = (y: number) => 265 - Math.tanh(y / 8) * 170,
    path = Array.from({ length: 181 }, (_, i) => {
      const x = -2 + i * 0.05;
      return `${i ? "L" : "M"}${sx(x)} ${sy(fn(x))}`;
    }).join(" "),
    drag = (which: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r)
        (which === "a" ? onA : onB)(
          (((e.clientX - r.left) / r.width) * w - 100) / 55 - 2,
        );
    };
  return (
    <svg className="area306-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="area-grid"
          width="55"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path d="M55 0H0V44" fill="none" stroke="#e7ecf2" />
        </pattern>
      </defs>
      {layers.grid && <rect width={w} height={h} fill="url(#area-grid)" />}
      {layers.rectangles &&
        rows.map((row, i) => (
          <rect
            key={i}
            x={sx(row.x0)}
            y={Math.min(sy(0), sy(row.height))}
            width={Math.max(1, sx(row.x1) - sx(row.x0))}
            height={Math.abs(sy(row.height) - sy(0))}
            className={`${type} ${row.height < 0 ? "negative" : ""}`}
          />
        ))}
      {layers.axes && (
        <>
          <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
          <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
        </>
      )}
      {layers.curve && <path className="curve" d={path} />}
      <circle
        data-drag="rectangle-a"
        cx={sx(a)}
        cy={sy(0)}
        r="6"
        onPointerDown={drag("a")}
        onPointerMove={drag("a")}
      />
      <circle
        data-drag="rectangle-b"
        cx={sx(b)}
        cy={sy(0)}
        r="6"
        onPointerDown={drag("b")}
        onPointerMove={drag("b")}
      />
      <text x={sx(a) - 25} y={sy(0) + 42}>
        a={a}
      </text>
      <text x={sx(b) - 15} y={sy(0) + 42}>
        b={b}
      </text>
    </svg>
  );
}
function MiniRectangles({ variant }: { variant: string }) {
  return (
    <svg viewBox="0 0 160 65">
      <line x1="5" x2="155" y1="52" y2="52" stroke="#102047" />
      <path d="M8 58Q55 20 100 42T155 5" fill="none" stroke="#176ee3" />
      <rect x="18" y="45" width="16" height="7" fill="#f6a0b3" />
      <rect x="34" y="37" width="16" height="15" fill="#f6a0b3" />
      <rect x="100" y="32" width="16" height="20" fill="#8ac2ff" />
      <rect x="116" y="21" width="16" height="31" fill="#8ac2ff" />
      <text x="10" y="12">
        {variant}
      </text>
    </svg>
  );
}
