import { Check, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SecondOrderEquationsTargetLesson328.css";

type ResponsePoint = { t: number; x: number; v: number; a: number };
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));
const regimeFor = (zeta: number) =>
  zeta < 0.999 ? "Underdamped" : zeta > 1.001 ? "Overdamped" : "Critical";

function responseAt(
  t: number,
  m: number,
  c: number,
  k: number,
  x0: number,
  v0: number,
) {
  const alpha = c / (2 * m);
  const wn = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  let x = 0;
  let v = 0;
  if (zeta < 0.999) {
    const wd = Math.sqrt(Math.max(0, wn ** 2 - alpha ** 2));
    const b = (v0 + alpha * x0) / wd;
    const cos = Math.cos(wd * t);
    const sin = Math.sin(wd * t);
    const envelope = Math.exp(-alpha * t);
    x = envelope * (x0 * cos + b * sin);
    v = envelope * (-alpha * (x0 * cos + b * sin) + wd * (-x0 * sin + b * cos));
  } else if (zeta <= 1.001) {
    const b = v0 + alpha * x0;
    const envelope = Math.exp(-alpha * t);
    x = envelope * (x0 + b * t);
    v = envelope * (b - alpha * (x0 + b * t));
  } else {
    const disc = Math.sqrt(c ** 2 - 4 * m * k);
    const r1 = (-c + disc) / (2 * m);
    const r2 = (-c - disc) / (2 * m);
    const c1 = (v0 - r2 * x0) / (r1 - r2);
    const c2 = x0 - c1;
    x = c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    v = c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t);
  }
  return { x, v, a: (-c * v - k * x) / m };
}

export default function SecondOrderEquationsTargetLesson328({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m, setM] = useState(1);
  const [c, setC] = useState(0.2);
  const [k, setK] = useState(4);
  const [x0, setX0] = useState(1);
  const [v0, setV0] = useState(0);
  const [tmax, setTmax] = useState(15);
  const [dt, setDt] = useState(0.01);
  const [tab, setTab] = useState("Interact");
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState<"" | "correct" | "incorrect">("");
  const [actions, setActions] = useState(0);
  const wn = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  const alpha = c / (2 * m);
  const discriminant = c ** 2 - 4 * m * k;
  const regime = regimeFor(zeta);
  const wd = zeta < 1 ? wn * Math.sqrt(1 - zeta ** 2) : 0;
  const r1 =
    discriminant >= 0 ? (-c + Math.sqrt(discriminant)) / (2 * m) : -alpha;
  const imag = discriminant < 0 ? Math.sqrt(-discriminant) / (2 * m) : 0;
  const points = useMemo(() => {
    const count = Math.min(1000, Math.max(100, Math.round(tmax / dt)));
    return Array.from({ length: count + 1 }, (_, index): ResponsePoint => {
      const t = (index / count) * tmax;
      return { t, ...responseAt(t, m, c, k, x0, v0) };
    });
  }, [m, c, k, x0, v0, tmax, dt]);
  const peaks = {
    x: Math.max(...points.map((point) => Math.abs(point.x))),
    v: Math.max(...points.map((point) => Math.abs(point.v))),
    a: Math.max(...points.map((point) => Math.abs(point.a))),
  };
  const period = wd > 0 ? (2 * Math.PI) / wd : 0;
  const decrement =
    wd > 0 ? (2 * Math.PI * zeta) / Math.sqrt(1 - zeta ** 2) : 0;
  const reset = () => {
    setM(1);
    setC(0.2);
    setK(4);
    setX0(1);
    setV0(0);
    setTmax(15);
    setDt(0.01);
    setTab("Interact");
    setChoice("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  return (
    <section
      className="osc328-page"
      data-testid="calculus-mockup-0407"
      data-object-model="mass-spring-damper-regime-aware-closed-form-roots-displacement-velocity-acceleration-damping-overview-practice"
      data-m={clean(m)}
      data-c={clean(c)}
      data-k={clean(k)}
      data-x0={clean(x0)}
      data-v0={clean(v0)}
      data-tmax={clean(tmax)}
      data-dt={clean(dt)}
      data-zeta={clean(zeta)}
      data-wn={clean(wn)}
      data-wd={clean(wd)}
      data-regime={regime}
      data-root-real={clean(r1)}
      data-root-imag={clean(imag)}
      data-peak-x={clean(peaks.x)}
      data-peak-v={clean(peaks.v)}
      data-peak-a={clean(peaks.a)}
      data-period={clean(period)}
      data-decrement={clean(decrement)}
      data-tab={tab}
      data-choice={choice}
      data-result={result}
      data-actions={actions}
    >
      <header className="osc328-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Second-Order Equations</h1>
        <p>Explore the mass-spring-damper oscillator model</p>
        <div>
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
        </div>
      </header>
      <nav className="osc328-tabs">
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
      <section className="osc328-lab">
        <header>
          <h2>Mass–Spring–Damper Oscillator</h2>
          <p>
            Model the motion of a damped mass-spring system and see
            displacement, velocity, and acceleration.
          </p>
        </header>
        <aside className="osc328-controls">
          <SpringVisual k={k} c={c} />
          <section>
            <h3>System parameters</h3>
            <Control
              label="Mass m (kg)"
              value={m}
              min={0.1}
              max={10}
              step={0.1}
              set={(value) => act(() => setM(value))}
            />
            <Control
              label="Damping c (N·s/m)"
              value={c}
              min={0}
              max={8}
              step={0.1}
              set={(value) => act(() => setC(value))}
            />
            <Control
              label="Stiffness k (N/m)"
              value={k}
              min={0.5}
              max={20}
              step={0.5}
              set={(value) => act(() => setK(value))}
            />
          </section>
          <section>
            <h3>Initial conditions</h3>
            <div className="pair">
              <label>
                Displacement x(0)
                <input
                  aria-label="Oscillator initial displacement"
                  type="number"
                  step=".1"
                  value={x0}
                  onChange={(event) =>
                    act(() => setX0(Number(event.target.value)))
                  }
                />
              </label>
              <label>
                Velocity v(0)
                <input
                  aria-label="Oscillator initial velocity"
                  type="number"
                  step=".1"
                  value={v0}
                  onChange={(event) =>
                    act(() => setV0(Number(event.target.value)))
                  }
                />
              </label>
            </div>
          </section>
          <section>
            <h3>Time settings</h3>
            <Control
              label="Time window (s)"
              value={tmax}
              min={1}
              max={30}
              step={1}
              set={(value) => act(() => setTmax(value))}
            />
            <Control
              label="Time step (s)"
              value={dt}
              min={0.001}
              max={0.1}
              step={0.001}
              set={(value) => act(() => setDt(value))}
            />
          </section>
        </aside>
        <main>
          <section className="equation">
            <h3>Governing equation (model)</h3>
            <strong>m x″(t) + c x′(t) + k x(t) = 0</strong>
            <p>
              <b>x(t):</b> displacement | <b>x′(t):</b> velocity | <b>x″(t):</b>{" "}
              acceleration
            </p>
            <div>
              <article>
                <h4>Characteristic equation</h4>
                <strong>mr²+cr+k=0</strong>
              </article>
              <article>
                <h4>Characteristic roots</h4>
                <strong>
                  {discriminant < 0 ? (
                    <>
                      r₁={r1.toFixed(4)}+{imag.toFixed(3)}i<br />
                      r₂={r1.toFixed(4)}−{imag.toFixed(3)}i
                    </>
                  ) : (
                    <>
                      r₁={r1.toFixed(4)}
                      <br />
                      r₂={((-c - Math.sqrt(discriminant)) / (2 * m)).toFixed(4)}
                    </>
                  )}
                </strong>
                <h4>Damping ratio</h4>
                <strong>ζ=c/(2√km)={zeta.toFixed(3)}</strong>
              </article>
            </div>
          </section>
          <section className="response">
            <header>
              <h3>
                System response <b>{regime}</b>
              </h3>
              <span>Natural frequency ωₙ={wn.toFixed(3)} rad/s</span>
            </header>
            <div className="plots">
              <ResponsePlot
                points={points}
                keyName="x"
                label="Displacement x(t)"
                color="#2389ef"
              />
              <ResponsePlot
                points={points}
                keyName="v"
                label="Velocity x′(t)"
                color="#a853e8"
              />
              <ResponsePlot
                points={points}
                keyName="a"
                label="Acceleration x″(t)"
                color="#08a5a9"
              />
            </div>
            <footer>
              {[
                ["Peak |x(t)|", peaks.x, "m"],
                ["Peak |x′(t)|", peaks.v, "m/s"],
                ["Peak |x″(t)|", peaks.a, "m/s²"],
                ["Period T", period, "s"],
                ["Log decrement δ", decrement, ""],
              ].map(([label, value, unit]) => (
                <article key={String(label)}>
                  <b>{label}</b>
                  <strong>
                    {Number(value).toFixed(3)} {unit}
                  </strong>
                </article>
              ))}
            </footer>
          </section>
        </main>
      </section>
      <section className="osc328-damping">
        <header>
          <h2>Damping overview</h2>
          <p>Drag c to see how damping changes the response.</p>
          <aside>
            Your value:{" "}
            <b>
              {c.toFixed(2)} → {regime}
            </b>
            <br />
            ζ={zeta.toFixed(3)}
          </aside>
        </header>
        <input
          aria-label="Oscillator damping overview"
          type="range"
          min="0"
          max="8"
          step=".1"
          value={c}
          onChange={(event) => act(() => setC(Number(event.target.value)))}
        />
        <div>
          <span>0</span>
          <span>2</span>
          <span>2√km = {(2 * Math.sqrt(k * m)).toFixed(3)}</span>
          <span>6</span>
          <span>8</span>
        </div>
        <footer>
          <b>Underdamped</b>
          <b>Critical</b>
          <b>Overdamped</b>
        </footer>
      </section>
      <section className="osc328-insights">
        <article>
          <h2>What's happening?</h2>
          <p>
            The system starts at x(0)={x0.toFixed(1)} m and{" "}
            {regime === "Underdamped"
              ? "oscillates while energy is gradually dissipated"
              : "returns toward equilibrium without sustained oscillation"}
            .
          </p>
          <p>
            Lower c → longer oscillations.
            <br />
            Higher c → faster settling.
            <br />
            Critical damping returns fastest without overshoot.
          </p>
        </article>
        <article>
          <h2>Common misconceptions</h2>
          {[
            "Thinking damping creates energy.",
            "Assuming bigger mass always means slower.",
            "Forgetting the initial velocity.",
          ].map((text) => (
            <p key={text}>
              ⊘ <b>{text}</b>
              <span>Damping and initial state change the entire response.</span>
            </p>
          ))}
        </article>
      </section>
      <section className="osc328-bottom">
        <article>
          <h2>Key formulas</h2>
          <ul>
            <li>Equation: mx″+cx′+kx=0</li>
            <li>Natural frequency: ωₙ=√(k/m)</li>
            <li>Damping ratio: ζ=c/(2√km)</li>
            <li>Roots: r=(-c±√(c²−4mk))/(2m)</li>
            <li>Underdamped: x=e^-αt(C₁cosωdt+C₂sinωdt)</li>
          </ul>
        </article>
        <article>
          <h2>
            Quick challenge <small>Try it!</small>
          </h2>
          <p>A system has m=2 kg, c=6 N·s/m, k=18 N/m. What is ζ?</p>
          <div>
            {["0.50", "1.00", "1.50", "2.00"].map((value) => (
              <button
                key={value}
                className={choice === value ? "selected" : ""}
                onClick={() =>
                  act(() => {
                    setChoice(value);
                    setResult("");
                  })
                }
              >
                {value}
              </button>
            ))}
          </div>
          <button
            className="check"
            onClick={() =>
              act(() => setResult(choice === "0.50" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <output className={result}>
            {result === "correct" ? (
              <>
                <Check /> Correct: 6/(2√36)=0.50
              </>
            ) : result === "incorrect" ? (
              "Use ζ=c/(2√km)."
            ) : (
              "Hint: simplify √(18×2)."
            )}
          </output>
        </article>
      </section>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  set,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  set: (value: number) => void;
}) {
  return (
    <label className="osc328-control">
      <span>{label}</span>
      <input
        aria-label={`Oscillator ${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => set(clamp(Number(event.target.value), min, max))}
      />
      <output>{value.toFixed(step < 0.01 ? 3 : 2)}</output>
    </label>
  );
}
function SpringVisual({ k, c }: { k: number; c: number }) {
  return (
    <svg className="osc328-spring" viewBox="0 0 250 110">
      <rect x="5" y="8" width="12" height="92" />
      <path d="M17 38 L30 38 37 28 47 48 57 28 67 48 77 28 87 48 97 28 107 48 117 38 145 38" />
      <line x1="17" x2="145" y1="78" y2="78" />
      <rect x="70" y="65" width="15" height="26" />
      <rect className="mass" x="145" y="27" width="63" height="58" rx="6" />
      <text x="172" y="59">
        m
      </text>
      <text x="75" y="23">
        k={k.toFixed(1)}
      </text>
      <text x="71" y="70">
        c={c.toFixed(1)}
      </text>
      <path d="M208 56 H240 M232 49 L240 56 232 63" />
    </svg>
  );
}
function ResponsePlot({
  points,
  keyName,
  label,
  color,
}: {
  points: ResponsePoint[];
  keyName: "x" | "v" | "a";
  label: string;
  color: string;
}) {
  const w = 165,
    h = 180,
    p = 18,
    max = Math.max(0.1, ...points.map((point) => Math.abs(point[keyName]))),
    sx = (t: number) => p + (t / points.at(-1)!.t) * (w - 2 * p),
    sy = (value: number) => h / 2 - (value / (max * 1.15)) * (h / 2 - p),
    d = points
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${sx(point.t)},${sy(point[keyName])}`,
      )
      .join(" ");
  return (
    <article>
      <h4>{label}</h4>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <line x1={p} x2={w - p} y1={h / 2} y2={h / 2} />
        <path d={d} style={{ stroke: color }} />
      </svg>
    </article>
  );
}
