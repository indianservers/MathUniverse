import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import {
  type PointerEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InternalSectionFormulaTargetLesson10085.css";

type Point = { x: number; y: number };
type Endpoint = "a" | "b";
const START = { a: { x: 0, y: 0 }, b: { x: 10, y: 5 }, m: 2, n: 3 };
const CHALLENGE = { a: { x: 0, y: 0 }, b: { x: 8, y: 4 }, p: { x: 6, y: 3 } };
const round = (value: number, precision = 2) =>
  Math.round(value * 10 ** precision) / 10 ** precision;
const sectionPoint = (a: Point, b: Point, m: number, n: number) => ({
  x: round((m * b.x + n * a.x) / (m + n)),
  y: round((m * b.y + n * a.y) / (m + n)),
});
const distance = (a: Point, b: Point) =>
  round(Math.hypot(a.x - b.x, a.y - b.y));

export default function InternalSectionFormulaTargetLesson10085({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState(START);
  const [challenge, setChallenge] = useState(CHALLENGE);
  const [dragging, setDragging] = useState<"main-p" | "challenge-p" | null>(
    null,
  );
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const mainRef = useRef<SVGSVGElement>(null);
  const challengeRef = useRef<SVGSVGElement>(null);
  const p = useMemo(
    () => sectionPoint(model.a, model.b, model.m, model.n),
    [model],
  );
  const ap = distance(model.a, p);
  const pb = distance(p, model.b);
  const ratio = pb ? round(ap / pb) : 0;
  const expectedChallenge = sectionPoint(challenge.a, challenge.b, 3, 1);
  const challengeCorrect =
    Math.abs(challenge.p.x - expectedChallenge.x) < 0.2 &&
    Math.abs(challenge.p.y - expectedChallenge.y) < 0.2;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const clampPoint = (point: Point) => ({
    x: Math.max(-1, Math.min(12, round(point.x))),
    y: Math.max(-2, Math.min(8, round(point.y))),
  });
  const svgPoint = (
    event: PointerEvent<SVGSVGElement>,
    svg: SVGSVGElement | null,
  ) => {
    const box = svg?.getBoundingClientRect();
    if (!box) return null;
    return clampPoint({
      x: ((event.clientX - box.left) / box.width) * 14 - 1,
      y: 8 - ((event.clientY - box.top) / box.height) * 10,
    });
  };
  const setEndpoint = (key: Endpoint, axis: keyof Point, value: number) =>
    act(() =>
      setModel((current) => ({
        ...current,
        [key]: { ...current[key], [axis]: value },
      })),
    );
  const moveChallenge = (point: Point) =>
    setChallenge((current) => ({ ...current, p: clampPoint(point) }));
  const reset = () =>
    act(() => {
      setModel(START);
      setChallenge(CHALLENGE);
      setChecked(false);
    });
  const x = (value: number) => (value + 1) * 34;
  const y = (value: number) => (8 - value) * 34;
  const graph = (
    kind: "main" | "challenge",
    a: Point,
    b: Point,
    point: Point,
    ref: RefObject<SVGSVGElement>,
  ) => (
    <svg
      ref={ref}
      viewBox="0 0 476 340"
      aria-label={
        kind === "main"
          ? "Internal section coordinate graph"
          : "Ratio challenge coordinate graph"
      }
      onPointerMove={(event) => {
        if (dragging !== `${kind}-p`) return;
        const next = svgPoint(event, ref.current);
        if (!next) return;
        if (kind === "challenge") moveChallenge(next);
        else {
          const total = distance(a, b);
          const along = total ? distance(a, next) / total : 0;
          const nextM = Math.max(1, Math.min(9, Math.round(along * 10)));
          setModel((current) => ({ ...current, m: nextM, n: 10 - nextM }));
        }
      }}
      onPointerUp={() => dragging && act(() => setDragging(null))}
      onPointerLeave={() => dragging && act(() => setDragging(null))}
    >
      {Array.from({ length: 15 }, (_, index) => (
        <g key={index}>
          <line
            className="grid"
            x1={index * 34}
            y1="0"
            x2={index * 34}
            y2="340"
          />
          <line
            className="grid"
            x1="0"
            y1={index * 34}
            x2="476"
            y2={index * 34}
          />
        </g>
      ))}
      <line className="axis" x1="0" y1={y(0)} x2="476" y2={y(0)} />
      <line className="axis" x1={x(0)} y1="0" x2={x(0)} y2="340" />
      <line
        className="segment"
        x1={x(a.x)}
        y1={y(a.y)}
        x2={x(b.x)}
        y2={y(b.y)}
      />
      <circle className="endpoint" cx={x(a.x)} cy={y(a.y)} r="6" />
      <circle className="endpoint b" cx={x(b.x)} cy={y(b.y)} r="6" />
      <circle
        className="point"
        cx={x(point.x)}
        cy={y(point.y)}
        r="8"
        tabIndex={0}
        aria-label={`Draggable ${kind} point P`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(`${kind}-p`);
        }}
        onKeyDown={(event) => {
          if (kind === "main") {
            if (event.key === "ArrowLeft")
              act(() =>
                setModel((v) => ({
                  ...v,
                  m: Math.max(1, v.m - 1),
                  n: Math.min(9, v.n + 1),
                })),
              );
            if (event.key === "ArrowRight")
              act(() =>
                setModel((v) => ({
                  ...v,
                  m: Math.min(9, v.m + 1),
                  n: Math.max(1, v.n - 1),
                })),
              );
          } else {
            const dx =
              event.key === "ArrowLeft"
                ? -1
                : event.key === "ArrowRight"
                  ? 1
                  : 0;
            const dy =
              event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
            if (dx || dy)
              act(() =>
                moveChallenge({ x: challenge.p.x + dx, y: challenge.p.y + dy }),
              );
          }
        }}
      />
      <text x={x(a.x) + 4} y={y(a.y) + 26}>
        A ({a.x}, {a.y})
      </text>
      <text x={x(b.x) - 24} y={y(b.y) - 12}>
        B ({b.x}, {b.y})
      </text>
      <text className="plabel" x={x(point.x) - 26} y={y(point.y) - 12}>
        P ({point.x}, {point.y})
      </text>
    </svg>
  );

  return (
    <section
      className="isf10085-page"
      data-testid="school-mockup-0759"
      data-object-model="dedicated-internal-section-weighted-ratio-engine"
      data-point={`${p.x},${p.y}`}
      data-ratio={`${model.m}:${model.n}`}
      data-distances={`${ap},${pb}`}
      data-ratio-match={String(Math.abs(ratio - model.m / model.n) < 0.03)}
      data-challenge-point={`${challenge.p.x},${challenge.p.y}`}
      data-challenge-correct={String(challengeCorrect)}
      data-actions={actions}
    >
      <header className="isf10085-hero">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Internal Section Formula</h1>
        <p>
          Find the coordinates of a point that divides a segment internally in a
          given ratio.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
        </div>
      </header>
      <nav className="isf10085-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              onClick={() => act(() => setTab(index))}
            >
              {label}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="isf10085-explore">
          <h2>INTERACTIVE EXPLORATION</h2>
          <p>Drag point P or adjust the ratio to see live updates.</p>
          <div className="isf10085-workspace">
            <aside>
              <section>
                <h3>1. Set endpoints</h3>
                {(["a", "b"] as Endpoint[]).map((key) => (
                  <div className="inputs" key={key}>
                    <b>{key.toUpperCase()} (x, y)</b>
                    <input
                      aria-label={`${key.toUpperCase()} x`}
                      type="number"
                      value={model[key].x}
                      onChange={(e) => setEndpoint(key, "x", +e.target.value)}
                    />
                    <input
                      aria-label={`${key.toUpperCase()} y`}
                      type="number"
                      value={model[key].y}
                      onChange={(e) => setEndpoint(key, "y", +e.target.value)}
                    />
                  </div>
                ))}
              </section>
              <section>
                <h3>2. Internal ratio AP : PB = m : n</h3>
                <div className="ratio">
                  <label>
                    m
                    <input
                      aria-label="Ratio m"
                      type="number"
                      min="1"
                      max="9"
                      value={model.m}
                      onChange={(e) =>
                        act(() =>
                          setModel((v) => ({
                            ...v,
                            m: Math.max(1, +e.target.value),
                          })),
                        )
                      }
                    />
                  </label>
                  <b>:</b>
                  <label>
                    n
                    <input
                      aria-label="Ratio n"
                      type="number"
                      min="1"
                      max="9"
                      value={model.n}
                      onChange={(e) =>
                        act(() =>
                          setModel((v) => ({
                            ...v,
                            n: Math.max(1, +e.target.value),
                          })),
                        )
                      }
                    />
                  </label>
                </div>
                <input
                  aria-label="Ratio position"
                  type="range"
                  min="1"
                  max="9"
                  value={model.m}
                  onChange={(e) =>
                    act(() =>
                      setModel({
                        ...model,
                        m: +e.target.value,
                        n: 10 - +e.target.value,
                      }),
                    )
                  }
                />
                <strong>
                  AP : PB = {model.m} : {model.n}
                </strong>
              </section>
              <section>
                <h3>3. Point P (draggable)</h3>
                <div className="inputs">
                  <b>P (x, y)</b>
                  <input
                    readOnly
                    value={p.x.toFixed(2)}
                    aria-label="Point P x"
                  />
                  <input
                    readOnly
                    value={p.y.toFixed(2)}
                    aria-label="Point P y"
                  />
                </div>
                <small>Drag the purple point on the graph.</small>
              </section>
            </aside>
            <article>{graph("main", model.a, model.b, p, mainRef)}</article>
          </div>
          <section className="isf10085-results">
            <h3>4. Live results</h3>
            <div>
              <article>
                <h4>Weighted-average balance</h4>
                <p>P is the balance point of A and B with weights m and n.</p>
                <div className="balance">
                  <span>
                    A ({model.a.x}, {model.a.y})
                    <small>weight = n = {model.n}</small>
                  </span>
                  <i style={{ flex: model.m }} />
                  <b>
                    P ({p.x}, {p.y})
                  </b>
                  <i style={{ flex: model.n }} />
                  <span>
                    B ({model.b.x}, {model.b.y})
                    <small>weight = m = {model.m}</small>
                  </span>
                </div>
              </article>
              <article>
                <h4>AP : PB verification</h4>
                <p>
                  AP = <b>{ap}</b> &nbsp;&nbsp; PB = <b>{pb}</b>
                </p>
                <strong>
                  AP : PB = {ratio.toFixed(2)} : 1 = {model.m} : {model.n}
                </strong>
                <em>
                  <CheckCircle2 /> Matches the ratio
                </em>
              </article>
            </div>
          </section>
        </section>
        <section className="isf10085-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              If P divides AB internally in ratio m:n, then P is the weighted
              average of A and B with weights n and m:
            </p>
            <strong>P = (nA + mB) / (m + n)</strong>
            <p>This keeps P closer to the point with the larger weight.</p>
          </article>
          <article>
            <h2>INTERNAL SECTION FORMULA</h2>
            <p>If A(x₁,y₁), B(x₂,y₂), and AP:PB=m:n, then</p>
            <strong>P ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))</strong>
          </article>
          <article className="mistake">
            <h2>COMMON MISTAKE</h2>
            <p>
              Using the same ratio as the weight on an endpoint is incorrect.
            </p>
            <p>Use the opposite segment ratio as the weight.</p>
            <strong>weight of A = n, weight of B = m</strong>
          </article>
        </section>
        <section className="isf10085-example">
          <h2>WORKED EXAMPLE</h2>
          <p>
            Find P that divides AB internally in the ratio 2:3, where A(0,0) and
            B(10,5).
          </p>
          <div className="example-line">
            <b>A (0, 0)</b>
            <i />
            <strong>P</strong>
            <i />
            <b>B (10, 5)</b>
          </div>
          <article>
            <p>Here, m=2, n=3.</p>
            <strong>P ((2(10)+3(0))/5, (2(5)+3(0))/5) = P(4,2)</strong>
            <em>Thus, P is at (4, 2). ✓</em>
          </article>
        </section>
        <section className="isf10085-challenge">
          <aside>
            <h2>YOUR CHALLENGE</h2>
            <p>Place point P to divide AB internally in the ratio 3:1.</p>
            <strong>A(0,0), B(8,4)</strong>
            <button onClick={() => act(() => setChecked(true))}>
              Check my answer
            </button>
          </aside>
          {graph(
            "challenge",
            challenge.a,
            challenge.b,
            challenge.p,
            challengeRef,
          )}
          <article>
            <p>Target ratio: AP : PB = 3 : 1</p>
            <p>Expected coordinates of P: (6, 3)</p>
            <em className={checked && challengeCorrect ? "yes" : ""}>
              {checked
                ? challengeCorrect
                  ? "P is nearer to B. Correct ✓"
                  : "Move P to (6, 3)."
                : "Drag P, then check your answer."}
            </em>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </article>
        </section>
      </main>
      <nav className="isf10085-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-midpoint-formula">
          <ArrowLeft /> Midpoint Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-external-section-formula">
          External Section Formula <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
