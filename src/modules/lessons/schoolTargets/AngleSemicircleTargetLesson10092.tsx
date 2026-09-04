import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleSemicircleTargetLesson10092.css";

const RADIUS = 6.31;
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function AngleSemicircleTargetLesson10092({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [theta, setTheta] = useState(68);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [direction, setDirection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setPoint = (value: number) =>
    setTheta(Math.max(12, Math.min(168, value)));

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTheta((value) => {
        const next = value + direction * speed;
        if (next >= 168) {
          setDirection(-1);
          return 168;
        }
        if (next <= 12) {
          setDirection(1);
          return 12;
        }
        return next;
      });
    }, 55);
    return () => window.clearInterval(timer);
  }, [direction, playing, speed]);

  const radians = (theta * Math.PI) / 180;
  const point = {
    x: round(RADIUS * Math.cos(radians)),
    y: round(RADIUS * Math.sin(radians)),
  };
  const angleA = round(theta / 2);
  const angleB = round(90 - theta / 2);
  const angleC = 90;
  const acExact = 2 * RADIUS * Math.sin(radians / 2);
  const bcExact = 2 * RADIUS * Math.cos(radians / 2);
  const ac = round(acExact);
  const bc = round(bcExact);
  const diameter = round(2 * RADIUS);
  const lhs = round(acExact * acExact + bcExact * bcExact);
  const rhs = round((2 * RADIUS) ** 2);
  const verified = Math.abs(lhs - rhs) < 0.001;
  const cx = 344,
    cy = 256,
    scale = 40,
    rr = RADIUS * scale;
  const a = { x: cx - rr, y: cy };
  const b = { x: cx + rr, y: cy };
  const c = { x: cx + point.x * scale, y: cy - point.y * scale };

  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 688 - cx;
    const y = cy - ((event.clientY - box.top) / box.height) * 535;
    let degrees = (Math.atan2(y, x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    if (degrees <= 180) setPoint(degrees);
  };
  const reset = () =>
    act(() => {
      setTheta(68);
      setPlaying(false);
      setSpeed(2);
      setDirection(1);
    });

  return (
    <section
      className="ais10092-page"
      data-testid="school-mockup-0766"
      data-object-model="dedicated-diameter-semicircle-right-angle-engine"
      data-theta={round(theta)}
      data-c={`${point.x},${point.y}`}
      data-angle-a={angleA}
      data-angle-b={angleB}
      data-angle-c={angleC}
      data-pythagorean={String(verified)}
      data-playing={String(playing)}
      data-actions={actions}
    >
      <header className="ais10092-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angle in a Semicircle</h1>
        <p>
          The angle subtended by a diameter at any point on the circle is a
          right angle (90°).
        </p>
        <div>
          <span>24 min</span>
          <span>INTERMEDIATE</span>
          <span>VISUAL EXPLORATION</span>
          <span>NCERT 10.2</span>
          <span>Geometry</span>
        </div>
      </header>

      <nav className="ais10092-tabs">
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
        <section className="ais10092-lab">
          <aside>
            <h2>DRAG &amp; EXPLORE</h2>
            <p>Drag point C anywhere on the semicircle.</p>
            <strong className="result">Result: ∠ACB is always 90°.</strong>
            <h3>Measurements</h3>
            <dl>
              <div>
                <dt>∠ACB (at C)</dt>
                <dd>{angleC.toFixed(2)}°</dd>
              </div>
              <div>
                <dt>∠CAB (at A)</dt>
                <dd>{angleA.toFixed(2)}°</dd>
              </div>
              <div>
                <dt>∠CBA (at B)</dt>
                <dd>{angleB.toFixed(2)}°</dd>
              </div>
            </dl>
            <h3>Lengths</h3>
            <p className="math">
              AC = {ac.toFixed(2)}
              <br />
              BC = {bc.toFixed(2)}
              <br />
              AB (diameter) = {diameter.toFixed(2)}
            </p>
            <p className="math">
              AC² + BC² = {round(acExact * acExact)} +{" "}
              {round(bcExact * bcExact)} = {lhs}
            </p>
            <p className="math">
              AB² = {diameter.toFixed(2)}² = {rhs}
            </p>
            <div className="verified">
              <CheckCircle2 />
              <b>Right triangle verified!</b>
              <span>AC² + BC² = AB²</span>
            </div>
          </aside>

          <article>
            <svg
              ref={svgRef}
              viewBox="0 0 688 535"
              aria-label="Angle in a semicircle interactive diagram"
              onPointerMove={(event) => dragging && updateFromPointer(event)}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <defs>
                <pattern
                  id="ais-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M40 0H0V40" />
                </pattern>
              </defs>
              <rect
                className="grid"
                width="688"
                height="535"
                fill="url(#ais-grid)"
              />
              <line className="axis" x1="35" y1={cy} x2="655" y2={cy} />
              <circle className="circle" cx={cx} cy={cy} r={rr} />
              <line className="triangle" x1={a.x} y1={a.y} x2={c.x} y2={c.y} />
              <line className="triangle" x1={c.x} y1={c.y} x2={b.x} y2={b.y} />
              <line className="diameter" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <line className="radius" x1={cx} y1={cy} x2={c.x} y2={c.y} />
              <path
                className="angle angle-a"
                d={`M${a.x + 38} ${a.y} A38 38 0 0 0 ${a.x + 30} ${a.y - 24}`}
              />
              <path
                className="angle angle-b"
                d={`M${b.x - 38} ${b.y} A38 38 0 0 1 ${b.x - 24} ${b.y - 30}`}
              />
              <polyline
                className="right-mark"
                points={`${c.x - 16},${c.y + 20} ${c.x + 4},${c.y + 34} ${c.x + 19},${c.y + 15}`}
              />
              <circle className="center" cx={cx} cy={cy} r="5" />
              <circle className="point" cx={a.x} cy={a.y} r="6" />
              <circle className="point" cx={b.x} cy={b.y} r="6" />
              <circle
                className="point draggable"
                cx={c.x}
                cy={c.y}
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Point C on semicircle"
                aria-valuemin={12}
                aria-valuemax={168}
                aria-valuenow={round(theta)}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setPoint(theta + 2));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setPoint(theta - 2));
                  }
                }}
              />
              <text x={a.x} y={a.y + 30}>
                A (−{RADIUS}, 0)
              </text>
              <text x={b.x - 78} y={b.y + 30}>
                B ({RADIUS}, 0)
              </text>
              <text className="label-c" x={c.x + 8} y={c.y - 14}>
                C ({point.x}, {point.y})
              </text>
              <text x={cx - 24} y={cy + 28}>
                O (0, 0)
              </text>
              <text className="angle-a-text" x={a.x + 60} y={a.y - 27}>
                {angleA.toFixed(2)}°
              </text>
              <text className="angle-b-text" x={b.x - 105} y={b.y - 27}>
                {angleB.toFixed(2)}°
              </text>
              <text className="angle-c-text" x={c.x - 18} y={c.y + 58}>
                90.00°
              </text>
            </svg>
            <footer>
              <span>
                <i className="blue" /> Triangle ACB
              </span>
              <span>
                <i className="dash" /> Radii: OA, OB, OC
              </span>
              <span>
                <i /> Circle (radius OA)
              </span>
            </footer>
          </article>
        </section>

        <section className="ais10092-animation">
          <b>Animation</b>
          <button
            aria-label={playing ? "Pause auto-drag" : "Start auto-drag"}
            onClick={() => act(() => setPlaying(!playing))}
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <span>Auto-drag C</span>
          <input
            aria-label="Point C position"
            type="range"
            min="12"
            max="168"
            value={theta}
            onChange={(event) => act(() => setPoint(+event.target.value))}
          />
          <div>
            {[1, 2, 4].map((value, index) => (
              <button
                key={value}
                className={speed === value ? "active" : ""}
                onClick={() => act(() => setSpeed(value))}
              >
                {["Slow", "Medium", "Fast"][index]}
              </button>
            ))}
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </section>

        <section className="ais10092-cards">
          <article>
            <h2>WHY IT WORKS (PROOF IDEA)</h2>
            <ol>
              <li>
                Join OC. Since OA = OC and OB = OC, triangles AOC and BOC are
                isosceles.
              </li>
              <li>Let ∠CAO = ∠ACO = α and ∠CBO = ∠OCB = β.</li>
              <li>Angles around O give 2(α + β) = 180°.</li>
              <li>Therefore α + β = 90°.</li>
            </ol>
            <strong>
              <CheckCircle2 /> Therefore, ∠ACB = 90°.
            </strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Given:</b> Circle with centre O(0,0), radius 7.
              <br />
              Diameter AB with A(−7,0), B(7,0).
            </p>
            <div className="mini-circle">
              <span>C</span>
              <i />
              <b>A</b>
              <b>O</b>
              <b>B</b>
            </div>
            <p className="answers">
              ∠ACB = 90.00°
              <br />
              ∠CAB + ∠CBA = 90.00°
            </p>
            <b>Check: AC² + BC² = AB² ✓</b>
          </article>
          <article className="warning">
            <h2>
              <AlertTriangle /> DON’T GET TRICKED!
            </h2>
            <p>
              If AB is not a diameter (just a chord), ∠ACB is <b>not</b> 90°.
            </p>
            <div className="wrong-circle">
              <i />
              <i />
              <i />
            </div>
            <p>The right angle happens only when AB is a diameter.</p>
            <strong>Rule: Must be a diameter.</strong>
          </article>
        </section>

        <section className="ais10092-bottom">
          <article>
            <h2>YOUR CHALLENGE</h2>
            <p>
              Drag point C around the semicircle and try to keep ∠ACB = 90°.
            </p>
            <div className="target">
              <span>Target</span>
              <b>90°</b>
              <span>Current</span>
              <b>{angleC.toFixed(2)}°</b>
              <em>Great! You nailed it.</em>
            </div>
          </article>
          <article>
            <h2>WHAT YOU DISCOVERED</h2>
            <p>
              <CheckCircle2 /> For any point C on the semicircle with diameter
              AB, ∠ACB is always 90°.
            </p>
            <p>
              <CheckCircle2 /> This is the <b>Angle in a Semicircle</b> theorem.
            </p>
            <p>
              <CheckCircle2 /> The result follows from both circle geometry and
              Pythagoras.
            </p>
          </article>
        </section>
        <nav className="ais10092-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-subtended-by-an-arc">
            <ArrowLeft /> Angle Subtended by an Arc
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral">
            Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
