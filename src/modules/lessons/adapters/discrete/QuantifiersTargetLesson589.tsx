import { Check, Lightbulb, Target, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./QuantifiersTargetLesson589.css";
type Predicate =
  "positive" | "nonnegative" | "negative" | "zero" | "square4" | "even";
const predicates: Record<
  Predicate,
  { label: string; test: (x: number) => boolean }
> = {
  positive: { label: "x > 0", test: (x) => x > 0 },
  nonnegative: { label: "x ≥ 0", test: (x) => x >= 0 },
  negative: { label: "x < 0", test: (x) => x < 0 },
  zero: { label: "x = 0", test: (x) => x === 0 },
  square4: { label: "x² ≤ 4", test: (x) => x * x <= 4 },
  even: { label: "x is even", test: (x) => x % 2 === 0 },
};
const parse = (text: string) => [
  ...new Set((text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)),
];
const same = (input: string, expected: number[]) => {
  const values = parse(input).sort((a, b) => a - b);
  return (
    values.length === expected.length &&
    values.every((v, i) => v === expected[i])
  );
};
export default function QuantifiersTargetLesson589({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [domainText, setDomainText] = useState("-2,-1,0,1,2,3"),
    [predicate, setPredicate] = useState<Predicate>("positive"),
    [tab, setTab] = useState("Interact"),
    [forallAnswer, setForallAnswer] = useState(""),
    [existsAnswer, setExistsAnswer] = useState(""),
    [witnessAnswer, setWitnessAnswer] = useState(""),
    [counterAnswer, setCounterAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setDomainText("-2,-1,0,1,2,3");
    setPredicate("positive");
    setTab("Interact");
    setForallAnswer("");
    setExistsAnswer("");
    setWitnessAnswer("");
    setCounterAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const domain = useMemo(() => parse(domainText), [domainText]),
    model = predicates[predicate],
    mapped = domain.map((value) => ({ value, holds: model.test(value) })),
    witnesses = mapped.filter((v) => v.holds).map((v) => v.value),
    counterexamples = mapped.filter((v) => !v.holds).map((v) => v.value),
    forall = counterexamples.length === 0 && domain.length > 0,
    exists = witnesses.length > 0,
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    choose = (text: string, p: Predicate) =>
      act(() => {
        setDomainText(text);
        setPredicate(p);
      }),
    check = () =>
      act(() =>
        setGraded(
          forallAnswer === "false" &&
            existsAnswer === "true" &&
            same(witnessAnswer, [-2, 0, 2]) &&
            same(counterAnswer, [-3, -1, 1, 3]),
        ),
      );
  return (
    <section
      className="qt589-page"
      data-testid="discrete-mockup-0646"
      data-object-model="dedicated-finite-domain-quantifier-model"
      data-domain={domain.join(",")}
      data-predicate={predicate}
      data-forall={forall}
      data-exists={exists}
      data-witnesses={witnesses.join(",")}
      data-counterexamples={counterexamples.join(",")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="qt589-hero">
        <b>DISCRETE AND APPLIED MATHEMATICS</b>
        <h1>Quantifiers – Discrete Lab</h1>
        <p>
          <b>Objective:</b> Evaluate and compare ∀x P(x) and ∃x P(x) on a finite
          domain.
        </p>
        <dl>
          <strong>Level: Intermediate-Advanced</strong>
          <strong>Duration: 6-10 min</strong>
          <strong>Topic: Quantifiers (Finite Sets)</strong>
        </dl>
      </header>
      <nav className="qt589-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="qt589-note">
          <b>{tab}:</b> Universal claims need every case; existential claims
          need one witness.
        </p>
      )}
      <div className="qt589-layout">
        <main>
          <section className="qt589-lab">
            <h2>1. Observe → Manipulate</h2>
            <p>Choose a domain, a predicate, then test it.</p>
            <div className="qt589-controls">
              <label>
                Finite domain D
                <input
                  aria-label="Finite quantifier domain"
                  value={domainText}
                  onChange={(e) => {
                    setDomainText(e.target.value);
                    onInteraction();
                  }}
                />
              </label>
              <label>
                Predicate P(x)
                <select
                  aria-label="Finite predicate"
                  value={predicate}
                  onChange={(e) =>
                    act(() => setPredicate(e.target.value as Predicate))
                  }
                >
                  {Object.entries(predicates).map(([id, p]) => (
                    <option key={id} value={id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <h3>Elements (|D| = {domain.length})</h3>
            <div className="chips">
              {domain.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            <table>
              <thead>
                <tr>
                  <th>x ∈ D</th>
                  <th>P(x): {model.label}</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {mapped.map(({ value, holds }) => (
                  <tr key={value}>
                    <td>{value}</td>
                    <td>{model.label.replace(/x/g, String(value))}</td>
                    <td className={holds ? "yes" : "no"}>
                      {holds ? <Check /> : <X />}
                      {holds ? "True" : "False"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Quantifier verdicts</h3>
            <div className="verdicts">
              <article className={forall ? "yes" : "no"}>
                <b>∀x ∈ D, P(x)</b>
                <strong>
                  {forall ? <Check /> : <X />}
                  {String(forall)}
                </strong>
                <p>
                  {forall
                    ? "Every element works"
                    : `Counterexamples: ${counterexamples.join(", ")}`}
                </p>
              </article>
              <article className={exists ? "yes" : "no"}>
                <b>∃x ∈ D, P(x)</b>
                <strong>
                  {exists ? <Check /> : <X />}
                  {String(exists)}
                </strong>
                <p>
                  {exists
                    ? `Witnesses: ${witnesses.join(", ")}`
                    : "No witnesses"}
                </p>
              </article>
            </div>
            <h3>
              Negations <small>(Check correctness)</small>
            </h3>
            <div className="negations">
              <p>
                ¬(∀x P(x)) ⇔ ∃x ¬P(x){" "}
                <b>
                  True <Check />
                </b>
              </p>
              <p>
                ¬(∃x P(x)) ⇔ ∀x ¬P(x){" "}
                <b>
                  True <Check />
                </b>
              </p>
            </div>
            <h3>Quick predicates</h3>
            <div className="quick">
              {(Object.keys(predicates) as Predicate[]).map((id) => (
                <button key={id} onClick={() => act(() => setPredicate(id))}>
                  {predicates[id].label}
                </button>
              ))}
            </div>
            <h3>Domain presets</h3>
            <div className="quick">
              <button onClick={() => choose("-2,-1,0,1,2,3", predicate)}>
                -2,-1,0,1,2,3
              </button>
              <button onClick={() => choose("-3,-2,-1,0,1,2", predicate)}>
                -3,-2,-1,0,1,2
              </button>
              <button onClick={() => choose("0,1,2,3,4", predicate)}>
                0,1,2,3,4
              </button>
            </div>
          </section>
          <section className="qt589-pattern">
            <h2>2. Notice the pattern</h2>
            <article>
              <Lightbulb />
              <p>
                There exist elements making P(x) <b>true</b>:{" "}
                {witnesses.join(", ") || "none"}.
              </p>
              <p>
                There are elements making P(x) <b>false</b>:{" "}
                {counterexamples.join(", ") || "none"}.
              </p>
              <p>
                Hence, ∃x P(x) is <b>{String(exists)}</b> and ∀x P(x) is{" "}
                <b>{String(forall)}</b>.
              </p>
            </article>
          </section>
        </main>
        <aside>
          <section>
            <h2>3. Understand the rule</h2>
            <article>
              <b>Key rule/definition</b>
              <p>∀x ∈ D, P(x) is true if P(x) is true for every x in D.</p>
              <p>
                ∃x ∈ D, P(x) is true if at least one x in D makes P(x) true.
              </p>
              <hr />
              <b>Negations (always true)</b>
              <p>¬∀x P(x) ≡ ∃x ¬P(x)</p>
              <p>¬∃x P(x) ≡ ∀x ¬P(x)</p>
            </article>
            <article className="warning">
              <b>Common misconception</b>
              <p>One true case proves ∃x P(x), but does not prove ∀x P(x).</p>
            </article>
          </section>
          <section className="worked">
            <h2>4. Worked example</h2>
            <p>P(x): x² ≤ 4 on D={`{-3,-2,-1,0,1,2,3}`}</p>
            <table>
              <tbody>
                {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
                  <tr key={x}>
                    <td>{x}</td>
                    <td>{x * x}</td>
                    <td className={x * x <= 4 ? "yes" : "no"}>
                      {String(x * x <= 4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <b>∀ verdict:</b> False; counterexamples -3, 3
            </p>
            <p>
              <b>∃ verdict:</b> True; witnesses -2,-1,0,1,2
            </p>
          </section>
        </aside>
      </div>
      <section className="qt589-practice">
        <div>
          <h2>5. Try independently (Your turn)</h2>
          <p>
            <b>Challenge:</b>
          </p>
          <p>
            Let D={`{-3,-2,-1,0,1,2,3}`}. For P(x): x is even, determine both
            quantifiers and list all witnesses/counterexamples.
          </p>
          <button onClick={check}>Check my answer</button>
        </div>
        <form>
          <label>
            ∀x ∈ D, P(x) is
            <select
              aria-label="Universal challenge answer"
              value={forallAnswer}
              onChange={(e) => setForallAnswer(e.target.value)}
            >
              <option value="">Select</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            ∃x ∈ D, P(x) is
            <select
              aria-label="Existential challenge answer"
              value={existsAnswer}
              onChange={(e) => setExistsAnswer(e.target.value)}
            >
              <option value="">Select</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <label>
            Witnesses
            <input
              aria-label="Quantifier witnesses"
              value={witnessAnswer}
              onChange={(e) => setWitnessAnswer(e.target.value)}
            />
          </label>
          <label>
            Counterexamples
            <input
              aria-label="Quantifier counterexamples"
              value={counterAnswer}
              onChange={(e) => setCounterAnswer(e.target.value)}
            />
          </label>
        </form>
        <aside>
          <Target />
          <b>
            {graded === null
              ? "Submit to see instant feedback"
              : graded
                ? "Correct: all cases classified"
                : "Review every domain element"}
          </b>
        </aside>
      </section>
      <nav className="qt589-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/588-logical-connectives">
          ←{" "}
          <span>
            PREVIOUS<b>Logical Connectives</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/590-proof-methods">
          <span>
            NEXT<b>Proof Methods</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
