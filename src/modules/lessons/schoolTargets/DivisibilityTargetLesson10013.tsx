import { CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DivisibilityTargetLesson10013.css";

const divisors = [2, 4, 5, 6, 8, 10, 11] as const;
type Divisor = (typeof divisors)[number];

function digitSum(value: number) {
  return String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function alternatingSum(value: number) {
  return String(value)
    .split("")
    .reduce(
      (sum, digit, index) => sum + Number(digit) * (index % 2 ? -1 : 1),
      0,
    );
}

function passes(value: number, divisor: Divisor) {
  return value > 0 && value % divisor === 0;
}

function reason(value: number, divisor: Divisor) {
  const digits = String(value);
  const last = Number(digits.at(-1));
  const lastTwo = Number(digits.slice(-2));
  const lastThree = Number(digits.slice(-3));
  const sum = digitSum(value);
  const alternating = alternatingSum(value);
  const rules: Record<Divisor, string> = {
    2: `Last digit is ${last} (${last % 2 === 0 ? "even" : "odd"}).`,
    4: `Last two digits ${lastTwo} ${lastTwo % 4 === 0 ? "are" : "are not"} divisible by 4.`,
    5: `Last digit is ${last}${last === 0 || last === 5 ? "." : ", not 0 or 5."}`,
    6: `Divisible by 2: ${value % 2 === 0 ? "Yes" : "No"}; digit sum ${sum} ${sum % 3 === 0 ? "is" : "is not"} divisible by 3.`,
    8: `Last three digits ${lastThree} ${lastThree % 8 === 0 ? "are" : "are not"} divisible by 8.`,
    10: `Last digit is ${last}${last === 0 ? "." : ", not 0."}`,
    11: `Alternating sum = ${alternating}; ${alternating % 11 === 0 ? "a" : "not a"} multiple of 11.`,
  };
  return rules[divisor];
}

const ruleText: Record<Divisor, string> = {
  2: "Last digit must be even (0, 2, 4, 6, 8).",
  4: "Last two digits must be divisible by 4.",
  5: "Last digit must be 0 or 5.",
  6: "Number must be divisible by both 2 and 3.",
  8: "Last three digits must be divisible by 8.",
  10: "Last digit must be 0.",
  11: "Alternating sum of digits must be a multiple of 11.",
};

export default function DivisibilityTargetLesson10013({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [digits, setDigits] = useState([1, 2, 3, 2]);
  const [expanded, setExpanded] = useState<Divisor | null>(null);
  const [tab, setTab] = useState("INTERACT");
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const value = Number(digits.join("")) || 0;
  const results = divisors.map((divisor) => passes(value, divisor));
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (action: () => void) => {
    action();
    setActions((count) => count + 1);
  };
  const addDigit = (digit: number) =>
    act(() => setDigits((current) => [...current, digit].slice(-7)));
  const dropDigit = (event: DragEvent) => {
    event.preventDefault();
    addDigit(Number(event.dataTransfer.getData("text/plain")));
  };
  const reset = () =>
    act(() => {
      setDigits([1, 2, 3, 2]);
      setExpanded(null);
      setChallengeChecked(false);
    });

  return (
    <section
      className="dv10013-page"
      data-testid="school-mockup-0687"
      data-object-model="dedicated-digit-card-divisibility-engine-and-all-rules-challenge"
      data-number={value}
      data-results={divisors
        .map((divisor, i) => `${divisor}:${results[i]}`)
        .join("|")}
      data-challenge-checked={challengeChecked}
      data-actions={actions}
    >
      <header className="dv10013-hero">
        <small>CLASS 7 · NUMBERS AND ARITHMETIC</small>
        <h1>Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11</h1>
        <p>
          <b>Objective:</b> Test a number for divisibility using rules with
          clear reasoning.
        </p>
        <dl>
          <span>
            Class<b>7</b>
          </span>
          <span>
            Subject<b>Maths</b>
          </span>
          <span>
            Topic<b>Divisibility</b>
          </span>
          <span>
            Duration<b>18 min</b>
          </span>
        </dl>
        <nav>
          {["INTERACT", "LEARN", "WORKED EXAMPLE", "FORMULA", "PRACTICE"].map(
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
        <aside>
          <Link to={prev.route}>← Previous lesson</Link>
          <Link to={next.route}>Next lesson →</Link>
        </aside>
      </header>

      <section className="dv10013-lab">
        <header>
          <h2>Divisibility Lab</h2>
          <button onClick={reset}>
            <RotateCcw />
            Reset lab
          </button>
        </header>
        <ol>
          {[
            "Observe",
            "Manipulate",
            "Notice the pattern",
            "Understand the rule",
            "Try independently",
          ].map((item, i) => (
            <li className={i === 0 ? "active" : ""} key={item}>
              {i + 1} {item}
            </li>
          ))}
        </ol>
        <p>
          <b>Build a number and test it using one-click divisibility rules.</b>{" "}
          See instant results and reasons.
        </p>
        <div className="dv10013-workspace">
          <article className="dv10013-builder">
            <h3>Build a number</h3>
            <b>Use digit cards</b>
            <button className="clear" onClick={() => act(() => setDigits([]))}>
              <Trash2 />
              Clear all
            </button>
            <div className="digit-palette">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", String(digit))
                  }
                  onClick={() => addDigit(digit)}
                  key={digit}
                >
                  {digit}
                </button>
              ))}
            </div>
            <h3>Your number</h3>
            <div
              className="number-drop"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropDigit}
            >
              {digits.map((digit, i) => (
                <button
                  onClick={() =>
                    act(() =>
                      setDigits((current) => current.filter((_, j) => j !== i)),
                    )
                  }
                  key={`${digit}-${i}`}
                >
                  {digit}
                </button>
              ))}
              <strong>{value.toLocaleString("en-IN")}</strong>
            </div>
            <aside>💡 Tip: Drag cards above or click digits to remove.</aside>
            <section className="test-list">
              <header>
                <h3>Divisibility tests</h3>
                <span>
                  All tests completed
                  <CheckCircle2 />
                </span>
              </header>
              {divisors.map((divisor, i) => (
                <button
                  className={expanded === divisor ? "open" : ""}
                  onClick={() =>
                    act(() =>
                      setExpanded(expanded === divisor ? null : divisor),
                    )
                  }
                  key={divisor}
                >
                  <i>{divisor}</i>
                  <b>Divisible by {divisor}</b>
                  <em className={results[i] ? "pass" : "fail"}>
                    {results[i] ? "PASS" : "FAIL"}
                  </em>
                  <span>{reason(value, divisor)}</span>
                  {expanded === divisor && (
                    <small>Rule: {ruleText[divisor]}</small>
                  )}
                </button>
              ))}
            </section>
            <footer>
              <span className="pass">PASS</span> Divisible{" "}
              <span className="fail">FAIL</span> Not divisible <span>—</span>{" "}
              Not applicable
            </footer>
          </article>
          <article className="dv10013-explain">
            <h3>Test explanations</h3>
            {divisors.map((divisor, i) => (
              <section key={divisor}>
                <i>{divisor}</i>
                <p>
                  <b>Rule:</b> {ruleText[divisor]}
                </p>
                <p>{reason(value, divisor)}</p>
                <em className={results[i] ? "pass" : "fail"}>
                  {results[i] ? "PASS" : "FAIL"}
                </em>
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="dv10013-theory">
        <article>
          <h2>Worked Example</h2>
          <p>
            Check <b>2,586</b> for divisibility.
          </p>
          {divisors.map((divisor) => (
            <div key={divisor}>
              <i>{divisor}</i>
              <em className={passes(2586, divisor) ? "pass" : "fail"}>
                {passes(2586, divisor) ? "PASS" : "FAIL"}
              </em>
              <span>{reason(2586, divisor)}</span>
            </div>
          ))}
        </article>
        <article>
          <h2>🏆 Key Rule (Definition)</h2>
          <b>
            A number is divisible by another number if the remainder when the
            first number is divided by the second is 0.
          </b>
          {divisors.map((divisor) => (
            <p key={divisor}>
              <i>{divisor}</i>
              {ruleText[divisor]}
            </p>
          ))}
          <aside>
            <h3>Common Misconception</h3>Don't forget the test for 3 (sum of
            digits) when checking divisibility by 6.
          </aside>
        </article>
      </section>
      <section className="dv10013-challenge">
        <h3>🏆 Challenge (Try this)</h3>
        <p>
          Test the number <b>7,524</b> using all the rules above.
        </p>
        <button onClick={() => act(() => setChallengeChecked(true))}>
          Check my answer
        </button>
        {challengeChecked && (
          <output>7,524 passes 2, 4, 6 and 11; it fails 5, 8 and 10.</output>
        )}
      </section>
      <nav className="dv10013-adjacent">
        <Link to={prev.route}>← Previous lesson</Link>
        <Link to={next.route}>Next lesson →</Link>
        <span>Lesson progress 1 of 7 completed</span>
      </nav>
    </section>
  );
}
