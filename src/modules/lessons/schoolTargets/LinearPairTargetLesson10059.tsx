import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Minus,
  MousePointer2,
  PenTool,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LinearPairTargetLesson10059.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const clamp = (value: number) => Math.max(5, Math.min(175, Math.round(value)));

export default function LinearPairTargetLesson10059({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(72);
  const [mode, setMode] = useState<"axiom" | "converse">("axiom");
  const [tool, setTool] = useState("ray");
  const [snap, setSnap] = useState(true);
  const [labels, setLabels] = useState(true);
  const [fills, setFills] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [goalA, setGoalA] = useState(65);
  const [goalB, setGoalB] = useState(115);
  const [actions, setActions] = useState(0);
  const updateAngle = (value: number) => {
    const next = snap ? Math.round(clamp(value) / 5) * 5 : clamp(value);
    setAngle(next);
    setActions((n) => n + 1);
  };
  const reset = () => {
    setAngle(72);
    setMode("axiom");
    setTool("ray");
    setSnap(true);
    setLabels(true);
    setFills(true);
    setActions((n) => n + 1);
  };
  const challengeValid = goalA + goalB === 180;
  return (
    <section
      className="lp10059-page"
      data-testid="school-mockup-0733"
      data-object-model="dedicated-linear-pair-axiom-converse-construction-engine"
      data-angle={angle}
      data-supplement={180 - angle}
      data-mode={mode}
      data-tool={tool}
      data-snap={String(snap)}
      data-labels={String(labels)}
      data-fills={String(fills)}
      data-challenge={`${goalA},${goalB}`}
      data-challenge-valid={String(challengeValid)}
      data-actions={actions}
    >
      <header className="lp10059-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Linear Pair Axiom and Converse</h1>
        <p>
          Use case: Use linear pairs to connect adjacent angles and straight
          lines.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="lp10059-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => {
              setTab(item);
              setActions((n) => n + 1);
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="lp10059-lab">
          <aside>
            <h2>INTERACTIVE CONSTRUCTION</h2>
            <h3>Mode</h3>
            <div className="lp10059-mode">
              <button
                className={mode === "axiom" ? "active" : ""}
                onClick={() => setMode("axiom")}
              >
                Linear Pair
                <br />
                (Axiom)
              </button>
              <button
                className={mode === "converse" ? "active" : ""}
                onClick={() => setMode("converse")}
              >
                Converse
                <br />
                (Construct)
              </button>
            </div>
            <h3>Instructions</h3>
            <p>
              Drag the purple ray OC to form adjacent angles with OA and OB.
            </p>
            <p className="check">
              <Check /> Keep A, O, B collinear.
            </p>
            <p className="check">
              <Check /> Observe the angle measures and their sum.
            </p>
            <h3>Controls</h3>
            <label>
              Rotate OC <b>{angle}°</b>
              <input
                aria-label="Rotate OC"
                type="range"
                min="5"
                max="175"
                value={angle}
                onChange={(e) => updateAngle(+e.target.value)}
              />
            </label>
            <Toggle label="Snap" value={snap} onChange={setSnap} detail="5°" />
            <Toggle label="Show labels" value={labels} onChange={setLabels} />
            <Toggle
              label="Show angle fills"
              value={fills}
              onChange={setFills}
            />
            <button className="lp10059-reset" onClick={reset}>
              Reset <RotateCcw />
            </button>
          </aside>
          <article className="lp10059-canvas">
            <nav>
              {[
                ["select", MousePointer2],
                ["ray", PenTool],
                ["line", Minus],
                ["delete", Trash2],
              ].map(([name, Icon]) => (
                <button
                  key={String(name)}
                  className={tool === name ? "active" : ""}
                  title={`${name} tool`}
                  onClick={() => {
                    setTool(String(name));
                    setActions((n) => n + 1);
                  }}
                >
                  <Icon />
                </button>
              ))}
              <button title="Construction help">
                <CircleHelp />
              </button>
            </nav>
            <LinearPairDiagram
              angle={angle}
              labels={labels}
              fills={fills}
              onAngle={updateAngle}
            />
            <section className="lp10059-measure">
              <h3>LIVE MEASUREMENTS</h3>
              <div>
                <b>∠AOC = {angle}°</b>
                <b>∠COB = {180 - angle}°</b>
                <strong>
                  Sum = 180°<small>(Linear Pair)</small>
                </strong>
              </div>
              <progress max="180" value="180" />
            </section>
            <footer>
              <b>Result:</b> ∠AOC and ∠COB form a linear pair and sum is 180°.
            </footer>
          </article>
        </section>
        <section className="lp10059-theory">
          <article>
            <h2>💡 WHY IT WORKS</h2>
            <p>
              A linear pair consists of two adjacent angles whose non-common
              arms are opposite rays (a straight line).
            </p>
            <p>
              They partition a straight angle, so their measures always sum to
              180°.
            </p>
            <MiniPair angle={68} />
            <aside>
              <b>💡 Key idea</b>
              <br />
              Adjacent + opposite non-common arms = linear pair ⇒ sum = 180°.
            </aside>
          </article>
          <article>
            <h2>☆ WORKED EXAMPLE</h2>
            <p>
              <b>If ∠AOC = 72°, then ∠COB = ?</b>
            </p>
            <MiniPair angle={72} />
            <b className="solution">Solution</b>
            <p>
              By Linear Pair Axiom,
              <br />
              ∠AOC + ∠COB = 180°
              <br />
              72° + ∠COB = 180°
              <br />
              ∠COB = 108°
            </p>
            <footer>Hence, ∠COB = 108°.</footer>
          </article>
          <article className="warning">
            <h2>△ MISCONCEPTION ALERT</h2>
            <p>
              Supplementary angles need not form a linear pair unless they are
              adjacent and their non-common arms are opposite rays.
            </p>
            <b>Not a linear pair (not adjacent)</b>
            <MiniPair angle={130} broken />
            <p>
              130° + 50° = 180°, but angles are not adjacent.
              <br />
              <b>So they do not form a linear pair.</b>
            </p>
            <footer>
              <b>⏱ Remember</b>
              <br />
              Adjacency + correct arms are both required.
            </footer>
          </article>
        </section>
        <section className="lp10059-challenge">
          <header>
            <h2>◎ CHALLENGE: Prove the outer rays are opposite</h2>
          </header>
          <div className="lp10059-challenge-grid">
            <aside>
              <p>
                Adjust the two adjacent angles so that their sum is 180°. Then
                verify that the outer rays are opposite.
              </p>
              <AngleGoal
                label="∠AOC target"
                value={goalA}
                color="blue"
                onChange={setGoalA}
              />
              <AngleGoal
                label="∠COB target"
                value={goalB}
                color="orange"
                onChange={setGoalB}
              />
              <small>
                Keep O on the line. Use Converse mode to build the line when sum
                = 180°.
              </small>
              <button
                onClick={() => {
                  setMode("converse");
                  setActions((n) => n + 1);
                }}
              >
                Switch to Converse mode
              </button>
            </aside>
            <article>
              <h3>Your construction</h3>
              <LinearPairDiagram
                angle={goalA}
                labels
                fills
                onAngle={(value) => {
                  setGoalA(clamp(value));
                  setGoalB(180 - clamp(value));
                  setActions((n) => n + 1);
                }}
                compact
              />
              <footer>
                <div>
                  <b>Check</b>
                  <strong>Sum = {goalA + goalB}°</strong>
                  <small>
                    {challengeValid ? "(Good!)" : "Adjust to 180°."}
                  </small>
                </div>
                <div>Outer rays OA and OB are opposite rays.</div>
                {challengeValid && <Check />}
              </footer>
            </article>
          </div>
        </section>
      </main>
      <nav className="lp10059-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-vertically-opposite-angles">
          <ArrowLeft /> Previous: Vertically Opposite Angles
        </Link>
        <Link to="/lessons/school">
          Next: Corresponding Angles <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Toggle({
  label,
  value,
  onChange,
  detail,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  detail?: string;
}) {
  return (
    <label className="lp10059-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i />
      {detail && <b>{detail}</b>}
    </label>
  );
}
function AngleGoal({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className={`lp10059-goal ${color}`}>
      <span>{label}</span>
      <b>{value}°</b>
      <button onClick={() => onChange(clamp(value - 1))}>−</button>
      <button onClick={() => onChange(clamp(value + 1))}>+</button>
      <input
        aria-label={label}
        type="range"
        min="5"
        max="175"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}
function LinearPairDiagram({
  angle,
  labels,
  fills,
  onAngle,
  compact = false,
}: {
  angle: number;
  labels: boolean;
  fills: boolean;
  onAngle: (value: number) => void;
  compact?: boolean;
}) {
  const rad = (angle * Math.PI) / 180,
    x = 300 + 155 * Math.cos(rad),
    y = 178 - 155 * Math.sin(rad);
  const drag = (e: React.PointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const dx = ((e.clientX - box.left) / box.width) * 600 - 300,
      dy = 178 - ((e.clientY - box.top) / box.height) * 330;
    onAngle((Math.atan2(dy, dx) * 180) / Math.PI);
  };
  return (
    <svg
      className={`lp10059-diagram ${compact ? "compact" : ""}`}
      viewBox="0 0 600 330"
      aria-label="Interactive linear pair construction"
    >
      <defs>
        <marker
          id={`arrow-${compact}`}
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" />
        </marker>
      </defs>
      {fills && (
        <>
          <path
            className="blue-fill"
            d={`M300 178 L240 178 A60 60 0 0 1 ${300 + 60 * Math.cos(rad)} ${178 - 60 * Math.sin(rad)} Z`}
          />
          <path
            className="orange-fill"
            d={`M300 178 L${300 + 60 * Math.cos(rad)} ${178 - 60 * Math.sin(rad)} A60 60 0 0 1 360 178 Z`}
          />
        </>
      )}
      <line className="base" x1="50" y1="178" x2="550" y2="178" />
      <line
        className="ray"
        x1="300"
        y1="178"
        x2={x}
        y2={y}
        markerEnd={`url(#arrow-${compact})`}
      />
      <circle cx="300" cy="178" r="7" />
      <circle
        className="handle"
        cx={x}
        cy={y}
        r="8"
        tabIndex={0}
        onPointerMove={drag}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onAngle(angle + 1);
          if (e.key === "ArrowLeft") onAngle(angle - 1);
        }}
      />
      {labels && (
        <>
          <text x="42" y="207">
            A
          </text>
          <text x="292" y="207">
            O
          </text>
          <text x="544" y="207">
            B
          </text>
          <text x={x + 12} y={y + 3}>
            C
          </text>
          <text className="blue-text" x="230" y="132">
            {angle}°
          </text>
          <text className="orange-text" x="365" y="137">
            {180 - angle}°
          </text>
        </>
      )}
    </svg>
  );
}
function MiniPair({
  angle,
  broken = false,
}: {
  angle: number;
  broken?: boolean;
}) {
  return (
    <svg className="lp10059-mini" viewBox="0 0 220 130">
      <line x1="10" y1="95" x2="210" y2="95" />
      <line x1={broken ? 100 : 110} y1="95" x2={broken ? 190 : 165} y2="15" />
      <path className="blue-fill" d="M110 95H75A35 35 0 0 1 128 65Z" />
      <path className="orange-fill" d="M110 95L128 65A35 35 0 0 1 145 95Z" />
      <text x="76" y="68">
        {angle}°
      </text>
      <text x="138" y="73">
        {180 - angle}°
      </text>
    </svg>
  );
}
