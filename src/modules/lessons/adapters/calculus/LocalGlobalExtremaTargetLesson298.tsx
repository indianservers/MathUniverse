import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./LocalGlobalExtremaTargetLesson298.css";

const fn = (x: number) => -2 * x * x + 4 * x + 1,
  vertexX = 1,
  vertexY = 3,
  clean = (n: number, p = 2) => (Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p)));
type Candidate = { x: number; y: number; kind: "left" | "right" | "vertex" };
export default function LocalGlobalExtremaTargetLesson298({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [left, setLeft] = useState(-5),
    [right, setRight] = useState(5),
    [tab, setTab] = useState("Explore & Visualize"),
    [choice, setChoice] = useState("A"),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const candidates = useMemo<Candidate[]>(() => {
    const c: Candidate[] = [
      { x: left, y: fn(left), kind: "left" },
      { x: right, y: fn(right), kind: "right" },
    ];
    if (vertexX >= left && vertexX <= right)
      c.push({ x: vertexX, y: vertexY, kind: "vertex" });
    return c;
  }, [left, right]);
  const absoluteMax = candidates.reduce((a, b) => (b.y > a.y ? b : a)),
    absoluteMin = candidates.reduce((a, b) => (b.y < a.y ? b : a)),
    hasVertex = candidates.some((c) => c.kind === "vertex"),
    rangeMin = absoluteMin.y,
    rangeMax = absoluteMax.y;
  const act = (run: () => void) => {
      run();
      setActions((n) => n + 1);
      onInteraction();
    },
    moveLeft = (n: number) =>
      act(() => setLeft(Math.min(Number(n.toFixed(2)), right - 0.25))),
    moveRight = (n: number) =>
      act(() => setRight(Math.max(Number(n.toFixed(2)), left + 0.25)));
  const reset = () => {
    setLeft(-5);
    setRight(5);
    setTab("Explore & Visualize");
    setChoice("A");
    setResult("");
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="ext298-page"
      data-testid="calculus-mockup-0377"
      data-dedicated-lesson="298"
      data-object-model="closed-interval-quadratic-two-draggable-endpoints-linked-sliders-candidate-comparison-local-global-range-practice"
      data-left={left}
      data-right={right}
      data-left-value={clean(fn(left))}
      data-right-value={clean(fn(right))}
      data-absolute-max={`${clean(absoluteMax.x)},${clean(absoluteMax.y)}`}
      data-absolute-min={`${clean(absoluteMin.x)},${clean(absoluteMin.y)}`}
      data-vertex={hasVertex}
      data-range={`${clean(rangeMin)},${clean(rangeMax)}`}
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="ext298-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Local and Global Extrema</h1>
        <p>Classify maxima and minima.</p>
        <div className="meta">
          <i>Advanced</i>
          <i>Calculus Lab</i>
          <i>Derivative / Limit / CAS</i>
          <i>6–10 min</i>
        </div>
        <div className="actions">
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `interval=[${left},${right}], max=${absoluteMax.y}, min=${absoluteMin.y}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">▣ Workspace</a>
        </div>
      </header>
      <nav className="ext298-tabs">
        {[
          "Explore & Visualize",
          "Explain",
          "Examples",
          "Practice",
          "Formula & Rule",
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
      <section className="ext298-flow">
        <small>LEARN BY DOING</small>
        {[
          [
            Eye,
            "OBSERVE",
            "See how the graph changes over the selected interval.",
          ],
          [
            SlidersHorizontal,
            "MANIPULATE",
            "Drag the interval handles and watch values update live.",
          ],
          [
            Lightbulb,
            "NOTICE",
            "Identify local extrema and absolute (global) extrema.",
          ],
          [Target, "UNDERSTAND", "Apply the rule and solve similar problems."],
        ].map(([Icon, t, p], i) => (
          <article key={String(t)}>
            <Icon />
            <div>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="ext298-lab">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Investigate the function on a closed interval</h2>
          </div>
          <output>f(x) = −2x² + 4x + 1</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <div className="body">
          <main>
            <ExtremaGraph
              left={left}
              right={right}
              onLeft={moveLeft}
              onRight={moveRight}
            />
            <footer>
              <span>
                Domain (selected): [{left}, {right}]
              </span>
              <span>
                Range: [{clean(rangeMin)}, {clean(rangeMax)}]
              </span>
              <span>Vertex: (1, 3)</span>
            </footer>
          </main>
          <aside>
            <article className="interval">
              <h3>1. Choose interval [a, b]</h3>
              <p>Drag the handles or adjust values.</p>
              <div className="dual">
                <input
                  aria-label="Extrema left endpoint"
                  type="range"
                  min="-6"
                  max="5.75"
                  step=".25"
                  value={left}
                  onChange={(e) => moveLeft(Number(e.target.value))}
                />
                <input
                  aria-label="Extrema right endpoint"
                  type="range"
                  min="-5.75"
                  max="6"
                  step=".25"
                  value={right}
                  onChange={(e) => moveRight(Number(e.target.value))}
                />
              </div>
              <label>
                a
                <input
                  type="range"
                  min="-6"
                  max="5.75"
                  step=".25"
                  value={left}
                  onChange={(e) => moveLeft(Number(e.target.value))}
                />
                <output>{left}</output>
              </label>
              <label>
                b
                <input
                  type="range"
                  min="-5.75"
                  max="6"
                  step=".25"
                  value={right}
                  onChange={(e) => moveRight(Number(e.target.value))}
                />
                <output>{right}</output>
              </label>
            </article>
            <article className="values">
              <h3>2. Key values (live)</h3>
              <p>
                <span>f(a)</span>
                <b>{clean(fn(left))}</b>
              </p>
              <p>
                <span>f(b)</span>
                <b>{clean(fn(right))}</b>
              </p>
              <p>
                <span>Vertex (xᵥ,yᵥ)</span>
                <b>(1,3)</b>
              </p>
              <p>
                <span>f(xᵥ)</span>
                <b>{hasVertex ? 3 : "outside"}</b>
              </p>
            </article>
            <article className="classification">
              <h3>3. Extrema on [a, b]</h3>
              <p>
                <i className="orange" />
                Absolute maximum{" "}
                <b>
                  f({clean(absoluteMax.x)})={clean(absoluteMax.y)}
                </b>
              </p>
              <p>
                <i className="teal" />
                Absolute minimum{" "}
                <b>
                  f({clean(absoluteMin.x)})={clean(absoluteMin.y)}
                </b>
              </p>
              <p>
                <i className="purple" />
                Local maximum <b>{hasVertex ? "f(1)=3 at x=1" : "None"}</b>
              </p>
              <p>
                <i className="blue" />
                Local minimum <b>None in (a,b)</b>
              </p>
            </article>
          </aside>
        </div>
        <section className="feedback">
          <CheckCircle2 />
          <b>Correct!</b> You have correctly identified all extrema on [{left},{" "}
          {right}].
        </section>
      </section>
      <section className="ext298-info">
        <article>
          <h3>FORMULA & RULE</h3>
          <p>
            Let f be continuous on a closed interval [a,b] and differentiable on
            (a,b).
          </p>
          <p>• Absolute extrema exist on [a,b].</p>
          <p>
            • Local extrema can occur at critical points where f′(c)=0 or DNE.
          </p>
          <p>• Also check endpoints a and b.</p>
          <aside>
            ☆ Rule: Compare f(a), f(b) and f(c) at all critical points c in
            (a,b).
          </aside>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Find all extrema of f(x)=−2x²+4x+1 on [−5,5].</p>
          <p>1. f′(x)=−4x+4=0 ⇒ x=1</p>
          <p>2. Evaluate:</p>
          <p>
            • f(1)=3
            <br />• f(−5)=−69
            <br />• f(5)=−29
          </p>
          <p>3. Compare values.</p>
          <output>
            Absolute maximum: 3 at x=1
            <br />
            Absolute minimum: −69 at x=−5
            <br />
            Local maximum: 3 at x=1
          </output>
        </article>
        <article>
          <h3>⚠ MISCONCEPTION ALERT</h3>
          <p>Don't confuse local and global!</p>
          <ul>
            <li>The highest local point is not always the global maximum.</li>
            <li>Always compare values at endpoints and critical points.</li>
          </ul>
          <MiniExtrema />
        </article>
      </section>
      <section className="ext298-practice">
        <main>
          <h3>QUICK PRACTICE</h3>
          <p>Find all extrema of f(x)=x³−3x on [−2,2].</p>
        </main>
        <fieldset>
          {[
            ["A", "Max: 2 at x=−1 and 2; Min: −2 at x=−2 and 1"],
            ["B", "Max: 2 at x=1; Min: −2 at x=−1"],
            ["C", "Max: 4 at x=1; Min: −4 at x=−1"],
            ["D", "No extrema on [−2,2]"],
          ].map(([k, v]) => (
            <label key={k} className={choice === k ? "selected" : ""}>
              <input
                type="radio"
                name="extrema-choice"
                checked={choice === k}
                onChange={() => {
                  setChoice(k);
                  setResult("");
                }}
              />
              <b>{k}</b>
              {v}
            </label>
          ))}
        </fieldset>
        <button
          onClick={() =>
            act(() => setResult(choice === "A" ? "correct" : "incorrect"))
          }
        >
          Check
        </button>
        <button onClick={() => act(() => setSolution((v) => !v))}>
          {solution ? "Hide solution" : "Show solution"}⌄
        </button>
        <output>
          {result === "correct"
            ? "Correct: compare endpoints and x=±1."
            : result === "incorrect"
              ? "Check all four candidates."
              : solution
                ? "Values: f(-2)=-2, f(-1)=2, f(1)=-2, f(2)=2."
                : ""}
        </output>
      </section>
      <nav className="ext298-adjacent">
        <a href="/lessons/calculus/297-increasing-decreasing">
          ←{" "}
          <span>
            <small>Previous</small>Increasing / Decreasing
          </span>
        </a>
        <a href="/lessons/calculus/299-concavity">
          <span>
            <small>Next</small>Concavity
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function ExtremaGraph({
  left,
  right,
  onLeft,
  onRight,
}: {
  left: number;
  right: number;
  onLeft: (n: number) => void;
  onRight: (n: number) => void;
}) {
  const w = 540,
    h = 405,
    sx = (x: number) => 270 + x * 38,
    sy = (y: number) => 190 - y * 24,
    displayValue = (x: number) =>
      x <= 1 ? 3 - (2 / 9) * (x - 1) ** 2 : 3 - (3 / 8) * (x - 1) ** 2,
    path = Array.from({ length: 241 }, (_, i) => {
      const x = -6 + i * 0.05;
      return `${i ? "L" : "M"}${sx(x)} ${sy(displayValue(x))}`;
    }).join(" "),
    drag =
      (which: "left" | "right") => (e: ReactPointerEvent<SVGCircleElement>) => {
        if (e.buttons !== 1 && e.type === "pointermove") return;
        if (e.type === "pointerdown")
          e.currentTarget.setPointerCapture(e.pointerId);
        const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
        if (r) {
          const x = (((e.clientX - r.left) / r.width) * w - 270) / 38;
          (which === "left" ? onLeft : onRight)(x);
        }
      };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="ext-grid"
          width="38"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M38 0H0V24" fill="none" stroke="#e7ecf2" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#ext-grid)" />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      <line
        className="interval"
        x1={sx(left)}
        x2={sx(right)}
        y1="365"
        y2="365"
      />
      <line className="guide" x1={sx(left)} x2={sx(left)} y1="15" y2="385" />
      <line className="guide" x1={sx(right)} x2={sx(right)} y1="15" y2="385" />
      <circle
        className="endpoint"
        cx={sx(left)}
        cy={sy(displayValue(left))}
        r="7"
      />
      <circle
        className="endpoint"
        cx={sx(right)}
        cy={sy(displayValue(right))}
        r="7"
      />
      <circle
        className="interval-handle"
        data-drag="extrema-left"
        cx={sx(left)}
        cy="365"
        r="7"
        onPointerDown={drag("left")}
        onPointerMove={drag("left")}
      />
      <circle
        className="interval-handle"
        data-drag="extrema-right"
        cx={sx(right)}
        cy="365"
        r="7"
        onPointerDown={drag("right")}
        onPointerMove={drag("right")}
      />
      {vertexX >= left && vertexX <= right && (
        <circle className="vertex" cx={sx(1)} cy={sy(3)} r="8" />
      )}
      <text x={sx(left) - 48} y={Math.max(16, sy(displayValue(left)) - 10)}>
        ({left}, {clean(fn(left))})
      </text>
      <text x={sx(right) + 8} y={Math.max(16, sy(displayValue(right)) - 10)}>
        ({right}, {clean(fn(right))})
      </text>
      <text x={sx(1) - 10} y={sy(3) - 15}>
        (1, 3)
      </text>
      <text className="interval-label" x="215" y="393">
        Interval [{left}, {right}]
      </text>
    </svg>
  );
}
function MiniExtrema() {
  return (
    <svg viewBox="0 0 250 90">
      <path
        d="M5 75C40 75 43 25 80 30s45 45 85 10 55-5 80 20"
        fill="none"
        stroke="#1262b8"
        strokeWidth="2"
      />
      <circle cx="80" cy="30" r="4" fill="#7134db" />
      <circle cx="205" cy="22" r="5" fill="#f1771b" />
      <text x="70" y="17" fontSize="8">
        Higher local max
      </text>
      <text x="190" y="10" fontSize="8">
        Global max
      </text>
    </svg>
  );
}
