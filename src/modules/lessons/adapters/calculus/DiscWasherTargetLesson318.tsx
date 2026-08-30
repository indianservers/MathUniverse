import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DiscWasherTargetLesson318.css";

type AxisName = "x-axis" | "y=1";
type Layers = {
  outer: boolean;
  inner: boolean;
  washer: boolean;
  bounds: boolean;
};
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number, precision = 8) =>
  Number(value.toFixed(precision));
const curve = (x: number) => 3 * Math.sqrt(Math.max(0, x));
function radii(x: number, axis: AxisName) {
  const top = curve(x);
  if (axis === "x-axis") return { outer: top, inner: 0 };
  if (top < 1) return { outer: 1, inner: 1 - top };
  if (top <= 2) return { outer: 1, inner: 0 };
  return { outer: top - 1, inner: 0 };
}
const washerArea = (x: number, axis: AxisName) => {
  const { outer, inner } = radii(x, axis);
  return Math.PI * (outer * outer - inner * inner);
};
function integrate(to: number, axis: AxisName) {
  if (to <= 0) return 0;
  if (axis === "x-axis") return 4.5 * Math.PI * to * to;
  const n = 600,
    step = to / n;
  let sum = washerArea(0, axis) + washerArea(to, axis);
  for (let i = 1; i < n; i += 1)
    sum += (i % 2 ? 4 : 2) * washerArea(i * step, axis);
  return (sum * step) / 3;
}
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/π/g, "pi")
    .replace(/\*/g, "");

export default function DiscWasherTargetLesson318({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(4),
    [dx, setDx] = useState(0.1),
    [axis, setAxis] = useState<AxisName>("x-axis"),
    [layers, setLayers] = useState<Layers>({
      outer: true,
      inner: true,
      washer: true,
      bounds: true,
    }),
    [tab, setTab] = useState("Interaction + Visualization"),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const radiusModel = radii(x, axis),
    area = washerArea(x, axis),
    differential = area * dx,
    accumulated = useMemo(() => integrate(x, axis), [x, axis]),
    total = useMemo(() => integrate(9, axis), [axis]),
    progress = (x / 9) * 100;
  const reset = () => {
    setX(4);
    setDx(0.1);
    setAxis("x-axis");
    setLayers({ outer: true, inner: true, washer: true, bounds: true });
    setTab("Interaction + Visualization");
    setAnswer("");
    setResult("");
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const check = () =>
    act(() => {
      const normalized = normalize(answer),
        numeric = Number(answer);
      setResult(
        normalized === "512pi/15" ||
          normalized === "512/15pi" ||
          (Number.isFinite(numeric) &&
            Math.abs(numeric - (512 * Math.PI) / 15) < 0.001)
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="dw318-page"
      data-testid="calculus-mockup-0397"
      data-dedicated-lesson="318"
      data-object-model="washer-region-axis-piecewise-radii-slice-thickness-layer-controls-draggable-bound-accumulated-volume-symbolic-practice"
      data-x={clean(x)}
      data-dx={clean(dx)}
      data-axis={axis}
      data-outer={clean(radiusModel.outer)}
      data-inner={clean(radiusModel.inner)}
      data-area={clean(area)}
      data-dv={clean(differential)}
      data-accumulated={clean(accumulated)}
      data-total={clean(total)}
      data-progress={clean(progress)}
      data-outer-visible={layers.outer}
      data-inner-visible={layers.inner}
      data-washer-visible={layers.washer}
      data-bounds-visible={layers.bounds}
      data-tab={tab}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="dw318-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Disc and Washer Methods</h1>
        <p>Generate solids of revolution.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              reset();
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <section className="dw318-flow">
        {[
          [Eye, "Observe", "See a region and its axis of rotation."],
          [Hand, "Manipulate", "Move the slice and adjust controls."],
          [Lightbulb, "Notice", "Radii create a washer; volume accumulates."],
          [Target, "Understand", "Apply the washer formula to compute volume."],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
            {index < 3 && <b>→</b>}
          </article>
        ))}
      </section>
      <nav className="dw318-tabs">
        {[
          "Interaction + Visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Misconceptions",
          "Practice",
        ].map((name) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="dw318-lab">
        <header>
          <b>
            REVOLUTION ABOUT THE {axis === "x-axis" ? "x-AXIS" : "LINE y=1"}
          </b>
        </header>
        <main>
          <section className="dw318-region">
            <h2>
              <i>1</i> Revolved Region & Slice
            </h2>
            <p>
              Region between <b>y=3√x</b> and <b>y=0</b> on [0,9]
            </p>
            <RegionGraph
              x={x}
              dx={dx}
              axis={axis}
              layers={layers}
              onX={(value) => act(() => setX(value))}
            />
            <footer>
              <span>Domain:</span>
              <b>a=0</b>
              <strong>x={x.toFixed(2)}</strong>
              <b>b=9</b>
            </footer>
          </section>
          <section className="dw318-washer">
            <h2>
              <i>2</i> Washer <small>(Cross-section)</small>
            </h2>
            <WasherDiagram
              outer={radiusModel.outer}
              inner={radiusModel.inner}
              dx={dx}
              layers={layers}
            />
            <div>
              <article>
                <b>Outer radius</b>
                <strong>R(x)={axis === "x-axis" ? "3√x" : "piecewise"}</strong>
                <output>= {radiusModel.outer.toFixed(3)}</output>
              </article>
              <article>
                <b>Inner radius</b>
                <strong>r(x)={axis === "x-axis" ? "0" : "piecewise"}</strong>
                <output>= {radiusModel.inner.toFixed(3)}</output>
              </article>
            </div>
          </section>
          <aside>
            <h3>CONTROLS</h3>
            <label>
              Axis of rotation
              <select
                aria-label="Washer axis of rotation"
                value={axis}
                onChange={(event) =>
                  act(() => setAxis(event.target.value as AxisName))
                }
              >
                <option value="x-axis">x-axis</option>
                <option value="y=1">line y=1</option>
              </select>
            </label>
            <label>
              Slice position x
              <input
                aria-label="Washer slice position"
                type="range"
                min="0"
                max="9"
                step=".05"
                value={x}
                onChange={(event) =>
                  act(() => setX(Number(event.target.value)))
                }
              />
              <output>{x.toFixed(2)}</output>
            </label>
            <label>
              Slice thickness Δx
              <input
                aria-label="Washer slice thickness"
                type="range"
                min=".01"
                max="1"
                step=".01"
                value={dx}
                onChange={(event) =>
                  act(() => setDx(Number(event.target.value)))
                }
              />
              <output>{dx.toFixed(2)}</output>
            </label>
            <fieldset>
              <legend>Show</legend>
              {(["outer", "inner", "washer", "bounds"] as const).map((name) => (
                <label key={name}>
                  <input
                    aria-label={`Show washer ${name}`}
                    type="checkbox"
                    checked={layers[name]}
                    onChange={() =>
                      act(() =>
                        setLayers((current) => ({
                          ...current,
                          [name]: !current[name],
                        })),
                      )
                    }
                  />
                  {name === "outer"
                    ? "R(x)"
                    : name === "inner"
                      ? "r(x)"
                      : name[0].toUpperCase() + name.slice(1)}
                </label>
              ))}
            </fieldset>
          </aside>
        </main>
        <section className="dw318-accum">
          <h2>
            <i>3</i> Volume Accumulation{" "}
            <small>
              As the slice sweeps from a to b, washers build the solid.
            </small>
          </h2>
          <div>
            <article>
              <b>Accumulated volume</b>
              <strong>{accumulated.toFixed(3)} units³</strong>
              <small>{progress.toFixed(0)}%</small>
              <input
                aria-label="Accumulated washer position"
                type="range"
                min="0"
                max="9"
                step=".05"
                value={x}
                onChange={(event) =>
                  act(() => setX(Number(event.target.value)))
                }
              />
              <footer>
                <span>
                  Start
                  <br />
                  x=0
                </span>
                <b>
                  Current
                  <br />
                  x={x.toFixed(2)}
                </b>
                <span>
                  End
                  <br />
                  x=9
                </span>
              </footer>
            </article>
            <article>
              <b>Washer area at current x</b>
              <p>A(x)=π[R(x)²−r(x)²]</p>
              <p>
                =π[{radiusModel.outer.toFixed(3)}²−
                {radiusModel.inner.toFixed(3)}²]
              </p>
              <strong>
                A({x.toFixed(2)})={area.toFixed(3)}
              </strong>
            </article>
            <article>
              <b>Differential volume</b>
              <p>dV=A(x)dx</p>
              <strong>{differential.toFixed(3)} units³</strong>
              <p>Volume to x = ∫₀ˣA(t)dt</p>
              <output>= {accumulated.toFixed(3)}</output>
            </article>
            <article className="good">
              <CheckCircle2 />
              <b>Good!</b>
              <p>Your settings are valid.</p>
              <p>R(x)≥r(x) and thickness &gt;0.</p>
            </article>
          </div>
        </section>
      </section>
      <section className="dw318-cards">
        <article>
          <h3>FORMULA (WASHER METHOD ABOUT x-AXIS)</h3>
          <strong>
            V=∫<sub>a</sub>
            <sup>b</sup>π[R(x)²−r(x)²]dx
          </strong>
          <p>R(x) = distance from axis to outer curve</p>
          <p>r(x) = distance from axis to inner curve</p>
          <p>[a,b] = interval of the region</p>
        </article>
        <article>
          <h3>ONE WORKED EXAMPLE</h3>
          <p>
            Rotate the region between y=3√x and y=0 about the x-axis on [0,9].
          </p>
          <b>R(x)=3√x, r(x)=0</b>
          <p>V=∫₀⁹π[(3√x)²−0²]dx</p>
          <p>=∫₀⁹9πx dx = 729π/2</p>
          <strong>≈ {totalVolumeDefault().toFixed(3)} units³</strong>
        </article>
        <article className="mistake">
          <h3>⚠ COMMON MISCONCEPTION</h3>
          <b>Do not square the functions first!</b>
          <p className="wrong">Wrong: V=π∫[R(x)−r(x)]²dx</p>
          <p>This computes a disc of radius (R−r), not a washer.</p>
          <p className="right">Correct: V=π∫[R(x)²−r(x)²]dx</p>
        </article>
      </section>
      <section className="dw318-practice">
        <div>
          <h3>PRACTICE CHALLENGE</h3>
          <p>
            Find the volume formed by revolving y=4−x² and y=0 about the x-axis
            on [−2,2].
          </p>
          <small>Tip: R(x)=4−x², r(x)=0, a=−2, b=2</small>
        </div>
        <label>
          Your answer
          <input
            aria-label="Washer practice answer"
            value={answer}
            placeholder="Enter your answer (e.g. 512π/15)"
            onChange={(event) => {
              setAnswer(event.target.value);
              setResult("");
            }}
          />
        </label>
        <button type="button" onClick={check}>
          Check
        </button>
        <button
          type="button"
          onClick={() => act(() => setHint((value) => !value))}
        >
          ♧ Hint
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct: 512π/15 cubic units."
            : result === "incorrect"
              ? "Square 4−x² before integrating."
              : hint
                ? "Expand (4−x²)² and integrate symmetrically."
                : ""}
        </output>
      </section>
      <nav className="dw318-adjacent">
        <a href="/lessons/calculus/317-volume-by-slicing">
          ←{" "}
          <span>
            <small>Previous</small>Volume by Slicing
          </span>
        </a>
        <a href="/lessons/calculus/319-shell-method">
          <span>
            <small>Next</small>Shell Method
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
const totalVolumeDefault = () => 364.5 * Math.PI;

function RegionGraph({
  x,
  dx,
  axis,
  layers,
  onX,
}: {
  x: number;
  dx: number;
  axis: AxisName;
  layers: Layers;
  onX: (x: number) => void;
}) {
  const w = 330,
    h = 330,
    p = 30,
    sx = (value: number) => p + (value / 9) * (w - 2 * p),
    sy = (value: number) => h - p - (value / 9) * (h - 2 * p),
    path = Array.from({ length: 181 }, (_, index) => {
      const value = index / 20;
      return `${index ? "L" : "M"}${sx(value)},${sy(curve(value))}`;
    }).join(" "),
    area = `M${sx(0)},${sy(0)} ${Array.from({ length: 181 }, (_, index) => {
      const value = index / 20;
      return `L${sx(value)},${sy(curve(value))}`;
    }).join(" ")} L${sx(9)},${sy(0)}Z`,
    drag = (event: ReactPointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const move = (pointer: PointerEvent) =>
        onX(clamp(((pointer.clientX - box.left) / box.width) * 9, 0, 9));
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  return (
    <svg className="dw318-region-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="dw318-grid"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path d="M30 0H0V30" fill="none" stroke="#e8edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#dw318-grid)" />
      {layers.washer && <path d={area} className="region" />}
      <line x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} className="axis" />
      {axis === "y=1" && (
        <line x1={p} x2={w - p} y1={sy(1)} y2={sy(1)} className="rotation" />
      )}
      {layers.outer && <path d={path} className="curve" />}
      {layers.bounds && (
        <>
          <line
            x1={sx(0)}
            x2={sx(0)}
            y1={sy(0)}
            y2={sy(curve(0))}
            className="bound"
          />
          <line
            x1={sx(9)}
            x2={sx(9)}
            y1={sy(0)}
            y2={sy(curve(9))}
            className="bound"
          />
        </>
      )}
      <rect
        x={sx(x - dx / 2)}
        y={sy(curve(x))}
        width={Math.max(3, sx(x + dx / 2) - sx(x - dx / 2))}
        height={sy(0) - sy(curve(x))}
        className="slice"
      />
      <circle
        data-drag="washer-slice"
        cx={sx(x)}
        cy={sy(0)}
        r="6"
        onPointerDown={drag}
      />
      <text x={w - 82} y={60}>
        y=3√x
      </text>
    </svg>
  );
}
function WasherDiagram({
  outer,
  inner,
  dx,
  layers,
}: {
  outer: number;
  inner: number;
  dx: number;
  layers: Layers;
}) {
  const scale = 17,
    ry = Math.max(16, outer * scale),
    innerRy = Math.max(3, inner * scale),
    thickness = 8 + dx * 18;
  return (
    <svg className="dw318-washer-svg" viewBox="0 0 260 285">
      <line x1="130" x2="130" y1="18" y2="267" className="axis" />
      <line x1="25" x2="240" y1="145" y2="145" className="axis" />
      {layers.washer && (
        <path
          d={`M${60},${145 - ry}C25,${145 - ry} 25,${145 + ry} 60,${145 + ry}L${190},${145 + ry}C225,${145 + ry} 225,${145 - ry} 190,${145 - ry}Z`}
          className="solid"
        />
      )}
      {layers.outer && (
        <ellipse
          cx="130"
          cy="145"
          rx={70 + thickness}
          ry={ry}
          className="outer"
        />
      )}
      {layers.inner && (
        <ellipse
          cx="130"
          cy="145"
          rx={Math.max(14, 30 + inner * 8)}
          ry={innerRy}
          className="inner"
        />
      )}
      {layers.washer && (
        <rect
          x={205}
          y={145 - ry}
          width={thickness}
          height={2 * ry}
          className="slice"
        />
      )}
      <line
        x1="130"
        y1="145"
        x2="225"
        y2={145 - ry / 2}
        className="radius outer-line"
      />
      <line x1="130" y1="145" x2="200" y2="145" className="radius inner-line" />
      <text x="224" y={138 - ry / 2}>
        R(x)
      </text>
      <text x="187" y="137">
        r(x)
      </text>
    </svg>
  );
}
