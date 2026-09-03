import { CheckCircle2, Redo2, Undo2 } from "lucide-react";
import { PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CopyAngleTargetLesson10023.css";

const clampAngle = (angle: number) =>
  Math.min(150, Math.max(15, Math.round(angle)));
const endpoint = (angle: number, length = 150) => ({
  x: 28 + Math.cos((angle * Math.PI) / 180) * length,
  y: 190 - Math.sin((angle * Math.PI) / 180) * length,
});
const stepLabels = [
  "Draw arc from A",
  "Draw arc from P",
  "Mark intersection 1",
  "Draw arc from 1",
  "Mark intersection 2",
  "Draw PR",
];

export default function CopyAngleTargetLesson10023({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(36);
  const [copiedAngle, setCopiedAngle] = useState(36);
  const [radius, setRadius] = useState(2.5);
  const [steps, setSteps] = useState([true, true, true, true, true, true]);
  const [tool, setTool] = useState("Compass");
  const [history, setHistory] = useState<number[]>([]);
  const [future, setFuture] = useState<number[]>([]);
  const [challengeDone, setChallengeDone] = useState(true);
  const [checked, setChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const [tab, setTab] = useState("Interact");
  const sourceSvg = useRef<SVGSVGElement>(null);
  const complete = steps.every(Boolean);
  const congruent = complete && checked && Math.abs(angle - copiedAngle) < 0.01;
  const sourceEnd = endpoint(angle);
  const targetEnd = endpoint(copiedAngle);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const changeAngle = (value: number) => {
    setHistory((values) => [...values, angle]);
    setFuture([]);
    setAngle(clampAngle(value));
    setChecked(false);
    setActions((v) => v + 1);
  };
  const dragSource = (event: PointerEvent<SVGCircleElement>) => {
    const svg = sourceSvg.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 220;
    const y = ((event.clientY - rect.top) / rect.height) * 230;
    changeAngle((Math.atan2(190 - y, x - 28) * 180) / Math.PI);
  };
  const undo = () => {
    const value = history.at(-1);
    if (value === undefined) return;
    setFuture((values) => [angle, ...values]);
    setHistory((values) => values.slice(0, -1));
    setAngle(value);
    setChecked(false);
  };
  const redo = () => {
    const value = future[0];
    if (value === undefined) return;
    setHistory((values) => [...values, angle]);
    setFuture((values) => values.slice(1));
    setAngle(value);
    setChecked(false);
  };
  const copy = () =>
    act(() => {
      setCopiedAngle(angle);
      setSteps([true, true, true, true, true, true]);
      setChecked(true);
    });
  return (
    <section
      className="ca10023-page"
      data-testid="school-mockup-0697"
      data-object-model="dedicated-equal-radius-arc-chord-transfer-angle-copy-construction"
      data-source-angle={angle}
      data-copied-angle={copiedAngle}
      data-radius={radius.toFixed(2)}
      data-complete={complete}
      data-congruent={congruent}
      data-tool={tool}
      data-steps={steps.filter(Boolean).length}
      data-challenge={challengeDone}
      data-actions={actions}
      data-tab={tab}
    >
      <header className="ca10023-hero">
        <small>Class 7 &gt; Practical Geometry</small>
        <h1>▣ Copying an Angle</h1>
        <p>
          <b>Objective:</b> Use compass and straightedge to copy a given angle
          with equal measure.
        </p>
        <dl>
          <span>♙ Level 7</span>
          <span>▣ Practical Geometry</span>
          <span>♙ Construction</span>
          <span>◷ Time 24 min</span>
          <span>▣ Syllabus: NCERT Class 7</span>
        </dl>
      </header>
      <nav className="ca10023-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={item === tab ? "active" : ""}
              aria-pressed={item === tab}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="ca10023-process">
        {[
          ["1", "Observe", "See the given angle."],
          ["2", "Manipulate", "Construct the copy step by step."],
          ["3", "Pattern", "Notice what stays the same."],
          ["4", "Rule", "Understand the key idea."],
          ["5", "Try", "Build it on your own."],
        ].map((item) => (
          <article className={item[0] === "1" ? "active" : ""} key={item[0]}>
            <i>{item[0]}</i>
            <span>
              <b>{item[1]}</b>
              <small>{item[2]}</small>
            </span>
          </article>
        ))}
      </section>
      <section className="ca10023-lab">
        <article className="ca10023-source">
          <h2>Given angle (source) ⓘ</h2>
          <svg
            ref={sourceSvg}
            viewBox="0 0 220 230"
            role="img"
            aria-label="Draggable source angle CAB"
          >
            <line x1="28" y1="190" x2="190" y2="190" />
            <line x1="28" y1="190" x2={sourceEnd.x} y2={sourceEnd.y} />
            <path
              d={`M68 190 A40 40 0 0 0 ${28 + 40 * Math.cos((angle * Math.PI) / 180)} ${190 - 40 * Math.sin((angle * Math.PI) / 180)}`}
            />
            <circle cx="28" cy="190" r="5" />
            <circle cx="190" cy="190" r="5" />
            <circle
              className="drag"
              role="slider"
              tabIndex={0}
              aria-label="Source point C"
              aria-valuemin={15}
              aria-valuemax={150}
              aria-valuenow={angle}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  dragSource(e);
              }}
              cx={sourceEnd.x}
              cy={sourceEnd.y}
              r="6"
            />
            <text x="20" y="211">
              A
            </text>
            <text x="187" y="211">
              B
            </text>
            <text x={sourceEnd.x - 8} y={sourceEnd.y - 9}>
              C
            </text>
          </svg>
          <strong>∠CAB = {angle}°</strong>
          <footer>
            <button onClick={() => changeAngle(36)}>
              ↻ Reset source angle
            </button>
            <button onClick={() => changeAngle(angle >= 120 ? 24 : angle + 12)}>
              ◷ Change angle
            </button>
          </footer>
          <p>
            m∠CAB = <b>{angle}°</b>
          </p>
        </article>
        <aside className="ca10023-controls">
          <section>
            <h2>Construction Steps</h2>
            {stepLabels.map((label, i) => (
              <button
                onClick={() =>
                  act(() =>
                    setSteps((values) =>
                      values.map((value, j) => (j === i ? !value : value)),
                    ),
                  )
                }
                key={label}
              >
                <i>{i + 1}</i>
                {label}
                <CheckCircle2 className={steps[i] ? "done" : ""} />
              </button>
            ))}
          </section>
          <section>
            <h2>Tools</h2>
            <div>
              {["Select", "Compass", "Straightedge"].map((item, i) => (
                <button
                  aria-label={item}
                  className={tool === item ? "active" : ""}
                  onClick={() => act(() => setTool(item))}
                  key={item}
                >
                  {["⌁", "♧", "╱"][i]}
                </button>
              ))}
            </div>
            <footer>
              <button
                aria-label="Undo angle change"
                disabled={!history.length}
                onClick={undo}
              >
                <Undo2 />
              </button>
              <button
                aria-label="Redo angle change"
                disabled={!future.length}
                onClick={redo}
              >
                <Redo2 />
              </button>
            </footer>
          </section>
          <section>
            <label>
              Arc radius<strong>{radius.toFixed(2)} cm</strong>
              <button
                aria-label="Decrease arc radius"
                onClick={() => act(() => setRadius(Math.max(1, radius - 0.25)))}
              >
                −
              </button>
              <button
                aria-label="Increase arc radius"
                onClick={() => act(() => setRadius(Math.min(5, radius + 0.25)))}
              >
                ＋
              </button>
              <input
                aria-label="Arc radius"
                type="range"
                min="1"
                max="5"
                step=".25"
                value={radius}
                onChange={(e) => act(() => setRadius(Number(e.target.value)))}
              />
            </label>
          </section>
          <aside className={congruent ? "ok" : "bad"}>
            <h2>ⓞ Congruence Check</h2>
            <p>m∠CAB = {angle}°</p>
            <p>m∠RPQ = {copiedAngle}°</p>
            <b>
              {congruent
                ? "✓ Angles are congruent"
                : "Copy and check the angle"}
            </b>
          </aside>
        </aside>
        <article className="ca10023-target">
          <h2>Constructed angle (target) ⓘ</h2>
          <svg
            viewBox="0 0 220 230"
            role="img"
            aria-label="Constructed target angle RPQ"
          >
            <line x1="28" y1="190" x2="190" y2="190" />
            <line x1="28" y1="190" x2={targetEnd.x} y2={targetEnd.y} />
            <path className="arc1" d="M105 190A77 77 0 0 0 91 146" />
            <path
              className="arc2"
              d={`M105 190A48 48 0 0 1 ${28 + 77 * Math.cos((copiedAngle * Math.PI) / 180)} ${190 - 77 * Math.sin((copiedAngle * Math.PI) / 180)}`}
            />
            <circle cx="28" cy="190" r="5" />
            <circle cx="190" cy="190" r="5" />
            <circle cx="105" cy="190" r="5" />
            <circle cx={targetEnd.x} cy={targetEnd.y} r="5" />
            <text x="20" y="211">
              P
            </text>
            <text x="187" y="211">
              Q
            </text>
            <text x={targetEnd.x - 8} y={targetEnd.y - 9}>
              R
            </text>
            <text x="101" y="211">
              1
            </text>
            <text x="87" y="144">
              2
            </text>
          </svg>
          <footer>
            <button
              onClick={() =>
                act(() => {
                  setCopiedAngle(0);
                  setSteps([false, false, false, false, false, false]);
                  setChecked(false);
                })
              }
            >
              ↻ Reset construction
            </button>
            <button onClick={copy}>＠ Check again</button>
          </footer>
          <p>
            m∠RPQ = <b>{copiedAngle}°</b>
          </p>
        </article>
      </section>
      <aside className="ca10023-how">
        ⓘ <b>How to copy:</b> Use equal-radius arcs. Transfer the chord AB to
        the new base PQ. The new angle RPQ equals the given angle CAB.
      </aside>
      <section className="ca10023-theory">
        <article>
          <h2>
            ◉ Worked Example <small>✓ Solved</small>
          </h2>
          <p>Copy ∠CAB = 50° to a new base PQ.</p>
          <div>
            <svg viewBox="0 0 130 120">
              <line x1="15" y1="95" x2="112" y2="95" />
              <line x1="15" y1="95" x2="80" y2="30" />
              <path d="M48 95A33 33 0 0 0 38 72" />
              <text x="48" y="79">
                50°
              </text>
            </svg>
            <svg viewBox="0 0 130 120">
              <line x1="15" y1="95" x2="112" y2="95" />
              <line x1="15" y1="95" x2="80" y2="30" />
              <path d="M70 95A55 55 0 0 0 50 54" />
              <path d="M85 95A70 70 0 0 0 61 43" />
            </svg>
          </div>
          <aside>
            <b>Result:</b> m∠RPQ = 50° = m∠CAB
            <br />
            Therefore, ∠RPQ is a copy of ∠CAB.
          </aside>
        </article>
        <article>
          <h2>▣ Key Rule / Definition</h2>
          <h3>Angle Copying Rule</h3>
          <p>
            If two angles are constructed by the steps of copying an angle, then
            they are congruent.
          </p>
          <aside>
            <b>Idea</b>
            <p>
              Equal-radius arcs create equal chords.
              <br />
              Equal chords on equal radii subtend equal angles.
            </p>
          </aside>
          <footer>
            <b>Notation</b>
            <p>∠CAB ≅ ∠RPQ</p>
          </footer>
        </article>
        <article>
          <h2>ⓘ Common Mistake</h2>
          <svg viewBox="0 0 210 125">
            <line x1="15" y1="95" x2="95" y2="95" />
            <line x1="120" y1="95" x2="200" y2="95" />
            <path d="M80 95A65 65 0 0 0 36 34" />
            <path d="M168 95A48 48 0 0 0 143 54" />
            <circle cx="80" cy="95" r="4" />
            <circle cx="168" cy="95" r="4" />
          </svg>
          <p>
            Using different arc radii changes the chord length, so the copied
            angle will not be equal.
          </p>
          <b>Tip: Keep the compass width same throughout the construction.</b>
        </article>
      </section>
      <section className="ca10023-challenge">
        <article>
          <h2>
            ◉ Try this Challenge <small>Challenge 1</small>
          </h2>
          <p>
            Copy the given angle of 72° to the base XY. Show your construction
            and check congruence.
          </p>
          <div>
            <svg viewBox="0 0 130 115">
              <line x1="15" y1="90" x2="112" y2="90" />
              <line x1="15" y1="90" x2="73" y2="25" />
              <path d="M48 90A33 33 0 0 0 25 59" />
              <text x="45" y="70">
                72°
              </text>
            </svg>
            <svg viewBox="0 0 170 115">
              <line x1="15" y1="90" x2="155" y2="90" />
              <line x1="15" y1="90" x2="95" y2="20" />
              <path d="M95 90A80 80 0 0 0 67 29" />
              <path d="M112 90A97 97 0 0 0 78 16" />
            </svg>
            <aside>
              <b>Answer & Check</b>
              <p>m∠RXY = 72°</p>
              <button onClick={() => setChallengeDone(true)}>
                Check answer
              </button>
              <button onClick={() => setChallengeDone(false)}>Reset</button>
              {challengeDone && <strong>✓ Congruent</strong>}
            </aside>
          </div>
        </article>
        <aside>
          <h2>▣ Quick Check</h2>
          <p>Drag the blue point C to change the given angle.</p>
          <svg viewBox="0 0 210 110">
            <line x1="25" y1="85" x2="180" y2="85" />
            <line
              x1="25"
              y1="85"
              x2={25 + 120 * Math.cos((angle * Math.PI) / 180)}
              y2={85 - 120 * Math.sin((angle * Math.PI) / 180)}
            />
            <text x="82" y="75">
              {angle}°
            </text>
          </svg>
          <footer>
            Current m∠CAB<strong>{angle}°</strong>
          </footer>
        </aside>
      </section>
      <nav className="ca10023-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous Lesson<b>Copying a Line Segment</b>
          </span>
        </Link>
        <Link to={next.route}>
          <span>
            Next Lesson<b>Perpendicular Bisector Construction</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}
