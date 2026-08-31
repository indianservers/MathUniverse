import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RealImaginaryTargetLesson366.css";

const clean = (value: number) => Number(value.toFixed(2));
function quadrant(a: number, b: number) {
  if (a === 0 || b === 0) return "Axis";
  if (a > 0 && b > 0) return "Quadrant I";
  if (a < 0 && b > 0) return "Quadrant II";
  if (a < 0 && b < 0) return "Quadrant III";
  return "Quadrant IV";
}
function complexText(a: number, b: number) {
  return a + (b < 0 ? " - " : " + ") + Math.abs(b) + "i";
}

export default function RealImaginaryTargetLesson366({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [projections, setProjections] = useState(true);
  const [showQuadrant, setShowQuadrant] = useState(true);
  const [signs, setSigns] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [realAnswer, setRealAnswer] = useState("");
  const [imaginaryAnswer, setImaginaryAnswer] = useState("");
  const [quadrantAnswer, setQuadrantAnswer] = useState("");
  const [verdict, setVerdict] = useState("");
  const [solution, setSolution] = useState(false);
  const [actions, setActions] = useState(0);

  const reset = () => {
    setA(2);
    setB(1);
    setDragging(false);
    setProjections(true);
    setShowQuadrant(true);
    setSigns(true);
    setTab("Interaction + visualization");
    setRealAnswer("");
    setImaginaryAnswer("");
    setQuadrantAnswer("");
    setVerdict("");
    setSolution(false);
    setActions(0);
  };
  const act = (work: () => void) => {
    work();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);

  const px = (x: number) => 245 + x * 39;
  const py = (y: number) => 315 - y * 45;
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 500;
    const y = ((event.clientY - box.top) / box.height) * 650;
    act(() => {
      setA(clean(Math.max(-5, Math.min(5, (x - 245) / 39))));
      setB(clean(Math.max(-5, Math.min(5, (315 - y) / 45))));
      setVerdict("");
    });
  };
  const adjust = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
  ) =>
    act(() => {
      setter(Math.max(-10, Math.min(10, clean(value))));
      setVerdict("");
    });
  const check = () =>
    act(() =>
      setVerdict(
        Number(realAnswer) === -2 &&
          Number(imaginaryAnswer) === -3 &&
          quadrantAnswer === "Quadrant III"
          ? "correct"
          : "incorrect",
      ),
    );

  return (
    <section
      className="ri366-page"
      data-testid="complex-mockup-0551"
      data-object-model="draggable-complex-point-synchronized-real-imaginary-steppers-sliders-projections-quadrant-signs-decomposition-graded-practice"
      data-z={JSON.stringify([a, b])}
      data-quadrant={quadrant(a, b)}
      data-projections={projections}
      data-show-quadrant={showQuadrant}
      data-signs={signs}
      data-tab={tab}
      data-verdict={verdict}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="ri366-hero">
        <div className="ri366-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Real and Imaginary Parts</h1>
        <p>Understand components.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="ri366-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>
            <ExternalLink />
            Workspace
          </button>
        </div>
      </header>
      <nav className="ri366-tabs">
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
      <section className="ri366-workspace">
        <article className="ri366-inspector">
          <header>
            <div>
              <b>COMPONENT INSPECTOR</b>
              <p>
                Explore how <code>z = a + bi</code> decomposes into its real and
                imaginary parts.
              </p>
            </div>
            {showQuadrant && <strong>{quadrant(a, b)}</strong>}
          </header>
          <svg
            viewBox="0 0 500 650"
            onPointerMove={move}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            <defs>
              <pattern
                id="ri-grid"
                width="39"
                height="45"
                patternUnits="userSpaceOnUse"
              >
                <path d="M39 0H0V45" fill="none" stroke="#dce5ee" />
              </pattern>
            </defs>
            <rect x="25" y="55" width="450" height="500" fill="url(#ri-grid)" />
            <path d="M25 315H475M245 555V55" className="axis" />
            <text x="477" y="305" className="axis-label">
              Re
            </text>
            <text x="236" y="45" className="axis-label">
              Im
            </text>
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((value) => (
              <g key={value}>
                <text x={px(value)} y="335" textAnchor="middle">
                  {value}
                </text>
                <text x="230" y={py(value) + 4} textAnchor="end">
                  {value}
                </text>
              </g>
            ))}
            {projections && (
              <>
                <line
                  x1={px(a)}
                  y1={py(b)}
                  x2={px(a)}
                  y2={py(0)}
                  className="real-projection"
                />
                <line
                  x1={px(a)}
                  y1={py(b)}
                  x2={px(0)}
                  y2={py(b)}
                  className="imaginary-projection"
                />
                <circle cx={px(a)} cy={py(0)} r="5" className="real-dot" />
                <text x={px(a) - 42} y={py(0) + 40} className="real-label">
                  Re(z) = {a}
                </text>
                <text x="78" y={py(b) + 5} className="imaginary-label">
                  Im(z) = {b}
                </text>
              </>
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(a)}
              y2={py(b)}
              className="vector"
            />
            <circle
              cx={px(a)}
              cy={py(b)}
              r="7"
              className="point"
              onPointerDown={() => setDragging(true)}
            />
            <text x={px(a) + 12} y={py(b) - 15} className="z-label">
              z = {complexText(a, b)}
            </text>
          </svg>
          <div className="ri366-legend">
            <span>z (point/vector)</span>
            <span>Real part (horizontal)</span>
            <span>Imag part (vertical)</span>
          </div>
          {signs && (
            <div className="ri366-signs">
              <b>Real part {a >= 0 ? "positive" : "negative"}</b>
              <b>Imaginary part {b >= 0 ? "positive" : "negative"}</b>
            </div>
          )}
        </article>
        <aside className="ri366-panel">
          <section>
            <h2>Adjust components</h2>
            <Stepper
              label="Real part   a = Re(z)"
              value={a}
              color="real"
              onMinus={() => adjust(setA, a - 1)}
              onPlus={() => adjust(setA, a + 1)}
              onChange={(value) => adjust(setA, value)}
            />
            <Stepper
              label="Imaginary part   b = Im(z)"
              value={b}
              color="imaginary"
              onMinus={() => adjust(setB, b - 1)}
              onPlus={() => adjust(setB, b + 1)}
              onChange={(value) => adjust(setB, value)}
            />
          </section>
          <section>
            <h2>Display options</h2>
            <Toggle
              label="Show projections"
              note="Show horizontal & vertical components"
              checked={projections}
              onChange={(value) => act(() => setProjections(value))}
            />
            <Toggle
              label="Show quadrant"
              note="Show quadrant label"
              checked={showQuadrant}
              onChange={(value) => act(() => setShowQuadrant(value))}
            />
            <Toggle
              label="Show signs"
              note="Show sign of real & imaginary parts"
              checked={signs}
              onChange={(value) => act(() => setSigns(value))}
            />
          </section>
          <section className="ri366-live">
            <h2>Live decomposition</h2>
            <strong>z = {complexText(a, b)}</strong>
            <strong>Re(z) = {a}</strong>
            <strong>Im(z) = {b}</strong>
            <strong>
              Ordered pair: ({a}, {b})
            </strong>
            <p>
              <b>Careful:</b> Im({complexText(a, b)}) = {b}, not {b}i. The
              imaginary part is the coefficient b, not bi.
            </p>
          </section>
        </aside>
      </section>
      <section className="ri366-learning">
        <article>
          <h2>Formula / Definition</h2>
          <code>
            For z = a + bi:<b>Re(z) = a</b>
            <b>Im(z) = b</b>
          </code>
          <p>
            <i>a</i> is horizontal; <i>b</i> is vertical.
          </p>
          <p>
            The real part is the horizontal component (x-coordinate). The
            imaginary part is the vertical component (y-coordinate).
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>
            <b>Example:</b> For z = -3 + 4i
          </p>
          <ul>
            <li>a = -3, b = 4</li>
            <li>Re(z) = -3 and Im(z) = 4</li>
            <li>Point (-3, 4) lies in Quadrant II.</li>
          </ul>
          <svg viewBox="0 0 190 120">
            <path d="M18 82H178M100 112V10" className="axis" />
            <line
              x1="100"
              y1="82"
              x2="52"
              y2="30"
              className="imaginary-projection"
              strokeDasharray="4 3"
            />
            <circle cx="52" cy="30" r="5" className="worked-dot" />
            <text x="30" y="22">
              (-3, 4)
            </text>
          </svg>
        </article>
        <article className="ri366-practice">
          <h2>Practice challenge</h2>
          <p>
            Set z = -2 - 3i. Which values are Re(z), Im(z), and the quadrant?
          </p>
          <label>
            Re(z) ={" "}
            <input
              aria-label="Practice real part"
              value={realAnswer}
              onChange={(event) => setRealAnswer(event.target.value)}
            />
          </label>
          <label>
            Im(z) ={" "}
            <input
              aria-label="Practice imaginary part"
              value={imaginaryAnswer}
              onChange={(event) => setImaginaryAnswer(event.target.value)}
            />
          </label>
          <label>
            Quadrant:{" "}
            <select
              aria-label="Practice quadrant"
              value={quadrantAnswer}
              onChange={(event) => setQuadrantAnswer(event.target.value)}
            >
              <option value="">Select...</option>
              <option>Quadrant I</option>
              <option>Quadrant II</option>
              <option>Quadrant III</option>
              <option>Quadrant IV</option>
            </select>
          </label>
          <button onClick={check}>Check answer</button>
          <button onClick={() => act(() => setSolution(!solution))}>
            Show solution
          </button>
          {(verdict || solution) && (
            <output className={verdict}>
              {solution || verdict === "correct"
                ? "Re(z)=-2, Im(z)=-3, Quadrant III"
                : "Check each component and quadrant."}
            </output>
          )}
        </article>
      </section>
      <nav className="ri366-nav">
        <a href="/lessons/advanced-mathematics/365-complex-plane">
          ←{" "}
          <span>
            <small>Previous</small>Complex Plane
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/367-complex-addition">
          <span>
            <small>Next</small>Complex Addition
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Stepper({
  label,
  value,
  color,
  onMinus,
  onPlus,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onMinus: () => void;
  onPlus: () => void;
  onChange: (value: number) => void;
}) {
  return (
    <label className={"ri366-stepper " + color}>
      <b>{label}</b>
      <span>
        <button aria-label={"Decrease " + label} onClick={onMinus}>
          −
        </button>
        <output>{value}</output>
        <button aria-label={"Increase " + label} onClick={onPlus}>
          +
        </button>
      </span>
      <input
        aria-label={label}
        type="range"
        min="-10"
        max="10"
        step=".1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        <i>-10</i>
        <i>10</i>
      </small>
    </label>
  );
}
function Toggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="ri366-toggle">
      <span>
        <b>{label}</b>
        <small>{note}</small>
      </span>
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
