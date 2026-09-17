import {
  ArrowLeft,
  ArrowRight,
  Check,
  Magnet,
  Move,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CorrespondingAnglesTargetLesson10060.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const pairs = [
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
] as const;
const tabs = ["⚗ Interact", "▣ Learn", "□ Example", "π Formula", "✎ Practice"];
const tools = [
  {
    id: "drag",
    icon: Move,
    title: "Drag lines",
    detail: "Move lines to change angles",
  },
  {
    id: "rotate",
    icon: RotateCw,
    title: "Rotate transversal",
    detail: "Click & drag the slanted line",
  },
  {
    id: "parallel",
    icon: Magnet,
    title: "Snap to parallel",
    detail: "Make lines parallel",
  },
] as const;

const TOP_X = 310;
const TOP_Y = 170;
const BOTTOM_Y = 410;
const VIEW_W = 600;
const VIEW_H = 560;
const WEDGE_R = 32;

function clampAngle(value: number) {
  return Math.max(5, Math.min(175, Math.round(value)));
}

function clampTilt(value: number) {
  return Math.max(-32, Math.min(32, value));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function polar(cx: number, cy: number, mathDeg: number, radius: number) {
  return {
    x: cx + radius * Math.cos(toRad(mathDeg)),
    y: cy - radius * Math.sin(toRad(mathDeg)),
  };
}

function transUpDeg(angle1: number, skew: number) {
  return skew + 180 - angle1;
}

function fourAngles(skew: number, transUp: number) {
  const first = clampAngle(180 + skew - transUp);
  const second = 180 - first;
  return [first, second, second, first] as const;
}

function extendLine(cx: number, cy: number, mathDeg: number, span: number) {
  const a = polar(cx, cy, mathDeg, span);
  const b = polar(cx, cy, mathDeg + 180, span);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

function piePath(
  cx: number,
  cy: number,
  fromDeg: number,
  toDeg: number,
  radius: number,
  sweep: 0 | 1,
) {
  const start = polar(cx, cy, fromDeg, radius);
  const end = polar(cx, cy, toDeg, radius);
  const delta = Math.abs(((toDeg - fromDeg) % 360 + 360) % 360);
  const large = delta > 180 ? 1 : 0;
  return `M${cx} ${cy} L${start.x} ${start.y} A${radius} ${radius} 0 ${large} ${sweep} ${end.x} ${end.y} Z`;
}

function intersectionAtY(
  originX: number,
  originY: number,
  mathDeg: number,
  y: number,
) {
  const sin = Math.sin(toRad(mathDeg));
  if (Math.abs(sin) < 0.001) return { x: originX, y };
  const t = (originY - y) / sin;
  return polar(originX, originY, mathDeg, t);
}

function svgCoords(svg: SVGSVGElement, event: ReactPointerEvent) {
  const matrix = svg.getScreenCTM();
  if (!matrix) {
    const box = svg.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * VIEW_W,
      y: ((event.clientY - box.top) / box.height) * VIEW_H,
    };
  }
  return new DOMPoint(event.clientX, event.clientY).matrixTransform(
    matrix.inverse(),
  );
}

function upwardDirection(dx: number, dyMath: number) {
  let dir = (Math.atan2(dyMath, dx) * 180) / Math.PI;
  if (Math.sin(toRad(dir)) < 0) dir += 180;
  dir = ((dir % 360) + 360) % 360;
  if (dir > 180) dir -= 180;
  return dir;
}

export default function CorrespondingAnglesTargetLesson10060({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(64);
  const [skew, setSkew] = useState(0);
  const [skewM, setSkewM] = useState(0);
  const [tool, setTool] = useState("drag");
  const [labels, setLabels] = useState(true);
  const [measures, setMeasures] = useState(true);
  const [highlights, setHighlights] = useState(true);
  const [tab, setTab] = useState(0);
  const [selectedPairs, setSelectedPairs] = useState<number[]>([0, 1, 2, 3]);
  const [actions, setActions] = useState(0);
  const acute = clampAngle(angle);
  const transUp = transUpDeg(acute, skew);
  const topAngles = fourAngles(skew, transUp);
  const bottomAngles = fourAngles(skewM, transUp);
  const values = [...topAngles, ...bottomAngles];
  const parallel = Math.abs(skew - skewM) < 0.5;
  const allEqual = pairs.every(([a, b]) => values[a - 1] === values[b - 1]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const snapParallel = () => {
    setSkew(0);
    setSkewM(0);
    setTool("parallel");
  };
  const reset = () =>
    act(() => {
      setAngle(64);
      setSkew(0);
      setSkewM(0);
      setTool("drag");
      setLabels(true);
      setMeasures(true);
      setHighlights(true);
      setSelectedPairs([0, 1, 2, 3]);
    });
  return (
    <section
      className="ca10060-page"
      data-testid="school-mockup-0734"
      data-dedicated-lesson="10060"
      data-object-model="dedicated-two-line-transversal-correspondence-parallel-test-engine"
      data-angle={acute}
      data-values={values.join(",")}
      data-parallel={String(parallel)}
      data-tool={tool}
      data-selected-pairs={selectedPairs.join(",")}
      data-valid={String(allEqual)}
      data-actions={actions}
    >
      <header className="ca10060-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Corresponding Angles</h1>
        <p>
          Identify corresponding angle positions and use them to test parallel
          lines.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="ca10060-tabs">
        {tabs.map((item, index) => (
          <button
            key={item}
            className={tab === index ? "active" : ""}
            aria-selected={tab === index}
            onClick={() => act(() => setTab(index))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="ca10060-explorer">
          <header>
            <div>
              <h2>Two-Line Transversal Explorer</h2>
              <p>Drag the lines to explore corresponding angles.</p>
            </div>
            <strong className={allEqual ? "correct" : "incorrect"}>
              <Check /> LIVE CHECK: {allEqual ? "CORRECT" : "NOT PARALLEL"}
            </strong>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="ca10060-work">
            <aside>
              <h3>TOOLS</h3>
              {tools.map(({ id, icon: Icon, title, detail }) => (
                <button
                  key={id}
                  type="button"
                  className={tool === id ? "active" : ""}
                  aria-pressed={tool === id}
                  onClick={() =>
                    act(() => {
                      if (id === "parallel") snapParallel();
                      else setTool(id);
                    })
                  }
                >
                  <Icon aria-hidden="true" />
                  <span>
                    <b>{title}</b>
                    <small>{detail}</small>
                  </span>
                </button>
              ))}
              <h3>SHOW / HIDE</h3>
              <Toggle label="Angle numbers" value={labels} change={setLabels} />
              <Toggle
                label="Angle measures"
                value={measures}
                change={setMeasures}
              />
              <Toggle
                label="Corresponding highlights"
                value={highlights}
                change={setHighlights}
              />
              <h3>ANGLE MEASURE</h3>
              <label>
                Set ∠1 <b>{acute}°</b>
                <input
                  aria-label="Set angle one"
                  type="range"
                  min="5"
                  max="175"
                  value={acute}
                  onChange={(e) => act(() => setAngle(+e.target.value))}
                />
              </label>
            </aside>
            <article>
              <TransversalDiagram
                angle={acute}
                skew={skew}
                skewM={skewM}
                tool={tool}
                labels={labels}
                measures={measures}
                highlights={highlights}
                onAngle={(value) => act(() => setAngle(value))}
                onTiltL={(nextSkew, nextAngle) =>
                  act(() => {
                    setSkew(nextSkew);
                    setAngle(nextAngle);
                    setTool("drag");
                  })
                }
                onTiltM={(nextSkew) =>
                  act(() => {
                    setSkewM(nextSkew);
                    setTool("drag");
                  })
                }
              />
              <CorrespondenceLegend />
            </article>
          </div>
          <div className="ca10060-checks">
            <section>
              <h3>CORRESPONDING CHECK</h3>
              <p>All four corresponding pairs are equal.</p>
              <div>
                {pairs.map(([a, b]) => (
                  <span
                    key={a}
                    className={values[a - 1] === values[b - 1] ? "ok" : "bad"}
                  >
                    <Check /> ∠{a} = ∠{b}
                    <b>
                      {values[a - 1]}° = {values[b - 1]}°
                    </b>
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h3>♻ PARALLEL TEST</h3>
              <b>Lines ℓ and m are {allEqual ? "parallel" : "not parallel"}.</b>
              <p>Corresponding angles are {allEqual ? "equal" : "unequal"}.</p>
              <i>#</i>
            </section>
          </div>
          <div className="ca10060-results">
            {pairs.map(([a, b]) => (
              <span key={a}>
                ∠{a} (and ∠{b})<b>{values[a - 1]}°</b>
              </span>
            ))}
            <span className="conclusion">
              <b>CONCLUSION</b>
              <strong>{allEqual ? "ℓ ∥ m" : "ℓ ∦ m"}</strong>
              <small>
                ({allEqual ? "Lines are parallel" : "Adjust the lines"})
              </small>
            </span>
          </div>
        </section>
        <section className="ca10060-theory">
          <article>
            <h2>💡 WHY IT WORKS</h2>
            <p>When two parallel lines are cut by a transversal:</p>
            <p>
              <Check /> Corresponding angles occupy the same relative position.
            </p>
            <p>
              <Check /> Their measures are equal.
            </p>
            <p>Converse also true:</p>
            <p>
              <Check /> If corresponding angles are equal, then the lines are
              parallel.
            </p>
            <button onClick={() => act(() => setTab(3))}>⌁ View Formula</button>
          </article>
          <article>
            <h2>▣ WORKED EXAMPLE</h2>
            <h3>If ∠1 = 64°, what is ∠5?</h3>
            <p>Since ∠1 and ∠5 are corresponding angles,</p>
            <strong>∠1 = ∠5</strong>
            <p>
              Therefore, <b>∠5 = 64°.</b>
            </p>
            <MiniTransversal />
          </article>
          <article className="warning">
            <h2>△ COMMON MISCONCEPTION</h2>
            <h3>
              Angles on the same side of the transversal are not automatically
              corresponding.
            </h3>
            <p>Position matters!</p>
            <MiniTransversal wrong />
            <p>
              ∠1 and ∠3 are on the same side but are not corresponding angles.
            </p>
          </article>
        </section>
        <section className="ca10060-challenge">
          <h2>🏆 CHALLENGE</h2>
          <p>
            Select all four corresponding pairs, then make one pair equal to
            force the lines to be parallel.
          </p>
          <div>
            <ol>
              <li>Select corresponding pairs.</li>
              <li>Adjust any one angle to make its pair equal.</li>
            </ol>
            <section>
              <b>PROGRESS</b>
              <span>{selectedPairs.length}/4 pairs selected</span>
              <div>
                {pairs.map((pair, i) => (
                  <button
                    key={i}
                    className={selectedPairs.includes(i) ? "chosen" : ""}
                    aria-label={`Select pair ${pair[0]} and ${pair[1]}`}
                    onClick={() =>
                      act(() =>
                        setSelectedPairs((current) =>
                          current.includes(i)
                            ? current.filter((x) => x !== i)
                            : [...current, i],
                        ),
                      )
                    }
                  >
                    <Check />
                  </button>
                ))}
              </div>
            </section>
            <section>
              <b>STATUS</b>
              <strong>
                {selectedPairs.length === 4 && allEqual
                  ? "☑ Parallel!!"
                  : "Keep working"}
              </strong>
              <span>
                {selectedPairs.length === 4 && allEqual
                  ? "Great job!"
                  : "Select and align all pairs."}
              </span>
            </section>
          </div>
        </section>
      </main>
      <nav className="ca10060-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-linear-pair-axiom-and-converse">
          <ArrowLeft /> Previous: Basic Angle Pairs
        </Link>
        <Link to="/lessons/school">
          Next: Alternate Interior Angles <ArrowRight />
        </Link>
      </nav>
      <LessonTopicStudyBoard lessonId={10060} view={tab} />

    </section>
  );
}

function Toggle({
  label,
  value,
  change,
}: {
  label: string;
  value: boolean;
  change: (value: boolean) => void;
}) {
  return (
    <label className="ca10060-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => change(e.target.checked)}
      />
      <i />
    </label>
  );
}
function CorrespondenceLegend() {
  return (
    <aside className="ca10060-legend">
      <h3>
        CORRESPONDING
        <br />
        ANGLE PAIRS
      </h3>
      {pairs.map(([a, b], i) => (
        <p key={a}>
          <i className={`c${i}`} />({a}, {b})
        </p>
      ))}
    </aside>
  );
}
function TransversalDiagram({
  angle,
  skew,
  skewM,
  tool,
  labels,
  measures,
  highlights,
  onAngle,
  onTiltL,
  onTiltM,
}: {
  angle: number;
  skew: number;
  skewM: number;
  tool: string;
  labels: boolean;
  measures: boolean;
  highlights: boolean;
  onAngle: (value: number) => void;
  onTiltL: (nextSkew: number, nextAngle: number) => void;
  onTiltM: (nextSkew: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"rotate" | "lineL" | "lineM" | null>(null);
  const transUp = transUpDeg(angle, skew);
  const top = { x: TOP_X, y: TOP_Y };
  const bottom = intersectionAtY(TOP_X, TOP_Y, transUp, BOTTOM_Y);
  const lineL = extendLine(top.x, top.y, skew, 280);
  const lineM = extendLine(bottom.x, bottom.y, skewM, 280);
  const trans = extendLine(top.x, top.y, transUp, 420);
  const handle = polar(top.x, top.y, transUp, 148);
  const handleB = polar(bottom.x, bottom.y, transUp + 180, 70);
  const lineLeft = skew + 180;
  const lineRight = skew;
  const lineMLeft = skewM + 180;
  const bottomAngles = fourAngles(skewM, transUp);
  const wedges = [
    piePath(top.x, top.y, lineLeft, transUp, WEDGE_R, 1),
    piePath(top.x, top.y, transUp, lineRight, WEDGE_R, 1),
    piePath(top.x, top.y, lineLeft, transUp + 180, WEDGE_R, 0),
    piePath(top.x, top.y, transUp + 180, lineRight, WEDGE_R, 1),
    piePath(bottom.x, bottom.y, lineMLeft, transUp, WEDGE_R, 1),
    piePath(bottom.x, bottom.y, transUp, skewM, WEDGE_R, 1),
    piePath(bottom.x, bottom.y, lineMLeft, transUp + 180, WEDGE_R, 0),
    piePath(bottom.x, bottom.y, transUp + 180, skewM, WEDGE_R, 1),
  ];
  const labelAt = (
    cx: number,
    cy: number,
    fromDeg: number,
    span: number,
    sweepCW: boolean,
  ) => {
    const bisect = fromDeg + (sweepCW ? -span / 2 : span / 2);
    return polar(cx, cy, bisect, 58);
  };
  const numberPts = [
    labelAt(top.x, top.y, lineLeft, angle, true),
    labelAt(top.x, top.y, transUp, 180 - angle, true),
    labelAt(top.x, top.y, lineLeft, 180 - angle, false),
    labelAt(top.x, top.y, transUp + 180, angle, true),
    labelAt(bottom.x, bottom.y, lineMLeft, bottomAngles[0], true),
    labelAt(bottom.x, bottom.y, transUp, bottomAngles[1], true),
    labelAt(bottom.x, bottom.y, lineMLeft, bottomAngles[1], false),
    labelAt(bottom.x, bottom.y, transUp + 180, bottomAngles[0], true),
  ];
  const measure1 = polar(top.x, top.y, lineLeft - angle / 2, 92);
  const measure2 = polar(top.x, top.y, transUp - (180 - angle) / 2, 92);

  const rotateFromPointer = (event: ReactPointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const point = svgCoords(svg, event);
    const nextUp = upwardDirection(point.x - top.x, top.y - point.y);
    onAngle(clampAngle(180 + skew - nextUp));
  };
  const tiltFromPointer = (
    event: ReactPointerEvent,
    origin: { x: number; y: number },
    which: "l" | "m",
  ) => {
    const svg = svgRef.current;
    if (!svg) return;
    const point = svgCoords(svg, event);
    let dir = (Math.atan2(origin.y - point.y, point.x - origin.x) * 180) / Math.PI;
    if (dir > 90) dir -= 180;
    if (dir < -90) dir += 180;
    const next = Math.round(clampTilt(dir) * 10) / 10;
    if (which === "l") onTiltL(next, clampAngle(180 + next - transUp));
    else onTiltM(next);
  };
  const beginDrag =
    (mode: "rotate" | "lineL" | "lineM") =>
    (event: ReactPointerEvent<SVGElement>) => {
      event.preventDefault();
      event.stopPropagation();
      drag.current = mode;
      svgRef.current?.setPointerCapture(event.pointerId);
      if (mode === "rotate") rotateFromPointer(event);
      if (mode === "lineL") tiltFromPointer(event, top, "l");
      if (mode === "lineM") tiltFromPointer(event, bottom, "m");
    };
  const moveDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    if (event.buttons !== 1 && event.pointerType !== "touch") return;
    if (drag.current === "rotate") rotateFromPointer(event);
    if (drag.current === "lineL") tiltFromPointer(event, top, "l");
    if (drag.current === "lineM") tiltFromPointer(event, bottom, "m");
  };
  const endDrag = (event: ReactPointerEvent<SVGElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const onCanvasDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool !== "rotate") return;
    if ((event.target as Element).closest(".hit, .handle")) return;
    beginDrag("rotate")(event);
  };

  return (
    <svg
      ref={svgRef}
      className="ca10060-diagram"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      aria-label="Interactive corresponding angles diagram"
      onPointerDown={onCanvasDown}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <defs>
        <pattern
          id="ca-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V24" />
        </pattern>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="url(#ca-grid)" />
      <g className={highlights ? "angles shown" : "angles"}>
        {wedges.map((d, i) => (
          <path key={i} className={`a${i}`} d={d} />
        ))}
      </g>
      <line className="line top" {...lineL} />
      <line className="line bottom" {...lineM} />
      <line className="transversal" {...trans} />
      <line
        className="hit"
        {...lineL}
        aria-label="Move line ℓ"
        role="slider"
        tabIndex={0}
        aria-valuemin={-32}
        aria-valuemax={32}
        aria-valuenow={Math.round(skew)}
        onPointerDown={beginDrag("lineL")}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            const next = clampTilt(skew + 2);
            onTiltL(next, clampAngle(180 + next - transUp));
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = clampTilt(skew - 2);
            onTiltL(next, clampAngle(180 + next - transUp));
          }
        }}
      />
      <line
        className="hit"
        {...lineM}
        aria-label="Move line m"
        role="slider"
        tabIndex={0}
        aria-valuemin={-32}
        aria-valuemax={32}
        aria-valuenow={Math.round(skewM)}
        onPointerDown={beginDrag("lineM")}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onTiltM(clampTilt(skewM + 2));
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onTiltM(clampTilt(skewM - 2));
          }
        }}
      />
      <line className="hit" {...trans} onPointerDown={beginDrag("rotate")} />
      <circle
        className="handle"
        cx={handle.x}
        cy={handle.y}
        r="14"
        role="slider"
        tabIndex={0}
        aria-label="Rotate transversal"
        aria-valuemin={5}
        aria-valuemax={175}
        aria-valuenow={angle}
        aria-valuetext={`Angle 1 is ${angle} degrees`}
        onPointerDown={beginDrag("rotate")}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            onAngle(clampAngle(angle + 1));
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            onAngle(clampAngle(angle - 1));
          }
        }}
      />
      <circle
        className="handle"
        cx={handleB.x}
        cy={handleB.y}
        r="11"
        aria-hidden="true"
        onPointerDown={beginDrag("rotate")}
      />
      {labels &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => {
          const point = numberPts[i];
          if (!point) return null;
          return (
            <text key={n} x={point.x} y={point.y + 5}>
              {n}
            </text>
          );
        })}
      {measures && (
        <>
          <text className="measure" x={measure1.x} y={measure1.y}>
            {angle}°
          </text>
          <text className="measure alt" x={measure2.x} y={measure2.y}>
            {180 - angle}°
          </text>
        </>
      )}
      <text className="name" x={lineL.x1 < lineL.x2 ? lineL.x1 - 4 : lineL.x2 - 4} y={top.y - 12}>
        ℓ
      </text>
      <text className="name" x={lineM.x1 < lineM.x2 ? lineM.x1 - 4 : lineM.x2 - 4} y={bottom.y - 12}>
        m
      </text>
      <text className="name" x={handle.x + 10} y={handle.y - 8}>
        t
      </text>
    </svg>
  );
}
function MiniTransversal({ wrong = false }: { wrong?: boolean }) {
  return (
    <svg className="ca10060-mini" viewBox="0 0 220 150">
      <line x1="10" y1="45" x2="210" y2="45" />
      <line x1="10" y1="115" x2="210" y2="115" />
      <line x1="95" y1="145" x2="135" y2="5" />
      <path d="M120 45H92A28 28 0 0 1 128 18Z" />
      <path
        className={wrong ? "wrong" : "pair"}
        d={
          wrong
            ? "M105 115H77A28 28 0 0 1 112 88Z"
            : "M105 115H77A28 28 0 0 1 112 88Z"
        }
      />
      <text x="80" y="28">
        1
      </text>
      <text x="73" y="101">
        {wrong ? "3" : "5"}
      </text>
      {wrong && (
        <text className="x" x="150" y="84">
          ×
        </text>
      )}
    </svg>
  );
}
