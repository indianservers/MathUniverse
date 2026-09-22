import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CircleHelp,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Search,
  Trophy,
} from "lucide-react";
import { compileTwoVariableExpression } from "../utils/functionParser";
import "./CalculusDifferentialEquationsStudio.css";

export type DeMode = "slope" | "ivp" | "separable" | "growth" | "euler" | "rk4";
type LearningTab = "Observe" | "Understand" | "Why" | "Try" | "Challenge";
type Tone = "plain" | "good" | "warn";

const MODES: DeMode[] = ["slope", "ivp", "separable", "growth", "euler", "rk4"];

const MODE_INFO: Record<DeMode, { title: string; formula: string; note: string; expression: string }> = {
  slope: {
    title: "Slope fields",
    formula: "y' = f(x, y)",
    note: "Each tick is the slope the solution must follow. Click the field to drop an initial condition.",
    expression: "x - y",
  },
  ivp: {
    title: "Initial value problem",
    formula: "y' = f(x, y),  y(x₀) = y₀",
    note: "One point (x₀, y₀) selects a unique solution curve from the family on the field.",
    expression: "x - y",
  },
  separable: {
    title: "Separable equations",
    formula: "dy/y = k dt  ⇒  y = y₀ e^{kt}",
    note: "Separate variables, integrate both sides, then apply y(0) = y₀.",
    expression: "k*y",
  },
  growth: {
    title: "Logistic growth",
    formula: "y' = r y (1 − y/K)",
    note: "Early growth is nearly exponential; the carrying capacity K flattens the curve.",
    expression: "r*y*(1-y/K)",
  },
  euler: {
    title: "Euler's method",
    formula: "yₙ₊₁ = yₙ + h f(xₙ, yₙ)",
    note: "Each step follows the tangent. Smaller h shortens the polygonal error versus the exact curve.",
    expression: "x - y",
  },
  rk4: {
    title: "Runge–Kutta 4",
    formula: "yₙ₊₁ = yₙ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)",
    note: "Four slope samples per step keep RK4 closer to the exact solution than Euler at the same h.",
    expression: "x - y",
  },
};

export default function CalculusDifferentialEquationsStudio({ mode }: { mode: string }) {
  const active = isDeMode(mode) ? mode : "slope";
  const info = MODE_INFO[active];
  const [expression, setExpression] = useState(info.expression);
  const [draft, setDraft] = useState(info.expression);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [h, setH] = useState(active === "euler" || active === "rk4" ? 0.25 : 0.2);
  const [k, setK] = useState(0.6);
  const [rate, setRate] = useState(0.8);
  const [capacity, setCapacity] = useState(10);
  const [time, setTime] = useState(active === "growth" ? 4 : 3);
  const [target, setTarget] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [learning, setLearning] = useState<LearningTab>("Observe");
  const [challengeNote, setChallengeNote] = useState("");
  const previousMode = useRef(active);

  useEffect(() => {
    if (previousMode.current === active) return;
    previousMode.current = active;
    const next = MODE_INFO[active];
    setExpression(next.expression);
    setDraft(next.expression);
    setX0(0);
    setY0(1);
    setH(active === "euler" || active === "rk4" ? 0.25 : 0.2);
    setK(0.6);
    setRate(0.8);
    setCapacity(10);
    setTime(active === "growth" ? 4 : 3);
    setTarget(2);
    setPlaying(false);
    setLearning("Observe");
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (active === "separable" || active === "growth") {
        setTime((value) => (value >= (active === "growth" ? 10 : 6) ? 0.2 : Number((value + 0.08 * speed).toFixed(2))));
      } else if (active === "euler" || active === "rk4") {
        setH((value) => (value <= 0.06 ? 0.5 : Number((value - 0.02 * speed).toFixed(2))));
      } else {
        setX0((value) => (value >= 3 ? -3 : Number((value + 0.05 * speed).toFixed(2))));
      }
    }, 90);
    return () => window.clearInterval(timer);
  }, [active, playing, speed]);

  const compiled = useMemo(() => compileField(expression), [expression]);
  const draftField = useMemo(() => compileField(draft), [draft]);
  const field = useMemo(() => {
    if (active === "separable") return (_x: number, y: number) => k * y;
    if (active === "growth") return (_x: number, y: number) => rate * y * (1 - y / Math.max(0.2, capacity));
    return compiled.fn;
  }, [active, capacity, compiled.fn, k, rate]);

  const analysis = useMemo(
    () => analyze(active, field, x0, y0, h, k, rate, capacity, time, target),
    [active, capacity, field, h, k, rate, target, time, x0, y0],
  );

  const plot = () => {
    if (!draftField.error) setExpression(draft);
  };

  const reset = () => {
    const next = MODE_INFO[active];
    setExpression(next.expression);
    setDraft(next.expression);
    setX0(0);
    setY0(1);
    setH(active === "euler" || active === "rk4" ? 0.25 : 0.2);
    setK(0.6);
    setRate(0.8);
    setCapacity(10);
    setTime(active === "growth" ? 4 : 3);
    setTarget(2);
    setPlaying(false);
    setShowGrid(true);
  };

  const onLearningKey = (event: KeyboardEvent<HTMLElement>) => {
    const tabs: LearningTab[] = ["Observe", "Understand", "Why", "Try", "Challenge"];
    const index = tabs.indexOf(learning);
    if (event.key === "ArrowRight") setLearning(tabs[(index + 1) % tabs.length]);
    if (event.key === "ArrowLeft") setLearning(tabs[(index - 1 + tabs.length) % tabs.length]);
  };

  return (
    <div className="de-studio" data-testid="de-studio" data-de-mode={active} data-lab-mode={active} data-mode-canvas={active}>
      <div className="de-workspace">
        <aside className="de-panel de-controls">
          <h2><span>1</span>{info.title}</h2>
          <p className="de-note">{info.note}</p>
          <div className="de-formula">
            <span>Key relationship</span>
            <strong>{info.formula}</strong>
          </div>
          {active === "separable" || active === "growth" ? (
            <p className="de-feedback" data-testid="de-equation">{active === "separable" ? `y' = ${fmt(k, 2)} y` : `y' = ${fmt(rate, 2)} y (1 − y/${fmt(capacity, 1)})`}</p>
          ) : (
            <label>
              Differential equation
              <input
                aria-label="Differential equation"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && plot()}
              />
            </label>
          )}
          {draftField.error && active !== "separable" && active !== "growth" ? <p className="de-error">{draftField.error}</p> : null}
          {active !== "separable" && active !== "growth" ? <p className="de-feedback" data-testid="de-equation">dy/dx = {expression}</p> : null}
          {active === "slope" || active === "ivp" ? <p className="de-hint">Click the slope field to set (x₀, y₀).</p> : null}
          <p className="de-hint"><Link to="/differential-equations">Open the full Differential Equations Studio.</Link></p>
          {active === "separable" ? (
            <>
              <Slider label="Rate k" value={k} min={-1.5} max={1.5} step={0.05} onChange={setK} />
              <Slider label="Initial y₀" value={y0} min={0.2} max={4} step={0.05} onChange={setY0} />
              <Slider label="Time t" value={time} min={0} max={6} step={0.05} onChange={setTime} />
            </>
          ) : null}
          {active === "growth" ? (
            <>
              <Slider label="Growth rate r" value={rate} min={0.1} max={2} step={0.05} onChange={setRate} />
              <Slider label="Capacity K" value={capacity} min={3} max={20} step={0.5} onChange={setCapacity} />
              <Slider label="Initial y₀" value={y0} min={0.2} max={Math.max(0.4, capacity - 0.2)} step={0.05} onChange={setY0} />
              <Slider label="Time t" value={time} min={0} max={10} step={0.05} onChange={setTime} />
            </>
          ) : null}
          {active === "slope" || active === "ivp" || active === "euler" || active === "rk4" ? (
            <>
              <Slider label="Initial x₀" value={x0} min={-4} max={4} step={0.05} onChange={setX0} />
              <Slider label="Initial y₀" value={y0} min={-3} max={4} step={0.05} onChange={setY0} />
              <Slider label="Step size h" value={h} min={0.05} max={0.8} step={0.01} onChange={setH} />
            </>
          ) : null}
          {active === "euler" || active === "rk4" ? (
            <Slider label="Target x" value={target} min={0.5} max={4} step={0.05} onChange={setTarget} />
          ) : null}
          <label className="de-check">
            <input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} />
            Show guides and grid
          </label>
          <div className="de-player">
            {active !== "separable" && active !== "growth" ? (
              <button className="de-primary" type="button" onClick={plot}>Plot</button>
            ) : null}
            <button type="button" onClick={reset} title="Reset"><RotateCcw /> Reset</button>
            <button className="de-primary" type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause /> : <Play />}
              <span>{playing ? "Pause" : "Animate"}</span>
            </button>
            {(active === "euler" || active === "rk4" || active === "ivp" || active === "slope") ? (
              <button type="button" onClick={() => setX0((value) => Number((value + h).toFixed(2)))}>Step</button>
            ) : (
              <button type="button" onClick={() => setTime((value) => Number((value + 0.2).toFixed(2)))}>Step</button>
            )}
            <select aria-label="Animation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </aside>

        <section className="de-panel de-visual" aria-label={`${info.title} visualization`}>
          <header>
            <div>
              <span>Differential equation</span>
              <h2 data-testid="de-visual-title">{visualHeading(active)}</h2>
            </div>
            <button type="button" className={showGrid ? "active" : ""} onClick={() => setShowGrid((value) => !value)}>Guides</button>
          </header>
          <DeGraph
            mode={active}
            field={field}
            x0={x0}
            y0={y0}
            h={h}
            k={k}
            rate={rate}
            capacity={capacity}
            time={time}
            target={target}
            showGrid={showGrid}
            onPick={(x, y) => {
              setX0(x);
              setY0(y);
            }}
          />
        </section>

        <aside className="de-panel de-results" aria-live="polite">
          <h2><span>2</span>Live results</h2>
          <div className="de-metrics">
            {analysis.metrics.map(([label, value, tone]) => (
              <div key={label} className={tone} data-testid={`de-metric-${label}`}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          {active === "euler" || active === "rk4" || active === "slope" || active === "ivp" ? (
            <StepTable mode={active} field={field} x0={x0} y0={y0} h={h} />
          ) : (
            <section className="de-mini">
              <h3>{active === "separable" ? "Separated form" : "Logistic closed form"}</h3>
              <p>{active === "separable" ? `∫ dy/y = ∫ ${fmt(k, 2)} dt  →  ln|y| = ${fmt(k, 2)} t + C` : `y(t) = K y₀ / (y₀ + (K − y₀) e^{−rt})`}</p>
            </section>
          )}
          <section className="de-mini">
            <h3>{analysis.status}</h3>
            <p>{analysis.insight}</p>
          </section>
        </aside>
      </div>

      <section className="de-learning" aria-label="Learning loop">
        <nav role="tablist" aria-label="Learning stages" onKeyDown={onLearningKey}>
          {(["Observe", "Understand", "Why", "Try", "Challenge"] as LearningTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`de-learn-${tab}`}
              aria-selected={learning === tab}
              tabIndex={learning === tab ? 0 : -1}
              className={learning === tab ? "active" : ""}
              onClick={() => setLearning(tab)}
            >
              {tab === "Observe" ? <Search /> : tab === "Understand" ? <BookOpen /> : tab === "Why" ? <CircleHelp /> : tab === "Try" ? <Lightbulb /> : <Trophy />}
              <span>{tab}</span>
            </button>
          ))}
        </nav>
        <p role="tabpanel" aria-labelledby={`de-learn-${learning}`} data-testid="de-learning-copy">
          {learningCopy(learning, active, analysis)}
        </p>
        <button type="button" onClick={() => setChallengeNote(analysis.metrics.some((item) => item[2] === "warn") ? "Not yet. Shrink h or move the IVP until warning cards clear." : "Challenge complete: Euler/RK4 stay close to the live model.")}>Check challenge</button>
        {challengeNote ? <p role="status">{challengeNote}</p> : null}
      </section>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const clamped = Math.min(max, Math.max(min, value));
  return (
    <label className="de-slider">
      <span>{label}<b>{fmt(value, step < 1 ? 2 : 1)}</b></span>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={clamped} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function DeGraph({
  mode, field, x0, y0, h, k, rate, capacity, time, target, showGrid, onPick,
}: {
  mode: DeMode;
  field: (x: number, y: number) => number;
  x0: number;
  y0: number;
  h: number;
  k: number;
  rate: number;
  capacity: number;
  time: number;
  target: number;
  showGrid: boolean;
  onPick: (x: number, y: number) => void;
}) {
  const width = 900;
  const height = 560;
  const pad = 54;
  const growth = mode === "separable" || mode === "growth";
  const xMin = growth ? 0 : -5;
  const xMax = growth ? Math.max(1, time + 0.5, 6) : 5;
  const yMin = growth ? -0.4 : -4;
  const yMax = growth ? (mode === "growth" ? Math.max(capacity + 1, y0 + 1) : Math.max(4, y0 * Math.exp(k * xMax) + 0.5)) : 4;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const step = Math.max(0.05, h);
  const euler = integrate(field, growth ? 0 : x0, y0, step, growth ? Math.max(8, Math.round(time / step)) : 50, "euler");
  const rk = integrate(field, growth ? 0 : x0, y0, step, growth ? Math.max(8, Math.round(time / step)) : 50, "rk4");
  const exactPts = growth
    ? sampleX((t) => (mode === "growth" ? logistic(y0, rate, capacity, t) : y0 * Math.exp(k * t)), 0, Math.max(0.2, time), 120)
    : sampleX((t) => exactLinear(x0, y0, t), x0, x0 + step * 50, 80);
  const clickable = mode === "slope" || mode === "ivp";
  const click = (event: { currentTarget: SVGSVGElement; clientX: number; clientY: number }) => {
    if (!clickable) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width * width;
    const py = (event.clientY - rect.top) / rect.height * height;
    const x = xMin + (px - pad) / (width - pad * 2) * (xMax - xMin);
    const y = yMax - (py - pad) / (height - pad * 2) * (yMax - yMin);
    onPick(Number(x.toFixed(2)), Number(y.toFixed(2)));
  };
  const showEuler = mode === "slope" || mode === "euler" || mode === "rk4";
  const showRk = mode !== "euler" && mode !== "separable";
  const markerX = growth ? time : x0;
  const markerY = growth ? (mode === "growth" ? logistic(y0, rate, capacity, time) : y0 * Math.exp(k * time)) : y0;

  return (
    <svg
      className={`de-graph${clickable ? " is-interactive" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={visualHeading(mode)}
      onPointerDown={click}
    >
      <rect width={width} height={height} rx="16" fill="#ffffff" />
      {showGrid ? Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={pad + i * ((width - pad * 2) / 10)} x2={pad + i * ((width - pad * 2) / 10)} y1={pad} y2={height - pad} className="de-grid" />
          <line x1={pad} x2={width - pad} y1={pad + i * ((height - pad * 2) / 10)} y2={pad + i * ((height - pad * 2) / 10)} className="de-grid" />
        </g>
      )) : null}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="de-axis" />
      <line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="de-axis" />
      {Array.from({ length: growth ? 13 : 21 }, (_, ix) => Array.from({ length: 17 }, (_, iy) => {
        const x = xMin + (ix / (growth ? 12 : 20)) * (xMax - xMin);
        const y = yMin + (iy / 16) * (yMax - yMin);
        const m = field(x, y);
        if (!Number.isFinite(m)) return null;
        const ang = Math.atan(m);
        const len = 11;
        return (
          <line
            key={`${ix}-${iy}`}
            x1={sx(x) - Math.cos(ang) * len / 2}
            y1={sy(y) - Math.sin(ang) * len / 2}
            x2={sx(x) + Math.cos(ang) * len / 2}
            y2={sy(y) + Math.sin(ang) * len / 2}
            stroke="#10aee8"
            strokeWidth="1.5"
          />
        );
      }))}
      {mode === "growth" ? <line x1={pad} x2={width - pad} y1={sy(capacity)} y2={sy(capacity)} stroke="#7c3aed" strokeDasharray="8 6" strokeWidth="2" /> : null}
      {showEuler ? <path d={poly(euler, sx, sy, yMin, yMax)} fill="none" stroke="#f59e0b" strokeWidth="3" /> : null}
      {mode === "euler" ? euler.map((p, i) => i < 12 ? <circle key={`e${i}`} cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" /> : null) : null}
      {showRk ? <path d={poly(rk, sx, sy, yMin, yMax)} fill="none" stroke="#ef4444" strokeWidth="4" /> : null}
      <path d={poly(exactPts, sx, sy, yMin, yMax)} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray={mode === "separable" || mode === "growth" ? undefined : "6 5"} />
      {mode === "rk4" ? (
        <g>
          {rk4Preview(field, x0, y0, step).map((item) => (
            <line key={item.label} x1={sx(item.x)} y1={sy(item.y)} x2={sx(item.x + step * 0.45)} y2={sy(item.y + item.slope * step * 0.45)} stroke={item.color} strokeWidth="3" />
          ))}
        </g>
      ) : null}
      <circle cx={sx(growth ? 0 : x0)} cy={sy(y0)} r="8" fill="#f97316" stroke="#fff" strokeWidth="3" />
      {growth ? <circle cx={sx(markerX)} cy={sy(markerY)} r="8" fill="#8b5cf6" stroke="#fff" strokeWidth="3" /> : null}
      <text x="62" y="40" className="de-caption">{caption(mode, target)}</text>
      {mode === "growth" ? <text x="62" y="64" className="de-caption-muted">Dashed violet = carrying capacity K</text> : null}
    </svg>
  );
}

function StepTable({ mode, field, x0, y0, h }: { mode: DeMode; field: (x: number, y: number) => number; x0: number; y0: number; h: number }) {
  const method = mode === "euler" ? "euler" : "rk4";
  const rows = integrate(field, x0, y0, Math.max(0.05, h), 4, method);
  return (
    <section className="de-mini">
      <h3>Numerical steps ({method === "euler" ? "Euler" : "RK4"})</h3>
      <table className="de-table">
        <thead><tr><th>Step</th><th>xₙ</th><th>yₙ</th><th>dy/dx</th></tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}><td>{index}</td><td>{fmt(row.x, 4)}</td><td>{fmt(row.y, 4)}</td><td>{fmt(field(row.x, row.y), 4)}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function analyze(
  mode: DeMode,
  field: (x: number, y: number) => number,
  x0: number,
  y0: number,
  h: number,
  k: number,
  rate: number,
  capacity: number,
  time: number,
  target: number,
): { metrics: Array<[string, string, Tone]>; status: string; insight: string } {
  if (mode === "separable") {
    const value = y0 * Math.exp(k * time);
    return {
      metrics: [
        ["y(t)", fmt(value, 5), "good"],
        ["Rate k", fmt(k, 2), "plain"],
        ["y₀", fmt(y0, 2), "plain"],
        ["t", fmt(time, 2), "plain"],
      ],
      status: k === 0 ? "Equilibrium" : k > 0 ? "Exponential growth" : "Exponential decay",
      insight: `Separating gives ln|y| = ${fmt(k, 2)} t + C, so the solution through y(0)=${fmt(y0, 2)} is y=${fmt(y0, 2)} e^{${fmt(k, 2)} t}.`,
    };
  }
  if (mode === "growth") {
    const value = logistic(y0, rate, capacity, time);
    const remaining = capacity - value;
    return {
      metrics: [
        ["y(t)", fmt(value, 4), "good"],
        ["Capacity K", fmt(capacity, 2), "plain"],
        ["Gap K − y", fmt(remaining, 3), remaining < 0.4 ? "good" : "plain"],
        ["r", fmt(rate, 2), "plain"],
      ],
      status: Math.abs(remaining) < 0.3 ? "Near carrying capacity" : "Approaching K",
      insight: `Logistic growth starts like y' ≈ r y, then slows as y approaches K = ${fmt(capacity, 1)}.`,
    };
  }
  const step = Math.max(0.05, h);
  const steps = Math.max(1, Math.round((target - x0) / step));
  const eulerEnd = integrate(field, x0, y0, step, steps, "euler").at(-1) ?? { x: target, y: y0 };
  const rkEnd = integrate(field, x0, y0, step, steps, "rk4").at(-1) ?? { x: target, y: y0 };
  const exact = exactLinear(x0, y0, target);
  const slope = field(x0, y0);
  const eulerErr = Math.abs(eulerEnd.y - exact);
  const rkErr = Math.abs(rkEnd.y - exact);
  if (mode === "euler") {
    return {
      metrics: [
        ["Euler y", fmt(eulerEnd.y, 5), "plain"],
        ["Exact y", fmt(exact, 5), "good"],
        ["Abs. error", fmt(eulerErr, 5), eulerErr < 0.1 ? "good" : "warn"],
        ["h", fmt(h, 2), "plain"],
      ],
      status: eulerErr < 0.1 ? "Euler is close" : "Shrink h",
      insight: `Euler walked ${steps} tangent steps from (${fmt(x0, 2)}, ${fmt(y0, 2)}) to x = ${fmt(target, 2)}.`,
    };
  }
  if (mode === "rk4") {
    return {
      metrics: [
        ["RK4 y", fmt(rkEnd.y, 5), "good"],
        ["Euler y", fmt(eulerEnd.y, 5), "plain"],
        ["Exact y", fmt(exact, 5), "good"],
        ["RK4 error", fmt(rkErr, 6), rkErr < 0.05 ? "good" : "warn"],
      ],
      status: rkErr < eulerErr ? "RK4 beats Euler" : "Compare step size",
      insight: `At the same h = ${fmt(h, 2)}, RK4 error ${fmt(rkErr, 5)} vs Euler ${fmt(eulerErr, 5)}.`,
    };
  }
  return {
    metrics: [
      ["x₀", fmt(x0, 2), "plain"],
      ["y₀", fmt(y0, 2), "plain"],
      ["dy/dx", fmt(slope, 3), "good"],
      ["Step h", fmt(h, 2), "plain"],
    ],
    status: mode === "ivp" ? "Unique solution selected" : "Field ready",
    insight: mode === "ivp"
      ? `The highlighted curve is the unique solution of y' = f(x,y) through (${fmt(x0, 2)}, ${fmt(y0, 2)}).`
      : "Orange Euler, red RK4, and dashed green exact overlay when f(x,y) = x − y.",
  };
}

function learningCopy(tab: LearningTab, mode: DeMode, analysis: { insight: string; metrics: Array<[string, string, Tone]> }): string {
  const primary = analysis.metrics[0]?.[1] ?? "the live value";
  if (tab === "Observe") return `Observe: ${MODE_INFO[mode].title.toLowerCase()} is showing live value ${primary}. ${MODE_INFO[mode].note}`;
  if (tab === "Understand") return `Understand: ${MODE_INFO[mode].formula}. ${analysis.insight}`;
  if (tab === "Why") return "Why: the slope ticks, the numerical path, and the closed-form curve are three views of the same differential equation.";
  if (tab === "Try") {
    if (mode === "separable") return "Try: flip the sign of k and watch growth become decay, then reset.";
    if (mode === "growth") return "Try: drop K close to y₀, then raise K and compare how late the curve flattens.";
    if (mode === "euler") return "Try: grow h until the orange polygon peels away from the green exact curve.";
    if (mode === "rk4") return "Try: use a large h and check that red RK4 still hugs the exact curve better than Euler.";
    return "Try: click a new initial condition, then press Reset and compare the selected solution.";
  }
  const challenges: Record<DeMode, string> = {
    slope: "Challenge: click an IVP so Euler and RK4 stay visually close as h shrinks.",
    ivp: "Challenge: overlay the solution through (x₀, y₀) and keep it on the field.",
    separable: "Challenge: match y = y₀ e^{kt} to the slope ticks of y' = k y.",
    growth: "Challenge: compare exponential vs logistic by changing the carrying capacity K.",
    euler: "Challenge: shrink h until Euler error vs the exact curve is under 0.1.",
    rk4: "Challenge: compare Euler vs RK4 at the same h and keep RK4 visibly closer to exact.",
  };
  return challenges[mode];
}

function visualHeading(mode: DeMode) {
  if (mode === "separable") return "Separated solution y = y₀ e^{kt}";
  if (mode === "growth") return "Logistic curve approaching K";
  if (mode === "euler") return "Euler polygonal steps";
  if (mode === "rk4") return "RK4 versus Euler and exact";
  if (mode === "ivp") return "Unique IVP solution on the field";
  return "Slope field with Euler, RK4, and exact";
}

function caption(mode: DeMode, target: number) {
  if (mode === "separable") return "Green = exact y = y₀ e^{kt} · orange Euler ticks follow y' = k y";
  if (mode === "growth") return "Green = logistic closed form · orange Euler · red RK4";
  if (mode === "euler") return `Orange Euler polygons to x = ${fmt(target, 2)} · green exact for y' = x − y`;
  if (mode === "rk4") return "Red RK4 · orange Euler · green exact · short strokes are k₁…k₄";
  if (mode === "ivp") return "Click to set (x₀, y₀) · the red curve is the solution through that point";
  return "Click to set (x₀, y₀) · orange Euler · red RK4 · green exact for x − y";
}

function compileField(value: string) {
  try {
    return { fn: compileTwoVariableExpression(value), error: "" };
  } catch (error) {
    return { fn: (x: number, y: number) => x - y, error: error instanceof Error ? error.message : "Invalid field" };
  }
}

function integrate(f: (x: number, y: number) => number, x0: number, y0: number, h: number, steps: number, method: "rk4" | "euler") {
  const pts = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  for (let i = 0; i < steps; i += 1) {
    if (method === "euler") y += h * f(x, y);
    else {
      const k1 = f(x, y);
      const k2 = f(x + h / 2, y + h * k1 / 2);
      const k3 = f(x + h / 2, y + h * k2 / 2);
      const k4 = f(x + h, y + h * k3);
      y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    }
    x += h;
    pts.push({ x, y });
  }
  return pts;
}

function rk4Preview(f: (x: number, y: number) => number, x: number, y: number, h: number) {
  const k1 = f(x, y);
  const k2 = f(x + h / 2, y + h * k1 / 2);
  const k3 = f(x + h / 2, y + h * k2 / 2);
  const k4 = f(x + h, y + h * k3);
  return [
    { label: "k1", x, y, slope: k1, color: "#0ea5e9" },
    { label: "k2", x: x + h / 2, y: y + h * k1 / 2, slope: k2, color: "#8b5cf6" },
    { label: "k3", x: x + h / 2, y: y + h * k2 / 2, slope: k3, color: "#f97316" },
    { label: "k4", x: x + h, y: y + h * k3, slope: k4, color: "#16a34a" },
  ];
}

function sampleX(fn: (x: number) => number, min: number, max: number, count: number) {
  const hi = Math.max(min + 1e-6, max);
  return Array.from({ length: count }, (_, i) => {
    const x = min + i / (count - 1) * (hi - min);
    const y = fn(x);
    return { x, y };
  });
}

function poly(points: Array<{ x: number; y: number }>, sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
  let open = false;
  return points.map((p) => {
    if (!Number.isFinite(p.y) || p.y < yMin - 8 || p.y > yMax + 8) {
      open = false;
      return "";
    }
    const command = open ? "L" : "M";
    open = true;
    return `${command}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`;
  }).join(" ");
}

function exactLinear(x0: number, y0: number, x: number) {
  return x - 1 + (y0 - x0 + 1) * Math.exp(x0 - x);
}

function logistic(y0: number, r: number, k: number, t: number) {
  const cap = Math.max(0.2, k);
  const start = Math.max(1e-6, y0);
  return (cap * start) / (start + (cap - start) * Math.exp(-r * t));
}

function isDeMode(value: string): value is DeMode {
  return MODES.includes(value as DeMode);
}

function fmt(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}
