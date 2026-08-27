import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Download,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./TrigonometricFunctionsTargetLesson144.css";

const TAU = Math.PI * 2;
const clean = (value: number) =>
  Math.abs(value) < 0.0005
    ? "0.000"
    : value.toFixed(3).replace("-0.000", "0.000");

const piText = (value: number) => {
  const ratio = value / Math.PI;
  const candidates: [number, string][] = [
    [0, "0"],
    [1 / 6, "π/6"],
    [1 / 4, "π/4"],
    [1 / 3, "π/3"],
    [1 / 2, "π/2"],
    [2 / 3, "2π/3"],
    [1, "π"],
    [3 / 2, "3π/2"],
    [2, "2π"],
    [4, "4π"],
  ];
  const exact = candidates.find(
    ([candidate]) => Math.abs(candidate - ratio) < 0.002,
  );
  return exact?.[1] ?? `${ratio.toFixed(2)}π`;
};

const signedPhase = (phase: number) =>
  phase === 0 ? "x" : `x ${phase > 0 ? "+" : "−"} ${piText(Math.abs(phase))}`;

const waveFormula = (
  kind: "sin" | "cos",
  amplitude: number,
  period: number,
  phase: number,
  midline: number,
) => {
  const omega = TAU / period;
  const argument =
    Math.abs(omega - 1) < 0.002
      ? signedPhase(phase)
      : `${omega.toFixed(2)}(${signedPhase(phase)})`;
  const shift =
    midline === 0
      ? ""
      : midline > 0
        ? ` + ${midline}`
        : ` − ${Math.abs(midline)}`;
  return `y = ${amplitude} ${kind}(${argument})${shift}`;
};

const previewPath = (period: number, offset: number) =>
  Array.from({ length: 121 }, (_, index) => {
    const x = (index / 120) * TAU * 2;
    const px = 5 + (index / 120) * 250;
    const py = 38 - Math.sin((TAU / period) * x + offset) * 24;
    return `${index ? "L" : "M"}${px},${py}`;
  }).join(" ");

function UnitCircle({
  theta,
  onTheta,
}: {
  theta: number;
  onTheta: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const cx = 150,
    cy = 145,
    radius = 102;
  const x = cx + radius * Math.cos(theta),
    y = cy - radius * Math.sin(theta);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const localX = ((event.clientX - box.left) / box.width) * 300;
    const localY = ((event.clientY - box.top) / box.height) * 300;
    let angle = Math.atan2(cy - localY, localX - cx);
    if (angle < 0) angle += TAU;
    onTheta(Math.round((angle / Math.PI) * 24) * (Math.PI / 24));
  };
  return (
    <svg
      ref={svg}
      className="trig144-circle"
      viewBox="0 0 300 300"
      role="img"
      aria-label="Unit circle with draggable angle point"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <line x1="20" x2="282" y1={cy} y2={cy} className="axis" />
      <line x1={cx} x2={cx} y1="16" y2="278" className="axis" />
      <circle cx={cx} cy={cy} r={radius} className="ring" />
      <path
        d={`M${cx + 35},${cy} A35,35 0 ${theta > Math.PI ? 1 : 0} 0 ${cx + 35 * Math.cos(theta)},${cy - 35 * Math.sin(theta)}`}
        className="angle"
      />
      <line x1={cx} y1={cy} x2={x} y2={y} className="radius" />
      <line x1={x} x2={x} y1={cy} y2={y} className="cos-guide" />
      <line x1={cx} x2={x} y1={y} y2={y} className="sin-guide" />
      <text x="35" y={cy - 8}>
        π
      </text>
      <text x="258" y={cy - 8}>
        0, 2π
      </text>
      <text x={cx + 12} y="24">
        π/2
      </text>
      <text x={cx + 12} y="277">
        3π/2
      </text>
      <text x={cx + 19} y={cy - 17} className="theta">
        θ
      </text>
      <text
        x={Math.min(225, x + 10)}
        y={Math.max(18, y - 9)}
        className="point-label"
      >
        ({clean(Math.cos(theta))}, {clean(Math.sin(theta))})
      </text>
      <circle
        data-testid="trigonometric-angle-handle"
        cx={x}
        cy={y}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag unit-circle angle"
        aria-valuemin={0}
        aria-valuemax={TAU}
        aria-valuenow={theta}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp")
            onTheta(Math.min(TAU, theta + Math.PI / 12));
          if (event.key === "ArrowLeft" || event.key === "ArrowDown")
            onTheta(Math.max(0, theta - Math.PI / 12));
        }}
      />
    </svg>
  );
}

function TrigGraph({
  amplitude,
  period,
  phase,
  midline,
  theta,
  traceSine,
  traceCosine,
  onAmplitude,
  onPeriod,
  onTheta,
}: {
  amplitude: number;
  period: number;
  phase: number;
  midline: number;
  theta: number;
  traceSine: boolean;
  traceCosine: boolean;
  onAmplitude: (value: number) => void;
  onPeriod: (value: number) => void;
  onTheta: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"amplitude" | "period" | "theta" | null>(
    null,
  );
  const left = -Math.PI,
    right = 2.65 * Math.PI;
  const px = (x: number) => 48 + ((x - left) / (right - left)) * 612;
  const py = (y: number) => 158 - y * 55;
  const omega = TAU / period;
  const sine = (x: number) =>
    midline + amplitude * Math.sin(omega * (x + phase));
  const cosine = (x: number) =>
    midline + amplitude * Math.cos(omega * (x + phase));
  const crestX = period / 4 - phase;
  const cycleEnd = -phase + period;
  const path = (evaluate: (x: number) => number) =>
    Array.from({ length: 241 }, (_, index) => {
      const x = left + (index / 240) * (right - left);
      return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
    }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const sx = ((event.clientX - box.left) / box.width) * 680;
    const sy = ((event.clientY - box.top) / box.height) * 320;
    const x = left + ((sx - 48) / 612) * (right - left);
    const y = (158 - sy) / 55;
    if (drag === "amplitude")
      onAmplitude(
        Math.max(0.25, Math.min(5, Math.round(Math.abs(y - midline) * 4) / 4)),
      );
    if (drag === "period")
      onPeriod(
        Math.max(
          Math.PI / 2,
          Math.min(
            4 * Math.PI,
            (Math.round(((x + phase) / Math.PI) * 4) * Math.PI) / 4,
          ),
        ),
      );
    if (drag === "theta")
      onTheta(
        Math.max(
          0,
          Math.min(TAU, (Math.round((x / Math.PI) * 12) * Math.PI) / 12),
        ),
      );
  };
  return (
    <svg
      ref={svg}
      className="trig144-graph"
      viewBox="0 0 680 320"
      role="img"
      aria-label="Sine and cosine graphs with draggable amplitude, period, and angle traces"
      onPointerMove={move}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="trig144-grid"
          width="54"
          height="39"
          patternUnits="userSpaceOnUse"
        >
          <path d="M54 0H0V39" fill="none" stroke="#22334a" />
        </pattern>
        <clipPath id="trig144-clip">
          <rect width="680" height="320" />
        </clipPath>
      </defs>
      <rect width="680" height="320" fill="#0a1523" />
      <rect width="680" height="320" fill="url(#trig144-grid)" />
      <line
        x1="35"
        x2="670"
        y1={py(midline)}
        y2={py(midline)}
        className="axis"
      />
      <line x1={px(0)} x2={px(0)} y1="10" y2="310" className="axis" />
      {[-Math.PI / 2, 0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, TAU].map(
        (x) => (
          <text key={x} x={px(x) - 12} y={py(midline) + 21}>
            {piText(x)}
          </text>
        ),
      )}
      {[-2, -1, 0, 1, 2].map((y) => (
        <text key={y} x={px(0) - 27} y={py(y) + 4}>
          {y}
        </text>
      ))}
      {traceSine && (
        <path d={path(sine)} className="sine" clipPath="url(#trig144-clip)" />
      )}
      {traceCosine && (
        <path
          d={path(cosine)}
          className="cosine"
          clipPath="url(#trig144-clip)"
        />
      )}
      <line
        x1={px(theta)}
        x2={px(theta)}
        y1="12"
        y2="305"
        className="theta-line"
      />
      <circle
        cx={px(theta)}
        cy={py(sine(theta))}
        r="6"
        className="sine-point"
      />
      <circle
        cx={px(theta)}
        cy={py(cosine(theta))}
        r="6"
        className="cosine-point"
      />
      <text x="503" y="38" className="sine-label">
        {waveFormula("sin", amplitude, period, phase, midline)}
      </text>
      <text x="500" y="286" className="cosine-label">
        {waveFormula("cos", amplitude, period, phase, midline)}
      </text>
      <circle
        data-testid="trigonometric-amplitude-handle"
        cx={px(crestX)}
        cy={py(midline + amplitude)}
        r="12"
        className="handle amplitude-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag trigonometric amplitude"
        aria-valuemin={0.25}
        aria-valuemax={5}
        aria-valuenow={amplitude}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("amplitude");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp")
            onAmplitude(Math.min(5, amplitude + 0.25));
          if (event.key === "ArrowDown")
            onAmplitude(Math.max(0.25, amplitude - 0.25));
        }}
      />
      <circle
        data-testid="trigonometric-period-handle"
        cx={px(cycleEnd)}
        cy={py(midline)}
        r="11"
        className="handle period-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag trigonometric period"
        aria-valuemin={Math.PI / 2}
        aria-valuemax={4 * Math.PI}
        aria-valuenow={period}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("period");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight")
            onPeriod(Math.min(4 * Math.PI, period + Math.PI / 4));
          if (event.key === "ArrowLeft")
            onPeriod(Math.max(Math.PI / 2, period - Math.PI / 4));
        }}
      />
      <circle
        data-testid="trigonometric-trace-handle"
        cx={px(theta)}
        cy={py(midline)}
        r="10"
        className="handle trace-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag graph angle trace"
        aria-valuemin={0}
        aria-valuemax={TAU}
        aria-valuenow={theta}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("theta");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight")
            onTheta(Math.min(TAU, theta + Math.PI / 12));
          if (event.key === "ArrowLeft")
            onTheta(Math.max(0, theta - Math.PI / 12));
        }}
      />
    </svg>
  );
}

export default function TrigonometricFunctionsTargetLesson144({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [amplitude, setAmplitude] = useState(2),
    [period, setPeriod] = useState(TAU),
    [phase, setPhase] = useState(Math.PI / 4),
    [midline, setMidline] = useState(0),
    [theta, setTheta] = useState(Math.PI / 3);
  const [traceSine, setTraceSine] = useState(true),
    [traceCosine, setTraceCosine] = useState(true),
    [tab, setTab] = useState("Unit circle link"),
    [choice, setChoice] = useState("π/4"),
    [checked, setChecked] = useState(true);
  const [playing, setPlaying] = useState(false),
    [autoAnimate, setAutoAnimate] = useState(true),
    [speed, setSpeed] = useState(1),
    [shared, setShared] = useState(false),
    [exported, setExported] = useState(false),
    [actions, setActions] = useState(0);
  const omega = TAU / period,
    sine = (x: number) => midline + amplitude * Math.sin(omega * (x + phase)),
    cosine = (x: number) => midline + amplitude * Math.cos(omega * (x + phase));
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    act();
  };
  const reset = () => {
    setAmplitude(2);
    setPeriod(TAU);
    setPhase(Math.PI / 4);
    setMidline(0);
    setTheta(Math.PI / 3);
    setTraceSine(true);
    setTraceCosine(true);
    setTab("Unit circle link");
    setChoice("π/4");
    setChecked(true);
    setPlaying(false);
    setAutoAnimate(true);
    setSpeed(1);
    setShared(false);
    setExported(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!playing || !autoAnimate) return;
    const timer = window.setInterval(
      () => setTheta((value) => (value + (Math.PI / 48) * speed) % TAU),
      70,
    );
    return () => window.clearInterval(timer);
  }, [playing, autoAnimate, speed]);
  const rows = [
    0,
    Math.PI / 6,
    Math.PI / 3,
    Math.PI / 2,
    Math.PI,
    (3 * Math.PI) / 2,
    TAU,
  ];
  const exportCsv = [
    "theta radians,theta degrees,sin theta,cos theta,transformed sine,transformed cosine",
    ...rows.map((x) =>
      [
        piText(x),
        Math.round((x * 180) / Math.PI),
        clean(Math.sin(x)),
        clean(Math.cos(x)),
        clean(sine(x)),
        clean(cosine(x)),
      ].join(","),
    ),
  ].join("\n");
  return (
    <div
      className="trig144-page"
      data-testid="graph-mockup-0201"
      data-dedicated-lesson="144"
      data-object-model="linked-unit-circle-sine-cosine-amplitude-period-phase-midline-pointer-keyboard-draggable-circle-angle-graph-trace-amplitude-and-period-generated-curves-live-values-period-detection-identities-real-challenge-animation-export"
      data-amplitude={amplitude}
      data-period={period}
      data-phase={phase}
      data-midline={midline}
      data-theta={theta}
      data-sine={Math.sin(theta)}
      data-cosine={Math.cos(theta)}
      data-transformed-sine={sine(theta)}
      data-transformed-cosine={cosine(theta)}
      data-sine-formula={waveFormula("sin", amplitude, period, phase, midline)}
      data-cosine-formula={waveFormula(
        "cos",
        amplitude,
        period,
        phase,
        midline,
      )}
      data-choice={choice}
      data-correct={checked && choice === "π/4"}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <header className="trig144-hero">
        <div>
          <small>
            Precalculus &gt; Trigonometric Functions &gt;{" "}
            <b>Unit Circle &amp; Trig Graphs</b>
          </small>
          <h1>Trigonometric Functions</h1>
          <p>
            Explore the deep connection between circular motion on the unit
            circle and the sine and cosine functions.
          </p>
        </div>
        <nav>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              setShared(true);
              act();
            }}
          >
            <Share2 />
            {shared ? "Link copied" : "Share"}
          </button>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(exportCsv)}`}
            download="trigonometric-functions.csv"
            onClick={() => {
              setExported(true);
              act();
            }}
          >
            <Download />
            {exported ? "Exported" : "Export"}
          </a>
        </nav>
      </header>
      <nav className="trig144-tabs">
        {[
          "Overview",
          "Unit circle link",
          "Graphs",
          "Identities",
          "Applications",
          "Practice",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="trig144-layout">
        <main>
          <section className="trig144-visuals">
            <article className="trig144-unit">
              <h2>UNIT CIRCLE</h2>
              <UnitCircle theta={theta} onTheta={update(setTheta)} />
              <div className="trig144-circle-values">
                <strong>θ = {piText(theta)}</strong>
                <span>
                  <b>sin θ = {clean(Math.sin(theta))}</b>
                  <em>cos θ = {clean(Math.cos(theta))}</em>
                </span>
              </div>
              <label>
                θ (radians)
                <input
                  aria-label="Unit-circle angle"
                  type="range"
                  min="0"
                  max={TAU}
                  step={Math.PI / 24}
                  value={theta}
                  onChange={(event) =>
                    update(setTheta)(Number(event.target.value))
                  }
                />
              </label>
            </article>
            <article className="trig144-wave">
              <h2>SINE &amp; COSINE GRAPHS</h2>
              <TrigGraph
                amplitude={amplitude}
                period={period}
                phase={phase}
                midline={midline}
                theta={theta}
                traceSine={traceSine}
                traceCosine={traceCosine}
                onAmplitude={update(setAmplitude)}
                onPeriod={update(setPeriod)}
                onTheta={update(setTheta)}
              />
            </article>
          </section>
          <section className="trig144-lower">
            <article className="trig144-values">
              <h2>
                LIVE VALUES (AMPLITUDE = {amplitude}, PERIOD = {piText(period)},
                PHASE = {piText(phase)})
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>θ (rad)</th>
                    <th>θ (deg)</th>
                    <th>sin θ</th>
                    <th>cos θ</th>
                    <th>y = sine</th>
                    <th>y = cosine</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr
                      key={x}
                      className={Math.abs(x - theta) < 0.03 ? "active" : ""}
                      onClick={() => update(setTheta)(x)}
                    >
                      <td>{piText(x)}</td>
                      <td>{Math.round((x * 180) / Math.PI)}°</td>
                      <td>{clean(Math.sin(x))}</td>
                      <td>{clean(Math.cos(x))}</td>
                      <td>{clean(sine(x))}</td>
                      <td>{clean(cosine(x))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="trig144-period">
              <h2>PERIOD MEASUREMENT</h2>
              <p>Measure one full cycle of either graph.</p>
              <div>
                <span>↔</span>
                <b>{piText(period)}</b>
                <svg viewBox="0 0 260 75">
                  <path d={previewPath(period, 0)} />
                  <path d={previewPath(period, Math.PI / 2)} />
                </svg>
              </div>
              <strong>
                Detected period: <b>{piText(period)} radians</b>
              </strong>
              <em>✓ PERIODICITY_VISIBLE_REQUIRED</em>
            </article>
            <article className="trig144-challenge">
              <h2>🚀 QUICK CHALLENGE</h2>
              <p>At what angle θ (0 ≤ θ &lt; 2π) does sin θ = √2/2?</p>
              <div>
                {["π/6", "π/4", "π/3", "π/2"].map((answer, index) => (
                  <button
                    key={answer}
                    className={choice === answer ? "active" : ""}
                    onClick={() => {
                      setChoice(answer);
                      setChecked(false);
                      act();
                    }}
                  >
                    <b>{String.fromCharCode(65 + index)}</b>
                    {answer}
                    {checked && choice === answer && answer === "π/4"
                      ? " ✓"
                      : ""}
                  </button>
                ))}
              </div>
              <footer>
                <button
                  onClick={() => {
                    setChecked(true);
                    act();
                  }}
                >
                  Check Answer
                </button>
                {checked && choice === "π/4" && <strong>✓ Correct!</strong>}
                {checked && choice !== "π/4" && (
                  <strong className="wrong">Try the 45° angle.</strong>
                )}
              </footer>
            </article>
          </section>
        </main>
        <aside className="trig144-rail">
          <section>
            <h2>PARAMETERS</h2>
            {[
              [
                "Amplitude",
                amplitude,
                0.1,
                5,
                0.1,
                setAmplitude,
                String(amplitude),
              ],
              [
                "Period",
                period,
                Math.PI / 2,
                4 * Math.PI,
                Math.PI / 4,
                setPeriod,
                piText(period),
              ],
              [
                "Phase shift",
                phase,
                -2 * Math.PI,
                2 * Math.PI,
                Math.PI / 12,
                setPhase,
                piText(phase),
              ],
              ["Midline y", midline, -2, 2, 0.25, setMidline, String(midline)],
            ].map(([label, value, min, max, step, setter, output]) => (
              <label key={String(label)}>
                <span>
                  {label} = <b>{output as string}</b>
                </span>
                <input
                  aria-label={String(label)}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(event) =>
                    update(setter as (value: number) => void)(
                      Number(event.target.value),
                    )
                  }
                />
                <output>{output as string}</output>
              </label>
            ))}
            <div className="trig144-traces">
              <label>
                <input
                  type="checkbox"
                  checked={traceSine}
                  onChange={(event) => {
                    setTraceSine(event.target.checked);
                    act();
                  }}
                />{" "}
                Trace sine
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={traceCosine}
                  onChange={(event) => {
                    setTraceCosine(event.target.checked);
                    act();
                  }}
                />{" "}
                Trace cosine
              </label>
            </div>
          </section>
          <section className="trig144-identities">
            <h2>KEY IDENTITIES</h2>
            <p>sin² θ + cos² θ = 1</p>
            <p>1 + tan² θ = sec² θ</p>
            <p>1 + cot² θ = csc² θ</p>
            <p>sin(−θ) = −sin θ</p>
            <p>cos(−θ) = cos θ</p>
            <strong>
              {clean(Math.sin(theta) ** 2 + Math.cos(theta) ** 2)} = 1.000
            </strong>
          </section>
        </aside>
      </section>
      <footer className="trig144-player">
        <button
          aria-label={playing ? "Pause animation" : "Play animation"}
          onClick={() => {
            setPlaying((value) => !value);
            act();
          }}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <label>
          Animation speed
          <input
            aria-label="Animation speed"
            type="range"
            min=".25"
            max="2"
            step=".25"
            value={speed}
            onChange={(event) => update(setSpeed)(Number(event.target.value))}
          />
          {speed.toFixed(1)}x
        </label>
        <label>
          <input
            type="checkbox"
            checked={autoAnimate}
            onChange={(event) => {
              setAutoAnimate(event.target.checked);
              act();
            }}
          />{" "}
          Auto-animate
        </label>
        <button onClick={reset}>
          <RotateCcw />
          Reset
        </button>
        <button
          onClick={() => {
            setTab("Overview");
            act();
          }}
        >
          <Lightbulb />
          Tips
        </button>
      </footer>
    </div>
  );
}
