import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
import { applyDedicatedTabVisibility } from "../components/dedicatedLessonTabs";
import { angleChord, angleFromChord } from "./copyAngleMath";
import "./CopyAngleTargetLesson10023.css";

const steps = [
  [
    "Draw the source arc",
    "Place the compass at A. Draw an arc cutting both rays at B and C. These two points are equally far from A.",
  ],
  [
    "Copy the same radius",
    "Keep this compass opening. Centre it at P and draw an arc cutting the base ray at Q. Now AB = AC = PQ.",
  ],
  [
    "Measure the chord BC",
    "Change the compass opening to the straight-line distance from B to C. Transfer this gap, not the curved arc length.",
  ],
  [
    "Swing an arc from Q",
    "Keep the BC opening. Centre the compass at Q and swing a second arc across the first target arc.",
  ],
  [
    "Mark their intersection R",
    "Choose the intersection above the base ray. QR = BC, and PR has the original radius.",
  ],
  [
    "Draw the ray PR",
    "Use a straightedge through P and R. Extend the ray: the new angle is a copy of the source angle.",
  ],
];
const point = (angle: number, length: number) => ({
  x: 155 + length * Math.cos((angle * Math.PI) / 180),
  y: 230 - length * Math.sin((angle * Math.PI) / 180),
});
const arc = (angle: number, radius: number) => {
  const p = point(angle, radius);
  return `M ${155 + radius} 230 A ${radius} ${radius} 0 0 0 ${p.x} ${p.y}`;
};

export default function CopyAngleTargetLesson10023({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(36);
  const [radius, setRadius] = useState(2.5);
  const [stage, setStage] = useState(0);
  const [tab, setTab] = useState("Interact");
  const [ratio, setRatio] = useState(1);
  const [practice, setPractice] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (pageRef.current) applyDedicatedTabVisibility(pageRef.current, tab);
  }, [tab]);
  const svgRef = useRef<SVGSVGElement>(null);
  const chord = angleChord(angle, radius);
  const experimentalAngle = angleFromChord(chord, radius * ratio);
  const r = radius * 25;
  const source = point(angle, 175);
  const c = point(angle, r);
  const q = point(0, r);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const restart = () => {
    setStage(0);
    setRevealed(false);
  };
  const changeAngle = (value: number) => {
    setAngle(Math.min(150, Math.max(15, Math.round(value))));
    restart();
  };
  const drag = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    changeAngle((Math.atan2(230 - p.y, p.x - 155) * 180) / Math.PI);
  };
  const diagram = (target: boolean) => (
    <svg
      ref={target ? undefined : svgRef}
      viewBox="0 0 380 290"
      role="img"
      aria-label={
        target ? "Target compass construction at P" : "Source angle at A"
      }
    >
      <line x1="155" y1="230" x2="350" y2="230" />
      {(!target || stage >= 6) && (
        <line
          className={target ? "copy-ray" : ""}
          x1="155"
          y1="230"
          x2={source.x}
          y2={source.y}
        />
      )}
      {(!target ? stage >= 1 : stage >= 2) && (
        <path className="radius-arc" d={arc(165, r)} />
      )}
      {!target && stage >= 1 && (
        <>
          <circle cx={q.x} cy={q.y} r="5" />
          <circle cx={c.x} cy={c.y} r="5" />
          <text x={q.x + 7} y="251">
            B
          </text>
          <text x={c.x - 17} y={c.y - 10}>
            C
          </text>
        </>
      )}
      {!target && stage >= 3 && (
        <line className="chord" x1={q.x} y1={q.y} x2={c.x} y2={c.y} />
      )}
      {target && stage >= 2 && (
        <>
          <circle cx={q.x} cy={q.y} r="5" />
          <text x={q.x + 7} y="251">
            Q
          </text>
        </>
      )}
      {target && stage >= 4 && (
        <circle className="transfer-arc" cx={q.x} cy={q.y} r={chord * 25} />
      )}
      {target && stage >= 5 && (
        <>
          <line className="chord" x1={q.x} y1={q.y} x2={c.x} y2={c.y} />
          <circle className="intersection" cx={c.x} cy={c.y} r="7" />
          <text x={c.x - 17} y={c.y - 12}>
            R
          </text>
        </>
      )}
      <circle cx="155" cy="230" r="5" />
      <text x="140" y="255">
        {target ? "P" : "A"}
      </text>
      {!target && (
        <circle
          className={practice ? undefined : "drag"}
          cx={source.x}
          cy={source.y}
          r="12"
          role={practice ? undefined : "slider"}
          tabIndex={practice ? undefined : 0}
          aria-label="Change source angle"
          aria-valuemin={15}
          aria-valuemax={150}
          aria-valuenow={practice ? undefined : angle}
          onKeyDown={(e) => {
            if (
              ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(
                e.key,
              )
            ) {
              e.preventDefault();
              changeAngle(
                angle + (["ArrowLeft", "ArrowDown"].includes(e.key) ? -1 : 1),
              );
            }
          }}
          onPointerDown={(e) => {
            if (!practice) e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
          }}
        />
      )}
    </svg>
  );
  return (
    <section
      ref={pageRef}
      className="ca10023-page"
      data-testid="school-mockup-0697"
      data-object-model="dedicated-equal-radius-arc-chord-transfer-angle-copy-construction"
      data-source-angle={angle}
      data-copied-angle={stage === 6 ? angle : 0}
      data-radius={radius.toFixed(2)}
      data-steps={stage}
      data-congruent={stage === 6}
      data-tool={stage === 5 ? "Straightedge" : "Compass"}
    >
      <header className="ca10023-hero">
        <small>Class 7 · Practical Geometry</small>
        <h1>Copying an Angle</h1>
        <p>
          Build an equal angle with a compass and straightedge. Discover what
          you need to carry across.
        </p>
      </header>
      <nav className="ca10023-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="ca10023-lab">
        <h2>Angle-copying lab</h2>
        <p>
          Start with the base ray at P. Follow each compass action to build the
          second ray.
        </p>
        <div className="ca10023-settings">
          <label>
            Source angle: {practice && !revealed ? "hidden" : `${angle}°`}
            <input
              aria-label="Source angle"
              type="range"
              min="15"
              max="150"
              value={angle}
              disabled={practice}
              onChange={(e) => changeAngle(Number(e.target.value))}
            />
          </label>
          <label>
            Source arc radius: {radius.toFixed(2)} cm
            <input
              aria-label="Arc radius"
              type="range"
              min="1.5"
              max="3.5"
              step=".25"
              value={radius}
              onChange={(e) => {
                setRadius(Number(e.target.value));
                restart();
              }}
            />
          </label>
        </div>
        <div className="ca10023-diagrams">
          <article>
            <h3>1. Given angle</h3>
            {diagram(false)}
            <p>
              {practice ? "The source is fixed for this challenge. Copy its shape using the compass steps." : "Drag the blue handle or use the angle slider. Changing the source starts a fresh construction."}
            </p>
          </article>
          <article>
            <h3>2. Your construction</h3>
            {diagram(true)}
            <p>
              {stage === 6
                ? practice && !revealed
                  ? "Construction complete. Reveal the measures to check."
                  : `∠QPR = ∠BAC = ${angle}°`
                : "The next compass action adds a new piece."}
            </p>
          </article>
        </div>
        <div className="ca10023-guide">
          <ol>
            {steps.map(([title], i) => (
              <li
                key={title}
                className={stage > i ? "done" : stage === i ? "current" : ""}
              >
                {stage > i ? "✓ " : `${i + 1}. `}
                {title}
              </li>
            ))}
          </ol>
          <div>
            <p className="ca10023-step-count">
              {stage < 6 ? `Step ${stage + 1} of 6` : "Construction complete"} ·{" "}
              {stage === 5 ? "Straightedge" : "Compass"}
            </p>
            <h3>{stage < 6 ? steps[stage][0] : "You copied the angle!"}</h3>
            <p aria-live="polite">
              {stage < 6
                ? steps[stage][1]
                : "The two triangles have the same three side lengths, so their angles at A and P are equal."}
            </p>
            <div className="ca10023-actions">
              <button
                disabled={stage === 6}
                onClick={() => setStage(stage + 1)}
              >
                {stage < 6 ? steps[stage][0] : "All steps completed"}
              </button>
              <button
                disabled={stage === 0}
                onClick={() => {
                  setStage(stage - 1);
                  setRevealed(false);
                }}
              >
                Back one step
              </button>
              <button onClick={restart}>Reset construction</button>
              {practice && stage === 6 && (
                <button onClick={() => setRevealed(true)}>
                  Reveal and check
                </button>
              )}
            </div>
            {practice && revealed && (
              <p role="status">
                ✓ Both angles measure {angle}°. You constructed the copy without
                reading a protractor.
              </p>
            )}
          </div>
        </div>
        <p className="ca10023-key">
          Blue arcs: same radius. Orange segments: same chord length. Green ray:
          your copied angle.
        </p>
      </section>
      <section className="ca10023-learn">
        <h2>Learn: why it works</h2>
        <p>
          The source arc makes AB = AC. Copying its radius gives PQ = PR.
          Transferring the straight chord gives BC = QR. Triangles ABC and PQR
          therefore match by SSS (side–side–side), so ∠BAC = ∠QPR.
        </p>
        <h3>Experiment: what if the radius changes?</h3>
        <p>
          Keep the source chord BC fixed, but change the target radius. Predict
          whether the new angle gets smaller or larger, then move the slider.
        </p>
        <label>
          Target radius: {(radius * ratio).toFixed(2)} cm
          <input
            aria-label="Experimental target radius"
            type="range"
            min=".5"
            max="1.5"
            step=".05"
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
          />
        </label>
        <p role="status">
          Source: {angle}°. Target:{" "}
          {experimentalAngle === null
            ? "no intersection — the chord is longer than the circle’s diameter"
            : `${experimentalAngle.toFixed(1)}°`}
          .{" "}
          {ratio === 1
            ? "Equal radius + equal chord = equal angle."
            : ratio > 1
              ? "A larger radius makes a smaller angle for the same chord."
              : "A smaller radius needs a larger angle, if the circles can intersect."}
        </p>
        <button onClick={() => setRatio(1)}>Restore equal radii</button>
        <p>
          <b>Common mistake:</b> Keep the opening unchanged when copying the
          first radius. Then change it to BC, and keep that new opening
          unchanged while transferring the chord. The compass uses two different
          openings.
        </p>
      </section>
      <section className="ca10023-example">
        <h2>Worked Example</h2>
        <p>
          Copy a 50° angle using a 2.5 cm source radius. First draw both radius
          arcs. Measure BC, swing the chord arc from Q, mark R, then draw PR.
          The result is 50° because the triangles match — no protractor is
          needed.
        </p>
        <button
          onClick={() => {
            setAngle(50);
            setRadius(2.5);
            setPractice(false);
            restart();
            setTab("Interact");
          }}
        >
          Build the 50° example in the lab
        </button>
      </section>
      <section className="ca10023-formula">
        <h2>Key rules and formula</h2>
        <p>AB = AC = PQ = PR and BC = QR ⇒ ∠BAC = ∠QPR.</p>
        <p>
          Optional connection: chord length = 2 × radius × sin(angle ÷ 2). The
          compass transfers this length directly; you do not need trigonometry
          for the construction.
        </p>
        <p>
          Current chord BC: {chord.toFixed(2)} cm. Copying only the radius is
          insufficient: many different angles fit on the same circle.
        </p>
      </section>
      <section className="ca10023-practice">
        <h2>Practice independently</h2>
        <p>
          Construct a hidden angle without measuring it. Follow all six actions,
          then reveal both measures to check.
        </p>
        <button
          onClick={() => {
            setAngle([42, 72, 108, 135][Math.floor(Math.random() * 4)]);
            setPractice(true);
            restart();
            setTab("Interact");
          }}
        >
          Start a hidden-angle challenge
        </button>
        <h3>Think before you answer</h3>
        <p>
          After copying the radius, which distance should the compass transfer?
        </p>
        <div className="ca10023-actions">
          {[
            "The curved arc BC",
            "The straight chord BC",
            "The whole base ray",
          ].map((choice) => (
            <button
              key={choice}
              aria-pressed={answer === choice}
              onClick={() => setAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {answer && (
          <p role="status">
            {answer === "The straight chord BC"
              ? "Correct! BC is a straight side of the source triangle. Copying it completes the SSS match."
              : "Try again: a compass opening measures a straight distance between its tips. Transfer the segment joining the two arc intersections."}
          </p>
        )}
      </section>
      <nav className="ca10023-adjacent">
        {schoolLessonCatalog[idx - 1] && (
          <Link to={schoolLessonCatalog[idx - 1].route}>← Previous lesson</Link>
        )}
        {schoolLessonCatalog[idx + 1] && (
          <Link to={schoolLessonCatalog[idx + 1].route}>Next lesson →</Link>
        )}
      </nav>
      <LessonTopicStudyBoard lessonId={10023} view={tab} />
    </section>
  );
}
