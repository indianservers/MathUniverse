import {
  BookOpen,
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
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
import "./MotionAnalysisTargetLesson303.css";

const position = (t: number) => -(t ** 3) + 3 * t * t + 2 * t + 1;
const velocity = (t: number) => -3 * t * t + 6 * t + 2;
const acceleration = (t: number) => -6 * t + 6;
const clean = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));

export default function MotionAnalysisTargetLesson303({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [t, setT] = useState(2.5),
    [tab, setTab] = useState("Interaction + Visualization"),
    [vAnswer, setVAnswer] = useState(""),
    [aAnswer, setAAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [guidance, setGuidance] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setT(2.5);
    setTab("Interaction + Visualization");
    setVAnswer("");
    setAAnswer("");
    setResult("");
    setGuidance(false);
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const check = () =>
    act(() =>
      setResult(
        Number(vAnswer) === 5 && Number(aAnswer) === 0
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="mot303-page"
      data-testid="calculus-mockup-0382"
      data-dedicated-lesson="303"
      data-object-model="cubic-position-linked-velocity-acceleration-three-synchronized-graphs-direct-time-drag-derivative-chain-practice"
      data-t={clean(t)}
      data-s={clean(position(t))}
      data-v={clean(velocity(t))}
      data-a={clean(acceleration(t))}
      data-result={result}
      data-guidance={guidance}
      data-actions={actions}
    >
      <header className="mot303-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Motion Analysis</h1>
        <p>Connect position, velocity and acceleration.</p>
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
                  `t=${clean(t)}, s=${clean(position(t))}, v=${clean(velocity(t))}, a=${clean(acceleration(t))}`,
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
      <nav className="mot303-tabs">
        {[
          "Interaction + Visualization",
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
      <section className="mot303-main">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Work directly on the model</h2>
          <b>
            <CheckCircle2 /> All graphs synchronized
          </b>
        </header>
        <div className="model-select">
          <strong>Model: s(t) = -t³ + 3t² + 2t + 1</strong>
          <span>(projectile-style)⌄</span>
        </div>
        <section className="motion-work">
          <aside className="guide">
            {[
              {
                Icon: Eye,
                title: "Observe",
                text: "The particle moves along a line. Position s(t) is shown with a tracker.",
              },
              {
                Icon: Hand,
                title: "Manipulate",
                text: "Drag the time slider t to move the particle. All graphs and values update together.",
              },
              {
                Icon: Lightbulb,
                title: "Notice",
                text: "Velocity is the slope of s(t). Acceleration is the slope of v(t). Check signs, zeros and intervals.",
              },
              {
                Icon: BookOpen,
                title: "Understand",
                text: "These are derivatives: v(t)=s'(t), a(t)=v'(t)=s''(t).",
              },
            ].map(({ Icon, title, text }) => (
              <article key={title}>
                <Icon />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
            <button onClick={() => act(() => setGuidance((v) => !v))}>
              ⓘ {guidance ? "Hide" : "Show"} guidance
            </button>
          </aside>
          <section className="graphs">
            <div className="legend">
              <output>t = {t.toFixed(2)} s</output>
              <span>━ Position</span>
              <span>━ Velocity</span>
              <span>━ Acceleration</span>
            </div>
            <MotionGraph
              kind="s"
              t={t}
              onT={(value) => act(() => setT(value))}
            />
            <MotionGraph
              kind="v"
              t={t}
              onT={(value) => act(() => setT(value))}
            />
            <MotionGraph
              kind="a"
              t={t}
              onT={(value) => act(() => setT(value))}
            />
          </section>
          <aside className="model">
            <h3>Model</h3>
            <output>s(t)=-t³+3t²+2t+1</output>
            <label>
              Time slider <b>t</b>
              <input
                aria-label="Motion time"
                type="range"
                min="-1"
                max="7"
                step=".05"
                value={t}
                onChange={(e) => act(() => setT(Number(e.target.value)))}
              />
              <small>-1 to 7</small>
              <output>{t.toFixed(2)} s</output>
            </label>
            <h3>Key values at t = {t.toFixed(2)} s</h3>
            <div className="value s">
              Position s(t)<b>{position(t).toFixed(2)} m</b>
            </div>
            <div className="value v">
              Velocity v(t)<b>{velocity(t).toFixed(2)} m/s</b>
            </div>
            <div className="value a">
              Acceleration a(t)<b>{acceleration(t).toFixed(2)} m/s²</b>
            </div>
            <h3>Domains</h3>
            <p>-1 ≤ t ≤ 7 s</p>
            <p>s(t) in meters</p>
            <p>v(t) in m/s</p>
            <p>a(t) in m/s²</p>
          </aside>
        </section>
        <section className="connection">
          <h3>How everything connects</h3>
          <div>
            <article>
              <b>Position</b>
              <strong>s(t)</strong>
              <small>meters</small>
            </article>
            <i>slope ds/dt →</i>
            <article>
              <b>Velocity</b>
              <strong>v(t)=s'(t)</strong>
              <small>meters per second</small>
            </article>
            <i>slope dv/dt →</i>
            <article>
              <b>Acceleration</b>
              <strong>a(t)=s''(t)</strong>
              <small>meters per second²</small>
            </article>
            <aside>
              <b>Core rule</b>
              <p>Derivative = rate of change.</p>
              <p>Differentiate to go down. Integrate to go up.</p>
            </aside>
          </div>
        </section>
        <section className="mot303-info">
          <article>
            <h3>⌂ Correct worked example</h3>
            <p>Given s(t)=-t³+3t²+2t+1</p>
            <p>Find v(t), a(t) and evaluate at t=2.</p>
            <p>v(t)=-3t²+6t+2</p>
            <p>a(t)=-6t+6</p>
            <p>At t=2: s=9 m, v=2 m/s, a=-6 m/s².</p>
            <output>✓ Correct! Match with the model by setting t=2.</output>
          </article>
          <article>
            <h3>⚠ Common misconception</h3>
            <p>“If velocity is positive, acceleration must be positive.”</p>
            <p>
              Positive velocity means moving in the positive direction.
              Acceleration describes how velocity is changing.
            </p>
            <div>
              <b>v(2.5)={velocity(2.5)} &lt; 0</b>
              <b>a(2.5)={acceleration(2.5)} &lt; 0</b>
            </div>
            <output>Always check the sign of a(t).</output>
          </article>
          <article>
            <h3>
              <Target /> Quick challenge
            </h3>
            <p>For s(t)=-t³+3t²+2t+1</p>
            <b>What are v(1) and a(1)?</b>
            <label>
              v(1)=
              <input
                aria-label="Motion velocity answer"
                value={vAnswer}
                onChange={(e) => {
                  setVAnswer(e.target.value);
                  setResult("");
                }}
              />
              m/s
            </label>
            <label>
              a(1)=
              <input
                aria-label="Motion acceleration answer"
                value={aAnswer}
                onChange={(e) => {
                  setAAnswer(e.target.value);
                  setResult("");
                }}
              />
              m/s²
            </label>
            <button onClick={check}>Check answer</button>
            <output className={result}>
              {result === "correct"
                ? "Correct: v(1)=5, a(1)=0."
                : result === "incorrect"
                  ? "Differentiate the position twice."
                  : "Hint: Differentiate once for v(t), again for a(t)."}
            </output>
          </article>
        </section>
      </section>
      <nav className="mot303-adjacent">
        <a href="/lessons/calculus/302-related-rates">
          ←{" "}
          <span>
            <small>Previous</small>Related Rates
          </span>
        </a>
        <a href="/lessons/calculus/304-newtons-method">
          <span>
            <small>Next</small>Newton's Method
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function MotionGraph({
  kind,
  t,
  onT,
}: {
  kind: "s" | "v" | "a";
  t: number;
  onT: (value: number) => void;
}) {
  const fn = kind === "s" ? position : kind === "v" ? velocity : acceleration,
    w = 470,
    h = 125,
    sx = (x: number) => 28 + (x + 1) * 54,
    range = kind === "s" ? 30 : kind === "v" ? 35 : 45,
    sy = (y: number) => 62 - (y / range) * 52,
    path = Array.from({ length: 161 }, (_, i) => {
      const x = -1 + i * 0.05;
      return `${i ? "L" : "M"}${sx(x)} ${sy(fn(x))}`;
    }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1 && e.type === "pointermove") return;
    if (e.type === "pointerdown")
      e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (r)
      onT(
        Math.max(
          -1,
          Math.min(7, (((e.clientX - r.left) / r.width) * w - 28) / 54 - 1),
        ),
      );
  };
  return (
    <svg className={`motion-graph ${kind}`} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id={`mot-grid-${kind}`}
          width="54"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path d="M54 0H0V26" fill="none" stroke="#e6ebf2" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#mot-grid-${kind})`} />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="cursor" x1={sx(t)} x2={sx(t)} y1="0" y2={h} />
      <path className="curve" d={path} />
      <circle
        data-drag={`motion-${kind}-point`}
        cx={sx(t)}
        cy={sy(fn(t))}
        r="6"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={Math.min(sx(t) + 8, w - 75)} y={Math.max(12, sy(fn(t)) - 8)}>
        ({t.toFixed(2)}, {fn(t).toFixed(2)})
      </text>
    </svg>
  );
}
