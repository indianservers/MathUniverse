import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FactorisationPracticeTargetLesson10052.css";

type Method =
  "Common Factor" | "Difference of Squares" | "Grouping" | "Zero Factor";
const models: Record<
  Method,
  {
    polynomial: string;
    factor: string;
    inside: string;
    result: string;
    lines: string[];
  }
> = {
  "Common Factor": {
    polynomial: "6x² + 9x",
    factor: "3x",
    inside: "2x + 3",
    result: "3x(2x + 3)",
    lines: ["3x · 2x + 3x · 3", "6x² + 9x"],
  },
  "Difference of Squares": {
    polynomial: "x² − 9",
    factor: "x − 3",
    inside: "x + 3",
    result: "(x − 3)(x + 3)",
    lines: ["x² + 3x − 3x − 9", "x² − 9"],
  },
  Grouping: {
    polynomial: "ax + ay + bx + by",
    factor: "a + b",
    inside: "x + y",
    result: "(a + b)(x + y)",
    lines: ["a(x+y)+b(x+y)", "ax + ay + bx + by"],
  },
  "Zero Factor": {
    polynomial: "x² − 5x",
    factor: "x",
    inside: "x − 5",
    result: "x(x − 5)",
    lines: ["x · x − x · 5", "x² − 5x"],
  },
};
const questions = [
  ["4x² + 12x", "4x(x + 3)", "4x² + 12x"],
  ["x² − 9", "(x − 3)(x + 3)", "x² − 9"],
  ["2x² + 7x − 4", "(2x − 1)(x + 4)", "2x² + 7x − 4"],
  ["x³ − x", "x(x − 1)(x + 1)", "x³ − x"],
] as const;
const compact = (value: string) =>
  value.replace(/[\s·]/g, "").replace(/−/g, "-");

export default function FactorisationPracticeTargetLesson10052({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [method, setMethod] = useState<Method>("Common Factor");
  const [placed, setPlaced] = useState(true);
  const [tab, setTab] = useState("INTERACT");
  const [answers, setAnswers] = useState(questions.map((q) => q[1]));
  const [expanded, setExpanded] = useState(questions.map((q) => q[2]));
  const [actions, setActions] = useState(0);
  const model = models[method];
  const correct = questions.map(
    (q, i) =>
      compact(answers[i]) === compact(q[1]) &&
      compact(expanded[i]) === compact(q[2]),
  );
  const score = correct.filter(Boolean).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const choose = (next: Method) =>
    act(() => {
      setMethod(next);
      setPlaced(true);
    });
  const reset = () =>
    act(() => {
      setMethod("Common Factor");
      setPlaced(false);
    });
  const update = (which: "answer" | "expanded", index: number, value: string) =>
    act(() => {
      const setter = which === "answer" ? setAnswers : setExpanded;
      setter((current) =>
        current.map((item, i) => (i === index ? value : item)),
      );
    });
  return (
    <section
      className="fp10052-page"
      data-testid="school-mockup-0726"
      data-object-model="dedicated-four-method-factorisation-and-expansion-verification-engine"
      data-method={method}
      data-polynomial={model.polynomial}
      data-factor={placed ? model.factor : ""}
      data-result={placed ? model.result : ""}
      data-score={score}
      data-actions={actions}
    >
      <header className="fp10052-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Polynomial Factorisation Practice</h1>
        <p>
          Factor polynomials by choosing common factors, identities, grouping or
          zero-based methods.
        </p>
        <div>
          <span>Level: INTERMEDIATE</span>
          <span>Subject: Mathematics</span>
          <span>Topic: Polynomials</span>
          <span>Est. time: 20 min</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="fp10052-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="fp10052-board">
          <h2>FACTORISATION BOARD</h2>
          <div className="fp10052-work">
            <article className="fp10052-controls">
              <small>POLYNOMIAL</small>
              <h3>{model.polynomial}</h3>
              <div>
                <b>STAGE 1 OF 3</b>
                <p>Choose the best factorisation method.</p>
              </div>
              <label>
                Method
                <select
                  value={method}
                  onChange={(e) => choose(e.target.value as Method)}
                >
                  {Object.keys(models).map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
              <p>
                Drag the greatest common factor or method tile from the terms.
              </p>
              <b>Terms</b>
              <div className="fp10052-terms">
                <button
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("factor", model.factor)
                  }
                >
                  {model.polynomial.split(" + ")[0]}
                </button>
                <button
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("factor", model.factor)
                  }
                >
                  {model.polynomial.split(" + ")[1] || model.inside}
                </button>
              </div>
              <b>Common factor (drag here)</b>
              <button
                className="fp10052-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                  act(() =>
                    setPlaced(
                      e.dataTransfer.getData("factor") === model.factor,
                    ),
                  )
                }
                onClick={() => act(() => setPlaced(!placed))}
              >
                {placed ? model.factor : "Drop factor"}
              </button>
            </article>
            <article className="fp10052-result">
              <h2>YOUR FACTORISATION</h2>
              <div className="fp10052-factor">
                <strong>{placed ? model.factor : "?"}</strong>
                <b>(</b>
                <strong>{placed ? model.inside.split(" ")[0] : "?"}</strong>
                <b>{model.inside.includes(" + ") ? "+" : "−"}</b>
                <strong>{placed ? model.inside.split(" ").at(-1) : "?"}</strong>
                <b>)</b>
              </div>
              <h2>CHECK BY EXPANSION</h2>
              <div className="fp10052-expand">
                <p>
                  Expand:{" "}
                  <b>{placed ? model.result : "Place a factor first"}</b>
                </p>
                {model.lines.map((line) => (
                  <p key={line}>= {placed ? line : "—"}</p>
                ))}
                {placed && (
                  <strong>
                    <Check /> Matches the original polynomial!
                  </strong>
                )}
              </div>
              <footer className={placed ? "good" : "wait"}>
                <Check />{" "}
                {placed
                  ? "Perfect! Your factorisation is correct."
                  : "Place the common factor to verify."}
                <small>
                  Rule: A correct factorisation expands exactly to the original
                  polynomial.
                </small>
              </footer>
            </article>
          </div>
          <div className="fp10052-methods">
            <b>
              METHODS <small>(Try different approaches)</small>
            </b>
            {(Object.keys(models) as Method[]).map((name) => (
              <button
                key={name}
                className={method === name ? "active" : ""}
                onClick={() => choose(name)}
              >
                <strong>{name}</strong>
                <span>
                  {name === "Difference of Squares"
                    ? "a² − b²"
                    : name === "Grouping"
                      ? "(ax + ay) + (bx + by)"
                      : name === "Zero Factor"
                        ? "If p(x)=0 ⇒ (x−k)"
                        : ""}
                </span>
              </button>
            ))}
            <button onClick={reset}>
              <RotateCcw /> Reset Board
            </button>
          </div>
        </section>
        <section className="fp10052-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              Factorisation rewrites a polynomial as a product of simpler
              expressions.
            </p>
            <p>✓ It reveals structure and common factors.</p>
            <p>✓ It helps solve equations and simplify expressions.</p>
            <p>✓ Verification by expansion ensures accuracy.</p>
          </article>
          <article>
            <h2>▣ WORKED EXAMPLE</h2>
            <p>
              Factorise: <b>6x² + 9x</b>
            </p>
            <p>① GCF of 6x² and 9x is 3x.</p>
            <p>② Factor out 3x: 3x(2x+3).</p>
            <p>③ Check: 3x(2x+3)=6x²+9x ✓</p>
            <strong>Answer: 3x(2x + 3)</strong>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> WARNING: COMMON MISTAKE
            </h2>
            <p>
              Stopping after a partial factorisation can leave further common
              factors.
            </p>
            <div>
              <b>Incorrect:</b> 6x²+9x=3(2x²+3x)
              <br />
              <b>Correct:</b> 6x²+9x=3x(2x+3)
            </div>
            <strong>Always check for any remaining common factors!</strong>
          </article>
        </section>
        <section className="fp10052-challenge">
          <header>
            <div>
              <h2>CHALLENGE: FACTOR &amp; VERIFY</h2>
              <p>
                Factor each polynomial completely. Then expand your answer to
                verify.
              </p>
            </div>
            <b>
              <Trophy /> {score}/4 to master
            </b>
          </header>
          <div className="fp10052-table">
            <b>#</b>
            <b>Polynomial</b>
            <b>Your Factorisation</b>
            <b>Expand to Verify</b>
            <b>Status</b>
            {questions.map((q, i) => (
              <div className="fp10052-row" key={q[0]}>
                <i>{i + 1}</i>
                <span>{q[0]}</span>
                <input
                  aria-label={`Factorisation ${i + 1}`}
                  value={answers[i]}
                  onChange={(e) => update("answer", i, e.target.value)}
                />
                <input
                  aria-label={`Expansion ${i + 1}`}
                  value={expanded[i]}
                  onChange={(e) => update("expanded", i, e.target.value)}
                />
                <strong className={correct[i] ? "correct" : "retry"}>
                  <Check /> {correct[i] ? "Correct" : "Retry"}
                </strong>
              </div>
            ))}
          </div>
          {score === 4 && (
            <footer>
              <Trophy /> Excellent! You've factored and verified all expressions
              correctly.
            </footer>
          )}
        </section>
      </main>
      <nav className="fp10052-adjacent">
        <Link to="/lessons/school/class-9/class-9-polynomials-cubic-algebraic-identities">
          <ArrowLeft /> Previous Lesson
        </Link>
        <Link to="/lessons/school">
          Next Lesson <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
