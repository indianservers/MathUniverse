import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MisleadingGraphTargetLesson10009.css";
const months = ["Jan", "Feb", "Mar", "Apr", "May"],
  values = [100, 150, 200, 250, 300];
function Graph({
  start = 0,
  end = 350,
  unequal = false,
  threeD = false,
  practice = false,
}: {
  start?: number;
  end?: number;
  unequal?: boolean;
  threeD?: boolean;
  practice?: boolean;
}) {
  const data = practice ? [170, 175, 180, 185] : values,
    names = practice ? ["Week 1", "Week 2", "Week 3", "Week 4"] : months,
    width = practice ? 240 : 360,
    points = data.map((v, i) => {
      const spacing = unequal
          ? [0, 0.13, 0.42, 0.7, 1][i]
          : i / (data.length - 1),
        x = 42 + spacing * (width - 65),
        y = 190 - ((v - start) / (end - start)) * 145;
      return { x, y, v };
    }),
    d = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} 220`}
      role="img"
      aria-label={
        practice ? "Independent misleading graph" : "Ice cream sales graph"
      }
    >
      <line className="axis" x1="42" x2={width - 15} y1="190" y2="190" />
      <line className="axis" x1="42" x2="42" y1="35" y2="190" />
      {Array.from({ length: 6 }, (_, i) => {
        const value = Math.round(start + ((end - start) * i) / 5),
          y = 190 - i * 29;
        return (
          <g key={i}>
            <line className="grid" x1="42" x2={width - 15} y1={y} y2={y} />
            <text x="30" y={y + 3}>
              {value}
            </text>
          </g>
        );
      })}
      {threeD && <path className="shadow" d={d} transform="translate(7 7)" />}
      <path className="line" d={d} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" />
          <text x={p.x} y={p.y - 11}>
            {p.v}
          </text>
          <text x={p.x} y="207">
            {names[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
export default function MisleadingGraphTargetLesson10009({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [truncated, setTruncated] = useState(true),
    [unequal, setUnequal] = useState(false),
    [threeD, setThreeD] = useState(false),
    [start, setStart] = useState(100),
    [end, setEnd] = useState(300),
    [compress, setCompress] = useState("None"),
    [stretch, setStretch] = useState("None"),
    [style, setStyle] = useState("2D (Flat)"),
    [tab, setTab] = useState("Interact"),
    [verdict, setVerdict] = useState("yes"),
    [reason, setReason] = useState("truncated"),
    [evidence, setEvidence] = useState(
      "The Y-axis starts at 160 instead of 0. This makes the increase from 170 to 185 look bigger than it really is.",
    ),
    [graded, setGraded] = useState<boolean | null>(true),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    liveStart = truncated ? start : 0,
    liveEnd = end,
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1],
    check = () =>
      act(() =>
        setGraded(
          verdict === "yes" &&
            reason === "truncated" &&
            evidence.toLowerCase().includes("160"),
        ),
      );
  return (
    <section
      className="mg10009-page"
      data-testid="school-mockup-0683"
      data-object-model="dedicated-live-axis-interval-3d-misleading-graph-and-evidence-model"
      data-truncated={truncated}
      data-start={liveStart}
      data-end={liveEnd}
      data-unequal={unequal}
      data-three-d={threeD}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="mg10009-hero">
        <small>CLASS 6 · DATA HANDLING</small>
        <h1>Misleading Graph Detection</h1>
        <p>
          <b>Objective:</b> Detect when graphs mislead by checking scales,
          intervals and 3D effects, and explain the change accurately.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </dl>
        <nav>
          <Link to={prev.route}>← Previous Lesson</Link>
          <Link to={next.route}>Next Lesson →</Link>
        </nav>
      </header>
      <nav className="mg10009-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (x) => (
            <button
              className={tab === x ? "active" : ""}
              onClick={() => act(() => setTab(x))}
              key={x}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <section className="mg10009-compare">
        <header>
          <h2>1 OBSERVE: Compare the graphs</h2>
          <p>Study the honest and manipulated graphs of the same data.</p>
          <table>
            <tbody>
              <tr>
                <th>Data: Ice cream sales (cups)</th>
                {months.map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
              <tr>
                <td />
                <td>100</td>
                <td>150</td>
                <td>200</td>
                <td>250</td>
                <td>300</td>
              </tr>
            </tbody>
          </table>
        </header>
        <div>
          <article>
            <h3>HONEST GRAPH (not misleading)</h3>
            <p>Y-axis starts at 0 with equal intervals.</p>
            <Graph />
          </article>
          <article>
            <h3>MANIPULATED GRAPH (misleading)</h3>
            <p>Notice how the change looks much bigger.</p>
            <Graph start={100} end={300} />
          </article>
        </div>
      </section>
      <section className="mg10009-manip">
        <article>
          <h2>2 MANIPULATE: Create misleading graphs</h2>
          <p>Toggle options to see how graphs can mislead.</p>
          <label>
            <span>
              <b>1 Truncated Y-axis</b>
              <small>Start the Y-axis above 0.</small>
            </span>
            <input
              aria-label="Truncated Y-axis"
              type="checkbox"
              checked={truncated}
              onChange={(e) => act(() => setTruncated(e.target.checked))}
            />
            <select
              aria-label="Start at"
              value={start}
              onChange={(e) => act(() => setStart(Number(e.target.value)))}
            >
              {[0, 50, 100, 150].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              aria-label="Maximum"
              value={end}
              onChange={(e) => act(() => setEnd(Number(e.target.value)))}
            >
              {[300, 350, 400].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            <span>
              <b>2 Unequal Intervals</b>
              <small>Use unequal gaps between values.</small>
            </span>
            <input
              aria-label="Unequal intervals"
              type="checkbox"
              checked={unequal}
              onChange={(e) => act(() => setUnequal(e.target.checked))}
            />
            <select
              aria-label="Compress lower end"
              value={compress}
              onChange={(e) => act(() => setCompress(e.target.value))}
            >
              <option>None</option>
              <option>Strong</option>
            </select>
            <select
              aria-label="Stretch upper end"
              value={stretch}
              onChange={(e) => act(() => setStretch(e.target.value))}
            >
              <option>None</option>
              <option>Strong</option>
            </select>
          </label>
          <label>
            <span>
              <b>3 3D Distortion</b>
              <small>Use 3D style to exaggerate change.</small>
            </span>
            <input
              aria-label="3D distortion"
              type="checkbox"
              checked={threeD}
              onChange={(e) => act(() => setThreeD(e.target.checked))}
            />
            <select
              aria-label="Chart style"
              value={style}
              onChange={(e) => {
                setStyle(e.target.value);
                act(() => setThreeD(e.target.value !== "2D (Flat)"));
              }}
            >
              <option>2D (Flat)</option>
              <option>3D Perspective</option>
            </select>
          </label>
          <footer>
            Current settings:{" "}
            {truncated
              ? `Truncated Y-axis (${start} to ${end})`
              : "Axis starts at 0"}
            {unequal ? ", unequal intervals" : ""}
            {threeD ? ", 3D distortion" : ""}
          </footer>
        </article>
        <article>
          <h2>LIVE MANIPULATED GRAPH</h2>
          <Graph
            start={liveStart}
            end={liveEnd}
            unequal={unequal || compress === "Strong" || stretch === "Strong"}
            threeD={threeD}
          />
          <aside>
            This graph{" "}
            {truncated || unequal || threeD ? "exaggerates" : "shows"} the
            change.{" "}
            {truncated
              ? "The Y-axis doesn't start at 0."
              : "The Y-axis starts at 0."}
          </aside>
        </article>
      </section>
      <section className="mg10009-pattern">
        <h2>3 NOTICE THE PATTERN: What makes a graph misleading?</h2>
        <div>
          <article>
            <b>Truncated Axis</b>
            <p>Starting the axis above 0 makes the same change look bigger.</p>
            <strong>Example: Start at 100 instead of 0.</strong>
          </article>
          <article>
            <b>Unequal Intervals</b>
            <p>
              Unequal gaps between values distort the real pattern of change.
            </p>
            <strong>Example: Bigger gaps at the top.</strong>
          </article>
          <article>
            <b>3D Distortion</b>
            <p>3D effects add depth that exaggerates the visual change.</p>
            <strong>Example: 3D bars or perspective.</strong>
          </article>
        </div>
      </section>
      <section className="mg10009-rule">
        <article>
          <h2>4 UNDERSTAND THE RULE</h2>
          <h3>Key Rule</h3>
          <p>
            A graph is misleading if the scales, intervals, or 3D effects
            exaggerate or hide the real change.
          </p>
          <p>
            ✓ Does the axis start at 0?
            <br />✓ Are the intervals equal?
            <br />✓ Is the graph 2D (flat)?
          </p>
          <aside>
            <b>COMMON MISCONCEPTION</b>
            <p>A steep line or tall bar always means a big change.</p>
          </aside>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <table>
            <tbody>
              <tr>
                <th>Month</th>
                {months.map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
              <tr>
                <th>Sales (cups)</th>
                {values.map((x) => (
                  <td key={x}>{x}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <div>
            <aside>
              <b>Honest Graph</b>
              <p>
                Y-axis: 0 to 350
                <br />
                Equal intervals of 50
                <br />
                Real increase = 200 cups
              </p>
              <strong>Conclusion: Real increase is 200 cups.</strong>
            </aside>
            <aside>
              <b>Manipulated Graph (Truncated Axis)</b>
              <p>
                Y-axis: 100 to 300
                <br />
                Looks like a very steep increase
                <br />
                Data is the same
              </p>
              <strong>Verdict: Misleading. Axis is truncated.</strong>
            </aside>
          </div>
          <footer>
            Evidence-based verdict: The manipulated graph exaggerates the change
            by truncating the Y-axis.
          </footer>
        </article>
      </section>
      <section className="mg10009-practice">
        <h2>5 TRY INDEPENDENTLY: Your turn</h2>
        <p>
          Decide if the graph is misleading. Choose the reason and explain using
          evidence.
        </p>
        <div>
          <Graph start={160} end={200} practice />
          <fieldset>
            <legend>Is this graph misleading?</legend>
            <label>
              <input
                type="radio"
                name="verdict"
                checked={verdict === "yes"}
                onChange={() => setVerdict("yes")}
              />
              Yes, it is misleading
            </label>
            <label>
              <input
                type="radio"
                name="verdict"
                checked={verdict === "no"}
                onChange={() => setVerdict("no")}
              />
              No, it is not misleading
            </label>
          </fieldset>
          <fieldset>
            <legend>Select the reason</legend>
            {[
              ["truncated", "Truncated axis"],
              ["unequal", "Unequal intervals"],
              ["3d", "3D distortion"],
              ["other", "Other"],
            ].map(([v, l]) => (
              <label key={v}>
                <input
                  type="radio"
                  name="reason"
                  checked={reason === v}
                  onChange={() => setReason(v)}
                />
                {l}
              </label>
            ))}
          </fieldset>
          <label>
            <b>Explain using evidence</b>
            <textarea
              aria-label="Evidence explanation"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
            <button onClick={check}>Check verdict</button>
          </label>
          <aside>
            <b>Your verdict</b>
            {graded !== null && (
              <p>
                <CheckCircle2 />
                {graded ? "Correct" : "Review the axis and evidence."}
              </p>
            )}
          </aside>
        </div>
      </section>
      <nav className="mg10009-adjacent">
        <Link to={prev.route}>← Previous Lesson</Link>
        <Link to={next.route}>Next Lesson →</Link>
      </nav>
    </section>
  );
}
