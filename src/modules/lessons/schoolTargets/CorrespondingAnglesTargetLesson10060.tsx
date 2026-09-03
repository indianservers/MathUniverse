import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CorrespondingAnglesTargetLesson10060.css";

const pairs = [
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
] as const;
const tabs = ["⚗ Interact", "▣ Learn", "□ Example", "π Formula", "✎ Practice"];

export default function CorrespondingAnglesTargetLesson10060({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(64);
  const [parallel, setParallel] = useState(true);
  const [tool, setTool] = useState("drag");
  const [labels, setLabels] = useState(true);
  const [measures, setMeasures] = useState(true);
  const [highlights, setHighlights] = useState(true);
  const [tab, setTab] = useState(0);
  const [selectedPairs, setSelectedPairs] = useState<number[]>([0, 1, 2, 3]);
  const [actions, setActions] = useState(0);
  const acute = Math.max(5, Math.min(175, Math.round(angle)));
  const obtuse = 180 - acute;
  const values = [
    acute,
    obtuse,
    acute,
    obtuse,
    parallel ? acute : acute + 8,
    parallel ? obtuse : obtuse - 8,
    parallel ? acute : acute + 8,
    parallel ? obtuse : obtuse - 8,
  ];
  const allEqual = pairs.every(([a, b]) => values[a - 1] === values[b - 1]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setAngle(64);
      setParallel(true);
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
      data-object-model="dedicated-two-line-transversal-correspondence-parallel-test-engine"
      data-angle={acute}
      data-values={values.join(",")}
      data-parallel={String(parallel)}
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
              {[
                ["drag", "✣", "Drag lines", "Move lines to change angles"],
                [
                  "rotate",
                  "◌",
                  "Rotate transversal",
                  "Click & drag the slanted line",
                ],
                ["parallel", "♧", "Snap to parallel", "Make lines parallel"],
              ].map(([id, icon, title, detail]) => (
                <button
                  key={id}
                  className={tool === id ? "active" : ""}
                  onClick={() =>
                    act(() => {
                      setTool(id);
                      if (id === "parallel") setParallel(true);
                    })
                  }
                >
                  <i>{icon}</i>
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
                parallel={parallel}
                labels={labels}
                measures={measures}
                highlights={highlights}
                onAngle={(value) => act(() => setAngle(value))}
                onParallel={(value) => act(() => setParallel(value))}
              />
              <button
                className="ca10060-line-control"
                aria-label="Move upper line"
                onClick={() => act(() => setParallel(false))}
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
  parallel,
  labels,
  measures,
  highlights,
  onAngle,
  onParallel,
}: {
  angle: number;
  parallel: boolean;
  labels: boolean;
  measures: boolean;
  highlights: boolean;
  onAngle: (value: number) => void;
  onParallel: (value: boolean) => void;
}) {
  const drag = (e: React.PointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const svg = e.currentTarget.ownerSVGElement!,
      box = svg.getBoundingClientRect();
    const dx = ((e.clientX - box.left) / box.width) * 600 - 300,
      dy = 190 - ((e.clientY - box.top) / box.height) * 560;
    onAngle(
      Math.max(
        5,
        Math.min(
          175,
          Math.round((Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI),
        ),
      ),
    );
  };
  return (
    <svg
      className="ca10060-diagram"
      viewBox="0 0 600 560"
      aria-label="Interactive corresponding angles diagram"
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
      <rect width="600" height="560" fill="url(#ca-grid)" />
      <g
        role="button"
        aria-label="Movable upper line"
        tabIndex={0}
        onClick={() => onParallel(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") onParallel(false);
        }}
      >
        <line
          className="line top"
          x1="45"
          y1="170"
          x2="550"
          y2={parallel ? 170 : 145}
          onPointerMove={(e) => e.buttons === 1 && onParallel(false)}
        />
      </g>
      <line
        className="line bottom"
        x1="35"
        y1="410"
        x2="525"
        y2="410"
        onPointerMove={(e) => e.buttons === 1 && onParallel(false)}
      />
      <line className="transversal" x1="180" y1="520" x2="365" y2="35" />
      <circle
        className="handle"
        cx="365"
        cy="35"
        r="9"
        tabIndex={0}
        onPointerMove={drag}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onAngle(angle + 1);
          if (e.key === "ArrowLeft") onAngle(angle - 1);
        }}
      />
      <g className={highlights ? "angles shown" : "angles"}>
        {[...angleWedges(310, 170), ...angleWedges(220, 410)].map((d, i) => (
          <path key={i} className={`a${i}`} d={d} />
        ))}
      </g>
      {labels &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => (
          <text
            key={n}
            x={[270, 343, 250, 342, 181, 255, 160, 255][i]}
            y={[128, 128, 222, 222, 368, 368, 462, 462][i]}
          >
            {n}
          </text>
        ))}
      {measures && (
        <>
          <text className="measure" x="262" y="102">
            {angle}°
          </text>
          <text className="measure alt" x="329" y="102">
            {180 - angle}°
          </text>
        </>
      )}
      <text className="name" x="25" y="155">
        ℓ
      </text>
      <text className="name" x="18" y="397">
        m
      </text>
      <text className="name" x="349" y="28">
        t
      </text>
    </svg>
  );
}

function angleWedges(cx: number, cy: number) {
  return [
    `M${cx} ${cy} L${cx - 29} ${cy} A29 29 0 0 1 ${cx - 10} ${cy - 27} Z`,
    `M${cx} ${cy} L${cx - 10} ${cy - 27} A29 29 0 0 1 ${cx + 29} ${cy} Z`,
    `M${cx} ${cy} L${cx - 29} ${cy} A29 29 0 0 0 ${cx + 10} ${cy + 27} Z`,
    `M${cx} ${cy} L${cx + 10} ${cy + 27} A29 29 0 0 0 ${cx + 29} ${cy} Z`,
  ];
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
