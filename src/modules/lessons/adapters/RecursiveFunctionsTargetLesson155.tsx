import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RefreshCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./RecursiveFunctionsTargetLesson155.css";

const clamp = (value: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 5) =>
  Math.abs(value) < 0.0000001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const buildSequence = (seed: number, m: number, b: number, steps: number) => {
  const values = [seed];
  for (let index = 0; index < steps; index += 1)
    values.push(m * values[index] + b);
  return values;
};

function SequenceGraph({
  values,
  selected,
  onSelected,
}: {
  values: number[];
  selected: number;
  onSelected: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false),
    count = Math.max(1, values.length - 1),
    minimum = Math.min(0, ...values),
    maximum = Math.max(1, ...values),
    padding = Math.max(1, (maximum - minimum) * 0.12),
    yMin = minimum - padding,
    yMax = maximum + padding,
    px = (index: number) => 45 + (index / count) * 455,
    py = (value: number) => 265 - ((value - yMin) / (yMax - yMin)) * 225,
    path = values
      .map((value, index) => `${index ? "L" : "M"}${px(index)},${py(value)}`)
      .join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect(),
      index = Math.round(
        ((((event.clientX - box.left) / box.width) * 520 - 45) / 455) * count,
      );
    onSelected(clamp(index, 0, count, 1));
  };
  return (
    <svg
      ref={svg}
      className="rec155-sequence-graph"
      viewBox="0 0 520 285"
      role="img"
      aria-label="Recursive sequence values by term"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="rec155-grid"
          width="57"
          height="45"
          patternUnits="userSpaceOnUse"
        >
          <path d="M57 0H0V45" fill="none" stroke="#dfe7ef" />
        </pattern>
        <marker
          id="rec155-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#293953" />
        </marker>
      </defs>
      <rect x="45" y="20" width="455" height="245" fill="#fff" />
      <rect x="45" y="20" width="455" height="245" fill="url(#rec155-grid)" />
      <line
        x1="45"
        x2="505"
        y1={py(0)}
        y2={py(0)}
        className="rec155-axis"
        markerEnd="url(#rec155-axis-arrow)"
      />
      <line
        x1="45"
        x2="45"
        y1="265"
        y2="15"
        className="rec155-axis"
        markerEnd="url(#rec155-axis-arrow)"
      />
      <text x="510" y="275" className="rec155-axis-name">
        n
      </text>
      <text x="24" y="18" className="rec155-axis-name">
        aₙ
      </text>
      <path d={path} className="rec155-sequence-line" />
      {values.map((value, index) => (
        <g key={`${index}-${value}`}>
          <line
            x1={px(index)}
            x2={px(index)}
            y1={py(0)}
            y2={py(value)}
            className="rec155-stem"
          />
          <circle
            cx={px(index)}
            cy={py(value)}
            r={index === selected ? 8 : 6}
            className={index === selected ? "selected" : ""}
          />
          <text
            x={px(index)}
            y={Math.max(18, py(value) - 12)}
            textAnchor="middle"
            className={index === selected ? "selected" : ""}
          >
            {tidy(value)}
          </text>
          <text x={px(index)} y="280" textAnchor="middle">
            {index}
          </text>
        </g>
      ))}
      <circle
        cx={px(selected)}
        cy={py(values[selected])}
        r="11"
        fill="transparent"
        role="slider"
        tabIndex={0}
        aria-label="Drag recursive term probe"
        aria-valuemin="0"
        aria-valuemax={count}
        aria-valuenow={selected}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          onSelected(
            clamp(
              selected + (event.key === "ArrowRight" ? 1 : -1),
              0,
              count,
              1,
            ),
          );
        }}
      />
    </svg>
  );
}

function Cobweb({ seed, m, b }: { seed: number; m: number; b: number }) {
  const fixed = Math.abs(1 - m) < 0.00001 ? null : b / (1 - m),
    values = buildSequence(seed, m, b, 5),
    all = [0, 10, ...values, ...(fixed === null ? [] : [fixed])],
    min = Math.min(...all),
    max = Math.max(...all),
    pad = Math.max(1, (max - min) * 0.08),
    lo = min - pad,
    hi = max + pad,
    px = (value: number) => 32 + ((value - lo) / (hi - lo)) * 210,
    py = (value: number) => 156 - ((value - lo) / (hi - lo)) * 130;
  let current = seed;
  const points: [number, number][] = [[current, current]];
  for (let index = 0; index < 4; index += 1) {
    const next = m * current + b;
    points.push([current, next], [next, next]);
    current = next;
  }
  const cobweb = points
    .map(([x, y], index) => `${index ? "L" : "M"}${px(x)},${py(y)}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 270 175"
      className="rec155-cobweb"
      role="img"
      aria-label="Cobweb iteration between recurrence line and identity"
    >
      <line x1={px(lo)} x2={px(hi)} y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1={py(lo)} y2={py(hi)} className="axis" />
      <line
        x1={px(lo)}
        x2={px(hi)}
        y1={py(lo)}
        y2={py(hi)}
        className="identity"
      />
      <line
        x1={px(lo)}
        x2={px(hi)}
        y1={py(m * lo + b)}
        y2={py(m * hi + b)}
        className="rule"
      />
      <path d={cobweb} className="web" />
      {points.map(([x, y], index) => (
        <circle key={index} cx={px(x)} cy={py(y)} r="3" />
      ))}
      <text x={px(hi) - 60} y={py(m * hi + b) - 6}>
        y = {tidy(m, 2)}x {b >= 0 ? "+" : "−"} {tidy(Math.abs(b), 2)}
      </text>
      <text x={px(hi) - 35} y={py(hi) + 20}>
        y = x
      </text>
    </svg>
  );
}

export default function RecursiveFunctionsTargetLesson155({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m, setM] = useState(1.4),
    [seed, setSeed] = useState(1),
    [addOn, setAddOn] = useState(0.5),
    [steps, setSteps] = useState(6),
    [selected, setSelected] = useState(6);
  const act = () => onInteraction(),
    values = buildSequence(seed, m, addOn, steps),
    current = values[selected] ?? values[values.length - 1],
    next = m * values[values.length - 1] + addOn,
    fixed = Math.abs(1 - m) < 0.00001 ? null : addOn / (1 - m),
    reset = () => {
      setM(1.4);
      setSeed(1);
      setAddOn(0.5);
      setSteps(6);
      setSelected(6);
      act();
    };
  useEffect(() => {
    setM(1.4);
    setSeed(1);
    setAddOn(0.5);
    setSteps(6);
    setSelected(6);
  }, [resetToken]);
  const updateSteps = (value: number) => {
      const nextSteps = clamp(value, 1, 20, 1);
      setSteps(nextSteps);
      setSelected((currentIndex) => Math.min(currentIndex, nextSteps));
      act();
    },
    updateSelected = (value: number) => {
      setSelected(clamp(value, 0, steps, 1));
      act();
    };
  return (
    <div
      className="rec155-page"
      data-testid="graph-mockup-0212"
      data-dedicated-lesson="155"
      data-object-model="editable-affine-recurrence-growth-seed-add-on-steps-pointer-keyboard-draggable-term-probe-generated-sequence-table-graph-next-preview-cobweb-and-exact-fixed-point"
      data-m={m}
      data-seed={seed}
      data-add-on={addOn}
      data-steps={steps}
      data-selected={selected}
      data-current={current}
      data-next={next}
      data-fixed={fixed === null ? "none" : fixed}
      data-sequence={values.join(",")}
    >
      <main className="rec155-surface">
        <header className="rec155-header">
          <div>
            <h1>Recursive Functions</h1>
            <p>Generate iterative values.</p>
          </div>
          <span>a₀ = {tidy(seed)}</span>
          <span>
            aₙ₊₁ = {tidy(m, 2)}aₙ {addOn >= 0 ? "+" : "−"}{" "}
            {tidy(Math.abs(addOn), 2)}
          </span>
        </header>
        <section className="rec155-top">
          <div className="rec155-left">
            <section className="rec155-pipeline">
              <h2>Build one step at a time</h2>
              <div>
                <span>
                  <small>Previous term</small>aₙ
                </span>
                <b>→</b>
                <span className="operation">
                  × {tidy(m, 2)}
                  <small>multiply by {tidy(m, 2)}</small>
                </span>
                <b>→</b>
                <span className="operation">
                  {addOn >= 0 ? "+" : "−"} {tidy(Math.abs(addOn), 2)}
                  <small>
                    {addOn >= 0 ? "add" : "subtract"} {tidy(Math.abs(addOn), 2)}
                  </small>
                </span>
                <b>→</b>
                <span>
                  <small>Next term</small>aₙ₊₁
                </span>
              </div>
            </section>
            <section className="rec155-iteration">
              <h2>Iterative sequence</h2>
              <div className="rec155-iteration-grid">
                <div className="rec155-table">
                  <header>
                    <b>n</b>
                    <b>aₙ</b>
                    <b>Step</b>
                  </header>
                  {values.map((value, index) => (
                    <button
                      type="button"
                      className={selected === index ? "active" : ""}
                      key={index}
                      onClick={() => updateSelected(index)}
                    >
                      <span>{index}</span>
                      <span>{value.toFixed(5)}</span>
                      <span>
                        {index === 0
                          ? "Seed"
                          : `×${tidy(m, 2)} ${addOn >= 0 ? "+" : "−"}${tidy(Math.abs(addOn), 2)}`}
                      </span>
                    </button>
                  ))}
                  <p>Current step: n = {selected}</p>
                </div>
                <div className="rec155-chart">
                  <h3>Sequence values (aₙ vs n)</h3>
                  <SequenceGraph
                    values={values}
                    selected={selected}
                    onSelected={updateSelected}
                  />
                </div>
              </div>
            </section>
          </div>
          <aside className="rec155-controls">
            <header>
              <h2>Parameters</h2>
              <button type="button" onClick={reset}>
                <RefreshCcw size={15} />
                Reset
              </button>
            </header>
            <label>
              Growth factor (m)
              <div>
                <input
                  aria-label="Recursive growth factor"
                  type="range"
                  min=".5"
                  max="2.5"
                  step=".1"
                  value={m}
                  onChange={(event) => {
                    setM(Number(event.target.value));
                    act();
                  }}
                />
                <output>{tidy(m, 2)}</output>
              </div>
              <small>
                0.5 <span>2.5</span>
              </small>
            </label>
            <label>
              Starting value (a₀)
              <div>
                <input
                  aria-label="Recursive starting value"
                  type="range"
                  min="-5"
                  max="5"
                  step=".1"
                  value={seed}
                  onChange={(event) => {
                    setSeed(Number(event.target.value));
                    act();
                  }}
                />
                <output>{tidy(seed, 2)}</output>
              </div>
              <small>
                -5 <span>5</span>
              </small>
            </label>
            <label>
              Add-on (b)
              <div>
                <input
                  aria-label="Recursive add on"
                  type="range"
                  min="-2"
                  max="2"
                  step=".1"
                  value={addOn}
                  onChange={(event) => {
                    setAddOn(Number(event.target.value));
                    act();
                  }}
                />
                <output>{tidy(addOn, 2)}</output>
              </div>
              <small>
                -2 <span>2</span>
              </small>
            </label>
            <label>
              Number of steps (N)
              <div>
                <input
                  aria-label="Recursive number of steps"
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={steps}
                  onChange={(event) => updateSteps(Number(event.target.value))}
                />
                <output>{steps}</output>
              </div>
              <small>
                1 <span>20</span>
              </small>
            </label>
            <div className="rec155-preview">
              <h3>Next term preview</h3>
              <p>
                a<sub>{steps + 1}</sub> = {tidy(m, 2)} × {tidy(values[steps])}{" "}
                {addOn >= 0 ? "+" : "−"} {tidy(Math.abs(addOn), 2)}
              </p>
              <strong>{tidy(next)}</strong>
            </div>
          </aside>
        </section>
        <section className="rec155-bottom">
          <article>
            <h2>Seed value</h2>
            <div>
              <i>🌱</i>
              <p>
                The seed value a₀ is the starting point of the recursion. Change
                it to explore different sequences.
              </p>
            </div>
            <strong>a₀ = {tidy(seed)}</strong>
          </article>
          <article>
            <h2>Recursive rule</h2>
            <div>
              <i>⟳</i>
              <p>
                Each term is computed from the previous term using
                <br />
                aₙ₊₁ = {tidy(m, 2)}aₙ {addOn >= 0 ? "+" : "−"}{" "}
                {tidy(Math.abs(addOn), 2)}.
              </p>
            </div>
          </article>
          <article className="rec155-cobweb-card">
            <h2>
              Cobweb view (y = {tidy(m, 2)}x {addOn >= 0 ? "+" : "−"}{" "}
              {tidy(Math.abs(addOn), 2)} vs y = x)
            </h2>
            <div>
              <Cobweb seed={seed} m={m} b={addOn} />
              <p>
                The cobweb shows how the value moves between the recurrence line
                and y = x.
                <br />
                <br />
                {fixed === null ? (
                  "Parallel rules have no finite fixed point."
                ) : (
                  <>The exact fixed point is a = {tidy(fixed)}.</>
                )}
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
