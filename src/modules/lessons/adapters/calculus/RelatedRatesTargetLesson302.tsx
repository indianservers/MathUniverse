import {
  CheckCircle2,
  Maximize2,
  Pause,
  Play,
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
import "./RelatedRatesTargetLesson302.css";

const distance = (t: number) => 2 + (4 / 9) * (t - 0.5) ** 2;
const rate = (t: number) => (8 / 9) * (t - 0.5);
const clean = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));

export default function RelatedRatesTargetLesson302({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [t, setT] = useState(2);
  const [h, setH] = useState(0.05);
  const [tab, setTab] = useState("Interaction + visualization");
  const [playing, setPlaying] = useState(false);
  const [checked, setChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const finiteRate = (distance(t + h) - distance(t - h)) / (2 * h);
  const reset = () => {
    setT(2);
    setH(0.05);
    setTab("Interaction + visualization");
    setPlaying(false);
    setChecked(true);
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setT((value) => (value >= 5 ? -5 : Number((value + 0.05).toFixed(2)))),
      80,
    );
    return () => window.clearInterval(id);
  }, [playing]);
  return (
    <section
      className="rel302-page"
      data-testid="calculus-mockup-0381"
      data-dedicated-lesson="302"
      data-object-model="quadratic-distance-time-linked-exact-and-finite-rate-direct-time-drag-tangent-animation-chain-rule-practice"
      data-t={clean(t)}
      data-h={h}
      data-distance={clean(distance(t))}
      data-rate={clean(rate(t))}
      data-finite-rate={clean(finiteRate)}
      data-playing={playing}
      data-checked={checked}
      data-actions={actions}
    >
      <header className="rel302-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Related Rates</h1>
        <p>Model linked changing quantities.</p>
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
                navigator.clipboard?.writeText(
                  `At t=${clean(t)}, d=${clean(distance(t))}, rate=${clean(rate(t))}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">↗ Workspace</a>
        </div>
      </header>
      <nav className="rel302-tabs">
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
      <section className="rel302-flow">
        {[
          [
            "1",
            "Observe",
            "See how the distance and the rate change with time.",
          ],
          [
            "2",
            "Manipulate",
            "Adjust sliders to explore. Watch the graph respond.",
          ],
          ["3", "Notice", "The distance, rate and slope are linked by a rule."],
          ["4", "Understand", "Use the rule to compute unknown related rates."],
        ].map(([n, title, text]) => (
          <article key={title}>
            <b>{n}</b>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="rel302-lab">
        <header>
          <h2>Work directly on the model</h2>
          <output>{actions} actions</output>
          <button aria-label="Fullscreen">
            <Maximize2 />
          </button>
        </header>
        <h3>Related Rates - distance vs. time</h3>
        <main>
          <section className="graph-panel">
            <header>
              <output>d'(t) = 8/9(t - 1/2)</output>
              <b>t = {t.toFixed(3)} min</b>
              <button
                aria-label={playing ? "Pause animation" : "Play animation"}
                onClick={() => act(() => setPlaying((v) => !v))}
              >
                {playing ? <Pause /> : <Play />}
              </button>
            </header>
            <RateGraph t={t} onT={(value) => act(() => setT(value))} />
            <div className="tooltip">
              <b>t = {t.toFixed(3)} min</b>
              <p>distance = {distance(t).toFixed(3)} m</p>
              <p>
                rate = d'(t) = <strong>{rate(t).toFixed(3)} m/min</strong>
              </p>
            </div>
            <footer>
              Each animation frame: Δt = +0.05 min
              <div>
                <i /> Distance, d(t) (m) <i /> Tangent slope = rate, d'(t)
                (m/min)
              </div>
            </footer>
          </section>
          <aside>
            <section>
              <h3>Knowns (inputs)</h3>
              <label>
                t (time, min)
                <input
                  aria-label="Related rates time"
                  type="range"
                  min="-5"
                  max="5"
                  step=".05"
                  value={t}
                  onChange={(e) => act(() => setT(Number(e.target.value)))}
                />
                <small>-5 to 5</small>
                <output>{t.toFixed(3)}</output>
              </label>
              <label>
                h (Δt, min)
                <input
                  aria-label="Related rates h"
                  type="range"
                  min=".01"
                  max=".5"
                  step=".01"
                  value={h}
                  onChange={(e) => act(() => setH(Number(e.target.value)))}
                />
                <small>0.01 to 0.50</small>
                <output>{h.toFixed(3)}</output>
              </label>
            </section>
            <section>
              <h3>Outputs</h3>
              <p>
                distance d(t) (m)<b>{distance(t).toFixed(3)}</b>
              </p>
              <p>
                rate d'(t) (m/min)<b>{rate(t).toFixed(3)}</b>
              </p>
              <p>
                finite rate<b>{finiteRate.toFixed(3)}</b>
              </p>
              <p>
                linked rule<b>d'(t)=8/9(t-1/2)</b>
              </p>
            </section>
            <section>
              <h3>Domain & signs</h3>
              <p>Domain: all real numbers</p>
              <p>d'(t) ≥ 0 for t ≥ 1/2</p>
              <p>d'(1/2)=0 (stationary point)</p>
              <p>d'(t)&lt;0 for t&lt;1/2</p>
            </section>
          </aside>
        </main>
      </section>
      <section className="rel302-info">
        <article>
          <h3>The rule (Chain Rule)</h3>
          <p>If y=g(u(t)), then</p>
          <strong>dy/dt = g'(u) u'(t)</strong>
          <p>Here, d(t)=2+4/9(t-1/2)².</p>
          <p>Let u=t-1/2 and g(u)=2+4u²/9.</p>
          <output>d'(t)=8/9(t-1/2)</output>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>Find the rate of change at t=2 min.</p>
          <p>d'(2)=8/9(2-1/2)</p>
          <p>=8/9 · 3/2</p>
          <p>=4/3 m/min</p>
          <output>
            At t=2 min, distance is increasing at 1.333 m per min.
          </output>
        </article>
        <article>
          <h3>⚠ Common Misconception</h3>
          <p>Forgetting the chain rule.</p>
          <p>Incorrect: dy/dt=g'(u)</p>
          <b>Correct: dy/dt=g'(u)u'(t) ✓</b>
          <output>Tip: Differentiate the inside function too!</output>
        </article>
        <article>
          <h3>🏆 Practice Challenge</h3>
          <p>Given d(t)=2+4/9(t-1/2)².</p>
          <b>At t=-1 min:</b>
          <p>1. Find d(-1).</p>
          <p>2. Find d'(-1).</p>
          <p>3. Interpret the rate in context.</p>
          <button onClick={() => act(() => setChecked(true))}>
            Check my answer
          </button>
        </article>
      </section>
      <section className={`rel302-result ${checked ? "shown" : ""}`}>
        <div>
          <Sparkles />
          <b>{checked ? "Great work!" : "Complete the practice challenge"}</b>
          <p>
            {checked
              ? "You've applied the rule correctly."
              : "Calculate the distance and rate at t=-1."}
          </p>
        </div>
        <output>
          <CheckCircle2 /> d(-1) = 3.000
        </output>
        <output>
          <CheckCircle2 /> d'(-1) = -1.333
        </output>
        <p>At t=-1 min, the distance is decreasing at 1.333 m per min.</p>
        <button onClick={() => act(() => setChecked(false))}>
          <RotateCcw /> Try another value
        </button>
      </section>
      <nav className="rel302-adjacent">
        <a href="/lessons/calculus/301-optimisation">
          ←{" "}
          <span>
            <small>Previous</small>Optimisation
          </span>
        </a>
        <a href="/lessons/calculus/303-motion-analysis">
          <span>
            <small>Next</small>Motion Analysis
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function RateGraph({ t, onT }: { t: number; onT: (value: number) => void }) {
  const w = 520,
    h = 330,
    sx = (x: number) => 240 + x * 46,
    sy = (y: number) => 300 - y * 22;
  const path = Array.from({ length: 201 }, (_, i) => {
    const x = -5 + i * 0.05;
    return `${i ? "L" : "M"}${sx(x)} ${sy(distance(x))}`;
  }).join(" ");
  const y = distance(t),
    m = rate(t),
    tangent = `M${sx(t - 1.2)} ${sy(y - m * 1.2)}L${sx(t + 1.2)} ${sy(y + m * 1.2)}`;
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1 && e.type === "pointermove") return;
    if (e.type === "pointerdown")
      e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (r)
      onT(
        Math.max(
          -5,
          Math.min(5, (((e.clientX - r.left) / r.width) * w - 240) / 46),
        ),
      );
  };
  return (
    <svg className="rel302-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="rel-grid"
          width="46"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path d="M46 0H0V44" fill="none" stroke="#e3e9f0" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#rel-grid)" />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="curve" d={path} />
      <path className="tangent" d={tangent} />
      <circle
        data-drag="related-rate-point"
        cx={sx(t)}
        cy={sy(y)}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
    </svg>
  );
}
