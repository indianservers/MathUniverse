import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PowersTargetLesson373.css";

type Pair = [number, number];
const clean = (value: number, digits = 3) => Number(value.toFixed(digits));
const zText = ([a, b]: Pair) => `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}i`;

export default function PowersTargetLesson373({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([1, 1]);
  const [exponent, setExponent] = useState(3);
  const [trace, setTrace] = useState(true);
  const [growth, setGrowth] = useState(true);
  const [angles, setAngles] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [hint, setHint] = useState(false);
  const [reason, setReason] = useState(false);
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const dragRef = useRef(false);

  const rawRadius = Math.hypot(...z);
  const radius = clean(rawRadius);
  const theta = clean((Math.atan2(z[1], z[0]) * 180) / Math.PI, 1);
  const resultRadius = clean(rawRadius ** exponent);
  const resultTheta = clean(theta * exponent, 1);
  const result: Pair = [
    clean(resultRadius * Math.cos((resultTheta * Math.PI) / 180), 2),
    clean(resultRadius * Math.sin((resultTheta * Math.PI) / 180), 2),
  ];
  const count = Math.max(1, Math.min(3, Math.abs(exponent)));
  const sequence = Array.from({ length: count }, (_, index) => {
    const power = index + 1;
    const r = rawRadius ** power;
    const angle = theta * power;
    return {
      power,
      r: clean(r),
      angle: clean(angle, 1),
      point: [
        clean(r * Math.cos((angle * Math.PI) / 180), 2),
        clean(r * Math.sin((angle * Math.PI) / 180), 2),
      ] as Pair,
    };
  });

  const reset = () => {
    setZ([1, 1]);
    setExponent(3);
    setTrace(true);
    setGrowth(true);
    setAngles(true);
    setTab("Interaction + visualization");
    setHint(false);
    setReason(false);
    setAnswer("");
    setGrade("idle");
    setDragging(false);
    dragRef.current = false;
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const update = (index: 0 | 1, value: number) =>
    act(() =>
      setZ(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value, 1) : item,
          ) as Pair,
      ),
    );

  const origin = { x: 245, y: 263 },
    scale = 68;
  const sx = (x: number) => origin.x + x * scale,
    sy = (y: number) => origin.y - y * scale;
  const drag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x =
      (((event.clientX - bounds.left) / bounds.width) * 490 - origin.x) / scale;
    const y =
      (origin.y - ((event.clientY - bounds.top) / bounds.height) * 510) / scale;
    act(() =>
      setZ([
        clean(Math.max(-3, Math.min(3, x)), 1),
        clean(Math.max(-3, Math.min(3, y)), 1),
      ]),
    );
  };
  const normalizedAnswer = answer
    .toLowerCase()
    .replace(/\s|\*/g, "")
    .replace("√", "sqrt");
  const check = () =>
    act(() =>
      setGrade(
        ["2+2sqrt3i", "2+2sqrt(3)i"].includes(normalizedAnswer)
          ? "correct"
          : "incorrect",
      ),
    );

  return (
    <section
      className="pw373-page"
      data-testid="complex-mockup-0558"
      data-object-model="draggable-complex-base-de-moivre-integer-power-radius-growth-angle-multiplication-power-trace-typed-challenge"
      data-z={JSON.stringify(z)}
      data-exponent={exponent}
      data-radius={radius}
      data-theta={theta}
      data-result-radius={resultRadius}
      data-result-theta={resultTheta}
      data-result={JSON.stringify(result)}
      data-trace={trace}
      data-growth={growth}
      data-angles={angles}
      data-grade={grade}
      data-hint={hint}
      data-reason={reason}
      data-tab={tab}
      data-dragging={dragging}
      data-actions={actions}
    >
      <header className="pw373-hero">
        <div className="pw373-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Powers</h1>
        <p>Apply De Moivre's theorem.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="pw373-actions">
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
      <nav className="pw373-tabs">
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
      <section className="pw373-lab">
        <header>
          <div>
            <small>INTERACTION - DE MOIVRE POWER LAB</small>
            <h2>
              Visualize De Moivre's theorem: z^n = r^n(cos n theta + i sin n
              theta)
            </h2>
          </div>
          <span>Live exploration</span>
          <span>{actions} actions</span>
        </header>
        <div className="pw373-main">
          <article className="pw373-plane">
            <div className="pw373-legend">
              {sequence.map((item, index) => (
                <p
                  key={item.power}
                  style={{ color: ["#099cae", "#1767e5", "#9145e8"][index] }}
                >
                  |z^{item.power}| = {clean(item.r)}
                </p>
              ))}
            </div>
            <svg
              viewBox="0 0 490 510"
              onPointerMove={drag}
              onPointerUp={() => {
                dragRef.current = false;
                setDragging(false);
              }}
              onPointerLeave={() => {
                dragRef.current = false;
                setDragging(false);
              }}
            >
              <defs>
                <pattern
                  id="pw-grid"
                  width="68"
                  height="68"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M68 0H0V68" fill="none" stroke="#dce5ed" />
                </pattern>
              </defs>
              <rect width="490" height="510" fill="url(#pw-grid)" />
              <path d="M5 263H485M245 500V8" className="axis" />
              <path d="M485 263l-8-5v10zM245 8l-5 8h10z" className="arrow" />
              <text x="468" y="250">
                Re
              </text>
              <text x="256" y="16">
                Im
              </text>
              {[-3, -2, -1, 0, 1, 2, 3].map((number) => (
                <g key={number}>
                  <text x={sx(number)} y="281" textAnchor="middle">
                    {number}
                  </text>
                  <text x="233" y={sy(number) + 4} textAnchor="end">
                    {number}
                  </text>
                </g>
              ))}
              {growth &&
                sequence.map((item, index) => (
                  <circle
                    key={item.power}
                    cx={origin.x}
                    cy={origin.y}
                    r={Math.min(230, item.r * scale)}
                    className={`ring ring-${index}`}
                  />
                ))}
              {trace &&
                sequence.map((item, index) => (
                  <line
                    key={item.power}
                    x1={origin.x}
                    y1={origin.y}
                    x2={sx(item.point[0])}
                    y2={sy(item.point[1])}
                    className={`power power-${index}`}
                  />
                ))}
              {angles &&
                sequence.map((item, index) => (
                  <path
                    key={item.power}
                    d={`M${origin.x + 35 + index * 17} ${origin.y}A${35 + index * 17} ${35 + index * 17} 0 0 0 ${origin.x + (24 + index * 10) * Math.cos((item.angle * Math.PI) / 180)} ${origin.y - (24 + index * 10) * Math.sin((item.angle * Math.PI) / 180)}`}
                    className={`arc arc-${index}`}
                  />
                ))}
              {sequence.map((item, index) => (
                <g key={item.power}>
                  <circle
                    cx={sx(item.point[0])}
                    cy={sy(item.point[1])}
                    r="6"
                    className={`dot dot-${index}`}
                    onPointerDown={
                      index === 0
                        ? () => {
                            dragRef.current = true;
                            setDragging(true);
                          }
                        : undefined
                    }
                  />
                  <text
                    x={sx(item.point[0]) + 9}
                    y={sy(item.point[1]) - 9}
                    className={`label label-${index}`}
                  >
                    z^{item.power} ({item.point.join(", ")})
                  </text>
                  {angles && (
                    <text
                      x={origin.x + 45 + index * 35}
                      y={origin.y - 20 - index * 35}
                      className={`angle-label angle-${index}`}
                    >
                      {item.angle}°
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </article>
          <aside className="pw373-controls">
            <section>
              <h3>Base complex number z = a + bi</h3>
              <Control
                label="Real a"
                value={z[0]}
                min={-5}
                max={5}
                onChange={(value) => update(0, value)}
              />
              <Control
                label="Imaginary b"
                value={z[1]}
                min={-5}
                max={5}
                onChange={(value) => update(1, value)}
              />
            </section>
            <section>
              <Control
                label="Exponent n"
                value={exponent}
                min={-10}
                max={10}
                step={1}
                onChange={(value) =>
                  act(() => setExponent(value === 0 ? 1 : value))
                }
              />
            </section>
            <section>
              <h3>Visualization options</h3>
              <Toggle
                label="Show power trace"
                checked={trace}
                setter={setTrace}
                act={act}
              />
              <Toggle
                label="Show radius growth"
                checked={growth}
                setter={setGrowth}
                act={act}
              />
              <Toggle
                label="Show angle multiplication"
                checked={angles}
                setter={setAngles}
                act={act}
              />
            </section>
            <section className="pw373-results">
              <h3>Live results</h3>
              <p>z = {zText(z)}</p>
              <p>
                polar z = {radius}e^(i{theta}°)
              </p>
              <strong>
                z^{exponent} = {resultRadius}e^(i{resultTheta}°) ={" "}
                {zText(result)}
              </strong>
            </section>
          </aside>
        </div>
        <section className="pw373-steps">
          <h3>Step trace: apply De Moivre's theorem</h3>
          <div>
            <article>
              <i>1</i>
              <b>Write z in polar form</b>
              <p>
                z = {zText(z)}
                <br />= {radius}(cos {theta}° + i sin {theta}°)
                <br />= {radius}e^(i{theta}°)
              </p>
            </article>
            <b>→</b>
            <article>
              <i>2</i>
              <b>Multiply angle by n</b>
              <p>
                n theta = {exponent} x {theta}° = {resultTheta}°<br />
                Angle rotates {resultTheta}°
              </p>
            </article>
            <b>→</b>
            <article>
              <i>3</i>
              <b>Raise radius to n</b>
              <p>
                r^n = {radius}^{exponent} = {resultRadius}
                <br />
                New radius = {resultRadius}
              </p>
            </article>
          </div>
          <footer>
            ✓ Result by De Moivre's theorem{" "}
            <strong>
              z^{exponent} = {resultRadius}(cos {resultTheta}° + i sin{" "}
              {resultTheta}°) = {zText(result)}
            </strong>
          </footer>
        </section>
      </section>
      <section className="pw373-learning">
        <article>
          <h2>Formula vault</h2>
          <p>
            [r(cos theta + i sin theta)]^n
            <br />= r^n(cos n theta + i sin n theta)
          </p>
          <hr />
          <p>
            or
            <br />
            (re^(i theta))^n = r^n e^(i n theta)
          </p>
          <small>Works for any integer n.</small>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Compute (1 + i)^3.</p>
          <p>
            1 + i = sqrt(2)e^(i45°)
            <br />
            (1+i)^3=(sqrt2)^3 e^(i135°)
            <br />= 2sqrt2(cos135° + i sin135°)
            <br />= -2 + 2i
          </p>
          <strong>Answer: -2 + 2i</strong>
        </article>
        <article className="pw373-challenge">
          <h2>Practice challenge</h2>
          <p>Find (sqrt3 + i)^2 using polar form.</p>
          <button onClick={() => act(() => setHint(!hint))}>Reveal hint</button>
          {hint && (
            <small>r=2 and theta=30°, so square both with De Moivre.</small>
          )}
          <label>
            Your answer
            <input
              aria-label="Power challenge answer"
              value={answer}
              placeholder="Type complex number..."
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>
          <button onClick={check}>Check answer</button>
          {grade !== "idle" && (
            <strong className={grade}>
              {grade === "correct"
                ? "Correct: 2 + 2sqrt3i"
                : "Try the polar radius and doubled angle again."}
            </strong>
          )}
        </article>
        <article className="pw373-warning">
          <h2>Common misconception</h2>
          <p>(a + bi)^n is not a^n + b^n i</p>
          <p>Do not power real and imaginary parts separately.</p>
          <p>Use De Moivre's theorem or expand carefully.</p>
          <button onClick={() => act(() => setReason(!reason))}>See why</button>
          {reason && <small>Cross terms and i^2 change both components.</small>}
        </article>
      </section>
      <nav className="pw373-nav">
        <a href="/lessons/advanced-mathematics/372-euler-form">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Euler Form
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/374-roots">
          <span>
            <small>NEXT</small>Roots
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
  step = 0.1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="pw373-control">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>{min}</span>
        <span>{max}</span>
      </small>
    </label>
  );
}
function Toggle({
  label,
  checked,
  setter,
  act,
}: {
  label: string;
  checked: boolean;
  setter: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="pw373-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => setter(event.target.checked))}
      />
    </label>
  );
}
