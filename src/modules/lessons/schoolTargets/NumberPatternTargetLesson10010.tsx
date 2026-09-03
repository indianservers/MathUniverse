import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./NumberPatternTargetLesson10010.css";
const arithmetic = (first: number, d: number, n: number) => first + (n - 1) * d,
  geometric = (first: number, r: number, n: number) => first * r ** (n - 1);
export default function NumberPatternTargetLesson10010({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mode, setMode] = useState<"add" | "multiply">("add"),
    [first, setFirst] = useState(4),
    [change, setChange] = useState(4),
    [applied, setApplied] = useState(false),
    [n, setN] = useState(15),
    [computed, setComputed] = useState(60),
    [answers, setAnswers] = useState(["", "", ""]),
    [answerGrade, setAnswerGrade] = useState<boolean | null>(null),
    [quickN, setQuickN] = useState(30),
    [quickValue, setQuickValue] = useState<number | null>(null),
    [solution, setSolution] = useState(false),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    term = (position: number) =>
      mode === "add"
        ? arithmetic(first, change, position)
        : geometric(first, change, position),
    terms = Array.from({ length: 10 }, (_, i) => term(i + 1)),
    differences = terms
      .slice(1)
      .map((value, i) =>
        mode === "add" ? value - terms[i] : value / terms[i],
      ),
    expected = [19, 22, 25],
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1],
    apply = () => act(() => setApplied(true)),
    reset = () =>
      act(() => {
        setMode("add");
        setFirst(4);
        setChange(4);
        setApplied(false);
        setN(15);
        setComputed(60);
        setAnswers(["", "", ""]);
        setAnswerGrade(null);
        setQuickN(30);
        setQuickValue(null);
        setSolution(false);
      }),
    check = () =>
      act(() =>
        setAnswerGrade(
          answers.every((value, i) => Number(value) === expected[i]),
        ),
      );
  return (
    <section
      className="np10010-page"
      data-testid="school-mockup-0684"
      data-object-model="dedicated-arithmetic-geometric-sequence-rule-nth-term-and-practice-model"
      data-mode={mode}
      data-first={first}
      data-change={change}
      data-terms={terms.join(",")}
      data-applied={applied}
      data-computed={computed}
      data-answer-graded={answerGrade === null ? "" : answerGrade}
      data-quick-value={quickValue ?? ""}
      data-actions={actions}
    >
      <header className="np10010-hero">
        <small>CLASS 6 · PATTERNS</small>
        <h1>Number Pattern Completion</h1>
        <p>
          <b>Objective:</b> Predict missing and next terms in a number pattern
          and express the rule using a ratio or an nth-term formula.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number pattern</span>
        </dl>
        <nav>
          <Link to={prev.route}>
            ← Previous<b>{prev.title}</b>
          </Link>
          <Link to={next.route}>
            Next →<b>{next.title}</b>
          </Link>
          <button
            onClick={() =>
              act(() =>
                localStorage.setItem(
                  "number-pattern-progress",
                  JSON.stringify({ mode, first, change }),
                ),
              )
            }
          >
            Save progress
          </button>
        </nav>
      </header>
      <nav className="np10010-tabs">
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
      <section className="np10010-observe">
        <header>
          <h2>1 OBSERVE & MANIPULATE</h2>
          <p>Reveal terms, find the pattern, and predict the next ones.</p>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <div className="sequence">
          <b>Position (n)</b>
          {terms.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
          <b>Term (aₙ)</b>
          {terms.map((value, i) => (
            <strong
              className={
                i >= 5 && i < 9 && !applied ? "missing" : i === 4 ? "focus" : ""
              }
              key={i}
            >
              {i >= 5 && i < 9 && !applied ? "?" : value}
            </strong>
          ))}
        </div>
      </section>
      <section className="np10010-manip">
        <article>
          <h2>
            2 MANIPULATE <small>(choose the rule)</small>
          </h2>
          <b>Select rule type</b>
          <div className="segments">
            <button
              className={mode === "add" ? "active" : ""}
              onClick={() =>
                act(() => {
                  setMode("add");
                  setChange(4);
                  setApplied(false);
                })
              }
            >
              Add / Subtract
            </button>
            <button
              className={mode === "multiply" ? "active" : ""}
              onClick={() =>
                act(() => {
                  setMode("multiply");
                  setChange(2);
                  setApplied(false);
                })
              }
            >
              Multiply / Divide
            </button>
          </div>
          <label>
            {mode === "add" ? "Common difference (d)" : "Common ratio (r)"}
            <span>
              <button
                onClick={() =>
                  act(() => {
                    setChange((v) => v - 1);
                    setApplied(false);
                  })
                }
              >
                −
              </button>
              <input
                aria-label="Pattern change"
                type="number"
                value={change}
                onChange={(e) =>
                  act(() => {
                    setChange(Number(e.target.value));
                    setApplied(false);
                  })
                }
              />
              <button
                onClick={() =>
                  act(() => {
                    setChange((v) => v + 1);
                    setApplied(false);
                  })
                }
              >
                +
              </button>
            </span>
          </label>
          <button className="apply" onClick={apply}>
            Apply rule
          </button>
        </article>
        <article>
          <h2>3 NOTICE THE PATTERN</h2>
          <b>
            {mode === "add" ? "Differences" : "Ratios"} between consecutive
            terms
          </b>
          <div className="diffs">
            {differences.map((value, i) => (
              <span key={i}>{mode === "add" ? value : `×${value}`}</span>
            ))}
          </div>
          <b>Pattern type</b>
          <p>
            <CheckCircle2 />
            {mode === "add"
              ? "Arithmetic (constant difference)"
              : "Geometric (constant ratio)"}
          </p>
          <b>Rule in words</b>
          <p>
            {mode === "add"
              ? `${change >= 0 ? "Add" : "Subtract"} ${Math.abs(change)} each time to get the next term.`
              : `Multiply by ${change} each time.`}
          </p>
        </article>
        <aside>
          <h2>Live readout</h2>
          <p>
            First term (a₁)<b>{first}</b>
          </p>
          <p>
            {mode === "add" ? "Common difference (d)" : "Common ratio (r)"}
            <b>{change}</b>
          </p>
          <p>
            Last known term (a₁₀)<b>{terms[9]}</b>
          </p>
          <b>Next three terms</b>
          <div>
            {terms.slice(5, 8).map((x) => (
              <strong key={x}>{x}</strong>
            ))}
          </div>
          <footer>
            <CheckCircle2 />
            Rule fits all known terms
          </footer>
        </aside>
      </section>
      <section className="np10010-rule">
        <article>
          <h2>4 UNDERSTAND THE RULE — TEST YOUR RULE</h2>
          <p>Your rule must generate all shown terms.</p>
          <table>
            <tbody>
              <tr>
                <th>n</th>
                {terms.map((_, i) => (
                  <td key={i}>{i + 1}</td>
                ))}
              </tr>
              <tr>
                <th>aₙ (actual)</th>
                {terms.map((x) => (
                  <td key={x}>{x}</td>
                ))}
              </tr>
              <tr>
                <th>aₙ (by rule)</th>
                {terms.map((x) => (
                  <td key={x}>{x}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <strong>✓ Perfect match!</strong>
        </article>
        <article>
          <h2>Nth-term (general) rule</h2>
          <p>
            {mode === "add" ? (
              <>
                aₙ = a₁ + (n − 1)d
                <br />= {first} + (n − 1) × {change}
                <br />= {change}n{" "}
                {first - change >= 0
                  ? `+ ${first - change}`
                  : `− ${Math.abs(first - change)}`}
              </>
            ) : (
              <>
                aₙ = a₁ · rⁿ⁻¹
                <br />= {first} · {change}ⁿ⁻¹
              </>
            )}
          </p>
        </article>
        <article>
          <h2>Check any term</h2>
          <label>
            n ={" "}
            <input
              aria-label="Term position"
              type="number"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
          <button onClick={() => act(() => setComputed(term(n)))}>
            Compute
          </button>
          <p>
            aₙ = <b>{computed}</b>
          </p>
        </article>
      </section>
      <section className="np10010-practice">
        <article>
          <h2>5 TRY INDEPENDENTLY</h2>
          <p>Predict the next three terms.</p>
          <div className="practice-seq">
            {[7, 10, 13, 16].map((x) => (
              <b key={x}>{x}</b>
            ))}
            {[0, 1, 2].map((i) => (
              <b key={i}>?</b>
            ))}
          </div>
          <label>
            Your answers{" "}
            {answers.map((x, i) => (
              <input
                aria-label={`Pattern answer ${i + 1}`}
                value={x}
                onChange={(e) =>
                  setAnswers((v) =>
                    v.map((a, j) => (j === i ? e.target.value : a)),
                  )
                }
                key={i}
              />
            ))}
            <button onClick={check}>Check</button>
          </label>
          {answerGrade !== null && (
            <output>
              {answerGrade ? "Correct: 19, 22, 25" : "Keep adding 3."}
            </output>
          )}
        </article>
        <aside>
          <h2>Quick tools</h2>
          <p>
            Find d: <b>3</b>
          </p>
          <label>
            Find aₙ: n ={" "}
            <input
              aria-label="Quick term position"
              type="number"
              value={quickN}
              onChange={(e) => setQuickN(Number(e.target.value))}
            />
            <button
              onClick={() => act(() => setQuickValue(arithmetic(7, 3, quickN)))}
            >
              Go
            </button>
          </label>
          {quickValue !== null && <output>{quickValue}</output>}
        </aside>
      </section>
      <section className="np10010-cards">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Pattern: 3, 6, 9, 12, ...</p>
          <p>d = 3</p>
          <p>Next three terms: 15, 18, 21</p>
          <p>aₙ = 3n</p>
        </article>
        <article>
          <h2>KEY RULE</h2>
          <b>Arithmetic Pattern</b>
          <p>aₙ = a₁ + (n − 1)d</p>
        </article>
        <article>
          <h2>COMMON MISTAKE</h2>
          <b>Mixing up position with value.</b>
          <p>Correct rule: aₙ = a₁ + (n − 1)d</p>
        </article>
        <article>
          <h2>MINI CHALLENGE</h2>
          <p>Pattern: 5, 9, 13, 17, ...</p>
          <p>Find the next three terms and write aₙ.</p>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            {solution ? "21, 25, 29; aₙ = 4n + 1" : "Show solution"}
          </button>
        </article>
      </section>
      <section className="np10010-summary">
        <article>
          <h2>Lesson summary</h2>
          <p>
            ✓ Find the common difference between consecutive terms.
            <br />✓ Use the rule to fill missing and predict next terms.
            <br />✓ Express the pattern using aₙ = a₁ + (n − 1)d.
          </p>
        </article>
        <article>
          <h2>What you've learned</h2>
          <p>Observed pattern → Found rule → Verified rule → Predicted terms</p>
        </article>
      </section>
      <nav className="np10010-adjacent">
        <Link to={prev.route}>
          ← Previous Lesson<b>{prev.title}</b>
        </Link>
        <Link to={next.route}>
          Next Lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
