import {
  Check,
  CircleHelp,
  Compass,
  MousePointer2,
  Play,
  RotateCcw,
  Ruler,
  Triangle,
} from "lucide-react";
import {
  forwardRef,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RightTriangleRhsTargetLesson10031.css";

type RhsMeasures = { hypotenuse: number; leg: number };
type Tool = "Select / Move" | "Compass (center A)";
const initial: RhsMeasures = { hypotenuse: 8, leg: 5 };
const challengeInitial: RhsMeasures = { hypotenuse: 10, leg: 6 };
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const solve = ({ hypotenuse, leg }: RhsMeasures) => ({
  valid: leg > 0 && leg < hypotenuse,
  other: Math.sqrt(Math.max(0, hypotenuse * hypotenuse - leg * leg)),
});

export default function RightTriangleRhsTargetLesson10031({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [measures, setMeasures] = useState(initial);
  const [tool, setTool] = useState<Tool>("Select / Move");
  const [semicircle, setSemicircle] = useState(true);
  const [lengths, setLengths] = useState(true);
  const [rightAngle, setRightAngle] = useState(true);
  const [instructions, setInstructions] = useState(false);
  const [tab, setTab] = useState("Interact");
  const [challenge, setChallenge] = useState(challengeInitial);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const solved = solve(measures);
  const challengeSolved = solve(challenge);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setMeasure = (key: keyof RhsMeasures, value: number) =>
    act(() =>
      setMeasures((current) => ({
        ...current,
        [key]:
          key === "hypotenuse"
            ? Math.max(2, Math.min(12, value))
            : Math.max(0.1, Math.min(current.hypotenuse - 0.1, value)),
      })),
    );
  const reset = () =>
    act(() => {
      setMeasures(initial);
      setTool("Select / Move");
      setSemicircle(true);
      setLengths(true);
      setRightAngle(true);
      setInstructions(false);
      setTab("Interact");
      setChallenge(challengeInitial);
      setChallengeStarted(false);
    });
  const dragC = (event: PointerEvent<SVGCircleElement>) => {
    if (
      !svgRef.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 600;
    const y = ((event.clientY - rect.top) / rect.height) * 390;
    const ax = 90,
      ay = 275,
      scale = 48;
    setMeasure(
      "leg",
      Math.round(
        Math.max(
          0.1,
          Math.min(
            measures.hypotenuse - 0.1,
            Math.hypot(x - ax, y - ay) / scale,
          ),
        ) * 10,
      ) / 10,
    );
  };
  return (
    <section
      className="rhs10031-page"
      data-testid="school-mockup-0705"
      data-object-model="dedicated-thales-semicircle-hypotenuse-leg-rhs-construction"
      data-hypotenuse={measures.hypotenuse}
      data-leg={measures.leg}
      data-other={solved.other.toFixed(2)}
      data-valid={solved.valid}
      data-tool={tool}
      data-semicircle={semicircle}
      data-lengths={lengths}
      data-right-angle={rightAngle}
      data-tab={tab}
      data-challenge-started={challengeStarted}
      data-actions={actions}
    >
      <header className="rhs10031-hero">
        <small>CLASS 8 · PRACTICAL GEOMETRY</small>
        <h1>Right Triangle Construction by RHS</h1>
        <p>
          <b>Learning objective:</b> Construct a right triangle from the
          hypotenuse and one corresponding side.
        </p>
        <div>
          <span>♧ Class: 8</span>
          <span>▣ Topic: Practical Geometry</span>
          <span>◷ Duration: 20 min</span>
          <span>♧ Method: RHS (Right angle–Hypotenuse–Side)</span>
        </div>
      </header>
      <nav className="rhs10031-tabs">
        {tabs.map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="rhs10031-build">
        <header>
          <h2>⬡ INTERACTIVE CONSTRUCTION</h2>
          <p>
            Use Thales’ theorem: A point on the semicircle with diameter AB
            makes ∠ACB = 90°.
          </p>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </header>
        <aside className="rhs10031-controls">
          <section>
            <h3>
              <i>1</i> Hypotenuse AB (diameter)
            </h3>
            <Measure
              label="Set length AB"
              value={measures.hypotenuse}
              suffix="cm"
              min={2}
              max={12}
              onChange={(v) => setMeasure("hypotenuse", v)}
            />
            <b>
              A <span>B</span>
            </b>
            <small>
              0 cm <span>{measures.hypotenuse} cm</span>
            </small>
          </section>
          <section>
            <h3>
              <i>2</i> Choose one leg (distance AC)
            </h3>
            <Measure
              label="Set length AC"
              value={measures.leg}
              suffix="cm"
              min={0.1}
              max={Math.max(0.1, measures.hypotenuse - 0.1)}
              step={0.1}
              onChange={(v) => setMeasure("leg", v)}
            />
            <aside>
              Move point C on the semicircle so that AC equals the chosen
              length.
            </aside>
          </section>
          <section>
            <h3>
              <i>3</i> Construct point C
            </h3>
            <p>
              With center A and radius AC, draw an arc to cut the semicircle at
              C.
            </p>
            <p>Triangle ABC is the required right triangle.</p>
          </section>
          <nav>
            <button
              className={tool === "Select / Move" ? "active" : ""}
              onClick={() => act(() => setTool("Select / Move"))}
            >
              <MousePointer2 /> Select / Move
            </button>
            <button
              className={tool === "Compass (center A)" ? "active" : ""}
              onClick={() => act(() => setTool("Compass (center A)"))}
            >
              <Compass /> Compass (center A)
            </button>
            <Toggle
              label="Show semicircle"
              icon={<CircleHelp />}
              value={semicircle}
              onChange={setSemicircle}
            />
            <Toggle
              label="Show lengths"
              icon={<Ruler />}
              value={lengths}
              onChange={setLengths}
            />
            <Toggle
              label="Show right angle"
              icon={<Triangle />}
              value={rightAngle}
              onChange={setRightAngle}
            />
          </nav>
        </aside>
        <article className="rhs10031-work">
          <strong className={solved.valid ? "valid" : "invalid"}>
            <Check />{" "}
            {solved.valid
              ? "Construction valid"
              : "Leg must be shorter than the hypotenuse"}
          </strong>
          <button
            className="instructions"
            onClick={() => act(() => setInstructions((value) => !value))}
          >
            <CircleHelp /> Instructions
          </button>
          {instructions && (
            <aside className="instruction-popover">
              Drag C along the semicircle or change AB and AC with the controls.
            </aside>
          )}
          <RhsDiagram
            ref={svgRef}
            measures={measures}
            semicircle={semicircle}
            lengths={lengths}
            rightAngle={rightAngle}
            draggable
            onDrag={dragC}
            onNudge={(delta) => setMeasure("leg", measures.leg + delta)}
          />
          <footer>
            <section>
              <h3>Length check</h3>
              <p>✓ AB (hypotenuse) = {measures.hypotenuse.toFixed(2)} cm</p>
              <p>✓ AC (chosen leg) = {measures.leg.toFixed(2)} cm</p>
              <p>✓ BC (other leg) = {solved.other.toFixed(2)} cm</p>
            </section>
            <section>
              <h3>Thales’ theorem</h3>
              <p>Since C lies on the semicircle with diameter AB,</p>
              <b>∠ACB = 90°.</b>
              <MiniRhs measures={measures} />
            </section>
          </footer>
        </article>
      </section>
      <section className="rhs10031-theory">
        <article>
          <h2>▣ Why it works</h2>
          <p>
            By Thales’ theorem, any point on the semicircle with diameter AB
            subtends a right angle at C.
          </p>
          <p>
            Hence, ∠ACB = 90° and △ABC is a right triangle. Setting AC fixes one
            leg, and AB is the hypotenuse.
          </p>
          <MiniRhs measures={initial} />
          <b>C on semicircle with diameter AB ⇒ ∠ACB = 90°</b>
        </article>
        <article>
          <h2>▣ Worked example</h2>
          <p>
            Construct a right triangle with hypotenuse 8 cm and one leg 5 cm.
          </p>
          <ol>
            <li>Draw AB = 8 cm.</li>
            <li>Draw the semicircle with diameter AB.</li>
            <li>With center A, radius 5 cm, cut it at C.</li>
            <li>Join AC and CB. Then ∠ACB = 90°.</li>
          </ol>
          <MiniRhs measures={initial} />
          <strong>Result: AB = 8 cm, AC = 5 cm, BC = 6.24 cm.</strong>
        </article>
      </section>
      <section className="rhs10031-bottom">
        <article>
          <h2>⚠ Common mistake</h2>
          <b>Treating a leg as the hypotenuse.</b>
          <p>
            Using a side other than the longest side as the diameter breaks
            Thales’ theorem and gives the wrong triangle.
          </p>
          <MiniWrong />
        </article>
        <article>
          <h2>⚑ Mini challenge</h2>
          <p>
            Construct a right triangle with hypotenuse 10 cm and one leg 6 cm
            using RHS.
          </p>
          <p>
            <b>Goal:</b> Place C on the semicircle so that AC = 6 cm.
          </p>
          <button
            onClick={() => {
              setChallengeStarted(true);
              setActions((n) => n + 1);
            }}
          >
            <Play />{" "}
            {challengeStarted
              ? `Ready: BC = ${challengeSolved.other.toFixed(2)} cm`
              : "Start challenge"}
          </button>
          <MiniRhs measures={challenge} hidden={!challengeStarted} />
        </article>
      </section>
      <nav className="rhs10031-adjacent">
        <Link to="/lessons/school/class-8/class-8-practical-geometry-angle-ratio-explorer">
          ← Previous lesson
          <br />
          <b>Angle Ratio Explorer</b>
        </Link>
        <Link to="/lessons/school/class-8/class-8-practical-geometry-triangle-construction-by-asa">
          Next lesson →<br />
          <b>Right Triangle Construction by ASA</b>
        </Link>
      </nav>
    </section>
  );
}

function Measure({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span>
        {label}
        <b>
          {value} {suffix}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp")
            onChange(Math.min(max, value + step));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown")
            onChange(Math.max(min, value - step));
        }}
      />
    </label>
  );
}
function Toggle({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label>
      {icon}
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

type DiagramProps = {
  measures: RhsMeasures;
  semicircle: boolean;
  lengths: boolean;
  rightAngle: boolean;
  draggable?: boolean;
  onDrag?: (event: PointerEvent<SVGCircleElement>) => void;
  onNudge?: (delta: number) => void;
};
const RhsDiagram = forwardRef<SVGSVGElement, DiagramProps>(
  (
    { measures, semicircle, lengths, rightAngle, draggable, onDrag, onNudge },
    ref,
  ) => {
    const scale = 48,
      ax = 90,
      ay = 275,
      bx = ax + measures.hypotenuse * scale;
    const along = (measures.leg * measures.leg) / measures.hypotenuse;
    const height = Math.sqrt(
      Math.max(0, measures.leg * measures.leg - along * along),
    );
    const cx = ax + along * scale,
      cy = ay - height * scale;
    return (
      <svg
        ref={ref}
        viewBox="0 0 600 390"
        aria-label="RHS triangle on Thales semicircle"
      >
        {semicircle && (
          <path
            className="semicircle"
            d={`M${ax} ${ay}A${(bx - ax) / 2} ${(bx - ax) / 2} 0 0 1 ${bx} ${ay}`}
          />
        )}
        <line className="base" x1={ax} y1={ay} x2={bx} y2={ay} />
        <line className="leg ac" x1={ax} y1={ay} x2={cx} y2={cy} />
        <line className="leg bc" x1={bx} y1={ay} x2={cx} y2={cy} />
        <circle className="point" cx={ax} cy={ay} r="6" />
        <circle className="point" cx={bx} cy={ay} r="6" />
        <circle
          className={draggable ? "point c drag" : "point c"}
          role={draggable ? "slider" : undefined}
          aria-label={draggable ? "Point C on semicircle" : undefined}
          tabIndex={draggable ? 0 : undefined}
          cx={cx}
          cy={cy}
          r="7"
          onPointerDown={
            draggable
              ? (e) => e.currentTarget.setPointerCapture(e.pointerId)
              : undefined
          }
          onPointerMove={onDrag}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") onNudge?.(0.1);
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") onNudge?.(-0.1);
          }}
        />
        {rightAngle && (
          <path
            className="right"
            d={`M${cx - 15} ${cy + 10}l11 16 16 -11 -11 -16z`}
          />
        )}
        {lengths && (
          <>
            <text x={(ax + bx) / 2 - 18} y={ay + 31}>
              {measures.hypotenuse} cm
            </text>
            <text x={(ax + cx) / 2 - 28} y={(ay + cy) / 2}>
              {measures.leg} cm
            </text>
          </>
        )}
        <text x={ax - 12} y={ay + 30}>
          A
        </text>
        <text x={bx} y={ay + 30}>
          B
        </text>
        <text x={cx + 5} y={cy - 15}>
          C
        </text>
      </svg>
    );
  },
);
RhsDiagram.displayName = "RhsDiagram";
function MiniRhs({
  measures,
  hidden = false,
}: {
  measures: RhsMeasures;
  hidden?: boolean;
}) {
  const along = (measures.leg * measures.leg) / measures.hypotenuse,
    height = Math.sqrt(
      Math.max(0, measures.leg * measures.leg - along * along),
    ),
    scale = 13,
    ax = 15,
    ay = 92,
    bx = ax + measures.hypotenuse * scale,
    cx = ax + along * scale,
    cy = ay - height * scale;
  return (
    <svg className={hidden ? "hidden" : ""} viewBox="0 0 180 110">
      <path
        d={`M${ax} ${ay}A${(bx - ax) / 2} ${(bx - ax) / 2} 0 0 1 ${bx} ${ay}`}
      />
      <line x1={ax} y1={ay} x2={bx} y2={ay} />
      <line x1={ax} y1={ay} x2={cx} y2={cy} />
      <line x1={bx} y1={ay} x2={cx} y2={cy} />
      <circle cx={cx} cy={cy} r="3" />
    </svg>
  );
}
function MiniWrong() {
  return (
    <svg viewBox="0 0 180 100">
      <path d="M20 85A70 70 0 0 1 160 85" />
      <line x1="20" y1="85" x2="110" y2="25" />
      <line x1="160" y1="85" x2="110" y2="25" />
      <line x1="20" y1="85" x2="160" y2="85" />
      <text x="150" y="45">
        ×
      </text>
    </svg>
  );
}
