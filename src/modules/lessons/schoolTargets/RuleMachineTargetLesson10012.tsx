import { CheckCircle2, Play, RotateCcw } from "lucide-react";
import { useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RuleMachineTargetLesson10012.css";
type Op = { kind: "add" | "multiply"; value: number };
const palette: Op[] = [1, 2, 3, 5]
  .map((value) => ({ kind: "add", value }) as Op)
  .concat(
    [1, 2, 3].map((value) => ({ kind: "add", value: -value }) as Op),
    [2, 3, 5, 10].map((value) => ({ kind: "multiply", value }) as Op),
  );
const applyOps = (input: number, ops: (Op | null)[]) =>
    ops.reduce<number>(
      (value, op) =>
        op ? (op.kind === "add" ? value + op.value : value * op.value) : value,
      input,
    ),
  opText = (op: Op | null) =>
    op
      ? `${op.kind === "add" ? (op.value >= 0 ? "+" : "−") : "×"} ${Math.abs(op.value)}`
      : "drop";
export default function RuleMachineTargetLesson10012({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const defaults: [Op | null, Op | null, Op | null, Op | null] = [
      { kind: "multiply", value: 1 },
      { kind: "add", value: 3 },
      null,
      null,
    ],
    [ops, setOps] = useState<(Op | null)[]>(defaults),
    [selected, setSelected] = useState<Op | null>(null),
    [customInput, setCustomInput] = useState(""),
    [testInput, setTestInput] = useState(""),
    [testResult, setTestResult] = useState<number | null>(null),
    [practice, setPractice] = useState(["8", "10", "13"]),
    [practiceGrade, setPracticeGrade] = useState<boolean[]>([true, true, true]),
    [challenge, setChallenge] = useState(""),
    [challengeGrade, setChallengeGrade] = useState<boolean | null>(null),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    known = [1, 2, 3, 4],
    knownOutputs = known.map((x) => applyOps(x, ops)),
    accuracy = Math.round(
      (knownOutputs.filter((y, i) => y === known[i] + 3).length /
        known.length) *
        100,
    ),
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1],
    place = (slot: number, op: Op) =>
      act(() => setOps((v) => v.map((x, i) => (i === slot ? op : x)))),
    drop = (event: DragEvent, slot: number) => {
      event.preventDefault();
      place(slot, palette[Number(event.dataTransfer.getData("text/plain"))]);
    },
    reset = () =>
      act(() => {
        setOps(defaults);
        setSelected(null);
        setCustomInput("");
        setTestInput("");
        setTestResult(null);
        setPractice(["8", "10", "13"]);
        setPracticeGrade([true, true, true]);
        setChallenge("");
        setChallengeGrade(null);
      }),
    checkPractice = () =>
      act(() =>
        setPracticeGrade(
          [5, 7, 10].map((x, i) => Number(practice[i]) === applyOps(x, ops)),
        ),
      ),
    checkChallenge = () =>
      act(() =>
        setChallengeGrade(challenge.replace(/\s/g, "").toLowerCase() === "x-3"),
      );
  return (
    <section
      className="rm10012-page"
      data-testid="school-mockup-0686"
      data-object-model="dedicated-drag-drop-operation-block-rule-machine-and-grading-model"
      data-ops={ops.map(opText).join("|")}
      data-known-outputs={knownOutputs.join(",")}
      data-accuracy={accuracy}
      data-test-result={testResult ?? ""}
      data-practice-correct={practiceGrade.filter(Boolean).length}
      data-challenge-graded={challengeGrade === null ? "" : challengeGrade}
      data-actions={actions}
    >
      <header className="rm10012-hero">
        <small>CLASS 6 · PATTERNS</small>
        <h1>Input-Output Rule Machines</h1>
        <p>
          <b>Objective:</b> Identify the rule in a machine that changes each
          input to an output using the same rule.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>Patterns</span>
          <span>Interactive</span>
          <span>Class 6</span>
        </dl>
        <Link to="/lessons/school">← Back to School Lessons</Link>
      </header>
      <nav className="rm10012-tabs">
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
      <section className="rm10012-lab">
        <aside>
          <h2>1 OBSERVE THE MACHINE</h2>
          <p>Enter inputs to see outputs.</p>
          <div>
            <b>Try these inputs or enter your own</b>
            {[1, 2, 3, 4, 5].map((x) => (
              <button
                onClick={() => act(() => setCustomInput(String(x)))}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <input
            aria-label="Custom machine input"
            placeholder="Custom input..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>INPUT</th>
                <th>OUTPUT</th>
              </tr>
            </thead>
            <tbody>
              {known.map((x, i) => (
                <tr key={x}>
                  <td>{x}</td>
                  <td>→ {knownOutputs[i]}</td>
                </tr>
              ))}
              <tr>
                <td>{customInput || "Your input..."}</td>
                <td>
                  →
                  {customInput === ""
                    ? "—"
                    : applyOps(Number(customInput), ops)}
                </td>
              </tr>
            </tbody>
          </table>
          <footer>
            <b>Pattern detected!</b>
            <p>
              Outputs are{" "}
              {accuracy === 100 ? "always 3 more than" : "generated from"} the
              inputs.
            </p>
            <CheckCircle2 />
          </footer>
        </aside>
        <article>
          <header>
            <h2>2 MANIPULATE THE MACHINE</h2>
            <p>Build a rule using operation blocks.</p>
            <button onClick={reset}>
              <RotateCcw />
              Reset machine
            </button>
          </header>
          <div className="machine">
            <b>x</b>
            <i>→</i>
            <span className="operation-slots">
              {ops.map((op, i) => (
                <button
                  className={op ? "filled" : ""}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, i)}
                  onClick={() => selected && place(i, selected)}
                  key={i}
                >
                  {opText(op)}
                </button>
              ))}
            </span>
            <i>→</i>
            <b>y</b>
          </div>
          <h3>Operation blocks</h3>
          <div className="blocks">
            {palette.map((op, i) => (
              <button
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", String(i))
                }
                className={selected === op ? "selected" : ""}
                onClick={() => setSelected(op)}
                key={`${op.kind}${op.value}`}
              >
                {opText(op)}
              </button>
            ))}
          </div>
          <section>
            <article>
              <h3>Test your rule</h3>
              <input
                aria-label="Test machine input"
                placeholder="Enter number..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
              <button
                onClick={() =>
                  act(() => setTestResult(applyOps(Number(testInput), ops)))
                }
              >
                <Play />
                Run
              </button>
            </article>
            <article>
              <h3>Result</h3>
              <p>Input → Output</p>
              <strong>{testResult ?? "—"}</strong>
            </article>
            <article>
              <h3>Accuracy</h3>
              <strong>{accuracy}%</strong>
              <p>
                {knownOutputs.filter((y, i) => y === known[i] + 3).length}/4
                correct
              </p>
            </article>
          </section>
        </article>
      </section>
      <section className="rm10012-theory">
        <article>
          <h2>3 NOTICE THE PATTERN</h2>
          <p>Look at the input-output pairs.</p>
          <table>
            <thead>
              <tr>
                <th>INPUT</th>
                <th>OUTPUT</th>
                <th>CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {known.map((x, i) => (
                <tr key={x}>
                  <td>{x}</td>
                  <td>→ {knownOutputs[i]}</td>
                  <td>
                    {knownOutputs[i] - x >= 0 ? "+" : ""}
                    {knownOutputs[i] - x}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <b>The output is always 3 more than the input.</b>
        </article>
        <article>
          <h2>4 UNDERSTAND THE RULE</h2>
          <p>Rule (general form):</p>
          <strong>y = x + 3</strong>
          <p>Meaning: Add 3 to the input to get the output.</p>
          <aside>
            <b>Definition</b>
            <p>
              An input-output rule machine applies the same operation(s) to
              every input.
            </p>
          </aside>
        </article>
        <article>
          <h2>⚠ Common Misconception</h2>
          <p>Thinking the rule is × 3.</p>
          <p>
            1 × 3 = 3 (not 4)
            <br />2 × 3 = 6 (not 5)
          </p>
          <p>So, the rule is not × 3.</p>
        </article>
      </section>
      <section className="rm10012-worked">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Let's verify the rule y = x + 3.</p>
        </article>
        <table>
          <tbody>
            <tr>
              <th>Input (x)</th>
              {[1, 2, 3, 4, 10].map((x) => (
                <td key={x}>{x}</td>
              ))}
            </tr>
            <tr>
              <th>Apply rule: x + 3</th>
              {[1, 2, 3, 4, 10].map((x) => (
                <td key={x}>{x} + 3</td>
              ))}
            </tr>
            <tr>
              <th>Output (y)</th>
              {[1, 2, 3, 4, 10].map((x) => (
                <td key={x}>{x + 3}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <aside>
          <b>✓ All outputs match!</b>
          <p>The rule y = x + 3 works for every input.</p>
        </aside>
      </section>
      <section className="rm10012-practice">
        <article>
          <h2>5 TRY IT INDEPENDENTLY</h2>
          <p>Predict the output for each input using the rule.</p>
          <table>
            <thead>
              <tr>
                <th>Input (x)</th>
                <th>Your predicted output (y)</th>
                <th>Check</th>
              </tr>
            </thead>
            <tbody>
              {[5, 7, 10].map((x, i) => (
                <tr key={x}>
                  <td>{x}</td>
                  <td>
                    <input
                      aria-label={`Rule answer ${i + 1}`}
                      value={practice[i]}
                      onChange={(e) =>
                        setPractice((v) =>
                          v.map((a, j) => (j === i ? e.target.value : a)),
                        )
                      }
                    />
                  </td>
                  <td>{practiceGrade[i] ? "✓" : "✕"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={checkPractice}>Check all</button>
          <b>{practiceGrade.filter(Boolean).length}/3 correct</b>
        </article>
        <article>
          <h2>CHALLENGE</h2>
          <p>
            The machine below has a different rule. Find the rule and predict
            the missing output.
          </p>
          <table>
            <tbody>
              <tr>
                <th>Input</th>
                <td>2</td>
                <td>5</td>
                <td>8</td>
                <td>11</td>
              </tr>
              <tr>
                <th>Output</th>
                <td>−1</td>
                <td>2</td>
                <td>?</td>
                <td>8</td>
              </tr>
            </tbody>
          </table>
          <label>
            What is the rule?
            <input
              aria-label="Challenge rule"
              placeholder="Type your rule (e.g., y = x − 3)"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
            />
            <button onClick={checkChallenge}>Check</button>
          </label>
          {challengeGrade !== null && (
            <output>
              {challengeGrade
                ? "Correct: y = x − 3, so 8 → 5."
                : "Compare each input and output."}
            </output>
          )}
        </article>
      </section>
      <nav className="rm10012-adjacent">
        <Link to={prev.route}>
          ← Previous Lesson<b>{prev.title}</b>
        </Link>
        <span>Lesson progress 4 / 5</span>
        <Link to={next.route}>
          Next Lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
