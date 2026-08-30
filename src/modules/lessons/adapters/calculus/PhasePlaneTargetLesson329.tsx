import {
  AlertTriangle,
  Check,
  Play,
  RotateCcw,
  Settings,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PhasePlaneTargetLesson329.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));

export default function PhasePlaneTargetLesson329({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x0, setX0] = useState(1.2);
  const [y0, setY0] = useState(1.1);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [field, setField] = useState(true);
  const [nullclines, setNullclines] = useState(true);
  const [trajectories, setTrajectories] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [classification, setClassification] = useState("Center");
  const [radiusAnswer, setRadiusAnswer] = useState("");
  const [radiusResult, setRadiusResult] = useState<
    "" | "correct" | "incorrect"
  >("");
  const [actions, setActions] = useState(0);
  const timer = useRef<number>();
  const radius = Math.hypot(x0, y0);
  const x = x0 * Math.cos(time) + y0 * Math.sin(time);
  const y = -x0 * Math.sin(time) + y0 * Math.cos(time);
  const speed = Math.hypot(y, -x);
  const reset = () => {
    setX0(1.2);
    setY0(1.1);
    setTime(0);
    setPlaying(false);
    setField(true);
    setNullclines(true);
    setTrajectories(true);
    setTab("Interact");
    setClassification("Center");
    setRadiusAnswer("");
    setRadiusResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(
      () => setTime((value) => clean((value + 0.05) % 20)),
      50,
    );
    return () => window.clearInterval(timer.current);
  }, [playing]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const dragInitial = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = clamp(
      ((event.clientX - rect.left) / rect.width) * 8 - 4,
      -4,
      4,
    );
    const nextY = clamp(
      4 - ((event.clientY - rect.top) / rect.height) * 8,
      -4,
      4,
    );
    act(() => {
      setX0(clean(nextX));
      setY0(clean(nextY));
    });
  };
  return (
    <section
      className="phase329-page"
      data-testid="calculus-mockup-0408"
      data-object-model="center-system-generated-vector-field-nullclines-circular-trajectories-draggable-initial-state-linked-time-series-animation-classification-radius-practice"
      data-x0={clean(x0)}
      data-y0={clean(y0)}
      data-time={clean(time)}
      data-x={clean(x)}
      data-y={clean(y)}
      data-speed={clean(speed)}
      data-radius={clean(radius)}
      data-field={field}
      data-nullclines={nullclines}
      data-trajectories={trajectories}
      data-playing={playing}
      data-tab={tab}
      data-classification={classification}
      data-radius-result={radiusResult}
      data-actions={actions}
    >
      <header className="phase329-hero">
        <span>
          <b>CALCULUS</b>
          <b>SYSTEMS OF DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Phase Plane</h1>
        <p>Analyze coupled systems with x–y phase portraits.</p>
        <div>
          <button>English (English)⌄</button>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
        </div>
      </header>
      <nav className="phase329-tabs">
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
      <section className="phase329-lab">
        <main>
          <header>
            <h2>Phase portrait</h2>
            <div>
              <Toggle
                label="Vector field"
                checked={field}
                set={() => act(() => setField(!field))}
              />
              <Toggle
                label="Nullclines"
                checked={nullclines}
                set={() => act(() => setNullclines(!nullclines))}
              />
              <Toggle
                label="Trajectories"
                checked={trajectories}
                set={() => act(() => setTrajectories(!trajectories))}
              />
              <button>
                <Settings /> Settings
              </button>
            </div>
          </header>
          <PhasePortrait
            x0={x0}
            y0={y0}
            field={field}
            nullclines={nullclines}
            trajectories={trajectories}
            drag={dragInitial}
          />
          <footer>
            <span>
              <i className="blue" /> x-nullcline: <b>x = 0</b>
            </span>
            <span>
              <i className="violet" /> y-nullcline: <b>y = 0</b>
            </span>
            <span>
              <i className="dot" /> Initial state
            </span>
          </footer>
          <section className="initial">
            <b>Initial state</b> <span>(drag point or set values)</span>
            <label>
              x₀ ={" "}
              <input
                aria-label="Phase plane initial x"
                type="number"
                step=".1"
                value={x0}
                onChange={(e) => act(() => setX0(Number(e.target.value)))}
              />
            </label>
            <label>
              y₀ ={" "}
              <input
                aria-label="Phase plane initial y"
                type="number"
                step=".1"
                value={y0}
                onChange={(e) => act(() => setY0(Number(e.target.value)))}
              />
            </label>
          </section>
        </main>
        <aside>
          <section className="time">
            <header>
              Time <b>t = {time.toFixed(2)}</b>
            </header>
            <div>
              <input
                aria-label="Phase plane time"
                type="range"
                min="0"
                max="20"
                step=".01"
                value={time}
                onChange={(e) => act(() => setTime(Number(e.target.value)))}
              />
              <button
                aria-label="Play phase animation"
                onClick={() => act(() => setPlaying(!playing))}
              >
                <Play />
              </button>
            </div>
            <small>
              0 <span>5</span>
              <span>10</span>
              <span>15</span>20
            </small>
            <p>Time window: 0 to 20</p>
          </section>
          <TimePlot
            label="x(t)"
            color="#1266ff"
            x0={x0}
            y0={y0}
            time={time}
            kind="x"
          />
          <TimePlot
            label="y(t)"
            color="#6a22ff"
            x0={x0}
            y0={y0}
            time={time}
            kind="y"
          />
          <section className="metrics">
            <p>
              Position:{" "}
              <b>
                ({x.toFixed(2)}, {y.toFixed(2)})
              </b>
            </p>
            <p>
              Speed: <b>{speed.toFixed(2)}</b>
            </p>
            <p>
              |r| = √x²+y² = <b>{radius.toFixed(2)}</b>
            </p>
          </section>
        </aside>
      </section>
      <section className="phase329-insights">
        <article>
          <h2>What's happening?</h2>
          <p>
            This system is a center. Trajectories are closed orbits (circles)
            around the origin. The motion is periodic and the amplitude (radius)
            is constant.
          </p>
        </article>
        <article>
          <h2>
            <AlertTriangle /> Common misconception
          </h2>
          <p>
            Thinking trajectories spiral in or out.
            <br />
            Not here—neither x nor y grows or decays. Energy (r² = x² + y²)
            stays constant.
          </p>
        </article>
      </section>
      <section className="phase329-system">
        <h2>Governing system</h2>
        <div>
          <strong>
            dx/dt = y<br />
            dy/dt = −x
          </strong>
          <p>
            <b>Interpretation:</b>
            <br />• x increases when y &gt; 0 and decreases when y &lt; 0.
            <br />• y decreases when x &gt; 0 and increases when x &lt; 0.
            <br />• The origin (0, 0) is a center (stable).
          </p>
          <p>
            <b>Equilibrium:</b>
            <br />
            Set dx/dt = 0, dy/dt = 0 ⇒ x = 0, y = 0.
          </p>
        </div>
      </section>
      <section className="phase329-worked">
        <h2>Worked example</h2>
        <div>
          <p>
            Use x₀ = 1, y₀ = 0.
            <br />
            <b>Solution:</b>
            <br />
            x(t) = x₀ cos t + y₀ sin t = cos t<br />
            y(t) = −x₀ sin t + y₀ cos t = −sin t<br />
            Orbit: x² + y² = 1
          </p>
          <p>
            <b>Check at t = π/2:</b>
            <br />
            x(π/2) = 0<br />
            y(π/2) = −1
            <br />
            Point on plot: <em>(0, −1)</em>
          </p>
          <p className="self">
            <Check /> <b>Self-check</b>
            <br />
            Verify: x²(t) + y²(t) = 1<br />
            cos²t + sin²t = 1 ✓<br />
            Constant radius confirmed.
          </p>
        </div>
      </section>
      <section className="phase329-practice">
        <article>
          <h2>Quick practice</h2>
          <p>
            1. For the system dx/dt = y, dy/dt = −x, classify the equilibrium at
            (0, 0).
          </p>
          <div>
            {["Stable node", "Unstable node", "Saddle", "Center"].map(
              (value) => (
                <button
                  key={value}
                  className={classification === value ? "selected" : ""}
                  onClick={() => act(() => setClassification(value))}
                >
                  {value}
                </button>
              ),
            )}
          </div>
        </article>
        <article>
          <h2>Try it!</h2>
          <p>Set x₀ = 2, y₀ = 0. What is the radius of the orbit?</p>
          <div>
            <input
              aria-label="Phase plane radius answer"
              placeholder="Enter your answer"
              value={radiusAnswer}
              onChange={(e) => setRadiusAnswer(e.target.value)}
            />
            <button
              onClick={() =>
                act(() =>
                  setRadiusResult(
                    Number(radiusAnswer) === 2 ? "correct" : "incorrect",
                  ),
                )
              }
            >
              Check
            </button>
          </div>
          <output className={radiusResult}>
            {radiusResult === "correct"
              ? "Correct: r = 2."
              : radiusResult === "incorrect"
                ? "Use r = √(x₀²+y₀²)."
                : "Hint: r = √(x₀² + y₀²)"}
          </output>
        </article>
      </section>
    </section>
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
    <label>
      {label}
      <button
        role="switch"
        aria-label={`Phase plane ${label}`}
        aria-checked={checked}
        className={checked ? "on" : ""}
        onClick={set}
      >
        <i />
      </button>
    </label>
  );
}

function PhasePortrait({
  x0,
  y0,
  field,
  nullclines,
  trajectories,
  drag,
}: {
  x0: number;
  y0: number;
  field: boolean;
  nullclines: boolean;
  trajectories: boolean;
  drag: (event: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 250 + x * 55;
  const sy = (y: number) => 220 - y * 50;
  const arrows = [];
  for (let gx = -4; gx <= 4; gx += 0.5)
    for (let gy = -4; gy <= 4; gy += 0.5) {
      const length = Math.hypot(gy, -gx) || 1,
        dx = (gy / length) * 7,
        dy = (gx / length) * 7;
      arrows.push(
        <line
          key={`${gx}-${gy}`}
          x1={sx(gx) - dx}
          y1={sy(gy) - dy}
          x2={sx(gx) + dx}
          y2={sy(gy) + dy}
        />,
      );
    }
  return (
    <svg
      className="phase329-portrait"
      viewBox="0 0 500 440"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <rect width="500" height="440" />
      {field && <g className="field">{arrows}</g>}
      <g className="axes">
        <line x1="20" x2="480" y1="220" y2="220" />
        <line x1="250" x2="250" y1="10" y2="430" />
      </g>
      {nullclines && (
        <g className="nullclines">
          <line x1="250" x2="250" y1="10" y2="430" />
          <line x1="20" x2="480" y1="220" y2="220" />
        </g>
      )}
      {trajectories && (
        <g className="orbits">
          {[0.5, 1, 1.5, 2, 2.5].map((r) => (
            <ellipse key={r} cx="250" cy="220" rx={r * 55} ry={r * 50} />
          ))}
        </g>
      )}
      <circle
        data-drag="phase-initial"
        className="initial-point"
        cx={sx(x0)}
        cy={sy(y0)}
        r="10"
      />
      <text x={sx(x0) + 12} y={sy(y0) - 8}>
        ({x0.toFixed(1)}, {y0.toFixed(1)})
      </text>
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((n) => (
        <g key={n}>
          <text x={sx(n) - 4} y="237">
            {n}
          </text>
          {n !== 0 && (
            <text x="230" y={sy(n) + 3}>
              {n}
            </text>
          )}
        </g>
      ))}
      <text x="486" y="216">
        x
      </text>
      <text x="256" y="14">
        y
      </text>
    </svg>
  );
}

function TimePlot({
  label,
  color,
  x0,
  y0,
  time,
  kind,
}: {
  label: string;
  color: string;
  x0: number;
  y0: number;
  time: number;
  kind: "x" | "y";
}) {
  const value = (t: number) =>
    kind === "x"
      ? x0 * Math.cos(t) + y0 * Math.sin(t)
      : -x0 * Math.sin(t) + y0 * Math.cos(t);
  const d = Array.from({ length: 201 }, (_, i) => {
    const t = i / 10,
      v = value(t);
    return `${i ? "L" : "M"}${22 + t * 12.1},${75 - v * 24}`;
  }).join(" ");
  return (
    <section className="phase329-timeplot">
      <header>
        <b style={{ color }}>{label}</b>
        <span style={{ background: `${color}15`, color }}>
          {label[0]}(0.00) = {(kind === "x" ? x0 : y0).toFixed(2)}
        </span>
      </header>
      <svg viewBox="0 0 270 130">
        <line x1="20" x2="264" y1="75" y2="75" />
        <line x1="22" x2="22" y1="8" y2="122" />
        <path d={d} style={{ stroke: color }} />
        <circle
          cx={22 + time * 12.1}
          cy={75 - value(time) * 24}
          r="3"
          style={{ fill: color }}
        />
      </svg>
    </section>
  );
}
