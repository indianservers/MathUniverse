import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TabularPatternTargetLesson10039.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const rules = [
  "a",
  "b",
  "2a",
  "2b",
  "a + b",
  "a - b",
  "2a + b",
  "a + 2b",
  "3a",
  "b - a",
] as const;
type Rule = (typeof rules)[number];
const evaluate = (rule: Rule, a: number, b: number) =>
  ({
    a,
    b,
    "2a": 2 * a,
    "2b": 2 * b,
    "a + b": a + b,
    "a - b": a - b,
    "2a + b": 2 * a + b,
    "a + 2b": a + 2 * b,
    "3a": 3 * a,
    "b - a": b - a,
  })[rule];
const rows = [
  [1, 2, 4],
  [3, 4, 10],
  [5, 7, 17],
];
const challengeRules: [string, Rule][] = [
  ["a + b + 1", "a + b"],
  ["2a + b", "2a + b"],
  ["a + 2b", "a + 2b"],
  ["3a - b", "3a"],
];

export default function TabularPatternTargetLesson10039({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rule, setRule] = useState<Rule>("2a + b"),
    [thirdOutput, setThirdOutput] = useState(17),
    [tab, setTab] = useState("Interact"),
    [tested, setTested] = useState(true),
    [challengeChoice, setChallengeChoice] = useState(1),
    [challengeResult, setChallengeResult] = useState<
      "idle" | "correct" | "retry"
    >("correct"),
    [actions, setActions] = useState(0);
  const generated = rows.map(([a, b]) => evaluate(rule, a, b)),
    matches = rows.map(
      (row, i) =>
        generated[i] === row[2] && (i !== 2 || thirdOutput === generated[i]),
    ),
    allMatch = matches.every(Boolean);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setRule("2a + b");
      setThirdOutput(17);
      setTab("Interact");
      setTested(true);
      setChallengeChoice(1);
      setChallengeResult("correct");
    });
  return (
    <section
      className="table10039-page"
      data-testid="school-mockup-0713"
      data-object-model="dedicated-all-row-tabular-rule-inference-engine"
      data-rule={rule}
      data-generated={generated.join(",")}
      data-third-output={thirdOutput}
      data-matches={matches.join(",")}
      data-all-match={allMatch}
      data-tested={tested}
      data-challenge-choice={challengeChoice}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="table10039-hero">
        <small>CLASS 8 - INFORMATION PROCESSING</small>
        <h1>Tabular Pattern Completion</h1>
        <p>
          <b>Objective:</b> Infer a consistent rule from rows and columns and
          complete missing table entries.
        </p>
        <div>
          <span>18 min</span>
          <span>Level: Foundation</span>
          <span>Skills: Pattern recognition, Rule formation, Verification</span>
        </div>
        <Link to="/lessons/school">School lessons</Link>
      </header>
      <nav className="table10039-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="table10039-lab">
        <header>
          <b>1</b>
          <h2>Explore & complete the table</h2>
          <p>
            Use the rules and relationships to infer the rule. Fill the three
            blanks so the rule holds for every row.
          </p>
        </header>
        <article className="data-table">
          <h3>
            INPUTS <span>OUTPUT</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>a</th>
                <th>b</th>
                <th>output</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b, o], i) => (
                <tr key={i}>
                  <th>Row {i + 1}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>
                    {i === 2 ? (
                      <input
                        aria-label="Row 3 output"
                        type="number"
                        value={thirdOutput}
                        onChange={(e) =>
                          act(() => {
                            setThirdOutput(Number(e.target.value));
                            setTested(false);
                          })
                        }
                      />
                    ) : (
                      o
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>All values are integers.</p>
        </article>
        <article className="rule-builder">
          <header>
            <b>2</b>
            <h2>Build your rule</h2>
            <p>Combine the inputs a and b to get the output.</p>
          </header>
          <div>
            {rules.map((item) => (
              <button
                className={rule === item ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setRule(item);
                    setThirdOutput(evaluate(item, 5, 7));
                    setTested(false);
                  })
                }
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <label>
            Your rule<output>output = {rule}</output>
          </label>
        </article>
        <section className="relationships">
          <header>
            <b>3</b>
            <h2>Relationships at a glance</h2>
          </header>
          <article>
            <h3>Row relationship</h3>
            <p>Across each row, output depends on a and b.</p>
            <div>
              <span>a</span>
              <span>b</span>
              <strong>output</strong>
            </div>
          </article>
          <article>
            <h3>Column patterns</h3>
            <p>
              As a increases, generated output changes by the selected rule.
            </p>
            <strong>{generated.join(" to ")}</strong>
          </article>
          <article>
            <h3>Rule preview</h3>
            <p>
              If output = {rule}, then a=3, b=4 gives{" "}
              <b>{evaluate(rule, 3, 4)}</b>.
            </p>
          </article>
        </section>
        <footer>
          <button onClick={() => act(() => setTested(true))}>
            <Play /> Test all rows
          </button>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <span>Holds for all rows</span>
          <span>Fitted to one row</span>
          <span>Contradiction</span>
        </footer>
        {tested && (
          <section className={allMatch ? "result good" : "result bad"}>
            <div>
              <CheckCircle2 />
              <h2>
                {allMatch
                  ? "Rule holds for all rows!"
                  : "The rule contradicts at least one row."}
              </h2>
              <p>
                {allMatch
                  ? `All rows are consistent with output = ${rule}.`
                  : "A valid table rule must hold for every complete row."}
              </p>
            </div>
            <table>
              <tbody>
                <tr>
                  {matches.map((ok, i) => (
                    <th key={i}>Row {i + 1}</th>
                  ))}
                </tr>
                <tr>
                  {matches.map((ok, i) => (
                    <td key={i}>{ok ? "OK" : "X"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </section>
      <section className="table10039-theory">
        <article>
          <h2>Why it works</h2>
          <p>
            The rule output = 2a + b creates a consistent pattern across every
            row.
          </p>
          <p>When a increases, output increases twice as much.</p>
          <p>When b increases, output increases the same amount.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Use output = 2a + b.</p>
          <p>Row 3: a=5, b=7</p>
          <strong>2 x 5 + 7 = 17</strong>
        </article>
        <article className="warning">
          <h2>Common misconception</h2>
          <p>Trying to fit a rule using only one row.</p>
          <p>
            A wrong rule may work once but fail on Row 2. Always test every row.
          </p>
        </article>
      </section>
      <section className="table10039-challenge">
        <header>
          <h2>Mini challenge</h2>
          <p>Which rule completes the table for all rows?</p>
        </header>
        <MiniTable />
        <article>
          {challengeRules.map(([label], i) => (
            <label
              className={challengeChoice === i ? "selected" : ""}
              key={label}
            >
              <input
                type="radio"
                name="challenge-rule"
                checked={challengeChoice === i}
                onChange={() =>
                  act(() => {
                    setChallengeChoice(i);
                    setChallengeResult("idle");
                  })
                }
              />
              {label}
              {i === 1 && challengeResult === "correct" && <CheckCircle2 />}
            </label>
          ))}
        </article>
        <aside className={challengeResult}>
          <h3>
            {challengeResult === "correct"
              ? "Correct! Only output = 2a + b completes all rows."
              : challengeResult === "retry"
                ? "Try every rule against all three rows."
                : "Test the selected rule on each row."}
          </h3>
          <p>Row 3: 2 x 5 + 7 = 17</p>
          <button
            onClick={() =>
              act(() => {
                if (challengeResult === "idle")
                  setChallengeResult(
                    challengeChoice === 1 ? "correct" : "retry",
                  );
                else {
                  setChallengeChoice((challengeChoice + 1) % 4);
                  setChallengeResult("idle");
                }
              })
            }
          >
            {challengeResult === "idle"
              ? "Check choice"
              : "Try another challenge"}{" "}
            <Shuffle />
          </button>
        </aside>
      </section>
      <nav className="table10039-adjacent">
        <Link to="/lessons/school/class-8/class-8-information-processing-route-map-reasoning">
          <ArrowLeft /> Previous: Route Map Reasoning
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-9/class-9-real-numbers-euclid-division-lemma"
        >
          Next lesson <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function MiniTable() {
  return (
    <table className="mini-table">
      <thead>
        <tr>
          <th>Row</th>
          <th>a</th>
          <th>b</th>
          <th>output</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <th>{i + 1}</th>
            <td>{r[0]}</td>
            <td>{r[1]}</td>
            <td>{i === 2 ? "?" : r[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
