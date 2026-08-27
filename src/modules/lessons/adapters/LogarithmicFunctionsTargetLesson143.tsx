import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Eye, Lightbulb, RotateCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./ExponentialFunctionsTargetLesson142.css";
import "./LogarithmicFunctionsTargetLesson143.css";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

const signed = (value: number, variable = "") =>
  value === 0
    ? ""
    : value < 0
      ? ` − ${variable}${clean(Math.abs(value))}`
      : ` + ${variable}${clean(value)}`;

const equation = (a: number, b: number, h: number, k: number) =>
  `y = ${clean(a)}log_${clean(b)}(x ${h < 0 ? "+" : "−"} ${clean(Math.abs(h))})${signed(k)}`;

function LogGraph({
  a,
  b,
  h,
  k,
  onA,
  onH,
  onK,
  inverseVisible,
}: {
  a: number;
  b: number;
  h: number;
  k: number;
  onA: (value: number) => void;
  onH: (value: number) => void;
  onK: (value: number) => void;
  inverseVisible: boolean;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"asymptote" | "anchor" | "scale" | null>(
    null,
  );
  const px = (x: number) => 326 + x * 50;
  const py = (y: number) => 258 - y * 40;
  const log = (x: number) => k + a * (Math.log(x - h) / Math.log(b));
  const inverse = (x: number) => h + b ** ((x - k) / a);
  const curve = (evaluate: (x: number) => number, start: number, end: number) =>
    Array.from({ length: 180 }, (_, index) => {
      const x = start + (index / 179) * (end - start);
      return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
    }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 660 - 326) / 50;
    const y = (258 - ((event.clientY - box.top) / box.height) * 390) / 40;
    if (drag === "asymptote")
      onH(Math.max(-3, Math.min(4, Math.round(x * 4) / 4)));
    if (drag === "anchor") {
      onH(Math.max(-3, Math.min(4, Math.round((x - 1) * 4) / 4)));
      onK(Math.max(-3, Math.min(4, Math.round(y * 4) / 4)));
    }
    if (drag === "scale")
      onA(Math.max(-4, Math.min(4, Math.round((y - k) * 4) / 4)) || 0.25);
  };
  const points = [-2, -1, 0, 1, 2].map((power) => ({
    x: h + b ** power,
    y: k + a * power,
  }));
  return (
    <svg
      ref={svg}
      className="log143-graph"
      viewBox="0 0 660 390"
      role="img"
      aria-label="Logarithmic function and inverse exponential with draggable asymptote and points"
      onPointerMove={move}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="log143-grid"
          width="25"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M25 0H0V20" fill="none" stroke="#243248" strokeWidth=".7" />
        </pattern>
        <clipPath id="log143-clip">
          <rect width="660" height="390" />
        </clipPath>
      </defs>
      <rect width="660" height="390" fill="#0b1421" />
      <rect width="660" height="390" fill="url(#log143-grid)" />
      <rect width={Math.max(0, px(h))} height="390" className="forbidden" />
      <line x1="0" x2="660" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="0" y2="390" className="axis" />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((x) => (
        <text key={x} x={px(x)} y={py(0) + 19}>
          {x}
        </text>
      ))}
      {[-3, -2, -1, 1, 2, 3, 4, 5].map((y) => (
        <text key={y} x={px(0) - 20} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <line x1={px(h)} x2={px(h)} y1="0" y2="390" className="asymptote" />
      <line x1="0" x2="660" y1="390" y2="0" className="reflection" />
      <path
        d={curve(log, h + 0.015, 6.7)}
        className="log-curve"
        clipPath="url(#log143-clip)"
      />
      {inverseVisible && (
        <path
          d={curve(inverse, -3.5, 5.4)}
          className="inverse-curve"
          clipPath="url(#log143-clip)"
        />
      )}
      {points.map((point, index) => (
        <g key={index} className="log-point">
          <circle cx={px(point.x)} cy={py(point.y)} r="5" />
          {index > 1 && (
            <text x={px(point.x) + 7} y={py(point.y) - 8}>
              ({clean(point.x)}, {clean(point.y)})
            </text>
          )}
        </g>
      ))}
      <text x="70" y="136" className="domain-label">
        Domain: x &gt; {clean(h)}
      </text>
      <g className="asymptote-label">
        <rect x={px(h) - 126} y="21" width="112" height="51" rx="8" />
        <text x={px(h) - 116} y="42">
          Vertical asymptote
        </text>
        <text x={px(h) - 84} y="61">
          x = {clean(h)}
        </text>
      </g>
      <g className="reflection-label">
        <rect x="455" y="153" width="117" height="49" rx="8" />
        <text x="468" y="173">
          Reflect across
        </text>
        <text x="493" y="192">
          y = x
        </text>
      </g>
      <circle
        data-testid="logarithmic-asymptote-handle"
        cx={px(h)}
        cy={py(0)}
        r="13"
        className="handle asymptote-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag logarithmic vertical asymptote"
        aria-valuemin={-3}
        aria-valuemax={4}
        aria-valuenow={h}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("asymptote");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onH(Math.min(4, h + 0.25));
          if (event.key === "ArrowLeft") onH(Math.max(-3, h - 0.25));
        }}
      />
      <circle
        data-testid="logarithmic-anchor-handle"
        cx={px(h + 1)}
        cy={py(k)}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag logarithmic anchor point"
        aria-valuemin={-3}
        aria-valuemax={4}
        aria-valuenow={k}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("anchor");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onK(Math.min(4, k + 0.25));
          if (event.key === "ArrowDown") onK(Math.max(-3, k - 0.25));
          if (event.key === "ArrowRight") onH(Math.min(4, h + 0.25));
          if (event.key === "ArrowLeft") onH(Math.max(-3, h - 0.25));
        }}
      />
      <circle
        data-testid="logarithmic-scale-handle"
        cx={px(h + b)}
        cy={py(k + a)}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag logarithmic scale point"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(4, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(-4, a - 0.25) || 0.25);
        }}
      />
    </svg>
  );
}

export default function LogarithmicFunctionsTargetLesson143({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(2),
    [b, setB] = useState(2),
    [h, setH] = useState(1),
    [k, setK] = useState(1);
  const [tab, setTab] = useState("Explore"),
    [challenge, setChallenge] = useState(false),
    [solution, setSolution] = useState(false);
  const [checked, setChecked] = useState(false),
    [inverseVisible, setInverseVisible] = useState(true),
    [actions, setActions] = useState(0);
  const xs = [-2, -1, 0, 1, 2].map((power) => h + b ** power);
  const samples = xs.map((x) => ({
    x,
    y: k + (a * Math.log(x - h)) / Math.log(b),
  }));
  const inverse = (x: number) => h + b ** ((x - k) / a);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const update =
    (setter: (value: number) => void, nonzero = false) =>
    (value: number) => {
      setter(nonzero && value === 0 ? 0.25 : value);
      setChecked(false);
      act();
    };
  const reset = () => {
    setA(2);
    setB(2);
    setH(1);
    setK(1);
    setTab("Explore");
    setChallenge(false);
    setSolution(false);
    setChecked(false);
    setInverseVisible(true);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const targetMatched = a === -1 && b === 2 && h === -2 && k === -1;
  const loadChallenge = () => {
    setA(-1);
    setB(2);
    setH(-2);
    setK(-1);
    setChallenge(true);
    setChecked(false);
    setSolution(false);
    act();
  };
  return (
    <div
      className="exp142-page log143-page"
      data-testid="graph-mockup-0200"
      data-dedicated-lesson="143"
      data-object-model="editable-logarithmic-scale-base-horizontal-shift-vertical-shift-pointer-keyboard-draggable-asymptote-anchor-and-scale-point-generated-domain-curve-inverse-exponential-reflection-value-table-diagnostics-real-parameter-challenge"
      data-a={a}
      data-b={b}
      data-h={h}
      data-k={k}
      data-equation={equation(a, b, h, k)}
      data-domain={`x>${h}`}
      data-asymptote={`x=${h}`}
      data-target-matched={targetMatched}
      data-challenge-active={challenge}
      data-samples={samples
        .map(({ x, y }) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <header className="log143-titlebar">
        <div>
          <h1>Logarithmic Functions</h1>
          <p>
            <i>y</i> = <em>a</em> log<sub>b</sub>(<i>x − h</i>) + <span>k</span>
          </p>
        </div>
        <button
          onClick={() => {
            setInverseVisible((value) => !value);
            act();
          }}
        >
          <Eye /> {inverseVisible ? "Hide" : "Show"} inverse exponential
        </button>
        <strong>{equation(a, b, h, k)}</strong>
      </header>
      <nav className="log143-tabs">
        {[
          "Explore",
          "Key Features",
          "Transformations",
          "Inverse Relationship",
          "Examples",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              if (name === "Examples") loadChallenge();
              else act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="log143-workspace">
        <main>
          <LogGraph
            a={a}
            b={b}
            h={h}
            k={k}
            onA={update(setA, true)}
            onH={update(setH)}
            onK={update(setK)}
            inverseVisible={inverseVisible}
          />
          {!inverseVisible && (
            <div className="log143-inverse-mask">Inverse hidden</div>
          )}
          <section className="log143-table">
            <header>
              <b>VALUE TABLE</b>
              <span>Smart values</span>
            </header>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>{equation(a, b, h, k)}</th>
                  <th>inverse exponential</th>
                  <th>(x, y) on y = x</th>
                </tr>
              </thead>
              <tbody>
                {samples.map(({ x, y }) => (
                  <tr key={x}>
                    <td>{clean(x)}</td>
                    <td>{clean(y)}</td>
                    <td>{clean(inverse(x))}</td>
                    <td>
                      ({clean(y)}, {clean(x)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        <aside className="log143-rail">
          <section className="log143-parameters">
            <header>
              <b>PARAMETERS</b>
              <button onClick={reset}>
                Reset <RotateCcw />
              </button>
            </header>
            {[
              ["Base b", b, 1.25, 5, 0.25, setB],
              ["Stretch a", a, -4, 4, 0.25, setA],
              ["Shift h", h, -3, 4, 0.25, setH],
              ["Shift k", k, -3, 4, 0.25, setK],
            ].map(([label, value, min, max, step, setter]) => (
              <label key={String(label)}>
                <span>
                  {label} = <b>{clean(Number(value))}</b>
                </span>
                <input
                  aria-label={String(label)}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(event) =>
                    update(
                      setter as (value: number) => void,
                      label === "Stretch a",
                    )(Number(event.target.value))
                  }
                />
                <output>{clean(Number(value))}</output>
              </label>
            ))}
          </section>
          <section className="log143-diagnostics">
            <h3>CONCEPTUAL DIAGNOSTICS</h3>
            <p>
              <i>↗</i>
              <b>Slow growth</b>
              <span>Logarithmic functions grow slower than linear.</span>
              <strong>✓</strong>
            </p>
            <p>
              <i>∥</i>
              <b>Vertical asymptote</b>
              <span>
                The graph approaches x = {clean(h)} but never crosses.
              </span>
              <strong>✓</strong>
            </p>
            <p>
              <i>⇄</i>
              <b>Inverse reflection</b>
              <span>The inverse is exponential reflected across y = x.</span>
              <strong>✓</strong>
            </p>
            <p>
              <i>◔</i>
              <b>Domain restriction</b>
              <span>Logarithms require x − h &gt; 0.</span>
              <strong>✓</strong>
            </p>
          </section>
          <section className="log143-check">
            <h3>QUICK CHECK</h3>
            <p>What is the domain of this function?</p>
            <strong>
              x &gt; {clean(h)} <b>✓</b>
            </strong>
            <em>Correct!</em>
          </section>
        </aside>
        <section className="log143-challenge">
          <header>
            <b>CHALLENGE STEP 2 OF 4</b>
          </header>
          <p>Move the sliders to match the target function.</p>
          <strong>Target: y = −log₂(x + 2) − 1</strong>
          <p>
            <Lightbulb /> <b>Hints</b>
          </p>
          <small>
            Base 2 is greater than 1; the negative stretch reflects the graph.
            Shift left 2, down 1.
          </small>
          {checked && (
            <output>
              {targetMatched
                ? "Exact match."
                : "Keep tuning the four parameters."}
            </output>
          )}
          <footer>
            <button
              onClick={() => {
                setChecked(true);
                act();
              }}
            >
              Check Answer
            </button>
            <button
              onClick={() => {
                loadChallenge();
                setSolution(true);
              }}
            >
              Show Solution
            </button>
          </footer>
          {solution && <em>Solution loaded into the live graph.</em>}
        </section>
      </section>
    </div>
  );
}
