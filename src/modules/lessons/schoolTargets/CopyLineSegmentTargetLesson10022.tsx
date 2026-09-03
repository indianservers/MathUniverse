import { CheckCircle2, Lightbulb, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CopyLineSegmentTargetLesson10022.css";

const clamp = (value: number) =>
  Math.min(8, Math.max(1, Math.round(value * 20) / 20));

export default function CopyLineSegmentTargetLesson10022({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [radius, setRadius] = useState(5);
  const [history, setHistory] = useState<number[]>([]);
  const [future, setFuture] = useState<number[]>([]);
  const [tool, setTool] = useState("Select");
  const [hint, setHint] = useState(false);
  const [checked, setChecked] = useState(true);
  const [challenge, setChallenge] = useState("");
  const [challengeGrade, setChallengeGrade] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const original = 5;
  const difference = Math.abs(original - radius);
  const verified = difference < 0.01 && checked;
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const changeRadius = (value: number) => {
    setHistory((values) => [...values, radius]);
    setFuture([]);
    setRadius(clamp(value));
    setChecked(false);
    setActions((v) => v + 1);
  };
  const undo = () => {
    const value = history.at(-1);
    if (value === undefined) return;
    setFuture((values) => [radius, ...values]);
    setHistory((values) => values.slice(0, -1));
    setRadius(value);
    setChecked(false);
  };
  const redo = () => {
    const value = future[0];
    if (value === undefined) return;
    setHistory((values) => [...values, radius]);
    setFuture((values) => values.slice(1));
    setRadius(value);
    setChecked(false);
  };
  const reset = () => {
    setRadius(5);
    setHistory([]);
    setFuture([]);
    setTool("Select");
    setHint(false);
    setChecked(true);
    setChallenge("");
    setChallengeGrade("idle");
    setActions((v) => v + 1);
  };
  const drag = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 330;
    changeRadius((x - 70) / 38);
  };
  return (
    <section
      className="cl10022-page"
      data-testid="school-mockup-0696"
      data-object-model="dedicated-compass-radius-ray-endpoint-line-segment-copy-construction"
      data-radius={radius.toFixed(2)}
      data-original={original.toFixed(2)}
      data-difference={difference.toFixed(2)}
      data-verified={verified}
      data-tool={tool}
      data-hint={hint}
      data-challenge={challengeGrade}
      data-actions={actions}
    >
      <header className="cl10022-hero">
        <small>CLASS 7 · PRACTICAL GEOMETRY</small>
        <h1>Copying a Line Segment</h1>
        <p>
          <b>Objective:</b> To copy a given line segment using compass and
          straightedge and verify that the copied segment is equal to the
          original.
        </p>
        <dl>
          <span>◷ 24 min</span>
          <span>▱ Foundation</span>
          <span>▥ Practical Construction</span>
          <span>Class 7 · geometry2d</span>
        </dl>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="cl10022-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button className={item === "Interact" ? "active" : ""} key={item}>
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="cl10022-process">
        {[
          ["1", "Observe", "See the goal"],
          ["2", "Manipulate", "Build the construction"],
          ["3", "Pattern", "Notice what stays same"],
          ["4", "Rule", "Understand the rule"],
          ["5", "Try", "Do it yourself"],
        ].map((item) => (
          <article className={item[0] === "2" ? "active" : ""} key={item[0]}>
            <i>{item[0]}</i>
            <span>
              <b>{item[1]}</b>
              <small>{item[2]}</small>
            </span>
          </article>
        ))}
      </section>
      <section className="cl10022-lab">
        <header>
          <h2>Interactive Construction</h2>
          <div>
            <button
              aria-label="Undo construction"
              disabled={!history.length}
              onClick={undo}
            >
              <Undo2 />
            </button>
            <button
              aria-label="Redo construction"
              disabled={!future.length}
              onClick={redo}
            >
              <Redo2 />
            </button>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </div>
          <p>
            Copy the given line segment AB to the ray CD using compass and
            straightedge.
          </p>
        </header>
        <section className="cl10022-workspace">
          <aside className="cl10022-tools">
            <h3>TOOLS</h3>
            {["Select", "Compass", "Line / Ray", "Point", "Erase"].map(
              (item, i) => (
                <button
                  className={tool === item ? "active" : ""}
                  onClick={() => {
                    setTool(item);
                    setActions((v) => v + 1);
                  }}
                  key={item}
                >
                  <i>{["⌁", "♧", "╱", "⊙", "⌫"][i]}</i>
                  {item}
                </button>
              ),
            )}
            <button onClick={() => setHint(!hint)}>
              <Lightbulb />
              Hints
            </button>
            {hint && (
              <p>Set the compass opening to AB, then place the needle at C.</p>
            )}
          </aside>
          <article className="cl10022-given">
            <h3>GIVEN SEGMENT</h3>
            <svg viewBox="0 0 150 130">
              <line x1="20" y1="60" x2="130" y2="60" />
              <circle cx="20" cy="60" r="5" />
              <circle cx="130" cy="60" r="5" />
              <text x="10" y="45">
                A
              </text>
              <text x="128" y="45">
                B
              </text>
            </svg>
            <p>Length AB = 5.00 cm</p>
          </article>
          <article className="cl10022-construction">
            <h3>
              CONSTRUCTION <small>(build here)</small>
            </h3>
            <svg
              ref={svgRef}
              viewBox="0 0 330 280"
              role="img"
              aria-label="Compass copying line segment to ray CD"
            >
              <defs>
                <pattern
                  id="grid10022"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M32 0H0V32" />
                </pattern>
              </defs>
              <rect width="330" height="280" fill="url(#grid10022)" />
              <line className="ray" x1="70" y1="218" x2="315" y2="218" />
              <path
                className="arc"
                d={`M70 218 A ${radius * 38} ${radius * 38} 0 0 1 ${70 + radius * 38} 218`}
              />
              <g className="compass">
                <line x1="130" y1="55" x2="70" y2="218" />
                <line x1="130" y1="55" x2={70 + radius * 38} y2="218" />
                <circle cx="130" cy="55" r="17" />
                <circle cx="130" cy="55" r="7" />
                <line x1="130" y1="38" x2="130" y2="18" />
              </g>
              <circle cx="70" cy="218" r="6" />
              <circle
                className="handle"
                role="slider"
                tabIndex={0}
                aria-label="Copied endpoint D"
                aria-valuemin={1}
                aria-valuemax={8}
                aria-valuenow={radius}
                onPointerDown={(e) =>
                  e.currentTarget.setPointerCapture(e.pointerId)
                }
                onPointerMove={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
                }}
                cx={70 + radius * 38}
                cy="218"
                r="7"
              />
              <text x="48" y="224">
                C
              </text>
              <text x={73 + radius * 38} y="239">
                D
              </text>
            </svg>
            <div>
              {[
                ["Step 1", "With center A, draw an arc of any radius."],
                [
                  "Step 2",
                  "With the same radius and center C, draw an arc cutting the ray at D.",
                ],
                ["Step 3", "Join C to D."],
              ].map((item) => (
                <span key={item[0]}>
                  <b>{item[0]}</b>
                  <p>{item[1]}</p>
                  <CheckCircle2 />
                </span>
              ))}
            </div>
          </article>
          <aside className="cl10022-measures">
            <h3>MEASURES</h3>
            <i>AB</i>
            <strong>
              5.00 <small>cm</small>
            </strong>
            <i>CD</i>
            <strong>
              {radius.toFixed(2)} <small>cm</small>
            </strong>
            <b>
              Difference
              <br />
              |AB − CD|
            </b>
            <strong className={difference < 0.01 ? "ok" : "bad"}>
              {difference.toFixed(2)} <small>cm</small>
            </strong>
            <aside className={verified ? "ok" : "bad"}>
              <CheckCircle2 />
              {verified ? "Verified!" : "Not equal"}
              <b>AB = CD</b>
            </aside>
          </aside>
        </section>
        <footer>
          <p>
            ⓘ <b>How to use:</b> Set compass to the length of AB, then from C
            mark off the same length on the ray.
          </p>
          <label>
            Compass radius
            <button
              aria-label="Decrease compass radius"
              onClick={() => changeRadius(radius - 0.25)}
            >
              −
            </button>
            <input
              aria-label="Compass radius"
              type="number"
              min="1"
              max="8"
              step=".25"
              value={radius}
              onChange={(e) => changeRadius(Number(e.target.value))}
            />
            <button
              aria-label="Increase compass radius"
              onClick={() => changeRadius(radius + 0.25)}
            >
              ＋
            </button>
          </label>
          <button
            onClick={() => {
              setChecked(true);
              setActions((v) => v + 1);
            }}
          >
            ⌁ Check
          </button>
        </footer>
      </section>
      <section className="cl10022-theory">
        <article>
          <h2>Worked Example</h2>
          <p>Copy AB to ray CD.</p>
          <svg viewBox="0 0 210 150">
            <line x1="30" y1="120" x2="185" y2="120" />
            <path d="M30 120A85 85 0 0 1 115 120" />
            <line x1="65" y1="30" x2="30" y2="120" />
            <line x1="65" y1="30" x2="115" y2="120" />
            <circle cx="65" cy="30" r="11" />
            <circle cx="30" cy="120" r="5" />
            <circle cx="115" cy="120" r="5" />
          </svg>
          <p>
            Here, AB = 5.00 cm and CD = 5.00 cm.
            <br />
            Therefore, AB = CD.
          </p>
        </article>
        <article>
          <h2>Key Rule / Definition</h2>
          <p>
            Copying a line segment means constructing a segment equal in length
            to the given segment at a new position using only compass and
            straightedge.
          </p>
          <h3>Definition</h3>
          <p>Two line segments are equal if they have the same length.</p>
          <svg viewBox="0 0 210 75">
            <line x1="30" y1="20" x2="180" y2="20" />
            <line x1="30" y1="58" x2="180" y2="58" />
            <circle cx="30" cy="20" r="4" />
            <circle cx="180" cy="20" r="4" />
            <circle cx="30" cy="58" r="4" />
            <circle cx="180" cy="58" r="4" />
          </svg>
          <p>If AB = CD, then the segments are equal.</p>
        </article>
        <article>
          <h2>⚠ Common Misconception</h2>
          <p>Changing the compass width while constructing.</p>
          <svg viewBox="0 0 210 120">
            <line x1="10" y1="90" x2="200" y2="90" />
            <path d="M65 90A55 55 0 0 0 30 38" />
            <path d="M140 90A70 70 0 0 0 95 32" />
            <circle cx="65" cy="90" r="5" />
            <circle cx="140" cy="90" r="5" />
            <text x="57" y="113">
              ✕
            </text>
            <text x="134" y="113">
              ✓
            </text>
          </svg>
          <p>
            Always keep the same compass width used on the given segment while
            marking on the ray.
          </p>
        </article>
      </section>
      <section className="cl10022-challenge">
        <article>
          <h2>Your Turn: Quick Challenge</h2>
          <p>
            Given AB = 6.20 cm. Copy AB on the ray CD. What is the length of CD?
          </p>
        </article>
        <label>
          Answer
          <input
            aria-label="Challenge copied length"
            placeholder="Enter length in cm"
            value={challenge}
            onChange={(e) => {
              setChallenge(e.target.value);
              setChallengeGrade("idle");
            }}
          />
        </label>
        <button
          onClick={() =>
            setChallengeGrade(
              Math.abs(Number(challenge) - 6.2) < 0.001 ? "correct" : "wrong",
            )
          }
        >
          Check
        </button>
        {challengeGrade !== "idle" && (
          <strong className={challengeGrade}>
            {challengeGrade === "correct"
              ? "Correct: CD = 6.20 cm."
              : "The copied segment must equal AB."}
          </strong>
        )}
      </section>
      <nav className="cl10022-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous Lesson<b>Construction of Perpendicular Bisector</b>
          </span>
        </Link>
        <Link to={next.route}>
          <span>
            Next Lesson<b>Construction of Angle Bisector</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}
