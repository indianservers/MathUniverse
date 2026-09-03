import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Save,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EqualSidesAnglesTargetLesson10071.css";

type Point = { x: number; y: number };
type Measures = {
  ab: number;
  ac: number;
  bc: number;
  a: number;
  b: number;
  c: number;
};
const INITIAL: Point = { x: 0, y: 2.43 };
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const degrees = (r: number) => (r * 180) / Math.PI;
function measure(p: Point): Measures {
  const ab0 = Math.hypot(p.x + 1, p.y),
    ac0 = Math.hypot(p.x - 1, p.y),
    bc0 = 2;
  const a = degrees(
      Math.acos(
        clamp((ab0 ** 2 + ac0 ** 2 - bc0 ** 2) / (2 * ab0 * ac0), -1, 1),
      ),
    ),
    b = degrees(Math.atan2(p.y, p.x + 1)),
    c = 180 - a - b;
  return {
    ab: (ab0 / Math.hypot(1, INITIAL.y)) * 6.72,
    ac: (ac0 / Math.hypot(1, INITIAL.y)) * 6.72,
    bc: 7.24,
    a,
    b,
    c,
  };
}
function constrained(point: Point, sideLock: number, angleLock: number) {
  const p = { x: clamp(point.x, -1.35, 1.35), y: clamp(point.y, 0.65, 2.8) };
  if (sideLock === 1 || angleLock === 1) p.x = 0;
  else if (sideLock === 2 || angleLock === 3) {
    p.y = Math.min(p.y, 1.95);
    p.x = -1 + Math.sqrt(Math.max(0.01, 4 - p.y ** 2));
  } else if (sideLock === 3 || angleLock === 2) {
    p.y = Math.min(p.y, 1.95);
    p.x = 1 - Math.sqrt(Math.max(0.01, 4 - p.y ** 2));
  }
  return p;
}
const fmt = (n: number) => n.toFixed(1);

export default function EqualSidesAnglesTargetLesson10071({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [apex, setApex] = useState<Point>(INITIAL),
    [sideLock, setSideLock] = useState(1),
    [angleLock, setAngleLock] = useState(1),
    [options, setOptions] = useState([true, true, true, true]),
    [tab, setTab] = useState(0),
    [challengeY, setChallengeY] = useState(2.06),
    [choices, setChoices] = useState([false, false, true, false]),
    [reason, setReason] = useState(""),
    [saved, setSaved] = useState(false),
    [actions, setActions] = useState(0);
  const m = measure(apex),
    cm = measure({ x: 0, y: challengeY }),
    equalSides = Math.abs(m.ab - m.ac) < 0.02,
    equalAngles = Math.abs(m.b - m.c) < 0.05;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const move = (p: Point) =>
    act(() => setApex(constrained(p, sideLock, angleLock)));
  const setSide = (value: number) =>
    act(() => {
      setSideLock(value);
      setApex(constrained(apex, value, angleLock));
    });
  const setAngle = (value: number) =>
    act(() => {
      setAngleLock(value);
      setApex(constrained(apex, sideLock, value));
    });
  const reset = () =>
    act(() => {
      setApex(INITIAL);
      setSideLock(1);
      setAngleLock(1);
      setOptions([true, true, true, true]);
    });
  return (
    <section
      className="esa10071-page"
      data-testid="school-mockup-0745"
      data-object-model="dedicated-constrained-apex-isosceles-opposite-parts-engine"
      data-apex={`${apex.x.toFixed(2)},${apex.y.toFixed(2)}`}
      data-sides={`${m.ab.toFixed(2)},${m.ac.toFixed(2)},${m.bc.toFixed(2)}`}
      data-angles={`${m.a.toFixed(1)},${m.b.toFixed(1)},${m.c.toFixed(1)}`}
      data-side-lock={sideLock}
      data-angle-lock={angleLock}
      data-options={options.map(Number).join(",")}
      data-equal={String(equalSides && equalAngles)}
      data-challenge-y={challengeY.toFixed(2)}
      data-choice={choices.map(Number).join(",")}
      data-reason-length={reason.length}
      data-saved={String(saved)}
      data-actions={actions}
    >
      <header className="esa10071-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>Equal Sides and Equal Angles</h1>
        <p>
          Explore how equal sides and opposite angles are connected in a
          triangle.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="esa10071-tabs">
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
        <section className="esa10071-lab">
          <div className="esa10071-canvas">
            <header>
              <h2>
                <FlaskConical /> INTERACTIVE TRIANGLE LAB
              </h2>
              <p>
                Drag the purple vertex to explore. Use the controls to lock
                sides or angles.
              </p>
            </header>
            <IsoscelesDiagram
              point={apex}
              measures={m}
              options={options}
              equalSides={equalSides}
              onMove={move}
            />
            <strong className={equalSides && equalAngles ? "truth" : "pending"}>
              <Check /> AB {equalSides ? "=" : "≠"} AC ⇔ ∠B{" "}
              {equalAngles ? "=" : "≠"} ∠C
            </strong>
            <footer>
              <h3>Live Measurements</h3>
              {[
                ["AB", m.ab],
                ["AC", m.ac],
                ["BC", m.bc],
              ].map(([x, v]) => (
                <span key={String(x)}>
                  {x} = {(v as number).toFixed(2)}
                </span>
              ))}
              {[
                ["∠A", m.a],
                ["∠B", m.b],
                ["∠C", m.c],
              ].map(([x, v]) => (
                <span className="angle" key={String(x)}>
                  {x} = {(v as number).toFixed(1)}°
                </span>
              ))}
            </footer>
          </div>
          <aside className="esa10071-controls">
            <h2>CONTROLS</h2>
            <section>
              <h3>Lock Equal Sides</h3>
              <p>Keep two sides equal while you drag.</p>
              <Segmented
                value={sideLock}
                labels={["Off", "AB = AC", "AB = BC", "AC = BC"]}
                onChange={setSide}
              />
            </section>
            <section>
              <h3>Lock Equal Angles</h3>
              <p>Keep two angles equal while you drag.</p>
              <Segmented
                value={angleLock}
                labels={["Off", "∠B = ∠C", "∠A = ∠B", "∠A = ∠C"]}
                onChange={setAngle}
              />
            </section>
            <section>
              <h3>Display Options</h3>
              {[
                "Show angle measures",
                "Show side lengths",
                "Show tick marks",
                "Show angle arcs",
              ].map((label, i) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={options[i]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...options];
                        next[i] = e.target.checked;
                        setOptions(next);
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </section>
            <button onClick={reset}>
              <RotateCcw /> Reset Triangle
            </button>
          </aside>
        </section>
        <section className="esa10071-now">
          <Check />
          <p>
            <b>What's true right now</b>
            <br />
            {equalSides ? "AB = AC" : "AB ≠ AC"}, so the opposite angles are{" "}
            {equalAngles ? "equal: ∠B = ∠C." : "not equal."}
          </p>
          <span>Experiment • Observe • Discover</span>
        </section>
        <section className="esa10071-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              <b>In any triangle:</b>
            </p>
            <p>◆ Equal sides have equal opposite angles.</p>
            <p>◆ Equal angles have equal opposite sides.</p>
            <p>
              This follows from the <b>Isosceles Triangle Theorem.</b>
            </p>
            <a href="#challenge">Learn more →</a>
          </article>
          <article>
            <h2>▦ WORKED EXAMPLE</h2>
            <p>If AB = AC, then ∠B = ∠C.</p>
            <MiniIso />
            <p>
              Since AB = AC, the triangle is isosceles.
              <br />
              Therefore, ∠B = ∠C.
            </p>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> WARNING: COMMON MISTAKE
            </h2>
            <p>
              The equal angle lies <b>opposite</b>—not adjacent to—the equal
              side.
            </p>
            <strong>
              <Check /> Correct
            </strong>
            <MiniIso />
            <hr />
            <strong className="bad">⊗ Incorrect</strong>
            <MiniIso wrong />
          </article>
        </section>
        <section id="challenge" className="esa10071-challenge">
          <header>
            <h2>◎ CHALLENGE</h2>
            <p>
              Drag the apex while keeping AB = AC. Then answer the question.
            </p>
          </header>
          <div>
            <IsoscelesDiagram
              point={{ x: 0, y: challengeY }}
              measures={cm}
              options={[true, true, true, true]}
              equalSides
              onMove={(p) => act(() => setChallengeY(clamp(p.y, 0.8, 2.5)))}
            />
          </div>
          <section>
            <b>Question</b>
            <p>While keeping AB = AC:</p>
            <h3>
              Which angles remain equal no matter where you drag the vertex?
            </h3>
            <p>Select all that apply.</p>
            {[
              "∠A and ∠B",
              "∠A and ∠C",
              "∠B and ∠C",
              "All three angles are always equal",
            ].map((label, i) => (
              <label key={label}>
                <input
                  type="checkbox"
                  checked={choices[i]}
                  onChange={(e) =>
                    act(() => {
                      const next = [...choices];
                      next[i] = e.target.checked;
                      setChoices(next);
                    })
                  }
                />
                {label}
              </label>
            ))}
          </section>
          <aside>
            <label>
              <b>Your explanation (optional)</b>
              <textarea
                value={reason}
                onChange={(e) => act(() => setReason(e.target.value))}
                placeholder="Type your reasoning here..."
              />
            </label>
            <p>Great explanations help you learn!</p>
            <footer>
              <b>Hint</b>
              <p>
                Think about which sides are equal and where the opposite angles
                are.
              </p>
            </footer>
          </aside>
        </section>
        <section className="esa10071-rule">
          <h2>⊙ THE RULE TO REMEMBER</h2>
          <p>
            In a triangle, equal sides have equal opposite angles, and equal
            angles have equal opposite sides.
          </p>
          <button
            className={saved ? "saved" : ""}
            onClick={() => act(() => setSaved((value) => !value))}
          >
            <Save /> {saved ? "Saved" : "Save rule"}
          </button>
        </section>
      </main>
      <nav className="esa10071-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality">
          <ArrowLeft />
          <span>
            Previous
            <br />
            <b>Triangle Inequality</b>
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-converse-isosceles-theorem">
          <span>
            Next
            <br />
            <b>Converse of Isosceles Triangle Theorem</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Segmented({
  value,
  labels,
  onChange,
}: {
  value: number;
  labels: string[];
  onChange: (n: number) => void;
}) {
  return (
    <div className="esa10071-segmented">
      {labels.map((label, i) => (
        <button
          key={label}
          className={value === i ? "active" : ""}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
function IsoscelesDiagram({
  point,
  measures,
  options,
  equalSides,
  onMove,
}: {
  point: Point;
  measures: Measures;
  options: boolean[];
  equalSides: boolean;
  onMove: (p: Point) => void;
}) {
  const sx = 250 + point.x * 90,
    sy = 315 - point.y * 95;
  return (
    <svg
      className="esa10071-diagram"
      viewBox="0 0 500 360"
      aria-label="Draggable equal sides and angles triangle"
    >
      <path className="shape" d={`M70 315L430 315L${sx} ${sy}Z`} />
      {options[3] && (
        <>
          <path
            className="arc a"
            d={`M${sx - 30} ${sy + 32}Q${sx} ${sy + 52} ${sx + 30} ${sy + 32}`}
          />
          <path className="arc b" d="M70 315H112Q104 284 88 276" />
          <path className="arc c" d="M430 315H388Q396 284 412 276" />
        </>
      )}
      {options[2] && equalSides && (
        <>
          <path
            className="tick"
            d={`M${(70 + sx) / 2 - 8} ${(315 + sy) / 2 - 8}l18 16M${(70 + sx) / 2 - 13} ${(315 + sy) / 2 - 2}l18 16`}
          />
          <path
            className="tick"
            d={`M${(430 + sx) / 2 - 10} ${(315 + sy) / 2 + 8}l18-16M${(430 + sx) / 2 - 15} ${(315 + sy) / 2 + 2}l18-16`}
          />
        </>
      )}
      <circle
        className="handle"
        cx={sx}
        cy={sy}
        r="8"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") onMove({ ...point, y: point.y + 0.05 });
          if (e.key === "ArrowDown") onMove({ ...point, y: point.y - 0.05 });
          if (e.key === "ArrowLeft") onMove({ ...point, x: point.x - 0.05 });
          if (e.key === "ArrowRight") onMove({ ...point, x: point.x + 0.05 });
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) {
            const rect =
              e.currentTarget.ownerSVGElement?.getBoundingClientRect();
            if (rect)
              onMove({
                x:
                  (((e.clientX - rect.left) / rect.width) * 500) / 90 -
                  250 / 90,
                y: (315 - ((e.clientY - rect.top) / rect.height) * 360) / 95,
              });
          }
        }}
      />
      <circle cx="70" cy="315" r="6" />
      <circle cx="430" cy="315" r="6" />
      <text x={sx - 8} y={sy - 18}>
        A
      </text>
      <text x="45" y="338">
        B
      </text>
      <text x="440" y="338">
        C
      </text>
      {options[0] && (
        <>
          <text className="ma" x={sx - 17} y={sy + 58}>
            {fmt(measures.a)}°
          </text>
          <text className="mb" x="103" y="290">
            {fmt(measures.b)}°
          </text>
          <text className="mc" x="350" y="290">
            {fmt(measures.c)}°
          </text>
        </>
      )}
      {options[1] && (
        <>
          <text className="length" x="128" y="205">
            {measures.ab.toFixed(2)}
          </text>
          <text className="length" x="350" y="205">
            {measures.ac.toFixed(2)}
          </text>
        </>
      )}
      <text className="drag" x={sx + 23} y={sy + 9}>
        Drag me
      </text>
    </svg>
  );
}
function MiniIso({ wrong = false }: { wrong?: boolean }) {
  return (
    <svg className="esa10071-mini" viewBox="0 0 190 125">
      <path d="M15 105L175 105L95 15Z" />
      <path
        className="arc"
        d={
          wrong
            ? "M175 105H145Q150 80 164 76"
            : "M15 105H45Q40 80 26 76M175 105H145Q150 80 164 76"
        }
      />
      <path className="tick" d="M48 65l12 10M130 75l12-10" />
      <text x="88" y="13">
        A
      </text>
      <text x="2" y="120">
        B
      </text>
      <text x="178" y="120">
        C
      </text>
    </svg>
  );
}
