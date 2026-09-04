import { Check, CircleDot, LockKeyhole, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParabolaStandardFormsTargetLesson10141.css";

type Form = "right" | "left" | "up" | "down";
const forms: Array<{ id: Form; formula: string }> = [
  { id: "right", formula: "y² = 4ax" },
  { id: "left", formula: "y² = -4ax" },
  { id: "up", formula: "x² = 4ay" },
  { id: "down", formula: "x² = -4ay" },
];
const clean = (value: number) =>
  Math.max(0.5, Math.min(10, Math.round(value * 2) / 2));

export default function ParabolaStandardFormsTargetLesson10141({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [form, setForm] = useState<Form>("right"),
    [a, setA] = useState(3),
    [dragging, setDragging] = useState(false),
    [actions, setActions] = useState(0);
  const horizontal = form === "right" || form === "left",
    positive = form === "right" || form === "up",
    sign = positive ? 1 : -1;
  const focus = horizontal ? [sign * a, 0] : [0, sign * a];
  const directrix = horizontal
    ? `x = ${(-sign * a).toFixed(2)}`
    : `y = ${(-sign * a).toFixed(2)}`;
  const axis = horizontal ? "y = 0 (x-axis)" : "x = 0 (y-axis)";
  const exact = forms.find((item) => item.id === form)!;
  const coefficient = 4 * a;
  const graph = useMemo(() => {
    const W = 480,
      H = 360,
      sx = (x: number) => W / 2 + x * 19,
      sy = (y: number) => H / 2 - y * 15;
    const points = Array.from(
      { length: 101 },
      (_, index) => -10 + index / 5,
    ).map((t) =>
      horizontal
        ? [(sign * (t * t)) / (4 * a), t]
        : [t, (sign * (t * t)) / (4 * a)],
    );
    const path = points
      .filter(([x, y]) => Math.abs(x) <= 12 && Math.abs(y) <= 12)
      .map(
        ([x, y], i) =>
          `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`,
      )
      .join(" ");
    const lr = horizontal
      ? [
          [sign * a, 2 * a],
          [sign * a, -2 * a],
        ]
      : [
          [2 * a, sign * a],
          [-2 * a, sign * a],
        ];
    return { W, H, sx, sy, path, lr };
  }, [a, horizontal, sign]);
  const updateA = (value: number) => {
    setA(clean(value));
    setActions((x) => x + 1);
  };
  const pointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging && event.buttons !== 1) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = (event.clientX - box.left - box.width / 2) / ((box.width / 480) * 19),
      y =
        -(event.clientY - box.top - box.height / 2) / ((box.height / 360) * 15);
    updateA(Math.abs(horizontal ? x : y));
  };
  return (
    <section
      className="ps10141-page"
      data-testid="school-mockup-0815"
      data-object-model="dedicated-four-orientation-parabola-constraint-engine"
      data-form={form}
      data-a={a.toFixed(2)}
      data-focus={`${focus[0].toFixed(2)},${focus[1].toFixed(2)}`}
      data-directrix={directrix}
      data-axis={axis}
      data-latus-length={(4 * a).toFixed(2)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>CLASS 11 &bull; CONIC SECTIONS</small>
          <h1>Parabola Standard Forms</h1>
          <p>
            Explore all four orientations of parabolas. Move the slider to
            change a (a &ne; 0) and drag the focus.
          </p>
          <p>
            All elements update while preserving the standard-form constraint.
          </p>
          <div>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>geometry2d</span>
          </div>
        </div>
        <button>&larr; School lessons</button>
      </header>
      <main>
        <h2>PARABOLA EXPLORER</h2>
        <div className="ps10141-workspace">
          <aside className="controls">
            <nav>
              {forms.map((item) => (
                <button
                  className={form === item.id ? "active" : ""}
                  key={item.id}
                  onClick={() => {
                    setForm(item.id);
                    setActions((x) => x + 1);
                  }}
                >
                  {item.formula}
                </button>
              ))}
            </nav>
            <section>
              <b>1. Choose a</b>
              <div className="range">
                <input
                  aria-label="Parabola parameter a"
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={a}
                  onInput={(event) =>
                    updateA(Number(event.currentTarget.value))
                  }
                  onChange={(e) => updateA(Number(e.target.value))}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                      event.preventDefault();
                      updateA(a + 0.5);
                    }
                    if (
                      event.key === "ArrowLeft" ||
                      event.key === "ArrowDown"
                    ) {
                      event.preventDefault();
                      updateA(a - 0.5);
                    }
                  }}
                />
                <output>a = {a.toFixed(2)}</output>
              </div>
              <div className="ticks">
                <span>-10</span>
                <span>-5</span>
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
              <em>(a &ne; 0)</em>
            </section>
            <section>
              <b>2. Drag the focus</b>
              <p>Drag the orange focus point along the axis.</p>
              <div className="focus-read">
                <span>
                  Focus: ({focus[0].toFixed(2)}, {focus[1].toFixed(2)})
                </span>
                <button onClick={() => updateA(3)}>
                  <RotateCcw /> Reset focus
                </button>
              </div>
            </section>
            <article>
              <b>
                <CircleDot /> Current Equation
              </b>
              <p>{exact.formula}</p>
              <strong>
                {horizontal ? "y²" : "x²"} = {positive ? "" : "-"}
                {coefficient.toFixed(2)}
                {horizontal ? "x" : "y"}
              </strong>
            </article>
          </aside>
          <section className="graph">
            <svg
              viewBox="0 0 480 360"
              onPointerMove={pointer}
              onPointerUp={() => setDragging(false)}
              onPointerLeave={() => setDragging(false)}
              aria-label="Interactive standard-form parabola graph"
            >
              {Array.from({ length: 21 }, (_, i) => (
                <g key={i}>
                  <line
                    className="grid"
                    x1={graph.sx(i - 10)}
                    x2={graph.sx(i - 10)}
                    y1="0"
                    y2="360"
                  />
                  <line
                    className="grid"
                    x1="0"
                    x2="480"
                    y1={graph.sy(i - 10)}
                    y2={graph.sy(i - 10)}
                  />
                </g>
              ))}
              <line
                className="axisline"
                x1="0"
                x2="480"
                y1={graph.sy(0)}
                y2={graph.sy(0)}
              />
              <line
                className="axisline"
                x1={graph.sx(0)}
                x2={graph.sx(0)}
                y1="0"
                y2="360"
              />
              <line
                className="directrix"
                x1={horizontal ? graph.sx(-sign * a) : 0}
                x2={horizontal ? graph.sx(-sign * a) : 480}
                y1={horizontal ? 0 : graph.sy(-sign * a)}
                y2={horizontal ? 360 : graph.sy(-sign * a)}
              />
              <path d={graph.path} />
              <line
                className="latus"
                x1={graph.sx(graph.lr[0][0])}
                y1={graph.sy(graph.lr[0][1])}
                x2={graph.sx(graph.lr[1][0])}
                y2={graph.sy(graph.lr[1][1])}
              />
              <circle
                className="vertex"
                cx={graph.sx(0)}
                cy={graph.sy(0)}
                r="6"
              />
              <circle
                className="focus"
                role="slider"
                tabIndex={0}
                aria-label="Draggable parabola focus"
                aria-valuenow={a}
                cx={graph.sx(focus[0])}
                cy={graph.sy(focus[1])}
                r="8"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragging(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp")
                    updateA(a + 0.5);
                  if (e.key === "ArrowLeft" || e.key === "ArrowDown")
                    updateA(a - 0.5);
                }}
              />
              <text x={graph.sx(focus[0]) + 10} y={graph.sy(focus[1]) - 8}>
                Focus ({focus[0].toFixed(0)}, {focus[1].toFixed(0)})
              </text>
            </svg>
            <footer>
              <span>&#9679; Vertex (0, 0)</span>
              <span>&#9679; Focus</span>
              <span>--- Directrix</span>
              <span>&mdash; Axis</span>
              <span>&mdash; Latus rectum</span>
            </footer>
          </section>
          <aside className="elements">
            <h3>ELEMENTS ({exact.formula})</h3>
            <dl>
              <dt>Vertex (V)</dt>
              <dd>(0, 0)</dd>
              <dt>Focus (F)</dt>
              <dd>
                ({focus[0].toFixed(2)}, {focus[1].toFixed(2)})
              </dd>
              <dt>Directrix</dt>
              <dd>{directrix}</dd>
              <dt>Axis of Symmetry</dt>
              <dd>{axis}</dd>
              <dt>Latus Rectum</dt>
              <dd>
                {horizontal
                  ? `Line: x = ${(sign * a).toFixed(2)}`
                  : `Line: y = ${(sign * a).toFixed(2)}`}
                <br />
                Length: |4a| = {(4 * a).toFixed(2)}
              </dd>
              <dt>Parameter</dt>
              <dd>a = {a.toFixed(2)}</dd>
            </dl>
            <article>
              <Check />
              <b>Standard-Form Check</b>
              <p>
                The focus lies on the {horizontal ? "x" : "y"}-axis and the
                directrix is {horizontal ? "vertical" : "horizontal"}. Equation
                is in the form {exact.formula}.
              </p>
            </article>
          </aside>
          <aside className="reference">
            <section>
              <h3>FOUR STANDARD FORMS COMPARISON</h3>
              <table>
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Vertex</th>
                    <th>Focus</th>
                    <th>Directrix</th>
                    <th>Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>y²=4ax</td>
                    <td>(0,0)</td>
                    <td>(a,0)</td>
                    <td>x=-a</td>
                    <td>y=0</td>
                  </tr>
                  <tr>
                    <td>y²=-4ax</td>
                    <td>(0,0)</td>
                    <td>(-a,0)</td>
                    <td>x=a</td>
                    <td>y=0</td>
                  </tr>
                  <tr>
                    <td>x²=4ay</td>
                    <td>(0,0)</td>
                    <td>(0,a)</td>
                    <td>y=-a</td>
                    <td>x=0</td>
                  </tr>
                  <tr>
                    <td>x²=-4ay</td>
                    <td>(0,0)</td>
                    <td>(0,-a)</td>
                    <td>y=a</td>
                    <td>x=0</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section>
              <h3>DRAGGING GUIDE</h3>
              <p>
                <CircleDot /> Drag the orange focus point along the axis to
                change a.
              </p>
              <p>
                <LockKeyhole /> The explorer enforces the standard form.
              </p>
              <p>Other elements adjust automatically.</p>
            </section>
          </aside>
        </div>
        <footer className="relationships">
          <b>KEY RELATIONSHIPS</b>
          <div>
            <span>Distance VF = |a|</span>
            <span>Directrix is |a| units from vertex</span>
            <span>Latus rectum length = 4|a|</span>
            <span>Eccentricity e = 1</span>
          </div>
        </footer>
      </main>
    </section>
  );
}
