import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ConcavityTargetLesson299.css";

type Model = {
  name: string;
  f: (x: number) => number;
  fp: (x: number) => number;
  fpp: (x: number) => number;
  roots: number[];
  derivative: string;
  second: string;
};
const models: Model[] = [
  {
    name: "f(x) = −8x⁴ + 4x³",
    f: (x) => -8 * x ** 4 + 4 * x ** 3,
    fp: (x) => -32 * x ** 3 + 12 * x ** 2,
    fpp: (x) => -96 * x * x + 24 * x,
    roots: [0, 0.25],
    derivative: "f′(x)=−32x³+12x²",
    second: "f″(x)=−96x²+24x",
  },
  {
    name: "f(x) = x⁴ − 4x²",
    f: (x) => x ** 4 - 4 * x * x,
    fp: (x) => 4 * x ** 3 - 8 * x,
    fpp: (x) => 12 * x * x - 8,
    roots: [-Math.sqrt(2 / 3), Math.sqrt(2 / 3)],
    derivative: "f′(x)=4x³−8x",
    second: "f″(x)=12x²−8",
  },
  {
    name: "f(x) = x³ − 3x",
    f: (x) => x ** 3 - 3 * x,
    fp: (x) => 3 * x * x - 3,
    fpp: (x) => 6 * x,
    roots: [0],
    derivative: "f′(x)=3x²−3",
    second: "f″(x)=6x",
  },
];
const clean = (n: number, p = 4) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));
export default function ConcavityTargetLesson299({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [modelIndex, setModelIndex] = useState(0),
    [x, setX] = useState(-1.2),
    [h, setH] = useState(0.2),
    [tab, setTab] = useState("Interaction + visualization"),
    [choice, setChoice] = useState("C"),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const model = models[modelIndex],
    f = model.f(x),
    fp = model.fp(x),
    fpp = model.fpp(x),
    approx = (model.f(x + h) - 2 * f + model.f(x - h)) / (h * h),
    concavity =
      fpp > 1e-8
        ? "Concave up"
        : fpp < -1e-8
          ? "Concave down"
          : "Inflection candidate";
  const act = (run: () => void) => {
      run();
      setActions((n) => n + 1);
      onInteraction();
    },
    move = (n: number) =>
      act(() => setX(Math.max(-3.5, Math.min(3.5, Number(n.toFixed(3))))));
  const reset = () => {
    setModelIndex(0);
    setX(-1.2);
    setH(0.2);
    setTab("Interaction + visualization");
    setChoice("C");
    setResult("");
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="con299-page"
      data-testid="calculus-mockup-0378"
      data-dedicated-lesson="299"
      data-object-model="selectable-analytic-functions-shared-x-direct-graph-drag-finite-step-second-derivative-synchronized-graphs-sign-regions-inflection-practice"
      data-model={modelIndex}
      data-x={x}
      data-h={h}
      data-f={clean(f)}
      data-fp={clean(fp)}
      data-fpp={clean(fpp)}
      data-approx={clean(approx)}
      data-concavity={concavity}
      data-roots={model.roots.map((r) => clean(r, 3)).join(",")}
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="con299-hero">
        <main>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Concavity</h1>
          <p>Use second derivative signs.</p>
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
                    `${model.name}, x=${x}, f''=${fpp}`,
                  ),
                )
              }
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/calculus">↗ Workspace</a>
          </div>
        </main>
        <aside>
          <h3>In this lesson you will</h3>
          <p>● Observe how slopes change.</p>
          <p>● Manipulate h and see instant feedback.</p>
          <p>● Notice concavity from f″(x).</p>
          <p>● Understand the rule and apply it.</p>
        </aside>
      </header>
      <nav className="con299-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
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
      <section className="con299-main">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Explore concavity with linked f(x) and f″(x) graphs</h2>
          </div>
          <b>Interactive</b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <section className="workspace">
          <aside>
            <label>
              <b>1</b> Function
              <select
                aria-label="Concavity function"
                value={modelIndex}
                onChange={(e) =>
                  act(() => setModelIndex(Number(e.target.value)))
                }
              >
                {models.map((m, i) => (
                  <option key={m.name} value={i}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <b>2</b> Tangent slider (x)
              <small>−3.5 to 3.5</small>
              <input
                aria-label="Concavity x"
                type="range"
                min="-3.5"
                max="3.5"
                step=".01"
                value={x}
                onChange={(e) => move(Number(e.target.value))}
              />
              <output>{x.toFixed(2)}</output>
            </label>
            <label>
              <b>3</b> Step size (h)<small>0.01 to 1.00</small>
              <input
                aria-label="Concavity h"
                type="range"
                min=".01"
                max="1"
                step=".01"
                value={h}
                onChange={(e) => act(() => setH(Number(e.target.value)))}
              />
              <output>{h.toFixed(2)}</output>
            </label>
            <article>
              <h3>At x = {x.toFixed(2)}</h3>
              <p>
                <span>f(x)</span>
                <b>{clean(f)}</b>
              </p>
              <p>
                <span>f′(x)</span>
                <b>{clean(fp)}</b>
              </p>
              <p>
                <span>f″(x)</span>
                <b>{clean(fpp)}</b>
              </p>
              <p>
                <span>Finite f″</span>
                <b>{clean(approx)}</b>
              </p>
              <div className="verdict">
                <CheckCircle2 />
                <b>{concavity}</b>
                <small>error {Math.abs(approx - fpp).toFixed(4)}</small>
              </div>
            </article>
          </aside>
          <main>
            <ConcavityGraphs model={model} x={x} onX={move} />
          </main>
        </section>
        <section className="con299-flow">
          {[
            [
              Eye,
              "OBSERVE",
              "Watch how slopes change. Move the slider. When slopes increase, the graph bends up.",
            ],
            [
              Hand,
              "MANIPULATE",
              "Adjust x and step size h. Smaller h gives a more precise finite f″ estimate.",
            ],
            [
              Lightbulb,
              "NOTICE",
              "Sign of f″ tells the story: positive bends up, negative bends down.",
            ],
            [
              Target,
              "UNDERSTAND",
              "The sign of the second derivative determines concavity.",
            ],
          ].map(([Icon, t, p]) => (
            <article key={String(t)}>
              <Icon />
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </section>
        <section className="con299-info">
          <article>
            <h3>▣ Rule (Concavity Test)</h3>
            <p>Let f be twice differentiable on an open interval I.</p>
            <p>• If f″(x)&gt;0 on I, f is concave up.</p>
            <p>• If f″(x)&lt;0 on I, f is concave down.</p>
            <p>• If f″ changes sign at c, f has an inflection point.</p>
          </article>
          <article>
            <h3>Worked Example (this function)</h3>
            <p>Given {model.name}</p>
            <p>{model.derivative}</p>
            <p>{model.second}</p>
            <p>
              Inflection candidates:{" "}
              {model.roots.map((r) => clean(r, 3)).join(", ")}
            </p>
            <p>Test each interval using the sign of f″.</p>
          </article>
          <article>
            <h3>⚠ Common Misconception</h3>
            <p>
              Thinking “above the x-axis” or “below the x-axis” decides
              concavity.
            </p>
            <p>✕ Wrong: Graph position doesn't determine concavity.</p>
            <p>
              ✓ Right: Concavity depends on the sign of f″ (slope behavior), not
              the height of f.
            </p>
          </article>
        </section>
        <section className="con299-practice">
          <header>
            <h3>▣ Practice Challenge</h3>
            <p>For f(x)=x³−3x, find concavity and the inflection point(s).</p>
            <button onClick={() => act(() => setSolution((v) => !v))}>
              {solution ? "Hide solution" : "Show solution"}
            </button>
          </header>
          <fieldset>
            {[
              ["A", "Concave up: x>1; down: x<1; inflection x=1"],
              ["B", "Concave up: x<−1; down: x>−1; inflection x=−1"],
              ["C", "Concave up: x>0; down: x<0; inflection x=0"],
              ["D", "Concave up: all real x; no inflection"],
            ].map(([k, v]) => (
              <label key={k} className={choice === k ? "selected" : ""}>
                <input
                  type="radio"
                  name="concavity-choice"
                  checked={choice === k}
                  onChange={() => {
                    setChoice(k);
                    setResult("");
                  }}
                />
                <b>{k}</b>
                <span>{v}</span>
              </label>
            ))}
          </fieldset>
          <button
            onClick={() =>
              act(() => setResult(choice === "C" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <output>
            {result === "correct"
              ? "Correct: f″(x)=6x changes sign at 0."
              : result === "incorrect"
                ? "Differentiate twice and test signs."
                : solution
                  ? "f″(x)=6x: negative left of 0, positive right of 0."
                  : ""}
          </output>
        </section>
      </section>
      <nav className="con299-adjacent">
        <a href="/lessons/calculus/298-local-and-global-extrema">
          ←{" "}
          <span>
            <small>Previous</small>Local and Global Extrema
          </span>
        </a>
        <a href="/lessons/calculus/300-inflection-points">
          <span>
            <small>Next</small>Inflection Points
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function ConcavityGraphs({
  model,
  x,
  onX,
}: {
  model: Model;
  x: number;
  onX: (n: number) => void;
}) {
  const w = 530,
    h = 590,
    sx = (n: number) => 265 + n * 72,
    topY = (n: number) => 150 - Math.tanh(n / 12) * 115,
    bottomY = (n: number) => 435 - Math.tanh(n / 80) * 105,
    path = (fn: (n: number) => number, sy: (n: number) => number) =>
      Array.from({ length: 351 }, (_, i) => {
        const q = -3.5 + i * 0.02;
        return `${i ? "L" : "M"}${sx(q)} ${sy(fn(q))}`;
      }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 265) / 72);
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="con-grid"
          width="36"
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <path d="M36 0H0V35" fill="none" stroke="#e7edf3" />
        </pattern>
      </defs>
      <rect width={w} height="270" fill="url(#con-grid)" />
      <rect y="310" width={w} height="245" fill="url(#con-grid)" />
      <text x="0" y="20">
        f(x)
      </text>
      <line className="axis" x1="0" x2={w} y1="150" y2="150" />
      <line className="axis" x1="265" x2="265" y1="25" y2="275" />
      <path className="function" d={path(model.f, topY)} />
      <line className="cursor" x1={sx(x)} x2={sx(x)} y1="30" y2="565" />
      <line
        className="tangent"
        x1={sx(x - 1)}
        x2={sx(x + 1)}
        y1={topY(model.f(x) - model.fp(x))}
        y2={topY(model.f(x) + model.fp(x))}
      />
      <circle
        data-drag="concavity-point"
        cx={sx(x)}
        cy={topY(model.f(x))}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(x) - 25} y="290">
        x={x.toFixed(2)}
      </text>
      <text x="0" y="325">
        f″(x)
      </text>
      <rect className="positive" x="0" y="330" width={w} height="225" />
      <path className="second" d={path(model.fpp, bottomY)} />
      <line className="axis" x1="0" x2={w} y1="435" y2="435" />
      <line className="axis" x1="265" x2="265" y1="320" y2="565" />
      {model.roots.map((r) => (
        <g key={r}>
          <line
            className="root-guide"
            x1={sx(r)}
            x2={sx(r)}
            y1="330"
            y2="565"
          />
          <circle className="root" cx={sx(r)} cy="435" r="5" />
        </g>
      ))}
      <text className="legend" x="315" y="342">
        {model.second}
      </text>
    </svg>
  );
}
