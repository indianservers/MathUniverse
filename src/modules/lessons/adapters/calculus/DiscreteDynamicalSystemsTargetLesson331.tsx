import {
  Check,
  Download,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Shuffle,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./DiscreteDynamicalSystemsTargetLesson331.css";

type Rule = "quadratic" | "logistic" | "linear";
const clean = (v: number) => Number(v.toFixed(8));
const applyRule = (rule: Rule, x: number, r: number) =>
  rule === "quadratic"
    ? x * x - r / 4
    : rule === "logistic"
      ? r * x * (1 - x)
      : 0.5 * x + 0.2;
const ruleText = (rule: Rule, r: number) =>
  rule === "quadratic"
    ? `x² − ${(r / 4).toFixed(2)}`
    : rule === "logistic"
      ? `${r.toFixed(2)}x(1−x)`
      : "0.5x + 0.2";
function iterate(rule: Rule, x0: number, r: number, n: number) {
  const values = [x0];
  for (let i = 0; i < n; i++) {
    const next = applyRule(rule, values.at(-1)!, r);
    values.push(
      Number.isFinite(next) && Math.abs(next) < 1e8
        ? next
        : Math.sign(next) * 1e8,
    );
  }
  return values;
}

export default function DiscreteDynamicalSystemsTargetLesson331({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [rule, setRule] = useState<Rule>("quadratic"),
    [x0, setX0] = useState(0.2),
    [n, setN] = useState(20),
    [r, setR] = useState(2),
    [step, setStep] = useState(20),
    [playing, setPlaying] = useState(false),
    [animate, setAnimate] = useState(true),
    [trail, setTrail] = useState(true),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["0.7000", "0.5500", "0.4000"]),
    [classes, setClasses] = useState([
      "Converges to 0",
      "Diverges",
      "Depends on x₀ (may cycle)",
    ]),
    [checked, setChecked] = useState(false),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const timer = useRef<number>();
  const values = useMemo(() => iterate(rule, x0, r, n), [rule, x0, r, n]);
  const current = Math.min(step, n);
  const last = values.at(-1)!;
  const roots =
    rule === "quadratic"
      ? [(1 - Math.sqrt(1 + r)) / 2, (1 + Math.sqrt(1 + r)) / 2]
      : rule === "linear"
        ? [0.4]
        : [];
  const nearestRoot = roots.length
    ? roots.reduce((best, value) =>
        Math.abs(value - last) < Math.abs(best - last) ? value : best,
      )
    : last;
  const behavior =
    !Number.isFinite(last) || Math.abs(last) > 1e6
      ? "Diverges"
      : Math.abs(last - nearestRoot) < 0.01
        ? `Converges to ${nearestRoot.toFixed(6)}`
        : "Iterating";
  const reset = () => {
    setRule("quadratic");
    setX0(0.2);
    setN(20);
    setR(2);
    setStep(20);
    setPlaying(false);
    setAnimate(true);
    setTrail(true);
    setTab("Interact");
    setAnswers(["0.7000", "0.5500", "0.4000"]);
    setClasses(["Converges to 0", "Diverges", "Depends on x₀ (may cycle)"]);
    setChecked(false);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(
      () => setStep((v) => (v >= n ? 0 : v + 1)),
      300,
    );
    return () => window.clearInterval(timer.current);
  }, [playing, n]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const pick = (next: Rule) =>
    act(() => {
      setRule(next);
      setStep(n);
    });
  const drag = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.buttons !== 1) return;
    const b = e.currentTarget.getBoundingClientRect();
    act(() => {
      setX0(clean(-2 + ((e.clientX - b.left) / b.width) * 4));
      setStep(n);
    });
  };
  return (
    <section
      className="dds331-page"
      data-testid="calculus-mockup-0410"
      data-object-model="parameterized-iteration-engine-generated-cobweb-state-table-fixed-points-stability-draggable-seed-animation-practice"
      data-rule={rule}
      data-x0={clean(x0)}
      data-n={n}
      data-r={clean(r)}
      data-step={step}
      data-current={clean(values[current])}
      data-last={clean(last)}
      data-roots={roots.map(clean).join(",")}
      data-behavior={behavior}
      data-playing={playing}
      data-animate={animate}
      data-trail={trail}
      data-tab={tab}
      data-checked={checked}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="dds331-hero">
        <h1>Discrete Dynamical Systems</h1>
        <p>
          Iterate the rule xₙ₊₁ = f(xₙ) to explore sequences, fixed points, and
          long-term behavior.
        </p>
        <div>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button> Add to Workspace</button>
        </div>
        <nav>
          <button>Advanced</button>
          <button>CAS</button>
          <button>6–10 min</button>
          <button>English (English)</button>
        </nav>
      </header>
      <nav className="dds331-tabs">
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
      <section className="dds331-lab">
        <h2>Iterate your rule</h2>
        <div className="workspace">
          <aside>
            <section>
              <h3>Rule f(x)</h3>
              <strong>
                {ruleText(rule, r)} <Check />
              </strong>
              <div>
                {[
                  ["quadratic", "x² − 0.5"],
                  ["logistic", "r x(1−x)"],
                  ["linear", "0.5x+0.2"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={rule === key ? "selected" : ""}
                    onClick={() => pick(key as Rule)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
            <Control
              label="Initial value x₀"
              aria="Discrete initial value"
              value={x0}
              min={-2}
              max={2}
              step={0.05}
              set={(v) =>
                act(() => {
                  setX0(v);
                  setStep(n);
                })
              }
            />
            <Control
              label="Iterations N"
              aria="Discrete iterations"
              value={n}
              min={1}
              max={100}
              step={1}
              set={(v) =>
                act(() => {
                  setN(v);
                  setStep(v);
                })
              }
            />
            <Control
              label="Parameter r"
              aria="Discrete parameter r"
              value={r}
              min={0}
              max={4}
              step={0.05}
              set={(v) =>
                act(() => {
                  setR(v);
                  setStep(n);
                })
              }
            />
            <div className="reset">
              <button onClick={() => act(reset)}>
                <RotateCcw />
                Reset
              </button>
              <button
                onClick={() =>
                  act(() => setX0(clean(-1.5 + Math.random() * 3)))
                }
              >
                <Shuffle />
                Random
              </button>
            </div>
          </aside>
          <main>
            <header>
              <b>Cobweb diagram</b>
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
                Cobweb
              </span>
              <button>
                <ZoomIn />
              </button>
              <button>
                <Download />
              </button>
            </header>
            <Cobweb
              rule={rule}
              r={r}
              values={values.slice(0, current + 1)}
              x0={x0}
              trail={trail}
              drag={drag}
            />
            <footer>
              <span>● x₀ = {x0.toFixed(2)}</span>
              <span>↔ Iterates</span>
            </footer>
          </main>
          <aside className="table">
            <h3>State table</h3>
            <div>
              <b>n</b>
              <b>xₙ</b>
              {values.slice(0, 11).map((v, i) => (
                <span key={i}>
                  {i}
                  <em>{v.toFixed(6)}</em>
                </span>
              ))}
            </div>
            <section>
              <b>Fixed points</b>
              <p>
                {roots.length
                  ? roots.map((v) => v.toFixed(6)).join(", ")
                  : "Computed numerically"}
              </p>
              {roots.map((v) => (
                <p key={v}>
                  {v.toFixed(6)}{" "}
                  <em
                    className={
                      Math.abs(rule === "quadratic" ? 2 * v : 0.5) < 1
                        ? "stable"
                        : "unstable"
                    }
                  >
                    {Math.abs(rule === "quadratic" ? 2 * v : 0.5) < 1
                      ? "stable"
                      : "unstable"}
                  </em>
                </p>
              ))}
            </section>
          </aside>
        </div>
        <section className="player">
          <button
            aria-label="Play discrete animation"
            onClick={() => act(() => setPlaying(!playing))}
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <button onClick={() => act(() => setStep(0))}>|◁</button>
          <button onClick={() => act(() => setStep(Math.max(0, step - 1)))}>
            ▷
          </button>
          <button onClick={() => act(() => setStep(Math.min(n, step + 1)))}>
            ▷|
          </button>
          <label>
            Speed <input type="range" min="1" max="3" defaultValue="2" />
          </label>
          <Toggle
            label="Animate"
            checked={animate}
            set={() => act(() => setAnimate(!animate))}
          />
          <Toggle
            label="Trail"
            checked={trail}
            set={() => act(() => setTrail(!trail))}
          />
        </section>
        <footer>
          <b>Long-term behavior (from x₀ = {x0.toFixed(2)}):</b>
          <strong>{behavior}</strong>
          <span>
            Classification:{" "}
            {behavior.startsWith("Converges")
              ? "Convergent (stable fixed point)"
              : "Not yet converged"}
          </span>
        </footer>
      </section>
      <section className="dds331-theory">
        <article>
          <h2>What's happening?</h2>
          <p>
            We repeatedly apply the rule xₙ₊₁=f(xₙ). The cobweb shows each step:
            up to y=f(xₙ), then over to y=x.
          </p>
          <p>
            The sequence approaches a stable fixed point when |f′(x*)|&lt;1.
          </p>
        </article>
        <article>
          <h2>Governing rule</h2>
          <strong>xₙ₊₁=f(xₙ)</strong>
          <p>
            Fixed points solve x*=f(x*).
            <br />
            For the default: x²−x−r/4=0.
          </p>
          <p>x*=(1±√(1+r))/2</p>
        </article>
        <article>
          <h2>Misconception guard</h2>
          <p>
            The sequence does not always go to 0. It may approach a fixed point,
            diverge, or cycle depending on the rule and x₀.
          </p>
          <aside>Try x₀=1.20. The default sequence diverges rapidly.</aside>
        </article>
      </section>
      <section className="dds331-bottom">
        <article>
          <h2>Worked example</h2>
          <p>Let f(x)=x²−0.5 and x₀=0.20.</p>
          {values.slice(1, 4).map((v, i) => (
            <p key={i}>
              x{i + 1} = {v.toFixed(6)}
            </p>
          ))}
          <p>The coherent sequence approaches {(1 - Math.sqrt(3)) / 2}.</p>
        </article>
        <article>
          <h2>Quick practice</h2>
          <p>For xₙ₊₁=0.5xₙ+0.2 with x₀=1, find x₁, x₂, and the limit.</p>
          <div>
            {answers.map((v, i) => (
              <input
                key={i}
                aria-label={`Discrete practice ${i + 1}`}
                value={v}
                onChange={(e) =>
                  setAnswers((a) =>
                    a.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
              />
            ))}
          </div>
          <p>Classify: {classes.join(" | ")}</p>
          <button
            onClick={() =>
              act(() =>
                setChecked(
                  answers[0] === "0.7000" &&
                    answers[1] === "0.5500" &&
                    answers[2] === "0.4000",
                ),
              )
            }
          >
            Check answers
          </button>
          <button onClick={() => act(() => setHint(!hint))}>
            {hint ? "Linear rules converge when |a|<1." : "Show hint"}
          </button>
          <output>{checked ? "Correct" : ""}</output>
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
    <label className="dds331-control">
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
        <output>{value.toFixed(step < 1 ? 2 : 0)}</output>
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
    <label className="dds331-toggle">
      {label}
      <button
        role="switch"
        aria-label={`Discrete ${label}`}
        aria-checked={checked}
        className={checked ? "on" : ""}
        onClick={set}
      >
        <i />
      </button>
    </label>
  );
}
function Cobweb({
  rule,
  r,
  values,
  x0,
  trail,
  drag,
}: {
  rule: Rule;
  r: number;
  values: number[];
  x0: number;
  trail: boolean;
  drag: (e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const s = (v: number) => 230 + v * 105,
    d = Array.from({ length: 161 }, (_, i) => {
      const x = -2 + i * 0.025;
      return `${i ? "L" : "M"}${s(x)},${s(-applyRule(rule, x, r))}`;
    }).join(" ");
  let cob = `M${s(x0)},${s(0)}`;
  for (let i = 0; i < values.length - 1; i++)
    cob += ` L${s(values[i])},${s(-values[i + 1])} L${s(values[i + 1])},${s(-values[i + 1])}`;
  return (
    <svg
      className="dds331-cobweb"
      viewBox="0 0 460 460"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <path className="curve" d={d} />
      <line className="diagonal" x1={s(-2)} y1={s(2)} x2={s(2)} y2={s(-2)} />
      <line x1="20" x2="440" y1="230" y2="230" />
      <line x1="230" x2="230" y1="20" y2="440" />
      {trail && <path className="cob" d={cob} />}
      <circle cx={s(x0)} cy={s(0)} r="5" />
    </svg>
  );
}
