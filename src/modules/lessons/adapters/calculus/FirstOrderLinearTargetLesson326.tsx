import {
  Check,
  Clipboard,
  Download,
  Info,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./FirstOrderLinearTargetLesson326.css";

type Preset = "reference" | "gentle" | "decay";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));
const coefficient = (p: number, scale: number) =>
  Math.abs(p + 1) < 1e-8 ? Number.NaN : scale / (p + 1);
const constant = (p: number, y0: number, scale: number) =>
  Math.abs(p + 1) < 1e-8 ? y0 : y0 - coefficient(p, scale);
const solution = (x: number, p: number, y0: number, scale: number) => {
  if (Math.abs(p + 1) < 1e-8) return (y0 + scale * x) * Math.exp(x);
  return (
    coefficient(p, scale) * Math.exp(x) +
    constant(p, y0, scale) * Math.exp(-p * x)
  );
};
const derivative = (x: number, p: number, y0: number, scale: number) =>
  scale * Math.exp(x) - p * solution(x, p, y0, scale);
const display = (value: number) =>
  Math.abs(value - Math.round(value)) < 1e-8
    ? String(Math.round(value))
    : value.toFixed(2);

export default function FirstOrderLinearTargetLesson326({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(2);
  const [y0, setY0] = useState(1);
  const [scale, setScale] = useState(1);
  const [preset, setPreset] = useState<Preset>("reference");
  const [solutionLayer, setSolutionLayer] = useState(true);
  const [forcingLayer, setForcingLayer] = useState(true);
  const [transientLayer, setTransientLayer] = useState(true);
  const [verified, setVerified] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [actions, setActions] = useState(0);
  const a = coefficient(p, scale);
  const c = constant(p, y0, scale);
  const residual = (() => {
    const x = 0.7;
    return (
      derivative(x, p, y0, scale) +
      p * solution(x, p, y0, scale) -
      scale * Math.exp(x)
    );
  })();
  const reset = () => {
    setP(2);
    setY0(1);
    setScale(1);
    setPreset("reference");
    setSolutionLayer(true);
    setForcingLayer(true);
    setTransientLayer(true);
    setVerified(true);
    setTab("Interaction + visualization");
    setCopied(false);
    setExported(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const choosePreset = (value: Preset) =>
    act(() => {
      setPreset(value);
      setVerified(false);
      if (value === "reference") {
        setP(2);
        setY0(1);
        setScale(1);
      } else if (value === "gentle") {
        setP(1);
        setY0(2);
        setScale(0.75);
      } else {
        setP(3);
        setY0(-1);
        setScale(1.5);
      }
    });
  const stepsText = [
    `y' + ${display(p)}y = ${display(scale)}e^x`,
    `mu(x) = e^(${display(p)}x)`,
    `(e^(${display(p)}x)y)' = ${display(scale)}e^(${display(p + 1)}x)`,
    Math.abs(p + 1) < 1e-8
      ? `y = (${display(y0)} + ${display(scale)}x)e^x`
      : `y = ${display(a)}e^x + ${display(c)}e^(-${display(p)}x)`,
  ].join("\n");
  const copySteps = () =>
    act(() => {
      void navigator.clipboard?.writeText(stepsText);
      setCopied(true);
    });
  const exportSteps = () =>
    act(() => {
      const blob = new Blob([stepsText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "first-order-linear-equation-derivation.txt";
      anchor.click();
      URL.revokeObjectURL(url);
      setExported(true);
    });
  return (
    <section
      className="lin326-page"
      data-testid="calculus-mockup-0405"
      data-object-model="integrating-factor-pipeline-generated-slope-field-forcing-transient-solution-coefficient-controls-residual-verification-export"
      data-p={clean(p)}
      data-y0={clean(y0)}
      data-scale={clean(scale)}
      data-a={Number.isFinite(a) ? clean(a) : "special"}
      data-c={clean(c)}
      data-residual={clean(residual)}
      data-preset={preset}
      data-solution-layer={solutionLayer}
      data-forcing-layer={forcingLayer}
      data-transient-layer={transientLayer}
      data-verified={verified}
      data-tab={tab}
      data-copied={copied}
      data-exported={exported}
      data-actions={actions}
    >
      <header className="lin326-hero">
        <span>DIFFERENTIAL EQUATIONS</span>
        <h1>First-Order Linear Equations</h1>
        <p>Method: Integrating Factor for y′ + p(x)y = q(x)</p>
        <aside className="badges">
          <b>ⓘ linear</b>
          <b>▣ not separable only</b>
          <b>
            <Check /> solution verified
          </b>
        </aside>
        <div className="actions">
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
          <button>↗ Workspace</button>
        </div>
      </header>
      <nav className="lin326-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="lin326-lab">
        <header>
          <div>
            <h2>Use an integrating factor to unlock the equation</h2>
            <p>
              Solve y′ + {display(p)}y = {display(scale)}eˣ step by step and
              visualize the solution.
            </p>
          </div>
          <select
            aria-label="Linear equation example"
            value={preset}
            onChange={(event) => choosePreset(event.target.value as Preset)}
          >
            <option value="reference">Example: y′ + 2y = eˣ</option>
            <option value="gentle">Example: y′ + y = 0.75eˣ</option>
            <option value="decay">Example: y′ + 3y = 1.5eˣ</option>
          </select>
        </header>
        <aside className="lin326-pipeline">
          <h3>INTEGRATING FACTOR PIPELINE</h3>
          {[
            [
              "1",
              "Standard form",
              `y′ + ${display(p)}y = ${display(scale)}eˣ`,
              `p(x)=${display(p)}, q(x)=${display(scale)}eˣ`,
            ],
            [
              "2",
              "Integrating factor",
              `μ(x)=e^(∫${display(p)}dx)`,
              `μ(x)=e^(${display(p)}x)`,
            ],
            [
              "3",
              "Multiply both sides",
              `e^(${display(p)}x)y′ + ${display(p)}e^(${display(p)}x)y`,
              `= ${display(scale)}e^(${display(p + 1)}x)`,
            ],
            [
              "4",
              "Product rule reverse",
              `(e^(${display(p)}x)y)′`,
              `= ${display(scale)}e^(${display(p + 1)}x)`,
            ],
            [
              "5",
              "Integrate",
              Math.abs(p + 1) < 1e-8
                ? `e^(-x)y=${display(scale)}x+C`
                : `e^(${display(p)}x)y=${display(a)}e^(${display(p + 1)}x)+C`,
              Math.abs(p + 1) < 1e-8
                ? `y=(${display(y0)}+${display(scale)}x)eˣ`
                : `y=${display(a)}eˣ+${display(c)}e^(-${display(p)}x)`,
            ],
          ].map(([n, title, line1, line2]) => (
            <article key={n}>
              <i>{n}</i>
              <div>
                <h4>{title}</h4>
                <p>{line1}</p>
                <strong>{line2}</strong>
              </div>
            </article>
          ))}
          <footer>The constant C is chosen by the initial condition.</footer>
        </aside>
        <main className="lin326-visual">
          <header>
            <h3>
              Slope field and solution <Info />
            </h3>
            <label>
              <span className="cyan" />
              solution curve
              <input
                aria-label="Show linear solution"
                type="checkbox"
                checked={solutionLayer}
                onChange={(event) =>
                  act(() => setSolutionLayer(event.target.checked))
                }
              />
            </label>
            <label>
              <span className="pink" />
              forcing term
              <input
                aria-label="Show forcing term"
                type="checkbox"
                checked={forcingLayer}
                onChange={(event) =>
                  act(() => setForcingLayer(event.target.checked))
                }
              />
            </label>
            <label>
              <span className="gold" />
              transient
              <input
                aria-label="Show transient term"
                type="checkbox"
                checked={transientLayer}
                onChange={(event) =>
                  act(() => setTransientLayer(event.target.checked))
                }
              />
            </label>
          </header>
          <LinearGraph
            p={p}
            y0={y0}
            scale={scale}
            solutionLayer={solutionLayer}
            forcingLayer={forcingLayer}
            transientLayer={transientLayer}
          />
          <section className="structure">
            <strong>Solution structure</strong>
            <p>
              y(x) ={" "}
              <b>
                {Math.abs(p + 1) < 1e-8
                  ? `(${display(y0)}+${display(scale)}x)eˣ`
                  : `${display(c)}e^(-${display(p)}x) + ${display(a)}eˣ`}
              </b>
            </p>
            <ul>
              <li>Transient term decays when p&gt;0.</li>
              <li>Forcing term drives long-term growth.</li>
              <li>Initial condition selects one solution.</li>
            </ul>
          </section>
          <footer>
            <button
              onClick={() => act(() => setVerified(Math.abs(residual) < 1e-7))}
            >
              ◉ Verify by substitution
            </button>
            <span>
              Substituting into y′+py−seˣ gives{" "}
              <b>{residual.toExponential(1)}</b>
            </span>
            {verified && <Check />}
          </footer>
        </main>
        <aside className="lin326-side">
          <section className="controls">
            <h3>CONTROLS</h3>
            <Control
              label="p(x)"
              value={p}
              min={-1}
              max={5}
              step={0.25}
              set={(value) =>
                act(() => {
                  setP(value);
                  setVerified(false);
                })
              }
            />
            <Control
              label="Initial condition y(0)"
              value={y0}
              min={-5}
              max={5}
              step={0.25}
              set={(value) =>
                act(() => {
                  setY0(value);
                  setVerified(false);
                })
              }
            />
            <Control
              label="Forcing strength"
              value={scale}
              min={0}
              max={3}
              step={0.25}
              set={(value) =>
                act(() => {
                  setScale(value);
                  setVerified(false);
                })
              }
            />
            <article>
              <h4>Chosen equation</h4>
              <strong>
                y′ + {display(p)}y = {display(scale)}eˣ
              </strong>
              <p>with y(0)={display(y0)}</p>
            </article>
          </section>
          <section className="cas">
            <h3>STEP-BY-STEP CAS DERIVATION</h3>
            {[
              ["1", "Standard form", `y′+${display(p)}y=${display(scale)}eˣ`],
              ["2", "Integrating factor", `μ=e^(${display(p)}x)`],
              [
                "3",
                "Multiply both sides",
                `(μy)′=${display(scale)}e^(${display(p + 1)}x)`,
              ],
              ["4", "Product rule reverse", `(e^(${display(p)}xy)′`],
              [
                "5",
                "Integrate",
                Math.abs(p + 1) < 1e-8
                  ? "e^-x y=sx+C"
                  : `e^(${display(p)}x)y=${display(a)}e^(${display(p + 1)}x)+C`,
              ],
              [
                "6",
                "Solve for y(x)",
                Math.abs(p + 1) < 1e-8
                  ? `(${display(y0)}+${display(scale)}x)eˣ`
                  : `${display(a)}eˣ+Ce^(-${display(p)}x)`,
              ],
              ["7", "Apply y(0)", `C=${display(c)}`],
              [
                "8",
                "Final solution",
                Math.abs(p + 1) < 1e-8
                  ? `(${display(y0)}+${display(scale)}x)eˣ`
                  : `${display(a)}eˣ+${display(c)}e^(-${display(p)}x)`,
              ],
            ].map(([n, label, formula]) => (
              <p key={n}>
                <i>{n}</i>
                <span>{label}</span>
                <b>{formula}</b>
              </p>
            ))}
          </section>
          <footer>
            <button onClick={copySteps}>
              <Clipboard />
              {copied ? "Copied" : "Copy steps"}
            </button>
            <button onClick={exportSteps}>
              <Download />
              {exported ? "Exported" : "Export derivation"}
            </button>
          </footer>
        </aside>
      </section>
      <nav
        className="lin326-adjacent"
        aria-label="First-order linear adjacent lessons"
      >
        <a href="/lessons/calculus/325-separable-equations">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Separable Equations
          </span>
        </a>
        <a href="/lessons/calculus/327-logistic-growth">
          <span>
            <small>NEXT</small>Exact Equations
          </span>{" "}
          →
        </a>
      </nav>
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
    <label className="lin326-control">
      <span>{label}</span>
      <input
        aria-label={`Linear ${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => set(clamp(Number(event.target.value), min, max))}
      />
      <output>{value.toFixed(2)}</output>
    </label>
  );
}

function LinearGraph({
  p,
  y0,
  scale,
  solutionLayer,
  forcingLayer,
  transientLayer,
}: {
  p: number;
  y0: number;
  scale: number;
  solutionLayer: boolean;
  forcingLayer: boolean;
  transientLayer: boolean;
}) {
  const w = 600,
    h = 378,
    pad = 28,
    xmin = -2.3,
    xmax = 4.3,
    ymin = -1,
    ymax = 8,
    sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (w - 2 * pad),
    sy = (y: number) => h - pad - ((y - ymin) / (ymax - ymin)) * (h - 2 * pad),
    a = coefficient(p, scale),
    c = constant(p, y0, scale),
    path = (fn: (x: number) => number) =>
      Array.from({ length: 181 }, (_, i) => {
        const x = xmin + (i / 180) * (xmax - xmin);
        return `${i ? "L" : "M"}${sx(x)},${sy(fn(x))}`;
      }).join(" ");
  return (
    <svg className="lin326-graph" viewBox={`0 0 ${w} ${h}`}>
      <g className="field">
        {Array.from({ length: 216 }, (_, i) => {
          const col = i % 18,
            row = Math.floor(i / 18),
            x = xmin + (col / 17) * (xmax - xmin),
            y = ymin + (row / 11) * (ymax - ymin),
            m = scale * Math.exp(x) - p * y,
            angle = Math.atan(m),
            dx = Math.cos(angle) * 5,
            dy = Math.sin(angle) * 5;
          return (
            <line
              key={i}
              x1={sx(x) - dx}
              y1={sy(y) + dy}
              x2={sx(x) + dx}
              y2={sy(y) - dy}
            />
          );
        })}
      </g>
      <line className="axis" x1={pad} x2={w - pad} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={pad} y2={h - pad} />
      {solutionLayer && (
        <path className="solution" d={path((x) => solution(x, p, y0, scale))} />
      )}{" "}
      {forcingLayer && Math.abs(p + 1) >= 1e-8 && (
        <path className="forcing" d={path((x) => a * Math.exp(x))} />
      )}{" "}
      {transientLayer && (
        <path
          className="transient"
          d={path((x) =>
            Math.abs(p + 1) < 1e-8 ? y0 * Math.exp(x) : c * Math.exp(-p * x),
          )}
        />
      )}
      <circle className="initial" cx={sx(0)} cy={sy(y0)} r="7" />
      <text className="initial-label" x={sx(0) + 18} y={sy(y0) - 18}>
        initial condition y(0)={display(y0)}
      </text>
      <text
        className="solution-label"
        x={sx(3)}
        y={sy(solution(3, p, y0, scale)) - 12}
      >
        solution curve
      </text>
    </svg>
  );
}
