import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RouteMapTargetLesson10038.css";

type Point = { x: number; y: number };
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const initialA = { x: 0, y: 0 },
  initialB = { x: 5, y: 4 };
const initialWaypoints = [
  { x: 3, y: 0 },
  { x: 3, y: 4 },
];
const distance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const routeDistance = (points: Point[]) =>
  points.slice(1).reduce((sum, p, i) => sum + distance(points[i], p), 0);
const turnCount = (points: Point[]) =>
  Math.max(
    0,
    points.slice(2).reduce((sum, p, i) => {
      const a = points[i],
        b = points[i + 1];
      return (
        sum + Number((b.x - a.x) * (p.y - b.y) !== (b.y - a.y) * (p.x - b.x))
      );
    }, 0),
  );
const key = (p: Point) => `${p.x},${p.y}`;

export default function RouteMapTargetLesson10038({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(initialA),
    [b, setB] = useState(initialB),
    [waypoints, setWaypoints] = useState(initialWaypoints);
  const [snap, setSnap] = useState(true),
    [showDistances, setShowDistances] = useState(true),
    [showTurns, setShowTurns] = useState(true);
  const [blocked, setBlocked] = useState([true, false, false, false]),
    [tab, setTab] = useState("Interact"),
    [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const [challenge, setChallenge] = useState(["", "", "", ""]),
    [challengeResult, setChallengeResult] = useState<
      "idle" | "correct" | "retry"
    >("idle"),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const points = [a, ...waypoints, b],
    total = routeDistance(points),
    turns = turnCount(points),
    direct = +Math.hypot(b.x - a.x, b.y - a.y).toFixed(1);
  const blockedSegment =
    blocked[0] &&
    points.some(
      (p, i) =>
        i &&
        ((key(points[i - 1]) === "2,2" && key(p) === "2,3") ||
          (key(points[i - 1]) === "2,3" && key(p) === "2,2")),
    );
  const valid =
    !blockedSegment &&
    points.every(
      (p, i) => !i || p.x === points[i - 1].x || p.y === points[i - 1].y,
    );
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setA(initialA);
      setB(initialB);
      setWaypoints(initialWaypoints);
      setSnap(true);
      setShowDistances(true);
      setShowTurns(true);
      setBlocked([true, false, false, false]);
      setTab("Interact");
      setChallenge(["", "", "", ""]);
      setChallengeResult("idle");
    });
  const pointFrom = (event: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current!.getBoundingClientRect();
    const rawX = (((event.clientX - r.left) / r.width) * 520 - 55) / 86;
    const rawY = (390 - ((event.clientY - r.top) / r.height) * 430) / 73;
    const normalize = (value: number, maximum: number) =>
      Math.max(
        0,
        Math.min(
          maximum,
          snap ? Math.round(value) : Math.round(value * 10) / 10,
        ),
      );
    return {
      x: normalize(rawX, 5),
      y: normalize(rawY, 4),
    };
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !event.currentTarget.hasPointerCapture(event.pointerId))
      return;
    const p = pointFrom(event);
    if (dragging === "A") setA(p);
    else setB(p);
    setActions((n) => n + 1);
  };
  const challengeLengths = [1, 1, 4, 2],
    challengeDistance = challenge.reduce(
      (sum, direction, index) =>
        sum + (direction ? challengeLengths[index] : 0),
      0,
    ),
    challengeTurns = challenge
      .slice(1)
      .reduce((n, d, i) => n + Number(d !== challenge[i]), 0);
  return (
    <section
      className="route10038-page"
      data-testid="school-mockup-0712"
      data-object-model="dedicated-draggable-waypoint-grid-route-reasoner"
      data-start={key(a)}
      data-end={key(b)}
      data-waypoints={waypoints.map(key).join(";")}
      data-distance={total}
      data-turns={turns}
      data-direct={direct}
      data-valid={valid}
      data-challenge-directions={challenge.join(",")}
      data-challenge-distance={challengeDistance}
      data-challenge-turns={challengeTurns}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="route10038-hero">
        <small>CLASS 8 - INFORMATION PROCESSING</small>
        <h1>Route Map Reasoning</h1>
        <p>
          <b>Objective:</b> Use distance, direction and constraints to reason
          about routes on a map.
        </p>
        <div>
          <span>18 min</span>
          <span>Foundation</span>
          <span>Concept</span>
          <span>Class 8</span>
          <span>Information Processing</span>
        </div>
        <Link to="/lessons/school">School lessons</Link>
      </header>
      <nav className="route10038-tabs">
        {tabs.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
            key={item}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="route10038-map-lab">
        <aside className="map-controls">
          <h3>CONTROLS</h3>
          <article>
            <b>Start</b>
            <span>
              A ({a.x} km, {a.y} km)
            </span>
          </article>
          <article>
            <b>End</b>
            <span>
              B ({b.x} km, {b.y} km)
            </span>
          </article>
          <label>
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => act(() => setSnap(e.target.checked))}
            />{" "}
            Snap to grid
          </label>
          <label>
            <input
              type="checkbox"
              checked={showDistances}
              onChange={(e) => act(() => setShowDistances(e.target.checked))}
            />{" "}
            Show distances
          </label>
          <label>
            <input
              type="checkbox"
              checked={showTurns}
              onChange={(e) => act(() => setShowTurns(e.target.checked))}
            />{" "}
            Show turn markers
          </label>
          <h3>BLOCKED ROADS</h3>
          {["E2-E3", "N1-N2", "E1-E2", "N3-N4"].map((name, i) => (
            <label key={name}>
              <input
                type="checkbox"
                checked={blocked[i]}
                onChange={(e) =>
                  act(() =>
                    setBlocked((v) =>
                      v.map((x, j) => (j === i ? e.target.checked : x)),
                    ),
                  )
                }
              />
              {name}
            </label>
          ))}
          <button className="map-reset" onClick={reset}>
            <RotateCcw size={13} /> Reset route
          </button>
          <div className="compass">
            <Compass />
            <b>N</b>
            <span>W</span>
            <span>E</span>
            <em>S</em>
          </div>
        </aside>
        <main>
          <svg
            ref={svgRef}
            viewBox="0 0 520 430"
            onPointerMove={move}
            onPointerUp={() => setDragging(null)}
            onClick={(e) => {
              if (!(e.target as Element).closest(".map-pin")) {
                const p = pointFrom(e);
                act(() => setWaypoints((v) => [...v, p]));
              }
            }}
            aria-label="Interactive route grid"
          >
            {[0, 1, 2, 3, 4, 5].map((x) => (
              <g key={x}>
                {[0, 1, 2, 3, 4].map((y) => (
                  <circle
                    className="grid-node"
                    key={y}
                    cx={55 + x * 86}
                    cy={390 - y * 73}
                    r="5"
                  />
                ))}
                <text x={55 + x * 86} y="418" textAnchor="middle">
                  {x}
                </text>
              </g>
            ))}
            {[0, 1, 2, 3, 4].map((y) => (
              <text x="25" y={394 - y * 73} key={y}>
                {y}
              </text>
            ))}
            <g className="grid-lines">
              {[0, 1, 2, 3, 4].map((y) => (
                <path key={y} d={`M55 ${390 - y * 73}H485`} />
              ))}
              {[0, 1, 2, 3, 4, 5].map((x) => (
                <path key={x} d={`M${55 + x * 86} 98V390`} />
              ))}
            </g>
            <path className="blocked" d="M227 244V171" />
            <polyline
              className="route-line"
              points={points
                .map((p) => `${55 + p.x * 86},${390 - p.y * 73}`)
                .join(" ")}
            />
            {showTurns &&
              points
                .slice(1, -1)
                .map((p, i) => (
                  <circle
                    className="turn"
                    key={i}
                    cx={55 + p.x * 86}
                    cy={390 - p.y * 73}
                    r="5"
                  />
                ))}
            {showDistances &&
              points.slice(1).map((p, i) => {
                const previous = points[i];
                return (
                  <text
                    className="segment-distance"
                    key={`d${i}`}
                    x={55 + ((p.x + previous.x) / 2) * 86}
                    y={382 - ((p.y + previous.y) / 2) * 73}
                  >
                    {distance(previous, p)} km
                  </text>
                );
              })}
            <MapPin
              p={a}
              label="A"
              onDown={(e) => {
                setDragging("A");
                e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
              }}
              onNudge={(dx, dy) =>
                act(() =>
                  setA((p) => ({
                    x: Math.max(0, Math.min(5, p.x + dx)),
                    y: Math.max(0, Math.min(4, p.y + dy)),
                  })),
                )
              }
            />
            <MapPin
              p={b}
              label="B"
              onDown={(e) => {
                setDragging("B");
                e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
              }}
              onNudge={(dx, dy) =>
                act(() =>
                  setB((p) => ({
                    x: Math.max(0, Math.min(5, p.x + dx)),
                    y: Math.max(0, Math.min(4, p.y + dy)),
                  })),
                )
              }
            />
          </svg>
          <footer>
            Drag A or B to new intersections. Click nodes to add waypoints.
            <button onClick={() => act(() => setWaypoints([]))}>
              <Trash2 /> Clear route
            </button>
          </footer>
        </main>
      </section>
      <section className="route10038-summary">
        <aside>
          <h3>LEGEND</h3>
          <p>Your route</p>
          <p>Open road</p>
          <p>Closed road</p>
          <p>Start / Goal</p>
        </aside>
        <article>
          <h2>YOUR ROUTE (CURRENT)</h2>
          <div className="route-path">
            A{" "}
            {points.slice(1).map((p, i) => (
              <span key={i}>
                {" "}
                to ({p.x},{p.y})
              </span>
            ))}
          </div>
          <div>
            <b>
              Total distance<strong>{total} km</strong>
            </b>
            <b>
              Turns<strong>{turns}</strong>
            </b>
            <b>
              Valid?<strong>{valid ? "Yes" : "No"}</strong>
            </b>
          </div>
          <p className={valid ? "ok" : "bad"}>
            {valid
              ? "Valid route: all direction and distance constraints are satisfied."
              : "Route crosses a blocked road or contains a diagonal segment."}
          </p>
        </article>
        <article>
          <h2>COMPARE ROUTES</h2>
          <p>
            <b>Route A (current)</b>
            <span>
              {total} km / {turns} turns
            </span>
          </p>
          <p>
            <b>Route B (direct)</b>
            <span>{direct} km / 0 turns</span>
          </p>
          <strong>Shortest distance is not always fewest turns.</strong>
        </article>
      </section>
      <section className="route10038-rule">
        <article>
          <h2>Mathematical Rule</h2>
          <p>
            A valid route must satisfy every direction and distance constraint;
            smallest distance is not always fewest turns.
          </p>
        </article>
        <article>
          <h2>Warning</h2>
          <p>
            Measuring displacement instead of total path length understates a
            route.
          </p>
        </article>
      </section>
      <section className="route10038-theory">
        <article>
          <h2>WHY IT WORKS</h2>
          {[
            "Each road segment has a defined direction.",
            "Total distance is the sum of every segment.",
            "Turns occur only at intersections.",
            "Closed roads cannot be used.",
            "Both direction and distance constraints must be met.",
          ].map((x) => (
            <p key={x}>
              <CheckCircle2 /> {x}
            </p>
          ))}
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Compare the grid route with the straight displacement.</p>
          <table>
            <tbody>
              <tr>
                <th>Route</th>
                <th>Distance</th>
                <th>Turns</th>
              </tr>
              <tr>
                <td>A</td>
                <td>{total}</td>
                <td>{turns}</td>
              </tr>
              <tr>
                <td>B</td>
                <td>{direct}</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article className="warning">
          <h2>COMMON MISCONCEPTION</h2>
          <p>Thinking displacement equals distance.</p>
          <p>
            Always add the lengths of the path segments you actually travel.
          </p>
        </article>
      </section>
      <section className="route10038-challenge">
        <header>
          <h2>MINI CHALLENGE</h2>
          <p>
            Build a route that is 8 km, uses exactly three turns and avoids the
            closed road.
          </p>
        </header>
        <article>
          <h3>Your route</h3>
          <div>
            {challenge.map((d, i) => (
              <select
                aria-label={`Challenge direction ${i + 1}`}
                value={d}
                onChange={(e) =>
                  act(() => {
                    setChallenge((v) =>
                      v.map((x, j) => (j === i ? e.target.value : x)),
                    );
                    setChallengeResult("idle");
                  })
                }
                key={i}
              >
                {["", "N", "E", "S", "W"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ))}
          </div>
          <button
            onClick={() =>
              act(() =>
                setChallengeResult(
                  challenge.every(Boolean) &&
                    challengeDistance === 8 &&
                    challengeTurns === 3
                    ? "correct"
                    : "retry",
                ),
              )
            }
          >
            Check answer
          </button>
        </article>
        <article>
          <h3>Hints</h3>
          <p>You need four segments.</p>
          <p>Total distance must be 8 km.</p>
          <p>Use exactly three turns.</p>
        </article>
        <article>
          <h3>Solution</h3>
          <p>1N to 1E to 4N to 2E</p>
          <strong className={challengeResult}>
            {challengeResult === "correct"
              ? "Correct route."
              : challengeResult === "retry"
                ? "Adjust the distance or turns."
                : "Distance and turns are calculated live."}
          </strong>
        </article>
      </section>
      <nav className="route10038-adjacent">
        <Link to="/lessons/school/class-8/class-8-information-processing-magic-squares">
          <ArrowLeft /> Previous: Magic Squares
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-8/class-8-information-processing-tabular-pattern-completion"
        >
          Next: Tabular Pattern Completion <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function MapPin({
  p,
  label,
  onDown,
  onNudge,
}: {
  p: Point;
  label: string;
  onDown: (e: PointerEvent<SVGGElement>) => void;
  onNudge: (dx: number, dy: number) => void;
}) {
  return (
    <g
      className={`map-pin ${label}`}
      role="slider"
      aria-label={`${label} map point`}
      tabIndex={0}
      transform={`translate(${55 + p.x * 86} ${390 - p.y * 73})`}
      onPointerDown={onDown}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onNudge(1, 0);
        if (event.key === "ArrowLeft") onNudge(-1, 0);
        if (event.key === "ArrowUp") onNudge(0, 1);
        if (event.key === "ArrowDown") onNudge(0, -1);
      }}
    >
      <path d="M0 0c-18-20-12-38 0-38s18 18 0 38Z" />
      <text y="-20" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
