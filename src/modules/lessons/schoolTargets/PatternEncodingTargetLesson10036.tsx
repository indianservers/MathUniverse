import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PatternEncodingTargetLesson10036.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
type Operation = "Shift" | "Mirror" | "Swap" | "Jump";
const clean = (word: string) => word.toUpperCase().replace(/[^A-Z]/g, "");
function encode(
  word: string,
  operation: Operation,
  amount: number,
  direction: "Left" | "Right",
) {
  const letters = clean(word).split("");
  if (operation === "Swap")
    return letters
      .map(
        (_, index) =>
          letters[index % 2 ? index - 1 : index + 1] ?? letters[index],
      )
      .join("");
  return letters
    .map((letter, index) => {
      const position = alphabet.indexOf(letter);
      if (operation === "Mirror") return alphabet[25 - position];
      const distance = operation === "Jump" ? amount + index : amount;
      const signed = direction === "Right" ? distance : -distance;
      return alphabet[(position + signed + 260) % 26];
    })
    .join("");
}

export default function PatternEncodingTargetLesson10036({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [operation, setOperation] = useState<Operation>("Shift");
  const [direction, setDirection] = useState<"Left" | "Right">("Right");
  const [amount, setAmount] = useState(2);
  const [word, setWord] = useState("CODE");
  const [tab, setTab] = useState("Interact");
  const [showSteps, setShowSteps] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [challengeWord, setChallengeWord] = useState("BRIDGE");
  const [ruleText, setRuleText] = useState("Shift each letter forward by 2");
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "retry"
  >("idle");
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const output = encode(word, operation, amount, direction);
  const challengeOutput = encode(challengeWord, "Shift", 2, "Right");
  const ruleDescription =
    operation === "Mirror"
      ? "Mirror each letter across the alphabet"
      : operation === "Swap"
        ? "Swap each neighbouring pair"
        : `${operation} ${direction === "Right" ? "forward" : "backward"} by ${amount}${operation === "Jump" ? " plus its position" : ""}`;
  const reset = () =>
    act(() => {
      setOperation("Shift");
      setDirection("Right");
      setAmount(2);
      setWord("CODE");
      setTab("Interact");
      setShowSteps(false);
      setAnimating(false);
      setChallengeWord("BRIDGE");
      setRuleText("Shift each letter forward by 2");
      setChallengeResult("idle");
    });
  return (
    <section
      className="pattern10036-page"
      data-testid="school-mockup-0710"
      data-object-model="dedicated-live-alphabet-rule-encoding-machine"
      data-operation={operation}
      data-direction={direction}
      data-amount={amount}
      data-word={clean(word)}
      data-output={output}
      data-steps={showSteps}
      data-challenge-output={challengeOutput}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="pattern10036-hero">
        <small>CLASS 8 - INFORMATION PROCESSING</small>
        <h1>Pattern Encoding</h1>
        <p>
          Discover and apply rules that encode visual or numerical patterns.
        </p>
        <div>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>learning</span>
        </div>
        <Link to="/lessons/school">School lessons</Link>
        <div className="lock">code</div>
      </header>
      <nav className="pattern10036-tabs">
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
      <section className="pattern10036-machine">
        <header>
          <div>
            <h2>INPUT-OUTPUT CODE MACHINE</h2>
            <p>
              Set a rule using position-based operations, then test it on
              examples.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset
          </button>
        </header>
        <aside className="rule-builder">
          <h3>
            <b>1</b> Build the rule
          </h3>
          <p>Choose a position rule.</p>
          <div className="operations">
            {(["Shift", "Mirror", "Swap", "Jump"] as Operation[]).map(
              (item) => (
                <button
                  aria-label={item}
                  className={operation === item ? "active" : ""}
                  onClick={() => act(() => setOperation(item))}
                  key={item}
                >
                  <i>{item[0]}</i>
                  {item}
                </button>
              ),
            )}
          </div>
          <label>Direction</label>
          <div className="directions">
            <button
              className={direction === "Left" ? "active" : ""}
              onClick={() => act(() => setDirection("Left"))}
            >
              <ArrowLeft size={13} /> Left
            </button>
            <button
              className={direction === "Right" ? "active" : ""}
              onClick={() => act(() => setDirection("Right"))}
            >
              Right <ArrowRight size={13} />
            </button>
          </div>
          <label>Amount</label>
          <div className="stepper">
            <button
              onClick={() => act(() => setAmount((n) => Math.max(1, n - 1)))}
            >
              -
            </button>
            <b>{amount}</b>
            <button
              onClick={() => act(() => setAmount((n) => Math.min(25, n + 1)))}
            >
              +
            </button>
          </div>
          <article>
            <small>Rule being tested</small>
            <strong>{ruleDescription}</strong>
          </article>
        </aside>
        <main className="pattern10036-examples">
          <header>
            <div>
              <h3>
                <b>2</b> See the rule in action
              </h3>
              <p>Watch how the rule transforms each position.</p>
            </div>
            <label>
              Animate{" "}
              <button
                aria-label="Animate encoding"
                className={animating ? "on" : ""}
                onClick={() => act(() => setAnimating((v) => !v))}
              >
                <Play size={11} />
              </button>
            </label>
            <button onClick={() => act(() => setShowSteps((v) => !v))}>
              <RefreshCw size={13} /> {showSteps ? "Hide steps" : "Show steps"}
            </button>
          </header>
          <div className="example-table">
            <div className="table-head">
              <b>Input</b>
              <b>Positions</b>
              <b>Output</b>
            </div>
            {["MATH", "BOOK", "PEAR"].map((input) => (
              <EncodingRow
                key={input}
                input={input}
                output={encode(input, operation, amount, direction)}
                amount={amount}
                showSteps={showSteps}
              />
            ))}
            <div className="your-turn">
              <div>
                <b>Your turn</b>
                <small>Type a word to test the rule.</small>
              </div>
              <input
                aria-label="Word to encode"
                value={word}
                maxLength={10}
                onChange={(event) => act(() => setWord(event.target.value))}
              />
              <ArrowRight size={22} />
              <output>{output}</output>
              <span>
                <CheckCircle2 size={17} /> Correct!
              </span>
            </div>
          </div>
        </main>
        <section className="alphabet">
          <h3>Alphabet (A to Z)</h3>
          <div>
            {alphabet.split("").map((letter, index) => (
              <span
                key={letter}
                className={showSteps && index < amount ? "moved" : ""}
              >
                {letter}
              </span>
            ))}
          </div>
          <footer>
            <span>
              <b>1</b> Original position
            </span>
            <span>
              <b>3</b> New position (original + {amount})
            </span>
            <em>Tip: Positions start from 1.</em>
          </footer>
        </section>
      </section>
      <section className="pattern10036-theory">
        <article>
          <h2>Why it works</h2>
          <p>
            This rule changes each letter based on its position in the alphabet.
            Adding {amount} moves every letter {amount} steps{" "}
            {direction === "Right" ? "forward" : "backward"}. The same rule is
            applied to every position, so it produces an output for any input.
          </p>
          <PositionTable amount={amount} />
        </article>
        <article className="solved">
          <h2>
            Worked example <b>SOLVED</b>
          </h2>
          <p>{ruleDescription}.</p>
          <div>
            <span>
              M A T H<small>13 1 20 8</small>
            </span>
            <ArrowRight />
            <span>
              {encode("MATH", operation, amount, direction)}
              <small>
                {encode("MATH", operation, amount, direction)
                  .split("")
                  .map((l) => alphabet.indexOf(l) + 1)
                  .join("  ")}
              </small>
            </span>
          </div>
          <p>The rule reproduces the output exactly.</p>
        </article>
        <article className="mistake">
          <h2>Common mistake</h2>
          <strong>
            Guessing from one example can fit many incorrect rules.
          </strong>
          <p>Always test on multiple examples before finishing.</p>
        </article>
      </section>
      <section className="pattern10036-challenge">
        <header>
          <h2>
            Mini challenge <span>Try it</span>
          </h2>
          <p>Infer the code from the examples, then encode the new word.</p>
        </header>
        <article>
          <h3>Given examples</h3>
          <p>
            CAT <b>ECV</b>
          </p>
          <p>
            BOOK <b>DQQM</b>
          </p>
          <p>
            SUN <b>UWP</b>
          </p>
        </article>
        <article>
          <h3>Your rule</h3>
          <label>
            Type your rule in words.
            <input
              aria-label="Inferred rule"
              value={ruleText}
              onChange={(e) =>
                act(() => {
                  setRuleText(e.target.value);
                  setChallengeResult("idle");
                })
              }
            />
          </label>
          <p className="success">
            <CheckCircle2 size={13} /> Great! Your rule matches all three
            examples.
          </p>
        </article>
        <article>
          <h3>Test it</h3>
          <label>
            Encode the new word.
            <input
              aria-label="Challenge word"
              value={challengeWord}
              onChange={(e) =>
                act(() => {
                  setChallengeWord(e.target.value);
                  setChallengeResult("idle");
                })
              }
            />
          </label>
          <output>{challengeOutput}</output>
          <span className="success">
            <CheckCircle2 size={13} />{" "}
            {challengeResult === "retry" ? "Check the +2 rule" : "Correct!"}
          </span>
          <div>
            <button
              onClick={() =>
                act(() => {
                  setChallengeWord(["NUMBER", "LOGIC", "PATTERN"][actions % 3]);
                  setChallengeResult("idle");
                })
              }
            >
              <RefreshCw size={13} /> New word
            </button>
            <button
              className="check"
              onClick={() =>
                act(() =>
                  setChallengeResult(
                    /forward\s+by\s+2|\+\s*2/i.test(ruleText)
                      ? "correct"
                      : "retry",
                  ),
                )
              }
            >
              Check again
            </button>
          </div>
        </article>
      </section>
      <nav className="pattern10036-adjacent">
        <Link to="/lessons/school/class-8/class-8-information-processing-flowchart-logic">
          <ArrowLeft size={13} /> Previous lesson
          <br />
          Flowchart Logic
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-8/class-8-information-processing-magic-squares"
        >
          Next lesson
          <br />
          Magic Squares <ArrowRight size={13} />
        </Link>
      </nav>
    </section>
  );
}

function EncodingRow({
  input,
  output,
  amount,
  showSteps,
}: {
  input: string;
  output: string;
  amount: number;
  showSteps: boolean;
}) {
  return (
    <div className={`encoding-row ${showSteps ? "steps" : ""}`}>
      <strong>{input.split("").join("  ")}</strong>
      <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <i>+{amount}</i>
      </div>
      <strong>{output.split("").join("  ")}</strong>
    </div>
  );
}
function PositionTable({ amount }: { amount: number }) {
  return (
    <div className="position-table">
      <p>
        <b>Position</b>
        <span>1 2 3 4 5 ...</span>
      </p>
      <p>
        <b>Letter</b>
        <span>A B C D E ...</span>
      </p>
      <p>
        <b>New letter</b>
        <span>
          {alphabet
            .slice(amount, amount + 5)
            .split("")
            .join("  ")}{" "}
          ...
        </span>
      </p>
    </div>
  );
}
