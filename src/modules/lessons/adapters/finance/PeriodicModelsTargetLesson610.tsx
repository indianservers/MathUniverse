import { Lock, LockOpen, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PeriodicModelsTargetLesson610.css";

type Key = "amplitude" | "period" | "phase" | "midline";
const format = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
export default function PeriodicModelsTargetLesson610({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [amplitude, setAmplitude] = useState(3000),
    [period, setPeriod] = useState(12),
    [phase, setPhase] = useState(0),
    [midline, setMidline] = useState(10000),
    [locks, setLocks] = useState<Record<Key, boolean>>({
      amplitude: false,
      period: false,
      phase: false,
      midline: false,
    }),
    [drag, setDrag] = useState<"peak" | "trough" | "midline" | null>(null),
    [tab, setTab] = useState("Interact"),
    [ca, setCa] = useState(4000),
    [cp, setCp] = useState(6),
    [ch, setCh] = useState(0),
    [cd, setCd] = useState(18000),
    [graded, setGraded] = useState<boolean | null>(null),
    [challenge, setChallenge] = useState(0),
    [actions, setActions] = useState(0);
  const reset = () => {
    setAmplitude(3000);
    setPeriod(12);
    setPhase(0);
    setMidline(10000);
    setLocks({ amplitude: false, period: false, phase: false, midline: false });
    setDrag(null);
    setTab("Interact");
    setCa(4000);
    setCp(6);
    setCh(0);
    setCd(18000);
    setGraded(null);
    setChallenge(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const value = (x: number) =>
      amplitude * Math.sin(((2 * Math.PI) / period) * (x - phase)) + midline,
    rows = Array.from({ length: 9 }, (_, index) => {
      const x = index * 3;
      return { x, y: value(x) };
    });
  const minY = Math.min(0, midline - amplitude - 2000),
    maxY = midline + amplitude + 3000,
    px = (x: number) => 55 + (x / 24) * 560,
    py = (y: number) => 280 - ((y - minY) / (maxY - minY)) * 230,
    path = Array.from({ length: 193 }, (_, index) => index / 8)
      .map((x, index) => `${index ? "L" : "M"}${px(x)},${py(value(x))}`)
      .join(" ");
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - rect.left) / rect.width) * 24,
      y = maxY - ((event.clientY - rect.top) / rect.height) * (maxY - minY);
    act(() => {
      if (drag === "peak") {
        if (!locks.phase) setPhase(Number((x - period / 4).toFixed(1)));
        if (!locks.amplitude)
          setAmplitude(Math.max(100, Math.round(y - midline)));
      } else if (drag === "trough") {
        if (!locks.phase) setPhase(Number((x - (3 * period) / 4).toFixed(1)));
        if (!locks.amplitude)
          setAmplitude(Math.max(100, Math.round(midline - y)));
      } else if (!locks.midline) setMidline(Math.max(0, Math.round(y)));
    });
  };
  const toggle = (key: Key) =>
      act(() => setLocks((current) => ({ ...current, [key]: !current[key] }))),
    check = () =>
      act(() =>
        setGraded(
          challenge === 0
            ? ca === 4000 && cp === 6 && ch === 0 && cd === 18000
            : ca === 2500 && cp === 8 && ch === 2 && cd === 12000,
        ),
      ),
    nextChallenge = () =>
      act(() => {
        if (challenge === 0) {
          setCa(2500);
          setCp(8);
          setCh(2);
          setCd(12000);
        } else {
          setCa(4000);
          setCp(6);
          setCh(0);
          setCd(18000);
        }
        setChallenge((value) => 1 - value);
        setGraded(null);
      });
  return (
    <section
      className="pm610-page"
      data-testid="finance-mockup-0667"
      data-object-model="dedicated-draggable-sinusoidal-cycle-landmark-model"
      data-amplitude={amplitude}
      data-period={period}
      data-phase={phase}
      data-midline={midline}
      data-peak={midline + amplitude}
      data-trough={midline - amplitude}
      data-locks={Object.values(locks).filter(Boolean).length}
      data-dragging={drag ?? ""}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pm610-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS &amp; MODELLING</b>
        </span>
        <h1>Periodic Models</h1>
        <p>Model and analyze repeating cycles using the sinusoidal model.</p>
        <dl>
          <b>
            Level
            <br />
            Intermediate-Advanced
          </b>
          <b>
            Lab
            <br />
            Applied Modelling
          </b>
          <b>
            Time
            <br />
            6-10 min
          </b>
          <b>
            Focus
            <br />
            Periodic functions
          </b>
          <aside>
            <b>Lesson Objective</b>
            <br />
            Build a sinusoidal model from a repeating context, identify key
            parameters, and interpret the equation.
          </aside>
        </dl>
      </header>
      <nav className="pm610-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
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
      {tab !== "Interact" && (
        <p className="pm610-note">
          <b>{tab}:</b> A sinusoidal model repeats after every period P.
        </p>
      )}
      <section className="pm610-lab">
        <header>
          <div>
            <h2>1 Observe &amp; Manipulate</h2>
            <p>
              Use the controls to explore how amplitude, period, phase, and
              midline shape the model.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset all
          </button>
        </header>
        <main>
          <svg
            viewBox="0 0 670 340"
            aria-label="Interactive periodic model graph"
            onPointerMove={move}
            onPointerUp={() => setDrag(null)}
          >
            <text x="390" y="25">
              y = a sin((2π/P)(x-h)) + d
            </text>
            {[45, 92, 139, 186, 233, 280].map((y) => (
              <line className="grid" key={y} x1="55" x2="615" y1={y} y2={y} />
            ))}
            {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((x) => (
              <g key={x}>
                <line className="grid" x1={px(x)} x2={px(x)} y1="40" y2="280" />
                <text x={px(x) - 5} y="300">
                  {x}
                </text>
              </g>
            ))}
            <line x1="55" x2="615" y1={py(0)} y2={py(0)} />
            <line x1="55" x2="55" y1="40" y2="280" />
            <line
              className="midline"
              x1="55"
              x2="615"
              y1={py(midline)}
              y2={py(midline)}
            />
            <path d={path} />
            {rows.map((row) => (
              <circle key={row.x} cx={px(row.x)} cy={py(row.y)} r="5" />
            ))}
            <circle
              className="peak"
              cx={px(phase + period / 4)}
              cy={py(midline + amplitude)}
              r="7"
              onPointerDown={() => setDrag("peak")}
            />
            <circle
              className="trough"
              cx={px(phase + (3 * period) / 4)}
              cy={py(midline - amplitude)}
              r="7"
              onPointerDown={() => setDrag("trough")}
            />
            <circle
              className="middle"
              cx={px(phase + period / 2)}
              cy={py(midline)}
              r="7"
              onPointerDown={() => setDrag("midline")}
            />
          </svg>
          <footer>
            <span>
              Start<b>{phase}</b>
            </span>
            <span>
              Peak<b>{phase + period / 4}</b>
            </span>
            <span>
              Midline down<b>{phase + period / 2}</b>
            </span>
            <span>
              Trough<b>{phase + (3 * period) / 4}</b>
            </span>
            <span>
              Midline up<b>{phase + period}</b>
            </span>
          </footer>
        </main>
        <section className="pm610-controls">
          <div>
            <Control
              id="amplitude"
              label="Amplitude a (Rs)"
              value={amplitude}
              min={100}
              max={20000}
              step={100}
              locked={locks.amplitude}
              onLock={() => toggle("amplitude")}
              onChange={(value) => act(() => setAmplitude(value))}
            />
            <Control
              id="period"
              label="Period P (months)"
              value={period}
              min={1}
              max={24}
              step={1}
              locked={locks.period}
              onLock={() => toggle("period")}
              onChange={(value) => act(() => setPeriod(value))}
            />
            <Control
              id="phase"
              label="Phase shift h (months)"
              value={phase}
              min={-12}
              max={12}
              step={1}
              locked={locks.phase}
              onLock={() => toggle("phase")}
              onChange={(value) => act(() => setPhase(value))}
            />
            <Control
              id="midline"
              label="Midline d (Rs)"
              value={midline}
              min={0}
              max={20000}
              step={100}
              locked={locks.midline}
              onLock={() => toggle("midline")}
              onChange={(value) => act(() => setMidline(value))}
            />
          </div>
          <article>
            <h3>Instant Readouts</h3>
            <p>
              Maximum (Peak)<b>{format(midline + amplitude)}</b>
            </p>
            <p>
              Minimum (Trough)<b>{format(midline - amplitude)}</b>
            </p>
            <p>
              Range<b>{format(2 * amplitude)}</b>
            </p>
            <p>
              Frequency<b>1/{period} per month</b>
            </p>
            <p>
              Half-period<b>{period / 2} months</b>
            </p>
          </article>
          <article>
            <h3>Current Model</h3>
            <strong>
              y={amplitude} sin((2π/{period})(x-{phase}))+{midline}
            </strong>
            <h3>Cycle Key</h3>
            <p>Start ({phase}) y=d</p>
            <p>Peak ({phase + period / 4}) y=d+a</p>
            <p>Midline ({phase + period / 2}) y=d</p>
            <p>Trough ({phase + (3 * period) / 4}) y=d-a</p>
          </article>
        </section>
      </section>
      <section className="pm610-theory">
        <article>
          <h2>2 Notice the Pattern</h2>
          <p>The pattern repeats every {period} months.</p>
          <p>
            Values rise to a maximum, fall to a minimum, then return to the
            midline.
          </p>
          <p>Peaks are {period} months apart.</p>
          <aside>So, the period is {period} months.</aside>
        </article>
        <article>
          <h2>3 Understand the Rule</h2>
          <p>For a sinusoidal model:</p>
          <strong>y = a sin((2π/P)(x-h)) + d</strong>
          <table>
            <tbody>
              <tr>
                <th>a</th>
                <td>Amplitude</td>
                <td>{format(amplitude)}</td>
              </tr>
              <tr>
                <th>P</th>
                <td>Period</td>
                <td>{period} months</td>
              </tr>
              <tr>
                <th>h</th>
                <td>Phase shift</td>
                <td>{phase} months</td>
              </tr>
              <tr>
                <th>d</th>
                <td>Midline</td>
                <td>{format(midline)}</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h2>4 Worked Example</h2>
          <p>
            From the graph: a={format(amplitude)}, P={period}, h={phase}, d=
            {format(midline)}.
          </p>
          <strong>
            y={amplitude} sin((2π/{period})(x-{phase}))+{midline}
          </strong>
          <aside>
            This model matches the data and repeats every {period} months.
          </aside>
        </article>
      </section>
      <section className="pm610-challenge">
        <header>
          <h2>5 Try Independently</h2>
          <p>
            <b>Parameter Challenge:</b>{" "}
            {challenge === 0
              ? "A seasonal expense has a midline of Rs 18,000, amplitude Rs 4,000, period 6 months, and starts at the midline rising."
              : "A demand cycle has a midline of Rs 12,000, amplitude Rs 2,500, period 8 months, and begins 2 months after the reference point."}
          </p>
        </header>
        <label>
          a ={" "}
          <input
            aria-label="Challenge amplitude"
            type="number"
            value={ca}
            onChange={(event) =>
              act(() => {
                setCa(+event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <label>
          P ={" "}
          <input
            aria-label="Challenge period"
            type="number"
            value={cp}
            onChange={(event) =>
              act(() => {
                setCp(+event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <label>
          h ={" "}
          <input
            aria-label="Challenge phase"
            type="number"
            value={ch}
            onChange={(event) =>
              act(() => {
                setCh(+event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <label>
          d ={" "}
          <input
            aria-label="Challenge midline"
            type="number"
            value={cd}
            onChange={(event) =>
              act(() => {
                setCd(+event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <button onClick={check}>Check</button>
        <output className={graded === null ? "" : graded ? "correct" : "wrong"}>
          {graded === null
            ? ""
            : graded
              ? "Well done! Your model matches the description."
              : "Check all four parameters."}
        </output>
        <button onClick={nextChallenge}>New Challenge</button>
      </section>
      <nav className="pm610-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/609-exponential-and-logistic-models">
          &larr;{" "}
          <span>
            Previous Lesson<b>Exponential and Logistic Models</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/611-piecewise-models">
          <span>
            Next Lesson<b>Piecewise Models</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
    </section>
  );
}
function Control({
  id,
  label,
  value,
  min,
  max,
  step,
  locked,
  onLock,
  onChange,
}: {
  id: Key;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  locked: boolean;
  onLock: () => void;
  onChange: (value: number) => void;
}) {
  return (
    <label className="pm610-control">
      <b>{label}</b>
      <span>
        <input
          aria-label={`${label} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={locked}
          onChange={(event) => onChange(+event.target.value)}
        />
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={locked}
          onChange={(event) => onChange(+event.target.value)}
        />
        <button
          aria-label={`${locked ? "Unlock" : "Lock"} ${id}`}
          onClick={onLock}
        >
          {locked ? <Lock /> : <LockOpen />}
        </button>
      </span>
    </label>
  );
}
