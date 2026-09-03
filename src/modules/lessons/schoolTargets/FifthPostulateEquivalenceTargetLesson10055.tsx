import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FifthPostulateEquivalenceTargetLesson10055.css";

const scenarios = [
  "Playfair's Axiom",
  "Interior-Angle Condition",
  "Triangle Angle Sum",
] as const;
type Scenario = (typeof scenarios)[number];
export default function FifthPostulateEquivalenceTargetLesson10055({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [scenario, setScenario] = useState<Scenario>(scenarios[0]);
  const [showAngles, setShowAngles] = useState(true),
    [showTransversal, setShowTransversal] = useState(true),
    [measure, setMeasure] = useState(true);
  const [point, setPoint] = useState({ x: 220, y: 92 }),
    [angle, setAngle] = useState(-10),
    [tab, setTab] = useState("Interact"),
    [animating, setAnimating] = useState(false),
    [answers, setAnswers] = useState(["", "", ""]),
    [checked, setChecked] = useState(false),
    [reasoning, setReasoning] = useState(false),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  useEffect(() => {
    if (!animating) return;
    const id = window.setInterval(
      () => setAngle((v) => (v >= 12 ? -12 : v + 1)),
      120,
    );
    return () => window.clearInterval(id);
  }, [animating]);
  const reset = () =>
    act(() => {
      setScenario(scenarios[0]);
      setPoint({ x: 220, y: 92 });
      setAngle(-10);
      setShowAngles(true);
      setShowTransversal(true);
      setMeasure(true);
      setAnimating(false);
    });
  const drag = (e: React.PointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      setPoint({
        x: Math.max(90, Math.min(350, ((ev.clientX - r.left) / r.width) * 430)),
        y: Math.max(55, Math.min(165, ((ev.clientY - r.top) / r.height) * 255)),
      });
      setActions((n) => n + 1);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const nudge = (dx: number, dy: number) =>
    act(() =>
      setPoint((p) => ({
        x: Math.max(90, Math.min(350, p.x + dx)),
        y: Math.max(55, Math.min(165, p.y + dy)),
      })),
    );
  const score = answers.filter((v) => v === "No").length;
  return (
    <section
      className="fe10055-page"
      data-testid="school-mockup-0729"
      data-object-model="dedicated-linked-parallel-equivalence-and-assumption-testing-engine"
      data-scenario={scenario}
      data-point={`${Math.round(point.x)},${Math.round(point.y)}`}
      data-angle={angle}
      data-show-angles={String(showAngles)}
      data-transversal={String(showTransversal)}
      data-measure={String(measure)}
      data-score={checked ? score : "idle"}
      data-actions={actions}
    >
      <header className="fe10055-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Equivalent Forms of the Fifth Postulate</h1>
        <p>
          Euclid's Fifth Postulate has many equivalent forms. Explore linked
          parallel-line scenarios to see how Playfair's axiom, interior-angle
          conditions, and the triangle angle sum all imply the same rule.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d⌄</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="fe10055-tabs">
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
        <section className="fe10055-explorer">
          <aside>
            <section>
              <h2>SCENARIO SELECTOR</h2>
              {scenarios.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="scenario"
                    checked={scenario === item}
                    onChange={() => act(() => setScenario(item))}
                  />
                  {item}
                </label>
              ))}
            </section>
            <section>
              <h2>INTERACTIVE CONTROLS</h2>
              <Toggle
                label="Show angles"
                value={showAngles}
                onChange={() => act(() => setShowAngles((v) => !v))}
              />
              <Toggle
                label="Show transversal"
                value={showTransversal}
                onChange={() => act(() => setShowTransversal((v) => !v))}
              />
              <Toggle
                label="Measure angles"
                value={measure}
                onChange={() => act(() => setMeasure((v) => !v))}
              />
            </section>
            <section>
              <h2>DRAG TO EXPLORE</h2>
              <p>Drag point P or rotate line ℓ.</p>
              <label className="fe10055-angle">
                Line rotation
                <input
                  type="range"
                  min="-25"
                  max="25"
                  value={angle}
                  onChange={(e) => act(() => setAngle(Number(e.target.value)))}
                />
              </label>
              <button onClick={reset}>
                <RotateCcw /> Reset diagram
              </button>
            </section>
          </aside>
          <article className="fe10055-main">
            <h2>{scenario.toUpperCase()}</h2>
            <p>
              {scenario === scenarios[0]
                ? "Through a point P not on line ℓ, there is exactly one line through P parallel to ℓ."
                : scenario === scenarios[1]
                  ? "Same-side interior angles determine whether two lines meet."
                  : "Every Euclidean triangle has an interior-angle sum of 180°."}
            </p>
            <EquivalenceDiagram
              scenario={scenario}
              point={point}
              angle={angle}
              showAngles={showAngles}
              transversal={showTransversal}
              measure={measure}
              svgRef={svgRef}
              drag={drag}
              nudge={nudge}
            />
            <button onClick={() => act(() => setAnimating((v) => !v))}>
              <Play /> {animating ? "Pause" : "Animate"}
            </button>
            <div className="fe10055-summary">
              <section>
                <h3>
                  <Check /> Conclusion
                </h3>
                <p>
                  Exactly one line through P is parallel to ℓ. The other line
                  intersects ℓ.
                </p>
              </section>
              <section>
                <h3>LINKED EQUIVALENCES</h3>
                <p>All three scenarios are equivalent.</p>
                <b>
                  <i>1</i> ⟷ <i>2</i> ⟷ <i>3</i>
                </b>
              </section>
            </div>
          </article>
          <section className="fe10055-pair">
            <article>
              <h2>
                <i>2</i> INTERIOR-ANGLE CONDITION
              </h2>
              <p>
                If a transversal cuts two lines and same-side interior angles
                sum to less than 180°, the lines meet on that side.
              </p>
              <AngleDiagram angle={angle} />
              <strong>
                α = {75 + Math.round(angle / 5)}° &nbsp; β = 65° &nbsp; α+β ={" "}
                {140 + Math.round(angle / 5)}° &lt; 180°
              </strong>
              <footer>
                <X /> Result: The lines meet on the left side.
              </footer>
            </article>
            <article>
              <h2>
                <i>3</i> TRIANGLE ANGLE SUM
              </h2>
              <p>The interior angles of any triangle sum to 180°.</p>
              <TriangleDiagram />
              <strong>60° + 50° + 70° = 180°</strong>
              <footer>
                <Check /> Result: Triangle angle sum = 180°.
              </footer>
            </article>
          </section>
        </section>
        <section className="fe10055-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              In Euclidean geometry, each of these statements implies the
              others.
            </p>
            <p>
              <i>1</i> Playfair's axiom gives uniqueness of the parallel.
            </p>
            <p>
              <i>2</i> If same-side interior angles sum to less than 180°, the
              lines meet; if equal to 180°, they are parallel.
            </p>
            <p>
              <i>3</i> The triangle angle sum of 180° forces this behavior.
            </p>
            <p>
              Therefore, all three are equivalent to Euclid's Fifth Postulate.
            </p>
          </article>
          <article>
            <h2>▣ WORKED EXAMPLE</h2>
            <p>
              If same-side interior angles sum to less than 180°, the lines meet
              on that side.
            </p>
            <AngleDiagram angle={10} />
            <strong>110° + 40° = 150° &lt; 180°</strong>
            <p>Therefore, lines ℓ and m meet on the left side.</p>
            <button onClick={() => act(() => setReasoning((v) => !v))}>
              Step-by-step reasoning⌄
            </button>
            {reasoning && (
              <small>
                The angle deficit forces the transversal-side extensions to
                converge.
              </small>
            )}
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <p>
              “At least one parallel” is weaker than “exactly one parallel.”
            </p>
            <svg viewBox="0 0 210 110">
              <line x1="15" y1="90" x2="195" y2="90" />
              <circle cx="105" cy="28" r="5" />
              <line x1="105" y1="28" x2="25" y2="90" />
              <line x1="105" y1="28" x2="185" y2="90" />
              <text x="102" y="18">
                P
              </text>
              <text x="196" y="94">
                ℓ
              </text>
            </svg>
            <p>
              This could allow 0, 1, or infinitely many parallels. Euclid's
              postulate requires exactly one.
            </p>
          </article>
        </section>
        <section className="fe10055-challenge">
          <h2>✚ CHALLENGES</h2>
          <p>
            Turn off one assumption and identify which conclusions no longer
            follow.
          </p>
          <div>
            {[
              "Triangle angle sum = 180°",
              "Playfair's axiom",
              "Interior-angle condition",
            ].map((text, index) => (
              <fieldset key={text}>
                <legend>
                  <i>{index + 1}</i> Turn off: {text}
                </legend>
                <p>
                  {index === 0
                    ? "Do Playfair's axiom and the interior-angle condition still follow?"
                    : index === 1
                      ? "Do the interior-angle condition and triangle angle sum still follow?"
                      : "Do Playfair's axiom and triangle angle sum still follow?"}
                </p>
                {["Yes", "No"].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={`dependency-${index}`}
                      checked={answers[index] === value}
                      onChange={() =>
                        act(() => {
                          setChecked(false);
                          setAnswers((current) =>
                            current.map((v, i) => (i === index ? value : v)),
                          );
                        })
                      }
                    />
                    {value}
                  </label>
                ))}
              </fieldset>
            ))}
            <button
              disabled={answers.some((v) => !v)}
              onClick={() => act(() => setChecked(true))}
            >
              Check answers
            </button>
          </div>
          {checked && (
            <strong>
              {score === 3
                ? "Correct: removing any equivalent assumption breaks the deductions."
                : `${score}/3 correct. Equivalent statements must imply one another.`}
            </strong>
          )}
        </section>
      </main>
      <nav className="fe10055-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-euclid-s-five-postulates">
          <ArrowLeft /> Euclid's Five Postulates
        </Link>
        <Link to="/lessons/school">
          Axiom versus Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <label>
      {label}
      <input type="checkbox" checked={value} onChange={onChange} />
      <i />
    </label>
  );
}
function EquivalenceDiagram({
  scenario,
  point,
  angle,
  showAngles,
  transversal,
  measure,
  svgRef,
  drag,
  nudge,
}: {
  scenario: Scenario;
  point: { x: number; y: number };
  angle: number;
  showAngles: boolean;
  transversal: boolean;
  measure: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  drag: (e: React.PointerEvent<SVGCircleElement>) => void;
  nudge: (dx: number, dy: number) => void;
}) {
  const rad = (angle * Math.PI) / 180,
    dx = Math.cos(rad) * 190,
    dy = Math.sin(rad) * 190;
  return (
    <svg
      ref={svgRef}
      className="fe10055-diagram"
      viewBox="0 0 430 255"
      aria-label="Interactive fifth-postulate equivalence diagram"
    >
      <line x1="25" y1="215" x2="405" y2="215" />
      {scenario === scenarios[2] ? (
        <TriangleDiagram inner />
      ) : (
        <>
          <line
            className="parallel"
            x1={point.x - dx}
            y1={point.y - dy}
            x2={point.x + dx}
            y2={point.y + dy}
          />
          <line x1={point.x} y1={point.y} x2="390" y2="188" />
          {transversal && (
            <line
              className="dash"
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2="215"
            />
          )}
          {showAngles && <path d={`M${point.x},198 h16 v17`} />}
          <circle
            cx={point.x}
            cy={point.y}
            r="6"
            tabIndex={0}
            onPointerDown={drag}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") nudge(-8, 0);
              if (e.key === "ArrowRight") nudge(8, 0);
              if (e.key === "ArrowUp") nudge(0, -8);
              if (e.key === "ArrowDown") nudge(0, 8);
            }}
          />
          <text x={point.x - 8} y={point.y - 12}>
            P
          </text>
          <text x="390" y="205">
            n
          </text>
          <text x="396" y="211">
            ℓ
          </text>
          {measure && (
            <text x={point.x + 12} y={point.y - 10}>
              {Math.abs(angle)}°
            </text>
          )}
        </>
      )}
    </svg>
  );
}
function AngleDiagram({ angle }: { angle: number }) {
  return (
    <svg className="fe10055-angle-diagram" viewBox="0 0 260 150">
      <line x1="15" y1="42" x2="245" y2="42" />
      <line x1="15" y1="122" x2="245" y2="122" />
      <line x1="145" y1="8" x2="98" y2="145" />
      <path d="M130 42a22 22 0 0120 19" />
      <path d="M105 101a22 22 0 0118 21" />
      <text x="151" y="65">
        α
      </text>
      <text x="124" y="105">
        β
      </text>
      <text x="225" y="35">
        ℓ
      </text>
      <text x="225" y="115">
        m
      </text>
      <text x="150" y="15">
        {angle > 0 ? "t" : "t"}
      </text>
    </svg>
  );
}
function TriangleDiagram({ inner = false }: { inner?: boolean }) {
  return (
    <svg
      className={inner ? "fe10055-inner-triangle" : "fe10055-triangle"}
      viewBox="0 0 230 150"
    >
      <path d="M25 128L112 18l93 110Z" />
      <path className="purple" d="M98 36Q112 52 126 36" />
      <path className="blue" d="M25 128Q40 106 55 128" />
      <path className="cyan" d="M176 128Q190 105 205 128" />
      <text x="102" y="68">
        60°
      </text>
      <text x="42" y="119">
        50°
      </text>
      <text x="168" y="119">
        70°
      </text>
    </svg>
  );
}
