import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./VerticalAnglesTargetLesson10058.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

export default function VerticalAnglesTargetLesson10058({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(68);
  const [challenge, setChallenge] = useState(125);
  const [tab, setTab] = useState("Interact");
  const [actions, setActions] = useState(0);
  const act = (value: number, setter: (value: number) => void) => {
    setter(Math.max(25, Math.min(155, Math.round(value))));
    setActions((n) => n + 1);
  };
  return (
    <section
      className="va10058-page"
      data-testid="school-mockup-0732"
      data-object-model="dedicated-intersecting-lines-drag-angle-pair-engine"
      data-angle={angle}
      data-supplement={180 - angle}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="va10058-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Vertically Opposite Angles</h1>
        <p>
          Discover why opposite angles formed by intersecting lines are equal.
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
      <nav className="va10058-tabs">
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
        <section className="va10058-explore">
          <header>
            <div>
              <h2>Explore: Drag the lines</h2>
              <p>
                Drag either line to change the angles.
                <br />
                Watch the measures update in real time.
              </p>
            </div>
            <label>
              Rotate lines{" "}
              <input
                aria-label="Angle between lines"
                type="range"
                min="25"
                max="155"
                value={angle}
                onChange={(e) => act(+e.target.value, setAngle)}
              />
            </label>
            <button title="Reset angle" onClick={() => act(68, setAngle)}>
              <RotateCcw />
            </button>
          </header>
          <div className="va10058-stage">
            <AngleDiagram angle={angle} onAngle={(v) => act(v, setAngle)} />
            <AngleReadout angle={angle} />
          </div>
          <footer>
            ⓘ &nbsp; Drag either line (<i>p</i> or <i>q</i>), or use Rotate, to
            explore.
          </footer>
        </section>
        <section className="va10058-theory">
          <article>
            <h2>💡 Why it works</h2>
            <p>
              When two lines intersect, vertical angles have their sides
              extended in opposite directions.
            </p>
            <p>
              They are formed by the same pair of lines, so they are always
              equal.
            </p>
            <MiniDiagram />
            <p>Adjacent angles form a linear pair and always sum to 180°.</p>
          </article>
          <article>
            <h2>▣ Worked Example</h2>
            <p>If ∠1 = 68°, find all other angles.</p>
            <ol>
              <li>
                ∠1 and ∠3 are vertically opposite.
                <br />
                <b>So, ∠3 = 68°.</b>
              </li>
              <li>
                ∠1 and ∠2 form a linear pair.
                <br />
                <b>∠2 = 180° − 68° = 112°.</b>
              </li>
              <li>
                ∠2 and ∠4 are vertically opposite.
                <br />
                <b>So, ∠4 = 112°.</b>
              </li>
            </ol>
            <AngleGrid angle={68} />
          </article>
          <article>
            <h2 className="warn">△ Common Misconception</h2>
            <p>
              Vertical angles are opposite,
              <br />
              not adjacent.
            </p>
            <MiniDiagram />
            <b className="good">Correct: ∠1 and ∠3 are vertical.</b>
            <MiniDiagram adjacent />
            <b className="bad">Incorrect: ∠1 and ∠2 are adjacent.</b>
          </article>
        </section>
        <section className="va10058-challenge">
          <header>
            <h2>🏆 Challenge</h2>
            <p>
              Drag line <i>q</i> to make ∠1 an obtuse angle of 125°.
              <br />
              Then predict all four angles.
            </p>
          </header>
          <div className="va10058-challenge-grid">
            <div>
              <strong>
                Target
                <br />
                ∠1 = 125°
              </strong>
              <button onClick={() => act(125, setChallenge)}>
                Drag line q ☝
              </button>
            </div>
            <AngleDiagram
              angle={challenge}
              onAngle={(v) => act(v, setChallenge)}
              compact
            />
            <AngleReadout angle={challenge} challenge />
          </div>
        </section>
      </main>
      <nav className="va10058-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-proof-structure-and-logical-statements">
          <ArrowLeft /> Previous: Intersecting Lines
        </Link>
        <Link to="/lessons/school">
          Next: Angle Pairs and Properties <ArrowRight />
        </Link>
      </nav>
      <section className="va10058-takeaway">
        <h2>🏆 Key Takeaway</h2>
        <p>
          If two lines intersect, vertically opposite angles are equal.
          <br />
          Adjacent angles form a linear pair and sum to 180°.
        </p>
        <div>
          <b>You explored</b>
          <span>Intersecting lines</span>
          <span>Angle measures</span>
          <span>Angle relationships</span>
        </div>
        <div>
          <b>You proved</b>
          <span>Vertical angles are equal</span>
          <span>Linear pairs sum to 180°</span>
        </div>
      </section>
    </section>
  );
}

function AngleDiagram({
  angle,
  onAngle,
  compact = false,
}: {
  angle: number;
  onAngle: (n: number) => void;
  compact?: boolean;
}) {
  const cx = 250,
    cy = 180,
    r = compact ? 135 : 205,
    p = 35,
    q = p - angle;
  const point = (degrees: number) => ({
    x: cx + r * Math.cos((degrees * Math.PI) / 180),
    y: cy + r * Math.sin((degrees * Math.PI) / 180),
  });
  const a = point(p),
    b = point(p + 180),
    c = point(q),
    d = point(q + 180);
  const drag = (e: React.PointerEvent<SVGCircleElement>) => {
    const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width * cx) / 500;
    const y = e.clientY - rect.top - (rect.height * cy) / 360;
    const degrees = (Math.atan2(y, x) * 180) / Math.PI;
    let value = p - degrees;
    while (value < 0) value += 180;
    onAngle(value);
  };
  return (
    <svg
      className={`va10058-diagram ${compact ? "compact" : ""}`}
      viewBox="0 0 500 360"
      aria-label="Interactive intersecting lines diagram"
    >
      <line className="p" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      <line className="q" x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
      <circle className="handle p" cx={b.x} cy={b.y} r="8" />
      <circle
        className="handle q"
        cx={c.x}
        cy={c.y}
        r="9"
        tabIndex={0}
        onPointerMove={(e) => e.buttons === 1 && drag(e)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onAngle(angle + 1);
          if (e.key === "ArrowLeft") onAngle(angle - 1);
        }}
      />
      <circle className="origin" cx={cx} cy={cy} r="7" />
      <text x={cx - 8} y={cy - 82}>
        1
      </text>
      <text x={cx - 20} y={cy - 58}>
        {angle}°
      </text>
      <text x={cx - 105} y={cy - 4}>
        2
      </text>
      <text x={cx - 119} y={cy + 20}>
        {180 - angle}°
      </text>
      <text x={cx - 7} y={cy + 88}>
        3
      </text>
      <text x={cx - 20} y={cy + 113}>
        {angle}°
      </text>
      <text x={cx + 99} y={cy - 4}>
        4
      </text>
      <text x={cx + 90} y={cy + 20}>
        {180 - angle}°
      </text>
      <text x={cx - 7} y={cy + 24}>
        O
      </text>
      <text className="line-label" x={b.x + 10} y={b.y}>
        p
      </text>
      <text className="line-label" x={c.x + 8} y={c.y - 8}>
        q
      </text>
    </svg>
  );
}

function AngleReadout({
  angle,
  challenge = false,
}: {
  angle: number;
  challenge?: boolean;
}) {
  return (
    <aside className="va10058-readout">
      <h3>{challenge ? "Your results" : "Angle Measures"}</h3>
      <AngleGrid angle={angle} />
      {!challenge && (
        <>
          <hr />
          <h3>Opposite (Vertical) Pairs</h3>
          <p>
            ∠1 = ∠3 <Check />
          </p>
          <p>
            ∠2 = ∠4 <Check />
          </p>
          <hr />
          <h3>Adjacent (Linear Pair) Sums</h3>
          {[
            "∠1 + ∠2 = 180°",
            "∠2 + ∠3 = 180°",
            "∠3 + ∠4 = 180°",
            "∠4 + ∠1 = 180°",
          ].map((x) => (
            <p key={x}>
              {x}
              <Check />
            </p>
          ))}
        </>
      )}
      {challenge && <strong>Great! All results are correct.</strong>}
    </aside>
  );
}
function AngleGrid({ angle }: { angle: number }) {
  return (
    <div className="va10058-values">
      {[angle, 180 - angle, angle, 180 - angle].map((v, i) => (
        <span key={i}>
          ∠{i + 1}
          <b>{v}°</b>
          <Check />
        </span>
      ))}
    </div>
  );
}
function MiniDiagram({ adjacent = false }: { adjacent?: boolean }) {
  return (
    <svg className="va10058-mini" viewBox="0 0 180 130">
      <line x1="20" y1="110" x2="160" y2="15" />
      <line x1="25" y1="20" x2="155" y2="115" />
      <path className="blue" d="M90 65 L68 49 A28 28 0 0 1 112 49Z" />
      <path
        className={adjacent ? "green" : "purple"}
        d={
          adjacent
            ? "M90 65 L112 49 A28 28 0 0 1 115 85Z"
            : "M90 65 L112 81 A28 28 0 0 1 68 81Z"
        }
      />
    </svg>
  );
}
