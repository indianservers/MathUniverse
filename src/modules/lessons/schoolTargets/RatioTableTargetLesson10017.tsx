import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RatioTableTargetLesson10017.css";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const tidy = (n: number) =>
  Number.isInteger(n)
    ? String(n)
    : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const initialFactors = [1, 2, 3, 4, 0.5];

export default function RatioTableTargetLesson10017({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [baseA, setBaseA] = useState(4);
  const [baseB, setBaseB] = useState(3);
  const [factors, setFactors] = useState(initialFactors);
  const [selected, setSelected] = useState(3);
  const [custom, setCustom] = useState("");
  const [tab, setTab] = useState("Interact");
  const [missing, setMissing] = useState("9");
  const [simplified, setSimplified] = useState(["2:3", "2:3", "2:3"]);
  const [grade, setGrade] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const rows = factors.map((f) => [baseA * f, baseB * f] as const);
  const active = rows[Math.min(selected, rows.length - 1)] ?? [baseA, baseB];
  const common = gcd(Math.round(active[0] * 100), Math.round(active[1] * 100));
  const simple = [
    Math.round(active[0] * 100) / common,
    Math.round(active[1] * 100) / common,
  ];
  const equivalent = rows.every(
    ([a, b]) => Math.abs(a * baseB - b * baseA) < 1e-8,
  );
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const addFactor = (factor: number) =>
    act(() => {
      setFactors((v) => [...v, factor]);
      setSelected(factors.length);
    });
  const reset = () =>
    act(() => {
      setBaseA(4);
      setBaseB(3);
      setFactors(initialFactors);
      setSelected(3);
      setCustom("");
      setMissing("9");
      setSimplified(["2:3", "2:3", "2:3"]);
      setGrade(null);
    });
  const check = () =>
    act(() =>
      setGrade(
        missing === "9" &&
          simplified.every((v) => v.replace(/\s/g, "") === "2:3"),
      ),
    );
  return (
    <section
      className="rt10017-page"
      data-testid="school-mockup-0691"
      data-object-model="dedicated-scaled-ratio-row-simplification-double-number-line-and-practice"
      data-base={`${baseA}:${baseB}`}
      data-factors={factors.join(",")}
      data-active={`${tidy(active[0])}:${tidy(active[1])}`}
      data-simple={`${tidy(simple[0])}:${tidy(simple[1])}`}
      data-equivalent={equivalent}
      data-practice-graded={grade === null ? "" : grade}
      data-actions={actions}
    >
      <header className="rt10017-hero">
        <small>CLASS 7 · NUMBERS AND ARITHMETIC</small>
        <h1>Ratio Tables</h1>
        <p>
          <b>Objective:</b> Use ratio tables to solve problems, find equivalent
          ratios, and understand the rule of scaling.
        </p>
        <dl>
          <span>18 min</span>
          <span>INTERACTIVE</span>
          <span>CLASS 7</span>
          <span>NUMBERS</span>
          <span>ARITHMETIC</span>
        </dl>
        <Link to="/lessons/school">← Back to lessons</Link>
      </header>
      <nav className="rt10017-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="rt10017-lab">
        <header>
          <i>1</i>
          <h2>OBSERVE</h2>
          <p>Look at the ratio table and the double number line.</p>
          <aside>
            <span>
              Current ratio (A : B)
              <b>
                {baseA} : {baseB}
              </b>
            </span>
            <strong>● Equivalent ✓</strong>
          </aside>
        </header>
        <div className="rt10017-workspace">
          <article>
            <h2>Ratio Table (A : B)</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>A</th>
                  <th>B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([a, b], i) => (
                  <tr
                    className={selected === i ? "active" : ""}
                    onClick={() => act(() => setSelected(i))}
                    key={`${factors[i]}-${i}`}
                  >
                    <th>
                      Row {i + 1}
                      {i === 0 && <small>(base)</small>}
                    </th>
                    <td>{tidy(a)}</td>
                    <td>{tidy(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <aside>
              <b>Great! Every row is an equivalent ratio.</b>
              <p>You've scaled the base ratio correctly.</p>
              <CheckCircle2 />
            </aside>
          </article>
          <article>
            <h2>Manipulate (scale by)</h2>
            <div>
              {[2, 3, 4, 0.5, 1 / 3, 0.25].map((f) => (
                <button onClick={() => addFactor(f)} key={f}>
                  {f < 1 ? `÷ ${tidy(1 / f)}` : `× ${f}`}
                </button>
              ))}
            </div>
            <label>
              Custom factor
              <input
                aria-label="Custom ratio factor"
                placeholder="Enter factor"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
              <button
                onClick={() => Number(custom) > 0 && addFactor(Number(custom))}
              >
                Apply
              </button>
            </label>
            <button onClick={() => act(() => setFactors([1]))}>
              Clear rows
            </button>
            <button onClick={reset}>
              <RotateCcw />
              Reset all
            </button>
            <section>
              <h3>Row multipliers</h3>
              {factors.map((f, i) => (
                <p key={i}>
                  Row {i + 1}
                  {i === 0 && " (base)"}
                  <b>× {tidy(f)}</b>
                </p>
              ))}
            </section>
          </article>
          <article>
            <h2>Double Number Line</h2>
            <svg
              viewBox="0 0 360 300"
              role="img"
              aria-label="Ratio double number line"
            >
              <text x="8" y="105">
                A
              </text>
              <text x="8" y="225">
                B
              </text>
              <line x1="40" y1="100" x2="340" y2="100" />
              <line x1="40" y1="220" x2="340" y2="220" />
              {[0, 1, 2, 3, 4].map((v) => (
                <g key={v}>
                  <circle cx={40 + v * 75} cy="100" r="5" />
                  <circle cx={40 + v * 75} cy="220" r="5" />
                  <line x1={40 + v * 75} y1="105" x2={40 + v * 75} y2="215" />
                  <text x={40 + v * 75} y="128">
                    {v * baseA}
                  </text>
                  <text x={40 + v * 75} y="248">
                    {v * baseB}
                  </text>
                  {v > 0 && (
                    <text x={40 + v * 75} y="50">
                      × {v}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </article>
        </div>
        <footer>
          <b>Real-time readouts</b>
          <span>
            Scale factor (last step)
            <strong>× {tidy(factors[selected] ?? 1)}</strong>
          </span>
          <span>
            New ratio
            <strong>
              {tidy(active[0])} : {tidy(active[1])}
            </strong>
          </span>
          <span>
            Simplified ratio
            <strong>
              {tidy(simple[0])} : {tidy(simple[1])}
            </strong>
          </span>
          <span>
            Are they equivalent?<strong>{equivalent ? "Yes ✓" : "No ✕"}</strong>
          </span>
        </footer>
      </section>
      <section className="rt10017-rules">
        <article>
          <h2>3 NOTICE THE PATTERN</h2>
          <ul>
            <li>
              When we multiply both A and B by the same number, the ratio stays
              the same.
            </li>
            <li>Every row in the table is an equivalent ratio.</li>
          </ul>
        </article>
        <article>
          <h2>4 UNDERSTAND THE RULE</h2>
          <p>If A : B is a ratio, then for any non-zero number k,</p>
          <strong>kA : kB is an equivalent ratio.</strong>
          <p>We can simplify any ratio by dividing both terms by their GCD.</p>
        </article>
      </section>
      <section className="rt10017-lower">
        <article>
          <h2>2 WORKED EXAMPLE</h2>
          <p>Base ratio A : B = 4 : 3</p>
          <p>Find three equivalent ratios and write them in simplest form.</p>
          <table>
            <thead>
              <tr>
                <th>Multiply by</th>
                <th>A</th>
                <th>B</th>
                <th>Equivalent ratio</th>
                <th>Simplified ratio</th>
              </tr>
            </thead>
            <tbody>
              {[2, 3, 4].map((f) => (
                <tr key={f}>
                  <td>× {f}</td>
                  <td>{4 * f}</td>
                  <td>{3 * f}</td>
                  <td>
                    {4 * f} : {3 * f}
                  </td>
                  <td>4 : 3</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>✓ All equivalent ratios simplify back to 4 : 3.</aside>
        </article>
        <aside>
          <section>
            <h2>⚠ BEWARE OF THIS MISTAKE</h2>
            <p>
              Adding the same number to both parts does NOT keep the ratio
              equivalent.
            </p>
            <strong>4 : 3 → +2 to both 6 : 5 ✕</strong>
          </section>
          <section>
            <h2>5 TRY INDEPENDENTLY</h2>
            <p>Fill in the missing values. Then write the simplified ratio.</p>
            <table>
              <tbody>
                <tr>
                  <td>10</td>
                  <td>15</td>
                  <td>10 : 15</td>
                  <td>
                    <input
                      aria-label="Simplified ratio 1"
                      value={simplified[0]}
                      onChange={(e) =>
                        setSimplified((v) =>
                          v.map((x, i) => (i === 0 ? e.target.value : x)),
                        )
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>
                    <input
                      aria-label="Missing ratio value"
                      value={missing}
                      onChange={(e) => setMissing(e.target.value)}
                    />
                  </td>
                  <td>6 : {missing}</td>
                  <td>
                    <input
                      aria-label="Simplified ratio 2"
                      value={simplified[1]}
                      onChange={(e) =>
                        setSimplified((v) =>
                          v.map((x, i) => (i === 1 ? e.target.value : x)),
                        )
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>21</td>
                  <td>14 : 21</td>
                  <td>
                    <input
                      aria-label="Simplified ratio 3"
                      value={simplified[2]}
                      onChange={(e) =>
                        setSimplified((v) =>
                          v.map((x, i) => (i === 2 ? e.target.value : x)),
                        )
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={check}>Check</button>
            {grade !== null && (
              <output>
                {grade
                  ? "Excellent! All ratios simplify to 2 : 3."
                  : "Scale both terms by the same factor."}
              </output>
            )}
          </section>
        </aside>
      </section>
      <nav className="rt10017-adjacent">
        <Link to={prev.route}>
          ← Previous Lesson<b>{prev.title}</b>
        </Link>
        <span>Lesson Progress 1 of 5</span>
        <Link to={next.route}>
          Next Lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
