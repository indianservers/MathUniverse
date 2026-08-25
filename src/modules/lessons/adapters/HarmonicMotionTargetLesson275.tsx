import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CirclePlay,
  Pause,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./HarmonicMotionTargetLesson275.css";

type PracticeState = "idle" | "correct" | "incorrect";

const VIEWS = [
  ["interaction", "◉", "Interaction + Visualization"],
  ["explain", "▤", "Explain"],
  ["examples", "♙", "Examples"],
  ["formulas", "∑", "Formulas"],
  ["know", "⌘", "Know more"],
] as const;

export default function HarmonicMotionTargetLesson275({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [angle, setAngle] = useState(60);
  const [activeView, setActiveView] = useState("interaction");
  const [animating, setAnimating] = useState(false);
  const [practiceAngle, setPracticeAngle] = useState(150);
  const [answerX, setAnswerX] = useState("-0.866");
  const [answerV, setAnswerV] = useState("-0.500");
  const [practiceState, setPracticeState] = useState<PracticeState>("correct");
  const frame = useRef<number | null>(null);
  const lastTime = useRef(0);
  const model = useMemo(() => harmonicModel(angle), [angle]);
  const expected = useMemo(() => harmonicModel(practiceAngle), [practiceAngle]);

  const restore = () => {
    setAngle(60);
    setActiveView("interaction");
    setAnimating(false);
    setPracticeAngle(150);
    setAnswerX("-0.866");
    setAnswerV("-0.500");
    setPracticeState("correct");
  };
  useEffect(restore, [resetToken]);

  useEffect(() => {
    if (!animating) return;
    const tick = (time: number) => {
      if (lastTime.current) {
        setAngle((current) =>
          normalize(current + (time - lastTime.current) * 0.04),
        );
      }
      lastTime.current = time;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      lastTime.current = 0;
    };
  }, [animating]);

  const updateAngle = (next: number) => {
    setAngle(normalize(next));
    setAnimating(false);
    onInteraction();
  };

  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 250;
    const y = ((event.clientY - rect.top) / rect.height) * 250;
    updateAngle((Math.atan2(125 - y, x - 125) * 180) / Math.PI);
  };

  const checkPractice = () => {
    const x = Number(answerX);
    const v = Number(answerV);
    const correct =
      Number.isFinite(x) &&
      Number.isFinite(v) &&
      Math.abs(x - expected.displacement) <= 0.0015 &&
      Math.abs(v - expected.velocity) <= 0.0015;
    setPracticeState(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <div
      className="target-harmonic-page"
      data-testid="trigonometry-mockup-0332"
      data-dedicated-lesson="275"
      data-object-model="draggable-unit-circle-horizontal-projection-displacement-velocity-shm-model"
      data-angle={model.angle.toFixed(6)}
      data-displacement={model.displacement.toFixed(6)}
      data-velocity={model.velocity.toFixed(6)}
      data-radius-identity={model.identity.toFixed(6)}
      data-active-view={activeView}
      data-animating={animating}
      data-practice-state={practiceState}
    >
      <header className="target-harmonic-header">
        <div>
          <span>TRIGONOMETRY</span>
          <span>TRIGONOMETRY</span>
          <h1>Harmonic Motion</h1>
          <p>Connect trigonometry to waves.</p>
          <div className="target-harmonic-meta">
            <b>♙ Intermediate–Advanced</b>
            <b>⚡ Visual Lab</b>
            <b>▤ Trig Graphing / Geometry</b>
            <b>◷ 6-10 min</b>
          </div>
        </div>
        <div className="target-harmonic-actions">
          <select aria-label="Lesson language" defaultValue="en">
            <option value="en">English (English)</option>
            <option value="hi">Hindi (हिन्दी)</option>
          </select>
          <button type="button" onClick={restore}>
            <RotateCcw /> Reset
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            <Share2 /> Share
          </button>
          <a href="/workspace">↗ Workspace</a>
        </div>
      </header>

      <nav
        className="target-harmonic-tabs"
        aria-label="Harmonic motion lesson views"
      >
        {VIEWS.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={activeView === id ? "active" : ""}
            onClick={() => {
              setActiveView(id);
              onInteraction();
            }}
          >
            <i>{icon}</i>
            {label}
          </button>
        ))}
      </nav>

      <section className="target-harmonic-flow">
        {[
          [
            "1",
            "OBSERVE",
            "The point on the circle rotates with constant angular speed.",
          ],
          [
            "2",
            "MANIPULATE",
            "Drag the point or adjust the angle to see the projection change.",
          ],
          [
            "3",
            "NOTICE",
            "The horizontal projection produces simple harmonic motion (SHM).",
          ],
          [
            "4",
            "UNDERSTAND",
            "SHM is the cosine (or sine) of a constant-angular-velocity rotation.",
          ],
        ].map(([n, title, body], index) => (
          <article key={n}>
            <b>
              <em>{n}</em>
              {title}
            </b>
            <p>{body}</p>
            {index < 3 && <strong>→</strong>}
          </article>
        ))}
      </section>

      <section className="target-harmonic-lab">
        <div className="target-harmonic-lab-title">
          <div>
            <h2>Linked angle → harmonic motion (cosine model)</h2>
            <p>
              Drag the point on the unit circle or use the slider to change θ.
              Watch the projection and graphs update in real time.
            </p>
          </div>
          <button
            type="button"
            aria-label="Toggle harmonic animation"
            onClick={() => {
              setAnimating((value) => !value);
              onInteraction();
            }}
          >
            Animation {animating ? <Pause /> : <Play />}
          </button>
        </div>
        <div className="target-harmonic-models">
          <article className="target-harmonic-circle-card">
            <h3>
              <b>1</b> UNIT CIRCLE (DRIVING)
            </h3>
            <svg
              viewBox="0 0 250 250"
              aria-label="Draggable harmonic motion unit circle"
            >
              <line x1="22" y1="125" x2="230" y2="125" />
              <line x1="125" y1="225" x2="125" y2="20" />
              <circle cx="125" cy="125" r="88" className="hm-ring" />
              <line
                x1="125"
                y1="125"
                x2={model.circleX}
                y2={model.circleY}
                className="hm-radius"
              />
              <line
                x1={model.circleX}
                y1={model.circleY}
                x2={model.circleX}
                y2="125"
                className="hm-projection-line"
              />
              <path d={angleArc(model.angle)} className="hm-angle-arc" />
              <circle
                data-testid="harmonic-circle-handle"
                cx={model.circleX}
                cy={model.circleY}
                r="9"
                className="hm-handle"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragPoint(event);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    dragPoint(event);
                }}
                onPointerUp={(event) =>
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }
              />
              <text
                x={Math.min(model.circleX + 10, 190)}
                y={Math.max(model.circleY - 10, 18)}
              >
                P(cos θ, sin θ)
              </text>
              <text x="111" y="143">
                O
              </text>
              <text x="205" y="143">
                1
              </text>
              <text x="16" y="143">
                −1
              </text>
              <text x="111" y="35">
                1
              </text>
              <text x="108" y="224">
                −1
              </text>
              <text x="150" y="145" className="hm-theta">
                θ
              </text>
              <text x={model.circleX - 16} y="145" className="hm-cos">
                cos θ
              </text>
            </svg>
          </article>
          <article className="target-harmonic-projection-card">
            <h3>
              <b>2</b> PROJECTION (SHM OUTPUT)
            </h3>
            <p>Horizontal projection: x = cos θ</p>
            <svg viewBox="0 0 190 80">
              <line x1="15" y1="39" x2="175" y2="39" />
              <line x1="15" y1="29" x2="15" y2="49" />
              <line x1="95" y1="29" x2="95" y2="49" />
              <line x1="175" y1="29" x2="175" y2="49" />
              <line
                x1="95"
                y1="39"
                x2={95 + model.displacement * 80}
                y2="39"
                className="hm-projection"
              />
              <circle
                cx={95 + model.displacement * 80}
                cy="39"
                r="6"
                className="hm-handle"
              />
              <text x="7" y="64">
                −1
              </text>
              <text x="92" y="64">
                0
              </text>
              <text x="172" y="64">
                1
              </text>
            </svg>
            <div className="target-harmonic-readout">
              <b>x = cos θ</b>
              <strong>x ≈ {model.displacement.toFixed(3)}</strong>
              <span>
                θ = {model.angle.toFixed(1)}° = {degreeFraction(model.angle)}{" "}
                rad
              </span>
            </div>
          </article>
          <article className="target-harmonic-graphs">
            <h3>
              <b>3</b> DISPLACEMENT x(θ) & VELOCITY v(θ)
            </h3>
            <WaveGraph
              kind="displacement"
              angle={model.angle}
              value={model.displacement}
            />
            <WaveGraph
              kind="velocity"
              angle={model.angle}
              value={model.velocity}
            />
          </article>
        </div>
        <div className="target-harmonic-controls">
          <label>
            Angle θ
            <input
              aria-label="Harmonic angle"
              type="range"
              min="0"
              max="360"
              step="1"
              value={model.angle}
              onChange={(event) => updateAngle(Number(event.target.value))}
            />
          </label>
          <input
            aria-label="Harmonic angle degrees"
            type="number"
            min="0"
            max="360"
            value={Math.round(model.angle)}
            onChange={(event) => updateAngle(Number(event.target.value))}
          />
          <span>deg</span>
          <button type="button" onClick={() => updateAngle(model.angle - 10)}>
            −10°
          </button>
          <button type="button" onClick={() => updateAngle(model.angle + 10)}>
            +10°
          </button>
          <b>
            {model.angle.toFixed(1)}° = {degreeFraction(model.angle)} rad
          </b>
          <p>
            Domain: θ ∈ ℝ; Period: 2π rad (360°); Amplitude: 1; Range: [−1, 1]
          </p>
        </div>
      </section>

      <section className="target-harmonic-learning">
        <article>
          <h2>Key idea</h2>
          <p>
            The horizontal projection of a point rotating uniformly on the unit
            circle produces simple harmonic motion.
          </p>
          <div className="target-harmonic-mini">
            <CirclePlay />
            <b>Uniform circular motion</b>
            <strong>→</strong>
            <span>∿</span>
            <b>Simple harmonic motion (SHM)</b>
          </div>
        </article>
        <article>
          <h2>Model & formulas</h2>
          <FormulaRow
            name="Displacement"
            formula="x(θ) = cos θ"
            note="Amplitude = 1; Range = [−1, 1]; Period = 2π"
          />
          <FormulaRow
            name="Velocity"
            formula="v(θ) = −sin θ"
            note="Same period 2π; 90° out of phase"
          />
          <p>
            General form (amplitude A): x(t) = A cos(ωt + φ), v(t) = −Aω sin(ωt
            + φ)
          </p>
        </article>
      </section>

      <section className="target-harmonic-examples">
        <article>
          <h2>Worked example</h2>
          <p>
            Find x and v for a particle undergoing SHM with A = 2 at θ = 60° =
            π/3.
          </p>
          <div className="hm-math">
            x(θ) = 2 cos(π/3) = 1<br />
            v(θ) = −2 sin(π/3) = −√3 ≈ −1.732
          </div>
          <strong>
            <Check /> Check on the lab: Set θ = 60°. You should see x ≈ 1.000
            and v ≈ −1.732.
          </strong>
        </article>
        <article className="hm-warning">
          <h2>
            <AlertTriangle /> Common misconception
          </h2>
          <b>Thinking the velocity is in phase with displacement.</b>
          <p>
            Because v(θ) = −sin θ, velocity is 90° out of phase. When x is
            maximum, velocity is zero. When velocity is maximum, displacement is
            zero.
          </p>
          <table>
            <tbody>
              <tr>
                <th>θ (deg)</th>
                <th>0°</th>
                <th>90°</th>
                <th>180°</th>
                <th>270°</th>
                <th>360°</th>
              </tr>
              <tr>
                <th>x = cos θ</th>
                <td>1</td>
                <td>0</td>
                <td>−1</td>
                <td>0</td>
                <td>1</td>
              </tr>
              <tr>
                <th>v = −sin θ</th>
                <td>0</td>
                <td>−1</td>
                <td>0</td>
                <td>1</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <section className="target-harmonic-practice">
        <div>
          <h2>Try it: Harmonic Motion Challenge</h2>
          <p>
            A particle on a unit circle rotates counterclockwise. Find x and v
            at the given angle.
          </p>
          <label>
            Angle
            <select
              aria-label="Harmonic practice angle"
              value={practiceAngle}
              onChange={(event) => {
                setPracticeAngle(Number(event.target.value));
                setPracticeState("idle");
              }}
            >
              <option value="150">150° = 5π/6 rad</option>
              <option value="225">225° = 5π/4 rad</option>
              <option value="300">300° = 5π/3 rad</option>
            </select>
          </label>
          <p>
            Your answers <small>(round to 3 decimals)</small>
          </p>
          <div className="hm-answer">
            <label>
              x ={" "}
              <input
                aria-label="Harmonic practice displacement"
                value={answerX}
                onChange={(event) => {
                  setAnswerX(event.target.value);
                  setPracticeState("idle");
                }}
              />
            </label>
            <label>
              v ={" "}
              <input
                aria-label="Harmonic practice velocity"
                value={answerV}
                onChange={(event) => {
                  setAnswerV(event.target.value);
                  setPracticeState("idle");
                }}
              />
            </label>
            <button type="button" onClick={checkPractice}>
              Check
            </button>
          </div>
        </div>
        <div className="hm-solution">
          <h3>Solution</h3>
          <p>
            x = cos({degreeFraction(practiceAngle)}) ={" "}
            {expected.displacement.toFixed(3)}
          </p>
          <p>
            v = −sin({degreeFraction(practiceAngle)}) ={" "}
            {expected.velocity.toFixed(3)}
          </p>
        </div>
        <div className={`hm-result ${practiceState}`}>
          <Check />
          <b>
            {practiceState === "incorrect"
              ? "Try again"
              : practiceState === "correct"
                ? "Correct!"
                : "Ready"}
          </b>
          <p>
            {practiceState === "incorrect"
              ? "Recheck the signs and round to three decimals."
              : "Great job—your answers match."}
          </p>
        </div>
      </section>

      <nav className="target-harmonic-nav">
        <a href="/lessons/trigonometry/274-elevation-and-depression">
          <ArrowLeft />
          <span>
            <b>Previous</b>Elevation and Depression
          </span>
        </a>
        <a href="/lessons/trigonometry/276-polar-trigonometry">
          <span>
            <b>Next</b>Polar Trigonometry
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}

function FormulaRow({
  name,
  formula,
  note,
}: {
  name: string;
  formula: string;
  note: string;
}) {
  return (
    <div className="hm-formula">
      <b>{name}</b>
      <strong>{formula}</strong>
      <span>{note}</span>
    </div>
  );
}

function WaveGraph({
  kind,
  angle,
  value,
}: {
  kind: "displacement" | "velocity";
  angle: number;
  value: number;
}) {
  const points = Array.from({ length: 121 }, (_, index) => {
    const theta = (index / 120) * Math.PI * 2;
    const y = kind === "displacement" ? Math.cos(theta) : -Math.sin(theta);
    return `${28 + index * 2.2},${49 - y * 31}`;
  }).join(" ");
  const x = 28 + (normalize(angle) / 360) * 264;
  const y = 49 - value * 31;
  return (
    <div className="hm-wave">
      <h4>
        {kind === "displacement"
          ? "Displacement　x(θ) = cos θ"
          : "Velocity　v(θ) = −sin θ"}
      </h4>
      <svg viewBox="0 0 320 100">
        <line x1="28" y1="49" x2="300" y2="49" />
        <line x1="28" y1="12" x2="28" y2="86" />
        <polyline
          points={points}
          className={kind === "displacement" ? "hm-wave-x" : "hm-wave-v"}
        />
        <line x1={x} y1="12" x2={x} y2="86" className="hm-marker-line" />
        <circle
          data-testid={`harmonic-${kind}-marker`}
          cx={x}
          cy={y}
          r="4.5"
          className={
            kind === "displacement" ? "hm-wave-x-fill" : "hm-wave-v-fill"
          }
        />
        <text x="25" y="97">
          0
        </text>
        <text x="90" y="97">
          π/2
        </text>
        <text x="160" y="97">
          π
        </text>
        <text x="220" y="97">
          3π/2
        </text>
        <text x="285" y="97">
          2π
        </text>
      </svg>
    </div>
  );
}

function harmonicModel(angle: number) {
  const normalized = normalize(angle);
  const radians = (normalized * Math.PI) / 180;
  const displacement = Math.cos(radians);
  const velocity = -Math.sin(radians);
  return {
    angle: normalized,
    radians,
    displacement,
    velocity,
    identity: displacement ** 2 + velocity ** 2,
    circleX: 125 + displacement * 88,
    circleY: 125 + velocity * 88,
  };
}

function angleArc(angle: number) {
  const end = Math.min(normalize(angle), 359.99);
  const radians = (-end * Math.PI) / 180;
  const x = 125 + 29 * Math.cos(radians);
  const y = 125 + 29 * Math.sin(radians);
  return `M 154 125 A 29 29 0 ${end > 180 ? 1 : 0} 0 ${x} ${y}`;
}

function normalize(value: number) {
  return (((Number.isFinite(value) ? value : 0) % 360) + 360) % 360;
}
function degreeFraction(angle: number) {
  const rounded = Math.round(normalize(angle));
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(rounded, 180);
  const numerator = rounded / divisor;
  const denominator = 180 / divisor;
  if (numerator === 0) return "0";
  return `${numerator === 1 ? "" : numerator}π${denominator === 1 ? "" : `/${denominator}`}`;
}
