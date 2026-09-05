import { CheckCircle2, Info, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./OrderDegreeDifferentialEquationTargetLesson10187.css";

type Term = "third" | "first" | "y";
const examples = [
  {
    equation: "y″ + (y′)³ = 0",
    order: "2",
    degree: "1",
    note: "Polynomial in derivatives",
  },
  {
    equation: "(y″)² + y′ = 0",
    order: "2",
    degree: "2",
    note: "Polynomial in derivatives",
  },
  {
    equation: "sin(y′) + y = 0",
    order: "1",
    degree: "Not defined",
    note: "Not polynomial in derivatives",
  },
  {
    equation: "√y″ + y = 0",
    order: "2",
    degree: "1",
    note: "Square first: y″ = y²",
  },
];

export default function OrderDegreeDifferentialEquationTargetLesson10187({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [selected, setSelected] = useState<Term>("third");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [sort, setSort] = useState<"default" | "order" | "degree" | "name">(
    "default",
  );
  const [concept, setConcept] = useState("");
  const [conceptFeedback, setConceptFeedback] = useState("");
  const [answers, setAnswers] = useState([
    "",
    "",
    "",
    "Not defined",
    "",
    "Not defined",
  ]);
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const selectedOrder = selected === "third" ? 3 : selected === "first" ? 1 : 0;
  const selectedDegree =
    selected === "third" ? 2 : selected === "first" ? 4 : 1;
  const ordered =
    sort === "default"
      ? examples
      : [...examples].sort((a, b) =>
          sort === "name"
            ? a.equation.localeCompare(b.equation)
            : Number(a[sort]) - Number(b[sort]),
        );
  const update = (index: number, value: string) =>
    setAnswers((old) => old.map((item, i) => (i === index ? value : item)));
  const checkPractice = () =>
    setPracticeFeedback(
      answers.join("|") === "3|1|1|Not defined|2|Not defined"
        ? "Correct: all three equations are classified."
        : "Review the highest derivative first, then test polynomial form before assigning degree.",
    );
  const reset = () => {
    setSelected("third");
    setRevealed([]);
    setSort("default");
    setConcept("");
    setConceptFeedback("");
    setAnswers(["", "", "", "Not defined", "", "Not defined"]);
    setPracticeFeedback("");
  };
  return (
    <main
      className="ode10187-page"
      data-testid="school-mockup-0861"
      data-object-model="dedicated-order-degree-equation-classifier"
      data-selected-term={selected}
      data-selected-order={selectedOrder}
      data-selected-degree={selectedDegree}
    >
      <header className="ode-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Order and Degree of a Differential Equation</h1>
        <p>
          Classify a differential equation by its order (highest derivative) and
          degree (exponent of the highest order derivative) after clearing
          radicals and fractions and ensuring polynomial form in derivatives.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
        </div>
      </header>
      <section className="ode-anatomy">
        <div className="ode-title">
          <div>
            <h3>EQUATION ANATOMY CLASSIFIER &nbsp; ⓘ</h3>
            <p>
              <b>
                Click derivative terms to identify the highest order derivative
                (order)
              </b>
              <br />
              and its exponent (degree) after simplifying to polynomial form.
            </p>
          </div>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </div>
        <div className="ode-classifier">
          <div className="ode-equation">
            <div>
              <button
                type="button"
                className={selected === "third" ? "active" : ""}
                onClick={() => setSelected("third")}
              >
                (d³y/dx³)²
              </button>
              <b> + </b>
              <button
                type="button"
                className={selected === "first" ? "active" : ""}
                onClick={() => setSelected("first")}
              >
                (dy/dx)⁴
              </button>
              <b> + </b>
              <button
                type="button"
                className={selected === "y" ? "active" : ""}
                onClick={() => setSelected("y")}
              >
                y
              </button>
              <b> = 0</b>
            </div>
            <aside>
              <span>● &nbsp; Highest derivative (order)</span>
              <span>◉ &nbsp; Exponent of highest derivative (degree)</span>
            </aside>
          </div>
          <aside className="ode-result">
            <h3>
              CLASSIFICATION{" "}
              <em>
                {selected === "third" ? "✓ Correct!" : "Inspect the equation"}
              </em>
            </h3>
            <p>
              <b>Order</b> (highest derivative)
            </p>
            <strong>{selectedOrder}</strong>
            <div>
              From{" "}
              {selected === "third"
                ? "d³y/dx³"
                : selected === "first"
                  ? "dy/dx"
                  : "y"}
            </div>
            <hr />
            <p>
              <b>Degree</b> (exponent of highest derivative)
            </p>
            <strong className="purple">{selectedDegree}</strong>
            <div>Exponent on the selected term</div>
            <article>
              <CheckCircle2 /> <b>Polynomial in derivatives: Yes</b>
              <p>All derivative exponents are non-negative integers.</p>
            </article>
          </aside>
        </div>
        <div className="ode-how">
          <h3>HOW IT WORKS →</h3>
          <div>
            <span>◎</span>
            <p>
              <b>1. Click derivative terms</b>
              <br />
              Select derivative terms.
            </p>
            <span>▥</span>
            <p>
              <b>2. Find highest derivative</b>
              <br />
              Identify its order.
            </p>
            <span>xⁿ</span>
            <p>
              <b>3. Read its exponent</b>
              <br />
              Take the exponent.
            </p>
            <span>✓</span>
            <p>
              <b>4. Verify polynomial form</b>
              <br />
              Degree needs a polynomial.
            </p>
          </div>
        </div>
      </section>
      <section className="ode-examples">
        <div className="ode-example-title">
          <h3>EXAMPLE CLASSIFIER</h3>
          <div>
            Sort by:{" "}
            <button
              className={sort === "order" ? "active" : ""}
              onClick={() => setSort("order")}
            >
              Order
            </button>
            <button
              className={sort === "degree" ? "active" : ""}
              onClick={() => setSort("degree")}
            >
              Degree
            </button>
            <button
              className={sort === "name" ? "active" : ""}
              onClick={() => setSort("name")}
            >
              Name A-Z
            </button>
          </div>
        </div>
        <div className="ode-example-grid">
          {ordered.map((item) => {
            const index = examples.indexOf(item);
            const open = revealed.includes(index);
            return (
              <article key={item.equation}>
                <i>{index + 1}</i>
                <div className="formula">{item.equation}</div>
                <div className="stats">
                  <span>
                    Order <b>{item.order}</b>
                  </span>
                  <span>
                    Degree <b>{item.degree}</b>
                  </span>
                </div>
                <p className={item.degree === "Not defined" ? "warn" : "good"}>
                  {item.note}
                </p>
                {open && (
                  <p className="solution">
                    {index === 2
                      ? "sin(y′) is not polynomial, so degree is undefined."
                      : index === 3
                        ? "Squaring gives y″ = y²; highest derivative has exponent 1."
                        : `Highest derivative order ${item.order}, exponent ${item.degree}.`}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setRevealed((old) =>
                      open ? old.filter((n) => n !== index) : [...old, index],
                    )
                  }
                >
                  {open ? "Hide solution" : "View solution"}
                </button>
              </article>
            );
          })}
        </div>
        <p className="ode-note">
          💡 Degree is defined only when the equation is polynomial in
          derivatives.
        </p>
      </section>
      <div className="ode-concept-row">
        <section>
          <h3>▥ CONCEPT CHECK</h3>
          <div className="formula">For (d³y/dx³)² + (dy/dx)⁴ + y = 0</div>
          <p>
            <b>What is the order and degree?</b>
          </p>
          {[
            "Order = 3, Degree = 2",
            "Order = 4, Degree = 2",
            "Order = 3, Degree = 4",
            "Order = 2, Degree = 2",
          ].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="concept-10187"
                checked={concept === v}
                onChange={() => setConcept(v)}
              />{" "}
              {v}
            </label>
          ))}
          <button
            type="button"
            onClick={() =>
              setConceptFeedback(
                concept === "Order = 3, Degree = 2"
                  ? "Correct: order 3 and degree 2."
                  : "Find the highest derivative, not the largest exponent.",
              )
            }
          >
            <CheckCircle2 /> Check answer
          </button>
          {conceptFeedback && (
            <p
              className={
                conceptFeedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {conceptFeedback}
            </p>
          )}
        </section>
        <section className="ode-misconception">
          <h3>
            <XCircle /> COMMON MISCONCEPTION
          </h3>
          <h4>Order is NOT the largest exponent.</h4>
          <p>The largest exponent here is 4, but it belongs to (dy/dx)⁴.</p>
          <p>
            Order is determined by the highest derivative order, not the largest
            exponent.
          </p>
          <div>💡 Always find the highest order derivative first.</div>
        </section>
      </div>
      <section className="ode-practice">
        <div>
          <h3>PRACTICE NOW</h3>
          <p>
            Classify each differential equation. Provide order and degree (if
            defined).
          </p>
          {[
            ["y‴ − 5y″ + (y′)² + y = 0", 0],
            ["eʸ′ + y = 0", 2],
            ["d²y/dx² + (dy/dx)⁻¹ + y = 0", 4],
          ].map(([text, start], row) => (
            <div className="ode-practice-row" key={String(text)}>
              <b>{row + 1}</b>
              <span>{text}</span>
              <label>
                Order
                <select
                  aria-label={`Practice ${row + 1} order`}
                  value={answers[Number(start)]}
                  onChange={(e) => update(Number(start), e.target.value)}
                >
                  <option value="">Select</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </label>
              <label>
                Degree
                <select
                  aria-label={`Practice ${row + 1} degree`}
                  value={answers[Number(start) + 1]}
                  onChange={(e) => update(Number(start) + 1, e.target.value)}
                >
                  <option value="">Select</option>
                  <option>1</option>
                  <option>2</option>
                  <option value="Not defined">Not defined</option>
                </select>
              </label>
            </div>
          ))}
          <div className="ode-practice-actions">
            <button type="button" onClick={checkPractice}>
              ◇ &nbsp; Check all
            </button>
            <button
              type="button"
              onClick={() =>
                setAnswers(["3", "1", "1", "Not defined", "2", "Not defined"])
              }
            >
              Show solutions
            </button>
          </div>
          {practiceFeedback && (
            <p
              className={
                practiceFeedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {practiceFeedback}
            </p>
          )}
        </div>
        <aside>
          <h3>
            QUICK REFERENCE <Info />
          </h3>
          <ul>
            <li>
              <b>Order:</b> Highest order derivative present.
            </li>
            <li>
              <b>Degree:</b> Exponent of the highest derivative after
              simplifying to polynomial form.
            </li>
            <li>
              Degree is defined only for polynomial equations in derivatives.
            </li>
            <li>If radicals or fractions exist, simplify first.</li>
          </ul>
        </aside>
      </section>
      <nav className="ode-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-formation-of-differential-equations">
          ← Formation of Differential Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-variable-separable-equations">
          Variable-Separable Equations →
        </Link>
      </nav>
      <div className="ode-complete">
        Classification complete · order identified · degree verified
      </div>
    </main>
  );
}
