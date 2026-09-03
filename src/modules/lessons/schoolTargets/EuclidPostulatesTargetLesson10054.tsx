import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EuclidPostulatesTargetLesson10054.css";

const postulates = [
  "A straight line can be drawn from any one point to any other point.",
  "A terminated straight line can be produced indefinitely in a straight line.",
  "A circle can be drawn with any centre and any radius.",
  "All right angles are equal to one another.",
  "If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles, the lines meet on that side.",
];
const tools = [
  "Select",
  "Point",
  "Line",
  "Extend",
  "Circle",
  "Angle",
  "Measure",
];
const challengeActions = [
  "Draw a line from point P to point Q.",
  "Extend a line beyond point B.",
  "With centre O and radius r, draw a circle.",
  "Compare two right angles.",
  "A transversal makes same-side interior angles 110° and 60°.",
];

export default function EuclidPostulatesTargetLesson10054({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [selected, setSelected] = useState(1);
  const [tool, setTool] = useState("Select");
  const [a, setA] = useState({ x: 95, y: 180 });
  const [b, setB] = useState({ x: 315, y: 180 });
  const [tab, setTab] = useState("Interact");
  const [answers, setAnswers] = useState([0, 0, 0, 0, 0]);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const score = answers.filter((answer, index) => answer === index + 1).length;
  const reset = () =>
    act(() => {
      setSelected(1);
      setTool("Select");
      setA({ x: 95, y: 180 });
      setB({ x: 315, y: 180 });
      setChecked(false);
    });
  const nudge = (which: "a" | "b", dx: number, dy: number) =>
    act(() => {
      const movePoint = (point: { x: number; y: number }) => ({
        x: Math.max(25, Math.min(405, point.x + dx)),
        y: Math.max(35, Math.min(300, point.y + dy)),
      });
      if (which === "a") setA(movePoint);
      else setB(movePoint);
    });
  const drag = (
    which: "a" | "b",
    event: React.PointerEvent<SVGCircleElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const point = {
        x: Math.max(
          25,
          Math.min(405, ((e.clientX - rect.left) / rect.width) * 430),
        ),
        y: Math.max(
          35,
          Math.min(300, ((e.clientY - rect.top) / rect.height) * 330),
        ),
      };
      if (which === "a") setA(point);
      else setB(point);
      setActions((n) => n + 1);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <section
      className="ep10054-page"
      data-testid="school-mockup-0728"
      data-object-model="dedicated-five-postulate-construction-and-matching-engine"
      data-postulate={selected}
      data-tool={tool}
      data-a={`${Math.round(a.x)},${Math.round(a.y)}`}
      data-b={`${Math.round(b.x)},${Math.round(b.y)}`}
      data-score={checked ? score : "idle"}
      data-actions={actions}
    >
      <header className="ep10054-hero">
        <div>
          <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
          <h1>Euclid's Five Postulates</h1>
          <p>
            Foundational assumptions of Euclidean geometry. Use the explorer to
            visualize and understand each postulate.
          </p>
          <section>
            <span>30 min</span>
            <span>Interact</span>
            <span>Level: Foundation</span>
            <span>Grade: 9</span>
            <span>Euclidean Geometry</span>
          </section>
        </div>
        <img
          src="/assets/lessons/euclid-five-postulates-hero.png"
          alt="Parchment with Euclidean constructions and a compass"
        />
      </header>
      <nav className="ep10054-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="ep10054-explorer">
          <header>
            <div>
              <h2>Explore the Five Postulates</h2>
              <p>
                Select a postulate, then use the tools to see it in action.
                Feedback updates in real time.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button
              onClick={() =>
                document
                  .querySelector<HTMLElement>(".ep10054-canvas")
                  ?.requestFullscreen?.()
              }
              aria-label="Fullscreen construction"
            >
              <Expand />
            </button>
          </header>
          <div className="ep10054-work">
            <aside>
              {postulates.map((text, index) => (
                <button
                  key={text}
                  className={selected === index + 1 ? "active" : ""}
                  onClick={() => act(() => setSelected(index + 1))}
                >
                  <i>{index + 1}</i>
                  <span>
                    <b>
                      Postulate {index + 1}
                      {index === 4 ? " (Parallel)" : ""}
                    </b>
                    {text}
                  </span>
                  <MiniPostulate n={index + 1} />
                </button>
              ))}
            </aside>
            <article className="ep10054-canvas">
              <nav>
                {tools.map((name) => (
                  <button
                    key={name}
                    className={tool === name ? "active" : ""}
                    onClick={() => act(() => setTool(name))}
                  >
                    <i>
                      {name === "Point"
                        ? "●"
                        : name === "Circle"
                          ? "○"
                          : name === "Angle"
                            ? "△"
                            : name === "Measure"
                              ? "⌁"
                              : "╱"}
                    </i>
                    {name}
                  </button>
                ))}
              </nav>
              <Construction
                n={selected}
                a={a}
                b={b}
                svgRef={svgRef}
                drag={drag}
                nudge={nudge}
              />
              <footer>
                <Check />{" "}
                {selected === 1
                  ? "Well done! A straight line has been drawn from A to B."
                  : `Postulate ${selected} construction is active.`}
              </footer>
              <section>
                <b>
                  Postulate {selected}: {postulates[selected - 1]}
                </b>
                <p>
                  <Feedback selected={selected} />
                </p>
                <p>
                  <strong>Tip:</strong> Drag the points or choose a tool to
                  explore the construction.
                </p>
              </section>
            </article>
          </div>
        </section>
        <section className="ep10054-theory">
          <article>
            <h2>
              <Lightbulb /> Why it works
            </h2>
            <p>
              These postulates are basic assumptions about points, lines, and
              planes. They are not proved, but accepted as true because geometry
              depends on them.
            </p>
            <p>✓ They form the foundation.</p>
            <p>✓ All theorems are built on them.</p>
            <p>✓ Postulate 5 is the most subtle.</p>
          </article>
          <article>
            <h2>Worked Example (Postulate 3)</h2>
            <p>A circle can be drawn with any centre and radius.</p>
            <div className="ep10054-circle-example">
              <svg viewBox="0 0 160 130">
                <circle cx="68" cy="67" r="51" />
                <line x1="68" y1="67" x2="112" y2="42" />
                <circle cx="68" cy="67" r="3" />
                <circle cx="112" cy="42" r="3" />
                <text x="62" y="80">
                  O
                </text>
                <text x="115" y="40">
                  P
                </text>
                <text x="84" y="53">
                  5 cm
                </text>
              </svg>
              <p>
                <b>Construction:</b>
                <br />
                1. Mark point O as centre.
                <br />
                2. Set radius OP = 5 cm.
                <br />
                3. With O as centre and radius 5 cm, draw a circle.
              </p>
            </div>
            <footer>
              Result: Circle with centre O and radius 5 cm is drawn.
            </footer>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> Common Misconception
            </h2>
            <p>
              Postulate 5 does not say “parallel lines never meet.” It is a
              conditional statement.
            </p>
            <svg viewBox="0 0 190 105">
              <line x1="15" y1="28" x2="180" y2="28" />
              <line x1="15" y1="82" x2="180" y2="82" />
              <line x1="100" y1="5" x2="72" y2="102" />
              <path d="M91 28 A18 18 0 0 1 108 42" />
              <path d="M78 69 A18 18 0 0 0 94 82" />
              <text x="110" y="43">
                60°
              </text>
              <text x="98" y="72">
                70°
              </text>
            </svg>
            <p>
              Since 60° + 70° = 130° &lt; 180°, the lines will meet on this side
              when produced indefinitely.
            </p>
          </article>
        </section>
        <section className="ep10054-challenge">
          <div>
            <h2>Challenge</h2>
            <p>Match each geometric action to the correct postulate.</p>
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Match to Postulate</th>
                </tr>
              </thead>
              <tbody>
                {challengeActions.map((text, index) => (
                  <tr key={text}>
                    <td>
                      {String.fromCharCode(97 + index)}) {text}
                    </td>
                    <td>
                      <select
                        aria-label={`Postulate match ${index + 1}`}
                        value={answers[index]}
                        onChange={(e) =>
                          act(() => {
                            setChecked(false);
                            setAnswers((current) =>
                              current.map((v, i) =>
                                i === index ? Number(e.target.value) : v,
                              ),
                            );
                          })
                        }
                      >
                        <option value="0">Select postulate</option>
                        {postulates.map((_, i) => (
                          <option value={i + 1} key={i}>
                            Postulate {i + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside>
            <h2>⏱ Answer Check</h2>
            <p>
              {checked
                ? `${score} of 5 matches are correct.`
                : "Make all matches and click Check."}
            </p>
            <button
              disabled={answers.some((answer) => !answer)}
              onClick={() => act(() => setChecked(true))}
            >
              Check Answers
            </button>
          </aside>
        </section>
      </main>
      <nav className="ep10054-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-definitions-axioms-and-postulates">
          <ArrowLeft />
          <span>
            Previous Lesson<b>Definitions Axioms and Postulates</b>
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            Next Lesson<b>Equivalent Forms of the Fifth Postulate</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Feedback({ selected }: { selected: number }) {
  return [
    "You chose two distinct points A and B. A unique straight line AB has been drawn.",
    "The segment continues beyond its endpoint along the same straight path.",
    "The distance OP fixes the radius of the circle centered at O.",
    "Both marked angles measure exactly 90°, so they are equal.",
    "The same-side interior-angle sum determines whether the lines meet.",
  ][selected - 1];
}
function MiniPostulate({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 55 26" aria-hidden="true">
      {n === 3 ? (
        <>
          <circle cx="28" cy="13" r="11" />
          <circle cx="28" cy="13" r="2" />
        </>
      ) : n === 4 ? (
        <>
          <line x1="14" y1="3" x2="14" y2="22" />
          <line x1="14" y1="22" x2="37" y2="22" />
          <rect x="14" y="16" width="6" height="6" />
        </>
      ) : n === 5 ? (
        <>
          <line x1="6" y1="7" x2="50" y2="7" />
          <line x1="6" y1="20" x2="50" y2="20" />
          <line x1="34" y1="1" x2="20" y2="25" />
        </>
      ) : (
        <>
          <line x1="7" y1="13" x2="49" y2="13" />
          <circle cx="12" cy="13" r="2" />
          <circle cx="43" cy="13" r="2" />
        </>
      )}
    </svg>
  );
}
function Construction({
  n,
  a,
  b,
  svgRef,
  drag,
  nudge,
}: {
  n: number;
  a: { x: number; y: number };
  b: { x: number; y: number };
  svgRef: React.RefObject<SVGSVGElement | null>;
  drag: (which: "a" | "b", event: React.PointerEvent<SVGCircleElement>) => void;
  nudge: (which: "a" | "b", dx: number, dy: number) => void;
}) {
  const keyMove = (which: "a" | "b", key: string) => {
    if (key === "ArrowLeft") nudge(which, -8, 0);
    if (key === "ArrowRight") nudge(which, 8, 0);
    if (key === "ArrowUp") nudge(which, 0, -8);
    if (key === "ArrowDown") nudge(which, 0, 8);
  };
  return (
    <svg
      ref={svgRef}
      className="ep10054-drawing"
      viewBox="0 0 430 330"
      aria-label="Interactive Euclidean construction"
    >
      <defs>
        <pattern
          id="epgrid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V24" />
        </pattern>
      </defs>
      <rect width="430" height="330" fill="url(#epgrid)" />
      {n === 1 && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />}{" "}
      {n === 2 && <line x1="15" y1={a.y} x2="415" y2={a.y} />}{" "}
      {n === 3 && (
        <circle cx={a.x} cy={a.y} r={Math.hypot(b.x - a.x, b.y - a.y)} />
      )}{" "}
      {n === 4 && (
        <>
          <line x1={a.x} y1={a.y} x2={b.x} y2={a.y} />
          <line x1={a.x} y1={a.y} x2={a.x} y2={b.y} />
          <rect x={a.x} y={a.y - 16} width="16" height="16" />
        </>
      )}{" "}
      {n === 5 && (
        <>
          <line x1="30" y1="105" x2="400" y2="105" />
          <line x1="30" y1="235" x2="400" y2="235" />
          <line x1={a.x} y1="40" x2={b.x} y2="295" />
        </>
      )}
      <circle
        className="handle a"
        cx={a.x}
        cy={a.y}
        r="7"
        tabIndex={0}
        onPointerDown={(e) => drag("a", e)}
        onKeyDown={(e) => keyMove("a", e.key)}
      />
      <circle
        className="handle b"
        cx={b.x}
        cy={b.y}
        r="7"
        tabIndex={0}
        onPointerDown={(e) => drag("b", e)}
        onKeyDown={(e) => keyMove("b", e.key)}
      />
      <text x={a.x - 18} y={a.y + 5}>
        A
      </text>
      <text x={b.x + 10} y={b.y + 5}>
        B
      </text>
    </svg>
  );
}
