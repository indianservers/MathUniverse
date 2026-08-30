import {
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Share2,
  Shuffle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./EquilibriumStabilityTargetLesson330.css";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clean = (v: number) => Number(v.toFixed(8));
const flow = (x: number) => -x * (x + 1) * (x - 2);
const potential = (x: number) => x ** 4 / 4 - x ** 3 / 3 - x ** 2;
function integrate(x0: number, tmax: number, dt: number) {
  const count = Math.min(1500, Math.max(100, Math.ceil(tmax / dt)));
  const h = tmax / count;
  let x = x0;
  return Array.from({ length: count + 1 }, (_, index) => {
    const point = { t: index * h, x };
    const k1 = flow(x),
      k2 = flow(x + (h * k1) / 2),
      k3 = flow(x + (h * k2) / 2),
      k4 = flow(x + h * k3);
    x += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    return point;
  });
}

export default function EquilibriumStabilityTargetLesson330({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x0, setX0] = useState(-1.4);
  const [tmax, setTmax] = useState(10);
  const [dt, setDt] = useState(0.02);
  const [trajectory, setTrajectory] = useState(true);
  const [direction, setDirection] = useState(false);
  const [tab, setTab] = useState("Interact");
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const points = useMemo(() => integrate(x0, tmax, dt), [x0, tmax, dt]);
  const limit = points.at(-1)!.x;
  const basin = x0 < 0 ? -1 : x0 > 0 ? 2 : 0;
  const reset = () => {
    setX0(-1.4);
    setTmax(10);
    setDt(0.02);
    setTrajectory(true);
    setDirection(false);
    setTab("Interact");
    setChecked(false);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const drag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    act(() =>
      setX0(
        clean(
          clamp(-2 + ((event.clientX - rect.left) / rect.width) * 5.5, -2, 3.5),
        ),
      ),
    );
  };
  return (
    <section
      className="eq330-page"
      data-testid="calculus-mockup-0409"
      data-object-model="coherent-three-equilibrium-autonomous-flow-potential-phase-line-rk4-trajectory-draggable-initial-state-stability-sign-test-practice"
      data-x0={clean(x0)}
      data-tmax={tmax}
      data-dt={dt}
      data-limit={clean(limit)}
      data-basin={basin}
      data-trajectory={trajectory}
      data-direction={direction}
      data-tab={tab}
      data-checked={checked}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="eq330-hero">
        <b>CALCULUS</b>
        <h1>Equilibrium and Stability</h1>
        <p>
          Classify steady states on a potential landscape, read the phase line,
          and test nearby trajectories.
        </p>
        <div>
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset all
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
      <nav className="eq330-tabs">
        {[
          ["Interact", "Explore & test"],
          ["Learn", "Understand ideas"],
          ["Example", "Worked example"],
          ["Formula", "Rules & criteria"],
          ["Practice", "Self-check"],
        ].map(([name, sub]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      <section className="eq330-lab">
        <aside>
          <h3>MODEL CONTROLS</h3>
          <strong>x′ = −x(x+1)(x−2)</strong>
          <hr />
          <h4>Perturb around a point</h4>
          <Control
            label="Choose initial value x₀"
            aria="Equilibrium initial value"
            value={x0}
            min={-2}
            max={3.5}
            step={0.05}
            set={(v) => act(() => setX0(v))}
          />
          <p>Drag on any graph or use slider.</p>
          <Control
            label="Time window"
            aria="Equilibrium time window"
            value={tmax}
            min={2}
            max={20}
            step={1}
            set={(v) => act(() => setTmax(v))}
          />
          <Control
            label="Step size (dt)"
            aria="Equilibrium step size"
            value={dt}
            min={0.005}
            max={0.1}
            step={0.005}
            set={(v) => act(() => setDt(v))}
          />
          <Toggle
            label="Show trajectory"
            checked={trajectory}
            set={() => act(() => setTrajectory(!trajectory))}
          />
          <Toggle
            label="Show direction field"
            checked={direction}
            set={() => act(() => setDirection(!direction))}
          />
          <button
            className="random"
            onClick={() => act(() => setX0(x0 < 0 ? 0.6 : -1.4))}
          >
            <Shuffle /> New random x₀
          </button>
        </aside>
        <main>
          <section>
            <h3>
              POTENTIAL LANDSCAPE <span>V′(x) = −f(x)</span>
            </h3>
            <PotentialGraph x0={x0} drag={drag} />
          </section>
          <section className="phase">
            <h3>
              PHASE LINE <span>(x′ = f(x))</span>
            </h3>
            <PhaseLine />
          </section>
          <section className="trajectory">
            <h3>
              TRAJECTORY <span>(solution of x′ = −x(x+1)(x−2))</span>
            </h3>
            <Trajectory
              points={points}
              tmax={tmax}
              x0={x0}
              show={trajectory}
              direction={direction}
              drag={drag}
            />
            <aside>
              <b>x₀ = {x0.toFixed(2)}</b>
              <p>lim x(t) = {basin}</p>
              <small>
                Converges to equilibrium
                <br />
                <b>
                  x = {basin} ({basin === 0 ? "unstable" : "stable"})
                </b>
              </small>
            </aside>
          </section>
        </main>
      </section>
      <section className="eq330-classify">
        <h2>CLASSIFICATION OF EQUILIBRIA</h2>
        <div>
          {[
            [-1, "Stable (Attracting)", "Trajectories nearby move toward −1."],
            [0, "Unstable (Repelling)", "Trajectories move away from 0."],
            [2, "Stable (Attracting)", "Trajectories nearby move toward 2."],
          ].map(([x, title, text]) => (
            <article key={String(x)}>
              <h3>
                <i className={x === 0 ? "unstable" : ""} /> x = {x}
              </h3>
              <b>{title}</b>
              <p>
                {text}
                <br />
                f(x) changes sign at this point.
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="eq330-theory">
        <article>
          <h2>WHY THIS WORKS</h2>
          <p>
            Equilibria occur where f(x*) = 0. Their stability is determined by
            the sign of f(x) on each side.
          </p>
          <p>
            • If f goes from + to − → <b>Stable</b>
            <br />• If f goes from − to + → <em>Unstable</em>
            <br />• If f does not change sign → Semi-stable
          </p>
          <p>
            The potential V satisfies V′(x)=−f(x). Stable equilibria are local
            minima of V.
          </p>
        </article>
        <article>
          <h2>GOVERNING RULE</h2>
          <p>Autonomous 1D system: x′=f(x)</p>
          <div>
            <b>Equilibrium:</b> f(x*)=0
            <br />
            <b>Stability test:</b>
            <br />• f′(x*) &lt; 0 → Stable
            <br />• f′(x*) &gt; 0 → Unstable
            <br />• f′(x*) = 0 → Use sign test
          </div>
        </article>
        <article>
          <h2>
            <AlertTriangle /> COMMON MISCONCEPTION
          </h2>
          <b>“Minima of the graph of f(x) are stable.”</b>
          <p>
            Not necessarily. Stability depends on the sign change of f, not on
            the shape of f itself.
          </p>
          <MiniFlow />
        </article>
      </section>
      <section className="eq330-practice">
        <article>
          <h2>TRY IT YOURSELF</h2>
          <p>
            Given f(x)=2x(x−1)²(x−3).
            <br />
            1) Find all equilibria. 2) Classify each one using a sign chart.
          </p>
          <button onClick={() => act(() => setChecked(true))}>
            Check my answer
          </button>
        </article>
        <article>
          <h3>Answer (self-check)</h3>
          {checked ? (
            <p>
              Equilibria: x=0,1,3
              <br />
              x=0 → Unstable
              <br />
              x=1 → Semi-stable
              <br />
              x=3 → Stable
            </p>
          ) : (
            <p>Complete the sign chart, then check your classification.</p>
          )}
        </article>
        <button className="hint" onClick={() => act(() => setHint(!hint))}>
          <Lightbulb />
          {hint ? "Roots: 0, 1, 3" : "Need a hint?"}
        </button>
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
    <label className="eq330-control">
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
        <output>{value.toFixed(step < 0.01 ? 3 : 2)}</output>
      </span>
    </label>
  );
}
function Toggle({
  label,
  checked,
  set,
}: {
  label: string;
  checked: boolean;
  set: () => void;
}) {
  return (
    <label className="eq330-toggle">
      {label}
      <button
        role="switch"
        aria-label={`Equilibrium ${label}`}
        aria-checked={checked}
        className={checked ? "on" : ""}
        onClick={set}
      >
        <i />
      </button>
    </label>
  );
}
function PotentialGraph({
  x0,
  drag,
}: {
  x0: number;
  drag: (e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 35 + (x + 2) * 95,
    sy = (v: number) => 145 - v * 28,
    d = Array.from({ length: 221 }, (_, i) => {
      const x = -2 + i * 0.025;
      return `${i ? "L" : "M"}${sx(x)},${sy(potential(x))}`;
    }).join(" ");
  return (
    <svg
      className="eq330-potential"
      viewBox="0 0 550 215"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line x1="25" x2="545" y1="145" y2="145" />
      <line x1="35" x2="35" y1="20" y2="195" />
      <path d={d} />
      {[-1, 0, 2].map((v) => (
        <g key={v}>
          <line className="guide" x1={sx(v)} x2={sx(v)} y1="30" y2="195" />
          <circle
            className={v === 0 ? "unstable" : "stable"}
            cx={sx(v)}
            cy={sy(potential(v))}
            r="6"
          />
          <text x={sx(v) - 12} y="205">
            {v} {v === 0 ? "Unstable" : "Stable"}
          </text>
        </g>
      ))}
      <circle className="probe" cx={sx(x0)} cy={sy(potential(x0))} r="6" />
    </svg>
  );
}
function PhaseLine() {
  return (
    <svg className="eq330-phase" viewBox="0 0 550 100">
      <line x1="20" x2="535" y1="42" y2="42" />
      {[-1, 0, 2].map((x, i) => (
        <g key={x}>
          <circle
            className={i === 1 ? "unstable" : "stable"}
            cx={[115, 210, 400][i]}
            cy="42"
            r="6"
          />
          <text x={[105, 205, 395][i]} y="75">
            {x}
          </text>
        </g>
      ))}
      <text x="50" y="68">
        ←
      </text>
      <text x="155" y="68">
        →
      </text>
      <text x="275" y="68">
        ←
      </text>
      <text x="340" y="68">
        ←
      </text>
      <text x="460" y="68">
        →
      </text>
    </svg>
  );
}
function Trajectory({
  points,
  tmax,
  x0,
  show,
  direction,
  drag,
}: {
  points: { t: number; x: number }[];
  tmax: number;
  x0: number;
  show: boolean;
  direction: boolean;
  drag: (e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (t: number) => 30 + (t / tmax) * 430,
    sy = (x: number) => 95 - (x / 3) * 55,
    d = points.map((p, i) => `${i ? "L" : "M"}${sx(p.t)},${sy(p.x)}`).join(" ");
  return (
    <svg
      className="eq330-trajectory"
      viewBox="0 0 490 145"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line x1="30" x2="470" y1="95" y2="95" />
      <line x1="30" x2="30" y1="15" y2="130" />
      <line
        className="limit"
        x1="30"
        x2="470"
        y1={sy(x0 < 0 ? -1 : 2)}
        y2={sy(x0 < 0 ? -1 : 2)}
      />
      {show && <path d={d} />}{" "}
      {direction &&
        points
          .filter((_, i) => i % 150 === 0)
          .map((p, i) => <circle key={i} cx={sx(p.t)} cy={sy(p.x)} r="2" />)}
    </svg>
  );
}
function MiniFlow() {
  return (
    <svg viewBox="0 0 260 80">
      <path d="M10 55 Q60 5 110 55 T210 30 T250 55" />
      <line x1="55" x2="55" y1="15" y2="70" />
      <line x1="140" x2="140" y1="15" y2="70" />
      <line x1="220" x2="220" y1="15" y2="70" />
    </svg>
  );
}
