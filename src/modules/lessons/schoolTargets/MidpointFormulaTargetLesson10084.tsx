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
import "./MidpointFormulaTargetLesson10084.css";
type Point = { x: number; y: number };
type Key = "a" | "b";
const START = { a: { x: -2, y: 4 }, b: { x: 6, y: -2 } },
  CHALLENGE = { a: { x: -1, y: 5 }, b: { x: 5, y: -3 } };
const rr = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p;
const derive = (p: { a: Point; b: Point }) => {
  const m = { x: rr((p.a.x + p.b.x) / 2), y: rr((p.a.y + p.b.y) / 2) },
    am = rr(Math.hypot(m.x - p.a.x, m.y - p.a.y)),
    mb = rr(Math.hypot(m.x - p.b.x, m.y - p.b.y));
  return { m, am, mb, equal: Math.abs(am - mb) < 0.001 };
};
export default function MidpointFormulaTargetLesson10084({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [challenge, setChallenge] = useState(CHALLENGE),
    [active, setActive] = useState<`${"main" | "challenge"}-${Key}` | null>(
      null,
    ),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0);
  const mainSvg = useRef<SVGSVGElement>(null),
    challengeSvg = useRef<SVGSVGElement>(null),
    m = useMemo(() => derive(points), [points]),
    cm = useMemo(() => derive(challenge), [challenge]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    clamp = (p: Point) => ({
      x: Math.max(-7, Math.min(7, Math.round(p.x))),
      y: Math.max(-6, Math.min(6, Math.round(p.y))),
    });
  const update = (model: "main" | "challenge", key: Key, p: Point) =>
    model === "main"
      ? setPoints((v) => ({ ...v, [key]: clamp(p) }))
      : setChallenge((v) => ({ ...v, [key]: clamp(p) }));
  const local = (
    e: PointerEvent<SVGSVGElement>,
    ref: RefObject<SVGSVGElement | null>,
  ) => {
    const r = ref.current?.getBoundingClientRect();
    return r
      ? {
          x: ((e.clientX - r.left) / r.width) * 16 - 8,
          y: 7 - ((e.clientY - r.top) / r.height) * 14,
        }
      : null;
  };
  const keyMove = (
    model: "main" | "challenge",
    key: Key,
    dx: number,
    dy: number,
  ) => {
    const source = model === "main" ? points : challenge;
    act(() =>
      update(model, key, { x: source[key].x + dx, y: source[key].y + dy }),
    );
  };
  const reset = () =>
      act(() => {
        setPoints(START);
        setChallenge(CHALLENGE);
      }),
    sx = (x: number) => (x + 8) * 30,
    sy = (y: number) => (7 - y) * 30;
  const graph = (
    model: "main" | "challenge",
    p: { a: Point; b: Point },
    mid: Point,
    ref: RefObject<SVGSVGElement | null>,
  ) => (
    <svg
      ref={ref}
      viewBox="0 0 480 420"
      aria-label={`${model === "main" ? "Draggable midpoint coordinate plane" : "Draggable fixed-midpoint challenge"}`}
      onPointerMove={(e) => {
        if (!active || !active.startsWith(model)) return;
        const q = local(e, ref);
        if (q) update(model, active.endsWith("a") ? "a" : "b", q);
      }}
      onPointerUp={() => active && act(() => setActive(null))}
      onPointerLeave={() => active && act(() => setActive(null))}
    >
      {Array.from({ length: 17 }, (_, i) => (
        <g key={i}>
          <line className="grid" x1={i * 30} y1="0" x2={i * 30} y2="420" />
          <line className="grid" x1="0" y1={i * 30} x2="480" y2={i * 30} />
        </g>
      ))}
      <line className="axis" x1="0" y1={sy(0)} x2="480" y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="420" />
      <line
        className="segment"
        x1={sx(p.a.x)}
        y1={sy(p.a.y)}
        x2={sx(p.b.x)}
        y2={sy(p.b.y)}
      />
      <line
        className="half one"
        x1={sx(p.a.x)}
        y1={sy(p.a.y)}
        x2={sx(mid.x)}
        y2={sy(mid.y)}
      />
      <line
        className="half two"
        x1={sx(mid.x)}
        y1={sy(mid.y)}
        x2={sx(p.b.x)}
        y2={sy(p.b.y)}
      />
      {(["a", "b"] as Key[]).map((key) => (
        <circle
          key={key}
          className={key}
          tabIndex={0}
          aria-label={`Draggable ${model} point ${key.toUpperCase()}`}
          cx={sx(p[key].x)}
          cy={sy(p[key].y)}
          r="7"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setActive(`${model}-${key}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") keyMove(model, key, -1, 0);
            if (e.key === "ArrowRight") keyMove(model, key, 1, 0);
            if (e.key === "ArrowUp") keyMove(model, key, 0, 1);
            if (e.key === "ArrowDown") keyMove(model, key, 0, -1);
          }}
        />
      ))}
      <circle className="mid" cx={sx(mid.x)} cy={sy(mid.y)} r="7" />
      <text x={sx(p.a.x) - 45} y={sy(p.a.y) - 10}>
        A ({p.a.x}, {p.a.y})
      </text>
      <text x={sx(p.b.x) - 25} y={sy(p.b.y) + 25}>
        B ({p.b.x}, {p.b.y})
      </text>
      <text className="mlabel" x={sx(mid.x) + 10} y={sy(mid.y) - 8}>
        M ({mid.x}, {mid.y})
      </text>
    </svg>
  );
  return (
    <section
      className="mf10084-page"
      data-testid="school-mockup-0758"
      data-object-model="dedicated-endpoint-average-equal-distance-midpoint-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-midpoint={`${m.m.x},${m.m.y}`}
      data-distances={`${m.am},${m.mb}`}
      data-equal={String(m.equal)}
      data-challenge-a={`${challenge.a.x},${challenge.a.y}`}
      data-challenge-b={`${challenge.b.x},${challenge.b.y}`}
      data-challenge-midpoint={`${cm.m.x},${cm.m.y}`}
      data-challenge-fixed={String(cm.m.x === 2 && cm.m.y === 1)}
      data-actions={actions}
    >
      <header className="mf10084-hero">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Midpoint Formula</h1>
        <p>Locate the point halfway between two coordinate points.</p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="mf10084-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="mf10084-lab">
          <aside>
            <h2>CONTROL POINTS</h2>
            <p>Drag the endpoints A or B on the grid.</p>
            {(["a", "b"] as Key[]).map((key, i) => (
              <section key={key} className={key}>
                <h3>
                  ● Point {key.toUpperCase()} (x{i + 1}, y{i + 1})
                </h3>
                <label>
                  <input
                    aria-label={`Point ${key.toUpperCase()} x`}
                    type="number"
                    value={points[key].x}
                    onChange={(e) =>
                      act(() =>
                        update("main", key, {
                          ...points[key],
                          x: +e.target.value,
                        }),
                      )
                    }
                  />
                  x{i + 1}
                </label>
                <label>
                  <input
                    aria-label={`Point ${key.toUpperCase()} y`}
                    type="number"
                    value={points[key].y}
                    onChange={(e) =>
                      act(() =>
                        update("main", key, {
                          ...points[key],
                          y: +e.target.value,
                        }),
                      )
                    }
                  />
                  y{i + 1}
                </label>
              </section>
            ))}
            <h2>MIDPOINT M</h2>
            <p>Computed using the Midpoint Formula.</p>
            <strong>
              M ({m.m.x}, {m.m.y})
            </strong>
          </aside>
          <article>{graph("main", points, m.m, mainSvg)}</article>
          <aside className="results">
            <h2>LIVE RESULTS</h2>
            <h3>MIDPOINT FORMULA</h3>
            <strong>M((x₁+x₂)/2, (y₁+y₂)/2)</strong>
            <h3>Substitute values</h3>
            <p>
              M(({points.a.x}+{points.b.x})/2, ({points.a.y}+{points.b.y})/2)
            </p>
            <p>
              = M ({m.m.x}, {m.m.y})
            </p>
            <hr />
            <h3>Equal-distance check</h3>
            <p>
              AM = <b>{m.am} units</b>
            </p>
            <p>
              MB = <b>{m.mb} units</b>
            </p>
            <em>
              <CheckCircle2 /> Equal distances ✓
            </em>
          </aside>
        </section>
        <section className="mf10084-averages">
          <h2>HOW THE MIDPOINT IS COMPUTED (AVERAGE OF COORDINATES)</h2>
          <div>
            <article>
              <h3>x-coordinate (average of x₁ and x₂)</h3>
              <span>
                <b>{points.a.x}</b>
                <i />
                <strong>{m.m.x}</strong>
                <i />
                <b>{points.b.x}</b>
              </span>
            </article>
            <article>
              <h3>y-coordinate (average of y₁ and y₂)</h3>
              <span>
                <b>{points.b.y}</b>
                <i />
                <strong>{m.m.y}</strong>
                <i />
                <b>{points.a.y}</b>
              </span>
            </article>
          </div>
        </section>
        <section className="mf10084-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              The midpoint divides AB into two equal parts. Therefore, AM = MB
              and M lies exactly halfway on the segment.
            </p>
            <div className="mini">
              <b>A</b>
              <i />
              <strong>M</strong>
              <i />
              <b>B</b>
            </div>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Find the midpoint of A(−2,4) and B(6,−2).</p>
            <p>M((−2+6)/2, (4+(−2))/2)</p>
            <p>= M(4/2, 2/2) = (2,1)</p>
            <strong>So, the midpoint is M(2,1).</strong>
          </article>
          <article className="mistake">
            <h2>COMMON MISTAKE</h2>
            <p>Do not average x₁ with y₂ (or mix coordinates).</p>
            <p className="wrong">Incorrect: ((x₁+y₂)/2, (y₁+x₂)/2)</p>
            <p>Always average x with x and y with y.</p>
          </article>
        </section>
        <section className="mf10084-challenge">
          <h2>CHALLENGE: KEEP THE MIDPOINT FIXED</h2>
          <p>
            Move points A and B anywhere on the grid while keeping the midpoint
            fixed at M(2,1).
          </p>
          <aside>
            <p>Target midpoint</p>
            <strong>M(2,1)</strong>
            <p>Equal-distance required</p>
            <em>AM = MB</em>
          </aside>
          {graph("challenge", challenge, cm.m, challengeSvg)}
          <article>
            <h3>Your current values</h3>
            {(["a", "b"] as Key[]).map((key) => (
              <div key={key}>
                <b>{key.toUpperCase()}</b>
                <input
                  aria-label={`Challenge ${key.toUpperCase()} x`}
                  value={challenge[key].x}
                  type="number"
                  onChange={(e) =>
                    act(() =>
                      update("challenge", key, {
                        ...challenge[key],
                        x: +e.target.value,
                      }),
                    )
                  }
                />
                <input
                  aria-label={`Challenge ${key.toUpperCase()} y`}
                  value={challenge[key].y}
                  type="number"
                  onChange={(e) =>
                    act(() =>
                      update("challenge", key, {
                        ...challenge[key],
                        y: +e.target.value,
                      }),
                    )
                  }
                />
              </div>
            ))}
            <p>Computed midpoint</p>
            <strong>
              M({cm.m.x}, {cm.m.y})
            </strong>
            <em className={cm.m.x === 2 && cm.m.y === 1 ? "yes" : ""}>
              AM={cm.am} &nbsp; MB={cm.mb}
              <br />
              {cm.m.x === 2 && cm.m.y === 1
                ? "Midpoint fixed ✓"
                : "Move the opposite endpoint"}
            </em>
            <button onClick={reset}>
              <RotateCcw /> Reset all
            </button>
          </article>
        </section>
      </main>
      <nav className="mf10084-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-distance-formula">
          <ArrowLeft /> Previous
          <br />
          Distance Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-internal-section-formula">
          Next
          <br />
          Internal Section Formula <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
