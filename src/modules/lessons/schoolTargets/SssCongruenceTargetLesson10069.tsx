import {
  ArrowLeft,
  ArrowRight,
  Check,
  Link2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SssCongruenceTargetLesson10069.css";

type Sides = { red: number; blue: number; green: number };
const START: Sides = { red: 5, blue: 6, green: 7 };
const modes = ["None", "Translate", "Rotate", "Flip", "Perfect Overlay"];

function triangle(sides: Sides) {
  const valid =
    sides.red + sides.blue > sides.green &&
    sides.red + sides.green > sides.blue &&
    sides.blue + sides.green > sides.red;
  if (!valid) return { valid, x: 130, y: 90 };
  const x =
      (sides.green ** 2 + sides.red ** 2 - sides.blue ** 2) / (2 * sides.red),
    y = Math.sqrt(Math.max(0, sides.green ** 2 - x ** 2));
  return { valid, x: 25 + x * 28, y: 225 - y * 28 };
}

export default function SssCongruenceTargetLesson10069({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState<Sides>(START),
    [showCorrespondence, setShowCorrespondence] = useState(true),
    [showMeasures, setShowMeasures] = useState(true),
    [arcs, setArcs] = useState(true),
    [mode, setMode] = useState(4),
    [tab, setTab] = useState(0),
    [challengePairs, setChallengePairs] = useState(["DE", "EF", "FD"]),
    [challengeOverlay, setChallengeOverlay] = useState(false),
    [actions, setActions] = useState(0);
  const construction = triangle(sides),
    congruent = construction.valid,
    challengeCorrect =
      challengePairs.join(",") === "DE,EF,FD" && challengeOverlay;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setSides(START);
      setShowCorrespondence(true);
      setShowMeasures(true);
      setArcs(true);
      setMode(4);
    });
  return (
    <section
      className="sss10069-page"
      data-testid="school-mockup-0743"
      data-object-model="dedicated-linked-sss-circle-intersection-rigid-overlay-engine"
      data-sides={`${sides.red},${sides.blue},${sides.green}`}
      data-valid={String(construction.valid)}
      data-mode={modes[mode]}
      data-arcs={String(arcs)}
      data-measures={String(showMeasures)}
      data-correspondence={String(showCorrespondence)}
      data-challenge-pairs={challengePairs.join(",")}
      data-challenge={String(challengeCorrect)}
      data-actions={actions}
    >
      <header className="sss10069-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>SSS Congruence</h1>
        <p>
          <b>Objective:</b> Prove triangles congruent when all three
          corresponding sides are equal.
        </p>
        <div>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Triangle Proofs</span>
          <span>Theorem</span>
          <span>SSS</span>
        </div>
        <aside>
          <h2>Theorem (SSS)</h2>
          <p>
            If three sides of one triangle are equal to three sides of another
            triangle, then the triangles are congruent.
          </p>
          <p>In symbols: SSS ⇒ △ABC ≅ △DEF</p>
        </aside>
      </header>
      <nav className="sss10069-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="sss10069-lab">
          <header>
            <div>
              <h2>Explore & Construct</h2>
              <p>
                Construct △ABC and △DEF. Adjust side lengths together using the
                linked controls.
                <br />
                Check whether the triangles are congruent.
              </p>
            </div>
            <nav>
              <label>
                Show correspondences{" "}
                <input
                  type="checkbox"
                  checked={showCorrespondence}
                  onChange={(e) =>
                    act(() => setShowCorrespondence(e.target.checked))
                  }
                />
                <i />
              </label>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </nav>
          </header>
          <div className="sss10069-workspace">
            <aside className="sss10069-controls">
              <h3>
                Linked Side Controls <small>(corresponding sides)</small>
              </h3>
              <SideControl
                color="red"
                label="AB ↔ DE"
                value={sides.red}
                onChange={(red) => act(() => setSides({ ...sides, red }))}
              />
              <SideControl
                color="blue"
                label="BC ↔ EF"
                value={sides.blue}
                onChange={(blue) => act(() => setSides({ ...sides, blue }))}
              />
              <SideControl
                color="green"
                label="CA ↔ FD"
                value={sides.green}
                onChange={(green) => act(() => setSides({ ...sides, green }))}
              />
              <button className="lock">
                <Link2 /> Lock Linking
              </button>
              <section>
                <h3>Tools</h3>
                <button onClick={() => act(() => setArcs(false))}>
                  ● Point
                </button>
                <button
                  className={arcs ? "active" : ""}
                  onClick={() => act(() => setArcs(true))}
                >
                  ◌ Add Arc
                </button>
                <button onClick={() => act(() => setArcs(false))}>
                  ▱ Clear All
                </button>
                <label>
                  <input
                    type="checkbox"
                    checked={showMeasures}
                    onChange={(e) =>
                      act(() => setShowMeasures(e.target.checked))
                    }
                  />{" "}
                  Show Measurements
                </label>
              </section>
            </aside>
            <SssTriangle
              title="△ABC"
              letters="ABC"
              sides={sides}
              arcs={arcs}
              measures={showMeasures}
            />
            <SssTriangle
              title="△DEF"
              letters="DEF"
              sides={sides}
              arcs={arcs}
              measures={showMeasures}
            />
            <section className="sss10069-overlay-panel">
              <header>
                <b>Overlay (Rigid Motion)</b>
                <nav>
                  {modes.map((x, i) => (
                    <button
                      key={x}
                      className={mode === i ? "active" : ""}
                      onClick={() => act(() => setMode(i))}
                    >
                      {x}
                    </button>
                  ))}
                </nav>
              </header>
              <div
                className={
                  congruent ? "sss10069-result" : "sss10069-result invalid"
                }
              >
                <Check />
                <p>
                  <b>Congruence Result</b>
                  <strong>△ABC {congruent ? "≅" : "≇"} △DEF by SSS</strong>
                  <span>
                    {congruent
                      ? "All three pairs of corresponding sides are equal."
                      : "These lengths cannot construct a triangle."}
                  </span>
                </p>
                {showCorrespondence && (
                  <aside>
                    <b>Selected Correspondences</b>
                    <span>
                      <i className="red" /> A ↔ D
                    </span>
                    <span>
                      <i className="blue" /> B ↔ E
                    </span>
                    <span>
                      <i className="green" /> C ↔ F
                    </span>
                  </aside>
                )}
                <OverlayMini sides={sides} mode={mode} />
              </div>
            </section>
          </div>
        </section>
        <section className="sss10069-theory">
          <article>
            <h2>Why SSS Works</h2>
            <p>
              If all three corresponding sides are equal, one triangle can be
              moved, rotated, or reflected to fit exactly on the other. The
              third side leaves no room for a different shape.
            </p>
            <ol>
              <li>Fix side AB onto DE.</li>
              <li>
                Point C must lie at the intersection of two arcs with radii CA
                and CB.
              </li>
              <li>Hence the triangles coincide perfectly.</li>
            </ol>
            <div>
              <SssMini />
              <b>Rigid motion →</b>
              <SssMini />
            </div>
            <strong>
              Conclusion: Three equal corresponding sides determine congruence.
            </strong>
          </article>
          <article>
            <h2>Worked Example</h2>
            <p>
              <b>Given:</b> In △ABC and △DEF,
            </p>
            <p className="pairs">
              <span>AB = DE = 5</span>
              <span>BC = EF = 6</span>
              <span>CA = FD = 7</span>
            </p>
            <p>
              <b>Prove:</b> △ABC ≅ △DEF
            </p>
            <ol>
              <li>AB = DE = 5</li>
              <li>BC = EF = 6</li>
              <li>CA = FD = 7</li>
            </ol>
            <p>Thus, all three pairs of corresponding sides are equal.</p>
            <strong>△ABC ≅ △DEF</strong>
          </article>
        </section>
        <section className="sss10069-warning">
          <TriangleAlert />
          <div>
            <h2>Common Misconception</h2>
            <b>Equal perimeters do NOT guarantee congruence.</b>
            <p>
              Two triangles can have the same perimeter but different shapes.
            </p>
          </div>
          <SssMini sides={{ red: 5, blue: 4, green: 3 }} />
          <SssMini sides={{ red: 6, blue: 5, green: 1 }} />
          <aside>
            Perimeter = 3+4+5 = 12
            <br />
            Perimeter = 5+1+6 = 12
            <br />
            <b>
              Same perimeter,
              <br />
              but not congruent.
            </b>
          </aside>
        </section>
        <section className="sss10069-challenge">
          <header>
            <h2>Challenge: Match, Measure & Decide</h2>
            <p>
              Match the three corresponding sides between the triangles. Then
              use Perfect Overlay to test congruence.
            </p>
          </header>
          <SssTriangle
            title="Triangle 1"
            letters="ABC"
            sides={START}
            arcs={false}
            measures
          />
          <section>
            <h3>1. Match the sides</h3>
            {[
              ["CA (7)", "FD"],
              ["CB (6)", "EF"],
              ["AB (5)", "DE"],
            ].map(([label, correct], i) => (
              <label key={label}>
                <i className={["green", "blue", "red"][i]} />
                {label} ↔{" "}
                <select
                  value={challengePairs[i]}
                  onChange={(e) =>
                    act(() => {
                      const next = [...challengePairs];
                      next[i] = e.target.value;
                      setChallengePairs(next);
                    })
                  }
                >
                  {["DE", "EF", "FD"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                {challengePairs[i] === correct ? <Check /> : <TriangleAlert />}
              </label>
            ))}
          </section>
          <section>
            <h3>2. Test with overlay</h3>
            <button onClick={() => act(() => setChallengeOverlay(false))}>
              Overlay
            </button>
            <button
              className="perfect"
              onClick={() => act(() => setChallengeOverlay(true))}
            >
              Perfect Overlay
            </button>
            <p className={challengeCorrect ? "pass" : "fail"}>
              <b>{challengeCorrect ? "Congruent!" : "Not congruent."}</b>
              <br />
              {challengeCorrect
                ? "All side correspondences match."
                : "Side lengths do not match the correspondence."}
            </p>
          </section>
          <aside>
            <h3>Goal</h3>
            <p>
              <Check /> Match all three sides
            </p>
            <p>
              <Check /> Use overlay
            </p>
            <p>
              <Check /> Rule out equal perimeter only
            </p>
          </aside>
        </section>
      </main>
      <nav className="sss10069-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-asa-congruence">
          <ArrowLeft />
          <span>
            Previous
            <br />
            <b>ASA Congruence</b>
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-rhs-congruence">
          <span>
            Next
            <br />
            <b>RHS Congruence</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function SideControl({
  color,
  label,
  value,
  onChange,
}: {
  color: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="sss10069-side">
      <span>
        <i className={color} />
        <b>{label}</b>
        <output>{value}</output>
        <small>units</small>
      </span>
      <input
        aria-label={label}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small className="sss10069-range-ends">
        <span>1</span>
        <span>10</span>
      </small>
    </label>
  );
}
function SssTriangle({
  title,
  letters,
  sides,
  arcs,
  measures,
}: {
  title: string;
  letters: string;
  sides: Sides;
  arcs: boolean;
  measures: boolean;
}) {
  const p = triangle(sides),
    [a, b, c] = letters.split("");
  return (
    <article className="sss10069-triangle">
      <i>{title}</i>
      <svg viewBox="0 0 280 270" aria-label={`SSS triangle ${letters}`}>
        {arcs && (
          <>
            <path className="arc green" d="M62 70A150 150 0 0 1 140 118" />
            <path className="arc blue" d="M140 118A140 140 0 0 1 218 70" />
          </>
        )}
        <path
          className="shape"
          d={`M25 230L${25 + sides.red * 28} 230L${p.x} ${p.y}Z`}
        />
        {[
          [25, 230],
          [25 + sides.red * 28, 230],
          [p.x, p.y],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" />
        ))}
        <text x="9" y="250">
          {a}
        </text>
        <text x={20 + sides.red * 28} y="250">
          {b}
        </text>
        <text x={p.x - 5} y={p.y - 12}>
          {c}
        </text>
        {measures && (
          <>
            <text className="red" x={20 + sides.red * 14} y="250">
              {sides.red}
            </text>
            <text
              className="blue"
              x={p.x + (25 + sides.red * 28 - p.x) / 2 + 10}
              y={(p.y + 230) / 2}
            >
              {sides.blue}
            </text>
            <text className="green" x={p.x / 2} y={(p.y + 230) / 2}>
              {sides.green}
            </text>
          </>
        )}
      </svg>
    </article>
  );
}
function OverlayMini({ sides, mode }: { sides: Sides; mode: number }) {
  const shift = mode === 0 ? 16 : mode === 1 ? 8 : 0,
    rotate = mode === 2 ? "rotate(8deg)" : "",
    flip = mode === 3 ? "scaleX(-1)" : "";
  return (
    <svg className="sss10069-overlay-mini" viewBox="0 0 120 90">
      <path d="M10 75L100 75L55 10Z" />
      <path
        className="second"
        style={{
          transform: `translateX(${shift}px) ${rotate} ${flip}`,
          transformOrigin: "55px 50px",
        }}
        d="M10 75L100 75L55 10Z"
      />
      <text x="36" y="88">
        {sides.red}-{sides.blue}-{sides.green}
      </text>
    </svg>
  );
}
function SssMini({ sides = START }: { sides?: Sides }) {
  return (
    <svg className="sss10069-mini" viewBox="0 0 130 90">
      <path d="M5 75L110 75L55 10Z" />
      <text className="red" x="50" y="88">
        {sides.red}
      </text>
      <text className="blue" x="87" y="45">
        {sides.blue}
      </text>
      <text className="green" x="20" y="45">
        {sides.green}
      </text>
    </svg>
  );
}
