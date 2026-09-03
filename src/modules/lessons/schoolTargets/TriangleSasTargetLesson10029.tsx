import {
  Check,
  Compass,
  LocateFixed,
  MousePointer2,
  Play,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  forwardRef,
  type PointerEvent,
  type Ref,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleSasTargetLesson10029.css";

type Measures = { ab: number; ac: number; angle: number };
type Tool = "Select" | "Ray at A" | "Arc from A" | "Arc from B" | "Point C";

const initial: Measures = { ab: 6, ac: 4, angle: 55 };
const challengeInitial: Measures = { ab: 5, ac: 7, angle: 60 };
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

function solveTriangle({ ab, ac, angle }: Measures) {
  const radians = (angle * Math.PI) / 180;
  const bc = Math.sqrt(ab * ab + ac * ac - 2 * ab * ac * Math.cos(radians));
  const b =
    (Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc)) * 180) / Math.PI;
  return { bc, b, c: 180 - angle - b };
}

export default function TriangleSasTargetLesson10029({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [measures, setMeasures] = useState(initial);
  const [stage, setStage] = useState(5);
  const [tool, setTool] = useState<Tool>("Ray at A");
  const [snap, setSnap] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [challenge, setChallenge] = useState(challengeInitial);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "retry"
  >("idle");
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const solved = solveTriangle(measures);
  const challengeSolved = solveTriangle(challenge);
  const index = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const previous = schoolLessonCatalog[index - 1];
  const next = schoolLessonCatalog[index + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const update = (key: keyof Measures, value: number) =>
    act(() =>
      setMeasures((current) => ({
        ...current,
        [key]:
          key === "angle"
            ? Math.max(10, Math.min(120, value))
            : Math.max(1, Math.min(10, value)),
      })),
    );
  const reset = () =>
    act(() => {
      setMeasures(initial);
      setStage(5);
      setTool("Ray at A");
      setSnap(true);
      setZoom(1);
      setTab("Interact");
      setChallenge(challengeInitial);
      setChallengeResult("idle");
    });
  const dragC = (event: PointerEvent<SVGCircleElement>) => {
    if (
      !svgRef.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 600;
    const y = ((event.clientY - rect.top) / rect.height) * 390;
    const dx = x - 95;
    const dy = 310 - y;
    const nextAngle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    const nextAc = Math.round((Math.hypot(dx, dy) / 48) * 10) / 10;
    act(() =>
      setMeasures((current) => ({
        ...current,
        ac: snap ? Math.round(nextAc) : Math.max(1, Math.min(10, nextAc)),
        angle: Math.max(
          10,
          Math.min(120, snap ? Math.round(nextAngle / 5) * 5 : nextAngle),
        ),
      })),
    );
  };

  return (
    <section
      className="sas10029-page"
      data-testid="school-mockup-0703"
      data-object-model="dedicated-two-sides-included-angle-sas-protractor-construction"
      data-ab={measures.ab}
      data-ac={measures.ac}
      data-angle={measures.angle}
      data-bc={solved.bc.toFixed(2)}
      data-stage={stage}
      data-tool={tool}
      data-snap={snap}
      data-zoom={zoom.toFixed(1)}
      data-tab={tab}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="sas10029-hero">
        <small>CLASS 8 · PRACTICAL GEOMETRY</small>
        <h1>Triangle Construction by SAS</h1>
        <p>
          Construct a unique triangle from two sides and their included angle.
        </p>
        <div>
          <span>24 min</span>
          <span>FOUNDATION</span>
          <span>VISUAL, HANDS-ON</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">← School lessons</Link>
      </header>

      <nav className="sas10029-tabs" aria-label="Lesson views">
        {tabs.map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>

      <section className="sas10029-build">
        <header>
          <h2>Construct Your Triangle (Protractor &amp; Compass) ⓘ</h2>
          <p>Build △ABC using two sides and their included angle at A.</p>
          <div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={() => act(() => setStage(6))}>
              <Play /> Replay steps
            </button>
          </div>
        </header>
        <aside className="sas10029-controls">
          <h3>
            GIVEN <small>(drag to change)</small>
          </h3>
          <MeasureSlider
            label="Side AB (base)"
            value={measures.ab}
            suffix="cm"
            min={1}
            max={10}
            onChange={(v) => update("ab", v)}
          />
          <MeasureSlider
            label="Side AC (from ∠A)"
            value={measures.ac}
            suffix="cm"
            min={1}
            max={10}
            onChange={(v) => update("ac", v)}
          />
          <MeasureSlider
            label="Included angle ∠A"
            value={measures.angle}
            suffix="°"
            min={10}
            max={120}
            onChange={(v) => update("angle", v)}
          />
          <section>
            <h3>Steps</h3>
            <p>Follow the construction to place point C.</p>
            {[
              "Draw base AB.",
              "Set ∠A and draw ray from A.",
              "Set radius = AC and draw arc from A.",
              "Set radius = BC and draw arc from B.",
              "Mark intersection as C.",
              "Triangle is unique.",
            ].map((text, i) => (
              <button
                className={stage === i + 1 ? "active" : ""}
                key={text}
                onClick={() => act(() => setStage(i + 1))}
              >
                <i>{i + 1}</i>
                <span>{text}</span>
                {i + 1 <= stage && <Check />}
              </button>
            ))}
          </section>
          <label className="sas10029-snap">
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => act(() => setSnap(e.target.checked))}
            />{" "}
            Snap to intersections
          </label>
        </aside>
        <article className="sas10029-work">
          <strong>
            <Check /> Good! Arcs intersect at one point.
            <small>This determines a unique triangle.</small>
          </strong>
          <SasDiagram
            ref={svgRef}
            measures={measures}
            stage={stage}
            zoom={zoom}
            draggable
            onDrag={dragC}
            onNudge={(delta) => update("angle", measures.angle + delta)}
          />
          <nav aria-label="Construction tools">
            {(
              [
                ["Select", MousePointer2],
                ["Ray at A", LocateFixed],
                ["Arc from A", Compass],
                ["Arc from B", Compass],
                ["Point C", LocateFixed],
              ] as const
            ).map(([name, Icon], i) => (
              <button
                className={tool === name ? "active" : ""}
                key={name}
                onClick={() =>
                  act(() => {
                    setTool(name);
                    setStage(Math.max(stage, i + 1));
                  })
                }
              >
                <Icon /> {name}
              </button>
            ))}
            <button onClick={() => act(() => setStage(0))}>
              <Trash2 /> Clear all
            </button>
          </nav>
          <aside>
            <h3>Current Measurements</h3>
            <p>AB = {measures.ab.toFixed(1)} cm</p>
            <p>AC = {measures.ac.toFixed(1)} cm</p>
            <p>∠A = {measures.angle.toFixed(0)}°</p>
            <p>∠B = {solved.b.toFixed(2)}°</p>
            <p>∠C = {solved.c.toFixed(2)}°</p>
          </aside>
          <footer>
            <button
              onClick={() => act(() => setZoom(Math.max(0.8, zoom - 0.1)))}
              aria-label="Zoom out"
            >
              <ZoomOut />
            </button>
            <b>{Math.round(zoom * 100)}%</b>
            <button
              onClick={() => act(() => setZoom(Math.min(1.3, zoom + 0.1)))}
              aria-label="Zoom in"
            >
              <ZoomIn />
            </button>
          </footer>
        </article>
      </section>

      <section className="sas10029-theory">
        <article>
          <h2>◉ Why This Works</h2>
          <p>The SAS postulate states:</p>
          <p>
            If two sides and their included angle of a triangle are equal to two
            sides and their included angle of another triangle, then the
            triangles are congruent.
          </p>
          <strong>
            Two sides and the included angle determine one triangle.
          </strong>
        </article>
        <article>
          <h2>▣ Worked Example</h2>
          <p>Given: AB = 6 cm, AC = 4 cm, ∠A = 55°</p>
          <MiniSas measures={initial} />
          <b>Construction Result:</b>
          <p>✓ ∠B ≈ 71.04°</p>
          <p>✓ ∠C ≈ 53.96°</p>
          <p>✓ △ABC is unique.</p>
        </article>
        <article>
          <h2>⚠ Common Mistake</h2>
          <p>Using a non-included angle is SSA, not SAS.</p>
          <MiniWrong />
          <strong>
            SSA can produce 0, 1 or 2 triangles. It is not a unique
            construction.
          </strong>
        </article>
      </section>

      <section className="sas10029-challenge">
        <article>
          <h2>◎ Try It Yourself</h2>
          <p>Construct △ABC with the given measures.</p>
          <div>
            <h3>Your Challenge</h3>
            <MeasureSlider
              label="AB (base)"
              value={challenge.ab}
              suffix="cm"
              min={1}
              max={10}
              onChange={(v) => {
                setChallenge((c) => ({ ...c, ab: v }));
                setChallengeResult("idle");
              }}
            />
            <MeasureSlider
              label="AC (from ∠A)"
              value={challenge.ac}
              suffix="cm"
              min={1}
              max={10}
              onChange={(v) => {
                setChallenge((c) => ({ ...c, ac: v }));
                setChallengeResult("idle");
              }}
            />
            <MeasureSlider
              label="∠A (included)"
              value={challenge.angle}
              suffix="°"
              min={10}
              max={120}
              onChange={(v) => {
                setChallenge((c) => ({ ...c, angle: v }));
                setChallengeResult("idle");
              }}
            />
          </div>
        </article>
        <aside>
          <strong>Goal: Place C at the intersection of the two arcs.</strong>
          <p>✓ All three given measures should match.</p>
          <p>✓ One unique triangle is possible.</p>
          <button
            onClick={() => {
              const correct =
                challenge.ab === 5 &&
                challenge.ac === 7 &&
                challenge.angle === 60;
              setChallengeResult(correct ? "correct" : "retry");
              setActions((n) => n + 1);
            }}
          >
            Check My Triangle
          </button>
          <section>
            <b>Feedback</b>
            <p>
              {challengeResult === "correct"
                ? `Correct: BC = ${challengeSolved.bc.toFixed(2)} cm; the SAS triangle is unique.`
                : challengeResult === "retry"
                  ? "Restore 5 cm, 7 cm, and the included 60° angle."
                  : "Construct the triangle and click ‘Check My Triangle’."}
            </p>
            <MiniSas measures={challenge} />
          </section>
        </aside>
      </section>

      <nav className="sas10029-adjacent">
        <Link to={previous.route}>← Triangle Construction by SSS</Link>
        <Link to={next.route}>Triangle Construction by ASA →</Link>
      </nav>
    </section>
  );
}

function MeasureSlider({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span>
        {label}
        <b>
          {value} {suffix}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp")
            onChange(Math.min(max, value + 1));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown")
            onChange(Math.max(min, value - 1));
        }}
      />
      <small>
        {min} {max}
      </small>
    </label>
  );
}

type DiagramProps = {
  measures: Measures;
  stage: number;
  zoom: number;
  draggable?: boolean;
  onDrag?: (event: PointerEvent<SVGCircleElement>) => void;
  onNudge?: (delta: number) => void;
};
const SasDiagram = forwardRef<SVGSVGElement, DiagramProps>((props, ref) => (
  <SasSvg {...props} svgRef={ref} />
));
SasDiagram.displayName = "SasDiagram";

function SasSvg({
  measures,
  stage,
  zoom,
  draggable,
  onDrag,
  onNudge,
  svgRef,
}: DiagramProps & { svgRef?: Ref<SVGSVGElement> }) {
  const scale = 48,
    ax = 95,
    ay = 310,
    bx = ax + measures.ab * scale;
  const radians = (measures.angle * Math.PI) / 180;
  const cx = ax + measures.ac * scale * Math.cos(radians),
    cy = ay - measures.ac * scale * Math.sin(radians);
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 390"
      aria-label="SAS triangle protractor and compass construction"
    >
      <defs>
        <pattern
          id={`sas-grid-${measures.ab}-${measures.ac}-${measures.angle}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#e5edf3" />
        </pattern>
      </defs>
      <rect
        width="600"
        height="390"
        fill={`url(#sas-grid-${measures.ab}-${measures.ac}-${measures.angle})`}
      />
      <g
        transform={`translate(${300 * (1 - zoom)} ${195 * (1 - zoom)}) scale(${zoom})`}
      >
        {stage >= 1 && (
          <line className="base" x1={ax} y1={ay} x2={bx} y2={ay} />
        )}
        {stage >= 2 && (
          <>
            <line
              className="ray"
              x1={ax}
              y1={ay}
              x2={ax + 390 * Math.cos(radians)}
              y2={ay - 390 * Math.sin(radians)}
            />
            <path
              className="angle"
              d={`M${ax + 45} ${ay} A45 45 0 0 0 ${ax + 45 * Math.cos(radians)} ${ay - 45 * Math.sin(radians)}`}
            />
            <text x={ax + 55} y={ay - 18}>
              {measures.angle}°
            </text>
          </>
        )}
        {stage >= 3 && (
          <circle className="arc a" cx={ax} cy={ay} r={measures.ac * scale} />
        )}
        {stage >= 4 && (
          <circle
            className="arc b"
            cx={bx}
            cy={ay}
            r={solveTriangle(measures).bc * scale}
          />
        )}
        {stage >= 5 && (
          <>
            <line className="side" x1={ax} y1={ay} x2={cx} y2={cy} />
            <line className="side" x1={bx} y1={ay} x2={cx} y2={cy} />
            <circle
              className={draggable ? "point drag" : "point"}
              role={draggable ? "slider" : undefined}
              aria-label={draggable ? "Point C" : undefined}
              tabIndex={draggable ? 0 : undefined}
              cx={cx}
              cy={cy}
              r="6"
              onPointerDown={
                draggable
                  ? (e) => e.currentTarget.setPointerCapture(e.pointerId)
                  : undefined
              }
              onPointerMove={onDrag}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowRight") onNudge?.(1);
                if (e.key === "ArrowDown" || e.key === "ArrowLeft")
                  onNudge?.(-1);
              }}
            />
          </>
        )}
        <circle className="point" cx={ax} cy={ay} r="5" />
        <circle className="point" cx={bx} cy={ay} r="5" />
        <text x={ax - 22} y={ay + 25}>
          A
        </text>
        <text x={bx + 12} y={ay + 25}>
          B
        </text>
        {stage >= 5 && (
          <text x={cx - 3} y={cy - 15}>
            C
          </text>
        )}
        <text className="measure" x={(ax + bx) / 2 - 18} y={ay + 29}>
          {measures.ab} cm
        </text>
        {stage >= 5 && (
          <text className="measure" x={(ax + cx) / 2 - 27} y={(ay + cy) / 2}>
            {measures.ac} cm
          </text>
        )}
      </g>
    </svg>
  );
}

function MiniSas({ measures }: { measures: Measures }) {
  const r = (measures.angle * Math.PI) / 180,
    ax = 20,
    ay = 120,
    bx = 175,
    cx = ax + 85 * Math.cos(r),
    cy = ay - 85 * Math.sin(r);
  return (
    <svg viewBox="0 0 200 145">
      <line x1={ax} y1={ay} x2={bx} y2={ay} />
      <line x1={ax} y1={ay} x2={cx} y2={cy} />
      <line x1={bx} y1={ay} x2={cx} y2={cy} />
      <path
        d={`M${ax + 30} ${ay} A30 30 0 0 0 ${ax + 30 * Math.cos(r)} ${ay - 30 * Math.sin(r)}`}
      />
      <text x="8" y="137">
        A
      </text>
      <text x="180" y="137">
        B
      </text>
      <text x={cx + 4} y={cy - 4}>
        C
      </text>
    </svg>
  );
}
function MiniWrong() {
  return (
    <svg viewBox="0 0 200 110">
      <line x1="15" y1="95" x2="175" y2="95" />
      <line x1="15" y1="95" x2="125" y2="18" />
      <line x1="125" y1="18" x2="175" y2="95" />
      <path d="M150 95A25 25 0 0 1 163 73" />
    </svg>
  );
}
