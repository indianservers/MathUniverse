import {
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SkipForward,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./AccumulationFunctionsTargetLesson322.css";

const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v)),
  clean = (v: number) => Number(v.toFixed(8));
const f = (t: number) => 2 + Math.sin(t),
  A = (x: number) => 2 * x - Math.cos(x) + 1;
const midpoint = (x: number, n: number, absolute: boolean) => {
  const a = 0,
    dx = (x - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const value = f(a + (i + 0.5) * dx);
    sum += (absolute ? Math.abs(value) : value) * dx;
  }
  return sum;
};
const options = [
  "(0, π)",
  "(π, 2π)",
  "(2π, 3π)",
  "(3π, 4π)",
  "A is always increasing",
];

export default function AccumulationFunctionsTargetLesson322({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(3.6),
    [n, setN] = useState(12),
    [mode, setMode] = useState<"signed" | "absolute">("signed"),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState("Interact"),
    [selected, setSelected] = useState<number[]>([]),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const value = f(x),
    area = A(x),
    approx = midpoint(x, n, mode === "absolute"),
    error = Math.abs(area - approx),
    h = 0.001,
    numerical = (A(x + h) - A(x - h)) / (2 * h);
  const reset = () => {
    setX(3.6);
    setN(12);
    setMode("signed");
    setPlaying(false);
    setTab("Interact");
    setSelected([]);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setX((v) => (v >= 3 * Math.PI ? 0 : Math.min(3 * Math.PI, v + 0.08))),
      90,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const move = (value: number) =>
    act(() => {
      setX(clamp(value, -2 * Math.PI, 3 * Math.PI));
      setResult("");
    });
  const toggle = (index: number) =>
    act(() => {
      setSelected((v) =>
        v.includes(index) ? v.filter((i) => i !== index) : [...v, index],
      );
      setResult("");
    });
  const check = () =>
    act(() =>
      setResult(
        selected.length === 1 && selected[0] === 4 ? "correct" : "incorrect",
      ),
    );
  return (
    <section
      className="acc322-page"
      data-testid="calculus-mockup-0401"
      data-object-model="linked-integrand-accumulation-function-generated-midpoint-rectangles-draggable-x-animation-ftc-derivative-prediction"
      data-x={clean(x)}
      data-n={n}
      data-mode={mode}
      data-f={clean(value)}
      data-area={clean(area)}
      data-approx={clean(approx)}
      data-error={clean(error)}
      data-numerical={clean(numerical)}
      data-playing={playing}
      data-tab={tab}
      data-selection={selected.join(",")}
      data-result={result}
      data-actions={actions}
    >
      <header className="acc322-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Accumulation Functions</h1>
        <p>Area becomes a function.</p>
        <div>
          {[
            "♙ Advanced",
            "⌁ Integral View",
            "▣ Signed Area",
            `▤ ${n} rectangles`,
            "◷ 6-10 min",
          ].map((v) => (
            <i key={v}>{v}</i>
          ))}
        </div>
        <button
          onClick={() =>
            act(() => void navigator.clipboard?.writeText(location.href))
          }
        >
          <Share2 />
          Share
        </button>
      </header>
      <nav className="acc322-tabs">
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
      <section className="acc322-top">
        <h2>Move x to accumulate signed area</h2>
        <p>
          <b>Top:</b> f(t)=2+sin(t)
        </p>
        <IntegrandGraph x={x} n={n} mode={mode} onX={move} />
        <div className="acc322-controls">
          <strong>x = {x.toFixed(2)}</strong>
          <span>−2π</span>
          <input
            aria-label="Accumulation endpoint"
            type="range"
            min={-2 * Math.PI}
            max={3 * Math.PI}
            step=".01"
            value={x}
            onChange={(e) => move(Number(e.target.value))}
          />
          <span>3π</span>
          <output>{x.toFixed(2)}</output>
          <button
            aria-label={playing ? "Pause accumulation" : "Play accumulation"}
            onClick={() => act(() => setPlaying((v) => !v))}
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <button aria-label="Step accumulation" onClick={() => move(x + 0.25)}>
            <SkipForward />
          </button>
          <button
            aria-label="Reset accumulation"
            onClick={() =>
              act(() => {
                setPlaying(false);
                setX(0);
              })
            }
          >
            <RotateCcw />
          </button>
          <label>
            Rectangles
            <select
              aria-label="Accumulation rectangles"
              value={n}
              onChange={(e) => act(() => setN(Number(e.target.value)))}
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
            </select>
          </label>
          <label>
            Area
            <select
              aria-label="Accumulation area mode"
              value={mode}
              onChange={(e) =>
                act(() => setMode(e.target.value as "signed" | "absolute"))
              }
            >
              <option value="signed">Signed</option>
              <option value="absolute">Absolute</option>
            </select>
          </label>
        </div>
      </section>
      <section className="acc322-bottom">
        <h2>
          <b>Bottom:</b> A(x)=∫₀ˣf(t)dt
        </h2>
        <AccumulationGraph x={x} onX={move} />
      </section>
      <section className="acc322-metrics">
        <article>
          <b>f(x)</b>
          <strong>{value.toFixed(3)}</strong>
          <span>=2+sin({x.toFixed(2)})</span>
        </article>
        <article>
          <b>A(x)</b>
          <strong>{area.toFixed(3)}</strong>
          <span>=∫₀ˣf(t)dt</span>
        </article>
        <article>
          <b>ΔA / Δx</b>
          <strong>{numerical.toFixed(3)}</strong>
          <span>numerical derivative</span>
        </article>
        <article>
          <b>Insight</b>
          <strong>A′(x)=f(x)</strong>
          <span>Fundamental Theorem of Calculus</span>
        </article>
      </section>
      <section className="acc322-learning">
        <article>
          <h3>Worked Example</h3>
          <p>Let f(t)=2+sin(t), a=0.</p>
          <p>Find A(x)=∫₀ˣf(t)dt.</p>
          <b>Solution</b>
          <strong>
            A(x)=∫₀ˣ(2+sin t)dt
            <br />
            =[2t−cos t]₀ˣ
            <br />
            =2x−cos x+1
          </strong>
          <output>
            Check: A′(x)=2+sin x=f(x) <CheckCircle2 />
          </output>
        </article>
        <article>
          <h3>Predict before you drag</h3>
          <p>
            For f(t)=2+sin t and A(x)=∫₀ˣf(t)dt, predict where A increases and
            decreases.
          </p>
          <p>Select the mathematically correct statement.</p>
          {options.map((label, index) => (
            <label
              key={label}
              className={selected.includes(index) ? "selected" : ""}
            >
              <input
                type="checkbox"
                aria-label={`Accumulation prediction ${label}`}
                checked={selected.includes(index)}
                onChange={() => toggle(index)}
              />
              <span>{String.fromCharCode(65 + index)}.</span>
              {label}
            </label>
          ))}
          <button onClick={check}>Check prediction</button>
          <output className={result}>
            {result === "correct"
              ? "Correct: f(t)≥1, so A is always increasing."
              : result === "incorrect"
                ? "Use A′(x)=f(x)=2+sin(x), which is always positive."
                : "Drag x above to test your prediction."}
          </output>
        </article>
      </section>
    </section>
  );
}

function IntegrandGraph({
  x,
  n,
  mode,
  onX,
}: {
  x: number;
  n: number;
  mode: "signed" | "absolute";
  onX: (v: number) => void;
}) {
  const w = 690,
    h = 292,
    p = 38,
    xmin = -2 * Math.PI,
    xmax = 3 * Math.PI,
    sx = (v: number) => p + ((v - xmin) / (xmax - xmin)) * (w - 2 * p),
    sy = (v: number) => h - p - ((v + 1) / 4.5) * (h - 2 * p);
  const curve = Array.from({ length: 241 }, (_, i) => {
    const t = xmin + (i / 240) * (xmax - xmin);
    return `${i ? "L" : "M"}${sx(t)},${sy(f(t))}`;
  }).join(" ");
  const lo = Math.min(0, x),
    hi = Math.max(0, x),
    samples = Array.from({ length: 101 }, (_, i) => lo + (i / 100) * (hi - lo)),
    area = `M${sx(lo)},${sy(0)}${samples.map((t) => `L${sx(t)},${sy(f(t))}`).join("")}L${sx(hi)},${sy(0)}Z`,
    dx = (x - 0) / n;
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (q: PointerEvent) =>
      onX(xmin + ((q.clientX - box.left) / box.width) * (xmax - xmin));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="acc322-integrand" viewBox={`0 0 ${w} ${h}`}>
      <Grid sx={sx} sy={sy} />
      <path className={x >= 0 ? "area positive" : "area negative"} d={area} />
      {Array.from({ length: n }, (_, i) => {
        const left = i * dx,
          mid = left + dx / 2,
          height = f(mid);
        return (
          <rect
            className="rectangle"
            key={i}
            x={Math.min(sx(left), sx(left + dx))}
            y={sy(mode === "absolute" ? Math.abs(height) : height)}
            width={Math.max(1, Math.abs(sx(left + dx) - sx(left)))}
            height={Math.abs(sy(0) - sy(height))}
          />
        );
      })}
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
      <path className="curve" d={curve} />
      <line className="probe" x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(f(x))} />
      <circle
        data-drag="accumulation-x"
        className="drag"
        cx={sx(x)}
        cy={sy(f(x))}
        r="7"
        onPointerDown={drag}
      />
      <text className="formula" x={w - 190} y="62">
        f(t)=2+sin(t)
      </text>
      <text className="area-label" x={w - 190} y="145">
        A(x)=∫₀ˣf(t)dt
      </text>
      <text className="x-label" x={sx(x)} y={h - 9}>
        x
      </text>
      <text x={sx(0) + 7} y={h - 9}>
        a=0
      </text>
    </svg>
  );
}
function AccumulationGraph({
  x,
  onX,
}: {
  x: number;
  onX: (v: number) => void;
}) {
  const w = 690,
    h = 270,
    p = 38,
    xmin = -2 * Math.PI,
    xmax = 3 * Math.PI,
    ymin = -14,
    ymax = 21,
    sx = (v: number) => p + ((v - xmin) / (xmax - xmin)) * (w - 2 * p),
    sy = (v: number) => h - p - ((v - ymin) / (ymax - ymin)) * (h - 2 * p),
    curve = Array.from({ length: 241 }, (_, i) => {
      const t = xmin + (i / 240) * (xmax - xmin);
      return `${i ? "L" : "M"}${sx(t)},${sy(A(t))}`;
    }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (q: PointerEvent) =>
      onX(xmin + ((q.clientX - box.left) / box.width) * (xmax - xmin));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const slope = f(x),
    span = 1.1;
  return (
    <svg className="acc322-accum" viewBox={`0 0 ${w} ${h}`}>
      {[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI, 3 * Math.PI].map(
        (v, index) => (
          <g className="tick" key={`x${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={p} y2={h - p} />
            <text x={sx(v)} y={sy(0) + 17}>
              {index === 0
                ? "−2π"
                : index === 1
                  ? "−π"
                  : index === 2
                    ? "0"
                    : index === 3
                      ? "π"
                      : `${index - 2}π`}
            </text>
          </g>
        ),
      )}
      {[-10, 0, 10, 20].map((v) => (
        <g className="tick" key={`y${v}`}>
          <line x1={p} x2={w - p} y1={sy(v)} y2={sy(v)} />
          <text x={p - 10} y={sy(v) + 3}>
            {v}
          </text>
        </g>
      ))}
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
      <path className="curve" d={curve} />
      <line className="probe" x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(A(x))} />
      <line
        className="tangent"
        x1={sx(x - span)}
        y1={sy(A(x) - slope * span)}
        x2={sx(x + span)}
        y2={sy(A(x) + slope * span)}
      />
      <circle
        data-drag="accumulation-bottom-x"
        className="drag"
        cx={sx(x)}
        cy={sy(A(x))}
        r="7"
        onPointerDown={drag}
      />
      <text className="slope-label" x={sx(x) + 30} y={sy(A(x)) - 35}>
        Slope=f(x)={slope.toFixed(3)}
      </text>
      <text className="formula" x={w - 95} y="62">
        A(x)
      </text>
    </svg>
  );
}
function Grid({
  sx,
  sy,
}: {
  sx: (v: number) => number;
  sy: (v: number) => number;
}) {
  return (
    <>
      {[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI, 3 * Math.PI].map(
        (v, index) => (
          <g key={`x${v}`}>
            <line className="grid" x1={sx(v)} x2={sx(v)} y1="25" y2="255" />
            <text className="tick-label" x={sx(v)} y={sy(0) + 16}>
              {index === 0
                ? "−2π"
                : index === 1
                  ? "−π"
                  : index === 2
                    ? "0"
                    : index === 3
                      ? "π"
                      : `${index - 2}π`}
            </text>
          </g>
        ),
      )}
      {[-1, 0, 1, 2, 3].map((v) => (
        <g key={`y${v}`}>
          <line className="grid" x1="25" x2="665" y1={sy(v)} y2={sy(v)} />
          <text className="tick-label y" x={sx(0) - 10} y={sy(v) + 3}>
            {v}
          </text>
        </g>
      ))}
    </>
  );
}
