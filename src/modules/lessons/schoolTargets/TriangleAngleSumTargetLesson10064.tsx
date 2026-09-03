import { ArrowLeft, ArrowRight, Check, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleAngleSumTargetLesson10064.css";

type Point = { x: number; y: number };
const initial = {
  A: { x: 70, y: 320 },
  B: { x: 450, y: 320 },
  C: { x: 328, y: 35 },
};
const colors = ["purple", "blue", "green"];

function angleAt(p: Point, q: Point, r: Point) {
  const u = { x: p.x - q.x, y: p.y - q.y },
    v = { x: r.x - q.x, y: r.y - q.y };
  const dot = u.x * v.x + u.y * v.y,
    lengths = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  return Math.round(
    (Math.acos(Math.max(-1, Math.min(1, dot / lengths))) * 180) / Math.PI,
  );
}

export default function TriangleAngleSumTargetLesson10064({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(initial),
    [line, setLine] = useState([0, 1, 2]),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState(0),
    [actions, setActions] = useState(0);
  const angles = useMemo(
    () => [
      angleAt(points.B, points.A, points.C),
      angleAt(points.A, points.B, points.C),
      angleAt(points.A, points.C, points.B),
    ],
    [points],
  );
  const sum = angles.reduce((a, b) => a + b, 0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const move = (name: keyof typeof initial, point: Point) =>
    act(() =>
      setPoints((current) => ({
        ...current,
        [name]: {
          x: Math.max(35, Math.min(485, point.x)),
          y: Math.max(35, Math.min(340, point.y)),
        },
      })),
    );
  const addPiece = (index: number) =>
    act(() =>
      setLine((current) =>
        current.includes(index) ? current : [...current, index],
      ),
    );
  return (
    <section
      className="ta10064-page"
      data-testid="school-mockup-0738"
      data-object-model="dedicated-draggable-triangle-angle-sum-tear-rearrange-engine"
      data-points={Object.values(points)
        .map((p) => `${Math.round(p.x)},${Math.round(p.y)}`)
        .join(";")}
      data-angles={angles.join(",")}
      data-sum={sum}
      data-line={line.join(",")}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="ta10064-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Triangle Angle Sum Theorem</h1>
        <p>Discover and prove that a triangle's interior angles total 180°.</p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="ta10064-tabs">
        {["⌘ Interact", "▣ Learn", "◷ Example", "⌁ Formula", "⌕ Practice"].map(
          (x, i) => (
            <button
              key={x}
              className={tab === i ? "active" : ""}
              aria-selected={tab === i}
              onClick={() => act(() => setTab(i))}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="ta10064-explore">
          <header>
            <h2>1. EXPLORE & DISCOVER</h2>
            <p>
              Drag any vertex to change the triangle. Arrange the three angles
              on a straight line.
            </p>
          </header>
          <div>
            <article>
              <button onClick={() => act(() => setPoints(initial))}>
                <RotateCcw /> Reset triangle
              </button>
              <TriangleModel points={points} angles={angles} move={move} />
              <footer>
                💡 Drag vertices A, B, or C to explore acute, right, and obtuse
                triangles.
              </footer>
            </article>
            <aside>
              <section>
                <h3>ANGLE MEASURES (live)</h3>
                {angles.map((value, i) => (
                  <p key={i} className={colors[i]}>
                    <i /> ∠{String.fromCharCode(65 + i)} <span>=</span>
                    <b>{value}°</b>
                  </p>
                ))}
              </section>
              <section>
                <h3>SUM METER</h3>
                <strong>
                  {angles.join("° + ")}° = {sum}°
                </strong>
                <progress max="180" value={sum} />
                <b>
                  {sum === 180
                    ? "Perfect! The sum is 180°."
                    : "Keep adjusting the triangle."}
                </b>
              </section>
            </aside>
          </div>
        </section>
        <section className="ta10064-tear">
          <header>
            <h2>2. TEAR & REARRANGE</h2>
            <p>
              Drag each colored angle to the line below to form a straight line.
            </p>
            <button onClick={() => act(() => setLine([]))}>
              <Trash2 /> Clear line
            </button>
          </header>
          {line.length < 3 && (
            <div className="ta10064-palette">
              {angles.map((value, i) => (
                <button
                  key={i}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("piece", String(i))
                  }
                  onClick={() => addPiece(i)}
                  className={colors[i]}
                >
                  {value}°
                </button>
              ))}
            </div>
          )}
          <div
            className="ta10064-line"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => addPiece(+e.dataTransfer.getData("piece"))}
          >
            {line.map((i) => (
              <i key={i} className={colors[i]}>
                <b>{angles[i]}°</b>
              </i>
            ))}
            <span>
              {line.length === 3 ? `${sum}°` : `${line.length}/3 pieces`}
            </span>
          </div>
        </section>
        <section className="ta10064-theorem">
          <i>△</i>
          <div>
            <h2>THEOREM</h2>
            <p>For every Euclidean triangle ABC,</p>
            <strong>∠A + ∠B + ∠C = 180°.</strong>
          </div>
        </section>
        <section className="ta10064-explain">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>Draw a line through vertex C parallel to side AB.</p>
            <p>The alternate interior angles formed equal ∠A and ∠B.</p>
            <p>These three adjacent angles on a straight line sum to 180°.</p>
            <ProofTriangle />
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>If ∠A = 48° and ∠B = 67°, find ∠C.</p>
            <p>∠C = 180° − (48° + 67°)</p>
            <p>∠C = 180° − 115°</p>
            <p>
              <b>∠C = 65°</b>
            </p>
            <StaticTriangle angles={[48, 67, 65]} />
          </article>
        </section>
        <section className="ta10064-warning">
          <h2>💡 COMMON MISCONCEPTION</h2>
          <div>
            <p>
              <b>The sum of the angles is not always 180°.</b>
            </p>
            <p>
              <b>Reality:</b> The sum of the interior angles of any Euclidean
              triangle is always 180°, whether the triangle is acute, right,
              obtuse, scalene, or isosceles.
            </p>
          </div>
          {[
            [55, 53, 72],
            [42, 48, 90],
            [30, 40, 110],
          ].map((set, i) => (
            <figure key={i}>
              <StaticTriangle angles={set} />
              <b>{["Acute", "Right", "Obtuse"][i]}</b>
              <span>180°</span>
            </figure>
          ))}
        </section>
        <section className="ta10064-challenge">
          <header>
            <h2>◎ CHALLENGE YOURSELF</h2>
            <p>
              Drag vertex C through acute, right, and obtuse cases. Keep the sum
              verified.
            </p>
            <button
              onClick={() => act(() => setChallenge((challenge + 1) % 3))}
            >
              ⟳ Try it now
            </button>
          </header>
          <div>
            {[
              [55, 53, 72],
              [42, 48, 90],
              [30, 40, 110],
            ].map((set, i) => (
              <article key={i} className={challenge === i ? "active" : ""}>
                <h3>
                  {["Acute Triangle", "Right Triangle", "Obtuse Triangle"][i]}
                </h3>
                <StaticTriangle angles={set} />
                <b>
                  Sum = 180° <Check />
                </b>
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="ta10064-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-parallel-line-converse-theorems">
          <ArrowLeft /> Parallel Line Converse Theorems
        </Link>
        <Link to="/lessons/school">
          Exterior Angle Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function TriangleModel({
  points,
  angles,
  move,
}: {
  points: typeof initial;
  angles: number[];
  move: (name: keyof typeof initial, p: Point) => void;
}) {
  const drag = (
    name: keyof typeof initial,
    e: React.PointerEvent<SVGCircleElement>,
  ) => {
    if (e.buttons !== 1) return;
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    move(name, {
      x: ((e.clientX - box.left) / box.width) * 520,
      y: ((e.clientY - box.top) / box.height) * 370,
    });
  };
  return (
    <svg
      className="ta10064-triangle"
      viewBox="0 0 520 370"
      aria-label="Interactive triangle angle sum diagram"
    >
      <defs>
        <pattern
          id="ta-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V24" />
        </pattern>
      </defs>
      <rect width="520" height="370" fill="url(#ta-grid)" />
      <path
        className="shape"
        d={`M${points.A.x} ${points.A.y}L${points.B.x} ${points.B.y}L${points.C.x} ${points.C.y}Z`}
      />
      {(["A", "B", "C"] as const).map((name, i) => (
        <g key={name}>
          <circle
            className={`handle ${colors[i]}`}
            cx={points[name].x}
            cy={points[name].y}
            r="8"
            tabIndex={0}
            onPointerMove={(e) => drag(name, e)}
            onKeyDown={(e) => {
              const p = points[name];
              if (e.key === "ArrowRight") move(name, { x: p.x + 5, y: p.y });
              if (e.key === "ArrowLeft") move(name, { x: p.x - 5, y: p.y });
              if (e.key === "ArrowUp") move(name, { x: p.x, y: p.y - 5 });
              if (e.key === "ArrowDown") move(name, { x: p.x, y: p.y + 5 });
            }}
          />
          <text
            x={points[name].x + (name === "A" ? -18 : 8)}
            y={points[name].y + (name === "C" ? -10 : 24)}
          >
            {name}
          </text>
          <text
            className={colors[i]}
            x={points[name].x + (name === "A" ? 26 : name === "B" ? -48 : -12)}
            y={points[name].y + (name === "C" ? 55 : -18)}
          >
            {angles[i]}°
          </text>
        </g>
      ))}
    </svg>
  );
}
function StaticTriangle({ angles }: { angles: number[] }) {
  return (
    <svg className="ta10064-static" viewBox="0 0 180 115">
      <path d="M15 100L165 100L105 12Z" />
      <text x="27" y="94">
        {angles[0]}°
      </text>
      <text x="132" y="94">
        {angles[1]}°
      </text>
      <text x="93" y="36">
        {angles[2]}°
      </text>
    </svg>
  );
}
function ProofTriangle() {
  return (
    <svg className="ta10064-proof" viewBox="0 0 210 130">
      <line x1="25" y1="25" x2="190" y2="25" />
      <path d="M30 115L180 115L110 25Z" />
      <text x="22" y="127">
        A
      </text>
      <text x="182" y="127">
        B
      </text>
      <text x="105" y="17">
        C
      </text>
      <text x="193" y="20">
        l
      </text>
    </svg>
  );
}
