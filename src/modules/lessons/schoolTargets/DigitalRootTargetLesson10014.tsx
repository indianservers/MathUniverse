import { CheckCircle2, Lightbulb, Trash2 } from "lucide-react";
import { useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DigitalRootTargetLesson10014.css";

const sumDigits = (value: number) =>
  String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
function rootSteps(value: number) {
  const steps: { value: number; sum: number }[] = [];
  let current = Math.max(0, Math.floor(value));
  do {
    const sum = sumDigits(current);
    steps.push({ value: current, sum });
    current = sum;
  } while (current > 9);
  return steps;
}
const digitalRoot = (value: number) =>
  value === 0 ? 0 : 1 + ((value - 1) % 9);

function DigitButtons({ onDigit }: { onDigit: (digit: number) => void }) {
  return (
    <div className="dr10014-palette">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <button
          draggable
          onDragStart={(event) =>
            event.dataTransfer.setData("text/plain", String(digit))
          }
          onClick={() => onDigit(digit)}
          key={digit}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}

export default function DigitalRootTargetLesson10014({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [digits, setDigits] = useState([9, 8, 7]);
  const [speed, setSpeed] = useState(50);
  const [tab, setTab] = useState("Interact");
  const [practice, setPractice] = useState<number[]>([]);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [challengeGrade, setChallengeGrade] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const value = Number(digits.join("")) || 0;
  const root = digitalRoot(value);
  const steps = rootSteps(value);
  const practiceValue = Number(practice.join("")) || 0;
  const practiceRoot = digitalRoot(practiceValue);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (action: () => void) => {
    action();
    setActions((count) => count + 1);
  };
  const addMain = (digit: number) =>
    act(() => setDigits((current) => [...current, digit].slice(-8)));
  const dropMain = (event: DragEvent) => {
    event.preventDefault();
    addMain(Number(event.dataTransfer.getData("text/plain")));
  };
  const resetMain = (nextDigits: number[]) => act(() => setDigits(nextDigits));
  const checkChallenge = () =>
    act(() => {
      const answer = Number(challenge);
      setChallengeGrade(
        /^\d{4}$/.test(challenge) && answer % 3 !== 0 && answer % 9 === 0,
      );
    });

  return (
    <section
      className="dr10014-page"
      data-testid="school-mockup-0688"
      data-object-model="dedicated-repeated-digit-sum-digital-root-and-independent-builders"
      data-number={value}
      data-root={root}
      data-steps={steps.map((step) => step.sum).join(",")}
      data-practice-number={practiceValue}
      data-practice-root={practiceChecked ? practiceRoot : ""}
      data-challenge-graded={challengeGrade === null ? "" : challengeGrade}
      data-actions={actions}
    >
      <header className="dr10014-hero">
        <small>CLASS 7 · NUMBERS AND ARITHMETIC</small>
        <h1>Digital Root and Divisibility</h1>
        <p>
          <b>◎ OBJECTIVE:</b> Understand digital root, its link to divisibility
          by 3 and 9, congruence insight, and common mistake.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
          <span>divisibility</span>
        </dl>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="dr10014-tabs">
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
      <section className="dr10014-observe">
        <header>
          <i>1</i>
          <h2>Observe</h2>
          <p>
            See how repeated digit sums lead to a single-digit result (digital
            root).
          </p>
        </header>
        <section className="dr10014-build">
          <article>
            <h3>Build a number (drag digits)</h3>
            <DigitButtons onDigit={addMain} />
          </article>
          <article>
            <h3>Your number</h3>
            <div
              className="dr10014-number"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropMain}
            >
              {digits.map((digit, index) => (
                <button
                  onClick={() =>
                    act(() =>
                      setDigits((current) =>
                        current.filter((_, i) => i !== index),
                      ),
                    )
                  }
                  key={`${digit}-${index}`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </article>
        </section>
        <section className="dr10014-process">
          <article>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Operation</th>
                  <th>Sum</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr key={`${step.value}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{String(step.value).split("").join(" + ")} =</td>
                    <td>{step.sum}</td>
                    <td>
                      {String(step.sum)
                        .split("")
                        .map((digit, i) => (
                          <b key={i}>{digit}</b>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <aside>
              <Lightbulb />
              Continue until only one digit remains. That single digit is the
              digital root.
            </aside>
          </article>
          <article className="dr10014-root">
            <b>Digital root</b>
            <strong>{root}</strong>
            <span>
              (init({value}) = {root})
            </span>
          </article>
          <article className="dr10014-actions">
            <section>
              <h3>Quick actions</h3>
              <button onClick={() => resetMain([])}>Clear</button>
              <button
                onClick={() =>
                  resetMain(
                    Array.from({ length: 3 }, () =>
                      Math.floor(Math.random() * 10),
                    ),
                  )
                }
              >
                Random
              </button>
              <button onClick={() => resetMain([9, 8, 7])}>Example</button>
            </section>
            <section>
              <h3>Animation speed</h3>
              <input
                aria-label="Animation speed"
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
              <footer>
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </footer>
            </section>
          </article>
        </section>
      </section>
      <section className="dr10014-middle">
        <article>
          <header>
            <i>2</i>
            <h2>Manipulate</h2>
            <p>
              Try different numbers to see what the digital root tells about
              divisibility.
            </p>
          </header>
          <section>
            <b>Try these examples</b>
            <div>
              {[12345, 24680, 123456, 87429].map((example) => (
                <button
                  onClick={() =>
                    resetMain(String(example).split("").map(Number))
                  }
                  key={example}
                >
                  {example}
                </button>
              ))}
            </div>
            <h3>Your number</h3>
            <div className="dr10014-mini-digits">
              {digits.map((digit, i) => (
                <b key={i}>{digit}</b>
              ))}
            </div>
          </section>
          <section>
            <h3>Repeated digit sums</h3>
            {steps.map((step, i) => (
              <p key={i}>
                {String(step.value).split("").join(" + ")} = <b>{step.sum}</b>
              </p>
            ))}
            <p>
              Digital root = <b>{root}</b>
            </p>
          </section>
          <footer>
            <article>
              <b>Divisible by 3?</b>
              <strong>{value > 0 && value % 3 === 0 ? "Yes ✓" : "No ✕"}</strong>
            </article>
            <article>
              <b>Divisible by 9?</b>
              <strong>{value > 0 && value % 9 === 0 ? "Yes ✓" : "No ✕"}</strong>
            </article>
            <article>
              <b>Rule check</b>
              <p>
                Digital root is {root} → divisible by{" "}
                {root % 3 === 0 ? "3" : "neither 3 nor 9"}
                {root === 9 ? " and 9" : ", not by 9"}.
              </p>
            </article>
          </footer>
        </article>
        <article>
          <header>
            <i>3</i>
            <h2>Notice the pattern</h2>
            <p>What do you observe?</p>
          </header>
          <p>
            <CheckCircle2 />
            Numbers with digital root 3, 6, or 9 are divisible by 3.
          </p>
          <p>
            <CheckCircle2 />
            Numbers with digital root 9 are divisible by 9.
          </p>
          <small>Test more numbers and confirm!</small>
        </article>
      </section>
      <section className="dr10014-rule">
        <article>
          <header>
            <i>4</i>
            <h2>Understand the rule</h2>
          </header>
          <h3>Key idea</h3>
          <p>Digital root preserves divisibility by 3 and 9.</p>
          <aside>
            <b>RULE:</b> For any whole number n,
            <p>n is divisible by 3 ⇔ digital root of n is 0, 3, 6, or 9.</p>
            <p>n is divisible by 9 ⇔ digital root of n is 0 or 9.</p>
          </aside>
          <h3>Why it works</h3>
          <p>Digit sum is congruent to the number modulo 9:</p>
          <strong>n ≡ (sum of digits of n) (mod 9)</strong>
          <footer>
            <b>Consequence:</b> If n ≡ r (mod 9), then digital root of n = r.
          </footer>
        </article>
        <aside>
          <section>
            <h2>⚠ Common misconception</h2>
            <p>
              <b>Mistake:</b> Thinking the digital root always equals the
              original number.
            </p>
            <p>
              <b>Correction:</b> They are equal only when the original number is
              a single digit.
            </p>
          </section>
          <section>
            <h2>ⓘ Quick insight</h2>
            <p>If digital root = 0, the number is divisible by both 3 and 9.</p>
            <b>
              Example: 1089 → DR = 9<br />
              Divisible by 3: Yes
              <br />
              Divisible by 9: Yes
            </b>
          </section>
        </aside>
      </section>
      <section className="dr10014-practice">
        <article>
          <header>
            <i>5</i>
            <h2>Try independently</h2>
            <p>Explore on your own. Build, test, and check!</p>
          </header>
          <section>
            <h3>Build your own number</h3>
            <DigitButtons
              onDigit={(digit) =>
                act(() => {
                  setPractice((current) => [...current, digit].slice(-8));
                  setPracticeChecked(false);
                })
              }
            />
            <div className="dr10014-practice-drop">
              {practice.map((digit, i) => (
                <button
                  onClick={() =>
                    act(() =>
                      setPractice((current) =>
                        current.filter((_, j) => j !== i),
                      ),
                    )
                  }
                  key={i}
                >
                  {digit}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                act(() => {
                  setPractice([]);
                  setPracticeChecked(false);
                })
              }
            >
              <Trash2 />
              Clear
            </button>
            <button onClick={() => act(() => setPracticeChecked(true))}>
              Check
            </button>
          </section>
          <footer>
            <span>
              Digital root<b>{practiceChecked ? practiceRoot : "—"}</b>
            </span>
            <span>
              Divisible by 3?
              <b>
                {practiceChecked
                  ? practiceValue % 3 === 0
                    ? "Yes"
                    : "No"
                  : "—"}
              </b>
            </span>
            <span>
              Divisible by 9?
              <b>
                {practiceChecked
                  ? practiceValue % 9 === 0
                    ? "Yes"
                    : "No"
                  : "—"}
              </b>
            </span>
          </footer>
        </article>
        <article>
          <h2>Challenge</h2>
          <p>Find a 4-digit number that is:</p>
          <ul>
            <li>not divisible by 3</li>
            <li>divisible by 9</li>
          </ul>
          <label>
            Enter your answer
            <input
              aria-label="Digital root challenge"
              maxLength={4}
              value={challenge}
              onChange={(event) =>
                setChallenge(event.target.value.replace(/\D/g, ""))
              }
            />
            <button onClick={checkChallenge}>Submit</button>
          </label>
          {challengeGrade !== null && (
            <output>
              {challengeGrade
                ? "Correct"
                : "Impossible: every multiple of 9 is also divisible by 3."}
            </output>
          )}
          <footer>
            <b>Hint:</b> Check whether both conditions can be true.
          </footer>
        </article>
      </section>
      <nav className="dr10014-adjacent">
        <Link to={prev.route}>
          ← Previous lesson<b>{prev.title}</b>
        </Link>
        <span>
          Up next<b>Remainder and Factor Patterns</b>
        </span>
        <Link to={next.route}>
          Next lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
