import { AlertTriangle, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CobwebDiagramsTargetLesson332.css";

type FunctionKey = "cos" | "affine" | "logistic";
const clean = (v: number) => Number(v.toFixed(8));
const fn = (key: FunctionKey, x: number, r: number) =>
  key === "cos" ? Math.cos(x) : key === "affine" ? 2 * x - 1 : r * x * (1 - x);
const derivative = (key: FunctionKey, x: number, r: number) =>
  key === "cos" ? -Math.sin(x) : key === "affine" ? 2 : r * (1 - 2 * x);
const label = (key: FunctionKey, r: number) =>
  key === "cos"
    ? "f(x) = cos(x)"
    : key === "affine"
      ? "f(x) = 2x − 1"
      : `f(x) = ${r.toFixed(1)}x(1−x)`;
function iterate(key: FunctionKey, x0: number, r: number, count: number) {
  const values = [x0];
  for (let i = 0; i < count; i++) values.push(fn(key, values.at(-1)!, r));
  return values;
}
function roots(key: FunctionKey, r: number) {
  const found: number[] = [];
  let px = -2,
    py = fn(key, px, r) - px;
  for (let i = 1; i <= 800; i++) {
    const x = -2 + i / 200,
      y = fn(key, x, r) - x;
    if (y === 0 || y * py < 0) {
      let a = px,
        b = x;
      for (let j = 0; j < 50; j++) {
        const m = (a + b) / 2;
        if ((fn(key, a, r) - a) * (fn(key, m, r) - m) <= 0) b = m;
        else a = m;
      }
      const root = (a + b) / 2;
      if (!found.some((v) => Math.abs(v - root) < 1e-4)) found.push(root);
    }
    px = x;
    py = y;
  }
  return found;
}

export default function CobwebDiagramsTargetLesson332({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [functionKey, setFunctionKey] = useState<FunctionKey>("cos"),
    [x0, setX0] = useState(0.5),
    [r, setR] = useState(3.2),
    [iterations, setIterations] = useState(6),
    [step, setStep] = useState(6),
    [playing, setPlaying] = useState(false),
    [showPath, setShowPath] = useState(true),
    [showFixed, setShowFixed] = useState(true),
    [showLabels, setShowLabels] = useState(true),
    [animate, setAnimate] = useState(false),
    [speed, setSpeed] = useState(50),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState(false),
    [actions, setActions] = useState(0);
  const timer = useRef<number>();
  const values = useMemo(
      () => iterate(functionKey, x0, r, iterations),
      [functionKey, x0, r, iterations],
    ),
    fixed = useMemo(() => roots(functionKey, r), [functionKey, r]),
    nearest = fixed.length
      ? fixed.reduce((a, b) =>
          Math.abs(b - values.at(-1)!) < Math.abs(a - values.at(-1)!) ? b : a,
        )
      : NaN,
    stable =
      Number.isFinite(nearest) &&
      Math.abs(derivative(functionKey, nearest, r)) < 1,
    status =
      (functionKey === "affine" && x0 !== 1) ||
      !Number.isFinite(values.at(-1)!) ||
      Math.abs(values.at(-1)!) > 100
        ? "Divergent"
        : stable && Math.abs(values.at(-1)! - nearest) < 0.05
          ? "Convergent (Stable)"
          : "Iterating";
  const reset = () => {
    setFunctionKey("cos");
    setX0(0.5);
    setR(3.2);
    setIterations(6);
    setStep(6);
    setPlaying(false);
    setShowPath(true);
    setShowFixed(true);
    setShowLabels(true);
    setAnimate(false);
    setSpeed(50);
    setTab("Interact");
    setChallenge(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(
      () => setStep((v) => (v >= iterations ? 0 : v + 1)),
      Math.max(80, 550 - speed * 8),
    );
    return () => window.clearInterval(timer.current);
  }, [playing, iterations, speed]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const choose = (key: FunctionKey) =>
      act(() => {
        setFunctionKey(key);
        setStep(iterations);
      }),
    drag = (e: ReactPointerEvent<SVGSVGElement>) => {
      if (e.buttons !== 1) return;
      const b = e.currentTarget.getBoundingClientRect();
      act(() => {
        setX0(clean(-2 + ((e.clientX - b.left) / b.width) * 4));
        setStep(iterations);
      });
    };
  return (
    <section
      className="cob332-page"
      data-testid="calculus-mockup-0411"
      data-object-model="function-aware-fixed-point-root-solver-derivative-stability-generated-cobweb-draggable-seed-step-animation-display-layers-affine-challenge"
      data-function={functionKey}
      data-x0={clean(x0)}
      data-r={clean(r)}
      data-iterations={iterations}
      data-step={step}
      data-last={clean(values.at(-1)!)}
      data-fixed={fixed.map(clean).join(",")}
      data-nearest={clean(nearest)}
      data-stable={stable}
      data-status={status}
      data-playing={playing}
      data-path={showPath}
      data-points={showFixed}
      data-labels={showLabels}
      data-animate={animate}
      data-speed={speed}
      data-tab={tab}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="cob332-hero">
        <b>CALCULUS</b>
        <h1>Cobweb Diagrams</h1>
        <p>
          Objective: Visualise how iterates xₙ₊₁=f(xₙ) evolve using the cobweb
          diagram to study fixed points and stability.
        </p>
        <article>
          <b>Cobweb rule:</b> Start at x₀ on the x-axis. Go vertically to
          y=f(x), then horizontally to y=x, and repeat.
          <br />
          The sequence xₙ₊₁=f(xₙ) follows the path.
        </article>
        <aside>
          <h2>Fixed points</h2>
          <p>Fixed points satisfy f(x*)=x*, intersections of y=f(x) and y=x.</p>
          <p>
            <i /> Stable: |f′(x*)| &lt; 1
          </p>
          <p>
            <i /> Unstable: |f′(x*)| &gt; 1
          </p>
        </aside>
      </header>
      <nav className="cob332-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cob332-explorer">
        <header>
          <h2>Interactive cobweb explorer</h2>
          <div>
            <span>
              <i />
              y=f(x)
            </span>
            <span>
              <i />
              y=x
            </span>
            <span>
              <i />
              Cobweb path
            </span>
            <span>
              <i />
              Fixed point
            </span>
          </div>
          <label>
            Function{" "}
            <select
              aria-label="Cobweb function"
              value={functionKey}
              onChange={(e) => choose(e.target.value as FunctionKey)}
            >
              <option value="cos">f(x) = cos(x)</option>
              <option value="affine">f(x) = 2x − 1</option>
              <option value="logistic">f(x) = r x(1−x)</option>
            </select>
          </label>
        </header>
        <div className="cob332-grid">
          <main>
            <CobwebGraph
              functionKey={functionKey}
              r={r}
              values={values.slice(0, step + 1)}
              x0={x0}
              fixed={fixed}
              showPath={showPath}
              showFixed={showFixed}
              showLabels={showLabels}
              drag={drag}
            />
            <section className="controls">
              <button
                aria-label="Play cobweb animation"
                onClick={() => act(() => setPlaying(!playing))}
              >
                <Play /> {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() =>
                  act(() => setStep(Math.min(iterations, step + 1)))
                }
              >
                <SkipForward />
                Step
              </button>
              <button onClick={() => act(reset)}>
                <RotateCcw />
                Reset
              </button>
              <b>Iterates: {step}</b>
              <input
                aria-label="Cobweb iteration depth"
                type="range"
                min="0"
                max={iterations}
                value={step}
                onChange={(e) => act(() => setStep(Number(e.target.value)))}
              />
            </section>
            <StateTable values={values} limit={nearest} />
          </main>
          <aside>
            <section>
              <h3>Initial value x₀</h3>
              <p>Drag or use slider</p>
              <Control
                aria="Cobweb initial value"
                value={x0}
                min={-2}
                max={2}
                step={0.05}
                set={(v) =>
                  act(() => {
                    setX0(v);
                    setStep(iterations);
                  })
                }
              />
            </section>
            <section>
              <h3>Parameters</h3>
              {functionKey === "logistic" ? (
                <Control
                  aria="Cobweb logistic parameter"
                  value={r}
                  min={0}
                  max={4}
                  step={0.1}
                  set={(v) => act(() => setR(v))}
                />
              ) : (
                <p>(none for {label(functionKey, r)})</p>
              )}
            </section>
            <section>
              <h3>Display options</h3>
              <CheckBox
                label="Show cobweb path"
                checked={showPath}
                set={() => act(() => setShowPath(!showPath))}
              />
              <CheckBox
                label="Show fixed points"
                checked={showFixed}
                set={() => act(() => setShowFixed(!showFixed))}
              />
              <CheckBox
                label="Show axes labels"
                checked={showLabels}
                set={() => act(() => setShowLabels(!showLabels))}
              />
              <CheckBox
                label="Animate iterates"
                checked={animate}
                set={() => act(() => setAnimate(!animate))}
              />
              <Control
                aria="Cobweb animation speed"
                value={speed}
                min={0}
                max={100}
                step={1}
                set={(v) => act(() => setSpeed(v))}
              />
            </section>
            <section className="status">
              <h3>Status</h3>
              <b>{status}</b>
              <p>
                {status.startsWith("Convergent")
                  ? "Converges to fixed point"
                  : "Continue iterating or change x₀."}
              </p>
              {Number.isFinite(nearest) && (
                <>
                  <p>x* ≈ {nearest.toFixed(6)}</p>
                  <p>
                    |f′(x*)| ≈{" "}
                    {Math.abs(derivative(functionKey, nearest, r)).toFixed(4)}
                  </p>
                </>
              )}
            </section>
            <section>
              <h3>About this function</h3>
              <p>
                {label(functionKey, r)} has {fixed.length} fixed point
                {fixed.length === 1 ? "" : "s"}.
              </p>
              {fixed.map((v) => (
                <p key={v}>
                  • x*≈{v.toFixed(6)} (
                  {Math.abs(derivative(functionKey, v, r)) < 1
                    ? "stable"
                    : "unstable"}
                  )
                </p>
              ))}
            </section>
            <section className="guard">
              <h3>
                <AlertTriangle /> Misconception guard
              </h3>
              <p>
                Not every function converges. If |f′(x*)|&gt;1, nearby iterates
                move away from x*.
              </p>
            </section>
          </aside>
        </div>
      </section>
      <section className="cob332-challenge">
        <div>
          <h2>Practice challenge</h2>
          <p>
            Investigate f(x)=2x−1. Choose x₀=0.2 and iterate at least 6 steps.
            Does the sequence converge?
          </p>
        </div>
        <label>
          Function
          <select
            aria-label="Cobweb challenge function"
            value="affine"
            disabled
          >
            <option>f(x) = 2x − 1</option>
          </select>
        </label>
        <label>
          x₀{" "}
          <input
            aria-label="Cobweb challenge initial value"
            type="number"
            value={challenge ? 0.2 : 0.2}
            onChange={() => {}}
          />
        </label>
        <button
          onClick={() =>
            act(() => {
              setFunctionKey("affine");
              setX0(0.2);
              setIterations(6);
              setStep(6);
              setChallenge(true);
            })
          }
        >
          Start challenge
        </button>
        <output>
          {challenge ? "Diverges; fixed point x*=1 is unstable." : ""}
        </output>
      </section>
    </section>
  );
}
function Control({
  aria,
  value,
  min,
  max,
  step,
  set,
}: {
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  set: (v: number) => void;
}) {
  return (
    <span className="cob332-control">
      <input
        aria-label={aria}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
      <output>{value.toFixed(step < 1 ? 2 : 0)}</output>
    </span>
  );
}
function CheckBox({
  label,
  checked,
  set,
}: {
  label: string;
  checked: boolean;
  set: () => void;
}) {
  return (
    <label className="cob332-check">
      <input type="checkbox" checked={checked} onChange={set} />
      {label}
    </label>
  );
}
function CobwebGraph({
  functionKey,
  r,
  values,
  x0,
  fixed,
  showPath,
  showFixed,
  showLabels,
  drag,
}: {
  functionKey: FunctionKey;
  r: number;
  values: number[];
  x0: number;
  fixed: number[];
  showPath: boolean;
  showFixed: boolean;
  showLabels: boolean;
  drag: (e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 250 + x * 105,
    sy = (y: number) => 230 - y * 105,
    d = Array.from({ length: 201 }, (_, i) => {
      const x = -2 + i * 0.02;
      return `${i ? "L" : "M"}${sx(x)},${sy(fn(functionKey, x, r))}`;
    }).join(" ");
  let cob = `M${sx(x0)},${sy(0)}`;
  for (let i = 0; i < values.length - 1; i++)
    cob += ` L${sx(values[i])},${sy(values[i + 1])} L${sx(values[i + 1])},${sy(values[i + 1])}`;
  return (
    <svg
      className="cob332-graph"
      viewBox="0 0 500 470"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <rect width="500" height="470" />
      <g className="grid">
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <line x1={40 + i * 52.5} x2={40 + i * 52.5} y1="20" y2="450" />
            <line x1="40" x2="460" y1={20 + i * 52.5} y2={20 + i * 52.5} />
          </g>
        ))}
      </g>
      <line className="axis" x1="30" x2="470" y1="230" y2="230" />
      <line className="axis" x1="250" x2="250" y1="15" y2="455" />
      <path className="curve" d={d} />
      <line
        className="diagonal"
        x1={sx(-2)}
        y1={sy(-2)}
        x2={sx(2)}
        y2={sy(2)}
      />
      {showPath && <path className="cob" d={cob} />}{" "}
      {showFixed &&
        fixed.map((v) => (
          <circle className="fixed" key={v} cx={sx(v)} cy={sy(v)} r="5" />
        ))}
      <circle
        className="seed"
        data-drag="cobweb-seed"
        cx={sx(x0)}
        cy={sy(0)}
        r="6"
      />
      {showLabels && (
        <>
          <text x="270" y="40">
            y
          </text>
          <text x="465" y="220">
            x
          </text>
          <text x={sx(x0) - 8} y="250">
            x₀
          </text>
        </>
      )}
    </svg>
  );
}
function StateTable({ values, limit }: { values: number[]; limit: number }) {
  return (
    <table className="cob332-table">
      <thead>
        <tr>
          <th>n</th>
          <th>xₙ</th>
          <th>yₙ=f(xₙ)</th>
          <th>Step</th>
        </tr>
      </thead>
      <tbody>
        {values.slice(0, 7).map((v, i) => (
          <tr key={i}>
            <td>{i}</td>
            <td>{v.toFixed(6)}</td>
            <td>{i < values.length - 1 ? values[i + 1].toFixed(6) : "—"}</td>
            <td>{i ? "Up, then across" : "Start at x₀"}</td>
          </tr>
        ))}
        <tr>
          <td>Limit</td>
          <td>{Number.isFinite(limit) ? limit.toFixed(6) : "—"}</td>
          <td>{Number.isFinite(limit) ? limit.toFixed(6) : "—"}</td>
          <td>Fixed point</td>
        </tr>
      </tbody>
    </table>
  );
}
