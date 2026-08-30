import {
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
import "./VolumeSlicingTargetLesson317.css";

const radius = 3;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number, precision = 8) =>
  Number(value.toFixed(precision));
const crossArea = (x: number) => Math.PI * Math.max(0, radius * radius - x * x);
const antiderivative = (x: number) =>
  Math.PI * (radius * radius * x - (x * x * x) / 3);
const totalVolume = antiderivative(radius) - antiderivative(-radius);

export default function VolumeSlicingTargetLesson317({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0.8);
  const [dx, setDx] = useState(0.1);
  const [tab, setTab] = useState("Interaction + visualization");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "correct" | "incorrect">("");
  const [actions, setActions] = useState(0);
  const area = crossArea(x),
    differentialVolume = area * dx;
  const reset = () => {
    setX(0.8);
    setDx(0.1);
    setTab("Interaction + visualization");
    setActionsOpen(false);
    setAnswer("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const choose = (value: string) => {
    setAnswer(value);
    setResult("");
  };
  return (
    <section
      className="vs317-page"
      data-testid="calculus-mockup-0396"
      data-dedicated-lesson="317"
      data-object-model="sphere-cross-section-slice-position-thickness-area-parabola-draggable-band-differential-volume-exact-integral-practice"
      data-x={clean(x)}
      data-dx={clean(dx)}
      data-area={clean(area)}
      data-dv={clean(differentialVolume)}
      data-volume={clean(totalVolume)}
      data-tab={tab}
      data-actions-open={actionsOpen}
      data-answer={answer}
      data-result={result}
      data-actions={actions}
    >
      <header className="vs317-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Volume by Slicing</h1>
        <p>Build volume from cross-sections.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              reset();
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ▧ Workspace
          </button>
        </div>
      </header>
      <nav className="vs317-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="vs317-lab">
        <header>
          <div>
            <b>INTERACTION + VISUALIZATION</b>
            <h2>Explore the model. Build the volume.</h2>
          </div>
          <span>
            All good! <CheckCircle2 />
          </span>
          <button
            type="button"
            onClick={() => act(() => setActionsOpen((value) => !value))}
          >
            Actions
          </button>
          <button
            type="button"
            aria-label="Full screen slicing lab"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ↗
          </button>
        </header>
        {actionsOpen && (
          <div className="vs317-menu">
            <button type="button" onClick={() => act(() => setX(0))}>
              Center slice
            </button>
            <button type="button" onClick={() => act(() => setDx(0.2))}>
              Thicker slice
            </button>
            <button
              type="button"
              onClick={() =>
                act(() => {
                  setX(0.8);
                  setDx(0.1);
                })
              }
            >
              Restore preview
            </button>
          </div>
        )}
        <main>
          <section className="vs317-solid">
            <h3>3D solid and cross-section</h3>
            <p>
              A vertical slice at position x has radius √(9−x²) and thickness
              dx.
            </p>
            <p>
              Its cross-sectional area is <b>A(x)=π(9−x²)</b>.
            </p>
            <SphereDiagram x={x} dx={dx} />
          </section>
          <section className="vs317-area">
            <h3>Cross-sectional area A(x)</h3>
            <AreaGraph x={x} dx={dx} onX={(value) => act(() => setX(value))} />
            <p>
              <b>Volume by Slicing:</b> V = ∫<sub>−3</sub>
              <sup>3</sup>A(x)dx = ∫<sub>−3</sub>
              <sup>3</sup>π(9−x²)dx
            </p>
          </section>
          <aside>
            <h3>Slice position and thickness</h3>
            <label>
              x <small>(position of slice)</small>
              <input
                aria-label="Slice position"
                type="range"
                min="-3"
                max="3"
                step=".05"
                value={x}
                onChange={(event) =>
                  act(() => setX(Number(event.target.value)))
                }
              />
              <output>{x.toFixed(2)}</output>
            </label>
            <label>
              dx <small>(thickness)</small>
              <input
                aria-label="Slice thickness"
                type="range"
                min=".02"
                max=".4"
                step=".01"
                value={dx}
                onChange={(event) =>
                  act(() => setDx(Number(event.target.value)))
                }
              />
              <output>{dx.toFixed(2)}</output>
            </label>
            <article>
              <h4>Instant values</h4>
              <p>A(x)=π(9−x²)</p>
              <strong>= {area.toFixed(4)}</strong>
              <p>dV=A(x) dx</p>
              <strong>= {differentialVolume.toFixed(4)}</strong>
            </article>
            <article>
              <h4>Current slice (preview)</h4>
              <p>
                <i /> Slice at x={x.toFixed(2)}
              </p>
              <p>
                <i /> Cross-sectional area A(x)
              </p>
            </article>
          </aside>
        </main>
      </section>
      <section className="vs317-flow">
        {[
          [Eye, "Observe", "See how cross-sectional area changes as x moves."],
          [
            Hand,
            "Manipulate",
            "Move x and adjust dx to explore differential volume dV=A(x)dx.",
          ],
          [
            Lightbulb,
            "Notice",
            "Each slice has area A(x). Adding all slices from −3 to 3 gives volume.",
          ],
          [
            Target,
            "Understand",
            "Volume is the integral of cross-sectional area across the interval.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
              {index === 1 && (
                <>
                  <input
                    aria-label="Linked slice position"
                    type="range"
                    min="-3"
                    max="3"
                    step=".05"
                    value={x}
                    onChange={(event) =>
                      act(() => setX(Number(event.target.value)))
                    }
                  />
                  <input
                    aria-label="Linked slice thickness"
                    type="range"
                    min=".02"
                    max=".4"
                    step=".01"
                    value={dx}
                    onChange={(event) =>
                      act(() => setDx(Number(event.target.value)))
                    }
                  />
                </>
              )}
              {index === 2 && (
                <strong>
                  V = ∫<sub>−3</sub>
                  <sup>3</sup>A(x)dx
                </strong>
              )}
              {(index === 0 || index === 3) && <FlowMini solid={index === 3} />}
            </div>
            {index < 3 && <b>→</b>}
          </article>
        ))}
      </section>
      <section className="vs317-cards">
        <article>
          <h3>▣ Formula & Rule</h3>
          <b>Volume by Slicing (Cross-Sectional Area Method)</b>
          <p>
            If a solid is sliced perpendicular to the x-axis and the
            cross-sectional area at x is A(x), then
          </p>
          <strong>
            V = ∫<sub>a</sub>
            <sup>b</sup>A(x)dx
          </strong>
          <ul>
            <li>Each slice has area A(x).</li>
            <li>Thickness of each slice is dx.</li>
            <li>Total volume is the integral from a to b.</li>
          </ul>
        </article>
        <article>
          <h3>◉ Worked Example</h3>
          <p>
            Find the volume of the sphere generated by revolving y=√(9−x²) about
            the x-axis.
          </p>
          <b>Cross-sectional area: A(x)=π(9−x²)</b>
          <p>
            V=∫<sub>−3</sub>
            <sup>3</sup>π(9−x²)dx
          </p>
          <p>
            =π[9x−x³/3]<sub>−3</sub>
            <sup>3</sup>
          </p>
          <strong>V=36π cubic units</strong>
        </article>
        <article className="mistake">
          <h3>⚠ Common Misconception</h3>
          <p>Using y instead of A(x) in the integral.</p>
          <b>
            Wrong: V=∫<sub>−3</sub>
            <sup>3</sup>y dx
          </b>
          <p>
            <b>Why wrong?</b> y is a length, not an area. Volume requires the
            area of each cross-section.
          </p>
          <WrongDiagram />
        </article>
      </section>
      <section className="vs317-practice">
        <div>
          <h3>▣ Try It Yourself</h3>
          <p>
            Find the volume formed by revolving y=√(16−x²) about the x-axis.
          </p>
          <div>
            {[
              ["A", "16π"],
              ["B", "16π/3"],
              ["C", "256π/3"],
              ["D", "32π/3"],
            ].map(([value, label]) => (
              <label key={value} className={answer === value ? "selected" : ""}>
                <input
                  type="radio"
                  name="vs317-answer"
                  checked={answer === value}
                  onChange={() => choose(value)}
                />
                <b>{value}</b>
                {label}
              </label>
            ))}
          </div>
        </div>
        <aside>
          <b>Your Answer</b>
          <span>
            {["A", "B", "C", "D"].map((value) => (
              <button
                type="button"
                key={value}
                className={answer === value ? "selected" : ""}
                onClick={() => choose(value)}
              >
                {value}
              </button>
            ))}
          </span>
          <button
            type="button"
            onClick={() =>
              act(() => setResult(answer === "C" ? "correct" : "incorrect"))
            }
          >
            Check Answer
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct: 256π/3."
              : result === "incorrect"
                ? "Integrate π(16−x²) from −4 to 4."
                : ""}
          </output>
        </aside>
        <article>
          <b>Hint</b>
          <p>A(x)=π(16−x²), −4≤x≤4</p>
        </article>
      </section>
      <nav className="vs317-adjacent">
        <a href="/lessons/calculus/316-numerical-integration">
          ←{" "}
          <span>
            <small>Previous</small>Numerical Integration
          </span>
        </a>
        <a href="/lessons/calculus/318-disc-and-washer-methods">
          <span>
            <small>Next</small>Disc and Washer Methods
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="vs317-footer">
        <div>
          <b>Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <span>www.IndianServers.com &nbsp; info@IndianServers.com</span>
      </footer>
    </section>
  );
}

function AreaGraph({
  x,
  dx,
  onX,
}: {
  x: number;
  dx: number;
  onX: (x: number) => void;
}) {
  const w = 340,
    h = 280,
    p = 32,
    sx = (value: number) => p + ((value + 3) / 6) * (w - 2 * p),
    sy = (value: number) => h - p - (value / (9 * Math.PI)) * (h - 2 * p),
    path = Array.from({ length: 121 }, (_, index) => {
      const value = -3 + index * 0.05;
      return `${index ? "L" : "M"}${sx(value)},${sy(crossArea(value))}`;
    }).join(" "),
    drag = (event: ReactPointerEvent<SVGRectElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const move = (pointer: PointerEvent) =>
        onX(clamp(-3 + ((pointer.clientX - box.left) / box.width) * 6, -3, 3));
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  return (
    <svg className="vs317-area-graph" viewBox={`0 0 ${w} ${h}`}>
      <line x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} className="axis" />
      <path d={path} className="curve" />
      <rect
        data-drag="slice-band"
        x={sx(x - dx / 2)}
        y={sy(crossArea(x))}
        width={Math.max(5, sx(x + dx / 2) - sx(x - dx / 2))}
        height={sy(0) - sy(crossArea(x))}
        onPointerDown={drag}
      />
      <text x={sx(x)} y={h - p + 18} textAnchor="middle">
        x
      </text>
      <text x={w - 95} y={52}>
        A(x)=π(9−x²)
      </text>
      <text x={w / 2} y={h - 8} textAnchor="middle">
        −3 ≤ x ≤ 3
      </text>
    </svg>
  );
}
function SphereDiagram({ x, dx }: { x: number; dx: number }) {
  const cx = 150,
    cy = 150,
    rx = 96,
    ry = 103,
    sliceX = cx + (x / 3) * rx,
    sliceRx = Math.max(4, (dx / 6) * rx);
  return (
    <svg className="vs317-solid-svg" viewBox="0 0 300 270">
      <defs>
        <linearGradient id="vs317-blue" x1="0" x2="1">
          <stop stopColor="#0b8bea" stopOpacity=".65" />
          <stop offset="1" stopColor="#72b8f5" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="url(#vs317-blue)"
        stroke="#0765bb"
      />
      <path
        d={`M${cx - rx},${cy}Q${cx},${cy + 72} ${cx + rx},${cy}`}
        fill="none"
        stroke="#095ea5"
      />
      <line
        x1={cx}
        x2={cx}
        y1="35"
        y2="258"
        stroke="#243854"
        strokeDasharray="5 4"
      />
      <ellipse
        cx={sliceX}
        cy={cy}
        rx={sliceRx}
        ry={Math.max(8, ry * Math.sqrt(Math.max(0, 1 - (x * x) / 9)))}
        fill="#ff9c2533"
        stroke="#f47b12"
        strokeWidth="3"
      />
      <line x1="38" x2="270" y1={cy} y2={cy} stroke="#243854" />
      <text x={sliceX + 8} y="38">
        dx
      </text>
      <text x="276" y={cy}>
        y
      </text>
      <text x={cx} y="267">
        0
      </text>
    </svg>
  );
}
function FlowMini({ solid }: { solid: boolean }) {
  return (
    <svg className="vs317-flow-mini" viewBox="0 0 120 42">
      <path d="M8 37Q60 3 112 37" />
      <line x1="60" x2="60" y1="5" y2="37" />
      <line x1="78" x2="78" y1="13" y2="37" className="slice" />
      {solid && (
        <>
          <path d="M14 37Q60 13 106 37" className="fill" />
          <text x="88" y="26">
            ΣdV
          </text>
        </>
      )}
    </svg>
  );
}
function WrongDiagram() {
  return (
    <svg className="vs317-wrong" viewBox="0 0 220 92">
      <path d="M15 75Q110-45 205 75" />
      <line x1="110" x2="110" y1="12" y2="75" />
      <line x1="145" x2="145" y1="35" y2="75" className="slice" />
      <path d="M183 28L213 58M213 28L183 58" className="cross" />
    </svg>
  );
}
