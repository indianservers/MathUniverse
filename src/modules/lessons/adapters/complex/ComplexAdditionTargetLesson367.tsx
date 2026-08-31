import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexAdditionTargetLesson367.css";

type Pair = [number, number];
const clean = (n: number) => Number(n.toFixed(2));
const text = ([a, b]: Pair) => a + (b < 0 ? " - " : " + ") + Math.abs(b) + "i";

export default function ComplexAdditionTargetLesson367({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([2, 1]);
  const [w, setW] = useState<Pair>([-1, 3]);
  const [drag, setDrag] = useState<"z" | "w" | null>(null);
  const [tip, setTip] = useState(true);
  const [parallelogram, setParallelogram] = useState(true);
  const [components, setComponents] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [fullscreen, setFullscreen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [actions, setActions] = useState(0);
  const sum: Pair = [clean(z[0] + w[0]), clean(z[1] + w[1])];
  const reset = () => {
    setZ([2, 1]);
    setW([-1, 3]);
    setDrag(null);
    setTip(true);
    setParallelogram(true);
    setComponents(true);
    setTab("Interaction + visualization");
    setFullscreen(false);
    setRevealed(false);
    setActions(0);
  };
  const act = (work: () => void) => {
    work();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const px = (x: number) => 245 + x * 53;
  const py = (y: number) => 330 - y * 58;
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 520;
    const y = ((event.clientY - box.top) / box.height) * 620;
    const pair: Pair = [
      clean(Math.max(-3, Math.min(4, (x - 245) / 53))),
      clean(Math.max(-3, Math.min(4, (330 - y) / 58))),
    ];
    act(() => {
      if (drag === "z") setZ(pair);
      else setW(pair);
      setRevealed(false);
    });
  };
  const update = (which: "z" | "w", index: 0 | 1, value: number) =>
    act(() => {
      const setter = which === "z" ? setZ : setW;
      setter(
        (pair) => pair.map((part, i) => (i === index ? value : part)) as Pair,
      );
      setRevealed(false);
    });
  return (
    <section
      className={"ca367-page" + (fullscreen ? " fullscreen" : "")}
      data-testid="complex-mockup-0552"
      data-object-model="two-independent-draggable-complex-addends-tip-to-tail-parallelogram-component-sums-live-result-practice"
      data-z={JSON.stringify(z)}
      data-w={JSON.stringify(w)}
      data-sum={JSON.stringify(sum)}
      data-tip={tip}
      data-parallelogram={parallelogram}
      data-components={components}
      data-tab={tab}
      data-revealed={revealed}
      data-actions={actions}
    >
      <header className="ca367-hero">
        <div className="ca367-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Complex Addition</h1>
        <p>Visualise vector addition.</p>
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
      <nav className="ca367-tabs">
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
      <section className="ca367-work">
        <article className="ca367-lab">
          <header>
            <div>
              <b>VECTOR ADDITION LAB</b>
              <p>Add complex numbers as vectors on the Argand plane.</p>
            </div>
            <button onClick={() => act(() => setFullscreen(!fullscreen))}>
              <Maximize2 />
              Fullscreen
            </button>
          </header>
          <svg
            viewBox="0 0 520 620"
            onPointerMove={move}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="ca-grid"
                width="53"
                height="58"
                patternUnits="userSpaceOnUse"
              >
                <path d="M53 0H0V58" fill="none" stroke="#dce5ee" />
              </pattern>
              <marker
                id="ca-cyan"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#08a7c6" />
              </marker>
              <marker
                id="ca-purple"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#8a48ed" />
              </marker>
              <marker
                id="ca-blue"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#1256ff" />
              </marker>
            </defs>
            <rect x="30" y="40" width="455" height="500" fill="url(#ca-grid)" />
            <path d="M30 330H490M245 545V35" className="axis" />
            <text x="490" y="319">
              Re
            </text>
            <text x="235" y="25">
              Im
            </text>
            {[-3, -2, -1, 0, 1, 2, 3, 4].map((n) => (
              <g key={n}>
                <text x={px(n)} y="351" textAnchor="middle">
                  {n}
                </text>
                <text x="232" y={py(n) + 4} textAnchor="end">
                  {n}
                </text>
              </g>
            ))}
            {parallelogram && (
              <>
                <line
                  x1={px(z[0])}
                  y1={py(z[1])}
                  x2={px(sum[0])}
                  y2={py(sum[1])}
                  className="parallel z"
                />
                <line
                  x1={px(w[0])}
                  y1={py(w[1])}
                  x2={px(sum[0])}
                  y2={py(sum[1])}
                  className="parallel w"
                />
              </>
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(z[0])}
              y2={py(z[1])}
              className="z-vector"
              markerEnd="url(#ca-cyan)"
            />
            {tip && (
              <line
                x1={px(z[0])}
                y1={py(z[1])}
                x2={px(sum[0])}
                y2={py(sum[1])}
                className="w-vector"
                markerEnd="url(#ca-purple)"
              />
            )}
            {!tip && (
              <line
                x1={px(0)}
                y1={py(0)}
                x2={px(w[0])}
                y2={py(w[1])}
                className="w-vector"
                markerEnd="url(#ca-purple)"
              />
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(sum[0])}
              y2={py(sum[1])}
              className="sum-vector"
              markerEnd="url(#ca-blue)"
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
              cx={px(sum[0])}
              cy={py(sum[1])}
              r="6"
              className="sum-point"
            />
            <text x={px(z[0]) + 12} y={py(z[1]) + 25} className="z-label">
              z = {text(z)}
            </text>
            <text x={px(sum[0]) + 36} y={py(sum[1]) + 38} className="w-label">
              w = {text(w)}
            </text>
            <text
              x={px(sum[0]) - 150}
              y={py(sum[1]) + 75}
              className="sum-label"
            >
              z + w = {text(sum)}
            </text>
            {components && (
              <>
                <line
                  x1={px(sum[0])}
                  y1={py(sum[1])}
                  x2={px(sum[0])}
                  y2={py(0)}
                  className="component"
                />
                <line
                  x1={px(sum[0])}
                  y1={py(sum[1])}
                  x2={px(0)}
                  y2={py(sum[1])}
                  className="component"
                />
              </>
            )}
          </svg>
          <footer>
            <div>
              <p>
                <i />z <b>=</b> {text(z)} <span>({z.join(", ")})</span>
              </p>
              <p>
                <i />w <b>=</b> {text(w)} <span>({w.join(", ")})</span>
              </p>
              <p>
                <i />z + w <b>=</b> {text(sum)} <span>({sum.join(", ")})</span>
              </p>
            </div>
            <aside>
              <b>Tip</b>
              <p>
                Think of vectors: real parts move horizontally, imaginary parts
                move vertically.
              </p>
            </aside>
          </footer>
        </article>
        <aside className="ca367-controls">
          <h2>Adjust addends</h2>
          <section>
            <h3>Addend z = a + bi</h3>
            <Control
              label="Real part (a)"
              value={z[0]}
              onChange={(v) => update("z", 0, v)}
            />
            <Control
              label="Imaginary part (b)"
              value={z[1]}
              onChange={(v) => update("z", 1, v)}
            />
          </section>
          <section>
            <h3>Addend w = c + di</h3>
            <Control
              label="Real part (c)"
              value={w[0]}
              onChange={(v) => update("w", 0, v)}
            />
            <Control
              label="Imaginary part (d)"
              value={w[1]}
              onChange={(v) => update("w", 1, v)}
            />
          </section>
          <section>
            {[
              ["Tip-to-tail (z then w)", tip, setTip],
              ["Parallelogram", parallelogram, setParallelogram],
              ["Component sums", components, setComponents],
            ].map(([label, checked, setter]) => (
              <label key={String(label)}>
                {String(label)}
                <input
                  aria-label={String(label)}
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
          <section className="ca367-results">
            <h3>Live results</h3>
            <p>
              Real sum
              <strong>
                {z[0]} + ({w[0]}) = {sum[0]}
              </strong>
            </p>
            <p>
              Imaginary sum
              <strong>
                {z[1]} + {w[1]} = {sum[1]}
              </strong>
            </p>
            <p>
              z + w<strong>{text(sum)}</strong>
            </p>
            <aside>
              <b>Common misconception</b>
              <br />
              Do not add across coordinates: real combines with real, imaginary
              with imaginary.
            </aside>
          </section>
        </aside>
      </section>
      <section className="ca367-learning">
        <article>
          <h2>Formula / Rule</h2>
          <p>If z=a+bi and w=c+di, then</p>
          <code>(a+bi)+(c+di)=(a+c)+(b+d)i</code>
          <p>
            Real parts add separately.
            <br />
            Imaginary parts add separately.
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>
            Add the complex numbers:
            <br />
            (2+i)+(-1+3i)
          </p>
          <code>
            =(2+(-1))+(1+3)i
            <br />= <b>1+4i</b>
          </code>
        </article>
        <article>
          <h2>Practice challenge</h2>
          <p>
            Add (-3+2i)+(5-i).
            <br />
            Predict the endpoint before checking.
          </p>
          <button onClick={() => act(() => setRevealed(!revealed))}>
            Reveal answer
          </button>
          {revealed && <strong>2+i at (2,1)</strong>}
        </article>
      </section>
      <nav className="ca367-nav">
        <a href="/lessons/advanced-mathematics/366-real-and-imaginary-parts">
          ←{" "}
          <span>
            <small>Previous</small>Real and Imaginary Parts
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/368-complex-multiplication">
          <span>
            <small>Next</small>Complex Multiplication
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
    <label className="ca367-control">
      <span>
        {label}
        <input
          aria-label={label + " value"}
          type="number"
          min="-10"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </span>
      <input
        aria-label={label}
        type="range"
        min="-10"
        max="10"
        step=".1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
