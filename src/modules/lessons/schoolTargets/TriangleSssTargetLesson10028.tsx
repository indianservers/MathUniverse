import { Check, Play, RotateCcw } from "lucide-react";
import { forwardRef, type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleSssTargetLesson10028.css";

type Sides = { ab: number; ac: number; bc: number };
const mainInitial: Sides = { ab: 7, ac: 5, bc: 6 };
const challengeInitial: Sides = { ab: 6, ac: 4, bc: 5 };
const validTriangle = ({ ab, ac, bc }: Sides) =>
  ac + bc > ab && ab + bc > ac && ab + ac > bc;

export default function TriangleSssTargetLesson10028({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState(mainInitial);
  const [stage, setStage] = useState(4);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [upper, setUpper] = useState(true);
  const [challenge, setChallenge] = useState(challengeInitial);
  const [challengeUpper, setChallengeUpper] = useState(true);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "invalid"
  >("idle");
  const [actions, setActions] = useState(0);
  const mainSvg = useRef<SVGSVGElement>(null);
  const valid = validTriangle(sides);
  const challengeValid = validTriangle(challenge);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setSides(mainInitial);
      setStage(4);
      setZoom(1);
      setUpper(true);
      setTab("Interact");
    });
  const setSide = (
    key: keyof Sides,
    value: number,
    target: "main" | "challenge",
  ) => {
    const normalized = Math.max(3, Math.min(15, Number(value)));
    if (target === "main")
      act(() => setSides((current) => ({ ...current, [key]: normalized })));
    else {
      setChallenge((current) => ({ ...current, [key]: normalized }));
      setChallengeResult("idle");
      setActions((n) => n + 1);
    }
  };
  const dragC = (event: PointerEvent<SVGCircleElement>) => {
    if (
      !mainSvg.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const rect = mainSvg.current.getBoundingClientRect();
    const y = ((event.clientY - rect.top) / rect.height) * 390;
    act(() => setUpper(y < 285));
  };
  return (
    <section
      className="sss10028-page"
      data-testid="school-mockup-0702"
      data-object-model="dedicated-three-side-circle-intersection-sss-triangle-construction"
      data-ab={sides.ab}
      data-ac={sides.ac}
      data-bc={sides.bc}
      data-valid={valid}
      data-stage={stage}
      data-upper={upper}
      data-zoom={zoom.toFixed(1)}
      data-tab={tab}
      data-challenge-valid={challengeValid}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="sss10028-hero">
        <small>CLASS 8 · PRACTICAL GEOMETRY</small>
        <h1>Triangle Construction by SSS ☆</h1>
        <p>
          <b>Learning objective:</b> Construct a unique triangle when all three
          side lengths are known.
        </p>
        <div>
          <span>♙ Class 8</span>
          <span>▦ Practical Geometry</span>
          <span>▦ Construction</span>
          <span>◉ 24 min</span>
        </div>
        <Link to="/lessons/school">← &nbsp; School lessons</Link>
      </header>
      <nav className="sss10028-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            className={tab === item ? "active" : ""}
            aria-pressed={tab === item}
            onClick={() => act(() => setTab(item))}
            key={item}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="sss10028-build">
        <header>
          <h2>Build your triangle (SSS Construction)</h2>
          <p>
            1) Set the three side lengths. 2) Use the points A and B to set the
            base.
            <br />
            3) Intersect the two arcs to place point C.
          </p>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => act(() => setStage(stage === 5 ? 1 : stage + 1))}
            >
              <Play />
              Replay steps
            </button>
          </div>
        </header>
        <aside className="sss10028-sliders">
          <h3>SIDE LENGTHS</h3>
          <SideSlider
            label="AB (base)"
            value={sides.ab}
            onChange={(v) => setSide("ab", v, "main")}
          />
          <SideSlider
            label="AC"
            value={sides.ac}
            onChange={(v) => setSide("ac", v, "main")}
          />
          <SideSlider
            label="BC"
            value={sides.bc}
            onChange={(v) => setSide("bc", v, "main")}
          />
          <aside className={valid ? "valid" : "invalid"}>
            <b>{valid ? "✓ Triangle is valid" : "✕ Triangle is not valid"}</b>
            <p>
              {sides.ac} + {sides.bc} &gt; {sides.ab}, {sides.ab} + {sides.bc}{" "}
              &gt; {sides.ac}, {sides.ab} + {sides.ac} &gt; {sides.bc}
            </p>
          </aside>
        </aside>
        <article className="sss10028-work">
          <ol>
            {[
              "Draw AB = 7 cm",
              "Arc from A, r = 5 cm",
              "Arc from B, r = 6 cm",
              "Intersection = C",
              "Join A-C and B-C",
            ].map((label, index) => {
              const n = index + 1;
              return (
                <li
                  className={n < stage ? "done" : n === stage ? "active" : ""}
                  onClick={() => act(() => setStage(n))}
                  key={label}
                >
                  <i>{n}</i>
                  {label}
                  {n < stage && <Check />}
                </li>
              );
            })}
          </ol>
          <TriangleDiagram
            ref={mainSvg}
            sides={sides}
            upper={upper}
            stage={stage}
            zoom={zoom}
            draggable
            onDrag={dragC}
            onToggle={() => act(() => setUpper(!upper))}
          />
          {valid && stage >= 4 && (
            <b className="constructed">✓ Triangle constructed</b>
          )}
          <footer>
            <span>♧ Drag point C along the intersection to explore.</span>
            <div>
              <button
                aria-label="Zoom out"
                onClick={() => act(() => setZoom(Math.max(0.7, zoom - 0.1)))}
              >
                −
              </button>
              <b>{Math.round(zoom * 100)}%</b>
              <button
                aria-label="Zoom in"
                onClick={() => act(() => setZoom(Math.min(1.3, zoom + 0.1)))}
              >
                ＋
              </button>
            </div>
          </footer>
        </article>
        <aside className="sss10028-rule">
          ⓘ <b>Rule:</b> A triangle exists only when the sum of any two sides is
          greater than the third.
        </aside>
      </section>
      <section className="sss10028-theory">
        <article>
          <h2>Why it works</h2>
          <p>
            Point C is at a distance AC from A and BC from B. The only location
            that satisfies both distances is at the intersection of the two
            arcs, so the triangle is unique.
          </p>
          <MiniTriangle />
          <span>5 cm</span>
          <span>6 cm</span>
          <b>7 cm</b>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Construct sides 5 cm, 6 cm, and 7 cm.</p>
          <ol>
            <li>Set AB = 7 cm.</li>
            <li>Draw an arc from A with radius 5 cm.</li>
            <li>Draw an arc from B with radius 6 cm.</li>
            <li>Mark their intersection as C.</li>
            <li>Join AC and BC.</li>
          </ol>
          <aside>
            <b>✓ Result:</b> △ABC with AB = 7 cm, AC = 5 cm, BC = 6 cm
            <p>Unique triangle constructed.</p>
          </aside>
        </article>
        <article>
          <h2>⚠ Common misconception</h2>
          <p>
            Picking the arc intersection without preserving both radii changes
            the specified sides.
          </p>
          <b>Correct: C is on both arcs.</b>
          <MiniCorrect />
          <b>Incorrect: C not on both arcs.</b>
          <MiniWrong />
        </article>
      </section>
      <section className="sss10028-challenge">
        <article>
          <h2>♢ Try it yourself</h2>
          <p>Challenge: Construct a △ABC with sides 4 cm, 5 cm, and 6 cm.</p>
          <div>
            <aside>
              <h3>SIDE LENGTHS</h3>
              <SideSlider
                label="AB (base)"
                value={challenge.ab}
                onChange={(v) => setSide("ab", v, "challenge")}
              />
              <SideSlider
                label="AC"
                value={challenge.ac}
                onChange={(v) => setSide("ac", v, "challenge")}
              />
              <SideSlider
                label="BC"
                value={challenge.bc}
                onChange={(v) => setSide("bc", v, "challenge")}
              />
              <button
                onClick={() => {
                  setChallengeResult(challengeValid ? "correct" : "invalid");
                  setActions((n) => n + 1);
                }}
              >
                Check construction
              </button>
            </aside>
            <div>
              <TriangleDiagram
                sides={challenge}
                upper={challengeUpper}
                stage={5}
                zoom={1}
                draggable
                onDrag={() => setChallengeUpper(!challengeUpper)}
                onToggle={() => setChallengeUpper(!challengeUpper)}
              />
              <span>♧ Drag C to the intersection of the arcs.</span>
            </div>
          </div>
          {challengeResult !== "idle" && (
            <strong className={challengeResult}>
              {challengeResult === "correct"
                ? "✓ Unique 4–5–6 triangle verified"
                : "These lengths do not satisfy the triangle inequality"}
            </strong>
          )}
        </article>
        <aside>
          <section>
            <h2>What to do</h2>
            {[
              "Set the three side lengths as given.",
              "Intersect the arcs to place C.",
              "Join AC and BC.",
              "Click ‘Check construction’.",
            ].map((text) => (
              <p key={text}>✓ {text}</p>
            ))}
          </section>
          <section>
            <h2>♧ Need a hint?</h2>
            <p>
              When C is on both arcs, it will be a distance of 4 cm from A and 5
              cm from B.
            </p>
          </section>
        </aside>
      </section>
      <nav className="sss10028-adjacent">
        <Link to={prev.route}>← Previous lesson</Link>
        <Link to={next.route}>Next lesson →</Link>
      </nav>
    </section>
  );
}

function SideSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span>
        {label}
        <b>{value} cm</b>
      </span>
      <input
        aria-label={`${label} length`}
        type="range"
        min="3"
        max="15"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp")
            onChange(Math.min(15, value + 1));
          if (event.key === "ArrowLeft" || event.key === "ArrowDown")
            onChange(Math.max(3, value - 1));
        }}
      />
      <small>3 15</small>
    </label>
  );
}

const TriangleDiagram = forwardRef<
  SVGSVGElement,
  {
    sides: Sides;
    upper: boolean;
    stage: number;
    zoom: number;
    draggable?: boolean;
    onDrag?: (event: PointerEvent<SVGCircleElement>) => void;
    onToggle?: () => void;
  }
>(({ sides, upper, stage, zoom, draggable, onDrag, onToggle }, ref) => {
  const valid = validTriangle(sides);
  const scale = Math.min(43, 300 / sides.ab);
  const ax = 150,
    bx = ax + sides.ab * scale,
    baseY = 285;
  const along =
    (sides.ac * sides.ac + sides.ab * sides.ab - sides.bc * sides.bc) /
    (2 * sides.ab);
  const height = valid
    ? Math.sqrt(Math.max(0, sides.ac * sides.ac - along * along))
    : 0;
  const cx = ax + along * scale,
    cy = baseY + (upper ? -1 : 1) * height * scale;
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 390"
      aria-label="SSS triangle and compass arc intersections"
    >
      <defs>
        <pattern
          id={`sss-grid-${sides.ab}-${sides.ac}-${sides.bc}`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V24" fill="none" stroke="#e1ebf2" />
        </pattern>
      </defs>
      <rect
        width="600"
        height="390"
        fill={`url(#sss-grid-${sides.ab}-${sides.ac}-${sides.bc})`}
      />
      <g
        transform={`translate(${300 * (1 - zoom)} ${195 * (1 - zoom)}) scale(${zoom})`}
      >
        {stage >= 1 && (
          <line className="base" x1={ax} y1={baseY} x2={bx} y2={baseY} />
        )}{" "}
        {valid && stage >= 2 && (
          <circle className="arc a" cx={ax} cy={baseY} r={sides.ac * scale} />
        )}{" "}
        {valid && stage >= 3 && (
          <circle className="arc b" cx={bx} cy={baseY} r={sides.bc * scale} />
        )}{" "}
        {valid && stage >= 4 && (
          <circle
            className={draggable ? "point drag" : "point"}
            role={draggable ? "slider" : undefined}
            aria-label={draggable ? "Intersection point C" : undefined}
            tabIndex={draggable ? 0 : undefined}
            cx={cx}
            cy={cy}
            r="6"
            onPointerDown={
              draggable
                ? (event) =>
                    event.currentTarget.setPointerCapture(event.pointerId)
                : undefined
            }
            onPointerMove={onDrag}
            onKeyDown={(event) => {
              if (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                  event.key,
                )
              )
                onToggle?.();
            }}
          />
        )}{" "}
        {valid && stage >= 4 && (
          <>
            <line className="side" x1={ax} y1={baseY} x2={cx} y2={cy} />
            <line className="side" x1={bx} y1={baseY} x2={cx} y2={cy} />
          </>
        )}
        <circle className="point" cx={ax} cy={baseY} r="5" />
        <circle className="point" cx={bx} cy={baseY} r="5" />
        <text x={ax - 15} y={baseY + 24}>
          A
        </text>
        <text x={bx + 8} y={baseY + 24}>
          B
        </text>
        {valid && (
          <text x={cx - 4} y={cy - 15}>
            C
          </text>
        )}
        <text className="measure" x={(ax + bx) / 2 - 15} y={baseY + 28}>
          {sides.ab} cm
        </text>
        {valid && (
          <>
            <text
              className="measure blue"
              x={(ax + cx) / 2 - 28}
              y={(baseY + cy) / 2}
            >
              {sides.ac} cm
            </text>
            <text
              className="measure purple"
              x={(bx + cx) / 2 + 8}
              y={(baseY + cy) / 2}
            >
              {sides.bc} cm
            </text>
          </>
        )}
      </g>
    </svg>
  );
});
TriangleDiagram.displayName = "TriangleDiagram";
function MiniTriangle() {
  return (
    <svg viewBox="0 0 200 150">
      <line x1="20" y1="125" x2="180" y2="125" />
      <line x1="20" y1="125" x2="105" y2="25" />
      <line x1="180" y1="125" x2="105" y2="25" />
      <path d="M35 55Q75 20 112 35M90 35Q140 10 175 55" />
      <text x="105" y="20">
        C
      </text>
      <text x="12" y="140">
        A
      </text>
      <text x="180" y="140">
        B
      </text>
    </svg>
  );
}
function MiniCorrect() {
  return (
    <svg viewBox="0 0 210 105">
      <line x1="20" y1="85" x2="190" y2="85" />
      <line x1="20" y1="85" x2="115" y2="22" />
      <line x1="190" y1="85" x2="115" y2="22" />
      <path d="M40 45Q85 8 125 34M100 34Q155 7 185 45" />
      <text x="112" y="18">
        C
      </text>
    </svg>
  );
}
function MiniWrong() {
  return (
    <svg viewBox="0 0 210 105">
      <line x1="20" y1="85" x2="190" y2="85" />
      <line x1="20" y1="85" x2="155" y2="36" />
      <line x1="190" y1="85" x2="155" y2="36" />
      <path d="M40 45Q85 8 125 34M100 34Q155 7 185 45" />
      <text x="150" y="31">
        C
      </text>
    </svg>
  );
}
