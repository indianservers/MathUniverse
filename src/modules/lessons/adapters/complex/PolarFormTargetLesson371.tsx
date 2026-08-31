import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PolarFormTargetLesson371.css";

type Pair = [number, number];
type AngleUnit = "Degrees" | "Radians";

const clean = (value: number, digits = 2) => Number(value.toFixed(digits));
const rectangular = ([a, b]: Pair) =>
  `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}i`;
const quadrant = (a: number, b: number) => {
  if (a === 0 || b === 0) return "Axis";
  if (a > 0 && b > 0) return "I";
  if (a < 0 && b > 0) return "II";
  if (a < 0 && b < 0) return "III";
  return "IV";
};

export default function PolarFormTargetLesson371({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([3, 4]);
  const [dragging, setDragging] = useState(false);
  const [unit, setUnit] = useState<AngleUnit>("Degrees");
  const [triangle, setTriangle] = useState(true);
  const [ring, setRing] = useState(true);
  const [steps, setSteps] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [challenge, setChallenge] = useState(false);
  const [checks, setChecks] = useState([true, false, true, true]);
  const [actions, setActions] = useState(0);

  const radius = clean(Math.hypot(...z));
  const degrees = clean((Math.atan2(z[1], z[0]) * 180) / Math.PI);
  const radians = clean(Math.atan2(z[1], z[0]), 3);
  const theta = unit === "Degrees" ? `${degrees} degrees` : `${radians} rad`;
  const polar = `${radius}(cos ${theta} + i sin ${theta})`;

  const reset = () => {
    setZ([3, 4]);
    setDragging(false);
    setUnit("Degrees");
    setTriangle(true);
    setRing(true);
    setSteps(true);
    setTab("Interaction + visualization");
    setChallenge(false);
    setChecks([true, false, true, true]);
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);

  const px = (x: number) => 182 + x * 31;
  const py = (y: number) => 282 - y * 31;
  const update = (index: 0 | 1, value: number) =>
    act(() =>
      setZ(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value, 1) : item,
          ) as Pair,
      ),
    );
  const movePoint = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (((event.clientX - bounds.left) / bounds.width) * 390 - 182) / 31;
    const y = (282 - ((event.clientY - bounds.top) / bounds.height) * 450) / 31;
    act(() =>
      setZ([
        clean(Math.max(-6, Math.min(6, x)), 1),
        clean(Math.max(-6, Math.min(6, y)), 1),
      ]),
    );
  };

  return (
    <section
      className="pf371-page"
      data-testid="complex-mockup-0556"
      data-object-model="draggable-rectangular-point-live-polar-conversion-modulus-argument-degree-radian-pipeline-ring-triangle-understanding-challenge"
      data-z={JSON.stringify(z)}
      data-radius={radius}
      data-degrees={degrees}
      data-radians={radians}
      data-unit={unit.toLowerCase()}
      data-quadrant={quadrant(...z)}
      data-triangle={triangle}
      data-ring={ring}
      data-steps={steps}
      data-tab={tab}
      data-challenge={challenge}
      data-checks={JSON.stringify(checks)}
      data-actions={actions}
    >
      <header className="pf371-hero">
        <div className="pf371-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Polar Form</h1>
        <p>Convert representations.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="pf371-actions">
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

      <nav className="pf371-tabs">
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

      <section className="pf371-work">
        <article className="pf371-converter">
          <header>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Rectangular -&gt; Polar Converter</h2>
          </header>
          <div className="pf371-converter-body">
            <section className="pf371-plane">
              <h3>Complex Plane (Argand Diagram)</h3>
              <svg
                viewBox="0 0 390 450"
                onPointerMove={movePoint}
                onPointerUp={() => setDragging(false)}
                onPointerLeave={() => setDragging(false)}
              >
                <defs>
                  <pattern
                    id="pf371-grid"
                    width="31"
                    height="31"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M31 0H0V31" fill="none" stroke="#dfe8ef" />
                  </pattern>
                </defs>
                <rect width="390" height="450" fill="url(#pf371-grid)" />
                <path d="M8 282H382M182 445V10" className="axis" />
                <path d="M382 282l-8-5v10zM182 10l-5 8h10z" className="arrow" />
                <text x="367" y="270">
                  Re
                </text>
                <text x="195" y="15">
                  Im
                </text>
                {[-6, -4, -2, 0, 2, 3, 4, 6].map((number) => (
                  <g key={number}>
                    <text x={px(number)} y="299" textAnchor="middle">
                      {number}
                    </text>
                    <text x="171" y={py(number) + 4} textAnchor="end">
                      {number}
                    </text>
                  </g>
                ))}
                {ring && (
                  <circle
                    cx={px(0)}
                    cy={py(0)}
                    r={radius * 31}
                    className="ring"
                  />
                )}
                {triangle && (
                  <path
                    d={`M${px(0)} ${py(0)}H${px(z[0])}V${py(z[1])}`}
                    className="triangle"
                  />
                )}
                <line
                  x1={px(0)}
                  y1={py(0)}
                  x2={px(z[0])}
                  y2={py(z[1])}
                  className="radius"
                />
                <path
                  d={`M${px(0) + 49} ${py(0)} A49 49 0 0 ${z[1] < 0 ? 0 : 1} ${px(0) + 29} ${py(0) - 39}`}
                  className="angle"
                />
                <circle
                  cx={px(z[0])}
                  cy={py(z[1])}
                  r="7"
                  className="point"
                  onPointerDown={() => setDragging(true)}
                />
                <text x={px(z[0]) - 17} y={py(z[1]) - 22} className="z-label">
                  z = {rectangular(z)}
                </text>
                <text
                  x={(px(0) + px(z[0])) / 2 - 25}
                  y={(py(0) + py(z[1])) / 2 - 8}
                  className="r-label"
                >
                  r = {radius}
                </text>
                <text x={px(0) + 55} y={py(0) - 18} className="theta-label">
                  theta ~= {degrees} degrees
                </text>
                <text
                  x={(px(0) + px(z[0])) / 2}
                  y={py(0) + 28}
                  className="a-label"
                >
                  a = {z[0]}
                </text>
                <text
                  x={px(z[0]) + 17}
                  y={(py(0) + py(z[1])) / 2}
                  className="b-label"
                >
                  b = {z[1]}
                </text>
              </svg>
            </section>

            <section
              className={`pf371-pipeline ${steps ? "" : "hidden-steps"}`}
            >
              <h3>Conversion Pipeline</h3>
              <article className="rectangular">
                <b>Rectangular</b>
                <em>z = a + bi</em>
                <strong>{rectangular(z)}</strong>
              </article>
              {steps && <span className="down">↓</span>}
              {steps && (
                <article className="measure">
                  <b>Measure</b>
                  <em>r = sqrt(a^2 + b^2)</em>
                  <strong>= {radius}</strong>
                  <em>theta = atan2(b, a)</em>
                  <strong>~= {theta}</strong>
                </article>
              )}
              {steps && <span className="down">↓</span>}
              <article className="polar">
                <b>Polar</b>
                <em>z = r(cos theta + i sin theta)</em>
                <strong>{polar}</strong>
              </article>
            </section>
          </div>
        </article>

        <aside className="pf371-side">
          <section className="pf371-controls">
            <header>
              <h2>Controls</h2>
              <span>
                <i />
                {actions} actions
              </span>
            </header>
            <Control
              label="Real part (a)"
              value={z[0]}
              onChange={(value) => update(0, value)}
            />
            <Control
              label="Imaginary part (b)"
              value={z[1]}
              onChange={(value) => update(1, value)}
            />
            <h3>Angle unit</h3>
            <div className="pf371-unit">
              {(["Degrees", "Radians"] as AngleUnit[]).map((name) => (
                <button
                  key={name}
                  className={unit === name ? "active" : ""}
                  onClick={() => act(() => setUnit(name))}
                >
                  {name}
                </button>
              ))}
            </div>
            <Toggle
              label="Show triangle"
              checked={triangle}
              onChange={setTriangle}
              act={act}
            />
            <Toggle
              label="Show radius ring"
              checked={ring}
              onChange={setRing}
              act={act}
            />
            <Toggle
              label="Show conversion steps"
              checked={steps}
              onChange={setSteps}
              act={act}
            />
          </section>
          <section className="pf371-results">
            <h2>Live Results</h2>
            <p>
              <em>r = sqrt(a^2 + b^2)</em>
              <b>{radius}</b>
            </p>
            <p>
              <em>theta = atan2(b, a)</em>
              <b>{theta}</b>
            </p>
            <p>
              <span>Polar form</span>
              <strong>{polar}</strong>
            </p>
            <p>
              <span>Rectangular check</span>
              <b>{rectangular(z)} ✓</b>
            </p>
          </section>
        </aside>
      </section>

      <section className="pf371-learning">
        <article className="formula">
          <h2>Key Formulas</h2>
          <p>r = sqrt(a^2 + b^2)</p>
          <p>theta = atan2(b, a)</p>
          <p>z = r(cos theta + i sin theta)</p>
          <small>where: r &gt;= 0, theta in (-pi, pi]</small>
        </article>
        <article className="example">
          <h2>Worked Example</h2>
          <p>Convert z = 3 + 4i to polar form.</p>
          <ol>
            <li>a = 3, b = 4</li>
            <li>r = sqrt(3^2 + 4^2) = 5</li>
            <li>theta = atan2(4, 3) ~= 53.1 degrees</li>
            <li>z = 5(cos 53.1 degrees + i sin 53.1 degrees)</li>
          </ol>
          <strong>Answer: 5(cos 53.1 degrees + i sin 53.1 degrees)</strong>
        </article>
        <article className="challenge">
          <h2>Practice Challenge</h2>
          <p>
            Convert -2 + 2i to polar form; identify the correct quadrant before
            writing theta.
          </p>
          <button onClick={() => act(() => setChallenge(!challenge))}>
            Start Challenge
          </button>
          {challenge && (
            <strong>r = 2sqrt(2), theta = 135 degrees, Quadrant II</strong>
          )}
          <small>Hint: (-2, 2) is in Quadrant II.</small>
        </article>
        <article className="misconception">
          <h2>Common Misconception</h2>
          <strong>r is distance, not the real coordinate.</strong>
          <p>For 3 + 4i, r = 5 (distance from origin), not 3.</p>
          <MiniDiagram />
        </article>
      </section>

      <section className="pf371-lower">
        <article className="pf371-understanding">
          <h2>Understanding Check</h2>
          <p>
            Which statements are true for z = 3 + 4i? Select all that apply.
          </p>
          {[
            "r is the distance from the origin to the point.",
            "The real part is the same as r.",
            "theta is measured counterclockwise from the positive real axis.",
            "Polar form is 5(cos 53.1 degrees + i sin 53.1 degrees).",
          ].map((label, index) => (
            <label key={label}>
              <input
                type="checkbox"
                checked={checks[index]}
                onChange={(event) =>
                  act(() =>
                    setChecks((current) =>
                      current.map((value, itemIndex) =>
                        itemIndex === index ? event.target.checked : value,
                      ),
                    ),
                  )
                }
              />
              {label}
            </label>
          ))}
        </article>
        <article className="pf371-reference">
          <div>
            <h2>Quick Reference</h2>
            <h3>Ranges</h3>
            <p>
              r &gt;= 0<br />
              theta in (-pi, pi]
            </p>
            <h3>Quadrants &amp; theta (degrees)</h3>
            <p>
              I: 0 degrees &lt; theta &lt; 90 degrees
              <br />
              II: 90 degrees &lt; theta &lt; 180 degrees
              <br />
              III: -180 degrees &lt; theta &lt; -90 degrees
              <br />
              IV: -90 degrees &lt; theta &lt; 0 degrees
            </p>
          </div>
          <QuadrantDiagram />
        </article>
      </section>

      <nav className="pf371-nav">
        <a href="/lessons/advanced-mathematics/370-modulus-and-argument">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Modulus and Argument
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/372-euler-form">
          <span>
            <small>NEXT</small>Euler Form
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
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="pf371-control">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min="-10"
          max="10"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min="-10"
          max="10"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>-10</span>
        <span>10</span>
      </small>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  act,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="pf371-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />
    </label>
  );
}

function MiniDiagram() {
  return (
    <svg viewBox="0 0 180 105">
      <path d="M16 88H171M37 100V8" />
      <path d="M37 88L135 25M135 25V88M37 25H135" className="vector" />
      <circle cx="135" cy="25" r="4" />
      <text x="141" y="22">
        3 + 4i
      </text>
      <text x="75" y="54">
        r = 5
      </text>
      <text x="128" y="101">
        3
      </text>
      <text x="25" y="31">
        4
      </text>
    </svg>
  );
}

function QuadrantDiagram() {
  return (
    <svg viewBox="0 0 260 160">
      <path d="M15 80H247M130 148V8" />
      <circle className="quadrant-ring" cx="130" cy="80" r="43" />
      <path d="M174 80A44 44 0 0 0 160 48" className="angle" />
      <text x="191" y="38">
        I
      </text>
      <text x="56" y="38">
        II
      </text>
      <text x="49" y="132">
        III
      </text>
      <text x="194" y="132">
        IV
      </text>
      <text x="184" y="50">
        0 degrees &lt; theta &lt; 90 degrees
      </text>
      <text x="13" y="50">
        90 degrees &lt; theta &lt; 180 degrees
      </text>
      <text x="2" y="145">
        -180 degrees &lt; theta &lt; -90 degrees
      </text>
      <text x="174" y="145">
        -90 degrees &lt; theta &lt; 0 degrees
      </text>
    </svg>
  );
}
