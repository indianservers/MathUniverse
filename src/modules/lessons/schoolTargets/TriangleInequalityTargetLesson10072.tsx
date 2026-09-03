import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type DragEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleInequalityTargetLesson10072.css";

type Sides = { a: number; b: number; c: number };
const START: Sides = { a: 4, b: 5, c: 8 };
const colors = { a: "purple", b: "blue", c: "teal" };
function checks(s: Sides) {
  return [s.a + s.b > s.c, s.a + s.c > s.b, s.b + s.c > s.a];
}
function valid(s: Sides) {
  return s.a > 0 && s.b > 0 && s.c > 0 && checks(s).every(Boolean);
}
function trianglePoint(s: Sides) {
  if (!valid(s)) return null;
  const x = (s.a ** 2 + s.c ** 2 - s.b ** 2) / (2 * s.c),
    y = Math.sqrt(Math.max(0, s.a ** 2 - x ** 2));
  return { x, y };
}

export default function TriangleInequalityTargetLesson10072({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState<Sides>(START),
    [placed, setPlaced] = useState<string[]>([]),
    [view, setView] = useState<"triangle" | "line">("triangle"),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState<number[]>([
      5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]),
    [actions, setActions] = useState(0);
  const verdicts = checks(sides),
    isValid = valid(sides),
    point = trianglePoint(sides),
    perimeter = sides.a + sides.b + sides.c;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: keyof Sides, value: number) =>
    act(() => {
      setSides({ ...sides, [key]: Math.max(1, Math.min(20, value)) });
      setPlaced([]);
    });
  const preset = (next: Sides) =>
    act(() => {
      setSides(next);
      setPlaced([]);
    });
  const place = (key: string) =>
    act(() =>
      setPlaced((current) =>
        current.includes(key) ? current : [...current, key],
      ),
    );
  const reset = () =>
    act(() => {
      setSides(START);
      setPlaced([]);
      setView("triangle");
    });
  return (
    <section
      className="ti10072-page"
      data-testid="school-mockup-0746"
      data-object-model="dedicated-segment-drop-triangle-inequality-engine"
      data-sides={`${sides.a},${sides.b},${sides.c}`}
      data-checks={verdicts.map(Number).join(",")}
      data-valid={String(isValid)}
      data-perimeter={perimeter}
      data-placed={placed.join(",")}
      data-view={view}
      data-challenge={challenge.join(",")}
      data-actions={actions}
    >
      <header className="ti10072-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>Triangle Inequality</h1>
        <p>
          Three positive lengths form a triangle if and only if the sum of any
          two is greater than the third.
        </p>
        <div>
          <span>24 min</span>
          <span>INTERMEDIATE</span>
          <span>VISUAL EXPLORATION</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="ti10072-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
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
        <section className="ti10072-builder">
          <header>
            <div>
              <h2>1. BUILD A TRIANGLE</h2>
              <p>
                Drag the segment sliders or type values. Then drag the segments
                into the triangle to test.
              </p>
            </div>
            <nav>
              <button
                className={view === "triangle" ? "active" : ""}
                onClick={() => act(() => setView("triangle"))}
              >
                ▣ Triangle view
              </button>
              <button
                className={view === "line" ? "active" : ""}
                onClick={() => act(() => setView("line"))}
              >
                ▤ Number line view
              </button>
              <button onClick={() => act(() => setPlaced([]))}>
                ▱ Clear triangle
              </button>
            </nav>
          </header>
          <div className="ti10072-build-grid">
            <aside>
              <h3>Segment lengths</h3>
              {(["a", "b", "c"] as const).map((key) => (
                <label key={key}>
                  <b>Side {key}</b>
                  <span>
                    <input
                      aria-label={`Side ${key}`}
                      type="range"
                      min="1"
                      max="20"
                      value={sides[key]}
                      onChange={(e) => update(key, +e.target.value)}
                    />
                    <input
                      aria-label={`Side ${key} value`}
                      type="number"
                      min="1"
                      max="20"
                      value={sides[key]}
                      onChange={(e) => update(key, +e.target.value)}
                    />
                  </span>
                </label>
              ))}
              <h3>Presets</h3>
              <div className="presets">
                <button onClick={() => preset({ a: 4, b: 5, c: 8 })}>
                  Example: 4,5,8
                </button>
                <button onClick={() => preset({ a: 3, b: 4, c: 7 })}>
                  Degenerate: 3,4,7
                </button>
                <button onClick={() => preset({ a: 6, b: 6, c: 6 })}>
                  Equilateral: 6,6,6
                </button>
              </div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </aside>
            <section className="ti10072-stage">
              <div className="segments">
                {(["a", "b", "c"] as const).map((key) => (
                  <DraggableSegment
                    key={key}
                    id={key}
                    value={sides[key]}
                    color={colors[key]}
                    onPlace={place}
                  />
                ))}
              </div>
              <span className="arrow">→</span>
              <div
                className={`drop ${isValid ? "valid" : "invalid"}`}
                role="region"
                aria-label="Triangle construction drop zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  if (id) place(id);
                }}
              >
                {view === "triangle" ? (
                  <BuildTriangle sides={sides} point={point} placed={placed} />
                ) : (
                  <LineView sides={sides} />
                )}
                <p>
                  {placed.length === 3
                    ? isValid
                      ? "Triangle built from all three segments"
                      : "These segments cannot close"
                    : "Drag all three segments here to build the triangle"}
                </p>
              </div>
              <footer className={isValid ? "valid" : "invalid"}>
                {isValid ? <Check /> : <TriangleAlert />}
                <span>
                  <b>{isValid ? "Valid triangle!" : "Not a triangle"}</b>
                  <small>
                    {isValid
                      ? "All three inequalities are satisfied."
                      : "At least one strict inequality fails."}
                  </small>
                </span>
                <strong>Perimeter = {perimeter}</strong>
                <svg
                  className="mini-triangle"
                  viewBox="0 0 42 34"
                  aria-hidden="true"
                >
                  <path d="M3 31 22 3l17 28Z" />
                </svg>
              </footer>
            </section>
          </div>
        </section>
        <section className="ti10072-checks">
          <header>
            <h2>2. CHECK THE TRIANGLE INEQUALITY</h2>
            <p>All three inequalities must be true.</p>
          </header>
          {[
            ["a + b > c", sides.a + sides.b, sides.c, verdicts[0]],
            ["a + c > b", sides.a + sides.c, sides.b, verdicts[1]],
            ["b + c > a", sides.b + sides.c, sides.a, verdicts[2]],
          ].map(([label, sum, third, ok]) => (
            <article key={String(label)}>
              <h2>{label}</h2>
              <strong>
                {String(label).replace(/[abc]/g, (m) =>
                  String(sides[m as keyof Sides]),
                )}
              </strong>
              <div className={`inequality-line ${ok ? "true" : "false"}`}>
                <i
                  style={{
                    width: `${Math.min(100, (Number(sum) / 20) * 100)}%`,
                  }}
                />
                {ok ? <Check /> : <TriangleAlert />}
              </div>
              <p>
                {sum} &gt; {third}
              </p>
              <b className={ok ? "true" : "false"}>{ok ? "True" : "False"}</b>
            </article>
          ))}
          <footer>
            <Lightbulb /> If any one of these is false or equal, the segments
            cannot form a non-degenerate triangle.
          </footer>
        </section>
        <section className="ti10072-theory">
          <article>
            <h2>3. WHY IT WORKS</h2>
            <p>
              If one inequality fails, one side is too long to “reach” the other
              two. The figure collapses into a straight line or two overlapping
              sides.
            </p>
            <LineExample type="equal" />
            <b>Equality (degenerate): a + b = c</b>
            <LineExample type="less" />
            <b>Inequality fails: a + b &lt; c</b>
            <strong>
              ⓘ Three positive lengths form a triangle if each pair sum is
              greater than the third.
            </strong>
          </article>
          <article>
            <h2>4. WORKED EXAMPLE</h2>
            <h3>Valid triangle: 4, 5, 8</h3>
            <ExampleTriangle sides={START} />
            <p>
              ✓ 4 + 5 = 9 &gt; 8; ✓ 4 + 8 = 12 &gt; 5<br />✓ 5 + 8 = 13 &gt; 4
            </p>
            <b>All true → Triangle exists.</b>
            <hr />
            <h3>Degenerate (invalid): 3, 4, 7</h3>
            <LineView sides={{ a: 3, b: 4, c: 7 }} />
            <p>3 + 4 = 7 = 7 ×</p>
            <b>One equality → No triangle (flat).</b>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> COMMON MISTAKE
            </h2>
            <h3>Checking only the two shortest sides is not enough.</h3>
            <section>
              <b>× Mistake: 2 + 3 &gt; 4</b>
              <p>
                Example: 2, 3, 4<br />2 + 3 = 5 &gt; 4 (true)
                <br />
                But 2 + 4 = 6 &gt; 3 (true)
                <br />3 + 4 = 7 &gt; 2 (true)
                <br />
                Actually this set works.
              </p>
            </section>
            <section className="correct">
              <b>✓ Correct rule</b>
              <p>
                All three pair sums must be strictly greater than the third.
                <br />
                Use &gt;, not ≥.
              </p>
            </section>
          </article>
        </section>
        <section className="ti10072-challenge">
          <header>
            <h2>6. CHALLENGE</h2>
            <p>
              Let two sides be 5 and 9. What integer values can the third side
              take?
              <br />
              Find all integers x such that a triangle can be formed.
            </p>
          </header>
          <section>
            <div className="number-line">
              {Array.from({ length: 16 }, (_, x) => (
                <button
                  key={x}
                  className={
                    challenge.includes(x)
                      ? "active"
                      : x <= 4 || x >= 14
                        ? "invalid"
                        : ""
                  }
                  onClick={() =>
                    act(() =>
                      setChallenge((current) =>
                        current.includes(x)
                          ? current.filter((n) => n !== x)
                          : [...current, x].sort((a, b) => a - b),
                      ),
                    )
                  }
                >
                  {x}
                </button>
              ))}
            </div>
            <p>
              <span>x ≤ 4 (invalid)</span>
              <span>4 &lt; x &lt; 14 (valid)</span>
              <span>x ≥ 14 (invalid)</span>
            </p>
          </section>
          <aside>
            <h2>Solution</h2>
            <p>We need both: |9 − 5| &lt; x &lt; 9 + 5</p>
            <strong>4 &lt; x &lt; 14</strong>
            <p>Integers: {challenge.join(", ")}</p>
            <p>
              There are <b>{challenge.filter((x) => x > 4 && x < 14).length}</b>{" "}
              possible integer values.
            </p>
          </aside>
        </section>
      </main>
      <nav className="ti10072-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-equal-sides-and-equal-angles">
          <ArrowLeft /> Previous: Equal Sides and Equal Angles
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-exterior-angle-theorem">
          Next: Exterior Angle Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function DraggableSegment({
  id,
  value,
  color,
  onPlace,
}: {
  id: string;
  value: number;
  color: string;
  onPlace: (id: string) => void;
}) {
  const drag: DragEventHandler<HTMLButtonElement> = (e) =>
    e.dataTransfer.setData("text/plain", id);
  return (
    <button
      className={`ti10072-segment ${color}`}
      draggable
      onDragStart={drag}
      onClick={() => onPlace(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onPlace(id);
      }}
    >
      <b>
        {id} = {value}
      </b>
      <i style={{ width: `${45 + value * 7}px` }} />
    </button>
  );
}
function BuildTriangle({
  sides,
  point,
  placed,
}: {
  sides: Sides;
  point: { x: number; y: number } | null;
  placed: string[];
}) {
  if (!point || placed.length < 3)
    return (
      <svg viewBox="0 0 310 220" aria-label="Triangle segment drop zone">
        <path className="outline" d="M20 190L155 25L290 190Z" />
      </svg>
    );
  const scale = 28;
  return (
    <svg viewBox="0 0 310 220" aria-label="Constructed triangle from segments">
      <path
        className="shape"
        d={`M25 190L${25 + sides.c * scale} 190L${25 + point.x * scale} ${190 - point.y * scale}Z`}
      />
      <text x="135" y="210">
        c = {sides.c}
      </text>
      <text x="55" y="120">
        a = {sides.a}
      </text>
      <text x="225" y="120">
        b = {sides.b}
      </text>
    </svg>
  );
}
function LineView({ sides }: { sides: Sides }) {
  return (
    <svg
      className="ti10072-line"
      viewBox="0 0 300 80"
      aria-label="Triangle inequality number line"
    >
      <line x1="20" y1="42" x2="280" y2="42" />
      <circle cx="20" cy="42" r="5" />
      <circle cx={20 + sides.a * 12} cy="42" r="5" />
      <circle cx={20 + (sides.a + sides.b) * 12} cy="42" r="5" />
      <circle cx={20 + sides.c * 12} cy="42" r="5" />
      <text x="50" y="30">
        a
      </text>
      <text x="120" y="30">
        b
      </text>
      <text x="210" y="64">
        c
      </text>
    </svg>
  );
}
function LineExample({ type }: { type: string }) {
  return (
    <div className="ti10072-line-example">
      <i />
      <i />
      <i className={type} />
    </div>
  );
}
function ExampleTriangle({ sides }: { sides: Sides }) {
  return (
    <svg className="ti10072-example" viewBox="0 0 230 120">
      <path d="M10 105L220 105L100 15Z" />
      <text x="45" y="58">
        {sides.a}
      </text>
      <text x="165" y="58">
        {sides.b}
      </text>
      <text x="105" y="118">
        {sides.c}
      </text>
    </svg>
  );
}
