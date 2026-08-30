import { Check, Lightbulb, RotateCcw, Share2 } from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./LogisticGrowthTargetLesson327.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));
const population = (t: number, k: number, r: number, p0: number) => {
  const a = (k - p0) / p0;
  return k / (1 + a * Math.exp(-r * t));
};
const inflectionTime = (k: number, r: number, p0: number) =>
  Math.log((k - p0) / p0) / r;
const timeFor = (target: number, k: number, r: number, p0: number) =>
  Math.log((k - p0) / p0 / (k / target - 1)) / r;

export default function LogisticGrowthTargetLesson327({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [k, setK] = useState(2000);
  const [r, setR] = useState(0.6);
  const [p0, setP0] = useState(400);
  const [time, setTime] = useState(2.4);
  const [tab, setTab] = useState("Interact");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [result1, setResult1] = useState<"" | "correct" | "incorrect">("");
  const [result2, setResult2] = useState<"" | "correct" | "incorrect">("");
  const [reveal, setReveal] = useState(false);
  const [actions, setActions] = useState(0);
  const a = (k - p0) / p0;
  const value = population(time, k, r, p0);
  const rate = r * value * (1 - value / k);
  const ti = inflectionTime(k, r, p0);
  const workedP10 = population(10, k, r, p0);
  const workedHalf = timeFor(k / 2, k, r, p0);
  const practiceP5 = population(5, 3000, 0.4, 300);
  const practiceHalf = timeFor(1500, 3000, 0.4, 300);
  const reset = () => {
    setK(2000);
    setR(0.6);
    setP0(400);
    setTime(2.4);
    setTab("Interact");
    setAnswer1("");
    setAnswer2("");
    setResult1("");
    setResult2("");
    setReveal(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateK = (next: number) =>
    act(() => {
      const safe = clamp(next, 500, 5000);
      setK(safe);
      setP0((value) => Math.min(value, safe - 10));
    });
  const updateP0 = (next: number) => act(() => setP0(clamp(next, 10, k - 10)));
  return (
    <section
      className="log327-page"
      data-testid="calculus-mockup-0406"
      data-object-model="logistic-population-closed-form-carrying-capacity-inflection-draggable-initial-condition-growth-rate-phases-practice"
      data-k={clean(k)}
      data-r={clean(r)}
      data-p0={clean(p0)}
      data-time={clean(time)}
      data-population={clean(value)}
      data-rate={clean(rate)}
      data-a={clean(a)}
      data-inflection={clean(ti)}
      data-tab={tab}
      data-result1={result1}
      data-result2={result2}
      data-reveal={reveal}
      data-actions={actions}
    >
      <header className="log327-hero">
        <span>CALCULUS</span>
        <h1>Logistic Growth</h1>
        <p>Model limited population growth.</p>
        <aside>
          <button>♙ Advanced</button>
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
          <button>↗ Workspace</button>
        </aside>
      </header>
      <nav className="log327-tabs">
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
      <section className="log327-lab">
        <main>
          <header>
            <h2>Population over time</h2>
            <span>ⓘ</span>
          </header>
          <LogisticGraph
            k={k}
            r={r}
            p0={p0}
            time={time}
            onP0={updateP0}
            onTime={(next) => act(() => setTime(clamp(next, 0, 20)))}
          />
          <section className="phases">
            <b>Phase:</b>
            <span>Exponential acceleration</span>
            <span>Deceleration to capacity</span>
            <span>Equilibrium (P≈K)</span>
          </section>
          <footer>
            <article>
              <b>Instantaneous growth dP/dt</b>
              <strong>{rate.toFixed(1)}</strong>
              <small>(positive: population increasing)</small>
            </article>
            <article>
              <b>Population</b>
              <strong>{value.toFixed(1)}</strong>
              <small>individuals</small>
            </article>
            <article>
              <b>Time</b>
              <strong>{time.toFixed(2)}</strong>
              <small>units</small>
            </article>
          </footer>
        </main>
        <aside>
          <h2>Model controls</h2>
          <p>Adjust parameters and the curve updates instantly.</p>
          <Control
            label="Carrying capacity K"
            value={k}
            min={500}
            max={5000}
            step={100}
            set={updateK}
          />
          <Control
            label="Growth rate r"
            value={r}
            min={0.05}
            max={2}
            step={0.05}
            set={(next) => act(() => setR(next))}
          />
          <Control
            label="Initial population P₀"
            value={p0}
            min={10}
            max={Math.max(20, k - 10)}
            step={10}
            set={updateP0}
          />
          <p>Drag the blue dot on the graph or use the slider above.</p>
          <section className="legend">
            <h3>Legend</h3>
            <p>
              <i className="curve" />
              P(t) Population curve
            </p>
            <p>
              <i className="capacity" />K Carrying capacity
            </p>
            <p>
              <i className="half" />
              K/2 Inflection point
            </p>
            <p>
              <i className="initial" />
              P₀ Initial population
            </p>
          </section>
        </aside>
      </section>
      <section className="log327-theory">
        <article>
          <h2>What is logistic growth?</h2>
          <p>
            Logistic growth models populations with limited resources. Growth is
            nearly exponential when the population is small, but slows as it
            approaches carrying capacity K.
          </p>
          <p>◉ When P≪K: resources abundant, growth accelerates.</p>
          <p>◉ Near P=K/2: growth is maximum.</p>
        </article>
        <article>
          <h2>Governing model</h2>
          <p>The logistic differential equation</p>
          <strong>dP/dt = rP(1-P/K)</strong>
          <h3>Exact solution</h3>
          <b>P(t)=K/(1+Ae^-rt), A=(K-P₀)/P₀</b>
        </article>
        <article>
          <h2>Key facts</h2>
          {[
            "P(t)≥0 and P(t)≤K for t≥0.",
            "Maximum growth at P=K/2.",
            "lim P(t)=K as t→∞.",
            "P=K is stable.",
          ].map((fact) => (
            <p key={fact}>
              <Check />
              {fact}
            </p>
          ))}
        </article>
      </section>
      <section className="log327-worked">
        <article>
          <h2>Worked example</h2>
          <p>
            A population has K={k.toLocaleString()}, r={r.toFixed(2)}, and P₀=
            {p0.toLocaleString()}. Find P(10) and the time when population
            reaches K/2.
          </p>
          <h3>Solution</h3>
          <strong>A=(K-P₀)/P₀ = {a.toFixed(3)}</strong>
          <strong>
            P(10)=K/(1+Ae^(-10r)) ≈ <b>{workedP10.toFixed(1)}</b>
          </strong>
          <strong>
            t=ln(A)/r ≈ <b>{workedHalf.toFixed(3)} units</b>
          </strong>
          <footer>
            <Check /> At t≈{workedHalf.toFixed(2)}, the graph crosses P=K/2.
          </footer>
        </article>
        <aside>
          <section>
            <h2>Common misconceptions</h2>
            {[
              "Assuming growth is always exponential.",
              "Thinking the population can exceed K.",
              "Confusing r with maximum growth.",
            ].map((text) => (
              <p key={text}>
                ⚠ <b>{text}</b>
                <span>
                  The logistic model slows growth as resources become limited.
                </span>
              </p>
            ))}
          </section>
          <section>
            <h2>
              <Lightbulb /> Did you know?
            </h2>
            <p>
              The logistic model also describes spread of ideas, adoption of
              technology, and chemical reactions with limited reactants.
            </p>
          </section>
        </aside>
      </section>
      <section className="log327-practice">
        <header>
          <h2>Try it yourself</h2>
          <p>A population has K=3,000, r=0.40, and P₀=300.</p>
        </header>
        <label>
          <i>1</i> Find P(5).
          <span>
            <input
              aria-label="Logistic practice population"
              value={answer1}
              placeholder="Your answer"
              onChange={(event) =>
                act(() => {
                  setAnswer1(event.target.value);
                  setResult1("");
                })
              }
            />
            <button
              onClick={() =>
                act(() =>
                  setResult1(
                    Math.abs(Number(answer1) - practiceP5) < 1
                      ? "correct"
                      : "incorrect",
                  ),
                )
              }
            >
              Check
            </button>
          </span>
        </label>
        <label>
          <i>2</i> When does the population reach 1,500?
          <span>
            <input
              aria-label="Logistic practice time"
              value={answer2}
              placeholder="Your answer"
              onChange={(event) =>
                act(() => {
                  setAnswer2(event.target.value);
                  setResult2("");
                })
              }
            />
            <button
              onClick={() =>
                act(() =>
                  setResult2(
                    Math.abs(Number(answer2) - practiceHalf) < 0.02
                      ? "correct"
                      : "incorrect",
                  ),
                )
              }
            >
              Check
            </button>
          </span>
        </label>
        <aside>
          <h3>
            Self-check answers{" "}
            <button onClick={() => act(() => setReveal((value) => !value))}>
              {reveal ? "Hide" : "Reveal"}
            </button>
          </h3>
          {reveal && (
            <>
              <p className={result1}>1 P(5)≈{practiceP5.toFixed(1)}</p>
              <p className={result2}>2 t≈{practiceHalf.toFixed(2)} units</p>
            </>
          )}
        </aside>
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
    <label className="log327-control">
      <span>{label}</span>
      <output>
        {value >= 100 ? value.toLocaleString() : value.toFixed(2)}
      </output>
      <input
        aria-label={`Logistic ${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => set(Number(event.target.value))}
      />
      <small>
        {min.toLocaleString()}
        <i>{max.toLocaleString()}</i>
      </small>
    </label>
  );
}

function LogisticGraph({
  k,
  r,
  p0,
  time,
  onP0,
  onTime,
}: {
  k: number;
  r: number;
  p0: number;
  time: number;
  onP0: (value: number) => void;
  onTime: (value: number) => void;
}) {
  const w = 515,
    h = 355,
    p = 35,
    tmax = 20,
    ymax = k * 1.2,
    sx = (t: number) => p + (t / tmax) * (w - 2 * p),
    sy = (value: number) => h - p - (value / ymax) * (h - 2 * p),
    curve = Array.from({ length: 201 }, (_, i) => {
      const t = i / 10;
      return `${i ? "L" : "M"}${sx(t)},${sy(population(t, k, r, p0))}`;
    }).join(" "),
    ti = inflectionTime(k, r, p0);
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (e: PointerEvent) =>
      onP0(k * 1.2 * (1 - (e.clientY - box.top) / box.height));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      className="log327-graph"
      viewBox={`0 0 ${w} ${h}`}
      onPointerDown={(event) => {
        if ((event.target as Element).tagName !== "circle") {
          const box = event.currentTarget.getBoundingClientRect();
          onTime(((event.clientX - box.left) / box.width) * 20);
        }
      }}
    >
      {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((tick) => (
        <g className="tick" key={`x${tick}`}>
          <line x1={sx(tick)} x2={sx(tick)} y1={sy(0)} y2={sy(0) + 4} />
          <text x={sx(tick)} y={sy(0) + 17}>
            {tick}
          </text>
        </g>
      ))}
      {[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2].map((fraction) => (
        <g className="tick y" key={`y${fraction}`}>
          <line x1={p - 4} x2={p} y1={sy(k * fraction)} y2={sy(k * fraction)} />
          <text x={p - 8} y={sy(k * fraction) + 3}>
            {Math.round(k * fraction).toLocaleString()}
          </text>
        </g>
      ))}
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
      <line className="capacity" x1={p} x2={w - p} y1={sy(k)} y2={sy(k)} />
      <line className="half" x1={p} x2={w - p} y1={sy(k / 2)} y2={sy(k / 2)} />
      <path className="curve" d={curve} />
      <line
        className="probe"
        x1={sx(time)}
        x2={sx(time)}
        y1={sy(0)}
        y2={sy(population(time, k, r, p0))}
      />
      <circle
        data-drag="logistic-initial"
        className="initial"
        cx={sx(0)}
        cy={sy(p0)}
        r="7"
        onPointerDown={drag}
      />
      {Number.isFinite(ti) && ti >= 0 && ti <= 20 && (
        <>
          <line
            className="inflection-line"
            x1={sx(ti)}
            x2={sx(ti)}
            y1={sy(0)}
            y2={sy(k / 2)}
          />
          <circle className="inflection" cx={sx(ti)} cy={sy(k / 2)} r="7" />
        </>
      )}
      <text x={w - 125} y={sy(k) - 8}>
        K (carrying capacity)
      </text>
      <text className="half-label" x={p + 8} y={sy(k / 2) - 7}>
        K/2
      </text>
      <text x={p + 8} y={sy(p0) - 10}>
        P₀
      </text>
      <text x={sx(ti) + 10} y={sy(k / 2) + 18}>
        Inflection (K/2)
      </text>
    </svg>
  );
}
