import {
  Check,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./OptimisationTargetLesson301.css";

const f = (x: number) => -x * x + 6 * x;
const fp = (x: number) => -2 * x + 6;
const clean = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));

export default function OptimisationTargetLesson301({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(3);
  const [h, setH] = useState(0.05);
  const [tab, setTab] = useState("Interaction + visualization");
  const [result, setResult] = useState<"" | "correct">("");
  const [solution, setSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const slope = fp(x);
  const finiteSlope = (f(x + h) - f(x - h)) / (2 * h);
  const reset = () => {
    setX(3);
    setH(0.05);
    setTab("Interaction + visualization");
    setResult("");
    setSolution(false);
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="opt301-page"
      data-testid="calculus-mockup-0380"
      data-dedicated-lesson="301"
      data-object-model="fixed-concave-quadratic-domain-critical-endpoint-comparison-direct-x-drag-finite-derivative-cas-optimisation-practice"
      data-x={clean(x)}
      data-h={h}
      data-f={clean(f(x))}
      data-slope={clean(slope)}
      data-finite-slope={clean(finiteSlope)}
      data-best-x="3"
      data-best-value="9"
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="opt301-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Optimisation</h1>
        <p>Apply derivatives to extrema problems.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Calculus Lab</i>
          <i>▣ Derivative / Limit / CAS</i>
          <i>◴ 6-10 min</i>
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
                navigator.clipboard?.writeText("Global maximum: f(3)=9"),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">↗ Workspace</a>
        </div>
      </header>
      <nav className="opt301-tabs">
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
      <section className="opt301-flow">
        {[
          {
            Icon: Eye,
            title: "Observe",
            text: "A concave-down curve has a single highest point.",
          },
          {
            Icon: Hand,
            title: "Manipulate",
            text: "Adjust x in the domain and see y change along f(x).",
          },
          {
            Icon: Sparkles,
            title: "Notice",
            text: "The graph rises then falls. The maximum occurs at the top.",
          },
          {
            Icon: Lightbulb,
            title: "Understand",
            text: "At the maximum, f'(x)=0 and f''(x)<0. Always check domain and ends.",
          },
        ].map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon />
            <div>
              <b>{title}</b>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="opt301-lab">
        <header>
          <h2>Work directly on the model</h2>
          <b>{actions ? "Model updated" : "Awaiting interaction"}</b>
          <output>{actions} actions</output>
          <button aria-label="Fullscreen">
            <Maximize2 />
          </button>
        </header>
        <main>
          <section className="model">
            <header>
              <h3>Optimisation - graph + CAS</h3>
              <output>f'(x) = -2x + 6</output>
            </header>
            <div className="chips">
              <b>f(x) = -x² + 6x</b>
              <b>Domain: x ∈ [-1, 7]</b>
              <b>Derivative: f'(x) = -2x + 6</b>
            </div>
            <OptimisationGraph x={x} onX={(next) => act(() => setX(next))} />
            <section className="candidates">
              <article>
                <b>Domain</b>
                <strong>[-1, 7]</strong>
                <p>Feasible values of x.</p>
              </article>
              <article>
                <b>Interior critical point</b>
                <strong>f'(x)=0 ⟹ x=3</strong>
                <p>Only solution in (-1, 7).</p>
              </article>
              <article>
                <b>Endpoints</b>
                <strong>
                  x=-1, f(-1)=-7
                  <br />
                  x=7, f(7)=-7
                </strong>
              </article>
            </section>
            <section className="optimum">
              <b>
                Optimum
                <br />
                <i>★</i>
              </b>
              <strong>
                Global maximum at x=3
                <br />
                <em>f(3)=9</em>
              </strong>
              <p>
                <Check /> Since f''(3)=-2&lt;0,
                <br />
                this is a maximum.
                <br />
                Highest value in domain.
              </p>
            </section>
          </section>
          <aside>
            <h3>Linked controls</h3>
            <label>
              x
              <input
                aria-label="Optimisation x"
                type="range"
                min="-1"
                max="7"
                step=".05"
                value={x}
                onChange={(e) => act(() => setX(Number(e.target.value)))}
              />
              <small>-1 to 7</small>
              <output>{clean(x)}</output>
            </label>
            <label>
              h (step)
              <input
                aria-label="Optimisation h"
                type="range"
                min=".01"
                max=".5"
                step=".01"
                value={h}
                onChange={(e) => act(() => setH(Number(e.target.value)))}
              />
              <small>0.01 to 0.50</small>
              <output>{h.toFixed(2)}</output>
            </label>
            <section>
              <h3>Model details</h3>
              <p>
                Function <b>f(x)=-x²+6x</b>
              </p>
              <p>
                Derivative <b>f'(x)=-2x+6</b>
              </p>
              <p>
                Second derivative <b>f''(x)=-2</b>
              </p>
              <p>
                Concavity <b>f''(x)&lt;0 (downward)</b>
              </p>
            </section>
            <div className="values">
              <span>
                Quantity<b>{f(x).toFixed(3)}</b>
              </span>
              <span>
                Slope at x<b>{slope.toFixed(3)}</b>
              </span>
              <span>
                Best value<b>9</b>
              </span>
              <span>
                CAS derivative<b>-2x+6</b>
              </span>
            </div>
          </aside>
        </main>
        <footer>
          <h3>How it works</h3>
          <div>
            <span>
              Inputs<small>(function + domain)</small>
            </span>
            →
            <span>
              Compute<small>(derivative, critical points)</small>
            </span>
            →
            <span>
              Evaluate<small>(candidates: interior + ends)</small>
            </span>
            →
            <span>
              Decide<small>(choose best value)</small>
            </span>
          </div>
        </footer>
      </section>
      <section className="opt301-info">
        <article>
          <h3>★ Key rule (Optimisation)</h3>
          <p>For a smooth function f on [a,b]:</p>
          <p>1. Find f'(x).</p>
          <p>2. Solve f'(x)=0 for interior critical points.</p>
          <p>3. Evaluate f at all candidates.</p>
          <p>
            4. The largest value is the maximum; the smallest is the minimum.
          </p>
        </article>
        <article>
          <h3>Worked example</h3>
          <p>Maximise f(x)=-x²+6x on [-1,7].</p>
          <p>f'(x)=-2x+6=0 ⟹ x=3.</p>
          <p>f(3)=9; f(-1)=f(7)=-7.</p>
          <output>Answer: Maximum is 9 at x=3.</output>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>Only checking where f'(x)=0 is not enough.</p>
          <b>Always compare critical points and both ends of the domain.</b>
          <MiniEndpoint />
        </article>
        <article>
          <h3>Quick challenge</h3>
          <p>Maximise f(x)=-x²+4x+1 on [0,6].</p>
          <p>
            Find critical points, evaluate candidates, and state the maximum.
          </p>
          <button onClick={() => act(() => setResult("correct"))}>
            Check answer
          </button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            Show solution
          </button>
          {(result || solution) && <output>x=2, maximum value 5.</output>}
        </article>
      </section>
      <nav className="opt301-adjacent">
        <a href="/lessons/calculus/300-inflection-points">
          ←{" "}
          <span>
            <small>Previous</small>Inflection Points
          </span>
        </a>
        <a href="/lessons/calculus/302-related-rates">
          <span>
            <small>Next</small>Related Rates
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function OptimisationGraph({
  x,
  onX,
}: {
  x: number;
  onX: (x: number) => void;
}) {
  const w = 540,
    h = 300,
    sx = (n: number) => 82 + (n + 1) * 55,
    sy = (n: number) => 178 - n * 14;
  const path = Array.from({ length: 161 }, (_, i) => {
    const n = -1 + i * 0.05;
    return `${i ? "L" : "M"}${sx(n)} ${sy(f(n))}`;
  }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1 && e.type === "pointermove") return;
    if (e.type === "pointerdown")
      e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (r)
      onX(
        Math.max(
          -1,
          Math.min(7, (((e.clientX - r.left) / r.width) * w - 82) / 55 - 1),
        ),
      );
  };
  return (
    <svg className="opt301-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="opt-grid"
          width="55"
          height="42"
          patternUnits="userSpaceOnUse"
        >
          <path d="M55 0H0V42" fill="none" stroke="#e7edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#opt-grid)" />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      <line className="domain" x1={sx(-1)} x2={sx(-1)} y1="25" y2="275" />
      <line className="domain" x1={sx(7)} x2={sx(7)} y1="25" y2="275" />
      <line className="critical" x1={sx(3)} x2={sx(3)} y1={sy(9)} y2={sy(0)} />
      <circle className="peak" cx={sx(3)} cy={sy(9)} r="6" />
      <text x={sx(3) + 8} y={sy(9) - 8}>
        (3, 9)
      </text>
      <circle
        data-drag="optimisation-point"
        cx={sx(x)}
        cy={sy(f(x))}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
    </svg>
  );
}
function MiniEndpoint() {
  return (
    <svg viewBox="0 0 170 65">
      <path
        d="M8 50C35 10 55 50 90 35S125 46 158 12"
        fill="none"
        stroke="#ef4057"
        strokeWidth="2"
      />
      <line
        x1="158"
        x2="158"
        y1="10"
        y2="58"
        stroke="#ef4057"
        strokeDasharray="3 3"
      />
      <text x="112" y="10">
        Endpoint wins!
      </text>
    </svg>
  );
}
