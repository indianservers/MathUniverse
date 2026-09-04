import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Maximize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TrigTransformTargetLesson10125.css";

const pathFor = (fn: (x: number) => number, zoom: number) => {
  let path = "";
  for (let index = 0; index <= 400; index += 1) {
    const x = -Math.PI * 2.5 + (Math.PI * 5 * index) / 400;
    const px = 36 + (x + Math.PI * 2.5) * (690 / (Math.PI * 5));
    const py = 215 - fn(x) * 55 * zoom;
    path += `${index ? " L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return path;
};

const piLabel = (value: number) => {
  const ratio = value / Math.PI;
  if (Math.abs(ratio) < 0.001) return "0";
  if (Math.abs(ratio - 0.25) < 0.001) return "π/4";
  if (Math.abs(ratio - 0.5) < 0.001) return "π/2";
  if (Math.abs(ratio + 0.25) < 0.001) return "-π/4";
  return `${ratio.toFixed(2)}π`;
};

export default function TrigTransformTargetLesson10125({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [amplitude, setAmplitude] = useState(1.5);
  const [frequency, setFrequency] = useState(2);
  const [phase, setPhase] = useState(Math.PI / 4);
  const [vertical, setVertical] = useState(0.75);
  const [parent, setParent] = useState(true);
  const [transformed, setTransformed] = useState(true);
  const [step, setStep] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [answer, setAnswer] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [actions, setActions] = useState(0);
  const period = (Math.PI * 2) / Math.abs(frequency || 1);
  const maximum = vertical + Math.abs(amplitude);
  const minimum = vertical - Math.abs(amplitude);
  const transform = (x: number) =>
    amplitude * Math.sin(frequency * (x - phase)) + vertical;
  const points = [
    [phase - period / 4, vertical - Math.abs(amplitude)],
    [phase, vertical],
    [phase + period / 4, maximum],
    [phase + period / 2, vertical],
    [phase + (period * 3) / 4, minimum],
  ];
  const mutate = (setter: (value: number) => void, value: number) => {
    setter(value);
    setActions((count) => count + 1);
  };
  const reset = () => {
    setAmplitude(1.5);
    setFrequency(2);
    setPhase(Math.PI / 4);
    setVertical(0.75);
    setParent(true);
    setTransformed(true);
    setStep(2);
    setZoom(1);
    setAnswer(false);
    setExpanded(false);
    setActions((count) => count + 1);
  };
  const parameterRows = [
    ["A (amplitude)", amplitude, -3, 3, 0.25, "a"],
    ["B (frequency)", frequency, 0.5, 4, 0.25, "b"],
    ["C (phase shift)", phase, -Math.PI, Math.PI, Math.PI / 12, "c"],
    ["D (vertical shift)", vertical, -2, 2, 0.25, "d"],
  ] as const;
  const setters = [setAmplitude, setFrequency, setPhase, setVertical];
  const steps = [
    "Start: y = sin x",
    "Horizontal: y = sin(Bx)",
    "Phase Shift: y = sin(B(x-C))",
    "Vertical Shift: y = A sin(B(x-C))+D",
  ];

  return (
    <section
      className={`tf10125-page ${expanded ? "expanded" : ""}`}
      data-testid="school-mockup-0799"
      data-object-model="dedicated-sinusoid-transformation-engine"
      data-amplitude={amplitude.toFixed(2)}
      data-frequency={frequency.toFixed(2)}
      data-phase={phase.toFixed(4)}
      data-vertical={vertical.toFixed(2)}
      data-period={period.toFixed(4)}
      data-maximum={maximum.toFixed(2)}
      data-minimum={minimum.toFixed(2)}
      data-step={step}
      data-parent={String(parent)}
      data-transformed={String(transformed)}
      data-zoom={zoom.toFixed(2)}
      data-expanded={String(expanded)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · TRIGONOMETRY</small>
        <h1>Transformation of Trigonometric Graphs</h1>
        <p>
          Use the transformation studio to explore{" "}
          <em>y = A sin(B(x-C)) + D</em>.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </nav>
      </header>
      <main>
        <aside className="tf10125-controls">
          <h2>⌘ TRANSFORMATION STUDIO</h2>
          <div className="formula">
            y = <i>A</i> sin(<b>B</b>(x - <strong>C</strong>)) + <em>D</em>
          </div>
          {parameterRows.map(
            ([label, value, min, max, increment, key], index) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  aria-label={label}
                  type="range"
                  min={min}
                  max={max}
                  step={increment}
                  value={value}
                  onChange={(event) =>
                    mutate(setters[index], Number(event.target.value))
                  }
                />
                <input
                  aria-label={`${label} value`}
                  type="number"
                  step={increment}
                  value={index === 2 ? value.toFixed(4) : value}
                  onChange={(event) =>
                    mutate(setters[index], Number(event.target.value))
                  }
                />
              </label>
            ),
          )}
          <button className="reset" onClick={reset}>
            <RotateCcw /> Reset all
          </button>
          <section className="tf10125-steps">
            <h2>STEP THROUGH TRANSFORMATIONS</h2>
            {steps.map((text, index) => (
              <button
                className={step === index + 1 ? "active" : ""}
                key={text}
                onClick={() => setStep(index + 1)}
              >
                <b>{index + 1}</b>
                {text}
              </button>
            ))}
            <footer>
              <button
                disabled={step === 1}
                onClick={() => setStep((value) => Math.max(1, value - 1))}
              >
                <ArrowLeft /> Prev
              </button>
              <span>Step {step} of 4</span>
              <button
                disabled={step === 4}
                onClick={() => setStep((value) => Math.min(4, value + 1))}
              >
                Next <ArrowRight />
              </button>
            </footer>
          </section>
        </aside>
        <section className="tf10125-graph">
          <header>
            <label>
              <input
                aria-label="Show parent graph"
                type="checkbox"
                checked={parent}
                onChange={(event) => setParent(event.target.checked)}
              />{" "}
              Parent: y = sin x
            </label>
            <label>
              <input
                aria-label="Show transformed graph"
                type="checkbox"
                checked={transformed}
                onChange={(event) => setTransformed(event.target.checked)}
              />{" "}
              Transformed: y = {amplitude.toFixed(2)}sin({frequency.toFixed(2)}
              (x-{piLabel(phase)}))+{vertical.toFixed(2)}
            </label>
            <nav>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(0.6, value - 0.1))}
              >
                <ZoomOut />
              </button>
              <button onClick={() => setZoom(1)}>Fit</button>
              <button
                aria-label="Toggle expanded graph"
                onClick={() => setExpanded((value) => !value)}
              >
                <Maximize />
              </button>
            </nav>
          </header>
          <svg
            viewBox="0 0 760 440"
            aria-label="Transformed trigonometric graph"
          >
            {Array.from({ length: 11 }, (_, index) => (
              <line
                className="grid"
                key={`v${index}`}
                x1={36 + index * 69}
                y1="24"
                x2={36 + index * 69}
                y2="405"
              />
            ))}
            {Array.from({ length: 9 }, (_, index) => (
              <line
                className="grid"
                key={`h${index}`}
                x1="36"
                y1={50 + index * 48}
                x2="726"
                y2={50 + index * 48}
              />
            ))}
            <line className="axis" x1="25" y1="215" x2="735" y2="215" />
            <line className="axis" x1="380" y1="20" x2="380" y2="415" />
            {parent && (
              <path className="parent" d={pathFor(Math.sin, zoom)} />
            )}{" "}
            {transformed && (
              <path className="changed" d={pathFor(transform, zoom)} />
            )}
            <line
              className="midline"
              x1="30"
              y1={215 - vertical * 55 * zoom}
              x2="730"
              y2={215 - vertical * 55 * zoom}
            />
            <line
              className="phase"
              x1={36 + (phase + Math.PI * 2.5) * (690 / (Math.PI * 5))}
              y1="25"
              x2={36 + (phase + Math.PI * 2.5) * (690 / (Math.PI * 5))}
              y2="405"
            />
            {points.map(([x, y], index) => (
              <g key={index}>
                <circle
                  cx={36 + (x + Math.PI * 2.5) * (690 / (Math.PI * 5))}
                  cy={215 - y * 55 * zoom}
                  r="5"
                />
                <text
                  x={42 + (x + Math.PI * 2.5) * (690 / (Math.PI * 5))}
                  y={207 - y * 55 * zoom}
                >
                  ({piLabel(x)}, {y.toFixed(2)})
                </text>
              </g>
            ))}
            <text x="570" y={205 - vertical * 55 * zoom}>
              Midline y = {vertical.toFixed(2)}
            </text>
            <text x="555" y="75">
              Amplitude |A| = {Math.abs(amplitude).toFixed(2)}
            </text>
            <text x="470" y="395">
              Period = 2π/|B| = {piLabel(period)}
            </text>
          </svg>
          <footer>
            <article>
              <h2>
                KEY POINTS <small>(update live)</small>
              </h2>
              <p>
                Midline crossings: x = C + nπ/|B|, y = D = {vertical.toFixed(2)}
              </p>
              <p>Maxima: y = D + |A| = {maximum.toFixed(2)}</p>
              <p>Minima: y = D - |A| = {minimum.toFixed(2)}</p>
            </article>
            <article>
              <h2>CURRENT PARAMETERS</h2>
              <p>A = {amplitude.toFixed(2)}</p>
              <p>B = {frequency.toFixed(2)}</p>
              <p>C = {piLabel(phase)}</p>
              <p>D = {vertical.toFixed(2)}</p>
            </article>
          </footer>
        </section>
        <aside className="tf10125-info">
          <article>
            <h2>ABOUT THE TRANSFORMATION</h2>
            <p>y = A sin(B(x-C)) + D</p>
            <ul>
              <li>|A| scales the amplitude.</li>
              <li>B changes the period to 2π/|B|.</li>
              <li>C shifts the graph right by C.</li>
              <li>D shifts the graph up by D.</li>
            </ul>
          </article>
          <article>
            <h2>OBJECTIVES</h2>
            <p>✓ Define graph transformations correctly.</p>
            <p>✓ Match each coefficient to its effect.</p>
            <p>✓ Avoid changing period for a vertical shift.</p>
          </article>
          <article>
            <h2>COMMON MISTAKE</h2>
            <p>
              Do not confuse sine with cosine; sine tracks the vertical
              coordinate.
            </p>
          </article>
          <article>
            <h2>BOARD-STYLE CHECK</h2>
            <p>Estimate sin(36°).</p>
            <button onClick={() => setAnswer((value) => !value)}>
              <Eye /> {answer ? "sin(36°) ≈ 0.588" : "Show answer"}
            </button>
          </article>
        </aside>
      </main>
      <nav className="tf10125-pager">
        <button>
          <ArrowLeft /> Domain and Range of Trigonometric Functions
        </button>
        <button>
          General Solutions of Trigonometric Equations <ArrowRight />
        </button>
      </nav>
    </section>
  );
}
