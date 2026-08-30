import { AlertTriangle, CheckCircle2, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ChaosBifurcationTargetLesson333.css";

const clean = (v: number) => Number(v.toFixed(8)),
  next = (x: number, r: number) => r * x * (1 - x);
function orbit(r: number, x0: number, count = 100, transient = 0) {
  let x = x0;
  for (let i = 0; i < transient; i++) x = next(x, r);
  return Array.from({ length: count }, () => {
    x = next(x, r);
    return x;
  });
}
function periodOf(values: number[], tolerance = 1e-5) {
  for (let p = 1; p <= 16; p++) {
    let ok = true;
    for (let i = values.length - 1; i >= values.length - 20 && i - p >= 0; i--)
      if (Math.abs(values[i] - values[i - p]) > tolerance) {
        ok = false;
        break;
      }
    if (ok) return p;
  }
  return 0;
}
function lyapunov(r: number, x0: number) {
  let x = x0,
    sum = 0;
  for (let i = 0; i < 1500; i++) {
    x = next(x, r);
    if (i >= 500) sum += Math.log(Math.max(1e-12, Math.abs(r * (1 - 2 * x))));
  }
  return sum / 1000;
}
function histogram(values: number[], bins = 42) {
  const counts = Array(bins).fill(0);
  for (const value of values)
    counts[Math.min(bins - 1, Math.max(0, Math.floor(value * bins)))]++;
  return counts;
}

export default function ChaosBifurcationTargetLesson333({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [r, setR] = useState(3.65),
    [x0, setX0] = useState(0.2),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState("Interact"),
    [compare, setCompare] = useState(true),
    [preset, setPreset] = useState("Period-2 vs Chaos"),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const timer = useRef<number>();
  const values = useMemo(() => orbit(r, x0, 100), [r, x0]),
    tail = useMemo(() => orbit(r, x0, 1200, 500), [r, x0]),
    period = periodOf(tail),
    lambda = lyapunov(r, x0),
    bins = histogram(tail),
    latest = values.at(-1)!,
    sensitive = Math.abs(
      orbit(r, x0, 50).at(-1)! - orbit(r, x0 + 1e-6, 50).at(-1)!,
    );
  const reset = () => {
    setR(3.65);
    setX0(0.2);
    setPlaying(false);
    setTab("Interact");
    setCompare(true);
    setPreset("Period-2 vs Chaos");
    setAnswer("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(
      () => setR((v) => clean(v >= 4 ? 2.5 : v + 0.005)),
      100,
    );
    return () => window.clearInterval(timer.current);
  }, [playing]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const drag = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.buttons !== 1) return;
    const b = e.currentTarget.getBoundingClientRect();
    act(() => setR(clean(2.5 + ((e.clientX - b.left) / b.width) * 1.5)));
  };
  const check = () =>
    act(() => {
      const candidate = Number(answer),
        p = Number.isFinite(candidate)
          ? periodOf(orbit(candidate, 0.2, 200, 1000))
          : 0;
      setResult(
        candidate >= 2.5 && candidate <= 4 && p === 3 ? "correct" : "incorrect",
      );
    });
  return (
    <section
      className="chaos333-page"
      data-testid="calculus-mockup-0412"
      data-object-model="logistic-map-bifurcation-cloud-orbit-cobweb-lyapunov-invariant-density-period-classifier-sensitive-dependence-comparison-period-three-challenge"
      data-r={clean(r)}
      data-x0={clean(x0)}
      data-latest={clean(latest)}
      data-period={period}
      data-lambda={clean(lambda)}
      data-sensitive={clean(sensitive)}
      data-playing={playing}
      data-compare={compare}
      data-preset={preset}
      data-tab={tab}
      data-result={result}
      data-actions={actions}
    >
      <header className="chaos333-hero">
        <span>
          <b>CALCULUS</b>
          <b>LESSON 333</b>
        </span>
        <h1>Chaos and Bifurcation</h1>
        <p>Explore parameter sensitivity in the logistic map.</p>
        <aside>
          <h3>OBJECTIVE</h3>
          <p>
            Understand how changing a parameter in the logistic map leads from
            fixed points to periodic cycles and chaos.
          </p>
        </aside>
      </header>
      <nav className="chaos333-tabs">
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
      <section className="chaos333-controls">
        <article>
          <h3>LOGISTIC MAP</h3>
          <p>Rule: xₙ₊₁ = rxₙ(1−xₙ)</p>
        </article>
        <Control
          label="PARAMETER r"
          aria="Chaos parameter r"
          value={r}
          min={2.5}
          max={4}
          step={0.001}
          set={(v) => act(() => setR(v))}
        />
        <Control
          label="INITIAL VALUE x₀"
          aria="Chaos initial value"
          value={x0}
          min={0}
          max={1}
          step={0.001}
          set={(v) => act(() => setX0(v))}
        />
        <article className="play">
          <h3>PLAY</h3>
          <button
            aria-label="Play chaos parameter sweep"
            onClick={() => act(() => setPlaying(!playing))}
          >
            <Play />
          </button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
          </button>
        </article>
      </section>
      <section className="chaos333-top">
        <article>
          <h2>BIFURCATION DIAGRAM</h2>
          <Bifurcation r={r} drag={drag} />
          <p>
            Each point shows long-term values of xₙ for a given r. Adjust r to
            explore order → chaos.
          </p>
        </article>
        <article>
          <h2>ORBIT (TIME SERIES)</h2>
          <OrbitPlot values={values} />
          <footer>
            <div>
              <b>LATEST VALUE</b>
              <strong>x₁₀₀ = {latest.toFixed(6)}</strong>
            </div>
            <div>
              <b>STATE</b>
              <strong>
                {period
                  ? `Period-${period}`
                  : lambda > 0
                    ? "Chaotic"
                    : "Aperiodic"}
              </strong>
            </div>
          </footer>
        </article>
      </section>
      <section className="chaos333-mini">
        <article>
          <h2>
            COBWEB DIAGRAM <small>(Current r)</small>
          </h2>
          <Cobweb r={r} x0={x0} />
        </article>
        <article>
          <h2>LYAPUNOV EXPONENT (λ)</h2>
          <Gauge value={lambda} />
          <strong>{lambda.toFixed(3)}</strong>
          <p>
            {lambda > 0
              ? "λ > 0: Sensitive dependence → Chaos"
              : "λ < 0: Nearby states converge"}
          </p>
        </article>
        <article>
          <h2>
            INVARIANT DENSITY <small>(Histogram)</small>
          </h2>
          <Histogram bins={bins} />
        </article>
      </section>
      <section className="chaos333-compare">
        <header>
          <h2>ORDER vs CHAOS COMPARISON</h2>
          <label>
            <input
              type="checkbox"
              checked={compare}
              onChange={() => act(() => setCompare(!compare))}
            />{" "}
            See how dynamics change across regimes.
          </label>
          <select
            aria-label="Chaos comparison preset"
            value={preset}
            onChange={(e) => act(() => setPreset(e.target.value))}
          >
            <option>Period-2 vs Chaos</option>
            <option>Fixed point vs Period-4</option>
          </select>
        </header>
        {compare && (
          <div>
            <Comparison
              r={preset === "Period-2 vs Chaos" ? 3.2 : 2.8}
              title="PERIODIC"
            />
            <Comparison
              r={preset === "Period-2 vs Chaos" ? 3.75 : 3.5}
              title="CHAOTIC"
            />
          </div>
        )}
      </section>
      <section className="chaos333-bottom">
        <article>
          <h2>WHAT IS BIFURCATION?</h2>
          <p>
            As parameter r increases, the logistic map undergoes qualitative
            changes in long-term behavior called bifurcations.
          </p>
          {[
            "Fixed point (stable)",
            "Period-doubling route to chaos",
            "Chaotic regime (positive λ)",
            "Band-merging windows",
          ].map((x) => (
            <p key={x}>
              <CheckCircle2 /> {x}
            </p>
          ))}
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>For r=3.700, x₀=0.2, iterate 5 steps.</p>
          {orbit(3.7, 0.2, 5).map((v, i) => (
            <p key={i}>
              x{i + 1} = {v.toFixed(6)}
            </p>
          ))}
        </article>
        <article>
          <h2>
            <AlertTriangle /> COMMON MISCONCEPTION
          </h2>
          <b>“Chaos means random.”</b>
          <p>
            Chaotic dynamics are deterministic but aperiodic and highly
            sensitive to initial conditions.
          </p>
          <div>
            x₀=0.200000 vs x₀=0.200001
            <br />
            |Δ₅₀| ≈ {sensitive.toFixed(6)}
          </div>
        </article>
        <article>
          <h2>PRACTICE CHALLENGE</h2>
          <p>Find a value of r in [2.5,4] that produces period-3 behavior.</p>
          <input
            aria-label="Chaos period three answer"
            placeholder="e.g., 3.83"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={check}>Check</button>
          <output className={result}>
            {result === "correct"
              ? "Correct: period-3 detected."
              : result === "incorrect"
                ? "No period-3 orbit detected after transients."
                : "Hint: Try around r ≈ 3.83."}
          </output>
        </article>
      </section>
    </section>
  );
}
function Control({
  label,
  aria,
  value,
  min,
  max,
  step,
  set,
}: {
  label: string;
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  set: (v: number) => void;
}) {
  return (
    <label className="chaos333-control">
      <b>{label}</b>
      <span>
        <input
          aria-label={aria}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
        />
        <output>{value.toFixed(3)}</output>
      </span>
    </label>
  );
}
function Bifurcation({
  r,
  drag,
}: {
  r: number;
  drag: (e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  let d = "";
  for (let i = 0; i <= 300; i++) {
    const rv = 2.5 + i / 200,
      vals = orbit(rv, 0.2, 45, 300);
    for (const x of vals) d += `M${20 + (rv - 2.5) * 300},${190 - x * 160}h.35`;
  }
  return (
    <svg
      className="chaos333-bifurcation"
      viewBox="0 0 490 215"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line x1="20" x2="470" y1="190" y2="190" />
      <line x1="20" x2="20" y1="20" y2="190" />
      <path d={d} />
      <line
        className="probe"
        x1={20 + (r - 2.5) * 300}
        x2={20 + (r - 2.5) * 300}
        y1="10"
        y2="195"
      />
      <circle cx={20 + (r - 2.5) * 300} cy={190 - next(0.5, r) * 160} r="5" />
      <text x={15 + (r - 2.5) * 300} y="14">
        r={r.toFixed(3)}
      </text>
    </svg>
  );
}
function OrbitPlot({ values }: { values: number[] }) {
  const d = values
    .map((v, i) => `${i ? "L" : "M"}${20 + i * 2.65},${125 - v * 105}`)
    .join(" ");
  return (
    <svg className="chaos333-orbit" viewBox="0 0 290 145">
      <line x1="18" x2="285" y1="125" y2="125" />
      <line x1="18" x2="18" y1="15" y2="125" />
      <path d={d} />
      {values
        .filter((_, i) => i % 3 === 0)
        .map((v, i) => (
          <circle key={i} cx={20 + i * 3 * 2.65} cy={125 - v * 105} r="2" />
        ))}
    </svg>
  );
}
function Cobweb({ r, x0 }: { r: number; x0: number }) {
  const sx = (x: number) => 15 + x * 170,
    sy = (y: number) => 180 - y * 155,
    d = Array.from({ length: 101 }, (_, i) => {
      const x = i / 100;
      return `${i ? "L" : "M"}${sx(x)},${sy(next(x, r))}`;
    }).join(" "),
    vals = orbit(r, x0, 8);
  let cob = `M${sx(x0)},${sy(0)}`;
  let x = x0;
  for (const y of vals) {
    cob += `L${sx(x)},${sy(y)}L${sx(y)},${sy(y)}`;
    x = y;
  }
  return (
    <svg viewBox="0 0 200 195">
      <line x1="15" x2="185" y1="180" y2="25" />
      <path className="curve" d={d} />
      <path className="cob" d={cob} />
    </svg>
  );
}
function Gauge({ value }: { value: number }) {
  const angle =
    ((-120 + Math.max(0, Math.min(1, (value + 1) / 2)) * 240) * Math.PI) / 180;
  return (
    <svg viewBox="0 0 180 95">
      <path d="M20 80 A70 70 0 0 1 160 80" />
      <line
        x1="90"
        y1="80"
        x2={90 + 58 * Math.cos(angle)}
        y2={80 + 58 * Math.sin(angle)}
      />
      <text x="82" y="15">
        0
      </text>
      <text x="12" y="92">
        −2
      </text>
      <text x="158" y="92">
        1
      </text>
    </svg>
  );
}
function Histogram({ bins }: { bins: number[] }) {
  const max = Math.max(...bins);
  return (
    <svg viewBox="0 0 260 165">
      <line x1="15" x2="250" y1="150" y2="150" />
      {bins.map((v, i) => (
        <rect
          key={i}
          x={18 + i * 5.4}
          y={150 - (v / max) * 125}
          width="4.5"
          height={(v / max) * 125}
        />
      ))}
    </svg>
  );
}
function Comparison({ r, title }: { r: number; title: string }) {
  const vals = orbit(r, 0.2, 100),
    lambda = lyapunov(r, 0.2);
  return (
    <article>
      <h3>
        {title} (r={r.toFixed(3)})
      </h3>
      <div>
        <OrbitPlot values={vals} />
        <Cobweb r={r} x0={0.2} />
        <section>
          <Gauge value={lambda} />
          <strong>{lambda.toFixed(3)}</strong>
        </section>
      </div>
      <p>
        Behavior:{" "}
        {lambda > 0
          ? "Aperiodic, sensitive to initial conditions."
          : "Converges to a stable periodic cycle."}
      </p>
    </article>
  );
}
