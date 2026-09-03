import {
  Check,
  Move,
  MousePointer2,
  RotateCcw,
  Ruler,
  Tags,
  Trash2,
} from "lucide-react";
import { forwardRef, type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleAsaTargetLesson10030.css";

type AsaMeasures = { a: number; b: number; side: number };
type AsaTool = "Select" | "Move" | "Measure" | "Labels";
const initial: AsaMeasures = { a: 50, b: 65, side: 7 };
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

function solveAsa({ a, b, side }: AsaMeasures) {
  const c = 180 - a - b;
  const valid = a > 0 && b > 0 && c > 0;
  const radA = (a * Math.PI) / 180;
  const radB = (b * Math.PI) / 180;
  const denominator = Math.sin((c * Math.PI) / 180);
  return {
    c,
    valid,
    ac: valid ? (side * Math.sin(radB)) / denominator : 0,
    bc: valid ? (side * Math.sin(radA)) / denominator : 0,
  };
}

export default function TriangleAsaTargetLesson10030({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [measures, setMeasures] = useState(initial);
  const [showSteps, setShowSteps] = useState(true);
  const [tool, setTool] = useState<AsaTool>("Select");
  const [labels, setLabels] = useState(true);
  const [visible, setVisible] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const solved = solveAsa(measures);
  const index = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const previous = schoolLessonCatalog[index - 1];
  const next = schoolLessonCatalog[index + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: keyof AsaMeasures, value: number) =>
    act(() =>
      setMeasures((current) => ({
        ...current,
        [key]:
          key === "side"
            ? Math.max(2, Math.min(12, value))
            : Math.max(10, Math.min(150, value)),
      })),
    );
  const reset = () =>
    act(() => {
      setMeasures(initial);
      setShowSteps(true);
      setTool("Select");
      setLabels(true);
      setVisible(true);
      setTab("Interact");
    });
  const dragHandle = (
    which: "a" | "b",
    event: PointerEvent<SVGCircleElement>,
  ) => {
    if (
      !svgRef.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 600;
    const y = ((event.clientY - rect.top) / rect.height) * 390;
    const baseY = 310,
      ax = 95,
      bx = 95 + measures.side * 43;
    const degrees =
      which === "a"
        ? (Math.atan2(baseY - y, x - ax) * 180) / Math.PI
        : (Math.atan2(baseY - y, bx - x) * 180) / Math.PI;
    update(which, Math.round(degrees));
  };
  return (
    <section
      className="asa10030-page"
      data-testid="school-mockup-0704"
      data-object-model="dedicated-two-angle-included-side-ray-intersection-asa-construction"
      data-angle-a={measures.a}
      data-angle-b={measures.b}
      data-angle-c={solved.c}
      data-side={measures.side}
      data-valid={solved.valid}
      data-tool={tool}
      data-labels={labels}
      data-visible={visible}
      data-steps={showSteps}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="asa10030-hero">
        <small>CLASS 8 · PRACTICAL GEOMETRY</small>
        <h1>Triangle Construction by ASA</h1>
        <p>
          Construct a unique triangle when two angles and the included side are
          given.
        </p>
        <div>
          <span>♙ Class 8</span>
          <span>◷ 24 min</span>
          <span>FOUNDATION</span>
          <span>VISUAL, EXPLORATION</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="asa10030-tabs" aria-label="Lesson views">
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
      <section className="asa10030-build">
        <header>
          <h2>Construct your triangle</h2>
          <p>
            Set ∠A, ∠B and side AB. Rotate both rays until they intersect at C.
          </p>
          <div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <label>
              <input
                type="checkbox"
                checked={showSteps}
                onChange={(e) => act(() => setShowSteps(e.target.checked))}
              />{" "}
              Show steps
            </label>
          </div>
        </header>
        <aside className="asa10030-controls">
          <section>
            <h3>GIVEN</h3>
            <AngleSlider
              label="∠A"
              value={measures.a}
              min={10}
              max={150}
              suffix="°"
              onChange={(v) => update("a", v)}
            />
            <AngleSlider
              label="∠B"
              value={measures.b}
              min={10}
              max={150}
              suffix="°"
              onChange={(v) => update("b", v)}
            />
            <AngleSlider
              label="Side AB"
              value={measures.side}
              min={2}
              max={12}
              suffix="cm"
              onChange={(v) => update("side", v)}
            />
          </section>
          <section
            className={solved.valid ? "calculated" : "calculated invalid"}
          >
            <h3>CALCULATED</h3>
            <strong>
              ∠C <b>{solved.c}°</b>
            </strong>
            <p>∠A + ∠B + ∠C = 180°</p>
            <p>
              {measures.a}° + {measures.b}° + {solved.c}° = 180°{" "}
              {solved.valid ? "✓" : "✕"}
            </p>
          </section>
          {showSteps && (
            <section className="steps">
              <h3>CONSTRUCTION STEPS</h3>
              {[
                "Draw base AB",
                "At A, draw ray making ∠A",
                "At B, draw ray making ∠B",
                "Rays intersect at C",
                "Triangle ABC formed",
              ].map((text, i) => (
                <p key={text}>
                  <i>{i + 1}</i>
                  {text}
                  <Check />
                </p>
              ))}
            </section>
          )}
        </aside>
        <article className="asa10030-work">
          <h3>Drag the blue handles to rotate the rays.</h3>
          <AsaDiagram
            ref={svgRef}
            measures={measures}
            visible={visible}
            labels={labels}
            onDrag={dragHandle}
            onNudge={(which, delta) => update(which, measures[which] + delta)}
          />
          <nav>
            {(
              [
                ["Select", MousePointer2],
                ["Move", Move],
                ["Measure", Ruler],
                ["Labels", Tags],
              ] as const
            ).map(([name, Icon]) => (
              <button
                className={tool === name ? "active" : ""}
                key={name}
                onClick={() =>
                  act(() => {
                    setTool(name);
                    if (name === "Labels") setLabels((value) => !value);
                  })
                }
              >
                <Icon /> {name}
              </button>
            ))}
            <button onClick={() => act(() => setVisible(false))}>
              <Trash2 /> Clear
            </button>
          </nav>
          {!visible && (
            <button
              className="restore"
              onClick={() => act(() => setVisible(true))}
            >
              Restore construction
            </button>
          )}
        </article>
      </section>
      <section className="asa10030-theory">
        <article>
          <h2>💡 WHY IT WORKS</h2>
          <p>In any triangle, ∠A + ∠B + ∠C = 180°.</p>
          <p>Knowing two angles fixes the third angle.</p>
          <p>
            With ∠A, ∠B and the included side AB, the triangle is uniquely
            determined.
          </p>
        </article>
        <article>
          <h2>▣ WORKED EXAMPLE</h2>
          <p>Given: AB = 7 cm, ∠A = 50°, ∠B = 65°</p>
          <b>∠C = 180° − (∠A + ∠B)</b>
          <p>= 180° − (50° + 65°) = 65°</p>
          <MiniAsa />
        </article>
        <article>
          <h2>⚠ COMMON MISCONCEPTION</h2>
          <p>Angles whose sum is 180° or more cannot form a triangle.</p>
          <p>
            Example: 110° and 80° leave −10° for the third angle. Impossible!
          </p>
        </article>
      </section>
      <section className="asa10030-mini">
        <article>
          <h2>! MINI CHALLENGE</h2>
          <p>Rotate both rays so they intersect to form triangle ABC.</p>
          <p>✓ Rays intersect at C</p>
          <p>✓ Calculated ∠C is positive and less than 180°</p>
          <p>✓ ∠A + ∠B + ∠C = 180°</p>
        </article>
        <aside className={solved.valid ? "ready" : "not-ready"}>
          <strong>
            {solved.valid
              ? "☆ Triangle ready!"
              : "Angles cannot form a triangle"}
          </strong>
          <p>
            {solved.valid
              ? "Great job! Your triangle satisfies the ASA construction rule."
              : "Reduce one of the given angles until their sum is below 180°."}
          </p>
        </aside>
      </section>
      <section className="asa10030-lower">
        <article>
          <h2>☷ CONSTRUCTION CHECKLIST</h2>
          {[
            "Draw a base segment AB of given length.",
            "At A, draw a ray making angle ∠A with AB.",
            "At B, draw a ray making angle ∠B with BA.",
            "Mark the intersection point C.",
            "Join AC and BC to get triangle ABC.",
          ].map((text, i) => (
            <p key={text}>
              <i>{i + 1}</i>
              {text}
            </p>
          ))}
        </article>
        <article>
          <h2>♧ THE ASA RULE</h2>
          <strong>
            Two angles and the included side determine exactly one triangle.
          </strong>
          <b>∠A, ∠B and side AB → unique △ABC</b>
          <p>Mathematically: ∠A + ∠B + ∠C = 180°</p>
        </article>
        <article>
          <h2>♧ KEY TAKEAWAYS</h2>
          <p>✓ The third angle is 180° − (∠A + ∠B).</p>
          <p>✓ Two angles + included side ⇒ unique triangle.</p>
          <p>✓ This is the ASA construction.</p>
          <p>✓ Always verify that ∠C is positive.</p>
        </article>
      </section>
      <nav className="asa10030-adjacent">
        <Link to={previous.route}>
          ← Previous
          <br />
          Triangle Construction by SAS
        </Link>
        <Link to={next.route}>
          Next
          <br />
          Right Triangle Construction by RHS →
        </Link>
      </nav>
    </section>
  );
}

function AngleSlider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
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

const AsaDiagram = forwardRef<
  SVGSVGElement,
  {
    measures: AsaMeasures;
    visible: boolean;
    labels: boolean;
    onDrag: (which: "a" | "b", event: PointerEvent<SVGCircleElement>) => void;
    onNudge: (which: "a" | "b", delta: number) => void;
  }
>(({ measures, visible, labels, onDrag, onNudge }, ref) => {
  const ax = 95,
    ay = 310,
    bx = ax + measures.side * 43;
  const tanA = Math.tan((measures.a * Math.PI) / 180),
    tanB = Math.tan((measures.b * Math.PI) / 180);
  const xOffset = (measures.side * 43 * tanB) / (tanA + tanB);
  const cx = ax + xOffset,
    cy = ay - xOffset * tanA;
  const handle = (which: "a" | "b", x: number, y: number, color: string) => (
    <circle
      className="handle"
      role="slider"
      aria-label={`Rotate angle ${which.toUpperCase()}`}
      tabIndex={0}
      cx={x}
      cy={y}
      r="7"
      fill={color}
      onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
      onPointerMove={(e) => onDrag(which, e)}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") onNudge(which, 1);
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") onNudge(which, -1);
      }}
    />
  );
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 390"
      aria-label="ASA ray intersection with protractors"
    >
      <defs>
        <pattern
          id="asa-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#e8eef4" />
        </pattern>
      </defs>
      <rect width="600" height="390" fill="url(#asa-grid)" />
      {visible && (
        <>
          {[ax, bx].map((center, p) => (
            <g className={`protractor p${p}`} key={center}>
              {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map(
                (degree) => {
                  const r = (degree * Math.PI) / 180,
                    direction = p === 0 ? r : Math.PI - r;
                  return (
                    <line
                      key={degree}
                      x1={center}
                      y1={ay}
                      x2={center + 112 * Math.cos(direction)}
                      y2={ay - 112 * Math.sin(direction)}
                    />
                  );
                },
              )}
              <path
                d={`M${center - 112} ${ay} A112 112 0 0 1 ${center + 112} ${ay}`}
              />
            </g>
          ))}
          <line className="base" x1={ax} y1={ay} x2={bx} y2={ay} />
          <line className="side a" x1={ax} y1={ay} x2={cx} y2={cy} />
          <line className="side b" x1={bx} y1={ay} x2={cx} y2={cy} />
          <line
            className="ray a"
            x1={cx}
            y1={cy}
            x2={cx - 35 * Math.cos((measures.a * Math.PI) / 180)}
            y2={cy - 35 * Math.sin((measures.a * Math.PI) / 180)}
          />
          <line
            className="ray b"
            x1={cx}
            y1={cy}
            x2={cx + 35 * Math.cos((measures.b * Math.PI) / 180)}
            y2={cy - 35 * Math.sin((measures.b * Math.PI) / 180)}
          />
          {handle(
            "a",
            ax + 98 * Math.cos((measures.a * Math.PI) / 180),
            ay - 98 * Math.sin((measures.a * Math.PI) / 180),
            "#1683dc",
          )}
          {handle(
            "b",
            bx - 98 * Math.cos((measures.b * Math.PI) / 180),
            ay - 98 * Math.sin((measures.b * Math.PI) / 180),
            "#7939ca",
          )}
          <circle className="point-c" cx={cx} cy={cy} r="7" />
          {labels && (
            <>
              <text x={ax - 14} y={ay + 26}>
                A
              </text>
              <text x={bx - 2} y={ay + 26}>
                B
              </text>
              <text x={cx - 5} y={cy - 15}>
                C
              </text>
              <text x={ax + 43} y={ay - 18}>
                {measures.a}°
              </text>
              <text x={bx - 62} y={ay - 18}>
                {measures.b}°
              </text>
              <text x={(ax + bx) / 2 - 13} y={ay + 27}>
                {measures.side} cm
              </text>
            </>
          )}
        </>
      )}
    </svg>
  );
});
AsaDiagram.displayName = "AsaDiagram";

function MiniAsa() {
  return (
    <svg viewBox="0 0 180 110">
      <line x1="15" y1="92" x2="165" y2="92" />
      <line x1="15" y1="92" x2="90" y2="15" />
      <line x1="165" y1="92" x2="90" y2="15" />
      <path d="M40 92A25 25 0 0 0 32 74M140 92A25 25 0 0 1 148 74M78 28A18 18 0 0 0 102 28" />
      <text x="72" y="106">
        7 cm
      </text>
    </svg>
  );
}
