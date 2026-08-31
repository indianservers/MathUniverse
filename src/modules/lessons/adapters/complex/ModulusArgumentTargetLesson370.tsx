import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ModulusArgumentTargetLesson370.css";
type Pair = [number, number];
const clean = (n: number) => Number(n.toFixed(2));
const q = (a: number, b: number) =>
  a === 0 || b === 0
    ? "Axis"
    : a > 0 && b > 0
      ? "Quadrant I"
      : a < 0 && b > 0
        ? "Quadrant II"
        : a < 0 && b < 0
          ? "Quadrant III"
          : "Quadrant IV";
const ztext = ([a, b]: Pair) => a + (b < 0 ? " - " : " + ") + Math.abs(b) + "i";
export default function ModulusArgumentTargetLesson370({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([3, 4]),
    [dragging, setDragging] = useState(false),
    [ring, setRing] = useState(true),
    [triangle, setTriangle] = useState(true),
    [principal, setPrincipal] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [challenge, setChallenge] = useState(false),
    [actions, setActions] = useState(0);
  const modulus = clean(Math.hypot(...z)),
    argument = clean((Math.atan2(z[1], z[0]) * 180) / Math.PI),
    quadrant = q(...z);
  const reset = () => {
    setZ([3, 4]);
    setDragging(false);
    setRing(true);
    setTriangle(true);
    setPrincipal(true);
    setTab("Interaction + visualization");
    setChallenge(false);
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const px = (x: number) => 260 + x * 38,
    py = (y: number) => 330 - y * 38;
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - r.left) / r.width) * 520 - 260) / 38,
      y = (330 - ((e.clientY - r.top) / r.height) * 590) / 38;
    act(() =>
      setZ([
        clean(Math.max(-6, Math.min(6, x))),
        clean(Math.max(-6, Math.min(6, y))),
      ]),
    );
  };
  const update = (i: 0 | 1, v: number) =>
    act(() => setZ((p) => p.map((n, j) => (j === i ? v : n)) as Pair));
  return (
    <section
      className="ma370-page"
      data-testid="complex-mockup-0555"
      data-object-model="draggable-complex-point-live-modulus-principal-argument-quadrant-radius-ring-right-triangle-synchronized-controls-challenge"
      data-z={JSON.stringify(z)}
      data-modulus={modulus}
      data-argument={argument}
      data-quadrant={quadrant}
      data-ring={ring}
      data-triangle={triangle}
      data-principal={principal}
      data-tab={tab}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="ma370-hero">
        <div className="ma370-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Modulus and Argument</h1>
        <p>Measure polar properties.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div>
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
      <nav className="ma370-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Practice",
          "Know more",
        ].map((n) => (
          <button
            key={n}
            className={tab === n ? "active" : ""}
            onClick={() => act(() => setTab(n))}
          >
            {n}
          </button>
        ))}
      </nav>
      <section className="ma370-work">
        <article className="ma370-plane">
          <header>
            <h2>Explore on the Argand plane</h2>
            <p>Adjust a and b to see how modulus and argument change.</p>
          </header>
          <svg
            viewBox="0 0 520 590"
            onPointerMove={move}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            <defs>
              <pattern
                id="ma-grid"
                width="38"
                height="38"
                patternUnits="userSpaceOnUse"
              >
                <path d="M38 0H0V38" fill="none" stroke="#dce5ee" />
              </pattern>
            </defs>
            <rect x="25" y="25" width="470" height="525" fill="url(#ma-grid)" />
            <path d="M25 330H495M260 550V20" className="axis" />
            <text x="493" y="318">
              Re
            </text>
            <text x="270" y="23">
              Im
            </text>
            {[-6, -4, -2, 0, 2, 4, 6].map((n) => (
              <g key={n}>
                <text x={px(n)} y="349" textAnchor="middle">
                  {n}
                </text>
                <text x="247" y={py(n) + 4} textAnchor="end">
                  {n}
                </text>
              </g>
            ))}
            {ring && (
              <circle cx={px(0)} cy={py(0)} r={modulus * 38} className="ring" />
            )}
            {triangle && (
              <>
                <line
                  x1={px(z[0])}
                  y1={py(z[1])}
                  x2={px(z[0])}
                  y2={py(0)}
                  className="leg"
                />
                <line
                  x1={px(0)}
                  y1={py(0)}
                  x2={px(z[0])}
                  y2={py(0)}
                  className="leg"
                />
              </>
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(z[0])}
              y2={py(z[1])}
              className="radius"
            />
            <circle
              cx={px(z[0])}
              cy={py(z[1])}
              r="7"
              className="point"
              onPointerDown={() => setDragging(true)}
            />
            <text x={px(z[0]) + 12} y={py(z[1]) - 12} className="zlabel">
              z = {ztext(z)} ({z.join(", ")})
            </text>
            <text
              x={(px(0) + px(z[0])) / 2 - 20}
              y={(py(0) + py(z[1])) / 2}
              className="rlabel"
            >
              |z| = {modulus}
            </text>
            {principal && (
              <text x={px(0) + 50} y={py(0) - 28} className="angle">
                arg(z) ≈ {argument}°
              </text>
            )}
            <text x={px(z[0]) - 45} y={py(0) + 25} className="component">
              a = {z[0]}
            </text>
            <text
              x={px(z[0]) + 15}
              y={(py(0) + py(z[1])) / 2}
              className="component"
            >
              b = {z[1]}
            </text>
          </svg>
          <footer>
            Current z: <code>a + bi = {ztext(z)}</code>
          </footer>
        </article>
        <aside className="ma370-side">
          <section>
            <h2>Adjust complex number</h2>
            <p>Set the real part a and imaginary part b.</p>
            <Control
              label="Real part (a)"
              value={z[0]}
              onChange={(v) => update(0, v)}
            />
            <Control
              label="Imaginary part (b)"
              value={z[1]}
              onChange={(v) => update(1, v)}
            />
          </section>
          <section>
            <h2>Display options</h2>
            {[
              ["Show radius ring", ring, setRing],
              ["Show right triangle", triangle, setTriangle],
              ["Show principal argument", principal, setPrincipal],
            ].map(([n, c, s]) => (
              <label key={String(n)}>
                {String(n)}
                <input
                  aria-label={String(n)}
                  type="checkbox"
                  checked={Boolean(c)}
                  onChange={(e) =>
                    act(() =>
                      (s as React.Dispatch<React.SetStateAction<boolean>>)(
                        e.target.checked,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </section>
          <section className="ma370-results">
            <h2>Live results</h2>
            <strong>z = {ztext(z)}</strong>
            <strong>
              |z| = √({z[0]}² + {z[1]}²) = {modulus}
            </strong>
            <strong>
              arg(z) = atan2({z[1]}, {z[0]}) ≈ {argument}°
            </strong>
            <strong>{quadrant}</strong>
          </section>
        </aside>
      </section>
      <section className="ma370-learning">
        <article>
          <h2>Formula / Key insight</h2>
          <code>
            |a+bi|=√(a²+b²)
            <br />
            arg(a+bi)=atan2(b,a)
          </code>
          <p>
            Modulus is distance from the origin. Argument is the angle from the
            positive real axis.
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>For z=3+4i:</p>
          <code>
            |z|=√(3²+4²)=5
            <br />
            arg(z)=atan2(4,3)≈53.1°
          </code>
        </article>
        <article>
          <h2>Common misconception</h2>
          <p>A larger angle does not always mean a larger modulus.</p>
          <p>
            5+0i: angle 0°, |z|=5
            <br />
            1+i: angle 45°, |z|≈1.414
          </p>
        </article>
      </section>
      <section className="ma370-practice">
        <div>
          <h2>Practice challenge</h2>
          <p>
            For z=-4+3i, estimate the quadrant, modulus, and principal argument.
          </p>
          {challenge && <strong>Quadrant II, |z|=5, arg(z)≈143.13°</strong>}
        </div>
        <button onClick={() => act(() => setChallenge(!challenge))}>
          Check answer
        </button>
      </section>
      <nav className="ma370-nav">
        <a href="/lessons/advanced-mathematics/369-complex-conjugate">
          ←{" "}
          <span>
            <small>Previous lesson</small>Complex Conjugate
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/371-polar-form">
          <span>
            <small>Next lesson</small>Polar Form
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
  onChange: (n: number) => void;
}) {
  return (
    <label className="ma370-control">
      <b>
        {label}
        <input
          aria-label={label + " value"}
          type="number"
          min="-10"
          max="10"
          step=".1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </b>
      <input
        aria-label={label}
        type="range"
        min="-10"
        max="10"
        step=".1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        <i>-10</i>
        <i>0</i>
        <i>10</i>
      </small>
    </label>
  );
}
