import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexMultiplicationTargetLesson368.css";

type Pair = [number, number];
const clean = (n: number) => Number(n.toFixed(4));
const label = ([a, b]: Pair) => a + (b < 0 ? " - " : " + ") + Math.abs(b) + "i";
const modulus = ([a, b]: Pair) => clean(Math.hypot(a, b));
const argument = ([a, b]: Pair) => clean((Math.atan2(b, a) * 180) / Math.PI);
const multiply = ([a, b]: Pair, [c, d]: Pair): Pair => [
  clean(a * c - b * d),
  clean(a * d + b * c),
];

export default function ComplexMultiplicationTargetLesson368({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([2, 1]),
    [w, setW] = useState<Pair>([1, 1]);
  const [drag, setDrag] = useState<"z" | "w" | null>(null),
    [tab, setTab] = useState("Interaction + visualization");
  const [algebra, setAlgebra] = useState(true),
    [rotation, setRotation] = useState(true),
    [scale, setScale] = useState(true),
    [trace, setTrace] = useState(true);
  const [challenge, setChallenge] = useState(false),
    [direction, setDirection] = useState(""),
    [verdict, setVerdict] = useState(""),
    [actions, setActions] = useState(0);
  const product = multiply(z, w),
    scaleFactor = modulus(w),
    rotationAdded = argument(w);
  const reset = () => {
    setZ([2, 1]);
    setW([1, 1]);
    setDrag(null);
    setTab("Interaction + visualization");
    setAlgebra(true);
    setRotation(true);
    setScale(true);
    setTrace(true);
    setChallenge(false);
    setDirection("");
    setVerdict("");
    setActions(0);
  };
  const act = (work: () => void) => {
    work();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const px = (x: number) => 250 + x * 55,
    py = (y: number) => 280 - y * 62;
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = (((event.clientX - box.left) / box.width) * 500 - 250) / 55,
      y = (280 - ((event.clientY - box.top) / box.height) * 560) / 62,
      pair: Pair = [
        clean(Math.max(-3, Math.min(3, x))),
        clean(Math.max(-3, Math.min(3, y))),
      ];
    act(() => {
      (drag === "z" ? setZ : setW)(pair);
      setVerdict("");
    });
  };
  const update = (which: "z" | "w", index: 0 | 1, value: number) =>
    act(() => {
      (which === "z" ? setZ : setW)(
        (pair) => pair.map((part, i) => (i === index ? value : part)) as Pair,
      );
      setVerdict("");
    });
  const check = () =>
    act(() => setVerdict(direction === "clockwise" ? "correct" : "incorrect"));
  return (
    <section
      className="cm368-page"
      data-testid="complex-mockup-0553"
      data-object-model="two-draggable-complex-factors-rectangular-expansion-modulus-product-argument-sum-scale-rotation-trace-graded-direction"
      data-z={JSON.stringify(z)}
      data-w={JSON.stringify(w)}
      data-product={JSON.stringify(product)}
      data-scale={scaleFactor}
      data-rotation={rotationAdded}
      data-algebra={algebra}
      data-show-rotation={rotation}
      data-show-scale={scale}
      data-trace={trace}
      data-tab={tab}
      data-challenge={challenge}
      data-verdict={verdict}
      data-actions={actions}
    >
      <header className="cm368-hero">
        <h1>Complex Multiplication</h1>
        <p>Interpret scaling and rotation.</p>
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
      <nav className="cm368-tabs">
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
      <section className="cm368-work">
        <article className="cm368-plane">
          <header>
            <h2>Argand Plane: multiplication as scaling + rotation</h2>
            <button title="Expand graph" onClick={() => act(() => {})}>
              <Maximize2 />
            </button>
          </header>
          <svg
            viewBox="0 0 500 560"
            onPointerMove={move}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="cm-grid"
                width="55"
                height="62"
                patternUnits="userSpaceOnUse"
              >
                <path d="M55 0H0V62" fill="none" stroke="#dce5ee" />
              </pattern>
              <marker
                id="cm-cyan"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#08a8c8" />
              </marker>
              <marker
                id="cm-purple"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#8b4ae8" />
              </marker>
              <marker
                id="cm-blue"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#243cff" />
              </marker>
            </defs>
            <rect x="25" y="30" width="450" height="490" fill="url(#cm-grid)" />
            <path d="M25 280H475M250 520V25" className="axis" />
            <text x="472" y="269">
              Re
            </text>
            <text x="239" y="21">
              Im
            </text>
            {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
              <g key={n}>
                <text x={px(n)} y="299" textAnchor="middle">
                  {n}
                </text>
                <text x="238" y={py(n) + 4} textAnchor="end">
                  {n}
                </text>
              </g>
            ))}
            {scale &&
              [modulus(z), modulus(product)].map((r, i) => (
                <circle
                  key={i}
                  cx={px(0)}
                  cy={py(0)}
                  r={r * 55}
                  className="modulus-circle"
                />
              ))}
            {trace && (
              <line
                x1={px(z[0])}
                y1={py(z[1])}
                x2={px(product[0])}
                y2={py(product[1])}
                className="product-trace"
              />
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(z[0])}
              y2={py(z[1])}
              className="z-vector"
              markerEnd="url(#cm-cyan)"
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(w[0])}
              y2={py(w[1])}
              className="w-vector"
              markerEnd="url(#cm-purple)"
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(product[0])}
              y2={py(product[1])}
              className="product-vector"
              markerEnd="url(#cm-blue)"
            />
            <circle
              cx={px(z[0])}
              cy={py(z[1])}
              r="7"
              className="z-point"
              onPointerDown={() => setDrag("z")}
            />
            <circle
              cx={px(w[0])}
              cy={py(w[1])}
              r="7"
              className="w-point"
              onPointerDown={() => setDrag("w")}
            />
            <circle
              cx={px(product[0])}
              cy={py(product[1])}
              r="6"
              className="product-point"
            />
            <text x={px(z[0]) + 10} y={py(z[1]) - 8} className="z-label">
              z = {label(z)}
            </text>
            <text x={px(w[0]) - 100} y={py(w[1]) + 35} className="w-label">
              multiplier w = {label(w)}
            </text>
            <text
              x={px(product[0]) + 10}
              y={py(product[1]) - 8}
              className="product-label"
            >
              zw = {label(product)}
            </text>
            {rotation && (
              <text x="306" y="250" className="angle">
                +{rotationAdded}°
              </text>
            )}
          </svg>
          <footer>
            <div>
              <i />z = {label(z)} (original)
            </div>
            <div>
              <i />w = {label(w)} (multiplier)
            </div>
            <div>
              <i />
              zw = {label(product)} (product)
            </div>
            <p>
              <strong>|w| = {scaleFactor}</strong>Scale factor
            </p>
            <p>
              <strong>arg(w) = {rotationAdded}°</strong>Rotation added
            </p>
          </footer>
        </article>
        <aside className="cm368-controls">
          <h2>Set complex numbers</h2>
          <section>
            <h3>z = a + bi (original)</h3>
            <Control
              label="a (real)"
              value={z[0]}
              onChange={(v) => update("z", 0, v)}
            />
            <Control
              label="b (imag)"
              value={z[1]}
              onChange={(v) => update("z", 1, v)}
            />
          </section>
          <section>
            <h3>w = c + di (multiplier)</h3>
            <Control
              label="c (real)"
              value={w[0]}
              onChange={(v) => update("w", 0, v)}
            />
            <Control
              label="d (imag)"
              value={w[1]}
              onChange={(v) => update("w", 1, v)}
            />
          </section>
          <section>
            {[
              ["Show algebra", algebra, setAlgebra],
              ["Show rotation", rotation, setRotation],
              ["Show scale factor", scale, setScale],
              ["Show product trace", trace, setTrace],
            ].map(([name, checked, setter]) => (
              <label key={String(name)}>
                {String(name)}
                <input
                  aria-label={String(name)}
                  type="checkbox"
                  checked={Boolean(checked)}
                  onChange={(e) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                        e.target.checked,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </section>
          <section className="cm368-results">
            <h3>Live results</h3>
            {algebra && (
              <p>
                Algebra
                <strong>
                  ({label(z)})({label(w)}) = {label(product)}
                </strong>
              </p>
            )}
            <p>
              Scale (modulus)<strong>|zw| = |z||w| = {modulus(product)}</strong>
            </p>
            <p>
              Angle (argument)
              <strong>
                arg(zw) = {argument(z)}° + {rotationAdded}° ={" "}
                {argument(product)}°
              </strong>
            </p>
          </section>
        </aside>
      </section>
      <section className="cm368-learning">
        <article>
          <h2>Formula / Rule</h2>
          <code>(a+bi)(c+di)=(ac-bd)+(ad+bc)i</code>
          <p>In polar form: moduli multiply, arguments add.</p>
        </article>
        <article>
          <h2>Worked Example</h2>
          <p>Multiply (2+i)(1+i).</p>
          <code>
            2+2i+i+i²
            <br />= 1+3i
          </code>
          <strong>Thus, (2+i)(1+i)=1+3i.</strong>
        </article>
        <article>
          <h2>Practice Challenge</h2>
          <p>
            Multiply (1+2i)(2-i). Predict whether the result rotates clockwise
            or counterclockwise.
          </p>
          {!challenge ? (
            <button onClick={() => act(() => setChallenge(true))}>
              Try It Yourself
            </button>
          ) : (
            <>
              <select
                aria-label="Rotation direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="">Choose...</option>
                <option value="clockwise">Clockwise</option>
                <option value="counterclockwise">Counterclockwise</option>
              </select>
              <button onClick={check}>Check</button>
              <output className={verdict}>
                {verdict === "correct"
                  ? "Correct: arg(2-i) is negative, so the rotation is clockwise."
                  : verdict === "incorrect"
                    ? "Check arg(2-i) carefully."
                    : ""}
              </output>
            </>
          )}
        </article>
      </section>
      <section className="cm368-warning">
        <b>Common Misconception</b>
        <p>
          Do not multiply coordinates separately. This ignores i² = -1. Always
          expand and combine like terms using complex arithmetic.
        </p>
      </section>
      <section className="cm368-deeper">
        <b>Think Deeper</b>
        <p>If w=-1+i, how will it scale and rotate any complex number z?</p>
        <button onClick={() => act(() => setW([-1, 1]))}>Explore</button>
      </section>
      <nav className="cm368-nav">
        <a href="/lessons/advanced-mathematics/367-complex-addition">
          ←{" "}
          <span>
            <small>Previous</small>Complex Addition
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/369-complex-conjugate">
          <span>
            <small>Next</small>Complex Conjugate
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function Control({
  label: caption,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="cm368-control">
      {caption}
      <input
        aria-label={caption}
        type="number"
        min="-3"
        max="3"
        step=".1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
